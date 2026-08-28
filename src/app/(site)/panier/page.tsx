"use client";

import { useShipping } from "@/context/SettingsContext";
import { deliverySystemActive } from "@/lib/delivery";
import { AdvancedCheckout } from "@/components/checkout/AdvancedCheckout";
import { LegacyCheckout } from "@/components/checkout/LegacyCheckout";

export default function CartPage() {
  const config = useShipping();
  return deliverySystemActive(config) ? <AdvancedCheckout /> : <LegacyCheckout />;
}
