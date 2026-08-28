"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import {
  CartIcon,
  CloseIcon,
  MenuIcon,
  SearchIcon,
  UserIcon,
} from "@/components/ui/icons";

const NAV = [
  { href: "/produits", label: "La boutique" },
  { href: "/produits?cat=soin", label: "Soins" },
  { href: "/produits?cat=coiffage", label: "Coiffage" },
  { href: "/notre-histoire", label: "Notre histoire" },
  { href: "/compte/support", label: "Support" },
];

export function Header() {
  const { count, open } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/produits?q=${encodeURIComponent(search)}`);
    setMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-cream/90 backdrop-blur">
      <div className="mx-auto flex h-24 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <button
          className="lg:hidden"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Menu"
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>

        <Link href="/" className="flex shrink-0 items-center">
          <Image
            src="/images/brand/logo.png"
            alt="Beauty Concept"
            width={200}
            height={96}
            className="h-16 w-auto object-contain sm:h-[4.5rem]"
            priority
          />
        </Link>

        <nav className="ml-6 hidden items-center gap-7 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm transition-colors hover:text-blue-deep ${
                pathname === item.href ? "text-blue-deep" : "text-ink-soft"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <form
          onSubmit={submitSearch}
          className="ml-auto hidden max-w-xs flex-1 items-center gap-2 rounded-full bg-cream-deep px-4 py-2.5 md:flex"
        >
          <SearchIcon size={18} className="text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un produit…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
          />
        </form>

        <div className="ml-auto flex items-center gap-1 md:ml-3">
          <Link
            href="/compte"
            className="rounded-full p-2.5 text-ink transition-colors hover:bg-cream-deep"
            aria-label="Mon compte"
          >
            <UserIcon size={22} />
          </Link>
          <button
            onClick={open}
            className="relative rounded-full p-2.5 text-ink transition-colors hover:bg-cream-deep"
            aria-label="Panier"
          >
            <CartIcon size={22} />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-blush px-1 text-[11px] font-semibold text-white">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <div className="border-t border-line bg-cream lg:hidden">
          <form
            onSubmit={submitSearch}
            className="flex items-center gap-2 border-b border-line px-4 py-3"
          >
            <SearchIcon size={18} className="text-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher…"
              className="w-full bg-transparent text-sm outline-none"
            />
          </form>
          <nav className="flex flex-col px-4 py-2">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="border-b border-line/60 py-3 text-ink-soft"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
