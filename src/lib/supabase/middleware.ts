import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config";
import { publicDb } from "./public";

// Cache mémoire du mode maintenance (évite une requête DB à chaque navigation)
let maintCache: { value: boolean; ts: number } | null = null;

async function isMaintenanceOn(): Promise<boolean> {
  if (maintCache && Date.now() - maintCache.ts < 10_000) return maintCache.value;
  const { data } = await publicDb
    .from("site_settings")
    .select("maintenance_mode")
    .eq("id", 1)
    .single();
  maintCache = { value: !!data?.maintenance_mode, ts: Date.now() };
  return maintCache.value;
}

function isPublicPath(pathname: string): boolean {
  return !(
    pathname.startsWith("/admin") ||
    pathname.startsWith("/super-admin") ||
    pathname.startsWith("/compte") ||
    pathname === "/maintenance" ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images")
  );
}

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // --- Pages publiques : AUCUN appel d'authentification (navigation instantanée) ---
  if (isPublicPath(pathname)) {
    if (await isMaintenanceOn()) {
      return NextResponse.redirect(new URL("/maintenance", request.url));
    }
    return NextResponse.next();
  }

  // /maintenance, /api, /_next, /images : laisser passer
  if (
    pathname === "/maintenance" ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images")
  ) {
    return NextResponse.next();
  }

  // --- Espaces protégés (/compte, /admin, /super-admin) : vérifier la session ---
  let supabaseResponse = NextResponse.next({ request });
  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    if (pathname.startsWith("/compte")) {
      return NextResponse.redirect(new URL("/connexion?next=" + pathname, request.url));
    }
    if (!pathname.startsWith("/admin/login")) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // Le contrôle fin du rôle (admin / super_admin) est fait dans les layouts serveur.
  return supabaseResponse;
}
