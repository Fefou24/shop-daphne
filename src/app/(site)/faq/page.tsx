import { Accordion } from "@/components/product/Accordion";

export const metadata = { title: "FAQ" };

const FAQ = [
  {
    title: "Comment passer commande ?",
    content:
      "Ajoutez vos produits au panier puis envoyez votre demande via le formulaire. Aucun paiement en ligne n'est demandé pour le moment : l'équipe Beauty Concept vous recontacte par e-mail pour finaliser votre commande et organiser la livraison.",
  },
  {
    title: "Vos produits conviennent-ils à tous les cheveux ?",
    content:
      "Oui, nos soins sont formulés pour convenir à tous les types de cheveux. Comme pour tout produit cosmétique, nous recommandons un test de sensibilité avant la première utilisation.",
  },
  {
    title: "Vos formules sont-elles naturelles ?",
    content:
      "Nos produits sont formulés à 100 % à partir d'ingrédients d'origine naturelle, soigneusement sélectionnés pour leur efficacité et leur douceur.",
  },
  {
    title: "Comment conserver mes produits ?",
    content:
      "Conservez vos soins dans un endroit sec, à l'abri de la chaleur et de la lumière directe, et tenez-les hors de portée des enfants.",
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="section-title text-4xl sm:text-5xl">Questions fréquentes</h1>
      <p className="mt-4 text-lg text-ink-soft">
        Tout ce qu&apos;il faut savoir avant de prendre soin de vos cheveux.
      </p>
      <div className="mt-8">
        <Accordion items={FAQ} />
      </div>
    </div>
  );
}
