"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  saveProduct,
  deleteProduct,
  type ProductInput,
  type VariantInput,
} from "@/app/admin/(panel)/produits/actions";
import { CATEGORIES } from "@/lib/types";
import { TrashIcon, PlusIcon } from "@/components/ui/icons";

type Props = {
  initial?: Partial<ProductInput> & { id?: string };
};

export function ProductForm({ initial }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<ProductInput>({
    id: initial?.id,
    slug: initial?.slug ?? "",
    name: initial?.name ?? "",
    tagline: initial?.tagline ?? "",
    category: initial?.category ?? "soin",
    short_description: initial?.short_description ?? "",
    description: initial?.description ?? "",
    usage_instructions: initial?.usage_instructions ?? "",
    precautions: initial?.precautions ?? "",
    ingredients_note: initial?.ingredients_note ?? "",
    base_price: initial?.base_price ?? 0,
    images: initial?.images ?? [],
    is_active: initial?.is_active ?? true,
    is_featured: initial?.is_featured ?? false,
    is_new: initial?.is_new ?? false,
    variants: initial?.variants ?? [
      { name: "200 ml", price: initial?.base_price ?? 0, stock: 50, is_active: true },
    ],
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof ProductInput>(key: K, value: ProductInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    setError("");
    const supabase = createClient();
    const urls: string[] = [];
    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("product-images")
        .upload(path, file, { upsert: false });
      if (upErr) {
        setError("Échec de l'envoi d'une image : " + upErr.message);
        continue;
      }
      const { data } = supabase.storage.from("product-images").getPublicUrl(path);
      urls.push(data.publicUrl);
    }
    set("images", [...form.images, ...urls]);
    setUploading(false);
  }

  function removeImage(url: string) {
    set("images", form.images.filter((i) => i !== url));
  }

  function updateVariant(idx: number, patch: Partial<VariantInput>) {
    set(
      "variants",
      form.variants.map((v, i) => (i === idx ? { ...v, ...patch } : v)),
    );
  }
  function addVariant() {
    set("variants", [
      ...form.variants,
      { name: "", price: form.base_price, stock: 0, is_active: true },
    ]);
  }
  function removeVariant(idx: number) {
    set("variants", form.variants.filter((_, i) => i !== idx));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await saveProduct(form);
    if (res.ok) {
      router.push("/admin/produits");
      router.refresh();
    } else {
      setError(res.error);
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!form.id) return;
    if (!confirm("Supprimer définitivement ce produit ?")) return;
    await deleteProduct(form.id);
    router.push("/admin/produits");
    router.refresh();
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 pb-16">
      {error && (
        <p className="rounded-xl bg-blush-soft px-4 py-3 text-sm text-ink">{error}</p>
      )}

      {/* Images */}
      <Section title="Photos">
        <div className="flex flex-wrap gap-3">
          {form.images.map((url) => (
            <div key={url} className="relative h-28 w-28 overflow-hidden rounded-xl border border-line">
              <Image src={url} alt="" fill className="object-cover" sizes="112px" />
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute right-1 top-1 rounded-full bg-white/90 p-1 text-blush shadow"
              >
                <TrashIcon size={14} />
              </button>
            </div>
          ))}
          <label className="flex h-28 w-28 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-line text-xs text-muted hover:border-blue">
            <PlusIcon size={20} />
            {uploading ? "Envoi…" : "Ajouter"}
            <input type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" />
          </label>
        </div>
        <p className="mt-2 text-xs text-muted">
          La première image est l&apos;image principale du produit.
        </p>
      </Section>

      {/* Infos */}
      <Section title="Informations">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nom" required value={form.name} onChange={(v) => set("name", v)} />
          <Field
            label="Slug (URL)"
            value={form.slug}
            onChange={(v) => set("slug", v)}
            placeholder="auto depuis le nom"
          />
        </div>
        <Field label="Accroche" value={form.tagline} onChange={(v) => set("tagline", v)} />
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Catégorie</Label>
            <select
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-blue"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <NumberField label="Prix de base (€)" value={form.base_price} onChange={(v) => set("base_price", v)} />
        </div>
        <TextArea label="Description courte" rows={2} value={form.short_description} onChange={(v) => set("short_description", v)} />
        <TextArea label="Description complète" rows={6} value={form.description} onChange={(v) => set("description", v)} />
        <TextArea label="Mode d'emploi" rows={5} value={form.usage_instructions} onChange={(v) => set("usage_instructions", v)} />
        <TextArea label="Précautions & conditions d'utilisation" rows={5} value={form.precautions} onChange={(v) => set("precautions", v)} />
        <TextArea label="Ingrédients (optionnel)" rows={3} value={form.ingredients_note} onChange={(v) => set("ingredients_note", v)} />
      </Section>

      {/* Variantes */}
      <Section title="Formats / variantes">
        <div className="space-y-3">
          {form.variants.map((v, i) => (
            <div key={i} className="flex flex-wrap items-end gap-3 rounded-xl border border-line bg-white p-3">
              <div className="min-w-[140px] flex-1">
                <Label>Nom du format</Label>
                <input value={v.name} onChange={(e) => updateVariant(i, { name: e.target.value })} placeholder="200 ml" className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-blue" />
              </div>
              <div className="w-24">
                <Label>Prix (€)</Label>
                <input type="number" step="0.01" value={v.price} onChange={(e) => updateVariant(i, { price: parseFloat(e.target.value) || 0 })} className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-blue" />
              </div>
              <div className="w-20">
                <Label>Stock</Label>
                <input type="number" value={v.stock} onChange={(e) => updateVariant(i, { stock: parseInt(e.target.value) || 0 })} className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-blue" />
              </div>
              <label className="flex items-center gap-2 py-2 text-sm">
                <input type="checkbox" checked={v.is_active} onChange={(e) => updateVariant(i, { is_active: e.target.checked })} />
                Actif
              </label>
              <button type="button" onClick={() => removeVariant(i)} className="p-2 text-muted hover:text-blush">
                <TrashIcon size={18} />
              </button>
            </div>
          ))}
        </div>
        <button type="button" onClick={addVariant} className="mt-3 inline-flex items-center gap-1 text-sm text-blue-deep hover:underline">
          <PlusIcon size={16} /> Ajouter un format
        </button>
      </Section>

      {/* Visibilité */}
      <Section title="Visibilité">
        <div className="flex flex-wrap gap-6">
          <Toggle label="Produit visible sur le site" checked={form.is_active} onChange={(v) => set("is_active", v)} />
          <Toggle label="Mettre en avant (accueil)" checked={form.is_featured} onChange={(v) => set("is_featured", v)} />
          <Toggle label="Badge « Nouveau »" checked={form.is_new} onChange={(v) => set("is_new", v)} />
        </div>
      </Section>

      {/* Actions */}
      <div className="sticky bottom-0 -mx-4 flex items-center justify-between gap-3 border-t border-line bg-cream/95 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6">
        {form.id ? (
          <button type="button" onClick={handleDelete} className="text-sm text-blush hover:underline">
            Supprimer
          </button>
        ) : <span />}
        <div className="flex gap-3">
          <button type="button" onClick={() => router.push("/admin/produits")} className="btn btn-outline px-6 py-3">
            Annuler
          </button>
          <button type="submit" disabled={saving} className="btn btn-primary px-8 py-3">
            {saving ? "Enregistrement…" : "Enregistrer"}
          </button>
        </div>
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
      <h2 className="mb-4 font-serif text-xl font-semibold text-ink">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
function Label({ children }: { children: React.ReactNode }) {
  return <label className="mb-1 block text-sm font-medium text-ink">{children}</label>;
}
function Field({ label, value, onChange, required, placeholder }: { label: string; value: string; onChange: (v: string) => void; required?: boolean; placeholder?: string }) {
  return (
    <div>
      <Label>{label}{required && <span className="text-blush"> *</span>}</Label>
      <input value={value} required={required} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-blue" />
    </div>
  );
}
function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <Label>{label}</Label>
      <input type="number" step="0.01" value={value} onChange={(e) => onChange(parseFloat(e.target.value) || 0)} className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-blue" />
    </div>
  );
}
function TextArea({ label, value, onChange, rows }: { label: string; value: string; onChange: (v: string) => void; rows: number }) {
  return (
    <div>
      <Label>{label}</Label>
      <textarea value={value} rows={rows} onChange={(e) => onChange(e.target.value)} className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm leading-relaxed outline-none focus:border-blue" />
    </div>
  );
}
function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-ink">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4" />
      {label}
    </label>
  );
}
