import Image from "next/image";
import Link from "next/link";
import { getFeaturedProducts, getApprovedReviews } from "@/lib/data";
import { ProductCard } from "@/components/product/ProductCard";
import { Stars } from "@/components/ui/Stars";
import { Reveal } from "@/components/ui/Reveal";
import {
  LeafIcon,
  DropletIcon,
  SparkleIcon,
  ArrowRightIcon,
} from "@/components/ui/icons";

export const revalidate = 300;

export default async function HomePage() {
  const [products, reviews] = await Promise.all([
    getFeaturedProducts(),
    getApprovedReviews(6),
  ]);

  return (
    <>
      {/* ===================== HERO ===================== */}
      <section className="relative overflow-hidden bg-cream-deep">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:gap-6 lg:px-8 lg:py-20">
          <div className="animate-fade-up">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-blue-deep">
              <SparkleIcon size={15} /> 100 % d&apos;origine naturelle
            </p>
            <h1 className="font-serif text-5xl font-semibold leading-[1.05] text-ink sm:text-6xl lg:text-7xl">
              Révélez la beauté
              <br />
              naturelle de vos
              <br />
              <span className="italic text-blue-deep">cheveux</span>
            </h1>
            <p className="mt-6 max-w-md text-ink-soft">
              Des soins capillaires doux et nourrissants, formulés à partir
              d&apos;ingrédients d&apos;origine naturelle. Hydratation, brillance
              et douceur, à chaque utilisation.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/produits" className="btn btn-primary px-8 py-4">
                Découvrir la boutique
                <ArrowRightIcon size={18} />
              </Link>
              <Link href="/notre-histoire" className="btn btn-outline px-8 py-4">
                Notre histoire
              </Link>
            </div>

            <dl className="mt-12 grid max-w-md grid-cols-3 gap-4 border-t border-line pt-6">
              {[
                ["100%", "d'origine naturelle"],
                ["2", "soins signature"],
                ["★ 4.9", "avis clientes"],
              ].map(([n, l]) => (
                <div key={l}>
                  <dt className="font-serif text-3xl font-semibold text-ink">{n}</dt>
                  <dd className="text-xs text-muted">{l}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2rem] shadow-xl">
              <Image
                src="/images/products/moonlight-gel-1.png"
                alt="Soins Beauty Concept"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
            <SparkleIcon size={40} className="animate-float absolute -left-2 top-6 text-blue/60" />
            <SparkleIcon size={28} className="animate-float-slow absolute bottom-10 right-2 text-blush" />
          </div>
        </div>
      </section>

      {/* ===================== VALEURS ===================== */}
      <section className="border-y border-line bg-blue-deep">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 text-white sm:px-6 md:grid-cols-4 lg:px-8">
          {[
            [<LeafIcon key="l" size={22} />, "Origine naturelle"],
            [<DropletIcon key="d" size={22} />, "Hydratation intense"],
            [<SparkleIcon key="s" size={22} />, "Brillance & douceur"],
            [<span key="h" className="text-lg">🇫🇷</span>, "Fabriqué en France"],
          ].map(([icon, label], i) => (
            <div key={i} className="flex items-center justify-center gap-3 text-center">
              <span className="opacity-90">{icon}</span>
              <span className="text-sm font-light">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== PRODUITS ===================== */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mb-10 text-center">
            <h2 className="section-title text-4xl sm:text-5xl">Nos soins signature</h2>
            <p className="mx-auto mt-3 max-w-lg text-ink-soft">
              Une routine simple et efficace pour des cheveux visiblement plus beaux.
            </p>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
          {products.map((p, i) => (
            <Reveal key={p.id} delay={i * 80}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link href="/produits" className="btn btn-outline px-10 py-3.5">
            Voir toute la boutique
          </Link>
        </div>
      </section>

      {/* ===================== CATEGORIES ===================== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="rounded-[2rem] bg-cream-deep px-6 py-12 sm:px-12">
          <h2 className="section-title mb-8 text-center text-4xl sm:text-5xl">
            Choisissez selon vos besoins
          </h2>
          <div className="grid gap-5 md:grid-cols-2">
            <CategoryCard
              href="/produits?cat=soin"
              title="Soins"
              subtitle="Masques & soins nourrissants"
              image="/images/products/sunlight-mask-1.png"
            />
            <CategoryCard
              href="/produits?cat=coiffage"
              title="Coiffage"
              subtitle="Définition & tenue des boucles"
              image="/images/products/moonlight-gel-1.png"
            />
          </div>
        </Reveal>
      </section>

      {/* ===================== HISTOIRE / SUR-MESURE ===================== */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Reveal className="grid items-center gap-8 lg:grid-cols-2">
          <div className="relative aspect-[5/4] overflow-hidden rounded-[2rem] shadow-sm">
            <Image
              src="/images/products/sunlight-mask-2.png"
              alt="Beauty Concept"
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-cream-deep px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-blue-deep">
              🇫🇷 Une marque française
            </p>
            <h2 className="section-title text-4xl sm:text-5xl">
              Créée par Daphné, 14 ans
            </h2>
            <p className="mt-5 leading-relaxed text-ink-soft">
              Beauty Concept, c&apos;est l&apos;histoire de jeunes de 14 ans
              passionnés de soin et de naturel. Daphné imagine des produits doux,
              d&apos;origine naturelle, pensés pour sublimer tous les types de
              cheveux — avec l&apos;envie d&apos;aller plus loin :{" "}
              <span className="font-medium text-ink">
                des produits personnalisés pour tout le monde.
              </span>
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/sur-mesure" className="btn btn-primary px-7 py-3.5">
                Demander un produit sur-mesure
              </Link>
              <Link href="/notre-histoire" className="btn btn-outline px-7 py-3.5">
                Notre histoire
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ===================== AVIS ===================== */}
      {reviews.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="section-title mb-10 text-center text-4xl sm:text-5xl">
              Elles ont adopté Beauty Concept
            </h2>
          </Reveal>
          <div className="grid gap-5 md:grid-cols-3">
            {reviews.slice(0, 6).map((r, i) => (
              <Reveal key={r.id} delay={i * 80}>
              <figure
                className="rounded-3xl border border-line bg-white p-6"
              >
                <Stars rating={r.rating} />
                <blockquote className="mt-3 text-sm leading-relaxed text-ink-soft">
                  “{r.comment}”
                </blockquote>
                <figcaption className="mt-4 text-sm font-semibold text-ink">
                  {r.author_name}
                  {r.location && (
                    <span className="font-normal text-muted"> · {r.location}</span>
                  )}
                </figcaption>
              </figure>
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

function CategoryCard({
  href,
  title,
  subtitle,
  image,
}: {
  href: string;
  title: string;
  subtitle: string;
  image: string;
}) {
  return (
    <Link
      href={href}
      className="group relative flex h-56 items-end overflow-hidden rounded-2xl bg-white"
    >
      <Image
        src={image}
        alt={title}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />
      <div className="relative z-10 p-6 text-white">
        <h3 className="font-serif text-3xl font-semibold">{title}</h3>
        <p className="text-sm text-white/85">{subtitle}</p>
      </div>
    </Link>
  );
}
