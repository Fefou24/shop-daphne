import Stripe from "stripe";
import type { CartItem } from "@/context/CartContext";

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

export async function createCheckoutSession(params: {
  items: CartItem[];
  shipping: number;
  email: string;
  reference: string;
  successUrl: string;
  cancelUrl: string;
}): Promise<{ id: string; url: string | null } | null> {
  const stripe = getStripe();
  if (!stripe) return null;

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = params.items.map((i) => ({
    price_data: {
      currency: "eur",
      product_data: {
        name: i.name + (i.variantName ? ` (${i.variantName})` : ""),
      },
      unit_amount: Math.round(i.price * 100),
    },
    quantity: i.quantity,
  }));

  if (params.shipping > 0) {
    line_items.push({
      price_data: {
        currency: "eur",
        product_data: { name: "Frais de livraison" },
        unit_amount: Math.round(params.shipping * 100),
      },
      quantity: 1,
    });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items,
    customer_email: params.email,
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: { reference: params.reference },
  });

  return { id: session.id, url: session.url };
}

/**
 * Réconcilie les commandes payées par carte mais encore "pending" :
 * vérifie chez Stripe et marque payé. Met aussi à jour les objets en mémoire
 * pour un affichage immédiat correct.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export async function reconcileStripeOrders(supabase: any, orders: any[]): Promise<void> {
  if (!getStripe()) return;
  const pending = orders.filter(
    (o) => o.stripe_session_id && o.payment_status !== "paid",
  );
  await Promise.all(
    pending.slice(0, 20).map(async (o) => {
      if (await isSessionPaid(o.stripe_session_id)) {
        await supabase.rpc("mark_order_paid", { p_session_id: o.stripe_session_id });
        o.is_paid = true;
        o.payment_status = "paid";
      }
    }),
  );
}

/** Vérifie côté serveur qu'une session Checkout est bien payée (fallback sans webhook). */
export async function isSessionPaid(sessionId: string): Promise<boolean> {
  const stripe = getStripe();
  if (!stripe) return false;
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return session.payment_status === "paid";
  } catch {
    return false;
  }
}
