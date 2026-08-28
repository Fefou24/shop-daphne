"use client";

import { useState, useTransition } from "react";
import {
  updateRequestStatus,
  togglePaid,
  setEstimatedDelivery,
} from "@/app/admin/(panel)/demandes/actions";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/status";
import type { Enums } from "@/lib/database.types";
import { Switch } from "@/components/ui/Switch";

export function OrderAdminControls({
  id,
  status,
  isPaid,
  estimatedDelivery,
}: {
  id: string;
  status: OrderStatus;
  isPaid: boolean;
  estimatedDelivery: string | null;
}) {
  const [pending, startTransition] = useTransition();
  const [date, setDate] = useState(estimatedDelivery ?? "");

  return (
    <div className="space-y-5 rounded-2xl border border-line bg-white p-5">
      <div>
        <p className="mb-2 text-sm font-medium text-ink">Statut de la commande</p>
        <div className="flex flex-wrap gap-2">
          {ORDER_STATUSES.map((s) => (
            <button
              key={s.value}
              disabled={pending}
              onClick={() =>
                startTransition(() =>
                  updateRequestStatus(id, s.value as Enums<"order_status">),
                )
              }
              className={`rounded-full px-3.5 py-2 text-xs font-medium transition-all ${
                status === s.value
                  ? `${s.color} ring-2 ring-blue-deep ring-offset-1`
                  : "bg-cream-deep text-ink-soft hover:bg-sand"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-line pt-4">
        <div>
          <p className="text-sm font-medium text-ink">Paiement</p>
          <p className="text-xs text-muted">{isPaid ? "Marquée comme payée" : "En attente de paiement"}</p>
        </div>
        <Switch
          checked={isPaid}
          disabled={pending}
          color="green"
          onChange={() => startTransition(() => togglePaid(id, !isPaid))}
        />
      </div>

      <div className="border-t border-line pt-4">
        <p className="mb-1 text-sm font-medium text-ink">Date de livraison estimée</p>
        <div className="flex gap-2">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="flex-1 rounded-xl border border-line bg-white px-4 py-2.5 text-sm outline-none focus:border-blue"
          />
          <button
            disabled={pending}
            onClick={() => startTransition(() => setEstimatedDelivery(id, date || null))}
            className="rounded-xl bg-blue-deep px-4 py-2.5 text-sm font-medium text-white hover:bg-ink"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}
