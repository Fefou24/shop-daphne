import { Suspense } from "react";
import { PromoBar } from "@/components/layout/PromoBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { TrackingProvider } from "@/components/tracking/TrackingProvider";
import { SettingsProvider } from "@/context/SettingsContext";
import { getSettings } from "@/lib/data";

export const revalidate = 300;

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();
  const shipping = settings
    ? {
        shipping_fee: settings.shipping_fee,
        free_shipping_threshold: settings.free_shipping_threshold,
        tax_rate: settings.tax_rate,
        local_delivery_enabled: settings.local_delivery_enabled,
        carrier_enabled: settings.carrier_enabled,
        cash_enabled: settings.cash_enabled,
        stripe_enabled: settings.stripe_enabled,
        carrier_name: settings.carrier_name,
      }
    : null;

  return (
    <SettingsProvider value={shipping}>
      <div className="flex min-h-screen flex-col">
        {settings?.promo_bar_enabled && settings.promo_bar_text && (
          <PromoBar text={settings.promo_bar_text} />
        )}
        <Header />
        <main className="flex-1">{children}</main>
        <Footer settings={settings} />
        <CartDrawer />
        <Suspense>
          <TrackingProvider />
        </Suspense>
      </div>
    </SettingsProvider>
  );
}
