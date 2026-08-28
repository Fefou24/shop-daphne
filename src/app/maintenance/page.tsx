import Image from "next/image";
import { getSettings } from "@/lib/data";
import { SparkleIcon } from "@/components/ui/icons";

export const metadata = { title: "Site en maintenance" };

export default async function MaintenancePage() {
  const settings = await getSettings();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream-deep px-6 text-center">
      <Image
        src="/images/brand/logo.png"
        alt="Beauty Concept"
        width={200}
        height={80}
        className="h-20 w-auto object-contain"
      />
      <SparkleIcon size={36} className="mt-10 text-blue-deep" />
      <h1 className="section-title mt-6 text-4xl sm:text-5xl">
        Nous revenons très vite
      </h1>
      <p className="mt-4 max-w-md text-ink-soft">
        {settings?.maintenance_message ??
          "Notre boutique fait peau neuve. Nous revenons très vite !"}
      </p>
      {settings?.contact_email && (
        <p className="mt-8 text-sm text-muted">
          Une question ?{" "}
          <a href={`mailto:${settings.contact_email}`} className="text-blue-deep underline">
            {settings.contact_email}
          </a>
        </p>
      )}
    </div>
  );
}
