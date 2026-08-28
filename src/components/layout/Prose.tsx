export function ProsePage({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="section-title text-4xl sm:text-5xl">{title}</h1>
      {intro && <p className="mt-4 text-lg text-ink-soft">{intro}</p>}
      <div className="prose-bc mt-8 space-y-4 text-ink-soft [&_h2]:mt-8 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-ink">
        {children}
      </div>
    </div>
  );
}
