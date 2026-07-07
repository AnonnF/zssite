import Link from "next/link";
import type { RepositoryAnalysis } from "@/content/repositoryAnalyses";
import { reviewStatusToReviewMeta } from "@/content/repositoryAnalyses";
import { hasRepositoryAnalyzer } from "@/data/projects";
import { ReviewBadge } from "@/components/ProjectAnalyzer/ReviewBadge";
import { LinkedToPortfolioBadge } from "@/components/analyzer/LinkedToPortfolioBadge";
import { Tag } from "@/components/ui/Tag";
import { Divider } from "@/components/ui/Divider";

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
    <article className="panel-card panel-card-interactive group relative overflow-hidden">
      {hasDetail ? (
        <Link
          href={`/analyzer/${analysis.analysisId}`}
          className="absolute inset-0 z-0"
          aria-label={`查看 ${analysis.title} 分析`}
        />
      ) : null}

      <span className="accent-mark-corner opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="pointer-events-none relative z-[1] flex flex-col lg:flex-row">
        <div className="flex items-center justify-between gap-4 border-b border-border-soft px-5 py-4 font-mono text-meta lg:w-44 lg:flex-col lg:items-start lg:border-b-0 lg:border-r lg:py-6">
          <span className="text-3xl font-bold leading-none text-accent">
            {displayNumber}
          </span>
          <span className="font-semibold text-accent">{analysis.analyzedAt}</span>
          <span className="uppercase text-muted">{analysis.repoOwner}</span>
          <span className="rounded-sm border border-border-soft px-1.5 py-0.5 uppercase text-muted transition-colors group-hover:border-accent/40 group-hover:text-text">
            {analysis.reviewStatus}
          </span>
        </div>

        <div className="flex-1 p-5 md:p-6 lg:p-7">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-display text-h3 font-bold uppercase tracking-tight text-text transition-colors group-hover:text-text md:text-h2">
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

          <div className="mt-6 flex items-center justify-between border-t border-border-soft pt-4">
            <span className="enter-indicator">{footerLabel}</span>
            <span className="font-mono text-lg text-accent opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1">
              →
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
