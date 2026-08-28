"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/auth";

export type VariantInput = {
  id?: string;
  name: string;
  price: number;
  stock: number;
  is_active: boolean;
};

export type ProductInput = {
  id?: string;
  slug: string;
  name: string;
  tagline: string;
  category: string;
  short_description: string;
  description: string;
  usage_instructions: string;
  precautions: string;
  ingredients_note: string;
  base_price: number;
  images: string[];
  is_active: boolean;
  is_featured: boolean;
  is_new: boolean;
  variants: VariantInput[];
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function saveProduct(input: ProductInput) {
  const supabase = await createClient();

  const slug = input.slug ? slugify(input.slug) : slugify(input.name);
  const row = {
    slug,
    name: input.name,
    tagline: input.tagline || null,
    category: input.category,
    short_description: input.short_description || null,
    description: input.description || null,
    usage_instructions: input.usage_instructions || null,
    precautions: input.precautions || null,
    ingredients_note: input.ingredients_note || null,
    base_price: input.base_price,
    images: input.images,
    is_active: input.is_active,
    is_featured: input.is_featured,
    is_new: input.is_new,
  };

  let productId = input.id;

  if (productId) {
    const { error } = await supabase.from("products").update(row).eq("id", productId);
    if (error) return { ok: false as const, error: error.message };
  } else {
    const { data, error } = await supabase
      .from("products")
      .insert(row)
      .select("id")
      .single();
    if (error || !data) return { ok: false as const, error: error?.message ?? "Erreur" };
    productId = data.id;
  }

  // Remplace les variantes
  await supabase.from("product_variants").delete().eq("product_id", productId);
  if (input.variants.length) {
    const { error: vErr } = await supabase.from("product_variants").insert(
      input.variants.map((v, i) => ({
        product_id: productId,
        name: v.name,
        price: v.price,
        stock: v.stock,
        is_active: v.is_active,
        sort_order: i,
      })),
    );
    if (vErr) return { ok: false as const, error: vErr.message };
  }

  await logActivity("product_saved", input.name);
  revalidatePath("/admin/produits");
  revalidatePath("/produits");
  revalidatePath(`/produit/${slug}`);
  return { ok: true as const, id: productId };
}

export async function deleteProduct(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return { ok: false as const, error: error.message };
  await logActivity("product_deleted", id);
  revalidatePath("/admin/produits");
  revalidatePath("/produits");
  return { ok: true as const };
}

export async function toggleProductActive(id: string, value: boolean) {
  const supabase = await createClient();
  await supabase.from("products").update({ is_active: value }).eq("id", id);
  revalidatePath("/admin/produits");
  revalidatePath("/produits");
}

export async function createProductAndEdit() {
  redirect("/admin/produits/nouveau");
}
