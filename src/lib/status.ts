import type { Enums } from "@/lib/database.types";

export type OrderStatus = Enums<"order_status">;

/** Étapes du parcours de commande, dans l'ordre (hors annulation). */
export const ORDER_FLOW: { value: OrderStatus; label: string; short: string; icon: string }[] = [
  { value: "prise_en_compte", label: "Commande prise en compte", short: "Prise en compte", icon: "📝" },
  { value: "en_fabrication", label: "Produit en fabrication", short: "En fabrication", icon: "🧪" },
  { value: "en_livraison", label: "Produit en cours de livraison", short: "En livraison", icon: "🚚" },
  { value: "livree", label: "Commande livrée", short: "Livrée", icon: "✅" },
];

type StatusTone = "blue" | "green" | "amber" | "rose" | "neutral";

export const ORDER_STATUSES: { value: OrderStatus; label: string; color: string; tone: StatusTone }[] = [
  { value: "prise_en_compte", label: "Prise en compte", color: "bg-blue-soft text-blue-deep", tone: "blue" },
  { value: "en_fabrication", label: "En fabrication", color: "bg-[#f4e7c9] text-[#8a6d2f]", tone: "amber" },
  { value: "en_livraison", label: "En livraison", color: "bg-[#d9e8d4] text-[#3f6b3a]", tone: "green" },
  { value: "livree", label: "Livrée", color: "bg-[#cfe6d6] text-[#2f7a4a]", tone: "green" },
  { value: "annulee", label: "Annulée", color: "bg-blush-soft text-ink", tone: "rose" },
];

export function statusMeta(value: string) {
  return ORDER_STATUSES.find((s) => s.value === value) ?? ORDER_STATUSES[0];
}

/** Index de l'étape courante dans le flux (−1 si annulée). */
export function flowIndex(status: OrderStatus): number {
  if (status === "annulee") return -1;
  return ORDER_FLOW.findIndex((s) => s.value === status);
}

export const CUSTOM_STATUSES: { value: string; label: string; color: string }[] = [
  { value: "nouvelle", label: "Nouvelle", color: "bg-blue-soft text-blue-deep" },
  { value: "en_cours", label: "En cours", color: "bg-[#f4e7c9] text-[#8a6d2f]" },
  { value: "traitee", label: "Traitée", color: "bg-[#cfe6d6] text-[#2f7a4a]" },
  { value: "annulee", label: "Annulée", color: "bg-blush-soft text-ink" },
];

export function customStatusMeta(value: string) {
  return CUSTOM_STATUSES.find((s) => s.value === value) ?? CUSTOM_STATUSES[0];
}
