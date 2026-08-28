"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function NewTicketForm({ userId }: { userId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const sb = createClient();
    const { data: ticket, error: tErr } = await sb
      .from("support_tickets")
      .insert({ user_id: userId, subject: subject.trim(), last_sender_role: "client" })
      .select("id")
      .single();
    if (tErr || !ticket) {
      setError("Impossible de créer le ticket. Réessayez.");
      setLoading(false);
      return;
    }
    if (message.trim()) {
      await sb.from("support_messages").insert({
        ticket_id: ticket.id,
        sender_id: userId,
        sender_role: "client",
        body: message.trim(),
      });
    }
    router.push(`/compte/support/${ticket.id}`);
    router.refresh();
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="btn btn-primary px-5 py-2.5 text-sm">
        + Nouveau ticket
      </button>
    );
  }

  return (
    <form onSubmit={create} className="space-y-3 rounded-2xl border border-line bg-white p-5">
      <h2 className="font-serif text-xl font-semibold">Nouvelle demande de support</h2>
      <input
        required
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="Sujet (ex. Question sur ma commande)"
        className="w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm outline-none focus:border-blue"
      />
      <textarea
        required
        rows={4}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Décrivez votre demande…"
        className="w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm outline-none focus:border-blue"
      />
      {error && <p className="text-sm text-blush">{error}</p>}
      <div className="flex gap-2">
        <button type="submit" disabled={loading} className="btn btn-primary px-6 py-2.5 text-sm">
          {loading ? "Création…" : "Ouvrir le ticket"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="btn btn-outline px-6 py-2.5 text-sm">
          Annuler
        </button>
      </div>
    </form>
  );
}
