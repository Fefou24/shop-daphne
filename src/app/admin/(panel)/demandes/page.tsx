import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatPrice, formatDate } from "@/lib/format";
import { statusMeta } from "@/lib/status";
import { PageHeader, Badge } from "@/components/admin/ui";

/* eslint-disable @typescript-eslint/no-explicit-any */
function OrderRow({ r }: { r: any }) {
  const meta = statusMeta(r.status);
  return (
    <Link
      href={`/admin/demandes/${r.id}`}
      className="flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-white p-4 transition-colors hover:border-blue"
    >
      <span className="font-mono text-xs text-muted">{r.reference}</span>
      <div className="min-w-0 flex-1">
        <p className="font-medium text-ink">{r.first_name} {r.last_name}</p>
        <p className="text-sm text-muted">{r.email}</p>
      </div>
      <span className="hidden text-sm text-muted sm:block">{formatDate(r.created_at)}</span>
      <span className="font-medium text-ink">{formatPrice(r.total)}</span>
      {r.is_paid ? <Badge tone="green">Payé</Badge> : <Badge tone="neutral">Non payé</Badge>}
      <Badge tone={meta.tone}>{meta.label}</Badge>
    </Link>
  );
}

export default async function AdminRequestsPage() {
  const supabase = await createClient();
  const { data: requests } = await supabase
    .from("order_requests")
    .select("*")
    .order("created_at", { ascending: false });

  const all = requests ?? [];
  const { reconcileStripeOrders } = await import("@/lib/stripe");
  await reconcileStripeOrders(supabase, all);

  const active = all.filter((r) => r.status !== "livree" && r.status !== "annulee");
  const history = all.filter((r) => r.status === "livree" || r.status === "annulee");

  return (
    <div>
      <PageHeader title="Commandes" subtitle="Les commandes en cours et leur historique." />

      {all.length === 0 ? (
        <p className="rounded-2xl border border-line bg-white p-6 text-ink-soft">
          Aucune commande pour le moment.
        </p>
      ) : (
        <>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
            En cours ({active.length})
          </h2>
          {active.length === 0 ? (
            <p className="rounded-2xl border border-line bg-white p-5 text-sm text-ink-soft">
              Aucune commande en cours. 🎉
            </p>
          ) : (
            <div className="space-y-3">
              {active.map((r) => <OrderRow key={r.id} r={r} />)}
            </div>
          )}

          {history.length > 0 && (
            <details className="group mt-8">
              <summary className="cursor-pointer list-none text-sm font-semibold uppercase tracking-wide text-muted">
                Historique — livrées / annulées ({history.length})
                <span className="ml-2 font-normal normal-case group-open:hidden">▸ afficher</span>
                <span className="ml-2 hidden font-normal normal-case group-open:inline">▾ masquer</span>
              </summary>
              <div className="mt-3 space-y-3">
                {history.map((r) => <OrderRow key={r.id} r={r} />)}
              </div>
            </details>
          )}
        </>
      )}
    </div>
  );
}
