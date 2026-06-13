"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Knight's tour trail: a faint Staunton-knight silhouette wandering an
 * invisible 8×8 grid mapped to the viewport, leaving a fading dotted trail,
 * walking a hairline board (gridlines + tiny a–h/1–8 coordinates) that sits
 * behind all content. The tour is a real sequence (64 squares, every move
 * legal, validated before shipping). Decorative only: fixed overlays,
 * pointer-events: none, aria-hidden, never affects layout.
 *
 * Three layers, because of how they need to scale:
 * - .tour-board: pure CSS grid pattern in vw/vh units — aligns with the tour
 *   mapping by construction, recalculates with the viewport for free.
 * - .knight-tour (SVG, stretched viewBox): the dotted trail. Lines tolerate
 *   non-uniform stretch.
 * - .tour-knight (fixed div, pixel transforms): the knight silhouette. A
 *   stretched SVG would distort the piece, so it's positioned in real pixels
 *   from a cached viewport size (refreshed on resize).
 *
 * Performance: one rAF loop writes one transform string; the trail mutates
 * once per step. rAF stops in hidden tabs (we re-baseline on visibilitychange
 * so the knight resumes, not teleports). Knobs in globals.css:
 * --tour-opacity (0 kills knight+trail), --board-opacity (0 kills the board),
 * --tour-step-duration.
 *
 * Mobile: not rendered below 768px — at phone width a grid cell is <48px, so
 * the trail reads as smudges rather than a path, and an always-running rAF
 * is a battery tax with no idle-viewing payoff on touch.
 */

const TOUR =
  "a1 b3 a5 b7 d8 f7 h8 g6 f8 h7 g5 h3 g1 e2 c1 a2 b4 a6 b8 c6 a7 c8 e7 g8 h6 g4 h2 f1 d2 b1 a3 c2 e1 f3 h4 g2 e3 d1 b2 a4 c3 b5 d4 f5 d6 c4 e5 d3 f2 h1 g3 e4 c5 d7 b6 a8 c7 d5 f4 e6 g7 e8 f6 h5".split(" ");

/** Simple Staunton knight profile, faces LEFT, 24×24 box. Hand-drawn path —
    not the ♞ glyph, which renders inconsistently across platforms. */
export const KNIGHT_PATH =
  "M5.5 22 L18.5 22 L18.5 20.2 Q18.5 19.4 17.6 18.8 Q16.9 14 17 10.5 Q17 6.5 14.5 4.5 L13.8 2.5 L12.2 4 Q9 4.5 6.5 7.5 Q5 9.3 5.8 10 Q6.6 10.6 8.2 9.8 L9.8 9 Q10.4 9.4 9.9 10.2 Q7.4 13.6 6.9 16.5 Q6.5 19 5.5 20.3 Z";
const KNIGHT_SIZE = 26;

const VB = 800; // trail viewBox units; preserveAspectRatio="none" stretches it
const TRAIL = 6;
const MOVE_MS = 1100; // travel time within each step; the rest is dwell
const SETTLE_MS = 300; // landing scale settle 1 → 1.05 → 1

const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"];

/** Square center as fractions of the viewport. a1 bottom-left, h8 top-right. */
function frac(sq: string): [number, number] {
  const file = sq.charCodeAt(0) - 97;
  const rank = Number(sq[1]) - 1;
  return [(file + 0.5) / 8, (7 - rank + 0.5) / 8];
}

/** Smoothed L-path control point (fractions): the corner of the long-leg-first L. */
function ctrlFrac(a: string, b: string): [number, number] {
  const [x1, y1] = frac(a);
  const [x2, y2] = frac(b);
  return Math.abs(x2 - x1) > Math.abs(y2 - y1) ? [x2, y1] : [x1, y2];
}

function bezier(a: string, b: string, t: number): [number, number] {
  const [x1, y1] = frac(a);
  const [x2, y2] = frac(b);
  const [cx, cy] = ctrlFrac(a, b);
  const u = 1 - t;
  return [
    u * u * x1 + 2 * u * t * cx + t * t * x2,
    u * u * y1 + 2 * u * t * cy + t * t * y2,
  ];
}

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

