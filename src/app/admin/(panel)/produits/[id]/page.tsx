import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProductForm } from "@/components/admin/ProductForm";
import { productImages } from "@/lib/types";
import type { ProductInput } from "@/app/admin/(panel)/produits/actions";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: product } = await supabase
    .from("products")
    .select("*, product_variants(*)")
    .eq("id", id)
    .single();

  if (!product) notFound();

  const variants = (product.product_variants ?? [])
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((v) => ({
      id: v.id,
      name: v.name,
      price: Number(v.price),
      stock: v.stock,
      is_active: v.is_active,
    }));

  const initial: Partial<ProductInput> & { id: string } = {
    id: product.id,
    slug: product.slug,
    name: product.name,
    tagline: product.tagline ?? "",
    category: product.category,
    short_description: product.short_description ?? "",
    description: product.description ?? "",
    usage_instructions: product.usage_instructions ?? "",
    precautions: product.precautions ?? "",
    ingredients_note: product.ingredients_note ?? "",
    base_price: Number(product.base_price),
    images: productImages(product),
    is_active: product.is_active,
    is_featured: product.is_featured,
    is_new: product.is_new,
    variants,
  };

  return (
    <div>
      <Link href="/admin/produits" className="text-sm text-blue-deep hover:underline">
        ← Retour aux produits
      </Link>
      <h1 className="mb-6 mt-2 font-serif text-3xl font-semibold text-ink">
        {product.name}
      </h1>
      <ProductForm initial={initial} />
    </div>
  );
}
