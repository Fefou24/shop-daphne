"use client";

import { useState } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (email) setSent(true);
      }}
      className="w-full max-w-sm space-y-3"
    >
      {sent ? (
        <p className="rounded-full bg-white/15 px-5 py-3 text-center text-sm">
          Merci ! Vous êtes bien inscrit·e ✨
        </p>
      ) : (
        <>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Votre adresse e-mail"
            className="w-full rounded-full bg-white px-5 py-3 text-sm text-ink outline-none placeholder:text-muted"
          />
          <button
            type="submit"
            className="w-full rounded-full bg-white px-5 py-3 text-sm font-semibold text-blue-deep transition-colors hover:bg-cream-deep"
          >
            S&apos;abonner à la newsletter
          </button>
        </>
      )}
    </form>
  );
}
