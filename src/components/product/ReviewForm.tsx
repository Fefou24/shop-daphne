"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function ReviewForm({ productId }: { productId: string }) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    const supabase = createClient();
    const { error } = await supabase.from("reviews").insert({
      product_id: productId,
      author_name: name,
      location: location || null,
      rating,
      comment,
      is_approved: false,
    });
    setStatus(error ? "error" : "done");
  }

  if (status === "done") {
    return (
      <div className="rounded-2xl border border-line bg-cream-deep p-6 text-center text-ink-soft">
        Merci pour votre avis ! Il sera publié après validation. 💙
      </div>
    );
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="btn btn-outline px-6 py-3">
        Laisser un avis
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-2xl border border-line bg-white p-6">
      <div>
        <label className="mb-1 block text-sm font-medium">Votre note</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <button
              type="button"
              key={i}
              onClick={() => setRating(i)}
              className={`text-2xl ${i <= rating ? "text-gold" : "text-line"}`}
              aria-label={`${i} étoiles`}
            >
              ★
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Votre prénom"
          className="rounded-xl border border-line bg-cream px-4 py-3 text-sm outline-none focus:border-blue"
        />
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Votre ville (optionnel)"
          className="rounded-xl border border-line bg-cream px-4 py-3 text-sm outline-none focus:border-blue"
        />
      </div>
      <textarea
        required
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Partagez votre expérience…"
        rows={4}
        className="w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm outline-none focus:border-blue"
      />
      {status === "error" && (
        <p className="text-sm text-blush">Une erreur est survenue. Réessayez.</p>
      )}
      <div className="flex gap-3">
        <button type="submit" disabled={status === "loading"} className="btn btn-primary px-6 py-3">
          {status === "loading" ? "Envoi…" : "Publier mon avis"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="btn btn-outline px-6 py-3">
          Annuler
        </button>
      </div>
    </form>
  );
}
