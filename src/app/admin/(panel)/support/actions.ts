"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateTicketStatus(id: string, status: string) {
  const supabase = await createClient();
  await supabase.from("support_tickets").update({ status }).eq("id", id);
  revalidatePath("/admin/support");
  revalidatePath(`/admin/support/${id}`);
}
