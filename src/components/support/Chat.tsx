"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { SupportMessage } from "@/lib/types";
import { formatDate } from "@/lib/format";
import { CloseIcon } from "@/components/ui/icons";

function linkify(text: string) {
  const parts = text.split(/(https?:\/\/[^\s]+)/g);
  return parts.map((p, i) =>
    /^https?:\/\//.test(p) ? (
      <a key={i} href={p} target="_blank" rel="noreferrer" className="underline">
        {p}
      </a>
    ) : (
      <span key={i}>{p}</span>
    ),
  );
}

export function Chat({
  ticketId,
  role,
  currentUserId,
}: {
  ticketId: string;
  role: "client" | "admin";
  currentUserId: string;
}) {
  const supabase = useRef(createClient());
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [body, setBody] = useState("");
  const [attachments, setAttachments] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [sending, setSending] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const scrollDown = useCallback(() => {
    requestAnimationFrame(() => {
      const el = listRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    });
  }, []);

  useEffect(() => {
    const sb = supabase.current;
    let active = true;
    (async () => {
      const { data } = await sb
        .from("support_messages")
        .select("*")
        .eq("ticket_id", ticketId)
        .order("created_at", { ascending: true });
      if (active && data) {
        setMessages(data);
        scrollDown();
      }
    })();

    const channel = sb
      .channel(`ticket-${ticketId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "support_messages", filter: `ticket_id=eq.${ticketId}` },
        (payload) => {
          setMessages((prev) => {
            const m = payload.new as SupportMessage;
            if (prev.some((x) => x.id === m.id)) return prev;
            return [...prev, m];
          });
          scrollDown();
        },
      )
      .subscribe();

    return () => {
      active = false;
      sb.removeChannel(channel);
    };
  }, [ticketId, scrollDown]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    const sb = supabase.current;
    const urls: string[] = [];
    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const path = `${ticketId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await sb.storage.from("support-attachments").upload(path, file);
      if (!error) {
        urls.push(sb.storage.from("support-attachments").getPublicUrl(path).data.publicUrl);
      }
    }
    setAttachments((a) => [...a, ...urls]);
    setUploading(false);
  }

  async function send() {
    if (!body.trim() && attachments.length === 0) return;
    setSending(true);
    const sb = supabase.current;
    const { error } = await sb.from("support_messages").insert({
      ticket_id: ticketId,
      sender_id: currentUserId,
      sender_role: role,
      body: body.trim() || null,
      attachments,
    });
    if (!error) {
      setBody("");
      setAttachments([]);
    }
    setSending(false);
  }

  return (
    <div className="flex h-[70vh] flex-col overflow-hidden rounded-2xl border border-line bg-white">
      {/* Fil */}
      <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 && (
          <p className="py-8 text-center text-sm text-muted">
            Aucun message pour l&apos;instant. Écrivez le premier !
          </p>
        )}
        {messages.map((m) => {
          const mine = m.sender_role === role;
          const atts = Array.isArray(m.attachments) ? (m.attachments as string[]) : [];
          return (
            <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[78%] rounded-2xl px-4 py-2.5 ${mine ? "bg-blue-deep text-white" : "bg-cream-deep text-ink"}`}>
                {!mine && (
                  <p className="mb-0.5 text-[11px] font-medium opacity-70">
                    {m.sender_role === "admin" ? "Beauty Concept" : "Client"}
                  </p>
                )}
                {m.body && <p className="whitespace-pre-wrap text-sm">{linkify(m.body)}</p>}
                {atts.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {atts.map((url) => (
                      <a key={url} href={url} target="_blank" rel="noreferrer" className="block">
                        <Image src={url} alt="pièce jointe" width={160} height={160} className="h-28 w-28 rounded-lg object-cover" />
                      </a>
                    ))}
                  </div>
                )}
                <p className={`mt-1 text-[10px] ${mine ? "text-white/60" : "text-muted"}`}>{formatDate(m.created_at)}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Composer */}
      <div className="border-t border-line p-3">
        {attachments.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {attachments.map((url) => (
              <div key={url} className="relative">
                <Image src={url} alt="" width={56} height={56} className="h-14 w-14 rounded-lg object-cover" />
                <button
                  onClick={() => setAttachments((a) => a.filter((x) => x !== url))}
                  className="absolute -right-1 -top-1 rounded-full bg-white p-0.5 text-blush shadow"
                >
                  <CloseIcon size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="flex items-end gap-2">
          <label className="cursor-pointer rounded-xl border border-line px-3 py-2.5 text-sm text-ink-soft hover:bg-cream-deep">
            {uploading ? "…" : "📎"}
            <input type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" />
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            rows={1}
            placeholder="Votre message…"
            className="max-h-32 flex-1 resize-none rounded-xl border border-line bg-cream px-4 py-2.5 text-sm outline-none focus:border-blue"
          />
          <button
            onClick={send}
            disabled={sending || (!body.trim() && attachments.length === 0)}
            className="btn btn-primary px-5 py-2.5 text-sm disabled:opacity-50"
          >
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
}
