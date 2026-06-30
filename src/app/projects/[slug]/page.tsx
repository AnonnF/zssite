import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectBySlug, projects } from "@/content/projects";
import {
  buildProjectDetailNavSections,
  getProjectAnalyzerData,
  hasNarrativeContent,
  hasProjectAnalyzer,
} from "@/data/projects";
import { siteContent } from "@/content/site";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Divider } from "@/components/ui/Divider";
import { Tag } from "@/components/ui/Tag";
import { ProjectAnalyzer } from "@/components/ProjectAnalyzer/ProjectAnalyzer";
import { ProjectNarrative } from "@/components/ProjectAnalyzer/ProjectNarrative";
import { ProjectDetailNav } from "@/components/projects/ProjectDetailNav";

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return projects
    .filter((project) => hasProjectAnalyzer(project.slug))
    .map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return { title: "Project Not Found — ZSsite" };
  }

  return {
    title: `${project.title} — ZSsite`,
    description: project.summary,
  };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const analyzerData = getProjectAnalyzerData(slug);
  const navSections = buildProjectDetailNavSections(analyzerData);
  const showNav = navSections.length > 1;
  const { backToProjects, analyzerLabel } = siteContent.projectDetail;

  return (
    <div className="mx-auto max-w-content px-6 py-section md:px-12 lg:px-16">
      <Link
        href="/projects"
        className="enter-indicator text-muted transition-colors hover:text-accent"
      >
        ← {backToProjects}
      </Link>

      {showNav && (
        <ProjectDetailNav
          sections={navSections}
          variant="mobile"
          className="mt-6"
        />
      )}

      <div className={showNav ? "lg:flex lg:items-start lg:gap-10" : undefined}>
        <div className="min-w-0 flex-1">
          <header
            id="project-overview"
            className="scroll-mt-24 mt-6 border-b border-border-soft pb-8 md:pb-10"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <SectionLabel withAccent>{analyzerLabel}</SectionLabel>
              {project.ref && (
                <span className="font-mono text-meta text-muted">{project.ref}</span>
              )}
            </div>

            <h1 className="mt-4 font-[family-name:var(--font-body-sc)] text-h1 font-black tracking-tight md:text-[3rem]">
              {project.title}
            </h1>

            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 font-mono text-meta text-muted">
              <span>
                YEAR{" "}
                <span className="font-semibold text-accent">{project.year}</span>
              </span>
              <span className="uppercase">{project.type}</span>
              <span className="uppercase">{project.status}</span>
            </div>

            <Divider accent className="my-5" />

            <p className="max-w-3xl font-[family-name:var(--font-body-sc)] text-body leading-relaxed text-muted md:text-lg">
              {project.summary}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {project.stack.map((tech, i) => (
                <Tag key={tech} variant={i === 0 ? "accent" : "default"}>
                  {tech}
                </Tag>
              ))}
            </div>
          </header>

          <div className="mt-10 md:mt-12">
            {analyzerData ? (
              <>
                <ProjectAnalyzer data={analyzerData} />
                {analyzerData.narrative &&
                  hasNarrativeContent(analyzerData.narrative) && (
                    <ProjectNarrative
                      narrative={analyzerData.narrative}
                      className="mt-8 md:mt-10"
                    />
                  )}
              </>
            ) : (
              <div className="panel-card p-6 md:p-8">
                <p className="font-[family-name:var(--font-body-sc)] text-body text-muted">
                  {siteContent.projectDetail.analyzerUnavailable}
                </p>
              </div>
            )}
          </div>
        </div>

        {showNav && (
          <ProjectDetailNav
            sections={navSections}
            variant="desktop"
            className="hidden lg:block"
          />
        )}
      </div>
    </div>
  );
}
