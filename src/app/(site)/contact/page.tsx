import { getSettings } from "@/lib/data";
import { ProsePage } from "@/components/layout/Prose";
import { WhatsAppIcon } from "@/components/ui/icons";

export const metadata = { title: "Nous contacter" };

export default async function ContactPage() {
  const settings = await getSettings();
  return (
    <ProsePage
      title="Nous contacter"
      intro="Une question sur nos produits, votre commande ou un conseil personnalisé ? Le plus simple est de nous écrire via notre chaîne WhatsApp."
    >
      {settings?.whatsapp_url && (
        <a
          href={settings.whatsapp_url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-medium text-white no-underline transition-opacity hover:opacity-90"
        >
          <WhatsAppIcon size={20} /> Rejoindre la chaîne WhatsApp
        </a>
      )}
      <p>
        Beauty Concept est une marque française créée par Daphné, 14 ans. Nous
        répondons à vos messages directement sur WhatsApp, où nous partageons
        aussi nos nouveautés et nos conseils.
      </p>
      <p>
        Vous souhaitez un soin adapté à vos cheveux ? Découvrez notre{" "}
        <a href="/sur-mesure" className="text-blue-deep underline">
          demande de produit sur-mesure
        </a>
        .
      </p>
    </ProsePage>
  );
}
