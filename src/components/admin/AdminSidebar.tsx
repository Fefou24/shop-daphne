"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  MenuIcon,
  CloseIcon,
  GridIcon,
  PackageIcon,
  MailIcon,
  StarOutlineIcon,
  SparkleIcon,
  ChartIcon,
  SettingsIcon,
  ChatIcon2,
  BriefcaseIcon,
  ActivityIcon,
  ExternalLinkIcon,
} from "@/components/ui/icons";

type Item = { href: string; label: string; Icon: React.ComponentType<{ size?: number; className?: string }> };
type Group = { label: string; items: Item[] };

export function AdminSidebar({ role, email }: { role: string; email: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const groups: Group[] = [
    {
      label: "Activité",
      items: [
        { href: "/admin", label: "Tableau de bord", Icon: GridIcon },
        { href: "/admin/affaires", label: "Affaires", Icon: BriefcaseIcon },
        { href: "/admin/statistiques", label: "Statistiques", Icon: ChartIcon },
      ],
    },
    {
      label: "Boutique",
      items: [
        { href: "/admin/demandes", label: "Commandes", Icon: MailIcon },
        { href: "/admin/produits", label: "Produits", Icon: PackageIcon },
        { href: "/admin/sur-mesure", label: "Sur-mesure", Icon: SparkleIcon },
        { href: "/admin/avis", label: "Avis", Icon: StarOutlineIcon },
      ],
    },
    {
      label: "Relation client",
      items: [{ href: "/admin/support", label: "Support", Icon: ChatIcon2 }],
    },
    {
      label: "Système",
      items: [
        { href: "/admin/tracking", label: "Tracking", Icon: ActivityIcon },
        { href: "/admin/reglages", label: "Réglages", Icon: SettingsIcon },
        ...(role === "super_admin"
          ? [{ href: "/super-admin", label: "Super admin", Icon: SettingsIcon }]
          : []),
      ],
    },
  ];

  async function signOut() {
    await createClient().auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  function isActive(href: string) {
    return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
  }

  return (
    <>
      {/* Barre mobile */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-white/90 px-4 py-3 backdrop-blur lg:hidden">
        <Image src="/images/brand/logo.png" alt="Beauty Concept" width={140} height={56} className="h-11 w-auto object-contain" />
        <button onClick={() => setOpen((v) => !v)} aria-label="Menu" className="rounded-lg p-1.5 hover:bg-cream-deep">
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      <aside
        className={`${open ? "block" : "hidden"} border-b border-line bg-white lg:fixed lg:inset-y-0 lg:left-0 lg:block lg:w-64 lg:border-b-0 lg:border-r`}
      >
        <div className="flex h-full flex-col p-4">
          <div className="mb-5 hidden px-2 pt-3 lg:block">
            <Image src="/images/brand/logo.png" alt="Beauty Concept" width={170} height={72} className="h-14 w-auto object-contain" />
          </div>

          <nav className="flex-1 space-y-5 overflow-y-auto">
            {groups.map((g) => (
              <div key={g.label}>
                <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-widest text-muted/70">
                  {g.label}
                </p>
                <div className="space-y-0.5">
                  {g.items.map(({ href, label, Icon }) => {
                    const active = isActive(href);
                    return (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => setOpen(false)}
                        className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                          active
                            ? "bg-blue-deep text-white shadow-sm"
                            : "text-ink-soft hover:bg-cream-deep hover:text-ink"
                        }`}
                      >
                        <Icon size={18} className={active ? "text-white" : "text-blue"} />
                        {label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          <div className="mt-4 rounded-2xl bg-cream-deep p-4">
            <p className="text-xs text-muted">Connecté·e</p>
            <p className="truncate text-sm font-medium text-ink">{email}</p>
            <p className="mb-3 text-xs font-medium text-blue-deep">
              {role === "super_admin" ? "Super administrateur" : "Administrateur"}
            </p>
            <div className="flex gap-2">
              <Link href="/" className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-white py-2 text-center text-xs text-ink-soft hover:text-blue-deep">
                <ExternalLinkIcon size={13} /> Site
              </Link>
              <button onClick={signOut} className="flex-1 rounded-lg bg-white py-2 text-center text-xs text-ink-soft hover:text-blush">
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
