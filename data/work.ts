export type Role = {
  org: string;
  title: string;
  dates: string;
  line: string;
  /** Optional external links shown under the role line (↗ pattern). */
  links?: { label: string; href: string }[];
  /** Circular chip logo in /public/work/logos/ (chip background baked into
      the image; NeuralSeek's is dark because its logo needs a dark ground).
      Roles without one fall back to the gray monogram chip. No fake logos. */
  logo?: string;
};

export type Project = {
  title: string;
  /** URL segment for the case-study route /work/[slug]. */
  slug: string;
  /** Case-study Role column (these are solo projects). */
  role: string;
  dates: string;
  description: string;
  tags: string[];
  github?: string;
  /** Real media image. Grid cards crop it to a uniform 16/9 panel via
      object-cover; `focal` sets object-position (e.g. "center top") so the crop
      keeps the right region. The case-study view shows the full, uncropped image. */
  image?: { src: string; alt: string; width: number; height: number; focal?: string };
  /** Short pill label shown on the media panel, "Name · Year" style. */
  pill?: string;
};

export const roles: Role[] = [
  {
    org: "Algoverse",
    logo: "/work/logos/algoverse.png",
    title: "Incoming AI/ML Researcher",
    dates: "July 2026",
    line: "Selected for mentored AI/ML research aimed at publication.",
  },
  {
    org: "Parsifal Corporation",
    logo: "/work/logos/parsifal.png",
    title: "AI & Operations Automation Intern",
    dates: "Mar 2026 – Present",
    line: "Automated multi-page Power BI reporting against an on-prem SQL warehouse; engineered format-agnostic extraction logic (pandas/openpyxl) that maps each supplier's distinct spreadsheet layout.",
  },
  {
    org: "NeuralSeek",
    logo: "/work/logos/neuralseek.png",
    title: "AI Automation Intern",
    dates: "Jan – Apr 2026",
    line: "AI governance: model-permission “AI Council” module and a tiered human-in-the-loop review system for high-risk queries.",
  },
  {
    org: "Mangusta Capital",
    logo: "/work/logos/mangusta.png",
    title: "Extern",
    dates: "Jan – Mar 2026",
    line: "Led due diligence on a $9.7M-seed AI startup; investment memo advanced to board review.",
  },
  {
    org: "Colby Student Investment Association",
    logo: "/work/logos/csia.png",
    title: "Portfolio Researcher",
    dates: "Sept 2025 – May 2026",
    line: "Pitched Target Hospitality to the endowment committee with DCF and comps built from scratch; added to the portfolio.",
    links: [
      {
        label: "View pitch deck",
        href: "https://docs.google.com/presentation/d/1IkQoJdeS7rKZgf3-uKYq6fNoOZJa7zc7pvaRSBdSIAU/",
      },
    ],
  },
  {
    org: "KU Cancer Center",
    title: "ACE Program Intern",
    dates: "Summer 2024",
    line: "Built and cleaned datasets in R for a patient-facing cancer resources app; presented to 250+ attendees.",
  },
];

export const projects: Project[] = [
  {
    title: "ARC-AGI-3 Research System",
    slug: "arc-agi-3",
    role: "Solo researcher & builder",
    dates: "June 2026 – present",
    description:
      "Training-free system for ARC-AGI-3, where frontier models score under 0.5%. LLM-proposed world-model rules verified by exact replay, evidence-seeking exploration, forward-search planning. Zero LLM calls at inference. Along the way: reverse-engineered undocumented evaluation semantics and refuted two claims from a published arXiv paper.",
    tags: ["Python", "world models", "search", "open-weight LLMs"],
    github: "https://github.com/25simsa1/arc-prize-2026",
    image: {
      src: "/art/arc-agi-harness.webp",
      alt: "Abstract art of a measurement scaffold around an empty stage, with a ledger of gray result tiles each checked by a green mark",
      width: 1408,
      height: 768,
    },
    pill: "ARC-AGI-3 · 2026",
  },
  {
    title: "Crypto Market Microstructure Platform",
    slug: "crypto-microstructure",
    role: "Solo builder",
    dates: "May 2026 – present",
    description:
      "Solo production-grade capture of Kraken and Coinbase order books at 1s resolution: WebSocket ingestion, validation, microstructure features, realistic backtester. The headline result is a negative one. Retail taker fees swamp sub-basis-point spreads by ~1000×. And that's the point.",
    tags: ["Python", "WebSockets", "Parquet", "mypy", "pytest"],
    github: "https://github.com/25simsa1/crypto-microstructure",
    image: {
      src: "/work/microstructure.jpg",
      alt: "Abstract art of dense data marks thinning through three sieve bars, with almost nothing remaining below",
      width: 768,
      height: 400,
    },
    pill: "Microstructure · 2026",
  },
  {
    title: "Micrograd",
    slug: "micrograd",
    role: "Solo builder",
    dates: "2026",
    description:
      "Scalar autograd engine with reverse-mode backprop and a small MLP library trained by gradient descent. Standard library only; the dependencies are the lesson.",
    tags: ["Python", "autodiff", "from scratch"],
    github: "https://github.com/25simsa1/micrograd_from_scratch",
    image: {
      src: "/art/micrograd.webp",
      alt: "Abstract art of a small neural network graph with a forward green flow and a backward graphite gradient flow through the same connections",
      width: 1376,
      height: 768,
    },
    pill: "Micrograd · 2026",
  },
  {
    title: "arXiv Frontier",
    slug: "arxiv-frontier",
    role: "Solo builder",
    dates: "2026",
    description:
      "CLI that ranks recent arXiv papers in the core ML categories by recency, citation impact, and venue, using the arXiv and Semantic Scholar APIs. No API keys required.",
    tags: ["Python", "arXiv API", "Semantic Scholar"],
    github: "https://github.com/25simsa1/arxiv-frontier",
    image: {
      src: "/art/arxiv-frontier-bars.webp",
      alt: "Abstract art of a sorted list of horizontal bars, the top three highlighted in green and amber, against a faint scatter of dots",
      width: 768,
      height: 1376,
      // Portrait source: anchor just below the top cream margin so the card
      // fills with the top-ranked green/amber bars and a few scatter dots,
      // cropping the lower gray tail. (Case-study view still shows the full chart.)
      focal: "center 16%",
    },
    pill: "arXiv Frontier · 2026",
  },
  {
    // No README in the repo yet, so no claims about what it does.
    // TODO(simon): supply real cover art + a 1-2 line description for Project-Sinan.
    // Until then the card falls back to the neutral monogram panel (no image/tint).
    title: "Project Sinan",
    slug: "project-sinan",
    role: "Solo builder",
    dates: "2026",
    description: "Python project.",
    tags: ["Python"],
    github: "https://github.com/25simsa1/Project-Sinan",
    pill: "Project Sinan · 2026",
  },
  {
    // The repo slug is java-interpretor, but the README names it tinylang:
    // a JavaScript-built mini-language. "Java Interpreter" would misdescribe it.
    title: "Tinylang",
    slug: "tinylang",
    role: "Solo builder",
    dates: "2026",
    description:
      "A small interpreted language built from scratch in JavaScript. Lexer, parser, and tree-walking interpreter with a REPL. The long-term goal is built-in automatic differentiation.",
    tags: ["JavaScript", "lexer", "parser", "REPL"],
    github: "https://github.com/25simsa1/java-interpretor",
    image: {
      src: "/art/tinylang.webp",
      alt: "Abstract art of source text resolving into a branching tree then collapsing to a single green result, with a faint backward gradient flow",
      width: 717,
      height: 607,
    },
    pill: "Tinylang · 2026",
  },
];
