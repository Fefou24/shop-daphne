"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateCustomStatus(id: string, status: string) {
  const supabase = await createClient();
  await supabase.from("custom_product_requests").update({ status }).eq("id", id);
  revalidatePath("/admin/sur-mesure");
}
