import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatPrice, formatDate } from "@/lib/format";
import { statusMeta, type OrderStatus } from "@/lib/status";
import { OrderTimeline } from "@/components/order/OrderTimeline";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { CheckIcon, ChatIcon2, SparkleIcon } from "@/components/ui/icons";

export const metadata = { title: "Mon compte" };

/* eslint-disable @typescript-eslint/no-explicit-any */
function OrderCard({ o }: { o: any }) {
  const meta = statusMeta(o.status);
  const history = (o.order_status_history ?? []).map((h: any) => ({ status: h.status, created_at: h.created_at }));
  return (
    <div className="rounded-2xl border border-line bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
        <div>
          <p className="font-mono text-sm text-muted">#{o.reference}</p>
          <p className="text-xs text-muted">{formatDate(o.created_at)}</p>
        </div>
        <div className="flex items-center gap-2">
          {o.is_paid ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#cfe6d6] px-3 py-1 text-xs text-[#2f7a4a]">
              <CheckIcon size={13} /> Payé
            </span>
          ) : (
            <span className="rounded-full bg-cream-deep px-3 py-1 text-xs text-muted">Non payé</span>
          )}
          <span className={`rounded-full px-3 py-1 text-xs ${meta.color}`}>{meta.label}</span>
        </div>
      </div>
      <div className="grid gap-6 pt-5 lg:grid-cols-2">
        <div>
          <ul className="space-y-2 text-sm">
            {(o.order_request_items ?? []).map((it: any) => (
              <li key={it.id} className="flex justify-between">
                <span className="text-ink">{it.quantity}× {it.product_name}{it.variant_name ? ` · ${it.variant_name}` : ""}</span>
                <span className="text-muted">{formatPrice(Number(it.unit_price) * it.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex justify-between border-t border-line pt-3 font-medium">
            <span>Total</span>
            <span>{formatPrice(Number(o.total))}</span>
          </div>
          {o.estimated_delivery && (
            <p className="mt-3 text-sm text-ink-soft">
              Livraison estimée : <span className="font-medium text-ink">{formatDate(o.estimated_delivery)}</span>
            </p>
          )}
          <Link href={`/suivi/${o.reference}`} className="mt-3 inline-block text-sm text-blue-deep hover:underline">
            Voir la page de suivi →
          </Link>
        </div>
        <OrderTimeline status={o.status as OrderStatus} history={history} />
      </div>
    </div>
  );
}

export default async function ComptePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/connexion?next=/compte");

  const [{ data: profile }, { data: orders }, { data: customs }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase
      .from("order_requests")
      .select("*, order_request_items(*), order_status_history(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("custom_product_requests")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  const all = orders ?? [];
  const active = all.filter((o) => o.status !== "livree" && o.status !== "annulee");
  const history = all.filter((o) => o.status === "livree" || o.status === "annulee");

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="section-title text-4xl sm:text-5xl">Bonjour {profile?.full_name?.split(" ")[0] || ""} 👋</h1>
          <p className="mt-1 text-ink-soft">{profile?.email}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {(profile?.role === "admin" || profile?.role === "super_admin") && (
            <Link href="/admin" className="btn btn-primary px-5 py-2.5 text-sm">
              Panneau d&apos;administration
            </Link>
          )}
          <SignOutButton className="btn btn-outline px-5 py-2.5 text-sm" />
        </div>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <Link href="/compte/support" className="flex items-center gap-3 rounded-2xl border border-line bg-white p-4 transition-colors hover:border-blue">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-soft text-blue-deep"><ChatIcon2 size={20} /></span>
          <div>
            <p className="font-medium text-ink">Support</p>
            <p className="text-sm text-muted">Discuter avec l&apos;équipe Beauty Concept</p>
          </div>
        </Link>
        <Link href="/sur-mesure" className="flex items-center gap-3 rounded-2xl border border-line bg-white p-4 transition-colors hover:border-blue">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blush-soft text-blush"><SparkleIcon size={20} /></span>
          <div>
            <p className="font-medium text-ink">Produit sur-mesure</p>
            <p className="text-sm text-muted">Demander un soin personnalisé</p>
          </div>
        </Link>
      </div>

      <h2 className="mb-4 mt-10 font-serif text-2xl font-semibold">Mes commandes</h2>
      {active.length === 0 ? (
        <div className="rounded-2xl border border-line bg-white p-8 text-center">
          <p className="text-ink-soft">Aucune commande en cours.</p>
          <Link href="/produits" className="btn btn-primary mt-4 px-6 py-3">Découvrir la boutique</Link>
        </div>
      ) : (
        <div className="space-y-5">
          {active.map((o) => <OrderCard key={o.id} o={o} />)}
        </div>
      )}

      {history.length > 0 && (
        <details className="mt-8 group">
          <summary className="cursor-pointer list-none rounded-2xl border border-line bg-white px-5 py-4 font-serif text-xl font-semibold text-ink transition-colors hover:border-blue">
            Historique des commandes ({history.length})
            <span className="float-right text-sm font-normal text-muted group-open:hidden">Afficher</span>
            <span className="float-right hidden text-sm font-normal text-muted group-open:inline">Masquer</span>
          </summary>
          <div className="mt-4 space-y-5">
            {history.map((o) => <OrderCard key={o.id} o={o} />)}
          </div>
        </details>
      )}

      {customs && customs.length > 0 && (
        <>
          <h2 className="mb-4 mt-12 font-serif text-2xl font-semibold">Mes demandes sur-mesure</h2>
          <div className="space-y-3">
            {customs.map((c) => (
              <div key={c.id} className="flex items-center justify-between rounded-2xl border border-line bg-white p-4">
                <div>
                  <p className="font-mono text-sm text-muted">#{c.reference}</p>
                  <p className="text-sm text-ink">{c.description.slice(0, 60)}…</p>
                </div>
                <span className="rounded-full bg-cream-deep px-3 py-1 text-xs capitalize text-ink-soft">{c.status}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
