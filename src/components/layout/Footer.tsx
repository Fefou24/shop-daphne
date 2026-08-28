import Image from "next/image";
import Link from "next/link";
import type { SiteSettings } from "@/lib/types";
import { WhatsAppIcon } from "@/components/ui/icons";
import { NewsletterForm } from "./NewsletterForm";

export function Footer({ settings }: { settings: SiteSettings | null }) {
  return (
    <footer className="mt-20">
      {/* Newsletter */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-blue-deep px-6 py-10 text-white sm:px-12">
          <div className="relative z-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <h2 className="max-w-md font-serif text-3xl font-semibold sm:text-4xl">
              Restez informé·e de nos nouveautés et conseils beauté
            </h2>
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* Liens */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5">
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Image
              src="/images/brand/logo.png"
              alt="Beauty Concept"
              width={200}
              height={88}
              className="h-20 w-auto object-contain"
            />
            <p className="mt-3 max-w-xs text-sm text-ink-soft">
              Des soins capillaires d&apos;origine naturelle, imaginés en France
              par Daphné, 14 ans, pour révéler la beauté de tous les cheveux.
            </p>
            {settings?.whatsapp_url && (
              <a
                href={settings.whatsapp_url}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                <WhatsAppIcon size={18} /> Suivre sur WhatsApp
              </a>
            )}
          </div>

          <FooterCol title="Boutique" links={[
            { href: "/produits", label: "Tous les produits" },
            { href: "/produits?cat=soin", label: "Soins" },
            { href: "/produits?cat=coiffage", label: "Coiffage" },
            { href: "/sur-mesure", label: "Produit sur-mesure" },
          ]} />
          <FooterCol title="Mon espace" links={[
            { href: "/compte", label: "Mon compte" },
            { href: "/suivi", label: "Suivre ma commande" },
            { href: "/connexion", label: "Connexion" },
          ]} />
          <FooterCol title="Aide" links={[
            { href: "/notre-histoire", label: "Notre histoire" },
            { href: "/contact", label: "Nous contacter" },
            { href: "/faq", label: "FAQ" },
          ]} />
          <FooterCol title="Informations" links={[
            { href: "/mentions-legales", label: "Mentions légales" },
            { href: "/cgv", label: "CGV" },
            { href: "/confidentialite", label: "Confidentialité" },
          ]} />
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-line pt-6 text-sm text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} Beauty Concept — A Hair Care Brand. Marque française 🇫🇷</p>
          {settings?.whatsapp_url && (
            <a href={settings.whatsapp_url} target="_blank" rel="noreferrer" className="hover:text-blue-deep">
              Nous contacter sur WhatsApp
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-ink">
        {title}
      </h3>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-sm text-ink-soft hover:text-blue-deep">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
