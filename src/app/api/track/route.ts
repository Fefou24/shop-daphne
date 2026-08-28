import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type IncomingEvent = {
  type: string;
  page?: string;
  x?: number;
  y?: number;
  scroll?: number;
  target_tag?: string;
  target_text?: string;
  target_class?: string;
  t?: string;
};

function detectDevice(ua: string): string {
  if (/iPad|Tablet/i.test(ua)) return "tablette";
  if (/Mobile|Android|iPhone|iPod/i.test(ua)) return "mobile";
  return "ordinateur";
}

export async function POST(request: NextRequest) {
  let body: {
    sessionId?: string;
    init?: {
      user_id?: string | null;
      visitor_name?: string | null;
      referrer?: string | null;
      utm_source?: string | null;
      entry_page?: string | null;
      screen_w?: number;
      screen_h?: number;
    };
    page?: string | null;
    events?: IncomingEvent[];
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const { sessionId } = body;
  if (!sessionId) return NextResponse.json({ ok: false }, { status: 400 });

  const supabase = await createClient();
  const ua = request.headers.get("user-agent") ?? "";
  const country =
    request.headers.get("x-vercel-ip-country") ??
    request.headers.get("x-country") ??
    null;

  const initPayload = body.init
    ? {
        ...body.init,
        user_agent: ua,
        device: detectDevice(ua),
        country,
      }
    : null;

  // Tout passe par une fonction SECURITY DEFINER (insert session + events + compteurs)
  const { error } = await supabase.rpc("track_ingest", {
    p_session: sessionId,
    p_init: initPayload,
    p_page: body.page ?? null,
    p_events: body.events ?? [],
  });

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
