"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/auth";

export type SettingsInput = {
  maintenance_mode: boolean;
  maintenance_message: string;
  promo_bar_enabled: boolean;
  promo_bar_text: string;
  contact_email: string;
  contact_phone: string;
  whatsapp_url: string;
  instagram_url: string;
  facebook_url: string;
  tiktok_url: string;
  stripe_enabled: boolean;
  local_delivery_enabled: boolean;
  carrier_enabled: boolean;
  cash_enabled: boolean;
};

export async function saveSettings(input: SettingsInput) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("site_settings")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", 1);
  if (error) return { ok: false as const, error: error.message };
  await logActivity("settings_updated");
  revalidatePath("/", "layout");
  revalidatePath("/super-admin");
  return { ok: true as const };
}

export async function toggleMaintenance(value: boolean) {
  const supabase = await createClient();
  await supabase.from("site_settings").update({ maintenance_mode: value }).eq("id", 1);
  await logActivity(value ? "maintenance_on" : "maintenance_off");
  revalidatePath("/", "layout");
  revalidatePath("/super-admin");
}

/* ---------- Gestion des comptes (nécessite la clé service_role) ---------- */

export async function createStaffAccount(input: {
  email: string;
  password: string;
  full_name: string;
  role: "admin" | "super_admin";
}) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return {
      ok: false as const,
      error:
        "La clé SUPABASE_SERVICE_ROLE_KEY n'est pas configurée. Ajoutez-la dans les variables d'environnement pour créer des comptes.",
    };
  }
  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.createUser({
    email: input.email,
    password: input.password,
    email_confirm: true,
    user_metadata: { full_name: input.full_name, role: input.role },
  });
  if (error || !data.user) {
    return { ok: false as const, error: error?.message ?? "Erreur de création." };
  }
  // S'assure que le rôle/profil est correct
  await admin
    .from("profiles")
    .update({ role: input.role, full_name: input.full_name })
    .eq("id", data.user.id);

  await logActivity("staff_created", input.email);
  revalidatePath("/super-admin/comptes");
  return { ok: true as const };
}

export async function updateStaffRole(
  userId: string,
  role: "client" | "admin" | "super_admin",
) {
  const supabase = await createClient();
  await supabase.from("profiles").update({ role }).eq("id", userId);
  await logActivity("staff_role_updated", `${userId} → ${role}`);
  revalidatePath("/super-admin/comptes");
}

export async function deleteStaffAccount(userId: string) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return { ok: false as const, error: "Clé service_role non configurée." };
  }
  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(userId);
  if (error) return { ok: false as const, error: error.message };
  await logActivity("staff_deleted", userId);
  revalidatePath("/super-admin/comptes");
  return { ok: true as const };
}
