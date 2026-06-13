import Image from "next/image";
import Link from "next/link";
import { DecodeText } from "@/components/decode-text";
import { PageHero } from "@/components/page-hero";
import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/reveal";
import { site, pageSquares } from "@/data/site";
import { projects } from "@/data/work";
import { now, nowLinks } from "@/data/now";

/** Inline 16px logo marks for the credentials line (grayscale so they sit
    quietly in the text, her Apple-glyph treatment). */
const previously = [
  { name: "Parsifal", logo: "/work/logos/parsifal.png" },
  { name: "NeuralSeek", logo: "/work/logos/neuralseek.png" },
  { name: "Mangusta Capital", logo: "/work/logos/mangusta.png" },
];

const nowRows = [
  { label: "building", value: now.building, href: nowLinks.building },
  { label: "reading", value: now.reading, href: nowLinks.reading },
  { label: "playing", value: now.playing, href: nowLinks.playing },
];

export default function HomePage() {
  return (
    <div>
      <PageHero square={pageSquares.home} className="pb-4 pt-20 sm:pt-24">
        <h1 className="text-4xl font-medium tracking-[0.0125em] sm:text-5xl">
          <DecodeText text="simon sang" />
        </h1>

        <Reveal delay={0.15}>
          {/* Quiet gray subtitle, one line on desktop. */}
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            {site.tagline}
          </p>
          {/* Credentials line: inline logo marks + the availability dot. */}
          <p className="mt-3 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-muted">
            Previously at{" "}
            {previously.map((c, i) => (
              <span key={c.name} className="inline-flex items-center gap-1">
                <Image
                  src={c.logo}
                  alt=""
                  aria-hidden="true"
                  width={16}
                  height={16}
                  className="inline-block rounded-full opacity-80 grayscale"
                />
                {c.name}
                {i < previously.length - 2 ? "," : i === previously.length - 2 ? ", &" : "."}
              </span>
            ))}
            <span
              className="breathe-dot ml-1 inline-block h-2 w-2 shrink-0 rounded-full bg-accent"
              aria-hidden="true"
            />
          </p>
        </Reveal>
      </PageHero>

      {/* The work greets you: 2-up grid of case-study cards. */}
      <Reveal delay={0.3}>
        <ul className="grid gap-5 sm:grid-cols-2">
          {projects.map((p, i) => (
            <li key={p.slug}>
              <ProjectCard project={p} index={i} />
            </li>
          ))}
        </ul>
      </Reveal>

      {/* NOW, compressed: one compact strip below the grid. */}
      <Reveal delay={0.45}>
        <section className="mt-16" aria-labelledby="now-heading">
          <div className="flex items-baseline justify-between">
            <h2 id="now-heading" className="text-sm font-medium uppercase tracking-wider text-muted">
              Now
            </h2>
            <p className="font-mono text-xs text-faint">updated {now.updated}</p>
          </div>
          <dl className="mt-3 divide-y divide-border overflow-hidden rounded-lg border border-border">
            {nowRows.map((row) => (
              <div
                key={row.label}
                className="group relative flex items-baseline gap-4 px-4 py-2.5 transition-colors duration-200 hover:bg-bg-elevated/60"
              >
                <dt className="w-20 shrink-0 font-mono text-xs uppercase tracking-wider text-muted">
                  {row.label}
                </dt>
                <dd className="min-w-0 truncate text-sm leading-relaxed">
                  {/* Stretched link: the whole row is one <a>. */}
                  <a
                    href={row.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="after:absolute after:inset-0 group-hover:text-accent"
                  >
                    {row.value}
                  </a>
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </Reveal>

      <Reveal delay={0.6}>
        <p className="mt-12 text-sm text-muted">
          Start with{" "}
          <Link href="/play" className="text-accent underline underline-offset-4">
            Play
          </Link>
          {". The resume stuff is parked under "}
          <Link href="/work" className="text-accent underline underline-offset-4">
            Work
          </Link>
          , where it belongs.
        </p>
      </Reveal>
    </div>
  );
}
