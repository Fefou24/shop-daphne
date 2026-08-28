import { ProsePage } from "@/components/layout/Prose";

export const metadata = { title: "Mentions légales" };

export default function Page() {
  return (
    <ProsePage title="Mentions légales">
      <p className="text-sm italic">
        Modèle à compléter avec les informations légales de Beauty Concept
        (raison sociale, SIRET, adresse, hébergeur, directeur de publication).
      </p>
      <h2>Éditeur du site</h2>
      <p>Beauty Concept — A Hair Care Brand. Coordonnées à compléter.</p>
      <h2>Hébergement</h2>
      <p>Site hébergé par Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis.</p>
      <h2>Propriété intellectuelle</h2>
      <p>
        L&apos;ensemble des contenus présents sur ce site (textes, visuels,
        logo) est la propriété de Beauty Concept et ne peut être reproduit sans
        autorisation.
      </p>
    </ProsePage>
  );
}
