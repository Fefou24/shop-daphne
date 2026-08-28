import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/format";
import { customStatusMeta } from "@/lib/status";
import { CustomStatusSelect } from "@/components/admin/CustomStatusSelect";
import { PageHeader, EmptyState } from "@/components/admin/ui";
import { SparkleIcon } from "@/components/ui/icons";

export const dynamic = "force-dynamic";

export default async function AdminCustomPage() {
  const supabase = await createClient();
  const { data: requests } = await supabase
    .from("custom_product_requests")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <PageHeader title="Demandes sur-mesure" subtitle="Les demandes de produits personnalisés." />

      {!requests || requests.length === 0 ? (
        <EmptyState title="Aucune demande sur-mesure pour le moment." icon={<SparkleIcon size={40} />} />
      ) : (
        <div className="space-y-4">
          {requests.map((r) => {
            const meta = customStatusMeta(r.status);
            return (
              <div key={r.id} className="rounded-2xl border border-line bg-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-muted">{r.reference}</span>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs ${meta.color}`}>{meta.label}</span>
                    </div>
                    <p className="mt-1 font-medium text-ink">{r.first_name} {r.last_name}</p>
                    <p className="text-sm text-muted">
                      <a href={`mailto:${r.email}`} className="hover:text-blue-deep">{r.email}</a>
                      {r.phone && ` · ${r.phone}`}
                    </p>
                  </div>
                  <CustomStatusSelect id={r.id} current={r.status} />
                </div>
                <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                  {r.hair_type && <Info label="Type de cheveux" value={r.hair_type} />}
                  {r.hair_concerns && <Info label="Problématiques" value={r.hair_concerns} />}
                  {r.budget && <Info label="Budget" value={r.budget} />}
                  <Info label="Reçue le" value={formatDate(r.created_at)} />
                </div>
                <div className="mt-4 rounded-xl bg-cream-deep p-4 text-sm text-ink-soft">
                  {r.description}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-xs uppercase tracking-wide text-muted">{label}</span>
      <p className="text-ink">{value}</p>
    </div>
  );
}
