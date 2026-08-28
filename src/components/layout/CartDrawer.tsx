"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart, keyOf } from "@/context/CartContext";
import { useShipping } from "@/context/SettingsContext";
import { computeShipping } from "@/lib/shipping";
import { formatPrice } from "@/lib/format";
import {
  CloseIcon,
  MinusIcon,
  PlusIcon,
  TrashIcon,
  CartIcon,
} from "@/components/ui/icons";

export function CartDrawer() {
  const { items, isOpen, close, total, updateQuantity, removeItem } = useCart();
  const shippingCfg = useShipping();
  const shipping = computeShipping(total, shippingCfg);

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-ink/40 transition-opacity ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={close}
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-cream shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-serif text-2xl font-semibold">Mon panier</h2>
          <button onClick={close} aria-label="Fermer" className="p-1">
            <CloseIcon />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <CartIcon size={48} className="text-line" />
            <p className="text-ink-soft">Votre panier est vide.</p>
            <Link href="/produits" onClick={close} className="btn btn-primary px-6 py-3">
              Découvrir les produits
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
              {items.map((item) => {
                const k = keyOf(item);
                return (
                  <div key={k} className="flex gap-3">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-cream-deep">
                      {item.image && (
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between gap-2">
                        <div>
                          <p className="font-medium text-ink">{item.name}</p>
                          {item.variantName && (
                            <p className="text-xs text-muted">{item.variantName}</p>
                          )}
                        </div>
                        <button onClick={() => removeItem(k)} aria-label="Retirer">
                          <TrashIcon size={18} className="text-muted hover:text-blush" />
                        </button>
                      </div>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-3 rounded-full bg-cream-deep px-3 py-1.5">
                          <button onClick={() => updateQuantity(k, item.quantity - 1)} aria-label="Moins">
                            <MinusIcon size={16} />
                          </button>
                          <span className="w-5 text-center text-sm">{item.quantity}</span>
                          <button onClick={() => updateQuantity(k, item.quantity + 1)} aria-label="Plus">
                            <PlusIcon size={16} />
                          </button>
                        </div>
                        <span className="font-semibold text-ink">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-line px-5 py-4">
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-ink-soft">Sous-total</span>
                <span className="text-ink">{formatPrice(total)}</span>
              </div>
              <div className="mb-3 flex items-center justify-between text-sm">
                <span className="text-ink-soft">Livraison</span>
                <span className="text-ink">{shipping === 0 ? "Offerte" : formatPrice(shipping)}</span>
              </div>
              <div className="mb-3 flex items-center justify-between border-t border-line pt-3">
                <span className="text-ink-soft">Total estimé</span>
                <span className="font-serif text-2xl font-semibold">
                  {formatPrice(total + shipping)}
                </span>
              </div>
              <p className="mb-3 text-xs text-muted">
                Choisissez votre mode de livraison et de paiement à l&apos;étape suivante.
              </p>
              <Link
                href="/panier"
                onClick={close}
                className="btn btn-primary w-full py-3.5"
              >
                Finaliser ma demande
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
