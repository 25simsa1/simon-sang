/**
 * My Favorite Quotes on /about, a.k.a. how I'm trying to live.
 * Simon's picks, verbatim. Each card: decorative emoji, short bold title,
 * the quote, attribution (series name included for the anime quotes).
 */

export type Quote = {
  emoji: string;
  title: string;
  quote: string;
  attribution: string;
};

export const quotes: Quote[] = [
  {
    emoji: "⚔️",
    title: "Keep moving forward.",
    quote: "No matter what, I’ll keep moving forward",
    attribution: "Eren Yeager, Attack on Titan",
  },
  {
    emoji: "🔬",
    title: "Don't fool yourself.",
    quote:
      "The first principle is that you must not fool yourself, and you are the easiest person to fool.",
    attribution: "Richard Feynman",
  },
  {
    emoji: "🔥",
    title: "Set your heart ablaze.",
    quote: "Set your heart ablaze.",
    attribution: "Kyojuro Rengoku, Demon Slayer",
  },
  {
    emoji: "🥋",
    title: "Train how you fight.",
    quote: "You can only fight the way you practice.",
    attribution: "Miyamoto Musashi",
  },
];
