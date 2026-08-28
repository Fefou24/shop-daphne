import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getProductBySlug,
  getProductReviews,
  getProducts,
} from "@/lib/data";
import { ProductPurchase } from "@/components/product/ProductPurchase";
import { Accordion } from "@/components/product/Accordion";
import { ReviewForm } from "@/components/product/ReviewForm";
import { ProductCard } from "@/components/product/ProductCard";
import { Stars } from "@/components/ui/Stars";
import { formatDate } from "@/lib/format";

export const revalidate = 300;

export async function generateStaticParams() {
  const { publicDb } = await import("@/lib/supabase/public");
  const { data } = await publicDb.from("products").select("slug").eq("is_active", true);
  return (data ?? []).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Produit introuvable" };
  return {
    title: product.name,
    description: product.short_description ?? product.tagline ?? undefined,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product || !product.is_active) notFound();

  const [reviews, all] = await Promise.all([
    getProductReviews(product.id),
    getProducts(),
  ]);
  const related = all.filter((p) => p.id !== product.id).slice(0, 4);

  const accordionItems = [
    product.description && { title: "Description", content: product.description },
    product.usage_instructions && {
      title: "Mode d'emploi",
      content: product.usage_instructions,
    },
    product.precautions && {
      title: "Précautions & conditions d'utilisation",
      content: product.precautions,
    },
    product.ingredients_note && {
      title: "Ingrédients",
      content: product.ingredients_note,
    },
  ].filter(Boolean) as { title: string; content: string }[];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <p className="mb-8 text-sm text-muted">
        <Link href="/" className="hover:text-blue-deep">Accueil</Link> /{" "}
        <Link href="/produits" className="hover:text-blue-deep">Boutique</Link> /{" "}
        <span className="text-ink-soft">{product.name}</span>
      </p>

      <ProductPurchase product={product} />

      {/* Détails */}
      <div className="mx-auto mt-16 max-w-3xl">
        <Accordion items={accordionItems} />
      </div>

      {/* Avis */}
      <section className="mx-auto mt-16 max-w-3xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h2 className="section-title text-3xl">
            Avis clientes{" "}
            <span className="text-muted">({reviews.length})</span>
          </h2>
          <ReviewForm productId={product.id} />
        </div>

        {reviews.length === 0 ? (
          <p className="text-ink-soft">
            Aucun avis pour le moment. Soyez la première à donner le vôtre !
          </p>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r.id} className="rounded-2xl border border-line bg-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-ink">{r.author_name}</p>
                    {r.location && (
                      <p className="text-xs text-muted">{r.location}</p>
                    )}
                  </div>
                  <Stars rating={r.rating} />
                </div>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                  {r.comment}
                </p>
                <p className="mt-2 text-xs text-muted">{formatDate(r.created_at)}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Produits liés */}
      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="section-title mb-8 text-center text-4xl">
            Vous aimerez aussi
          </h2>
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
