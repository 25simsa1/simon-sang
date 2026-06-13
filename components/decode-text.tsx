"use client";

import { useReducedMotion } from "framer-motion";
import { useScramble } from "use-scramble";

/**
 * Hero decode effect, powered by use-scramble: the text scrambles in and
 * resolves left to right. The real text is always present for assistive tech
 * (and crawlers) via a visually-hidden span, since the hook mutates the
 * animated node's text content. Renders statically under reduced motion.
 */
export function DecodeText({ text, className }: { text: string; className?: string }) {
  const reduce = useReducedMotion();

  const { ref } = useScramble({
    text,
    speed: 0.55,
    tick: 1,
    step: 1,
    scramble: 6,
    seed: 2,
  });

  if (reduce) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span ref={ref} aria-hidden="true" />
    </span>
  );
}
