import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/format";
import { Stars } from "@/components/ui/Stars";
import { ReviewActions } from "@/components/admin/ReviewActions";
import { PageHeader } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  const supabase = await createClient();
  const { data: reviews } = await supabase
    .from("reviews")
    .select("*, products(name)")
    .order("created_at", { ascending: false });

  const pending = (reviews ?? []).filter((r) => !r.is_approved);
  const approved = (reviews ?? []).filter((r) => r.is_approved);

  return (
    <div>
      <PageHeader title="Avis" subtitle="Validez ou supprimez les avis laissés par vos clientes." />

      <h2 className="mb-3 font-serif text-xl font-semibold">
        En attente {pending.length > 0 && <span className="text-blush">({pending.length})</span>}
      </h2>
      {pending.length === 0 ? (
        <p className="rounded-2xl border border-line bg-white p-6 text-ink-soft">
          Aucun avis en attente.
        </p>
      ) : (
        <div className="space-y-3">
          {pending.map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </div>
      )}

      <h2 className="mb-3 mt-10 font-serif text-xl font-semibold">Publiés</h2>
      <div className="space-y-3">
        {approved.map((r) => (
          <ReviewCard key={r.id} review={r} />
        ))}
        {approved.length === 0 && (
          <p className="rounded-2xl border border-line bg-white p-6 text-ink-soft">
            Aucun avis publié.
          </p>
        )}
      </div>
    </div>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function ReviewCard({ review: r }: { review: any }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <p className="font-medium text-ink">{r.author_name}</p>
            {r.location && <span className="text-xs text-muted">· {r.location}</span>}
          </div>
          <p className="text-xs text-muted">
            {r.products?.name ?? "Produit supprimé"} — {formatDate(r.created_at)}
          </p>
        </div>
        <Stars rating={r.rating} />
      </div>
      <p className="mt-3 text-sm leading-relaxed text-ink-soft">{r.comment}</p>
      <div className="mt-4">
        <ReviewActions id={r.id} productId={r.product_id} approved={r.is_approved} />
      </div>
    </div>
  );
}
