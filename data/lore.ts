/**
 * Lore on /play: fun snippets from past lives. 3-up grid of cards —
 * rounded image, title, year. Add an image to /public/lore/ (≤200KB),
 * one entry here, done. The current images are neutral placeholder tiles
 * (generated solids, not stock photos) — swap in the real shots.
 */

export type LoreEntry = {
  title: string;
  year: string;
  /** `position` is CSS object-position — use it to keep the subject
      well-composed when the card's 4:3 crop differs from the image. */
  image: { src: string; alt: string; position?: string };
  href?: string;
};

export const lore: LoreEntry[] = [
  {
    title: "KUMC Poster Forum",
    year: "2024",
    image: {
      src: "/lore/kumc-poster-forum.jpg",
      alt: "Two students standing beside a research poster about an R program improving cancer patient resources at the KUMC poster forum",
      // Native 4:3, same as the card: no crop, both people and the poster
      // title stay in frame.
    },
  },
  {
    title: "First 2000+ rating",
    year: "TBD", // EDIT ME: the actual year
    image: {
      src: "/lore/the-knight.jpg",
      alt: "A single wooden knight chess piece on a pale desk in soft window light",
      // 4:3 crop of an ~11:6 image — 45% puts the knight on the left third line.
      position: "45% 50%",
    },
    href: "https://www.chess.com/member/simonschess06",
  },
  {
    title: "Pitched Target Hospitality",
    year: "2026",
    image: {
      src: "/lore/target-hospitality-pitch.jpg",
      alt: "Printed pitch pages with charts on a desk beside a closed laptop in soft window light",
      // 4:3 crop of an ~11:6 image — 67% keeps the pages on the left third
      // with the laptop balancing the right.
      position: "67% 50%",
    },
  },
  {
    title: "ARC-AGI-3 war room",
    year: "2026",
    image: {
      src: "/lore/arc-agi-war-room-v2.jpg",
      alt: "Abstract art of scattered colored pixel grids resolving left to right into one ordered pattern, with hand-drawn arrows and sketch lines",
      // 4:3 crop of an ~11:6 image — 40% keeps the messy left grids AND the
      // start of the resolved block; the story is the chaos→order progression.
      position: "40% 50%",
    },
    href: "https://github.com/25simsa1/arc-prize-2026",
  },
  {
    title: "High Performance Computing Club",
    year: "2025",
    image: {
      src: "/lore/hpc-club-v2.jpg",
      alt: "Abstract art of a grid of gray rectangles with a winding path of green ones connected by thin lines, and a single amber rectangle",
      // Center crop holds the lower-left→upper-right green diagonal (18%→80%)
      // and the amber rectangle (~72%) inside the 4:3 window.
      position: "50% 50%",
    },
    // TODO(simon): no official club page found on colby.edu (searched 2026-06;
    // only Colby's HPC services + ARC pages exist). Supply the club URL here:
    href: "",
  },
];
