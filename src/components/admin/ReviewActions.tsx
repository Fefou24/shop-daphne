"use client";

import { useTransition } from "react";
import { approveReview, deleteReview } from "@/app/admin/(panel)/avis/actions";

export function ReviewActions({
  id,
  productId,
  approved,
}: {
  id: string;
  productId: string | null;
  approved: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex gap-2">
      {!approved && (
        <button
          disabled={pending}
          onClick={() => startTransition(() => approveReview(id, productId))}
          className="rounded-lg bg-blue-deep px-3 py-1.5 text-xs font-medium text-white hover:bg-ink disabled:opacity-50"
        >
          Approuver
        </button>
      )}
      <button
        disabled={pending}
        onClick={() => {
          if (confirm("Supprimer cet avis ?"))
            startTransition(() => deleteReview(id, productId));
        }}
        className="rounded-lg border border-line px-3 py-1.5 text-xs text-blush hover:bg-blush-soft disabled:opacity-50"
      >
        Supprimer
      </button>
    </div>
  );
}
