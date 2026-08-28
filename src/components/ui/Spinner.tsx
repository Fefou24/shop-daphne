export function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex min-h-[55vh] flex-col items-center justify-center gap-5">
      <span className="relative inline-flex h-12 w-12">
        <span className="absolute inset-0 animate-ping rounded-full bg-blue-soft opacity-60" />
        <span className="relative inline-flex h-12 w-12 animate-spin rounded-full border-[3px] border-line border-t-blue-deep" />
      </span>
      <span className="font-serif text-sm tracking-widest text-muted">
        {label ?? "Beauty Concept"}
      </span>
    </div>
  );
}
