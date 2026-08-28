import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/format";
import { productImages, categoryLabel } from "@/lib/types";
import { PageHeader, Badge } from "@/components/admin/ui";

export default async function AdminProductsPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <PageHeader title="Produits" subtitle="Gérez votre catalogue.">
        <Link href="/admin/produits/nouveau" className="btn btn-primary px-5 py-2.5 text-sm">
          + Nouveau produit
        </Link>
      </PageHeader>

      <div className="space-y-3">
        {(products ?? []).map((p) => {
          const img = productImages(p)[0];
          return (
            <Link
              key={p.id}
              href={`/admin/produits/${p.id}`}
              className="flex items-center gap-4 rounded-2xl border border-line bg-white p-3 transition-colors hover:border-blue"
            >
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-cream-deep">
                {img && <Image src={img} alt={p.name} fill className="object-cover" sizes="64px" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-ink">{p.name}</p>
                <p className="text-sm text-muted">{categoryLabel(p.category)}</p>
              </div>
              <div className="hidden text-right sm:block">
                <p className="font-medium text-ink">{formatPrice(p.base_price)}</p>
              </div>
              <Badge tone={p.is_active ? "blue" : "neutral"}>{p.is_active ? "Visible" : "Masqué"}</Badge>
            </Link>
          );
        })}
        {(!products || products.length === 0) && (
          <p className="rounded-2xl border border-line bg-white p-6 text-ink-soft">
            Aucun produit. Créez-en un avec le bouton ci-dessus.
          </p>
        )}
      </div>
    </div>
  );
}
