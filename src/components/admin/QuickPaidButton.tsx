"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { togglePaid } from "@/app/admin/(panel)/demandes/actions";

export function QuickPaidButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  return (
    <button
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await togglePaid(id, true);
          router.refresh();
        })
      }
      className="rounded-lg bg-[#2f7a4a] px-3 py-1.5 text-xs font-medium text-white hover:opacity-90 disabled:opacity-50"
    >
      {pending ? "…" : "Marquer payé"}
    </button>
  );
}
