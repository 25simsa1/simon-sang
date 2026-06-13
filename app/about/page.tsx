import type { Metadata } from "next";
import { GraduationCap, MapPin } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Quote } from "@/components/quote";
import { Section } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { ShimmerImage } from "@/components/shimmer-image";
import { bio, offBoard, principles, failures, mentalHealth, campus, skills, aboutPhoto } from "@/data/about";
import { quotes } from "@/data/quotes";
import { getRapidStats } from "@/lib/chesscom";
import { pageSquares } from "@/data/site";

export const metadata: Metadata = {
  title: "About",
  description: "How I think. Edges, honest results, and the thread connecting chess, markets, and research.",
};

/** Simple pawn silhouette in the lucide stroke style (1.8px, round caps) —
    lucide has no pawn, and the ♟ glyph renders inconsistently across platforms. */
function PawnIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="6.5" r="2.5" />
      <path d="M10.8 8.9c.3 2.1-.5 4.2-1.8 6.1h6c-1.3-1.9-2.1-4-1.8-6.1" />
      <path d="M9 15l-1.2 3.5h8.4L15 15" />
      <path d="M7 21.5h10" />
    </svg>
  );
}

/** Anchor sidebar entries — ids must match the Section ids below. */
const anchors = [
  { id: "thread", label: "Hi!" },
  { id: "off-the-board", label: "Off the board" },
  { id: "quotes", label: "Quotes" },
  { id: "philosophy", label: "Philosophy" },
  { id: "failures", label: "Failures" },
  { id: "mental-health", label: "Mental health" },
  { id: "toolbox", label: "Toolbox" },
];

