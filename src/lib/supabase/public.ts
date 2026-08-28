import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config";
import type { Database } from "@/lib/database.types";

/**
 * Client anonyme SANS cookies — pour les lectures publiques.
 * Comme il ne lit pas les cookies, les pages qui l'utilisent peuvent être
 * rendues statiquement (ISR) → navigation instantanée.
 */
export const publicDb = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});
