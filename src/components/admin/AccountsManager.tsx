"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  createStaffAccount,
  updateStaffRole,
  deleteStaffAccount,
} from "@/app/super-admin/(panel)/actions";
import type { Profile } from "@/lib/types";

export function AccountsManager({
  profiles,
  serviceKeyConfigured,
  currentUserId,
}: {
  profiles: Profile[];
  serviceKeyConfigured: boolean;
  currentUserId: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState({
    email: "",
    password: "",
    full_name: "",
    role: "admin" as "admin" | "super_admin",
  });
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const res = await createStaffAccount(form);
    if (res.ok) {
      setMsg({ type: "ok", text: "Compte créé." });
      setForm({ email: "", password: "", full_name: "", role: "admin" });
      router.refresh();
    } else {
      setMsg({ type: "err", text: res.error });
    }
  }

  return (
    <div className="space-y-8">
      {/* Liste */}
      <div className="space-y-3">
        {profiles.map((p) => (
          <div key={p.id} className="flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-white p-4">
            <div className="min-w-0 flex-1">
              <p className="font-medium text-ink">{p.full_name || "—"}</p>
              <p className="text-sm text-muted">{p.email}</p>
            </div>
            <select
              defaultValue={p.role}
              disabled={pending || p.id === currentUserId}
              onChange={(e) =>
                startTransition(() =>
                  updateStaffRole(p.id, e.target.value as "client" | "admin" | "super_admin"),
                )
              }
              className="rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-blue disabled:opacity-60"
            >
              <option value="client">Client</option>
              <option value="admin">Admin</option>
              <option value="super_admin">Super admin</option>
            </select>
            {p.id !== currentUserId && serviceKeyConfigured && (
              <button
                onClick={() => {
                  if (confirm(`Supprimer le compte ${p.email} ?`))
                    startTransition(async () => {
                      await deleteStaffAccount(p.id);
                      router.refresh();
                    });
                }}
                className="rounded-lg border border-line px-3 py-2 text-xs text-blush hover:bg-blush-soft"
              >
                Supprimer
              </button>
            )}
            {p.id === currentUserId && (
              <span className="rounded-full bg-cream-deep px-3 py-1 text-xs text-muted">Vous</span>
            )}
          </div>
        ))}
      </div>

      {/* Création */}
      <div className="rounded-2xl border border-line bg-white p-6">
        <h2 className="mb-1 font-serif text-xl font-semibold text-ink">Créer un compte</h2>
        {!serviceKeyConfigured && (
          <p className="mb-4 rounded-xl bg-blush-soft px-4 py-3 text-sm text-ink">
            ⚠️ Pour créer ou supprimer des comptes, ajoutez la variable
            d&apos;environnement <code className="font-mono">SUPABASE_SERVICE_ROLE_KEY</code>{" "}
            (Supabase → Project Settings → API → service_role) sur Vercel et en local.
          </p>
        )}
        <form onSubmit={create} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <input required placeholder="Nom complet" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="rounded-xl border border-line bg-cream px-4 py-3 text-sm outline-none focus:border-blue" />
            <input required type="email" placeholder="E-mail" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="rounded-xl border border-line bg-cream px-4 py-3 text-sm outline-none focus:border-blue" />
            <input required type="text" placeholder="Mot de passe provisoire" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="rounded-xl border border-line bg-cream px-4 py-3 text-sm outline-none focus:border-blue" />
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as "admin" | "super_admin" })} className="rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-blue">
              <option value="admin">Admin</option>
              <option value="super_admin">Super admin</option>
            </select>
          </div>
          {msg && (
            <p className={`text-sm ${msg.type === "ok" ? "text-blue-deep" : "text-blush"}`}>{msg.text}</p>
          )}
          <button type="submit" disabled={!serviceKeyConfigured} className="btn btn-primary px-6 py-3 disabled:opacity-50">
            Créer le compte
          </button>
        </form>
      </div>
    </div>
  );
}
