"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { KNIGHT_PATH } from "@/components/knight-tour";

/**
 * Ambient chess-piece field for the hero margins: faint scattered silhouettes
 * (knight, pawn, rook, bishop) flanking the centered name/tagline column, so
 * the empty band on either side reads as quiet texture instead of dead space.
 *
 * One more layer in the ambient stack (board, grain, grid pulse, knight tour).
 * It deliberately adds NO continuous motion — the only movement is a few px of
 * scroll parallax (GPU transform), off under prefers-reduced-motion — so total
 * idle motion noise is unchanged. Sits behind the hero text (negative z within
 * the band's own stacking context), pointer-events: none, aria-hidden.
 *
 * Color/opacity live in globals.css: sage in light, light gray in dark, at
 * --hero-pieces-opacity per mode (0 kills the layer). Shown only ≥lg (1024px),
 * where the centered max-w-4xl (896px) column leaves ~96px margins to fill;
 * below that the band has no room beside the text, so the layer is display:none.
 */

type PieceType = "knight" | "pawn" | "rook" | "bishop";
type Piece = { t: PieceType; x: number; y: number; s: number; r: number };

/** Hand-placed scatter (percent of the band), STATIC so SSR and client render
    identically — no Math.random at render time. Every x is ≤7% or ≥93% so the
    pieces hug the band edges and stay clear of the centered text column even at
    the 1024px floor (where each margin is only ~96px). Sizes 24-40px, slight
    rotation. Verified non-overlapping down to 1024px. */
const PIECES: Piece[] = [
  { t: "knight", x: 5, y: 15, s: 40, r: -12 },
  { t: "pawn", x: 4, y: 31, s: 24, r: 8 },
  { t: "rook", x: 6.5, y: 47, s: 32, r: -6 },
  { t: "bishop", x: 3.5, y: 63, s: 28, r: 11 },
  { t: "pawn", x: 6, y: 79, s: 24, r: -9 },
  { t: "knight", x: 4, y: 92, s: 30, r: 7 },
  { t: "bishop", x: 95, y: 13, s: 40, r: 13 },
  { t: "pawn", x: 96.5, y: 29, s: 24, r: -10 },
  { t: "rook", x: 93.5, y: 45, s: 32, r: 8 },
  { t: "knight", x: 96, y: 61, s: 34, r: -14 },
  { t: "pawn", x: 93.5, y: 76, s: 24, r: 6 },
  { t: "rook", x: 96, y: 90, s: 40, r: -6 },
];

// Simple 24×24 silhouettes (knight reused from the tour for one visual family).
const PAWN =
  "M12 1 a3 3 0 1 0 0.001 0 Z M9 21 C9 13 11 8 12 7 C13 8 15 13 15 21 Z M6.5 20 H17.5 V22.5 H6.5 Z";
const ROOK =
  "M6 4 L8.5 4 L8.5 5.8 L10.7 5.8 L10.7 4 L13.3 4 L13.3 5.8 L15.5 5.8 L15.5 4 L18 4 L18 8 L16.5 8 L16 16.5 L17.5 18 L17.5 22 L6.5 22 L6.5 18 L8 16.5 L7.5 8 L6 8 Z";
const BISHOP =
  "M12 1.6 a1.4 1.4 0 1 0 0.001 0 Z M12 4 C8.8 7 8 11.5 9.8 15 L14.2 15 C16 11.5 15.2 7 12 4 Z M9 15 H15 L15.5 16.6 H8.5 Z M7 18 Q12 16.4 17 18 L18 22 L6 22 Z";

const PATHS: Record<PieceType, string> = {
  knight: KNIGHT_PATH,
  pawn: PAWN,
  rook: ROOK,
  bishop: BISHOP,
};

export function HeroPieces() {
  const reduce = useReducedMotion();
  const layerRef = useRef<HTMLDivElement | null>(null);

  // Gentle scroll parallax: at most a few px of vertical drift, one transform
  // write per frame, passive listener. Skipped entirely under reduced motion.
  useEffect(() => {
    if (reduce) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const drift = Math.min(window.scrollY * 0.04, 8);
        if (layerRef.current)
          layerRef.current.style.transform = `translate3d(0, ${drift}px, 0)`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduce]);

  return (
    <div
      aria-hidden="true"
      className="hero-pieces pointer-events-none absolute inset-0 -z-10 hidden overflow-hidden lg:block"
    >
      <div ref={layerRef} className="h-full w-full will-change-transform">
        {PIECES.map((p, i) => (
          <svg
            key={i}
            viewBox="0 0 24 24"
            width={p.s}
            height={p.s}
            className="hero-piece absolute"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              transform: `translate(-50%, -50%) rotate(${p.r}deg)`,
            }}
          >
            <path d={PATHS[p.t]} />
          </svg>
        ))}
      </div>
    </div>
  );
}
