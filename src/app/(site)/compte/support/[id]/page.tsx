import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Chat } from "@/components/support/Chat";

export const metadata = { title: "Conversation support" };

export default async function ClientTicketPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/connexion?next=/compte/support/${id}`);

  const { data: ticket } = await supabase
    .from("support_tickets")
    .select("*")
    .eq("id", id)
    .single();
  if (!ticket) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link href="/compte/support" className="text-sm text-blue-deep hover:underline">
        ← Mes tickets
      </Link>
      <h1 className="mb-1 mt-2 font-serif text-2xl font-semibold text-ink">{ticket.subject}</h1>
      <p className="mb-5 text-sm text-muted">Échangez avec l&apos;équipe Beauty Concept.</p>
      <Chat ticketId={ticket.id} role="client" currentUserId={user.id} />
    </div>
  );
}
