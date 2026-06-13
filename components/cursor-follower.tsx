"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { KNIGHT_PATH } from "@/components/knight-tour";

/**
 * Custom cursor, three parts, all decorative (pointer-events: none; the
 * native pointer position and click targets are never altered):
 * - precision dot: tracks the pointer instantly; it IS the pointer.
 * - trailing ring: slightly underdamped spring, so fast movements overshoot
 *   ~10% and settle once, like a piece sliding into place. Magnetic: within
 *   ~24px of an interactive element it eases a few px toward it and scales
 *   to wrap small targets. Fades after 1.5s idle.
 * - knight mode: over a chess board ([data-chess-board]) the ring crossfades
 *   into the small knight silhouette, and the squares a knight could legally
 *   reach from the hovered square get faint dots that move with the hover.
 *
 * While active it adds `custom-cursor` to <html>, which hides the native
 * pointer (globals.css); text fields keep their I-beam. Never mounts on
 * touch devices or under reduced motion.
 */
const RING = 28;
const DOT = 6;
const KNIGHT = 20;
const INTERACTIVE = "a, button, [role='button'], input, select, textarea, label, summary";
const MAGNET_REACH = 24; // px probe distance around the pointer
const MAGNET_PULL = 6; // max px the ring drifts toward a target

const KNIGHT_DELTAS = [
  [1, 2], [2, 1], [-1, 2], [-2, 1],
  [1, -2], [2, -1], [-1, -2], [-2, -1],
];

type BoardDot = { x: number; y: number };

/** Nearest interactive element: direct hit first, then 4 probes ±24px. */
function findMagnetTarget(x: number, y: number, direct: Element | null): Element | null {
  const hit = direct?.closest?.(INTERACTIVE);
  if (hit) return hit;
  for (const [dx, dy] of [[MAGNET_REACH, 0], [-MAGNET_REACH, 0], [0, MAGNET_REACH], [0, -MAGNET_REACH]]) {
    const el = document.elementFromPoint(x + dx, y + dy)?.closest?.(INTERACTIVE);
    if (el) return el;
  }
  return null;
}

export function CursorFollower() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(false);
  const [idle, setIdle] = useState(false);
  const [magnetScale, setMagnetScale] = useState(1);
  const [knightMode, setKnightMode] = useState(false);
  const [boardDots, setBoardDots] = useState<BoardDot[]>([]);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSquare = useRef<string>("");

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  // Underdamped on purpose: ζ≈0.59 → one ~10% overshoot, then settled.
  const springX = useSpring(x, { stiffness: 350, damping: 17, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 350, damping: 17, mass: 0.6 });
  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);

  useEffect(() => {
    if (reduce) return;
    const fine = window.matchMedia("(pointer: fine)");
    if (!fine.matches) return;

    const root = document.documentElement;
    root.classList.add("custom-cursor");

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const target = e.target as Element | null;

      // Knight mode: over a board, the ring becomes the knight and the
      // legally reachable squares from the hovered square get faint dots.
      const board = target?.closest?.("[data-chess-board]") as HTMLElement | null;
      setKnightMode(!!board);
      if (board) {
        const r = board.getBoundingClientRect();
        const cell = r.width / 8;
        const f = Math.max(0, Math.min(7, Math.floor((e.clientX - r.left) / cell)));
        const rk = Math.max(0, Math.min(7, Math.floor((e.clientY - r.top) / cell)));
        const key = `${f}${rk}`;
        if (lastSquare.current !== key) {
          lastSquare.current = key;
          const dots: BoardDot[] = [];
          for (const [df, dr] of KNIGHT_DELTAS) {
            const nf = f + df;
            const nr = rk + dr;
            if (nf >= 0 && nf < 8 && nr >= 0 && nr < 8) {
              dots.push({ x: r.left + (nf + 0.5) * cell, y: r.top + (nr + 0.5) * cell });
            }
          }
          setBoardDots(dots);
        }
      } else if (lastSquare.current) {
        lastSquare.current = "";
        setBoardDots([]);
      }

      // Magnetic ring: drift a few px toward a nearby interactive element
      // and scale to wrap small ones. The dot (the real pointer) never moves.
      let rx = e.clientX;
      let ry = e.clientY;
      let scale = 1;
      const magnet = board ? null : findMagnetTarget(e.clientX, e.clientY, target);
      if (magnet) {
        const mr = magnet.getBoundingClientRect();
        const cx = mr.left + mr.width / 2;
        const cy = mr.top + mr.height / 2;
        const dist = Math.hypot(cx - e.clientX, cy - e.clientY) || 1;
        const pull = Math.min(MAGNET_PULL, dist);
        rx += ((cx - e.clientX) / dist) * pull;
        ry += ((cy - e.clientY) / dist) * pull;
        // Wrap small targets; large ones just get the standard grow.
        const maxDim = Math.max(mr.width, mr.height);
        scale = maxDim <= 90 ? Math.min(2.6, (maxDim + 10) / RING) : 1.8;
      }
      x.set(rx - RING / 2);
      y.set(ry - RING / 2);
      dotX.set(e.clientX - DOT / 2);
      dotY.set(e.clientY - DOT / 2);
      setMagnetScale(scale);
      setActive(true);

      // The ring is motion feedback; a parked cursor shouldn't wear a halo.
      setIdle(false);
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => setIdle(true), 1500);
    };
    const onLeave = () => setActive(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      root.classList.remove("custom-cursor");
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [reduce, x, y, dotX, dotY]);

  if (reduce) return null;

  return (
    <>
      {/* Trailing ring: underdamped spring, magnetic, crossfades out in knight mode. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[var(--z-cursor-ring)] hidden rounded-full bg-accent/10 ring-1 ring-accent/30 [@media(pointer:fine)]:block"
        style={{
          x: springX,
          y: springY,
          width: RING,
          height: RING,
          opacity: active && !idle && !knightMode ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
        animate={{ scale: magnetScale }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
      />
      {/* Knight mode: the silhouette rides the same spring as the ring. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[var(--z-cursor-ring)] hidden [@media(pointer:fine)]:block"
        style={{
          x: springX,
          y: springY,
          width: RING,
          height: RING,
          opacity: active && knightMode ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      >
        <svg
          viewBox="0 0 24 24"
          width={KNIGHT}
          height={KNIGHT}
          style={{ margin: (RING - KNIGHT) / 2 }}
        >
          <path d={KNIGHT_PATH} fill="var(--accent)" opacity="0.45" />
        </svg>
      </motion.div>
      {/* Knight-mode reachable-square dots: pure overlay, never intercepts. */}
      {boardDots.map((d, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="pointer-events-none fixed left-0 top-0 z-[var(--z-cursor-dots)] hidden h-2 w-2 rounded-full bg-accent [@media(pointer:fine)]:block"
          style={{
            transform: `translate3d(${d.x - 4}px, ${d.y - 4}px, 0)`,
            opacity: knightMode ? 0.35 : 0,
            transition: "opacity 0.25s ease",
          }}
        />
      ))}
      {/* Center dot: tracks instantly so clicking feels precise. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[var(--z-cursor-dot)] hidden rounded-full bg-fg [@media(pointer:fine)]:block"
        style={{
          x: dotX,
          y: dotY,
          width: DOT,
          height: DOT,
          opacity: active ? 1 : 0,
        }}
      />
    </>
  );
}
