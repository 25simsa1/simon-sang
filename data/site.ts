export const site = {
  name: "Simon Sang",
  url: "https://simonsang.com", // update when you pick a domain
  tagline: "I enjoy the journey and I also enjoy making it easier.",
  description:
    "Simon Sang: math, econ & CS at Colby College. AI/ML research, quantitative finance, chess, and honest negative results.",
  email: "simonlapsang@gmail.com",
  location: "Kansas City, KS / Waterville, ME",
  resume: "/resume.pdf",
  socials: [
    { label: "GitHub", href: "https://github.com/25simsa1" },
    { label: "LinkedIn", href: "https://linkedin.com/in/simonsang" },
    { label: "Email", href: "mailto:simonlapsang@gmail.com" },
  ],
} as const;

/**
 * Decorative chess-coordinate markers for each page.
 * Play gets a gambit, Work gets castling — the safe, necessary move.
 */
export const pageSquares: Record<string, string> = {
  home: "e4",
  play: "g4",
  writing: "Nf3",
  work: "O-O",
  about: "Kg2",
};
