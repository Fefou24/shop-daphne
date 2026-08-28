"use client";

import Link from "next/link";
import { useState } from "react";
import { submitCustomRequest } from "./actions";
import { SparkleIcon, CheckIcon } from "@/components/ui/icons";

const HAIR_TYPES = ["Lisses", "Ondulés", "Bouclés", "Frisés", "Crépus", "Je ne sais pas"];

export default function SurMesurePage() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    hair_type: "",
    hair_concerns: "",
    description: "",
    budget: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");
  const [reference, setReference] = useState<string | null>(null);

  function set<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    const res = await submitCustomRequest(form);
    if (res.ok) setReference(res.reference);
    else {
      setStatus("error");
      setError(res.error);
    }
  }

  if (reference) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-deep text-white">
          <CheckIcon size={32} />
        </div>
        <h1 className="section-title text-4xl">Demande envoyée !</h1>
        <p className="mt-4 text-ink-soft">
          Merci ! Votre demande sur-mesure{" "}
          <span className="font-semibold text-ink">#{reference}</span> a bien été
          reçue. L'équipe Beauty Concept reviendra vers vous pour imaginer le produit idéal pour
          vos cheveux.
        </p>
        <Link href="/" className="btn btn-primary mt-8 px-8 py-3.5">Retour à l&apos;accueil</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <div className="mb-8 text-center">
        <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-cream-deep px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-blue-deep">
          <SparkleIcon size={15} /> Sur-mesure
        </p>
        <h1 className="section-title text-4xl sm:text-5xl">Votre produit personnalisé</h1>
        <p className="mx-auto mt-3 max-w-lg text-ink-soft">
          L'équipe Beauty Concept souhaite créer des produits adaptés à chacun.
          Décrivez vos cheveux et vos attentes : nous imaginerons le soin qu&apos;il
          vous faut.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-3xl border border-line bg-white p-6 sm:p-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Prénom" required value={form.first_name} onChange={(v) => set("first_name", v)} />
          <Field label="Nom" required value={form.last_name} onChange={(v) => set("last_name", v)} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="E-mail" type="email" required value={form.email} onChange={(v) => set("email", v)} />
          <Field label="Téléphone (optionnel)" value={form.phone} onChange={(v) => set("phone", v)} />
        </div>
        <div>
          <Label>Type de cheveux</Label>
          <select
            value={form.hair_type}
            onChange={(e) => set("hair_type", e.target.value)}
            className="w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm outline-none focus:border-blue"
          >
            <option value="">— Choisir —</option>
            {HAIR_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <Field label="Problématiques (sécheresse, frisottis, manque de volume…)" value={form.hair_concerns} onChange={(v) => set("hair_concerns", v)} />
        <div>
          <Label>Décrivez le produit dont vous rêvez *</Label>
          <textarea
            required
            rows={5}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Ce que vous aimeriez, l'odeur, la texture, vos habitudes…"
            className="w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm outline-none focus:border-blue"
          />
        </div>
        <Field label="Budget indicatif (optionnel)" value={form.budget} onChange={(v) => set("budget", v)} />

        {status === "error" && <p className="text-sm text-blush">{error}</p>}

        <button type="submit" disabled={status === "loading"} className="btn btn-primary w-full py-4 text-base">
          {status === "loading" ? "Envoi…" : "Envoyer ma demande sur-mesure"}
        </button>
      </form>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="mb-1 block text-sm font-medium text-ink">{children}</label>;
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
      <Label>{label}{required && <span className="text-blush"> *</span>}</Label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm outline-none focus:border-blue"
      />
    </div>
  );
}
