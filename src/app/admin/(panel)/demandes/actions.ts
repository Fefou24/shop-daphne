"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/auth";
import type { Enums } from "@/lib/database.types";

export async function updateRequestStatus(
  id: string,
  status: Enums<"order_status">,
) {
  const supabase = await createClient();
  await supabase
    .from("order_requests")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);
  await supabase.from("order_status_history").insert({ request_id: id, status });
  await logActivity("order_status", status);
  revalidatePath("/admin/demandes");
  revalidatePath(`/admin/demandes/${id}`);
  revalidatePath("/admin");
}

export async function togglePaid(id: string, value: boolean) {
  const supabase = await createClient();
  await supabase
    .from("order_requests")
    .update({
      is_paid: value,
      paid_at: value ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  await logActivity("order_paid", value ? "payé" : "non payé");
  revalidatePath(`/admin/demandes/${id}`);
  revalidatePath("/admin/demandes");
}

export async function setEstimatedDelivery(id: string, date: string | null) {
  const supabase = await createClient();
  await supabase
    .from("order_requests")
    .update({ estimated_delivery: date || null, updated_at: new Date().toISOString() })
    .eq("id", id);
  revalidatePath(`/admin/demandes/${id}`);
}
