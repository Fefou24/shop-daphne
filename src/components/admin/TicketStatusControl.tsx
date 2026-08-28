"use client";

import { useTransition } from "react";
import { updateTicketStatus } from "@/app/admin/(panel)/support/actions";

const OPTIONS = [
  { value: "ouvert", label: "Ouvert" },
  { value: "en_cours", label: "En cours" },
  { value: "resolu", label: "Résolu" },
];

export function TicketStatusControl({ id, current }: { id: string; current: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <select
      defaultValue={current}
      disabled={pending}
      onChange={(e) => startTransition(() => updateTicketStatus(id, e.target.value))}
      className="rounded-xl border border-line bg-white px-3 py-2 text-sm outline-none focus:border-blue"
    >
      {OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}
