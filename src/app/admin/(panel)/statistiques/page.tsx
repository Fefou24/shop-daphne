import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/format";
import { PageHeader, AdminCard } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

function dayKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

export default async function StatsPage() {
  const supabase = await createClient();
  const now = new Date();
  const today = dayKey(now);
  const since7 = new Date(now.getTime() - 7 * 864e5).toISOString();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const [sessionsRes, ordersRes, itemsRes, reviewsRes] = await Promise.all([
    supabase.from("tracking_sessions").select("started_at, device, country").gte("started_at", since7),
    supabase.from("order_requests").select("total, created_at, is_paid, payment_method"),
    supabase.from("order_request_items").select("product_name, quantity"),
    supabase.from("reviews").select("rating").eq("is_approved", true),
  ]);

  const sessions = sessionsRes.data ?? [];
  const orders = ordersRes.data ?? [];
  const items = itemsRes.data ?? [];
  const reviews = reviewsRes.data ?? [];

  // Visites
  const visitsToday = sessions.filter((s) => s.started_at.slice(0, 10) === today).length;
  const visits7 = sessions.length;
  const mobile = sessions.filter((s) => s.device === "mobile").length;
  const mobilePct = visits7 ? Math.round((mobile / visits7) * 100) : 0;

  // Graph visites / 7 jours
  const days: { label: string; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 864e5);
    const k = dayKey(d);
    days.push({
      label: d.toLocaleDateString("fr-FR", { weekday: "short" }),
      count: sessions.filter((s) => s.started_at.slice(0, 10) === k).length,
    });
  }
  const maxDay = Math.max(1, ...days.map((d) => d.count));

  // Commandes
  const ordersCount = orders.length;
  const ordersMonth = orders.filter((o) => o.created_at >= monthStart).length;
  const revenue = orders.reduce((s, o) => s + Number(o.total), 0);
  const avgBasket = ordersCount ? revenue / ordersCount : 0;
  const conversion = visits7 ? Math.round((orders.filter((o) => o.created_at >= since7).length / visits7) * 1000) / 10 : 0;

  // Produits
  const productsTaken = items.reduce((s, i) => s + i.quantity, 0);
  const byProduct = items.reduce<Record<string, number>>((acc, i) => {
    acc[i.product_name] = (acc[i.product_name] ?? 0) + i.quantity;
    return acc;
  }, {});
  const topProduct = Object.entries(byProduct).sort((a, b) => b[1] - a[1])[0];

  // Avis
  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "—";

  return (
    <div>
      <PageHeader title="Statistiques" subtitle="Un aperçu de l'activité de votre boutique." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Stat label="Visites aujourd'hui" value={visitsToday} />
        <Stat label="Visites (7 jours)" value={visits7} />
        <Stat label="Visiteurs sur mobile" value={`${mobilePct} %`} />
        <Stat label="Commandes (total)" value={ordersCount} />
        <Stat label="Commandes ce mois" value={ordersMonth} />
        <Stat label="Chiffre d'affaires" value={formatPrice(revenue)} />
        <Stat label="Panier moyen" value={formatPrice(avgBasket)} />
        <Stat label="Taux de conversion" value={`${conversion} %`} hint="commandes ÷ visites (7 j)" />
        <Stat label="Produits commandés" value={productsTaken} />
        <Stat label="Produit n°1" value={topProduct ? topProduct[0] : "—"} small />
        <Stat label="Note moyenne" value={`★ ${avgRating}`} />
        <Stat label="Avis publiés" value={reviews.length} />
      </div>

      {/* Graph visites 7 jours */}
      <div className="mt-8">
      <AdminCard title="Visites des 7 derniers jours">
        <div className="flex items-end justify-between gap-2" style={{ height: 160 }}>
          {days.map((d, i) => (
            <div key={i} className="flex flex-1 flex-col items-center justify-end gap-2">
              <span className="text-xs font-medium text-ink">{d.count}</span>
              <div
                className="w-full rounded-t-lg bg-blue-deep transition-all"
                style={{ height: `${(d.count / maxDay) * 120}px`, minHeight: d.count ? 4 : 0 }}
              />
              <span className="text-xs capitalize text-muted">{d.label}</span>
            </div>
          ))}
        </div>
      </AdminCard>
      </div>
    </div>
  );
}

function Stat({ label, value, hint, small }: { label: string; value: string | number; hint?: string; small?: boolean }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <p className="text-sm text-muted">{label}</p>
      <p className={`mt-1 font-serif font-semibold text-ink ${small ? "text-xl" : "text-3xl"}`}>{value}</p>
      {hint && <p className="mt-0.5 text-xs text-muted">{hint}</p>}
    </div>
  );
}
