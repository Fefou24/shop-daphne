import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/format";
import { PageHeader, StatCard, EmptyState } from "@/components/admin/ui";
import { DeviceMobileIcon, DesktopIcon, ActivityIcon } from "@/components/ui/icons";

export const dynamic = "force-dynamic";

function duration(start: string, end: string): string {
  const ms = new Date(end).getTime() - new Date(start).getTime();
  const s = Math.max(0, Math.round(ms / 1000));
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  return `${m}m ${s % 60}s`;
}

function DeviceTag({ device }: { device: string | null }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-ink-soft">
      {device === "mobile" ? <DeviceMobileIcon size={15} /> : <DesktopIcon size={15} />}
      {device}
    </span>
  );
}

export default async function TrackingPage() {
  const supabase = await createClient();
  const { data: sessions } = await supabase
    .from("tracking_sessions")
    .select("*")
    .order("last_seen_at", { ascending: false })
    .limit(200);

  const list = sessions ?? [];
  const today = new Date().toISOString().slice(0, 10);
  const todayCount = list.filter((s) => s.started_at.slice(0, 10) === today).length;
  const byDevice = list.reduce<Record<string, number>>((acc, s) => {
    const d = s.device ?? "—";
    acc[d] = (acc[d] ?? 0) + 1;
    return acc;
  }, {});
  const countries = list.reduce<Record<string, number>>((acc, s) => {
    const c = s.country ?? "—";
    acc[c] = (acc[c] ?? 0) + 1;
    return acc;
  }, {});
  const topCountries = Object.entries(countries).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div>
      <PageHeader title="Tracking & audience" subtitle="Sessions de visite, provenance, appareil — et replay de chaque session." />

      {/* Résumé */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Sessions (total)" value={list.length} icon={<ActivityIcon size={18} />} />
        <StatCard label="Aujourd'hui" value={todayCount} />
        <StatCard label="Sur mobile" value={byDevice["mobile"] ?? 0} icon={<DeviceMobileIcon size={18} />} />
        <StatCard label="Sur ordinateur" value={byDevice["ordinateur"] ?? 0} icon={<DesktopIcon size={18} />} />
      </div>

      {topCountries.length > 0 && (
        <div className="mb-8 rounded-2xl border border-line bg-white p-5">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">Pays</h2>
          <div className="flex flex-wrap gap-2">
            {topCountries.map(([c, n]) => (
              <span key={c} className="rounded-full bg-cream-deep px-3 py-1 text-sm">
                {flag(c)} {c} · <span className="font-medium">{n}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Sessions */}
      {list.length === 0 ? (
        <EmptyState title="Aucune session enregistrée." description="Les visites de votre boutique apparaîtront ici." icon={<ActivityIcon size={40} />} />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line bg-white">
          <table className="w-full text-sm">
            <thead className="bg-cream-deep text-left text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3">Visiteur</th>
                <th className="hidden px-4 py-3 sm:table-cell">Appareil</th>
                <th className="hidden px-4 py-3 md:table-cell">Provenance</th>
                <th className="px-4 py-3">Clics</th>
                <th className="px-4 py-3">Durée</th>
                <th className="hidden px-4 py-3 lg:table-cell">Dernière activité</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {list.map((s) => (
                <tr key={s.id} className="hover:bg-cream/50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink">{s.visitor_name ?? "Visiteur anonyme"}</p>
                    <p className="text-xs text-muted">{flag(s.country)} {s.country ?? "—"} · {s.entry_page}</p>
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell"><DeviceTag device={s.device} /></td>
                  <td className="hidden max-w-[160px] truncate px-4 py-3 text-muted md:table-cell">
                    {s.referrer || "Direct"}
                  </td>
                  <td className="px-4 py-3">{s.click_count}</td>
                  <td className="px-4 py-3">{duration(s.started_at, s.last_seen_at)}</td>
                  <td className="hidden px-4 py-3 text-muted lg:table-cell">{formatDate(s.last_seen_at)}</td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/tracking/${s.id}`} className="rounded-lg bg-blue-deep px-3 py-1.5 text-xs font-medium text-white hover:bg-ink">
                      ▶ Replay
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function flag(country: string | null): string {
  if (!country || country.length !== 2) return "🌍";
  return String.fromCodePoint(...[...country.toUpperCase()].map((c) => 127397 + c.charCodeAt(0)));
}
