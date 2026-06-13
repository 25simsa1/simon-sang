import { notFound } from "next/navigation";
import { CaseStudy } from "@/components/case-study";
import { CaseStudyModal } from "@/components/case-study-modal";
import { projects } from "@/data/work";

/** Intercepted /work/[slug]: the case study as a modal over the current page. */
export default async function CaseStudyModalRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();
  return (
    <CaseStudyModal title={project.title}>
      <CaseStudy project={project} />
    </CaseStudyModal>
  );
}
