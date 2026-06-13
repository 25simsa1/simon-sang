import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { RatingChart } from "@/components/rating-chart";
import { ChessGameLazy, PuzzleLazy } from "@/components/chess-lazy";
import { ShelfRows } from "@/components/shelf-rows";
import { ArrowUpRight } from "lucide-react";
import { ShimmerImage } from "@/components/shimmer-image";
import { getRapidStats, getRapidJourney, chessProfileUrl, chessUsername } from "@/lib/chesscom";
import { games } from "@/data/chess";
import { fandoms } from "@/data/esports";
import { lore } from "@/data/lore";
import { pageSquares } from "@/data/site";

export const metadata: Metadata = {
  title: "Play",
  description: "Chess, esports, and the life shelf.",
};

export default async function PlayPage() {
  const stats = await getRapidStats();
  const journey = getRapidJourney();
  return (
    <div>
      <PageHero square={pageSquares.play}>
        <h1 className="mb-2 text-3xl font-semibold tracking-tight">Play</h1>
        <p className="max-w-xl text-muted">
          The stuff I&rsquo;d talk about if you got me away from a desk: chess, the games I
          watch, and what&rsquo;s on the shelf.
        </p>
      </PageHero>

      <Reveal>
        <Section square="d4" title="The rating journey">
          {/* Stat card: live from the Chess.com API, every number labeled with
              its pool. The whole card is one stretched link to the profile. */}
          <div className="card-soft group relative mb-6 flex max-w-xl flex-wrap items-end justify-between gap-x-8 gap-y-4 rounded-2xl border border-border bg-bg p-5 transition-all duration-300 hover:scale-[0.99] hover:border-accent/60 motion-reduce:hover:scale-100">
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-faint">
                rapid · chess.com{!stats.live && " · cached"}
              </p>
              <p className="mt-1 font-mono text-4xl font-medium">{stats.current}</p>
              <a
                href={chessProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-center gap-0.5 text-sm text-muted after:absolute after:inset-0 after:rounded-2xl group-hover:text-accent"
              >
                @{chessUsername}
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>
            <dl className="flex gap-8 text-sm">
              {stats.best && (
                <div>
                  <dt className="font-mono text-xs uppercase tracking-wider text-faint">peak</dt>
                  <dd className="mt-1 font-mono">{stats.best}</dd>
                </div>
              )}
              {stats.record && (
                <div>
                  <dt className="font-mono text-xs uppercase tracking-wider text-faint">record</dt>
                  <dd className="mt-1 font-mono">
                    {stats.record.win}–{stats.record.loss}–{stats.record.draw}
                  </dd>
                </div>
              )}
            </dl>
          </div>
          <p className="mb-4 max-w-xl text-sm leading-relaxed text-muted">
            Live from the Chess.com API and labeled with its pool; one number should
            mean one thing. Every hundred points past 2000 is bought with a different
            currency.
          </p>
          <RatingChart data={journey} peak={stats.best} />
        </Section>
      </Reveal>

      <Reveal>
        <Section square="f7" title="Games worth replaying">
          <div className="space-y-10">
            {games.map((game) => (
              <article key={game.id} className="rounded-lg border border-border p-4 sm:p-6">
                <h3 className="mb-4 font-medium">{game.title}</h3>
                <ChessGameLazy game={game} />
              </article>
            ))}
          </div>
        </Section>
      </Reveal>

      <Reveal>
        <Section square="h4" title="Puzzle of the week">
          <PuzzleLazy />
        </Section>
      </Reveal>

      <Reveal>
        <Section square="c6" title="What I watch">
          <div className="grid gap-4 sm:grid-cols-2">
            {fandoms.map((f) => (
              <article key={f.title} className="rounded-lg border border-border p-5 transition-colors duration-200 hover:border-accent/50">
                <h3 className="font-medium">{f.title}</h3>
                <p className="mt-0.5 text-sm text-faint">{f.subtitle}</p>
                {f.paragraphs.map((p, i) => (
                  <p key={i} className="mt-3 text-sm leading-relaxed text-muted">
                    {p}
                  </p>
                ))}
                {/* Footer line: quiet gray metadata, matching the shelf rows' label style. */}
                {f.favorites && (
                  <p className="mt-4 font-mono text-xs text-muted">
                    {f.favorites.label}: {f.favorites.items.join(" · ")}
                  </p>
                )}
              </article>
            ))}
          </div>
        </Section>
      </Reveal>

      <Reveal>
        <Section square="a8" title="Life shelf">
          <p className="mb-6 max-w-xl text-sm text-muted">
            Books, music, and games. Favorites by default, the rest by year.
          </p>
          <ShelfRows />
        </Section>
      </Reveal>

      <Reveal>
        <Section
          square="b7"
          title={
            <>
              Lore <span aria-hidden="true">✧˙⋆</span>
            </>
          }
          subtitle="Fun snippets from past lives"
          className="mb-0"
        >
          <ul className="grid gap-5 sm:grid-cols-3">
            {lore.map((entry) => (
              <li key={entry.title} className="group relative">
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:transform-none">
                  <ShimmerImage
                    src={entry.image.src}
                    alt={entry.image.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, 280px"
                    className="object-cover"
                    style={entry.image.position ? { objectPosition: entry.image.position } : undefined}
                  />
                </div>
                <p className="mt-2 text-sm">
                  {entry.href ? (
                    // Stretched link: the whole card is one <a>.
                    <a
                      href={entry.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium after:absolute after:inset-0 group-hover:text-accent"
                    >
                      {entry.title}
                    </a>
                  ) : (
                    <span className="font-medium">{entry.title}</span>
                  )}
                  <span className="text-muted"> · {entry.year}</span>
                </p>
              </li>
            ))}
          </ul>
        </Section>
      </Reveal>
    </div>
  );
}