export default async function AboutPage() {
  const chess = await getRapidStats();
  return (
    <div>
      <PageHero square={pageSquares.about}>
        <h1 className="mb-2 text-3xl font-semibold tracking-tight">About</h1>
        <p className="max-w-xl text-muted">How I think.</p>
      </PageHero>

      <div className="lg:grid lg:grid-cols-[9rem_1fr] lg:gap-12">
        {/* Sticky anchor sidebar (her About pattern): real links, desktop only —
            on smaller screens the headings carry the structure. */}
        <nav aria-label="On this page" className="hidden lg:block">
          <ul className="sticky top-24 space-y-2 text-sm">
            {anchors.map((a) => (
              <li key={a.id}>
                <a
                  href={`#${a.id}`}
                  className="text-muted transition-colors duration-200 hover:text-accent"
                >
                  {a.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <Reveal>
            <Section id="thread" square="e6" title="Hi, I'm Simon!">
              {/* Reference layout: tilted polaroid left, intro right. */}
              <div className="gap-10 sm:flex sm:items-start">
                {aboutPhoto && (
                  <figure className="mx-auto mb-8 w-56 shrink-0 -rotate-2 rounded-md border border-border bg-bg p-2 pb-4 shadow-[var(--shadow-soft)] sm:mx-0 sm:mb-0 sm:mt-1">
                    {/* Frame matches the photo's 3:4 — the photo is never cropped. */}
                    <div className="relative aspect-[3/4] overflow-hidden rounded-sm">
                      <ShimmerImage
                        src={aboutPhoto.src}
                        alt={aboutPhoto.alt}
                        fill
                        sizes="224px"
                        className="object-cover"
                      />
                    </div>
                    <figcaption className="mt-2 text-center font-mono text-xs text-faint">
                      {aboutPhoto.caption}
                    </figcaption>
                  </figure>
                )}
                <div className="max-w-xl">
                  {/* Line icons in the metadata gray, decorative; uniform
                      6px icon-to-label gap via flex, not glyph whitespace. */}
                  <p className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-muted">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 shrink-0" strokeWidth={1.8} aria-hidden="true" />
                      Kansas City, KS / Waterville, ME
                    </span>
                    <span className="flex items-center gap-1.5">
                      <GraduationCap className="h-4 w-4 shrink-0" strokeWidth={1.8} aria-hidden="true" />
                      Math, Econ &amp; CS / Colby College
                    </span>
                    <span className="flex items-center gap-1.5">
                      <PawnIcon className="h-4 w-4 shrink-0" />
                      {chess.current} rapid
                    </span>
                  </p>
                  <div className="mt-4 space-y-4 leading-relaxed">
                    {bio.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                  <p className="mt-6 inline-flex items-center gap-2.5 rounded-full border border-accent/25 bg-accent-soft px-4 py-2 text-sm">
                    <span
                      className="pulse-dot inline-block h-2 w-2 shrink-0 rounded-full bg-accent"
                      aria-hidden="true"
                    />
                    <span>
                      Working on something cool? Get in{" "}
                      <a
                        href="mailto:simonlapsang@gmail.com"
                        className="text-accent underline underline-offset-4 transition-colors duration-200 hover:text-fg"
                      >
                        touch
                      </a>
                      !
                    </span>
                  </p>
                </div>
              </div>
            </Section>
          </Reveal>

          <Reveal>
            <Section id="off-the-board" square="g6" title="Off the board">
              <div className="max-w-xl space-y-4 leading-relaxed">
                {offBoard.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </Section>
          </Reveal>

          <Reveal>
            <Section
              id="quotes"
              square="d5"
              title="My Favorite Quotes"
              subtitle="a.k.a. how I'm trying to live"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                {quotes.map((q) => (
                  <article key={q.title} className="card-soft rounded-2xl border border-border bg-bg p-5">
                    <p aria-hidden="true" className="text-2xl">
                      {q.emoji}
                    </p>
                    <h3 className="mt-3 font-medium">{q.title}</h3>
                    <blockquote className="mt-1.5 text-sm leading-relaxed text-muted">
                      &ldquo;{q.quote}&rdquo;
                      <footer className="mt-2 text-xs text-muted">{q.attribution}</footer>
                    </blockquote>
                  </article>
                ))}
              </div>
            </Section>
          </Reveal>

          <Reveal>
            {/* Plain list, no cards, no emoji: bold principle, gray
                explanation, lighter italic receipt. */}
            <Section
              id="philosophy"
              square="c4"
              title="Philosophy"
              subtitle="ideas I keep coming back to"
            >
              <ul className="max-w-xl space-y-5">
                {principles.map((p) => (
                  <li key={p.title} className="leading-relaxed">
                    <p className="font-medium">{p.title}</p>
                    <p className="mt-0.5 text-sm text-muted">{p.body}</p>
                    <p className="mt-0.5 text-xs italic text-muted">{p.source}</p>
                  </li>
                ))}
              </ul>
            </Section>
          </Reveal>

          <Reveal>
            <Section id="failures" square="f2" title="Failures & lessons">
              <Quote
                text="The mistakes are all there, waiting to be made."
                attribution="Savielly Tartakower, on the starting position"
              />
              <p className="mb-4 max-w-xl text-sm text-muted">
                Kept on purpose.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {failures.map((f) => (
                  <article key={f.title} className="card-soft rounded-2xl border border-border bg-bg p-5">
                    <h3 className="font-medium">{f.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{f.story}</p>
                    <p className="mt-3 border-t border-border pt-3 text-sm leading-relaxed">
                      <span className="font-mono text-xs uppercase tracking-wider text-faint">lesson · </span>
                      {f.lesson}
                    </p>
                  </article>
                ))}
              </div>
            </Section>
          </Reveal>

          <Reveal>
            <Section id="mental-health" square="g8" title={mentalHealth.heading}>
              {/* Normal body type, nothing decorative. The words are exact. */}
              <p className="max-w-xl leading-relaxed">{mentalHealth.text}</p>
            </Section>
          </Reveal>

          <Reveal>
            <Section id="toolbox" square="b3" title="Toolbox">
              <dl className="grid gap-4 sm:grid-cols-2">
                {skills.map((s) => (
                  <div key={s.group} className="rounded-2xl border border-border p-4">
                    <dt className="font-mono text-xs uppercase tracking-wider text-faint">{s.group}</dt>
                    <dd className="mt-2 text-sm leading-relaxed text-muted">{s.items.join(" · ")}</dd>
                  </div>
                ))}
              </dl>
            </Section>
          </Reveal>

          <Reveal>
            <p className="text-sm text-faint">{campus}</p>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
