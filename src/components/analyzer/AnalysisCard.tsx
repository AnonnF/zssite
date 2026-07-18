import Link from "next/link";
import type { RepositoryAnalysis } from "@/content/repositoryAnalyses";
import { reviewStatusToReviewMeta } from "@/content/repositoryAnalyses";
import { hasRepositoryAnalyzer } from "@/data/projects/analyzerAvailability";
import { ReviewBadge } from "@/components/ProjectAnalyzer/ReviewBadge";
import { LinkedToPortfolioBadge } from "@/components/analyzer/LinkedToPortfolioBadge";
import { Tag } from "@/components/ui/Tag";
import { Divider } from "@/components/ui/Divider";
import { ModuleTechnicalVisual } from "@/components/ui/ModuleTechnicalVisual";

interface AnalysisCardProps {
  analysis: RepositoryAnalysis;
  index: number;
  viewDetail: string;
  unavailable: string;
}

export function AnalysisCard({
  analysis,
  index,
  viewDetail,
  unavailable,
}: AnalysisCardProps) {
  const displayNumber = String(index + 1).padStart(2, "0");
  const hasDetail = hasRepositoryAnalyzer(analysis.analysisId);
  const footerLabel = hasDetail ? viewDetail : unavailable;
  const reviewBadge = reviewStatusToReviewMeta(analysis.reviewStatus);

  return (
    <article className="panel-card panel-card-interactive group relative overflow-hidden archive-frame">
      {hasDetail ? (
        <Link
          href={`/analyzer/${analysis.analysisId}`}
          className="absolute inset-0 z-0"
          aria-label={`查看 ${analysis.title} 分析`}
        />
      ) : null}

      <span className="accent-mark-corner opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="pointer-events-none relative z-[1] flex flex-col xl:flex-row">
        <div className="panel-rail flex items-center justify-between gap-4 px-4 py-4 font-mono text-meta xl:w-48 xl:shrink-0 xl:flex-col xl:items-stretch xl:gap-3 xl:px-5 xl:py-6">
          <span className="text-3xl font-bold leading-none tracking-normal text-accent">
            {displayNumber}
          </span>
          <span className="break-words font-semibold tracking-[0.04em] text-accent">
            {analysis.analyzedAt}
          </span>
          <span className="break-all uppercase tracking-[0.04em] text-muted">
            {analysis.repoOwner}
          </span>
          <span className="status-chip w-fit group-hover:border-accent/40 group-hover:text-text">
            <span className="status-chip__dot opacity-50 group-hover:bg-accent group-hover:opacity-100" />
            {analysis.reviewStatus}
          </span>
        </div>

        <div className="flex min-w-0 flex-1 flex-col lg:flex-row">
          <div className="flex-1 p-5 md:p-6 lg:p-7">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="font-display text-h3 font-bold uppercase tracking-tight text-text md:text-h2">
                  {analysis.title}
                </h2>
                <ReviewBadge review={reviewBadge} />
                {analysis.linkedPortfolioSlug ? (
                  <LinkedToPortfolioBadge
                    portfolioSlug={analysis.linkedPortfolioSlug}
                    className="pointer-events-auto relative z-10"
                  />
                ) : null}
              </div>
              <span className="font-mono text-meta text-muted">
                {analysis.analysisId}
              </span>
            </div>

            <p className="mt-2 font-mono text-meta text-muted">
              {analysis.repoUrl}
            </p>

            <Divider accent className="my-4" />

            <p className="font-[family-name:var(--font-body-sc)] text-body leading-relaxed text-muted">
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
          </div>

          <div className="border-t border-border-soft p-4 lg:w-56 lg:border-l lg:border-t-0 lg:p-5">
            <ModuleTechnicalVisual
              moduleId="repository-analyzer"
              className="h-[7rem] lg:h-[9rem]"
            />
          </div>
        </div>
      </div>

      <div className="panel-meta-strip pointer-events-none relative z-[1] flex items-center justify-between px-5 py-3.5 md:px-6">
        <span className="enter-indicator">{footerLabel}</span>
        <span
          className="font-mono text-lg text-accent transition-transform group-hover:translate-x-1"
          aria-hidden="true"
        >
          →
        </span>
      </div>
    </article>
  );
}
