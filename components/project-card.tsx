import Link from "next/link";
import { ShimmerImage } from "@/components/shimmer-image";
import type { Project } from "@/data/work";

/** Initials for the neutral fallback panel (e.g. "Project Sinan" -> "PS"). */
function monogram(title: string): string {
  const words = title.split(/\s+/).filter((w) => /^[A-Z0-9]/.test(w));
  return words.slice(0, 2).map((w) => w[0]).join("") || title[0]?.toUpperCase() || "·";
}

/**
 * Large rounded project card (her work-grid card): media panel with the white
 * pill label bottom-left, title + dates below. The whole card is one stretched
 * Link to the case-study route /work/[slug] (opens as a modal over the page,
 * a plain page on hard navigation). GitHub links live inside the case study.
 */
export function ProjectCard({ project, index = 0 }: { project: Project; index?: number }) {
  return (
    <article
      style={{ animationDelay: `${Math.min(index * 60, 300)}ms` }}
      className="card-enter card-soft group relative overflow-hidden rounded-2xl border border-border bg-bg transition-all duration-300 hover:scale-[0.99] hover:border-accent/60 motion-reduce:hover:scale-100"
    >
      {/* Fixed 16/9 panel for every card so a portrait/square cover can't make
          one card taller than its row siblings; object-cover + per-image focal
          point decides which region of the cover shows. */}
      <div
        aria-hidden={project.image ? undefined : "true"}
        className="relative aspect-[16/9]"
      >
        {project.image ? (
          <ShimmerImage
            src={project.image.src}
            alt={project.image.alt}
            fill
            sizes="(max-width: 640px) 100vw, 430px"
            className="object-cover"
            style={{ objectPosition: project.image.focal ?? "center" }}
          />
        ) : (
          // Neutral monogram fallback until real imagery exists (mirrors the
          // gray chip on the Work page). Replaces the old pastel tint.
          <div className="flex h-full w-full items-center justify-center bg-bg-elevated dark:opacity-80">
            <span aria-hidden="true" className="font-mono text-2xl text-faint">
              {monogram(project.title)}
            </span>
          </div>
        )}
        {project.pill && (
          <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-2.5 py-1 font-mono text-[11px] text-[#374151] shadow-[0_1px_4px_rgba(0,0,0,0.08)]">
            {project.pill}
          </span>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-medium">
          {/* Stretched link: the whole card is one Link, no nested interactives. */}
          <Link
            href={`/work/${project.slug}`}
            className="after:absolute after:inset-0 after:rounded-2xl group-hover:text-accent"
          >
            {project.title}
          </Link>
        </h3>
        <p className="mt-0.5 font-mono text-xs text-faint">{project.dates}</p>
      </div>
    </article>
  );
}
