import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/format";
import { SessionReplay } from "@/components/admin/SessionReplay";

export default async function ReplayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const [{ data: session }, { data: events }] = await Promise.all([
    supabase.from("tracking_sessions").select("*").eq("id", id).single(),
    supabase.from("tracking_events").select("*").eq("session_id", id).order("t", { ascending: true }).limit(5000),
  ]);

  if (!session) notFound();

  const pages = new Set((events ?? []).filter((e) => e.type === "page_view").map((e) => e.page));

  return (
    <div>
      <Link href="/admin/tracking" className="text-sm text-blue-deep hover:underline">
        ← Retour au tracking
      </Link>
      <div className="mt-2 mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-ink">
            {session.visitor_name ?? "Visiteur anonyme"}
          </h1>
          <p className="text-sm text-muted">
            {session.device} · {session.country ?? "—"} · {(events ?? []).length} événements ·{" "}
            {session.click_count} clics · démarré le {formatDate(session.started_at)}
          </p>
          <p className="text-sm text-muted">
            Provenance : {session.referrer || "Direct"}
          </p>
        </div>
      </div>

      {(events ?? []).length === 0 ? (
        <p className="rounded-2xl border border-line bg-white p-6 text-ink-soft">
          Pas d&apos;événement enregistré pour cette session.
        </p>
      ) : (
        <SessionReplay session={session} events={events ?? []} />
      )}

      {pages.size > 0 && (
        <div className="mt-6 rounded-2xl border border-line bg-white p-5">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">Pages visitées</h2>
          <ul className="flex flex-wrap gap-2">
            {[...pages].map((p) => (
              <li key={p} className="rounded-full bg-cream-deep px-3 py-1 font-mono text-xs text-ink">{p}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
