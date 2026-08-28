"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { saveSettings, type SettingsInput } from "@/app/super-admin/(panel)/actions";
import type { SiteSettings } from "@/lib/types";
import { Switch } from "@/components/ui/Switch";

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const router = useRouter();
  const [form, setForm] = useState<SettingsInput>({
    maintenance_mode: settings.maintenance_mode,
    maintenance_message: settings.maintenance_message ?? "",
    promo_bar_enabled: settings.promo_bar_enabled,
    promo_bar_text: settings.promo_bar_text ?? "",
    contact_email: settings.contact_email ?? "",
    contact_phone: settings.contact_phone ?? "",
    local_delivery_enabled: settings.local_delivery_enabled,
    carrier_enabled: settings.carrier_enabled,
    cash_enabled: settings.cash_enabled,
    whatsapp_url: settings.whatsapp_url ?? "",
    instagram_url: settings.instagram_url ?? "",
    facebook_url: settings.facebook_url ?? "",
    tiktok_url: settings.tiktok_url ?? "",
    stripe_enabled: settings.stripe_enabled,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function set<K extends keyof SettingsInput>(key: K, value: SettingsInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await saveSettings(form);
    setSaving(false);
    setSaved(true);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Maintenance */}
      <section
        className={`rounded-2xl border p-6 transition-colors ${
          form.maintenance_mode ? "border-blush bg-blush-soft/40" : "border-line bg-white"
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl font-semibold text-ink">Mode maintenance</h2>
            <p className="text-sm text-ink-soft">
              Affiche une page « bientôt de retour » à tous les visiteurs. Les
              admins gardent l&apos;accès au site.
            </p>
          </div>
          <Switch checked={form.maintenance_mode} onChange={(v) => set("maintenance_mode", v)} />
        </div>
        <div className="mt-4">
          <Label>Message affiché</Label>
          <textarea
            value={form.maintenance_message}
            onChange={(e) => set("maintenance_message", e.target.value)}
            rows={2}
            className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-blue"
          />
        </div>
      </section>

      {/* Bannière promo */}
      <Section title="Bannière promotionnelle">
        <div className="flex items-center justify-between">
          <Label>Afficher la bannière en haut du site</Label>
          <Switch checked={form.promo_bar_enabled} onChange={(v) => set("promo_bar_enabled", v)} />
        </div>
        <input
          value={form.promo_bar_text}
          onChange={(e) => set("promo_bar_text", e.target.value)}
          className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-blue"
        />
      </Section>

      {/* Contact */}
      <Section title="Coordonnées & réseaux">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Chaîne WhatsApp (URL)" value={form.whatsapp_url} onChange={(v) => set("whatsapp_url", v)} />
          <TextField label="E-mail de contact" value={form.contact_email} onChange={(v) => set("contact_email", v)} />
          <TextField label="Téléphone" value={form.contact_phone} onChange={(v) => set("contact_phone", v)} />
          <TextField label="Instagram (URL)" value={form.instagram_url} onChange={(v) => set("instagram_url", v)} />
          <TextField label="Facebook (URL)" value={form.facebook_url} onChange={(v) => set("facebook_url", v)} />
          <TextField label="TikTok (URL)" value={form.tiktok_url} onChange={(v) => set("tiktok_url", v)} />
        </div>
      </Section>

      {/* Livraison & paiement */}
      <Section title="Livraison & paiement (modules)">
        <p className="-mt-2 mb-1 text-xs text-muted">
          Tant que tout est désactivé, les commandes restent de simples demandes
          sans paiement (mode actuel). Activez les modules quand vous êtes prêt.
        </p>
        <FlagRow
          label="Livraison locale par l'équipe"
          hint="Gratuite dans la zone définie dans Admin › Réglages."
          checked={form.local_delivery_enabled}
          onChange={(v) => set("local_delivery_enabled", v)}
        />
        <FlagRow
          label="Livraison transporteur (Mondial Relay)"
          hint="Tarif réglé dans Admin › Réglages."
          checked={form.carrier_enabled}
          onChange={(v) => set("carrier_enabled", v)}
        />
        <FlagRow
          label="Paiement en espèces"
          hint="Remise en main propre / point de rencontre."
          checked={form.cash_enabled}
          onChange={(v) => set("cash_enabled", v)}
        />
        <FlagRow
          label="Paiement par carte (Stripe)"
          hint="Nécessite les clés Stripe dans les variables d'environnement."
          checked={form.stripe_enabled}
          onChange={(v) => set("stripe_enabled", v)}
        />
      </Section>

      <div className="sticky bottom-0 -mx-4 flex items-center justify-end gap-3 border-t border-line bg-cream/95 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6">
        {saved && <span className="text-sm text-blue-deep">✓ Enregistré</span>}
        <button type="submit" disabled={saving} className="btn btn-primary px-8 py-3">
          {saving ? "Enregistrement…" : "Enregistrer les réglages"}
        </button>
      </div>
    </form>
  );
}

function FlagRow({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-line pt-3 first:border-0 first:pt-0">
      <div>
        <p className="text-sm font-medium text-ink">{label}</p>
        <p className="text-xs text-muted">{hint}</p>
      </div>
      <Switch checked={checked} onChange={onChange} />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-line bg-white p-6">
      <h2 className="mb-4 font-serif text-xl font-semibold text-ink">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
function Label({ children }: { children: React.ReactNode }) {
  return <label className="mb-1 block text-sm font-medium text-ink">{children}</label>;
}
function TextField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <Label>{label}</Label>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-blue" />
    </div>
  );
}
