import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CaseStudy } from "@/components/case-study";
import { projects } from "@/data/work";

/**
 * Plain case-study page: what you get on a hard load, a shared link, or
 * mobile. Soft navigation from inside the site intercepts this route into
 * the modal instead (app/@modal).
 */
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  return { title: project?.title ?? "Project" };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();
  return (
    <div className="py-4">
      <Link
        href="/"
        className="font-mono text-xs text-muted transition-colors duration-200 hover:text-accent"
      >
        ← all projects
      </Link>
      <div className="mt-6">
        <CaseStudy project={project} />
      </div>
    </div>
  );
}
