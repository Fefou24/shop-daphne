"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveShippingSettings } from "@/app/admin/(panel)/reglages/actions";
import type { SiteSettings } from "@/lib/types";

export function ShippingForm({ settings }: { settings: SiteSettings }) {
  const router = useRouter();
  const [teamAddress, setTeamAddress] = useState(settings.team_address ?? "");
  const [radius, setRadius] = useState(String(settings.local_radius_m ?? 1500));
  const [carrierName, setCarrierName] = useState(settings.carrier_name ?? "Mondial Relay");
  const [fee, setFee] = useState(String(settings.shipping_fee ?? 0));
  const [threshold, setThreshold] = useState(
    settings.free_shipping_threshold != null ? String(settings.free_shipping_threshold) : "",
  );
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "warn"; text: string } | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    const res = await saveShippingSettings({
      shipping_fee: parseFloat(fee) || 0,
      free_shipping_threshold: threshold.trim() === "" ? null : parseFloat(threshold),
      carrier_name: carrierName,
      team_address: teamAddress,
      local_radius_m: parseInt(radius) || 0,
    });
    setSaving(false);
    if (res.ok && res.geocodeError) {
      setMsg({ type: "warn", text: "Adresse enregistrée mais introuvable pour le géocodage — vérifiez l'orthographe (rue, code postal, ville)." });
    } else if (res.ok) {
      setMsg({ type: "ok", text: "Réglages enregistrés." });
    }
    router.refresh();
  }

  const located = settings.team_lat != null && settings.team_lng != null;

  return (
    <form onSubmit={submit} className="max-w-xl space-y-6">
      {/* Zone locale */}
      <section className="rounded-2xl border border-line bg-white p-6">
        <h2 className="mb-1 font-serif text-xl font-semibold text-ink">Zone de livraison locale</h2>
        <p className="mb-5 text-sm text-ink-soft">
          Si l&apos;adresse du client est dans le rayon autour de l&apos;adresse de l&apos;équipe,
          la livraison est faite par l&apos;équipe, gratuitement.
        </p>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-ink">Adresse de l&apos;équipe (Paris)</label>
            <input
              value={teamAddress}
              onChange={(e) => setTeamAddress(e.target.value)}
              placeholder="12 rue de Rivoli, 75004 Paris"
              className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-blue"
            />
            <p className="mt-1 text-xs text-muted">
              {located ? "✓ Adresse localisée." : "Saisissez une adresse complète (numéro, rue, code postal, ville)."}
            </p>
          </div>
          <Field label="Rayon de la zone locale (mètres)" value={radius} onChange={setRadius} step="100" hint="Ex. 1500 = 1,5 km autour de l'adresse." />
        </div>
      </section>

      {/* Transporteur */}
      <section className="rounded-2xl border border-line bg-white p-6">
        <h2 className="mb-1 font-serif text-xl font-semibold text-ink">Livraison transporteur</h2>
        <p className="mb-5 text-sm text-ink-soft">
          Pour les clients hors zone. Réglez le tarif au prix réel (sans marge).
        </p>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-ink">Nom du transporteur</label>
            <input
              value={carrierName}
              onChange={(e) => setCarrierName(e.target.value)}
              className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-blue"
            />
          </div>
          <Field label="Frais de livraison (€)" value={fee} onChange={setFee} step="0.01" hint="Au prix réel facturé par le transporteur." />
          <Field label="Livraison offerte à partir de (€) — vide = désactivé" value={threshold} onChange={setThreshold} step="0.01" />
        </div>
      </section>

      <div className="flex items-center justify-end gap-3">
        {msg && (
          <span className={`text-sm ${msg.type === "ok" ? "text-blue-deep" : "text-blush"}`}>{msg.text}</span>
        )}
        <button type="submit" disabled={saving} className="btn btn-primary px-8 py-3">
          {saving ? "Enregistrement…" : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  hint,
  step = "1",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  step?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-ink">{label}</label>
      <input
        type="number"
        step={step}
        min="0"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-blue"
      />
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}
