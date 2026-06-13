/**
 * /about content. Content for /about; most sections are Simon's words
 * to rewrite in his own words — placeholders are marked.
 */


/** The "Hi!" intro bio (right column of the polaroid block). */
export const bio: string[] = [
  "I love anything about the markets, technology, and large language models. I especially like finding tangible, useful ways to apply AI in our lives without impinging on the importance of what we do ourselves.",
  "My whole name means 'to uphold' and 'of the highest standard' in my native language. I've tried to live up to that, pursuing my passions and whatever I do to the highest of standards.",
];

/** "Off the board" section, Simon's words verbatim. */
export const offBoard: string[] = [
  "Other than chess, somethings I like to do in my spare time is play tennis and workout. I used to play varsity tennis #3 on my high school team and still keep up with the ATP Tour (Meddy fan). I also used to not be the healthiest individual and that really lead me on my gym journey starting in 2022 right after COVID and I now can bench 285 for 6!",
  "Some other things that I haven\u2019t gotten into and would love to is running, hiking, and meditating. I had a little meditation phase in high school but ended up not having enough time, excited to pick that back up whenever I have the time.",
];

/** Philosophy entries, verbatim from Simon: bold title, explanation, receipt. */
export type Principle = {
  title: string;
  body: string;
  source: string;
};

export const principles: Principle[] = [
  {
    title: "Falsification over confirmation.",
    body: "A claim earns trust by surviving attempts to kill it.",
    source: "after Karl Popper",
  },
  {
    title: "Nullius in verba.",
    body: "Take nobody's word for it, including your own.",
    source: "motto of the Royal Society",
  },
  {
    title: "Bounded rationality.",
    body: "Time and information are always scarce. Run the experiment that rules out the most per dollar.",
    source: "after Herbert Simon",
  },
  {
    title: "The limits of my language are the limits of my world.",
    body: "A strict type system makes whole categories of confusion unsayable.",
    source: "Wittgenstein",
  },
  {
    title: "Attention is the rarest and purest form of generosity.",
    body: "Most blunders are failures of attention, not intelligence.",
    source: "Simone Weil",
  },
];

export type Failure = {
  title: string;
  story: string;
  lesson: string;
};

export const failures: Failure[] = [
  {
    title: "The strategy that fees killed",
    story:
      "Months of order-book infrastructure, clean features, a realistic backtester, and the spread edge was real, just ~1000× smaller than retail taker fees.",
    lesson:
      "The infrastructure was never wasted; the conclusion was the product. Cost structure is part of the hypothesis.",
  },
  {
    title: "IP-blocked mid-research",
    story:
      "An exchange rate-limited and then blocked my IP partway through data collection. I was hitting their API too aggressively with no real throttling. Getting back in meant exponential backoff, local caching so I stopped re-requesting data I already had, and a pipeline restructured to respect their limits from the start.",
    lesson:
      "Backoff, caching, and respect for the data source are part of the experiment design.",
  },
];

export const mentalHealth = {
  heading: "Mental health",
  // Simon's own words, verbatim. Do not edit, expand, or "improve".
  text:
    "When I was in 6th grade I lost my closest friend, my non-blood brother, to suicide. I not only lost him, I lost the ability to believe that a smile means someone is okay. That\u2019s why mental health advocacy matters to me. I don\u2019t want anyone else to disappear behind a \u2018fine\u2019 that nobody truly cared to dig deeper.",
};

// TODO(simon): the HPC Club mention below should link to the club's page —
// no official URL found on colby.edu (searched 2026-06). When you have one,
// turn this string into structured data with an href.
export const campus =
  "At Colby: Student Investment Association · High Performance Computing Club (social chair) · Asian Student Association (board) · Colby Consulting Group.";

export const skills: { group: string; items: string[] }[] = [
  { group: "Languages", items: ["Python", "Java", "TypeScript", "R"] },
  { group: "ML / Data", items: ["PyTorch", "NumPy", "pandas", "RAG", "Parquet"] },
  { group: "Finance", items: ["Financial modeling", "Valuation / DCF", "Power BI", "Excel"] },
  { group: "Engineering", items: ["WebSockets", "mypy", "ruff", "pytest", "Next.js"] },
];

/**
 * Tilted polaroid photo for /about. Set to null to hide; to show, drop a photo
 * in /public/about/ and fill this in.
 */
export const aboutPhoto: { src: string; alt: string; caption: string } | null = {
  src: "/about/about-polaroid.jpg", // 3:4 portrait, EXIF/GPS stripped, uncropped
  alt: "Simon Sang standing at a harbor on a sunny day",
  caption: "Bar Harbor, ME",
};
