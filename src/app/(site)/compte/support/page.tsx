import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/format";
import { NewTicketForm } from "@/components/support/NewTicketForm";

export const metadata = { title: "Support" };

const STATUS: Record<string, { label: string; color: string }> = {
  ouvert: { label: "Ouvert", color: "bg-blue-soft text-blue-deep" },
  en_cours: { label: "Réponse reçue", color: "bg-[#cfe6d6] text-[#2f7a4a]" },
  resolu: { label: "Résolu", color: "bg-cream-deep text-muted" },
};

export default async function SupportPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/connexion?next=/compte/support");

  const { data: tickets } = await supabase
    .from("support_tickets")
    .select("*")
    .eq("user_id", user.id)
    .order("last_message_at", { ascending: false });

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/compte" className="text-sm text-blue-deep hover:underline">← Mon compte</Link>
          <h1 className="section-title mt-1 text-4xl">Support</h1>
          <p className="text-ink-soft">Une question ? Échangez avec l'équipe Beauty Concept en direct.</p>
        </div>
        <NewTicketForm userId={user.id} />
      </div>

      {!tickets || tickets.length === 0 ? (
        <p className="rounded-2xl border border-line bg-white p-6 text-ink-soft">
          Vous n&apos;avez pas encore de ticket. Ouvrez-en un avec le bouton ci-dessus.
        </p>
      ) : (
        <div className="space-y-3">
          {tickets.map((t) => {
            const s = STATUS[t.status] ?? STATUS.ouvert;
            return (
              <Link
                key={t.id}
                href={`/compte/support/${t.id}`}
                className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-white p-4 transition-colors hover:border-blue"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-ink">{t.subject}</p>
                  <p className="text-xs text-muted">Dernier message : {formatDate(t.last_message_at)}</p>
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
