import { computeShipping } from "@/lib/shipping";

export type PaymentMethod = "card" | "cash";
export type DeliveryMethodId = "local" | "carrier" | "meetup";

/** Sous-ensemble des réglages nécessaires au tunnel de commande (côté client & serveur). */
export type DeliveryConfig = {
  shipping_fee: number;
  free_shipping_threshold: number | null;
  tax_rate: number;
  local_delivery_enabled: boolean;
  carrier_enabled: boolean;
  cash_enabled: boolean;
  stripe_enabled: boolean;
  carrier_name: string;
};

export type DeliveryOption = {
  method: DeliveryMethodId;
  title: string;
  description: string;
  fee: number;
  payments: PaymentMethod[];
};

export type DeliveryPlan = {
  /** true = aucun module avancé activé → on garde le mode "demande sans paiement". */
  legacy: boolean;
  options: DeliveryOption[];
};

export function deliverySystemActive(s: DeliveryConfig | null): boolean {
  if (!s) return false;
  return !!(s.local_delivery_enabled || s.carrier_enabled || s.stripe_enabled);
}

export function getDeliveryPlan(
  s: DeliveryConfig | null,
  inLocalZone: boolean,
  subtotal: number,
): DeliveryPlan {
  if (!s || !deliverySystemActive(s)) {
    return { legacy: true, options: [] };
  }

  const cardOk = !!s.stripe_enabled;
  const cashOk = !!s.cash_enabled;
  const basePayments: PaymentMethod[] = [
    ...(cardOk ? (["card"] as PaymentMethod[]) : []),
    ...(cashOk ? (["cash"] as PaymentMethod[]) : []),
  ];

  const options: DeliveryOption[] = [];

  if (s.local_delivery_enabled && inLocalZone) {
    options.push({
      method: "local",
      title: "Livraison par l'équipe Beauty Concept",
      description: "Vous êtes dans notre zone : on vous livre à domicile, gratuitement.",
      fee: 0,
      payments: basePayments.length ? basePayments : ["cash"],
    });
  }

  if (s.carrier_enabled) {
    options.push({
      method: "carrier",
      title: `Livraison ${s.carrier_name}`,
      description: "Livraison en point relais. Frais au tarif réel, sans marge.",
      fee: computeShipping(subtotal, s),
      payments: cardOk ? ["card"] : [],
    });
  }

  options.push({
    method: "meetup",
    title: "Remise en main propre / point de rencontre",
    description: "On convient ensemble d'un lieu de rencontre. Aucun frais de livraison.",
    fee: 0,
    payments: basePayments.length ? basePayments : ["cash"],
  });

  return { legacy: false, options: options.filter((o) => o.payments.length > 0) };
}

export const DELIVERY_LABELS: Record<string, string> = {
  local: "Livraison équipe (zone locale)",
  carrier: "Point relais",
  meetup: "Remise en main propre",
};

export const PAYMENT_LABELS: Record<string, string> = {
  card: "Carte bancaire",
  cash: "Espèces",
};
