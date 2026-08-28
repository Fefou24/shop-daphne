import { ORDER_FLOW, flowIndex, type OrderStatus } from "@/lib/status";
import { formatDate } from "@/lib/format";

export function OrderTimeline({
  status,
  history,
}: {
  status: OrderStatus;
  history?: { status: string; created_at: string }[];
}) {
  if (status === "annulee") {
    return (
      <div className="rounded-2xl border border-blush bg-blush-soft/40 p-5 text-center">
        <p className="font-medium text-ink">Commande annulée</p>
      </div>
    );
  }

  const current = flowIndex(status);
  const dateFor = (s: string) =>
    history?.find((h) => h.status === s)?.created_at;

  return (
    <ol className="relative space-y-0">
      {ORDER_FLOW.map((step, i) => {
        const done = i <= current;
        const active = i === current;
        const date = dateFor(step.value);
        return (
          <li key={step.value} className="relative flex gap-4 pb-8 last:pb-0">
            {/* Ligne verticale */}
            {i < ORDER_FLOW.length - 1 && (
              <span
                className={`absolute left-[19px] top-10 h-[calc(100%-2rem)] w-0.5 ${
                  i < current ? "bg-blue-deep" : "bg-line"
                }`}
              />
            )}
            {/* Pastille */}
            <span
              className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-lg transition-colors ${
                done
                  ? "border-blue-deep bg-blue-deep text-white"
                  : "border-line bg-white text-muted"
              } ${active ? "ring-4 ring-blue-soft" : ""}`}
            >
              {step.icon}
            </span>
            <div className="pt-1.5">
              <p className={`font-medium ${done ? "text-ink" : "text-muted"}`}>
                {step.label}
              </p>
              {date && (
                <p className="text-xs text-muted">{formatDate(date)}</p>
              )}
              {active && !date && (
                <p className="text-xs text-blue-deep">En cours…</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
