"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Ev = {
  type: "page_view" | "move" | "click" | "scroll";
  page: string;
  x?: number;
  y?: number;
  scroll?: number;
  target_tag?: string;
  target_text?: string;
  target_class?: string;
  t: string;
};

const FLUSH_MS = 10_000;
const FLUSH_MAX = 100;
const MOVE_THROTTLE = 100;

export function TrackingProvider() {
  const pathname = usePathname();
  const search = useSearchParams();
  const buffer = useRef<Ev[]>([]);
  const sessionId = useRef<string | null>(null);
  const lastMove = useRef(0);
  const lastScroll = useRef(0);
  const started = useRef(false);

  // Flush
  function flush(useBeacon = false) {
    if (!sessionId.current || buffer.current.length === 0) return;
    const events = buffer.current;
    buffer.current = [];
    const payload = JSON.stringify({
      sessionId: sessionId.current,
      page: pathnameRef.current,
      events,
    });
    if (useBeacon && navigator.sendBeacon) {
      navigator.sendBeacon("/api/track", new Blob([payload], { type: "application/json" }));
    } else {
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }
  }

  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;

  function push(e: Omit<Ev, "page" | "t">) {
    buffer.current.push({ ...e, page: pathnameRef.current, t: new Date().toISOString() });
    if (buffer.current.length >= FLUSH_MAX) flush();
  }

  // Init session (une fois)
  useEffect(() => {
    if (started.current) return;
    // Ne pas tracker à l'intérieur d'une iframe (ex: replay admin)
    if (window.top !== window.self) return;
    started.current = true;

    let sid = sessionStorage.getItem("bc-track-sid");
    if (!sid) {
      sid = crypto.randomUUID();
      sessionStorage.setItem("bc-track-sid", sid);
    }
    sessionId.current = sid;

    (async () => {
      let visitorName: string | null = null;
      let userId: string | null = null;
      try {
        const { data } = await createClient().auth.getUser();
        userId = data.user?.id ?? null;
        visitorName =
          (data.user?.user_metadata?.full_name as string) ||
          data.user?.email ||
          null;
      } catch {
        /* visiteur anonyme */
      }
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sid,
          page: window.location.pathname,
          init: {
            user_id: userId,
            visitor_name: visitorName,
            referrer: document.referrer || null,
            utm_source: new URLSearchParams(window.location.search).get("utm_source"),
            entry_page: window.location.pathname,
            screen_w: window.innerWidth,
            screen_h: window.innerHeight,
          },
        }),
      }).catch(() => {});
    })();

    // Écouteurs
    const onMove = (ev: MouseEvent) => {
      const now = Date.now();
      if (now - lastMove.current < MOVE_THROTTLE) return;
      lastMove.current = now;
      push({
        type: "move",
        x: round((ev.clientX / window.innerWidth) * 100),
        y: round((ev.clientY / window.innerHeight) * 100),
      });
    };
    const onClick = (ev: MouseEvent) => {
      const el = ev.target as HTMLElement | null;
      push({
        type: "click",
        x: round((ev.clientX / window.innerWidth) * 100),
        y: round((ev.clientY / window.innerHeight) * 100),
        target_tag: el?.tagName?.toLowerCase(),
        target_text: el?.innerText?.trim()?.slice(0, 60),
        target_class: typeof el?.className === "string" ? el.className.slice(0, 80) : undefined,
      });
    };
    const onScroll = () => {
      const now = Date.now();
      if (now - lastScroll.current < 250) return;
      lastScroll.current = now;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      push({ type: "scroll", scroll: max > 0 ? round((window.scrollY / max) * 100) : 0 });
    };
    const onHide = () => flush(true);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("click", onClick, true);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pagehide", onHide);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") flush(true);
    });

    const interval = setInterval(() => flush(), FLUSH_MS);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("click", onClick, true);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pagehide", onHide);
      clearInterval(interval);
      flush(true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Page vue à chaque changement de route
  useEffect(() => {
    if (!sessionId.current) return;
    push({ type: "page_view" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, search]);

  return null;
}

function round(n: number) {
  return Math.round(n * 10) / 10;
}
