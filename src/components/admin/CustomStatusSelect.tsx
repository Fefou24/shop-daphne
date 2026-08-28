"use client";

import { useTransition } from "react";
import { CUSTOM_STATUSES } from "@/lib/status";
import { updateCustomStatus } from "@/app/admin/(panel)/sur-mesure/actions";

export function CustomStatusSelect({ id, current }: { id: string; current: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <select
      defaultValue={current}
      disabled={pending}
      onChange={(e) => startTransition(() => updateCustomStatus(id, e.target.value))}
      className="rounded-xl border border-line bg-white px-3 py-2 text-sm outline-none focus:border-blue"
    >
      {CUSTOM_STATUSES.map((s) => (
        <option key={s.value} value={s.value}>{s.label}</option>
      ))}
    </select>
  );
}
