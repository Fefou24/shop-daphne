import Image from "next/image";
import Link from "next/link";
import { SparkleIcon } from "@/components/ui/icons";

export const metadata = { title: "Notre histoire" };

export default function StoryPage() {
  return (
    <div>
      <section className="bg-cream-deep">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-blue-deep">
              <SparkleIcon size={15} /> 🇫🇷 Marque française
            </p>
            <h1 className="section-title text-4xl sm:text-5xl">
              Une marque créée par Daphné, 14 ans
            </h1>
            <p className="mt-5 leading-relaxed text-ink-soft">
              Beauty Concept est née en France de la passion de jeunes de 14 ans
              pour le soin et le naturel. Daphné, 14 ans, a imaginé une gamme de
              soins capillaires d&apos;origine naturelle, pensés pour nourrir,
              hydrater et sublimer tous les types de cheveux.
            </p>
            <p className="mt-4 leading-relaxed text-ink-soft">
              Chaque produit est formulé avec soin, à partir d&apos;ingrédients
              sélectionnés pour leur efficacité et leur douceur. Et nous voyons
              déjà plus loin : proposer des{" "}
              <span className="font-medium text-ink">
                produits personnalisés pour tout le monde
              </span>
              , adaptés à chaque type de cheveux et à chaque besoin.
            </p>
            <p className="mt-4 leading-relaxed text-ink-soft">
              Pour échanger avec nous, suivez notre chaîne WhatsApp : c&apos;est
              là que tout se passe (nouveautés, conseils, contact).
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/produits" className="btn btn-primary px-8 py-3.5">
                Découvrir nos soins
              </Link>
              <Link href="/sur-mesure" className="btn btn-outline px-8 py-3.5">
                Produit sur-mesure
              </Link>
            </div>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-xl">
            <Image
              src="/images/products/sunlight-mask-1.png"
              alt="Beauty Concept"
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-3">
          {[
            ["Origine naturelle", "Des formules à base d'ingrédients d'origine naturelle, respectueuses du cheveu."],
            ["Efficacité visible", "Hydratation, brillance et douceur dès les premières utilisations."],
            ["Pour tous les cheveux", "Des soins pensés pour tous les types de cheveux, du lisse au bouclé."],
          ].map(([t, d]) => (
            <div key={t} className="rounded-2xl border border-line bg-white p-6 text-center">
              <h2 className="font-serif text-xl font-semibold text-ink">{t}</h2>
              <p className="mt-2 text-sm text-ink-soft">{d}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
