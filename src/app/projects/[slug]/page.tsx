import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getPortfolioProjectBySlug,
  portfolioProjects,
} from "@/content/projects";
import { getRepositoryAnalysisById } from "@/content/repositoryAnalyses";
import {
  buildProjectDetailNavSections,
  getPortfolioWalkthroughData,
  hasNarrativeContent,
  hasPortfolioWalkthrough,
} from "@/data/projects";
import { siteContent } from "@/content/site";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Divider } from "@/components/ui/Divider";
import { Tag } from "@/components/ui/Tag";
import {
  TechnicalThumbnail,
  resolveTechnicalVisual,
} from "@/components/ui/TechnicalThumbnail";
import { ProjectAnalyzer } from "@/components/ProjectAnalyzer/ProjectAnalyzer";
import { ProjectNarrative } from "@/components/ProjectAnalyzer/ProjectNarrative";
import { ReviewBadge } from "@/components/ProjectAnalyzer/ReviewBadge";
import { ProjectDetailNav } from "@/components/projects/ProjectDetailNav";
import { BackToHomeLink } from "@/components/layout/BackToHomeLink";
import { ArchivePath } from "@/components/ui/ArchivePath";

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return portfolioProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = getPortfolioProjectBySlug(slug);

  if (!project) {
    return { title: "Project Not Found — ZSsite" };
  }

  return {
    title: `${project.title} — ZSsite`,
    description: project.summary,
  };
}

function PortfolioSection({
  label,
  items,
}: {
  label: string;
  items: string[];
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="panel-card p-5 md:p-6">
      <p className="font-mono text-meta uppercase tracking-wider text-muted">
        {label}
      </p>
      <ul className="mt-3 space-y-2 font-[family-name:var(--font-body-sc)] text-body leading-relaxed text-muted">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="text-accent">—</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = getPortfolioProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const visual = resolveTechnicalVisual(project.slug, project.type);
  const walkthroughData = getPortfolioWalkthroughData(slug);
  const linkedAnalysis = project.analysisId
    ? getRepositoryAnalysisById(project.analysisId)
    : undefined;
  const navSections = buildProjectDetailNavSections(walkthroughData, "portfolio");
  const showNav = navSections.length > 1;
  const { backToProjects, walkthroughLabel, walkthroughUnavailable } =
    siteContent.projectDetail;

  return (
    <div
      className={`mx-auto px-6 py-section md:px-12 lg:px-16 ${
        showNav ? "max-w-content-wide" : "max-w-content"
      }`}
    >
      <nav className="mt-0 flex flex-wrap items-center justify-between gap-x-5 gap-y-3">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <BackToHomeLink />
          <Link
            href="/projects"
            className="enter-indicator text-muted transition-colors hover:text-accent"
          >
            ← {backToProjects}
          </Link>
        </div>
        <ArchivePath
          segments={[
            { label: "Archive", href: "/" },
            { label: "Projects", href: "/projects" },
            { label: project.title },
          ]}
        />
      </nav>

      {showNav && (
        <ProjectDetailNav
          sections={navSections}
          variant="mobile"
          className="mt-6"
        />
      )}

      <div className={showNav ? "project-detail-body" : undefined}>
        <div className="project-detail-main min-w-0">
          <header
            id="project-overview"
            className="scroll-mt-24 mt-6 border-b border-border-soft pb-8 md:pb-10"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <SectionLabel withAccent>{walkthroughLabel}</SectionLabel>
              {project.ref && (
                <span className="font-mono text-meta text-muted">{project.ref}</span>
              )}
            </div>

            <h1 className="mt-4 font-[family-name:var(--font-body-sc)] text-h1 font-black tracking-tight md:text-[3rem]">
              {project.title}
            </h1>

            {project.subtitle ? (
              <p className="mt-2 font-[family-name:var(--font-body-sc)] text-body text-muted md:text-lg">
                {project.subtitle}
              </p>
            ) : null}

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-meta text-muted">
              <span>
                PERIOD{" "}
                <span className="font-semibold text-accent">{project.period}</span>
              </span>
              <span className="uppercase">{project.type}</span>
              <span className="status-chip">
                <span className="status-chip__dot" aria-hidden="true" />
                {project.status}
              </span>
            </div>

            <p className="mt-3 font-mono text-meta text-muted">{project.context}</p>

            <Divider accent className="my-5" />

            {walkthroughData?.review?.status === "ai-draft" ? (
              <div className="mb-5 flex flex-wrap items-center gap-3 rounded-sm border border-border-soft bg-surface/40 px-4 py-3">
                <ReviewBadge review={walkthroughData.review} />
                <p className="font-[family-name:var(--font-body-sc)] text-sm text-muted">
                  {walkthroughData.review.note ??
                    "关联的代码导读包含 AI 生成内容，尚未人工审核。"}
                </p>
              </div>
            ) : null}

            <p className="max-w-3xl font-[family-name:var(--font-body-sc)] text-body leading-relaxed text-muted md:text-lg">
              {project.summary}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {project.techStack.map((tech, i) => (
                <Tag key={tech} variant={i === 0 ? "accent" : "default"}>
                  {tech}
                </Tag>
              ))}
            </div>

            <figure className="group mt-6">
              <figcaption className="mb-2 font-mono text-meta uppercase tracking-wider text-muted">
                <span className="text-accent">◆</span> Schematic — {project.type}
              </figcaption>
              <TechnicalThumbnail
                variant={visual}
                className="h-40 w-full md:h-48"
              />
            </figure>

            {project.sourceSnapshot ? (
              <p className="mt-4 font-mono text-meta text-muted">
                SOURCE: project-snapshots/{project.sourceSnapshot}
              </p>
            ) : null}

            {linkedAnalysis ? (
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="font-mono text-meta text-muted">
                  Linked analysis:
                </span>
                <Link
                  href={`/analyzer/${linkedAnalysis.analysisId}`}
                  className="enter-indicator"
                >
                  {linkedAnalysis.analysisId} →
                </Link>
              </div>
            ) : null}
          </header>

          <div className="mt-8 grid gap-5 md:grid-cols-2 md:gap-6">
            <PortfolioSection label="Responsibilities" items={project.responsibilities} />
            <PortfolioSection label="Highlights" items={project.highlights} />
            <PortfolioSection label="Challenges" items={project.challenges} />
            <PortfolioSection
              label="Skills Demonstrated"
              items={project.skillsDemonstrated}
            />
          </div>

          <div className="mt-10 md:mt-12">
            {walkthroughData ? (
              <>
                <ProjectAnalyzer data={walkthroughData} mode="walkthrough" />
                {walkthroughData.narrative &&
                  hasNarrativeContent(walkthroughData.narrative) && (
                    <ProjectNarrative
                      narrative={walkthroughData.narrative}
                      className="mt-8 md:mt-10"
                    />
                  )}
              </>
            ) : (
              <div className="panel-card p-6 md:p-8">
                <p className="font-[family-name:var(--font-body-sc)] text-body text-muted">
                  {walkthroughUnavailable}
                </p>
                {hasPortfolioWalkthrough(slug) ? null : (
                  <p className="mt-3 font-mono text-meta text-muted">
                    可在 /analyzer 查看关联的公开仓库分析记录。
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {showNav && (
          <ProjectDetailNav sections={navSections} variant="desktop" />
        )}
      </div>
    </div>
  );
}
