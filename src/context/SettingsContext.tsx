"use client";

import { createContext, useContext } from "react";
import type { DeliveryConfig } from "@/lib/delivery";

const SettingsContext = createContext<DeliveryConfig | null>(null);

export function SettingsProvider({
  value,
  children,
}: {
  value: DeliveryConfig | null;
  children: React.ReactNode;
}) {
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

/** Configuration livraison/paiement (frais, modules activés…). */
export function useShipping() {
  return useContext(SettingsContext);
}
