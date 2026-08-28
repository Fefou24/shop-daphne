import Link from "next/link";
import { getSettings } from "@/lib/data";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { PageHeader } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function SuperAdminPage() {
  const settings = await getSettings();
  if (!settings) {
    return <p className="text-ink-soft">Réglages introuvables.</p>;
  }

  return (
    <div>
      <PageHeader title="Super administration" subtitle="Réglages techniques du site.">
        <Link href="/super-admin/comptes" className="btn btn-outline px-4 py-2.5 text-sm">Comptes</Link>
        <Link href="/super-admin/journal" className="btn btn-outline px-4 py-2.5 text-sm">Journal</Link>
      </PageHeader>

      <SettingsForm settings={settings} />
    </div>
  );
}
