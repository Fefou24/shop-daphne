import { ProsePage } from "@/components/layout/Prose";

export const metadata = { title: "Conditions générales de vente" };

export default function Page() {
  return (
    <ProsePage title="Conditions générales de vente">
      <p className="text-sm italic">
        Modèle à compléter et à faire valider avant la mise en vente avec
        paiement en ligne.
      </p>
      <h2>Commandes</h2>
      <p>
        Pour le moment, les commandes sont passées sous forme de demande sans
        paiement en ligne. Après réception de votre demande, Beauty Concept vous
        recontacte pour confirmer la disponibilité, le montant et les modalités
        de règlement et de livraison.
      </p>
      <h2>Prix</h2>
      <p>
        Les prix sont indiqués en euros, toutes taxes comprises. Beauty Concept
        se réserve le droit de modifier ses prix à tout moment.
      </p>
      <h2>Produits</h2>
      <p>
        Nos produits sont des cosmétiques à usage externe. Merci de respecter
        les modes d&apos;emploi et précautions indiqués sur chaque fiche produit.
      </p>
    </ProsePage>
  );
}
