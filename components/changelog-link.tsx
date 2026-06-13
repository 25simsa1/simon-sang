"use client";

import { useReducedMotion } from "framer-motion";
import { useScramble } from "use-scramble";

/**
 * Footer "changelog" stamp: the last git commit date in the analytical mono
 * voice. Hovering scrambles and re-resolves the text (same engine as the hero
 * decode). The real text stays available to assistive tech via a visually
 * hidden span; renders statically under reduced motion.
 */
export function ChangelogLink({ date }: { date: string }) {
  const reduce = useReducedMotion();
  const text = `changelog: ${date}`;

  const { ref, replay } = useScramble({
    text,
    speed: 0.6,
    tick: 1,
    step: 2,
    scramble: 4,
    playOnMount: false,
  });

  if (reduce) {
    return <span className="font-mono text-xs uppercase tracking-wider text-faint">{text}</span>;
  }

  return (
    <span
      className="font-mono text-xs uppercase tracking-wider text-faint"
      onMouseEnter={() => replay()}
    >
      <span className="sr-only">{text}</span>
      <span ref={ref} aria-hidden="true">
        {text}
      </span>
    </span>
  );
}
