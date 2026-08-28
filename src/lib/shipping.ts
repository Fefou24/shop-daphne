export type ShippingConfig = {
  shipping_fee: number;
  free_shipping_threshold: number | null;
  tax_rate: number;
};

export function computeShipping(subtotal: number, cfg: ShippingConfig | null): number {
  if (!cfg) return 0;
  if (cfg.free_shipping_threshold != null && subtotal >= cfg.free_shipping_threshold) {
    return 0;
  }
  return Number(cfg.shipping_fee) || 0;
}
