import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/format";

const ACTION_LABELS: Record<string, string> = {
  product_saved: "Produit enregistré",
  product_deleted: "Produit supprimé",
  settings_updated: "Réglages modifiés",
  maintenance_on: "Maintenance activée",
  maintenance_off: "Maintenance désactivée",
  staff_created: "Compte créé",
  staff_deleted: "Compte supprimé",
  staff_role_updated: "Rôle modifié",
};

export default async function JournalPage() {
  const supabase = await createClient();
  const { data: logs } = await supabase
    .from("activity_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div>
      <Link href="/super-admin" className="text-sm text-blue-deep hover:underline">
        ← Retour aux réglages
      </Link>
      <h1 className="mb-1 mt-2 font-serif text-3xl font-semibold text-ink">
        Journal d&apos;activité
      </h1>
      <p className="mb-6 text-ink-soft">Les 100 dernières actions sur le site.</p>

      {!logs || logs.length === 0 ? (
        <p className="rounded-2xl border border-line bg-white p-6 text-ink-soft">
          Aucune activité enregistrée.
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line bg-white">
          <table className="w-full text-sm">
            <thead className="bg-cream-deep text-left text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Détail</th>
                <th className="hidden px-4 py-3 sm:table-cell">Par</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {logs.map((l) => (
                <tr key={l.id}>
                  <td className="whitespace-nowrap px-4 py-3 text-muted">{formatDate(l.created_at)}</td>
                  <td className="px-4 py-3 font-medium text-ink">{ACTION_LABELS[l.action] ?? l.action}</td>
                  <td className="px-4 py-3 text-ink-soft">{l.detail ?? "—"}</td>
                  <td className="hidden px-4 py-3 text-muted sm:table-cell">{l.actor_email ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
