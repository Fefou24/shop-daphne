import { publicDb } from "@/lib/supabase/public";
import type {
  Product,
  ProductWithVariants,
  Review,
  SiteSettings,
} from "@/lib/types";

// Lectures publiques via un client sans cookies → pages statiques (ISR).
export async function getSettings(): Promise<SiteSettings | null> {
  const { data } = await publicDb.from("site_settings").select("*").eq("id", 1).single();
  return data;
}

export async function getProducts(category?: string): Promise<Product[]> {
  let query = publicDb
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  if (category) query = query.eq("category", category);
  const { data } = await query;
  return data ?? [];
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const { data } = await publicDb
    .from("products")
    .select("*")
    .eq("is_active", true)
    .eq("is_featured", true)
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getProductBySlug(slug: string): Promise<ProductWithVariants | null> {
  const { data } = await publicDb
    .from("products")
    .select("*, product_variants(*)")
    .eq("slug", slug)
    .single();
  if (!data) return null;
  (data as ProductWithVariants).product_variants?.sort(
    (a, b) => a.sort_order - b.sort_order,
  );
  return data as ProductWithVariants;
}

export async function getProductReviews(productId: string): Promise<Review[]> {
  const { data } = await publicDb
    .from("reviews")
    .select("*")
    .eq("product_id", productId)
    .eq("is_approved", true)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getApprovedReviews(limit = 8): Promise<Review[]> {
  const { data } = await publicDb
    .from("reviews")
    .select("*")
    .eq("is_approved", true)
    .order("created_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}
