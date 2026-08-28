import { createClient } from "@/lib/supabase/server";
import { ShippingForm } from "@/components/admin/ShippingForm";
import { PageHeader } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const { data: settings } = await supabase.from("site_settings").select("*").eq("id", 1).single();

  return (
    <div>
      <PageHeader title="Réglages" subtitle="Livraison locale et transporteur appliqués aux commandes." />
      {settings && <ShippingForm settings={settings} />}
    </div>
  );
}
