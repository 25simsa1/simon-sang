import { ArrowUpRight } from "lucide-react";
import { ShimmerImage } from "@/components/shimmer-image";
import type { Project } from "@/data/work";

/**
 * Case-study body, shared by the route-backed modal and the plain
 * /work/[slug] page: small art mark + title, the four-column metadata header
 * (Timeline / Role / Stack / Links), then the description and full image.
 */
export function CaseStudy({ project }: { project: Project }) {
  return (
    <div>
      <div className="flex items-center gap-4">
        {project.image && (
          <span
            className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-border"
            aria-hidden="true"
          >
            <ShimmerImage src={project.image.src} alt="" fill sizes="48px" className="object-cover" />
          </span>
        )}
        <h2 className="text-2xl font-semibold tracking-tight">{project.title}</h2>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-y border-border py-4 sm:grid-cols-4">
        <div>
          <dt className="font-mono text-xs uppercase tracking-wider text-muted">Timeline</dt>
          <dd className="mt-1 text-sm">{project.dates}</dd>
        </div>
        <div>
          <dt className="font-mono text-xs uppercase tracking-wider text-muted">Role</dt>
          <dd className="mt-1 text-sm">{project.role}</dd>
        </div>
        <div>
          <dt className="font-mono text-xs uppercase tracking-wider text-muted">Stack</dt>
          <dd className="mt-1 text-sm">{project.tags.join(", ")}</dd>
        </div>
        <div>
          <dt className="font-mono text-xs uppercase tracking-wider text-muted">Links</dt>
          <dd className="mt-1 text-sm">
            {project.github ? (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-accent transition-colors duration-200 hover:text-fg"
              >
                GitHub
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            ) : (
              <span className="text-muted">None yet</span>
            )}
          </dd>
        </div>
      </dl>

      <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted">{project.description}</p>

      {project.image && (
        <div
          className="relative mt-6 overflow-hidden rounded-xl border border-border"
          style={{ aspectRatio: `${project.image.width} / ${project.image.height}` }}
        >
          <ShimmerImage
            src={project.image.src}
            alt={project.image.alt}
            fill
            sizes="(max-width: 640px) 100vw, 680px"
            className="object-cover"
          />
        </div>
      )}
    </div>
  );
}
