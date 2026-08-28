import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { formatPrice, formatDate } from "@/lib/format";
import { statusMeta, type OrderStatus } from "@/lib/status";
import { OrderTimeline } from "@/components/order/OrderTimeline";
import { CheckIcon } from "@/components/ui/icons";

export const metadata: Metadata = { title: "Suivi de commande" };

type TrackedOrder = {
  reference: string;
  status: OrderStatus;
  is_paid: boolean;
  estimated_delivery: string | null;
  created_at: string;
  updated_at: string;
  first_name: string;
  total: number;
  shipping_fee: number;
  items: { product_name: string; variant_name: string | null; quantity: number; unit_price: number }[];
  history: { status: string; created_at: string }[];
};

export default async function SuiviPage({
  params,
  searchParams,
}: {
  params: Promise<{ reference: string }>;
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { reference } = await params;
  const { session_id } = await searchParams;
  const supabase = await createClient();

  // Retour de Stripe : on vérifie le paiement et on marque la commande payée
  if (session_id) {
    const { isSessionPaid } = await import("@/lib/stripe");
    if (await isSessionPaid(session_id)) {
      await supabase.rpc("mark_order_paid", { p_session_id: session_id });
    }
  }

  const { data } = await supabase.rpc("track_order", { ref: reference });
  const order = data as TrackedOrder | null;

  if (!order) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="section-title text-3xl">Commande introuvable</h1>
        <p className="mt-3 text-ink-soft">
          Aucune commande ne correspond au numéro «&nbsp;{reference}&nbsp;».
          Vérifiez le numéro et réessayez.
        </p>
        <Link href="/suivi" className="btn btn-primary mt-6 px-6 py-3">Réessayer</Link>
      </div>
    );
  }

  const meta = statusMeta(order.status);

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <p className="text-sm text-muted">
        <Link href="/" className="hover:text-blue-deep">Accueil</Link> / Suivi
      </p>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="section-title text-4xl">Commande #{order.reference}</h1>
          <p className="text-sm text-muted">Passée le {formatDate(order.created_at)}</p>
        </div>
        <div className="flex items-center gap-2">
          {order.is_paid ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#cfe6d6] px-3 py-1 text-xs text-[#2f7a4a]">
              <CheckIcon size={13} /> Payé
            </span>
          ) : (
            <span className="rounded-full bg-cream-deep px-3 py-1 text-xs text-muted">Non payé</span>
          )}
          <span className={`rounded-full px-3 py-1 text-xs ${meta.color}`}>{meta.label}</span>
        </div>
      </div>

      {order.is_paid && session_id && (
        <div className="mt-6 rounded-2xl border border-[#2f7a4a]/30 bg-[#cfe6d6] px-5 py-4 text-sm text-[#2f7a4a]">
          ✓ Merci, votre paiement a bien été reçu. Vous recevrez votre commande très vite !
        </div>
      )}

      <div className="mt-8 rounded-3xl border border-line bg-white p-6">
        <h2 className="mb-5 font-serif text-xl font-semibold">Suivi</h2>
        <OrderTimeline status={order.status} history={order.history} />
        {order.estimated_delivery && order.status !== "livree" && (
          <p className="mt-4 rounded-xl bg-cream-deep px-4 py-3 text-sm text-ink">
            📦 Livraison estimée : <span className="font-medium">{formatDate(order.estimated_delivery)}</span>
          </p>
        )}
      </div>

      <div className="mt-6 rounded-3xl border border-line bg-white p-6">
        <h2 className="mb-4 font-serif text-xl font-semibold">Récapitulatif</h2>
        <ul className="space-y-2 text-sm">
          {order.items.map((it, i) => (
            <li key={i} className="flex justify-between">
              <span className="text-ink">{it.quantity}× {it.product_name}{it.variant_name ? ` · ${it.variant_name}` : ""}</span>
              <span className="text-muted">{formatPrice(Number(it.unit_price) * it.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 space-y-1 border-t border-line pt-3 text-sm">
          <div className="flex justify-between text-ink-soft">
            <span>Sous-total</span>
            <span>{formatPrice(Number(order.total) - Number(order.shipping_fee || 0))}</span>
          </div>
          <div className="flex justify-between text-ink-soft">
            <span>Livraison</span>
            <span>{Number(order.shipping_fee || 0) === 0 ? "Offerte" : formatPrice(Number(order.shipping_fee))}</span>
          </div>
          <div className="flex justify-between pt-1 font-medium">
            <span>Total estimé</span>
            <span>{formatPrice(Number(order.total))}</span>
          </div>
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-muted">
        💡 Gardez ce lien pour suivre votre commande à tout moment.
      </p>
    </div>
  );
}
