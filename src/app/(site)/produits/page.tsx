import Link from "next/link";
import type { Metadata } from "next";
import { getProducts } from "@/lib/data";
import { ProductCard } from "@/components/product/ProductCard";
import { CATEGORIES, categoryLabel } from "@/lib/types";

export const metadata: Metadata = { title: "La boutique" };

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; q?: string }>;
}) {
  const { cat, q } = await searchParams;
  let products = await getProducts(cat);

  if (q) {
    const needle = q.toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(needle) ||
        (p.tagline ?? "").toLowerCase().includes(needle) ||
        (p.short_description ?? "").toLowerCase().includes(needle),
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-8">
        <p className="text-sm text-muted">
          <Link href="/" className="hover:text-blue-deep">Accueil</Link> / Boutique
        </p>
        <h1 className="section-title mt-2 text-4xl sm:text-5xl">
          {cat ? categoryLabel(cat) : "Toute la boutique"}
        </h1>
        {q && (
          <p className="mt-2 text-ink-soft">
            Résultats pour « {q} » — {products.length} produit
            {products.length > 1 ? "s" : ""}
          </p>
        )}
      </header>

      {/* Filtres catégorie */}
      <div className="mb-10 flex flex-wrap gap-2">
        <FilterChip href="/produits" label="Tous" active={!cat} />
        {CATEGORIES.map((c) => (
          <FilterChip
            key={c.value}
            href={`/produits?cat=${c.value}`}
            label={c.label}
            active={cat === c.value}
          />
        ))}
      </div>

      {products.length === 0 ? (
        <p className="py-20 text-center text-ink-soft">
          Aucun produit ne correspond à votre recherche.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full border px-5 py-2 text-sm transition-colors ${
        active
          ? "border-blue-deep bg-blue-deep text-white"
          : "border-line bg-white text-ink-soft hover:border-blue"
      }`}
    >
      {label}
    </Link>
  );
}
