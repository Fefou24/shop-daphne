import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AccountsManager } from "@/components/admin/AccountsManager";

export default async function AccountsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .order("role", { ascending: true });

  return (
    <div>
      <Link href="/super-admin" className="text-sm text-blue-deep hover:underline">
        ← Retour aux réglages
      </Link>
      <h1 className="mb-1 mt-2 font-serif text-3xl font-semibold text-ink">
        Comptes administrateurs
      </h1>
      <p className="mb-6 text-ink-soft">Gérez les accès à l&apos;administration.</p>

      <AccountsManager
        profiles={profiles ?? []}
        serviceKeyConfigured={!!process.env.SUPABASE_SERVICE_ROLE_KEY}
        currentUserId={user?.id ?? ""}
      />
    </div>
  );
}
