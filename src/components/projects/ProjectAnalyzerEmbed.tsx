import Link from "next/link";
import { getRepositoryAnalysisById } from "@/content/repositoryAnalyses";
import {
  buildProjectDetailNavSections,
  getPortfolioWalkthroughData,
  hasNarrativeContent,
  hasPortfolioWalkthrough,
} from "@/data/projects";
import { siteContent } from "@/content/site";
import { ProjectAnalyzer } from "@/components/ProjectAnalyzer/ProjectAnalyzer";
import { ProjectNarrative } from "@/components/ProjectAnalyzer/ProjectNarrative";
import { ReviewBadge } from "@/components/ProjectAnalyzer/ReviewBadge";
import { ProjectDetailNav } from "@/components/projects/ProjectDetailNav";

interface ProjectAnalyzerEmbedProps {
  slug: string;
  analysisId?: string;
  sourceSnapshot?: string;
}

export async function loadProjectAnalyzerEmbed({
  slug,
  analysisId,
  sourceSnapshot,
}: ProjectAnalyzerEmbedProps) {
  const walkthroughData = getPortfolioWalkthroughData(slug);
  const linkedAnalysis = analysisId
    ? getRepositoryAnalysisById(analysisId)
    : undefined;
  const navSections = buildProjectDetailNavSections(walkthroughData, "portfolio");
  const showNav = navSections.length > 1;
  const { walkthroughUnavailable } = siteContent.projectDetail;

  const beforeSummary =
    walkthroughData?.review?.status === "ai-draft" ? (
      <div className="mb-5 flex flex-wrap items-center gap-3 rounded-sm border border-border-soft bg-surface/40 px-4 py-3">
        <ReviewBadge review={walkthroughData.review} />
        <p className="font-[family-name:var(--font-body-sc)] text-sm text-muted">
          {walkthroughData.review.note ??
            "关联的代码导读包含 AI 生成内容，尚未人工审核。"}
        </p>
      </div>
    ) : null;

  const afterFigure = (
    <>
      {sourceSnapshot ? (
        <p className="mt-4 font-mono text-meta text-muted">
          SOURCE: project-snapshots/{sourceSnapshot}
        </p>
      ) : null}

      {linkedAnalysis ? (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className="font-mono text-meta text-muted">Linked analysis:</span>
          <Link
            href={`/analyzer/${linkedAnalysis.analysisId}`}
            className="enter-indicator"
          >
            {linkedAnalysis.analysisId} →
          </Link>
        </div>
      ) : null}
    </>
  );

  const body = (
    <div className="mt-10 md:mt-12">
      {walkthroughData ? (
        <>
          <ProjectAnalyzer data={walkthroughData} mode="walkthrough" />
          {walkthroughData.narrative &&
          hasNarrativeContent(walkthroughData.narrative) ? (
            <ProjectNarrative
              narrative={walkthroughData.narrative}
              className="mt-8 md:mt-10"
            />
          ) : null}
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
  );

  return {
    showNav,
    sectionLabel: siteContent.projectDetail.walkthroughLabel,
    mobileNav: showNav ? (
      <ProjectDetailNav sections={navSections} variant="mobile" className="mt-6" />
    ) : null,
    desktopNav: showNav ? (
      <ProjectDetailNav sections={navSections} variant="desktop" />
    ) : null,
    beforeSummary,
    afterFigure,
    body,
  };
}
