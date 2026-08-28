import Link from "next/link";

/* ============================================================
   Primitives d'interface admin — cohérentes sur toutes les pages
   ============================================================ */

export function PageHeader({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-ink">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-ink-soft">{subtitle}</p>}
      </div>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  );
}

export function AdminCard({
  title,
  action,
  children,
  className = "",
}: {
  title?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-2xl border border-line bg-white p-5 shadow-[0_1px_2px_rgba(44,58,66,0.04)] sm:p-6 ${className}`}>
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title && <h2 className="font-serif text-xl font-semibold text-ink">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

type Tone = "blue" | "green" | "amber" | "rose" | "neutral";
const toneClasses: Record<Tone, string> = {
  blue: "bg-blue-soft text-blue-deep",
  green: "bg-[#cfe6d6] text-[#2f7a4a]",
  amber: "bg-[#f4e7c9] text-[#8a6d2f]",
  rose: "bg-blush-soft text-ink",
  neutral: "bg-cream-deep text-muted",
};

export function Badge({
  children,
  tone = "neutral",
  className = "",
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${toneClasses[tone]} ${className}`}>
      {children}
    </span>
  );
}

export function StatCard({
  label,
  value,
  hint,
  href,
  icon,
  accent,
  small,
}: {
  label: string;
  value: string | number;
  hint?: string;
  href?: string;
  icon?: React.ReactNode;
  accent?: boolean;
  small?: boolean;
}) {
  const inner = (
    <div
      className={`h-full rounded-2xl border p-5 transition-all ${
        accent
          ? "border-blue-deep bg-blue-deep text-white"
          : "border-line bg-white hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-12px_rgba(44,58,66,0.35)]"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className={`text-sm ${accent ? "text-white/80" : "text-muted"}`}>{label}</p>
        {icon && (
          <span className={accent ? "text-white/90" : "text-blue"}>{icon}</span>
        )}
      </div>
      <p className={`mt-2 font-serif font-semibold ${small ? "text-xl" : "text-3xl"}`}>{value}</p>
      {hint && <p className={`mt-0.5 text-xs ${accent ? "text-white/70" : "text-muted"}`}>{hint}</p>}
    </div>
  );
  return href ? <Link href={href} className="block h-full">{inner}</Link> : inner;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-line bg-white p-10 text-center">
      {icon && <span className="text-line">{icon}</span>}
      <p className="font-medium text-ink">{title}</p>
      {description && <p className="max-w-sm text-sm text-muted">{description}</p>}
      {action}
    </div>
  );
}
