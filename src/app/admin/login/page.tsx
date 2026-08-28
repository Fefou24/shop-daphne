"use client";

import Image from "next/image";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error || !data.user) {
      setError("E-mail ou mot de passe incorrect.");
      setLoading(false);
      return;
    }
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();
    if (profile?.role !== "admin" && profile?.role !== "super_admin") {
      setError("Ce compte n'a pas accès à l'administration.");
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }
    window.location.assign("/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream-deep px-4">
      <div className="w-full max-w-sm rounded-3xl border border-line bg-white p-8 shadow-sm">
        <div className="mb-6 flex justify-center">
          <Image
            src="/images/brand/logo.png"
            alt="Beauty Concept"
            width={160}
            height={64}
            className="h-16 w-auto object-contain"
          />
        </div>
        <h1 className="text-center font-serif text-2xl font-semibold text-ink">
          Espace administration
        </h1>
        <p className="mb-6 mt-1 text-center text-sm text-muted">
          Connectez-vous pour gérer la boutique
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-ink">E-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm outline-none focus:border-blue"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ink">Mot de passe</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm outline-none focus:border-blue"
            />
          </div>
          {error && <p className="text-sm text-blush">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full py-3.5"
          >
            {loading ? "Connexion…" : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
