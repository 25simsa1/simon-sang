"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Grid pulse: every --gridpulse-period, an invisible wavefront expands from
 * the knight's current tour square (fallback: hero gradient corner) and each
 * board square briefly brightens as the front passes — a signal sweeping the
 * faint chessboard. Replaces the old radial ripple; timing, origin logic,
 * kill switches, reduced-motion, and tab-visibility behavior carry over.
 *
 * Rendering: 64 cells on the same viewport/8 fractional mapping the board
 * layer uses (aligned by construction). Once per cycle, JS computes each
 * cell's distance from the origin and sets a per-cell animation-delay of
 * distance/speed (full viewport crossing ≈ 4s), then restarts the one-shot
 * opacity animation. Opacity-only, no layout work; the timer stops while
 * the tab is hidden.
 *
 * Photosensitivity limits enforced in code: period clamped ≥6s; peak
 * brightness double-clamped (layer opacity = min(--gridpulse-opacity, 0.04),
 * cells animate 0→1→0 within it); same sage family, no color change.
 */
const SWEEP_MS = 4000; // wavefront crosses the full viewport in ~4s

export function GridPulse() {
  const reduce = useReducedMotion();
  const layerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (reduce) return;
    const layer = layerRef.current;
    if (!layer) return;
    const root = document.documentElement;

    // Photosensitivity floor: never cycle faster than 6s, whatever the var says.
    const raw = parseFloat(getComputedStyle(root).getPropertyValue("--gridpulse-period")) || 8;
    const periodMs = Math.max(6, raw) * 1000;

    const cells = Array.from(layer.children) as HTMLElement[];

    const pulse = () => {
      const cs = getComputedStyle(root);
      const kx = parseFloat(cs.getPropertyValue("--knight-cx"));
      const ky = parseFloat(cs.getPropertyValue("--knight-cy"));
      // Fallback origin: the hero gradient corner.
      const ox = (Number.isFinite(kx) ? kx : 0.15) * window.innerWidth;
      const oy = (Number.isFinite(ky) ? ky : 0.12) * window.innerHeight;
      const maxDist = Math.hypot(
        Math.max(ox, window.innerWidth - ox),
        Math.max(oy, window.innerHeight - oy)
      );
      const speed = maxDist / SWEEP_MS; // px per ms

      for (const cell of cells) {
        const f = Number(cell.dataset.f);
        const r = Number(cell.dataset.r);
        const cx = ((f + 0.5) / 8) * window.innerWidth;
        const cy = ((r + 0.5) / 8) * window.innerHeight;
        cell.style.animationDelay = `${Math.hypot(cx - ox, cy - oy) / speed}ms`;
      }
      // Restart the one-shot flash on every cell.
      layer.classList.remove("is-pulsing");
      void layer.offsetWidth; // reflow so the animation re-triggers
      layer.classList.add("is-pulsing");
    };

    let timer: ReturnType<typeof setInterval> | null = setInterval(pulse, periodMs);
    pulse();

    const onVis = () => {
      // Stop entirely while hidden; resume fresh when visible again.
      if (document.hidden) {
        if (timer) clearInterval(timer);
        timer = null;
        layer.classList.remove("is-pulsing");
      } else if (!timer) {
        timer = setInterval(pulse, periodMs);
        pulse();
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      if (timer) clearInterval(timer);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [reduce]);

  if (reduce) return null;

  return (
    <div ref={layerRef} aria-hidden="true" className="gridpulse-layer">
      {Array.from({ length: 64 }, (_, i) => {
        const f = i % 8;
        const r = Math.floor(i / 8);
        return (
          <div
            key={i}
            className="gridpulse-cell"
            data-f={f}
            data-r={r}
            style={{ left: `${f * 12.5}%`, top: `${r * 12.5}%` }}
          />
        );
      })}
    </div>
  );
}
