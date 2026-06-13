"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Blockquote whose underline draws left-to-right when scrolled into view —
 * michelle-liu.com's quote animation, recolored to the accent. Static underline
 * under reduced motion (handled in CSS).
 */
export function Quote({ text, attribution }: { text: string; attribution: string }) {
  const ref = useRef<HTMLQuoteElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <blockquote ref={ref} className="my-10 max-w-xl">
      <p className="text-lg leading-relaxed">
        <span className={cn("quote-underline", inView && "revealed")}>{text}</span>
      </p>
      <footer className="mt-3 font-mono text-xs text-muted">{attribution}</footer>
    </blockquote>
  );
}
