"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import type { CartItem } from "@/context/CartContext";
import { computeShipping } from "@/lib/shipping";
import { geocodeAddress, distanceMeters } from "@/lib/geo";
import {
  getDeliveryPlan,
  type DeliveryConfig,
  type DeliveryMethodId,
  type PaymentMethod,
  type DeliveryPlan,
} from "@/lib/delivery";
import { createCheckoutSession } from "@/lib/stripe";

function randomCode(n: number): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < n; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

function toConfig(s: Record<string, unknown>): DeliveryConfig {
  return {
    shipping_fee: Number(s.shipping_fee ?? 0),
    free_shipping_threshold:
      s.free_shipping_threshold == null ? null : Number(s.free_shipping_threshold),
    tax_rate: Number(s.tax_rate ?? 0),
    local_delivery_enabled: !!s.local_delivery_enabled,
    carrier_enabled: !!s.carrier_enabled,
    cash_enabled: !!s.cash_enabled,
    stripe_enabled: !!s.stripe_enabled,
    carrier_name: String(s.carrier_name ?? "Mondial Relay"),
  };
}

/** Géocode l'adresse, détermine la zone et renvoie les options disponibles. */
export async function planDelivery(
  address: string,
  subtotal: number,
): Promise<{ plan: DeliveryPlan; inZone: boolean; geoLabel: string | null }> {
  const supabase = await createClient();
  const { data: s } = await supabase.from("site_settings").select("*").eq("id", 1).single();
  if (!s) return { plan: { legacy: true, options: [] }, inZone: false, geoLabel: null };

  let inZone = false;
  let geoLabel: string | null = null;
  if (address.trim() && s.team_lat != null && s.team_lng != null && s.local_delivery_enabled) {
    const geo = await geocodeAddress(address);
    if (geo) {
      geoLabel = geo.label;
      const d = distanceMeters(geo.lat, geo.lng, s.team_lat, s.team_lng);
      inZone = d <= (s.local_radius_m ?? 0);
    }
  }

  return { plan: getDeliveryPlan(toConfig(s), inZone, subtotal), inZone, geoLabel };
}

export type OrderPayload = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  postal_code: string;
  city: string;
  note: string;
  meetup_point: string;
  delivery_method: DeliveryMethodId;
  payment_method: PaymentMethod;
  items: CartItem[];
};

export async function submitOrder(payload: OrderPayload) {
  if (!payload.items.length) return { ok: false as const, error: "Votre panier est vide." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: s } = await supabase.from("site_settings").select("*").eq("id", 1).single();
  if (!s) return { ok: false as const, error: "Configuration indisponible." };

  const subtotal = payload.items.reduce((acc, i) => acc + i.price * i.quantity, 0);

  // Zone + géocodage (autorité serveur)
  let inZone = false;
  let lat: number | null = null;
  let lng: number | null = null;
  const fullAddress = [payload.address, payload.postal_code, payload.city].filter(Boolean).join(" ");
  if (payload.delivery_method !== "meetup" && fullAddress.trim()) {
    const geo = await geocodeAddress(fullAddress);
    if (geo) {
      lat = geo.lat;
      lng = geo.lng;
      if (s.team_lat != null && s.team_lng != null) {
        inZone = distanceMeters(geo.lat, geo.lng, s.team_lat, s.team_lng) <= (s.local_radius_m ?? 0);
      }
    }
  }

  const plan = getDeliveryPlan(toConfig(s), inZone, subtotal);
  const option = plan.options.find((o) => o.method === payload.delivery_method);
  if (!option || !option.payments.includes(payload.payment_method)) {
    return { ok: false as const, error: "Ce mode de livraison/paiement n'est pas disponible." };
  }

  const shipping = option.fee;
  const total = subtotal + shipping;
  const id = crypto.randomUUID();
  const reference = "BC-" + randomCode(6);

  const { error } = await supabase.from("order_requests").insert({
    id,
    reference,
    first_name: payload.first_name,
    last_name: payload.last_name,
    email: payload.email,
    phone: payload.phone || null,
    address: payload.address || null,
    postal_code: payload.postal_code || null,
    city: payload.city || null,
    note: payload.note || null,
    meetup_point: payload.meetup_point || null,
    delivery_method: payload.delivery_method,
    payment_method: payload.payment_method,
    payment_status: "pending",
    delivery_lat: lat,
    delivery_lng: lng,
    in_local_zone: inZone,
    total,
    shipping_fee: shipping,
    user_id: user?.id ?? null,
  });
  if (error) return { ok: false as const, error: "Une erreur est survenue. Réessayez." };

  const items = payload.items.map((i) => ({
    request_id: id,
    product_id: i.productId,
    variant_id: i.variantId,
    product_name: i.name,
    variant_name: i.variantName,
    unit_price: i.price,
    quantity: i.quantity,
  }));
  await supabase.from("order_request_items").insert(items);

  // Décrémente le stock des variantes commandées
  for (const i of payload.items) {
    if (i.variantId) {
      await supabase.rpc("decrement_stock", { p_variant_id: i.variantId, p_qty: i.quantity });
    }
  }

  // Paiement carte → Stripe Checkout
  if (payload.payment_method === "card" && s.stripe_enabled) {
    const hdrs = await headers();
    const origin = hdrs.get("origin") ?? `https://${hdrs.get("host")}`;
    const session = await createCheckoutSession({
      items: payload.items,
      shipping,
      email: payload.email,
      reference,
      successUrl: `${origin}/suivi/${reference}?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${origin}/panier`,
    });
    if (session?.url) {
      await supabase
        .from("order_requests")
        .update({ stripe_session_id: session.id })
        .eq("id", id);
      return { ok: true as const, reference, stripeUrl: session.url };
    }
    // Si Stripe indisponible, on retombe sur une commande à régler manuellement
  }

  return { ok: true as const, reference };
}

/* ---------- Mode "demande sans paiement" (legacy, modules désactivés) ---------- */
export type RequestPayload = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  postal_code: string;
  city: string;
  note: string;
  items: CartItem[];
};

export async function submitRequest(payload: RequestPayload) {
  if (!payload.items.length) return { ok: false as const, error: "Votre panier est vide." };
  const supabase = await createClient();
  const subtotal = payload.items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("shipping_fee, free_shipping_threshold, tax_rate")
    .eq("id", 1)
    .single();
  const shipping = computeShipping(subtotal, settings ?? null);
  const total = subtotal + shipping;
  const id = crypto.randomUUID();
  const reference = "BC-" + randomCode(6);

  const { error } = await supabase.from("order_requests").insert({
    id,
    reference,
    first_name: payload.first_name,
    last_name: payload.last_name,
    email: payload.email,
    phone: payload.phone || null,
    address: payload.address || null,
    postal_code: payload.postal_code || null,
    city: payload.city || null,
    note: payload.note || null,
    total,
    shipping_fee: shipping,
    user_id: user?.id ?? null,
  });
  if (error) return { ok: false as const, error: "Une erreur est survenue. Réessayez." };

  const items = payload.items.map((i) => ({
    request_id: id,
    product_id: i.productId,
    variant_id: i.variantId,
    product_name: i.name,
    variant_name: i.variantName,
    unit_price: i.price,
    quantity: i.quantity,
  }));
  await supabase.from("order_request_items").insert(items);

  // Décrémente le stock des variantes commandées
  for (const i of payload.items) {
    if (i.variantId) {
      await supabase.rpc("decrement_stock", { p_variant_id: i.variantId, p_qty: i.quantity });
    }
  }
  return { ok: true as const, reference };
}
