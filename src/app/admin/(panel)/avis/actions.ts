"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function recomputeProductRating(productId: string | null) {
  if (!productId) return;
  const supabase = await createClient();
  const { data } = await supabase
    .from("reviews")
    .select("rating")
    .eq("product_id", productId)
    .eq("is_approved", true);
  const ratings = (data ?? []).map((r) => r.rating);
  const count = ratings.length;
  const avg = count ? ratings.reduce((s, r) => s + r, 0) / count : 5;
  await supabase
    .from("products")
    .update({ reviews_count: count, rating: Math.round(avg * 10) / 10 })
    .eq("id", productId);
}

export async function approveReview(id: string, productId: string | null) {
  const supabase = await createClient();
  await supabase.from("reviews").update({ is_approved: true }).eq("id", id);
  await recomputeProductRating(productId);
  revalidatePath("/admin/avis");
  revalidatePath("/admin");
  if (productId) revalidatePath("/produit");
}

export async function deleteReview(id: string, productId: string | null) {
  const supabase = await createClient();
  await supabase.from("reviews").delete().eq("id", id);
  await recomputeProductRating(productId);
  revalidatePath("/admin/avis");
  revalidatePath("/admin");
}
