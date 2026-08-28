"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const params = useSearchParams();
  const redirectTo = params.get("next") || "/compte";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();

    if (mode === "signup") {
      const { error: signErr } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName, role: "client" } },
      });
      if (signErr) {
        setError(traduire(signErr.message));
        setLoading(false);
        return;
      }
    }

    const { error: loginErr } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (loginErr) {
      setError(traduire(loginErr.message));
      setLoading(false);
      return;
    }
    // Navigation complète : garantit que le cookie de session est transmis au middleware
    window.location.assign(redirectTo);
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
      <div className="rounded-3xl border border-line bg-white p-8 shadow-sm">
        <div className="mb-6 flex justify-center">
          <Image src="/images/brand/logo.png" alt="Beauty Concept" width={180} height={80} className="h-16 w-auto object-contain" />
        </div>
        <h1 className="text-center font-serif text-3xl font-semibold text-ink">
          {mode === "login" ? "Connexion" : "Créer un compte"}
        </h1>
        <p className="mb-6 mt-1 text-center text-sm text-muted">
          {mode === "login"
            ? "Accédez à votre compte et suivez vos commandes."
            : "Pour suivre vos commandes et garder votre panier."}
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <Field label="Prénom et nom" value={fullName} onChange={setFullName} required />
          )}
          <Field label="E-mail" type="email" value={email} onChange={setEmail} required />
          <Field label="Mot de passe" type="password" value={password} onChange={setPassword} required />
          {error && <p className="text-sm text-blush">{error}</p>}
          <button type="submit" disabled={loading} className="btn btn-primary w-full py-3.5">
            {loading ? "Veuillez patienter…" : mode === "login" ? "Se connecter" : "Créer mon compte"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-muted">
          {mode === "login" ? (
            <>
              Pas encore de compte ?{" "}
              <Link href="/inscription" className="text-blue-deep hover:underline">
                Inscrivez-vous
              </Link>
            </>
          ) : (
            <>
              Déjà un compte ?{" "}
              <Link href="/connexion" className="text-blue-deep hover:underline">
                Connectez-vous
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

function traduire(msg: string): string {
  if (/already registered|already exists/i.test(msg))
    return "Un compte existe déjà avec cet e-mail.";
  if (/Invalid login credentials/i.test(msg))
    return "E-mail ou mot de passe incorrect.";
  if (/at least 6/i.test(msg))
    return "Le mot de passe doit contenir au moins 6 caractères.";
  return "Une erreur est survenue. Réessayez.";
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-ink">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm outline-none focus:border-blue"
      />
    </div>
  );
}
