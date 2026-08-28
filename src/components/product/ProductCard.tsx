import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { productImages } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { Stars } from "@/components/ui/Stars";

export function ProductCard({ product }: { product: Product }) {
  const img = productImages(product)[0] ?? "/images/brand/logo.png";
  return (
    <Link href={`/produit/${product.slug}`} className="group block">
      <div className="relative aspect-square overflow-hidden rounded-3xl bg-cream-deep">
        <Image
          src={img}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.is_new && (
          <span className="absolute left-3 top-3 rounded-full bg-blue-deep px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-white">
            Nouveau
          </span>
        )}
      </div>
      <div className="mt-4 space-y-1">
        <h3 className="font-serif text-xl font-semibold text-ink">
          {product.name}
        </h3>
        {product.tagline && (
          <p className="line-clamp-1 text-sm text-ink-soft">{product.tagline}</p>
        )}
        <div className="flex items-center gap-2 pt-1">
          <Stars rating={product.rating} size={15} />
          <span className="text-xs text-muted">
            {product.rating.toFixed(1)}
            {product.reviews_count > 0 && ` (${product.reviews_count})`}
          </span>
        </div>
        <p className="pt-1 text-lg font-semibold text-ink">
          {formatPrice(product.base_price, product.currency)}
        </p>
      </div>
    </Link>
  );
}
