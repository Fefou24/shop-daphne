"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart, keyOf } from "@/context/CartContext";
import { useShipping } from "@/context/SettingsContext";
import { computeShipping } from "@/lib/shipping";
import { formatPrice } from "@/lib/format";
import { submitRequest } from "@/app/(site)/panier/actions";
import { MinusIcon, PlusIcon, TrashIcon, CheckIcon, CartIcon } from "@/components/ui/icons";

export function LegacyCheckout() {
  const { items, total, updateQuantity, removeItem, clear } = useCart();
  const shippingCfg = useShipping();
  const shipping = computeShipping(total, shippingCfg);
  const grandTotal = total + shipping;
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    postal_code: "",
    city: "",
    note: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");
  const [reference, setReference] = useState<string | null>(null);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const res = await submitRequest({ ...form, items });
    if (res.ok) {
      setReference(res.reference);
      clear();
    } else {
      setStatus("error");
      setError(res.error);
    }
  }

  if (reference) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-deep text-white">
          <CheckIcon size={32} />
        </div>
        <h1 className="section-title text-4xl">Demande envoyée !</h1>
        <p className="mt-4 text-ink-soft">
          Merci pour votre confiance. Votre commande{" "}
          <span className="font-semibold text-ink">#{reference}</span> a bien été
          enregistrée. L&apos;équipe Beauty Concept vous recontactera très vite pour la finaliser.
        </p>
        <div className="mt-6 rounded-2xl border border-line bg-cream-deep p-4 text-sm">
          <p className="text-ink-soft">Gardez ce lien pour suivre votre commande :</p>
          <Link href={`/suivi/${reference}`} className="font-mono text-blue-deep hover:underline">
            /suivi/{reference}
          </Link>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href={`/suivi/${reference}`} className="btn btn-primary px-8 py-3.5">Suivre ma commande</Link>
          <Link href="/produits" className="btn btn-outline px-8 py-3.5">Continuer mes achats</Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
        <CartIcon size={56} className="mx-auto text-line" />
        <h1 className="section-title mt-4 text-4xl">Votre panier est vide</h1>
        <p className="mt-3 text-ink-soft">Parcourez nos soins et ajoutez vos favoris.</p>
        <Link href="/produits" className="btn btn-primary mt-8 px-8 py-3.5">Découvrir la boutique</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="section-title mb-2 text-4xl sm:text-5xl">Ma demande</h1>
      <p className="mb-8 text-ink-soft">
        Aucun paiement en ligne pour le moment : envoyez votre demande, l&apos;équipe
        Beauty Concept vous recontacte pour finaliser.
      </p>

      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-4">
          {items.map((item) => {
            const k = keyOf(item);
            return (
              <div key={k} className="flex gap-4 rounded-2xl border border-line bg-white p-4">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-cream-deep">
                  {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
                </div>
                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between gap-2">
                    <div>
                      <Link href={`/produit/${item.slug}`} className="font-medium text-ink hover:text-blue-deep">
                        {item.name}
                      </Link>
                      {item.variantName && <p className="text-xs text-muted">{item.variantName}</p>}
                    </div>
                    <button onClick={() => removeItem(k)} aria-label="Retirer">
                      <TrashIcon size={18} className="text-muted hover:text-blush" />
                    </button>
                  </div>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-3 rounded-full bg-cream-deep px-3 py-1.5">
                      <button onClick={() => updateQuantity(k, item.quantity - 1)} aria-label="Moins"><MinusIcon size={16} /></button>
                      <span className="w-5 text-center text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(k, item.quantity + 1)} aria-label="Plus"><PlusIcon size={16} /></button>
                    </div>
                    <span className="font-semibold text-ink">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2 rounded-2xl border border-line bg-cream-deep p-5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-ink-soft">Sous-total</span>
              <span className="font-medium text-ink">{formatPrice(total)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-ink-soft">Livraison</span>
              <span className="font-medium text-ink">{shipping === 0 ? "Offerte" : formatPrice(shipping)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-line pt-2">
              <span className="text-ink-soft">Total estimé</span>
              <span className="font-serif text-3xl font-semibold">{formatPrice(grandTotal)}</span>
            </div>
          </div>

          <h2 className="font-serif text-2xl font-semibold">Vos coordonnées</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Prénom" required value={form.first_name} onChange={(v) => set("first_name", v)} />
            <Field label="Nom" required value={form.last_name} onChange={(v) => set("last_name", v)} />
          </div>
          <Field label="E-mail" type="email" required value={form.email} onChange={(v) => set("email", v)} />
          <Field label="Téléphone" value={form.phone} onChange={(v) => set("phone", v)} />
          <Field label="Adresse" value={form.address} onChange={(v) => set("address", v)} />
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Code postal" value={form.postal_code} onChange={(v) => set("postal_code", v)} />
            <Field label="Ville" value={form.city} onChange={(v) => set("city", v)} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ink">Message (optionnel)</label>
            <textarea value={form.note} onChange={(e) => set("note", e.target.value)} rows={3} className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-blue" />
          </div>

          {status === "error" && <p className="text-sm text-blush">{error}</p>}

          <button type="submit" disabled={status === "loading"} className="btn btn-primary w-full py-4 text-base">
            {status === "loading" ? "Envoi en cours…" : "Envoyer ma demande"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-ink">
        {label}{required && <span className="text-blush"> *</span>}
      </label>
      <input type={type} required={required} value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-blue" />
    </div>
  );
}
