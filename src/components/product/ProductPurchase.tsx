"use client";

import Image from "next/image";
import { useState } from "react";
import type { ProductWithVariants } from "@/lib/types";
import { productImages } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/context/CartContext";
import { Stars } from "@/components/ui/Stars";
import { CheckIcon } from "@/components/ui/icons";

export function ProductPurchase({ product }: { product: ProductWithVariants }) {
  const images = productImages(product);
  const variants = (product.product_variants ?? []).filter((v) => v.is_active);
  const [activeImg, setActiveImg] = useState(images[0] ?? "/images/brand/logo.png");
  const [variantId, setVariantId] = useState(variants[0]?.id ?? null);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const selected = variants.find((v) => v.id === variantId);
  const price = selected?.price ?? product.base_price;
  const outOfStock = selected ? selected.stock <= 0 : false;

  function handleAdd() {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      variantId: selected?.id ?? null,
      variantName: selected?.name ?? null,
      price,
      image: images[0] ?? null,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
      {/* Galerie */}
      <div className="flex flex-col-reverse gap-4 sm:flex-row">
        <div className="flex gap-3 sm:flex-col">
          {images.map((img) => (
            <button
              key={img}
              onClick={() => setActiveImg(img)}
              className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 transition-colors ${
                activeImg === img ? "border-blue-deep" : "border-transparent"
              }`}
            >
              <Image src={img} alt={product.name} fill className="object-cover" />
            </button>
          ))}
        </div>
        <div className="relative aspect-square flex-1 overflow-hidden rounded-3xl bg-cream-deep">
          <Image
            src={activeImg}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 45vw"
            className="object-cover"
          />
        </div>
      </div>

      {/* Infos achat */}
      <div>
        <h1 className="font-serif text-4xl font-semibold text-ink sm:text-5xl">
          {product.name}
        </h1>
        {product.tagline && (
          <p className="mt-1 text-lg italic text-blue-deep">{product.tagline}</p>
        )}
        <div className="mt-3 flex items-center gap-2">
          <Stars rating={product.rating} />
          <span className="text-sm text-muted">
            {product.rating.toFixed(1)}
            {product.reviews_count > 0 && ` · ${product.reviews_count} avis`}
          </span>
        </div>

        <p className="mt-5 font-serif text-3xl font-semibold text-ink">
          {formatPrice(price, product.currency)}
        </p>

        {product.short_description && (
          <p className="mt-5 leading-relaxed text-ink-soft">
            {product.short_description}
          </p>
        )}

        {/* Variantes */}
        {variants.length > 0 && (
          <div className="mt-7">
            <p className="mb-2 text-sm font-medium text-ink">Format</p>
            <div className="flex flex-wrap gap-2">
              {variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setVariantId(v.id)}
                  className={`rounded-full border px-5 py-2.5 text-sm transition-colors ${
                    variantId === v.id
                      ? "border-blue-deep bg-blue-deep text-white"
                      : "border-line bg-white text-ink-soft hover:border-blue"
                  }`}
                >
                  {v.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 flex items-center gap-4">
          <button
            onClick={handleAdd}
            disabled={outOfStock}
            className={`btn flex-1 py-4 text-base ${
              added ? "bg-blue text-white" : "btn-primary"
            } ${outOfStock ? "cursor-not-allowed opacity-50" : ""}`}
          >
            {outOfStock ? (
              "Bientôt de retour"
            ) : added ? (
              <>
                <CheckIcon size={18} /> Ajouté au panier
              </>
            ) : (
              "Ajouter au panier"
            )}
          </button>
        </div>

        <ul className="mt-8 space-y-2 border-t border-line pt-6 text-sm text-ink-soft">
          <li className="flex items-center gap-2"><CheckIcon size={16} className="text-blue-deep" /> 100 % d&apos;origine naturelle</li>
          <li className="flex items-center gap-2"><CheckIcon size={16} className="text-blue-deep" /> Convient à tous les types de cheveux</li>
          <li className="flex items-center gap-2"><CheckIcon size={16} className="text-blue-deep" /> Demande sans paiement en ligne — l'équipe Beauty Concept vous recontacte</li>
        </ul>
      </div>
    </div>
  );
}
