"use client";

import { useTransition } from "react";
import { ORDER_STATUSES } from "@/lib/status";
import { updateRequestStatus } from "@/app/admin/(panel)/demandes/actions";
import type { Enums } from "@/lib/database.types";

export function RequestStatusSelect({
  id,
  current,
}: {
  id: string;
  current: Enums<"order_status">;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <select
      defaultValue={current}
      disabled={pending}
      onChange={(e) =>
        startTransition(() =>
          updateRequestStatus(id, e.target.value as Enums<"order_status">),
        )
      }
      className="rounded-xl border border-line bg-white px-4 py-2.5 text-sm outline-none focus:border-blue"
    >
      {ORDER_STATUSES.map((s) => (
        <option key={s.value} value={s.value}>
          {s.label}
        </option>
      ))}
    </select>
  );
}
