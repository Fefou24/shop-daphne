import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatPrice, formatDate } from "@/lib/format";
import { statusMeta } from "@/lib/status";
import { OrderAdminControls } from "@/components/admin/OrderAdminControls";
import { OrderTimeline } from "@/components/order/OrderTimeline";
import { CheckIcon, ExternalLinkIcon } from "@/components/ui/icons";
import { DELIVERY_LABELS, PAYMENT_LABELS } from "@/lib/delivery";

export default async function RequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: request } = await supabase
    .from("order_requests")
    .select("*, order_request_items(*), order_status_history(*)")
    .eq("id", id)
    .single();

  if (!request) notFound();

  // Si payé via Stripe mais pas encore marqué, on vérifie et on corrige (cohérence).
  if (request.stripe_session_id && request.payment_status !== "paid") {
    const { isSessionPaid } = await import("@/lib/stripe");
    if (await isSessionPaid(request.stripe_session_id)) {
      await supabase.rpc("mark_order_paid", { p_session_id: request.stripe_session_id });
      request.payment_status = "paid";
      request.is_paid = true;
    }
  }

  const items = request.order_request_items ?? [];
  const history = (request.order_status_history ?? [])
    .map((h) => ({ status: h.status, created_at: h.created_at }))
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  const meta = statusMeta(request.status);

  return (
    <div>
      <Link href="/admin/demandes" className="text-sm text-blue-deep hover:underline">
        ← Retour aux commandes
      </Link>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-ink">
            Commande {request.reference}
          </h1>
          <p className="text-sm text-muted">{formatDate(request.created_at)}</p>
        </div>
        <div className="flex items-center gap-2">
          {request.is_paid ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#cfe6d6] px-3 py-1 text-sm text-[#2f7a4a]">
              <CheckIcon size={14} /> Payé
            </span>
          ) : (
            <span className="rounded-full bg-cream-deep px-3 py-1 text-sm text-muted">Non payé</span>
          )}
          <span className={`rounded-full px-3 py-1 text-sm ${meta.color}`}>{meta.label}</span>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="space-y-6">
          <OrderAdminControls
            id={request.id}
            status={request.status}
            isPaid={request.is_paid}
            estimatedDelivery={request.estimated_delivery}
          />

          {/* Articles */}
          <div className="rounded-2xl border border-line bg-white p-5">
            <h2 className="mb-4 font-serif text-xl font-semibold">Articles</h2>
            <div className="divide-y divide-line">
              {items.map((it) => (
                <div key={it.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-ink">{it.product_name}</p>
                    {it.variant_name && <p className="text-sm text-muted">{it.variant_name}</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted">{it.quantity} × {formatPrice(Number(it.unit_price))}</p>
                    <p className="font-medium text-ink">{formatPrice(Number(it.unit_price) * it.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-1 border-t border-line pt-4 text-sm">
              <div className="flex items-center justify-between text-ink-soft">
                <span>Sous-total</span>
                <span>{formatPrice(Number(request.total) - Number(request.shipping_fee))}</span>
              </div>
              <div className="flex items-center justify-between text-ink-soft">
                <span>Livraison</span>
                <span>{Number(request.shipping_fee) === 0 ? "Offerte" : formatPrice(Number(request.shipping_fee))}</span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="font-medium">Total estimé</span>
                <span className="font-serif text-2xl font-semibold">{formatPrice(Number(request.total))}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Suivi */}
          <div className="rounded-2xl border border-line bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-xl font-semibold">Suivi</h2>
              <Link href={`/suivi/${request.reference}`} target="_blank" className="inline-flex items-center gap-1 text-xs text-blue-deep hover:underline">
                Page client <ExternalLinkIcon size={12} />
              </Link>
            </div>
            <OrderTimeline status={request.status} history={history} />
          </div>

          {/* Client */}
          <div className="rounded-2xl border border-line bg-white p-5">
            <h2 className="mb-4 font-serif text-xl font-semibold">Coordonnées</h2>
            <dl className="space-y-3 text-sm">
              {request.delivery_method && (
                <Row label="Mode de livraison" value={DELIVERY_LABELS[request.delivery_method] ?? request.delivery_method} />
              )}
              {request.payment_method && (
                <Row
                  label="Paiement"
                  value={
                    <span>
                      {PAYMENT_LABELS[request.payment_method] ?? request.payment_method}
                      {" — "}
                      {request.payment_status === "paid" ? (
                        <span className="text-[#2f7a4a]">payé ✓</span>
                      ) : (
                        <span className="text-blush">en attente</span>
                      )}
                    </span>
                  }
                />
              )}
              {request.meetup_point && <Row label="Point de rencontre" value={request.meetup_point} />}
              {request.in_local_zone && <Row label="Zone locale" value="Oui (livraison équipe)" />}
              <Row label="Nom" value={`${request.first_name} ${request.last_name}`} />
              <Row label="E-mail" value={<a href={`mailto:${request.email}`} className="text-blue-deep hover:underline">{request.email}</a>} />
              {request.phone && (
                <Row
                  label="Téléphone"
                  value={
                    <span>
                      {request.phone}{" "}
                      <a href={`https://wa.me/${request.phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer" className="ml-1 text-[#25D366] hover:underline">
                        WhatsApp
                      </a>
                    </span>
                  }
                />
              )}
              {(request.address || request.city) && (
                <Row
                  label="Adresse de livraison"
                  value={
                    <span>
                      {request.address}
                      {request.address && <br />}
                      {request.postal_code} {request.city}
                    </span>
                  }
                />
              )}
              {request.note && <Row label="Message" value={request.note} />}
              <Row label="Compte client" value={request.user_id ? "Oui (connecté)" : "Non (invité)"} />
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-muted">{label}</dt>
      <dd className="mt-0.5 text-ink">{value}</dd>
    </div>
  );
}
