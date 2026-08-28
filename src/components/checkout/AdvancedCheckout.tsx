"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useCart, keyOf } from "@/context/CartContext";
import { useShipping } from "@/context/SettingsContext";
import { getDeliveryPlan, type DeliveryOption, type PaymentMethod, PAYMENT_LABELS } from "@/lib/delivery";
import { planDelivery, submitOrder } from "@/app/(site)/panier/actions";
import { formatPrice } from "@/lib/format";
import { MinusIcon, PlusIcon, TrashIcon, CheckIcon, CardIcon, CashIcon } from "@/components/ui/icons";

export function AdvancedCheckout() {
  const { items, total, updateQuantity, removeItem, clear } = useCart();
  const config = useShipping();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    postal_code: "",
    city: "",
    meetup_point: "",
    note: "",
  });
  const [options, setOptions] = useState<DeliveryOption[]>(
    () => getDeliveryPlan(config, false, total).options,
  );
  const [inZone, setInZone] = useState(false);
  const [method, setMethod] = useState<string>("");
  const [payment, setPayment] = useState<PaymentMethod | "">("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");
  const [done, setDone] = useState<{ reference: string; payment: PaymentMethod } | null>(null);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  function set<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  // Recalcule les options quand l'adresse change (zone locale)
  useEffect(() => {
    const full = [form.address, form.postal_code, form.city].filter(Boolean).join(" ");
    if (debounce.current) clearTimeout(debounce.current);
    if (full.trim().length < 6) {
      setOptions(getDeliveryPlan(config, false, total).options);
      setInZone(false);
      return;
    }
    debounce.current = setTimeout(async () => {
      const res = await planDelivery(full, total);
      setOptions(res.plan.options);
      setInZone(res.inZone);
    }, 700);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.address, form.postal_code, form.city, total]);

  const selectedOption = options.find((o) => o.method === method);
  const fee = selectedOption?.fee ?? 0;
  const grandTotal = total + fee;

  // Réinitialise le paiement si l'option change
  useEffect(() => {
    if (selectedOption && payment && !selectedOption.payments.includes(payment)) {
      setPayment(selectedOption.payments[0] ?? "");
    }
    if (selectedOption && !payment) setPayment(selectedOption.payments[0] ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [method]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedOption || !payment) {
      setError("Choisissez un mode de livraison et un paiement.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    setError("");
    const res = await submitOrder({
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
      phone: form.phone,
      address: form.address,
      postal_code: form.postal_code,
      city: form.city,
      note: form.note,
      meetup_point: form.meetup_point,
      delivery_method: selectedOption.method,
      payment_method: payment,
      items,
    });
    if (!res.ok) {
      setStatus("error");
      setError(res.error);
      return;
    }
    // La commande est créée côté serveur : on vide le panier dans tous les cas.
    clear();
    if (res.stripeUrl) {
      window.location.assign(res.stripeUrl);
      return;
    }
    setDone({ reference: res.reference, payment });
  }

  if (done) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-deep text-white">
          <CheckIcon size={32} />
        </div>
        <h1 className="section-title text-4xl">Commande confirmée !</h1>
        <p className="mt-4 text-ink-soft">
          Votre commande <span className="font-semibold text-ink">#{done.reference}</span> est
          enregistrée.{" "}
          {done.payment === "cash"
            ? "Le règlement se fera en espèces à la remise."
            : "Merci pour votre paiement."}{" "}
          L&apos;équipe Beauty Concept vous recontacte pour la suite.
        </p>
        <div className="mt-6 rounded-2xl border border-line bg-cream-deep p-4 text-sm">
          <p className="text-ink-soft">Gardez ce lien pour suivre votre commande :</p>
          <Link href={`/suivi/${done.reference}`} className="font-mono text-blue-deep hover:underline">
            /suivi/{done.reference}
          </Link>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href={`/suivi/${done.reference}`} className="btn btn-primary px-8 py-3.5">Suivre ma commande</Link>
          <Link href="/produits" className="btn btn-outline px-8 py-3.5">Continuer mes achats</Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
        <h1 className="section-title text-4xl">Votre panier est vide</h1>
        <p className="mt-3 text-ink-soft">Parcourez nos soins et ajoutez vos favoris.</p>
        <Link href="/produits" className="btn btn-primary mt-8 px-8 py-3.5">Découvrir la boutique</Link>
      </div>
    );
  }

  const needsAddress = method !== "meetup";

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="section-title mb-2 text-4xl sm:text-5xl">Finaliser ma commande</h1>
      <p className="mb-8 text-ink-soft">Choisissez votre livraison et votre paiement.</p>

      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        {/* Articles */}
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
                      <p className="font-medium text-ink">{item.name}</p>
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

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <h2 className="font-serif text-2xl font-semibold">Vos coordonnées</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Prénom" required value={form.first_name} onChange={(v) => set("first_name", v)} />
            <Field label="Nom" required value={form.last_name} onChange={(v) => set("last_name", v)} />
          </div>
          <Field label="E-mail" type="email" required value={form.email} onChange={(v) => set("email", v)} />
          <Field label="Téléphone" value={form.phone} onChange={(v) => set("phone", v)} />

          {/* Adresse (sauf rencontre) */}
          {needsAddress && (
            <>
              <Field label="Adresse" value={form.address} onChange={(v) => set("address", v)} />
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Code postal" value={form.postal_code} onChange={(v) => set("postal_code", v)} />
                <Field label="Ville" value={form.city} onChange={(v) => set("city", v)} />
              </div>
              {inZone && (
                <p className="rounded-xl bg-[#cfe6d6] px-4 py-2.5 text-sm text-[#2f7a4a]">
                  ✓ Vous êtes dans notre zone de livraison locale (gratuite) !
                </p>
              )}
            </>
          )}

          {/* Mode de livraison */}
          <div>
            <h2 className="mb-2 font-serif text-2xl font-semibold">Livraison</h2>
            <div className="space-y-2">
              {options.map((o) => (
                <button
                  type="button"
                  key={o.method}
                  onClick={() => setMethod(o.method)}
                  className={`w-full rounded-2xl border p-4 text-left transition-colors ${
                    method === o.method ? "border-blue-deep bg-blue-soft/30" : "border-line bg-white hover:border-blue"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-ink">{o.title}</span>
                    <span className="font-semibold text-ink">{o.fee === 0 ? "Gratuit" : formatPrice(o.fee)}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted">{o.description}</p>
                </button>
              ))}
              {options.length === 0 && (
                <p className="rounded-xl bg-blush-soft px-4 py-3 text-sm text-ink">
                  Aucun mode de livraison disponible pour le moment.
                </p>
              )}
            </div>
          </div>

          {/* Point de rencontre */}
          {method === "meetup" && (
            <Field
              label="Point de rencontre souhaité"
              value={form.meetup_point}
              onChange={(v) => set("meetup_point", v)}
            />
          )}

          {/* Paiement */}
          {selectedOption && selectedOption.payments.length > 0 && (
            <div>
              <h2 className="mb-2 font-serif text-2xl font-semibold">Paiement</h2>
              <div className="flex flex-wrap gap-2">
                {selectedOption.payments.map((p) => (
                  <button
                    type="button"
                    key={p}
                    onClick={() => setPayment(p)}
                    className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm transition-colors ${
                      payment === p ? "border-blue-deep bg-blue-deep text-white" : "border-line bg-white text-ink-soft hover:border-blue"
                    }`}
                  >
                    {p === "card" ? <CardIcon size={16} /> : <CashIcon size={16} />}
                    {PAYMENT_LABELS[p]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Récap */}
          <div className="space-y-2 rounded-2xl border border-line bg-cream-deep p-5">
            <div className="flex justify-between text-sm"><span className="text-ink-soft">Sous-total</span><span className="font-medium">{formatPrice(total)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-ink-soft">Livraison</span><span className="font-medium">{selectedOption ? (fee === 0 ? "Gratuit" : formatPrice(fee)) : "—"}</span></div>
            <div className="flex justify-between border-t border-line pt-2"><span className="text-ink-soft">Total</span><span className="font-serif text-2xl font-semibold">{formatPrice(grandTotal)}</span></div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-ink">Message (optionnel)</label>
            <textarea value={form.note} onChange={(e) => set("note", e.target.value)} rows={2} className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-blue" />
          </div>

          {status === "error" && <p className="text-sm text-blush">{error}</p>}

          <button type="submit" disabled={status === "loading" || !selectedOption || !payment} className="btn btn-primary w-full py-4 text-base disabled:opacity-50">
            {status === "loading"
              ? "Traitement…"
              : payment === "card"
                ? "Payer par carte"
                : "Valider ma commande"}
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
