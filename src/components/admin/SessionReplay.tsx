"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { TrackingEvent, TrackingSession } from "@/lib/types";

type Props = {
  session: TrackingSession;
  events: TrackingEvent[];
};

export function SessionReplay({ session, events }: Props) {
  const sorted = useMemo(
    () => [...events].sort((a, b) => new Date(a.t).getTime() - new Date(b.t).getTime()),
    [events],
  );
  const t0 = sorted.length ? new Date(sorted[0].t).getTime() : 0;
  const tEnd = sorted.length ? new Date(sorted[sorted.length - 1].t).getTime() : 0;
  const duration = Math.max(1, tEnd - t0);

  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(2);
  const [currentMs, setCurrentMs] = useState(0);
  const raf = useRef<number | null>(null);
  const last = useRef<number>(0);

  // Boucle d'animation
  useEffect(() => {
    if (!playing) return;
    last.current = performance.now();
    const tick = (now: number) => {
      const dt = (now - last.current) * speed;
      last.current = now;
      setCurrentMs((c) => {
        const next = c + dt;
        return next >= duration ? duration : next;
      });
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [playing, speed, duration]);

  useEffect(() => {
    if (currentMs >= duration) setPlaying(false);
  }, [currentMs, duration]);

  // Événements joués jusqu'à présent
  const elapsed = sorted.filter((e) => new Date(e.t).getTime() - t0 <= currentMs);

  // Page courante (dernier page_view)
  const pageEvents = elapsed.filter((e) => e.type === "page_view" || e.page);
  const currentPage =
    [...pageEvents].reverse().find((e) => e.page)?.page ?? session.entry_page ?? "/";

  // Curseur = dernier move/click
  const cursor = [...elapsed].reverse().find((e) => (e.type === "move" || e.type === "click") && e.x != null);

  // Trajectoire = 40 derniers mouvements sur la page courante
  const moves = elapsed
    .filter((e) => (e.type === "move" || e.type === "click") && e.page === currentPage && e.x != null)
    .slice(-40);

  // Clics récents (ripple)
  const recentClicks = elapsed.filter(
    (e) => e.type === "click" && e.page === currentPage && currentMs - (new Date(e.t).getTime() - t0) < 900,
  );

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const loadedPage = useRef<string | null>(null);
  useEffect(() => {
    if (iframeRef.current && loadedPage.current !== currentPage) {
      loadedPage.current = currentPage;
      iframeRef.current.src = `${currentPage}`;
    }
  }, [currentPage]);

  const polyline = moves
    .map((m) => `${m.x},${m.y}`)
    .join(" ");

  return (
    <div>
      {/* Contrôles */}
      <div className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-white p-4">
        <button
          onClick={() => {
            if (currentMs >= duration) setCurrentMs(0);
            setPlaying((p) => !p);
          }}
          className="rounded-full bg-blue-deep px-4 py-2 text-sm font-medium text-white hover:bg-ink"
        >
          {playing ? "⏸ Pause" : "▶ Lecture"}
        </button>
        <input
          type="range"
          min={0}
          max={duration}
          value={currentMs}
          onChange={(e) => {
            setPlaying(false);
            setCurrentMs(Number(e.target.value));
          }}
          className="h-1.5 flex-1 cursor-pointer accent-blue-deep"
        />
        <span className="font-mono text-xs text-muted">
          {(currentMs / 1000).toFixed(1)}s / {(duration / 1000).toFixed(1)}s
        </span>
        <select
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="rounded-lg border border-line bg-white px-2 py-1 text-sm outline-none"
        >
          {[1, 2, 4, 8].map((s) => (
            <option key={s} value={s}>×{s}</option>
          ))}
        </select>
      </div>

      <p className="mb-2 text-sm text-muted">
        Page actuelle : <span className="font-mono text-ink">{currentPage}</span>
      </p>

      {/* Scène : iframe + overlay */}
      <div className="relative w-full overflow-hidden rounded-2xl border border-line bg-white" style={{ aspectRatio: "16 / 10" }}>
        <iframe
          ref={iframeRef}
          title="Replay"
          className="absolute inset-0 h-full w-full"
          style={{ pointerEvents: "none", border: 0 }}
        />
        {/* Overlay */}
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full">
          {moves.length > 1 && (
            <polyline
              points={polyline}
              fill="none"
              stroke="rgba(79,118,137,0.5)"
              strokeWidth="0.3"
              vectorEffect="non-scaling-stroke"
            />
          )}
          {recentClicks.map((c, i) => (
            <circle key={i} cx={c.x ?? 0} cy={c.y ?? 0} r="2.2" fill="none" stroke="#e2a3ab" strokeWidth="0.5" vectorEffect="non-scaling-stroke">
              <animate attributeName="r" from="0.5" to="3" dur="0.7s" repeatCount="1" />
              <animate attributeName="opacity" from="1" to="0" dur="0.7s" repeatCount="1" />
            </circle>
          ))}
        </svg>
        {/* Curseur */}
        {cursor && cursor.x != null && cursor.y != null && (
          <div
            className="pointer-events-none absolute z-10 transition-all duration-100 ease-linear"
            style={{ left: `${cursor.x}%`, top: `${cursor.y}%`, transform: "translate(-50%, -50%)" }}
          >
            <div className="h-4 w-4 rounded-full bg-blue-deep/80 ring-4 ring-blue-deep/25" />
          </div>
        )}
      </div>

      <p className="mt-3 text-xs text-muted">
        L&apos;arrière-plan est la page réelle telle qu&apos;elle est aujourd&apos;hui ;
        le curseur et les clics rejouent le parcours enregistré.
      </p>
    </div>
  );
}
