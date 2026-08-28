import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Chat } from "@/components/support/Chat";
import { TicketStatusControl } from "@/components/admin/TicketStatusControl";

export default async function AdminTicketPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: ticket } = await supabase
    .from("support_tickets")
    .select("*")
    .eq("id", id)
    .single();
  if (!ticket) notFound();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", ticket.user_id)
    .single();

  return (
    <div>
      <Link href="/admin/support" className="text-sm text-blue-deep hover:underline">
        ← Tous les tickets
      </Link>
      <div className="mt-2 mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-ink">{ticket.subject}</h1>
          <p className="text-sm text-muted">
            {profile?.full_name || "Client"}
            {profile?.email && (
              <>
                {" · "}
                <a href={`mailto:${profile.email}`} className="hover:text-blue-deep">{profile.email}</a>
              </>
            )}
          </p>
        </div>
        <TicketStatusControl id={ticket.id} current={ticket.status} />
      </div>
      <Chat ticketId={ticket.id} role="admin" currentUserId={user!.id} />
    </div>
  );
}
