/**
 * URL + clé publishable Supabase — lues uniquement depuis les variables
 * d'environnement (jamais hardcodées dans le dépôt).
 *
 * ⚠️ La clé service_role n'est JAMAIS ici : elle reste uniquement dans
 *    process.env.SUPABASE_SERVICE_ROLE_KEY (jamais committée).
 */

function requiredPublicEnv(name: "NEXT_PUBLIC_SUPABASE_URL" | "NEXT_PUBLIC_SUPABASE_ANON_KEY"): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Variable manquante : ${name}. Copiez .env.example vers .env.local et renseignez vos clés.`,
    );
  }
  return value;
}

export const SUPABASE_URL = requiredPublicEnv("NEXT_PUBLIC_SUPABASE_URL");
export const SUPABASE_ANON_KEY = requiredPublicEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");
