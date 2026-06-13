/**
 * The "Now" block on the home page. Update monthly — each entry is one line.
 */
export const now = {
  updated: "June 2026",
  building:
    "A training-free system for ARC-AGI-3: world-model rules verified by exact replay, zero LLM calls at inference.",
  reading: "Thinking in Bets, Annie Duke", // swap for whatever is actually on your desk
  playing:
    "Rapid on chess.com, and watching the R6 Siege pro scene more than is reasonable.",
} as const;

/** Where each Now row links (keep in sync with the entries above). */
export const nowLinks = {
  building: "https://github.com/25simsa1/arc-prize-2026",
  reading: "https://openlibrary.org/works/OL19736287W", // the shelf's Thinking in Bets
  playing: "https://www.chess.com/member/simonschess06",
} as const;
