import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getRepositoryAnalysisById,
  repositoryAnalyses,
  reviewStatusToReviewMeta,
} from "@/content/repositoryAnalyses";
import { getPortfolioProjectByAnalysisId } from "@/content/projects";
import {
  buildProjectDetailNavSections,
  getRepositoryAnalyzerData,
  hasNarrativeContent,
  hasRepositoryAnalyzer,
} from "@/data/projects";
import { siteContent } from "@/content/site";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Divider } from "@/components/ui/Divider";
import { Tag } from "@/components/ui/Tag";
import { ProjectAnalyzer } from "@/components/ProjectAnalyzer/ProjectAnalyzer";
import { ProjectNarrative } from "@/components/ProjectAnalyzer/ProjectNarrative";
import { ReviewBadge } from "@/components/ProjectAnalyzer/ReviewBadge";
import { ProjectDetailNav } from "@/components/projects/ProjectDetailNav";
import { LinkedToPortfolioBadge } from "@/components/analyzer/LinkedToPortfolioBadge";
import { BackToHomeLink } from "@/components/layout/BackToHomeLink";
import { ArchivePath } from "@/components/ui/ArchivePath";

interface AnalysisDetailPageProps {
  params: Promise<{ analysisId: string }>;
}

export function generateStaticParams() {
  return repositoryAnalyses
    .filter((item) => hasRepositoryAnalyzer(item.analysisId))
    .map((item) => ({ analysisId: item.analysisId }));
}

export async function generateMetadata({ params }: AnalysisDetailPageProps) {
  const { analysisId } = await params;
  const analysis = getRepositoryAnalysisById(analysisId);

  if (!analysis) {
    return { title: "Analysis Not Found — ZSsite" };
  }

  return {
    title: `${analysis.title} — Repository Analysis — ZSsite`,
    description: analysis.summary,
  };
}

export default async function AnalysisDetailPage({
  params,
}: AnalysisDetailPageProps) {
  const { analysisId } = await params;
  const analysis = getRepositoryAnalysisById(analysisId);

  if (!analysis) {
    notFound();
  }

  const analyzerData = getRepositoryAnalyzerData(analysisId);
  const linkedPortfolio =
    analysis.linkedPortfolioSlug ??
    getPortfolioProjectByAnalysisId(analysisId)?.slug;
  const navSections = buildProjectDetailNavSections(analyzerData, "repository");
  const showNav = navSections.length > 1;
  const reviewBadge = reviewStatusToReviewMeta(analysis.reviewStatus);
  const { backToAnalyzer, analysisLabel, analysisUnavailable } =
    siteContent.analyzerDetail;

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
            href="/analyzer"
            className="enter-indicator text-muted transition-colors hover:text-accent"
          >
            ← {backToAnalyzer}
          </Link>
        </div>
        <ArchivePath
          segments={[
            { label: "Archive", href: "/" },
            { label: "Analyzer", href: "/analyzer" },
            { label: analysis.title },
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
              <SectionLabel withAccent>{analysisLabel}</SectionLabel>
              <span className="font-mono text-meta text-muted">
                {analysis.analysisId}
              </span>
            </div>

            <h1 className="mt-4 font-[family-name:var(--font-body-sc)] text-h1 font-black tracking-tight md:text-[3rem]">
              {analysis.title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <ReviewBadge review={reviewBadge} />
              {linkedPortfolio ? (
                <LinkedToPortfolioBadge portfolioSlug={linkedPortfolio} />
              ) : null}
            </div>

            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 font-mono text-meta text-muted">
              <span>
                ANALYZED{" "}
                <span className="font-semibold text-accent">
                  {analysis.analyzedAt}
                </span>
              </span>
              <span>
                REPO{" "}
                <a
                  href={analysis.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent underline-offset-4 hover:underline"
                >
                  {analysis.repoOwner}/{analysis.repoName}
                </a>
              </span>
              {analysis.templateId ? (
                <span className="uppercase">{analysis.templateId}</span>
              ) : null}
            </div>

            <Divider accent className="my-5" />

            <p className="max-w-3xl font-[family-name:var(--font-body-sc)] text-body leading-relaxed text-muted md:text-lg">
              {analysis.summary}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {analysis.stack.map((tech, i) => (
                <Tag key={tech} variant={i === 0 ? "accent" : "default"}>
                  {tech}
                </Tag>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1">
              {analysis.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-meta uppercase tracking-wider text-muted"
                >
                  [{tag}]
                </span>
              ))}
            </div>
          </header>

          <div className="mt-10 md:mt-12">
            {analyzerData ? (
              <>
                <ProjectAnalyzer data={analyzerData} mode="repository" />
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
                  {analysisUnavailable}
                </p>
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