export function KnightTour() {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [step, setStep] = useState(0); // index of the square the knight is leaving
  const [faded, setFaded] = useState(false);
  const knightRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 768px)");
    setEnabled(wide.matches);
    const onChange = (e: MediaQueryListEvent) => setEnabled(e.matches);
    wide.addEventListener("change", onChange);
    return () => wide.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduce || !enabled) return;
    const stepMsRaw = getComputedStyle(document.documentElement)
      .getPropertyValue("--tour-step-duration")
      .trim();
    const stepMs = stepMsRaw.endsWith("ms")
      ? parseFloat(stepMsRaw)
      : (parseFloat(stepMsRaw) || 2.5) * 1000;

    let raf = 0;
    let idx = 0;
    let stepStart = performance.now();
    let restarting = false;
    let vw = window.innerWidth;
    let vh = window.innerHeight;

    const onResize = () => {
      vw = window.innerWidth;
      vh = window.innerHeight;
    };
    const onVis = () => {
      if (!document.hidden) stepStart = performance.now();
    };
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVis);

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (restarting) return;
      const elapsed = now - stepStart;
      const from = TOUR[idx];
      const to = TOUR[idx + 1];
      if (!to) {
        restarting = true;
        setFaded(true);
        setTimeout(() => {
          idx = 0;
          setStep(0);
          stepStart = performance.now();
          setFaded(false);
          restarting = false;
        }, 5000);
        return;
      }
      const t = easeInOut(Math.min(1, elapsed / MOVE_MS));
      const [fx, fy] = bezier(from, to, t);
      // Face the direction of travel (path faces left by default).
      const facing = frac(to)[0] > frac(from)[0] ? -1 : 1;
      // Landing settle: 1 → 1.05 → 1, no bounce.
      const settleT = (elapsed - MOVE_MS) / SETTLE_MS;
      const settle =
        settleT >= 0 && settleT <= 1 ? 1 + 0.05 * Math.sin(Math.PI * settleT) : 1;
      const x = fx * vw - KNIGHT_SIZE / 2;
      const y = fy * vh - KNIGHT_SIZE / 2;
      if (knightRef.current) {
        knightRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) scaleX(${facing}) scale(${settle})`;
      }
      if (elapsed >= stepMs) {
        idx += 1;
        stepStart = now;
        setStep(idx);
        // Publish the landing square for other ambient layers (the grid
        // pulse originates from the knight). Fractions of the viewport, set
        // once per step — not per frame.
        const [lx, ly] = frac(TOUR[idx]);
        document.documentElement.style.setProperty("--knight-cx", String(lx));
        document.documentElement.style.setProperty("--knight-cy", String(ly));
      }
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [reduce, enabled]);

  if (reduce || !enabled) return null;

  const segments = [];
  for (let k = 0; k < TRAIL; k++) {
    const i = step - 1 - k;
    if (i < 0) break;
    segments.push({ from: TOUR[i], to: TOUR[i + 1], age: k });
  }

  return (
    <>
      {/* The board: hairline grid + coordinates, behind all content. */}
      <div aria-hidden="true" className="tour-board" style={{ opacity: faded ? 0 : undefined }}>
        <div className="tour-board-lines" />
        {FILES.map((f, i) => (
          <span
            key={f}
            className="tour-coord"
            style={{ left: `${(i + 0.5) * 12.5}%`, bottom: "3px", transform: "translateX(-50%)" }}
          >
            {f}
          </span>
        ))}
        {Array.from({ length: 8 }, (_, r) => (
          <span
            key={r}
            className="tour-coord"
            style={{ left: "4px", top: `${(7 - r + 0.5) * 12.5}%`, transform: "translateY(-50%)" }}
          >
            {r + 1}
          </span>
        ))}
      </div>

      {/* The trail: dashed L-paths in a stretched SVG (lines tolerate stretch). */}
      <svg
        aria-hidden="true"
        className="knight-tour"
        viewBox={`0 0 ${VB} ${VB}`}
        preserveAspectRatio="none"
        style={{ opacity: faded ? 0 : undefined }}
      >
        {segments.map((s) => {
          const fade = 0.06 * (1 - s.age / TRAIL);
          const [x1, y1] = frac(s.from);
          const [cx, cy] = ctrlFrac(s.from, s.to);
          const [x2, y2] = frac(s.to);
          return (
            <g key={`${s.from}-${s.to}`} style={{ opacity: fade, transition: "opacity 1.2s ease" }}>
              <path
                d={`M ${x1 * VB} ${y1 * VB} Q ${cx * VB} ${cy * VB} ${x2 * VB} ${y2 * VB}`}
                fill="none"
                stroke="var(--accent)"
                strokeWidth="1.5"
                strokeDasharray="4 7"
                vectorEffect="non-scaling-stroke"
              />
              <circle cx={x1 * VB} cy={y1 * VB} r="4" fill="var(--accent)" />
            </g>
          );
        })}
      </svg>

      {/* The knight: un-stretched layer, pixel transforms only. */}
      <div ref={knightRef} aria-hidden="true" className="tour-knight" style={{ opacity: faded ? 0 : undefined }}>
        <svg width={KNIGHT_SIZE} height={KNIGHT_SIZE} viewBox="0 0 24 24">
          <path d={KNIGHT_PATH} fill="var(--accent)" opacity="0.08" />
        </svg>
      </div>
    </>
  );
}
