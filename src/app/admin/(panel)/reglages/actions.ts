"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/auth";
import { geocodeAddress } from "@/lib/geo";

export type ShippingSettingsInput = {
  shipping_fee: number;
  free_shipping_threshold: number | null;
  carrier_name: string;
  team_address: string;
  local_radius_m: number;
};

export async function saveShippingSettings(input: ShippingSettingsInput) {
  const supabase = await createClient();

  // Géocodage de l'adresse de l'équipe (zone locale)
  let team_lat: number | null = null;
  let team_lng: number | null = null;
  let geocodeError = false;
  if (input.team_address.trim()) {
    const geo = await geocodeAddress(input.team_address);
    if (geo) {
      team_lat = geo.lat;
      team_lng = geo.lng;
    } else {
      geocodeError = true;
    }
  }

  const { error } = await supabase
    .from("site_settings")
    .update({
      shipping_fee: input.shipping_fee,
      free_shipping_threshold: input.free_shipping_threshold,
      carrier_name: input.carrier_name || "Mondial Relay",
      team_address: input.team_address || null,
      team_lat,
      team_lng,
      local_radius_m: input.local_radius_m,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);

  if (error) return { ok: false as const, error: error.message };
  await logActivity("shipping_settings_updated");
  revalidatePath("/", "layout");
  revalidatePath("/admin/reglages");
  return { ok: true as const, geocodeError };
}
