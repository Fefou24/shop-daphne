import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/format";
import { PageHeader, EmptyState } from "@/components/admin/ui";
import { ChatIcon2 } from "@/components/ui/icons";

export const dynamic = "force-dynamic";

const STATUS: Record<string, { label: string; color: string }> = {
  ouvert: { label: "Ouvert", color: "bg-blue-soft text-blue-deep" },
  en_cours: { label: "En cours", color: "bg-[#f4e7c9] text-[#8a6d2f]" },
  resolu: { label: "Résolu", color: "bg-cream-deep text-muted" },
};

export default async function AdminSupportPage() {
  const supabase = await createClient();
  const { data: tickets } = await supabase
    .from("support_tickets")
    .select("*")
    .order("last_message_at", { ascending: false });

  const list = tickets ?? [];
  const userIds = [...new Set(list.map((t) => t.user_id))];
  const names = new Map<string, string>();
  if (userIds.length) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, email")
      .in("id", userIds);
    (profiles ?? []).forEach((p) => names.set(p.id, p.full_name || p.email || "Client"));
  }

  const waiting = list.filter((t) => t.last_sender_role === "client" && t.status !== "resolu");

  return (
    <div>
      <PageHeader
        title="Support"
        subtitle={
          waiting.length > 0
            ? `${waiting.length} conversation(s) en attente de réponse.`
            : "Conversations avec vos clientes."
        }
      />

      {list.length === 0 ? (
        <EmptyState title="Aucun ticket pour le moment." icon={<ChatIcon2 size={40} />} />
      ) : (
        <div className="space-y-3">
          {list.map((t) => {
            const s = STATUS[t.status] ?? STATUS.ouvert;
            const awaiting = t.last_sender_role === "client" && t.status !== "resolu";
            return (
              <Link
                key={t.id}
                href={`/admin/support/${t.id}`}
                className={`flex items-center justify-between gap-3 rounded-2xl border bg-white p-4 transition-colors hover:border-blue ${
                  awaiting ? "border-blush/60" : "border-line"
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-medium text-ink">{t.subject}</p>
                    {awaiting && <span className="h-2 w-2 shrink-0 rounded-full bg-blush" />}
                  </div>
                  <p className="text-xs text-muted">
                    {names.get(t.user_id) ?? "Client"} · {formatDate(t.last_message_at)}
                  </p>
                </div>
                <span className={`shrink-0 rounded-full px-3 py-1 text-xs ${s.color}`}>{s.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
