import { ProsePage } from "@/components/layout/Prose";

export const metadata = { title: "Politique de confidentialité" };

export default function Page() {
  return (
    <ProsePage title="Politique de confidentialité">
      <p className="text-sm italic">Modèle à compléter conformément au RGPD.</p>
      <h2>Données collectées</h2>
      <p>
        Lorsque vous envoyez une demande, nous collectons les informations
        nécessaires à son traitement : nom, prénom, e-mail, téléphone et adresse
        de livraison.
      </p>
      <h2>Utilisation des données</h2>
      <p>
        Ces données sont utilisées uniquement pour traiter votre demande et vous
        recontacter. Elles ne sont jamais revendues à des tiers.
      </p>
      <h2>Vos droits</h2>
      <p>
        Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de
        rectification et de suppression de vos données. Pour l&apos;exercer,
        contactez-nous par e-mail.
      </p>
    </ProsePage>
  );
}
