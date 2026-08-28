import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatPrice, formatDate } from "@/lib/format";
import { statusMeta } from "@/lib/status";
import { PageHeader, AdminCard, StatCard, Badge, EmptyState } from "@/components/admin/ui";
import {
  BriefcaseIcon,
  MailIcon,
  ChatIcon2,
  StarOutlineIcon,
  SparkleIcon,
  ActivityIcon,
  ArrowRightIcon,
  PackageIcon,
} from "@/components/ui/icons";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);

  const [
    { count: productsCount },
    { count: pendingRequests },
    { count: unpaid },
    { count: pendingReviews },
    { count: pendingCustom },
    { count: pendingSupport },
    { count: sessionsToday },
    { data: recent },
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("order_requests").select("*", { count: "exact", head: true }).neq("status", "livree").neq("status", "annulee"),
    supabase.from("order_requests").select("*", { count: "exact", head: true }).eq("is_paid", false).neq("status", "livree").neq("status", "annulee"),
    supabase.from("reviews").select("*", { count: "exact", head: true }).eq("is_approved", false),
    supabase.from("custom_product_requests").select("*", { count: "exact", head: true }).eq("status", "nouvelle"),
    supabase.from("support_tickets").select("*", { count: "exact", head: true }).eq("last_sender_role", "client").neq("status", "resolu"),
    supabase.from("tracking_sessions").select("*", { count: "exact", head: true }).gte("started_at", today),
    supabase.from("order_requests").select("*").order("created_at", { ascending: false }).limit(6),
  ]);

  const todo = [
    { label: "À traiter / livrer", value: pendingRequests ?? 0, href: "/admin/affaires", Icon: BriefcaseIcon },
    { label: "Paiements à valider", value: unpaid ?? 0, href: "/admin/affaires", Icon: MailIcon },
    { label: "Messages support", value: pendingSupport ?? 0, href: "/admin/support", Icon: ChatIcon2 },
    { label: "Avis à valider", value: pendingReviews ?? 0, href: "/admin/avis", Icon: StarOutlineIcon },
    { label: "Demandes sur-mesure", value: pendingCustom ?? 0, href: "/admin/sur-mesure", Icon: SparkleIcon },
  ];

  return (
    <div>
      <PageHeader title="Tableau de bord" subtitle="Bienvenue dans votre espace Beauty Concept." />

      {/* À faire */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {todo.map((t) => (
          <StatCard
            key={t.label}
            label={t.label}
            value={t.value}
            href={t.href}
            icon={<t.Icon size={18} />}
            accent={t.value > 0}
          />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Dernières commandes */}
        <div className="lg:col-span-2">
          <AdminCard
            title="Dernières commandes"
            action={<Link href="/admin/demandes" className="inline-flex items-center gap-1 text-sm text-blue-deep hover:underline">Tout voir <ArrowRightIcon size={14} /></Link>}
          >
            {!recent || recent.length === 0 ? (
              <EmptyState title="Aucune commande pour le moment." icon={<MailIcon size={40} />} />
            ) : (
              <div className="-mx-2 overflow-x-auto">
                <table className="w-full min-w-[420px] text-sm">
                  <thead className="text-left text-xs uppercase tracking-wide text-muted">
                    <tr>
                      <th className="px-2 py-2">Réf.</th>
                      <th className="px-2 py-2">Client</th>
                      <th className="hidden px-2 py-2 sm:table-cell">Date</th>
                      <th className="px-2 py-2">Total</th>
                      <th className="px-2 py-2">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {recent.map((r) => {
                      const meta = statusMeta(r.status);
                      return (
                        <tr key={r.id} className="hover:bg-cream/50">
                          <td className="px-2 py-2.5">
                            <Link href={`/admin/demandes/${r.id}`} className="font-mono text-xs text-blue-deep hover:underline">{r.reference}</Link>
                          </td>
                          <td className="px-2 py-2.5">{r.first_name} {r.last_name}</td>
                          <td className="hidden px-2 py-2.5 text-muted sm:table-cell">{formatDate(r.created_at)}</td>
                          <td className="px-2 py-2.5 font-medium">{formatPrice(r.total)}</td>
                          <td className="px-2 py-2.5"><Badge tone={meta.tone}>{meta.label}</Badge></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </AdminCard>
        </div>

        {/* Aperçu */}
        <div className="space-y-4 self-start">
          <StatCard label="Visites aujourd'hui" value={sessionsToday ?? 0} href="/admin/statistiques" icon={<ActivityIcon size={18} />} />
          <StatCard label="Produits au catalogue" value={productsCount ?? 0} href="/admin/produits" icon={<PackageIcon size={18} />} />
          <Link href="/admin/statistiques" className="flex items-center justify-between rounded-2xl border border-line bg-white p-5 text-sm transition-colors hover:border-blue">
            <span className="font-medium text-ink">Voir toutes les statistiques</span>
            <ArrowRightIcon size={16} className="text-blue-deep" />
          </Link>
        </div>
      </div>
    </div>
  );
}
