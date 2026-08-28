import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/format";
import { statusMeta } from "@/lib/status";
import { distanceMeters, estimateTravelMinutes } from "@/lib/geo";
import { DELIVERY_LABELS, PAYMENT_LABELS } from "@/lib/delivery";
import { QuickPaidButton } from "@/components/admin/QuickPaidButton";
import { PageHeader, AdminCard, StatCard, Badge, EmptyState } from "@/components/admin/ui";
import {
  CashIcon,
  BriefcaseIcon,
  ChatIcon2,
  BoxIcon,
  MapPinIcon,
  HandshakeIcon,
  ClockIcon,
  CheckIcon,
} from "@/components/ui/icons";

export const dynamic = "force-dynamic";

export default async function AffairesPage() {
  const supabase = await createClient();
  const [{ data: settings }, { data: orders }, { data: tickets }] = await Promise.all([
    supabase.from("site_settings").select("team_lat, team_lng").eq("id", 1).single(),
    supabase
      .from("order_requests")
      .select("*, order_request_items(product_name, quantity)")
      .neq("status", "annulee")
      .order("created_at", { ascending: false }),
    supabase.from("support_tickets").select("id").eq("last_sender_role", "client").neq("status", "resolu"),
  ]);

  const all = orders ?? [];
  const { reconcileStripeOrders } = await import("@/lib/stripe");
  await reconcileStripeOrders(supabase, all);

  const toValidate = all.filter((o) => !o.is_paid && o.status !== "livree");
  const toPrepare = all.filter((o) => o.status !== "livree");

  function travel(o: { delivery_lat: number | null; delivery_lng: number | null }) {
    const tlat = settings?.team_lat;
    const tlng = settings?.team_lng;
    if (tlat == null || tlng == null || o.delivery_lat == null || o.delivery_lng == null) return null;
    const d = distanceMeters(tlat, tlng, o.delivery_lat, o.delivery_lng);
    return { km: (d / 1000).toFixed(1), min: estimateTravelMinutes(d) };
  }

  return (
    <div>
      <PageHeader title="Affaires" subtitle="Tout ce qu'il y a à faire, en un coup d'œil." />

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <StatCard label="Paiements à valider" value={toValidate.length} icon={<CashIcon size={18} />} accent={toValidate.length > 0} />
        <StatCard label="À préparer / livrer" value={toPrepare.length} icon={<BriefcaseIcon size={18} />} />
        <StatCard label="Messages support" value={tickets?.length ?? 0} icon={<ChatIcon2 size={18} />} accent={(tickets?.length ?? 0) > 0} />
      </div>

      {/* Paiements à valider */}
      <AdminCard title="Paiements à valider" className="mb-6">
        {toValidate.length === 0 ? (
          <EmptyState title="Aucun paiement en attente." description="Tout est à jour." icon={<CheckIcon size={36} />} />
        ) : (
          <div className="space-y-2.5">
            {toValidate.map((o) => (
              <div key={o.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-line bg-cream/40 p-3.5">
                <Link href={`/admin/demandes/${o.id}`} className="font-mono text-xs text-blue-deep hover:underline">{o.reference}</Link>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-ink">{o.first_name} {o.last_name}</p>
                  <p className="text-xs text-muted">
                    {o.payment_method ? PAYMENT_LABELS[o.payment_method] : "—"} · {formatPrice(Number(o.total))}
                  </p>
                </div>
                <QuickPaidButton id={o.id} />
              </div>
            ))}
          </div>
        )}
      </AdminCard>

      {/* À préparer / livrer */}
      <AdminCard title="À préparer & livrer">
        {toPrepare.length === 0 ? (
          <EmptyState title="Rien à préparer pour le moment." icon={<BoxIcon size={36} />} />
        ) : (
          <div className="space-y-2.5">
            {toPrepare.map((o) => {
              const t = travel(o);
              const meta = statusMeta(o.status);
              const items = (o.order_request_items ?? []) as { product_name: string; quantity: number }[];
              return (
                <Link key={o.id} href={`/admin/demandes/${o.id}`} className="block rounded-xl border border-line p-3.5 transition-colors hover:border-blue">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs text-muted">{o.reference}</span>
                      <Badge tone={meta.tone}>{meta.label}</Badge>
                      {o.is_paid ? <Badge tone="green"><CheckIcon size={11} /> Payé</Badge> : <Badge tone="neutral">Non payé</Badge>}
                    </div>
                    <span className="text-sm font-medium">{formatPrice(Number(o.total))}</span>
                  </div>
                  <p className="mt-1.5 font-medium text-ink">{o.first_name} {o.last_name}</p>
                  <p className="text-sm text-ink-soft">{items.map((it) => `${it.quantity}× ${it.product_name}`).join(", ")}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
                    <span className="inline-flex items-center gap-1"><BoxIcon size={13} /> {o.delivery_method ? DELIVERY_LABELS[o.delivery_method] : "—"}</span>
                    {(o.address || o.city) && (
                      <span className="inline-flex items-center gap-1"><MapPinIcon size={13} /> {[o.address, o.postal_code, o.city].filter(Boolean).join(" ")}</span>
                    )}
                    {o.meetup_point && <span className="inline-flex items-center gap-1"><HandshakeIcon size={13} /> {o.meetup_point}</span>}
                    {o.in_local_zone && <span className="font-medium text-[#2f7a4a]">Zone locale</span>}
                    {t && <span className="inline-flex items-center gap-1 font-medium text-ink"><ClockIcon size={13} /> ~{t.min} min ({t.km} km)</span>}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </AdminCard>
    </div>
  );
}
