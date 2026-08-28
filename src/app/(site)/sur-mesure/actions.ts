"use server";

import { createClient } from "@/lib/supabase/server";

export type CustomPayload = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  hair_type: string;
  hair_concerns: string;
  description: string;
  budget: string;
};

export async function submitCustomRequest(payload: CustomPayload) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const reference = "SM-" + randomCode(6);
  const { error } = await supabase.from("custom_product_requests").insert({
    reference,
    first_name: payload.first_name,
    last_name: payload.last_name,
    email: payload.email,
    phone: payload.phone || null,
    hair_type: payload.hair_type || null,
    hair_concerns: payload.hair_concerns || null,
    description: payload.description,
    budget: payload.budget || null,
    user_id: user?.id ?? null,
  });

  if (error) {
    return { ok: false as const, error: "Une erreur est survenue. Réessayez." };
  }
  return { ok: true as const, reference };
}

function randomCode(n: number): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < n; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}
