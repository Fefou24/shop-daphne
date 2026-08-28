"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PackageIcon } from "@/components/ui/icons";

export default function SuiviIndexPage() {
  const router = useRouter();
  const [ref, setRef] = useState("");

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center px-4 py-12">
      <div className="rounded-3xl border border-line bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-soft text-blue-deep">
          <PackageIcon size={28} />
        </div>
        <h1 className="section-title text-3xl">Suivre ma commande</h1>
        <p className="mb-6 mt-2 text-sm text-ink-soft">
          Entrez le numéro de votre commande (ex&nbsp;: BC-AB12CD) pour suivre son
          avancement.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (ref.trim()) router.push(`/suivi/${ref.trim().toUpperCase()}`);
          }}
          className="space-y-3"
        >
          <input
            value={ref}
            onChange={(e) => setRef(e.target.value)}
            placeholder="BC-XXXXXX"
            className="w-full rounded-xl border border-line bg-cream px-4 py-3 text-center font-mono outline-none focus:border-blue"
          />
          <button type="submit" className="btn btn-primary w-full py-3.5">
            Suivre ma commande
          </button>
        </form>
      </div>
    </div>
  );
}
