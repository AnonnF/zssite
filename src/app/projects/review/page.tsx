import Link from "next/link";
import {
  getProjectPublicationFlags,
  hasRepositoryAnalyzer,
  inferAnalyzerSource,
  listEnabledAnalyzerProjectIds,
  projectPublicationFlags,
} from "@/data/projects";
import { getPortfolioProjectBySlug } from "@/content/projects";
import { getRepositoryAnalysisByAnalyzerProjectId } from "@/content/repositoryAnalyses";
import { SectionLabel } from "@/components/ui/SectionLabel";

export default function ProjectReviewHelperPage() {
  const projectIds = listEnabledAnalyzerProjectIds();

  return (
    <div className="mx-auto max-w-content px-6 py-section md:px-12 lg:px-16">
      <header className="border-b border-border-soft pb-8 md:pb-10">
        <SectionLabel withAccent>Review Helper</SectionLabel>
        <h1 className="mt-4 font-[family-name:var(--font-body-sc)] text-h1 font-black tracking-tight md:text-[2.5rem]">
          Project Review Helper
        </h1>
        <p className="mt-4 max-w-3xl font-[family-name:var(--font-body-sc)] text-body leading-relaxed text-muted">
          本地开发参考页，用于查看 publication flags 与推荐 CLI 命令。此页面只读，不会在浏览器中修改文件或访问
          Supabase。
        </p>
        <p className="mt-3 font-mono text-meta text-muted">
          <Link href="/analyzer" className="enter-indicator">
            ← Back to Analyzer
          </Link>
        </p>
      </header>

      <div className="mt-8 overflow-x-auto border border-border-soft">
        <table className="min-w-full border-collapse font-mono text-sm">
          <thead className="border-b border-border-soft bg-surface/40 text-left text-meta uppercase tracking-wider text-muted">
            <tr>
              <th className="px-4 py-3">Project</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Enabled</th>
              <th className="px-4 py-3">Human Reviewed</th>
              <th className="px-4 py-3">Featured</th>
              <th className="px-4 py-3">Analyzer</th>
              <th className="px-4 py-3">Suggested Command</th>
            </tr>
          </thead>
          <tbody>
            {projectIds.map((projectId) => {
              const flags = getProjectPublicationFlags(projectId);
              const portfolio = getPortfolioProjectBySlug(projectId);
              const analysis = getRepositoryAnalysisByAnalyzerProjectId(projectId);
              const source = inferAnalyzerSource(projectId);
              const analyzerReady = hasRepositoryAnalyzer(
                analysis?.analysisId ?? projectId
              );

              if (!flags) {
                return null;
              }

              return (
                <tr key={projectId} className="border-b border-border-soft align-top">
                  <td className="px-4 py-4">
                    <div className="font-semibold text-text">{projectId}</div>
                    {portfolio ? (
                      <div className="mt-1 text-meta text-muted">{portfolio.title}</div>
                    ) : analysis ? (
                      <div className="mt-1 text-meta text-muted">{analysis.title}</div>
                    ) : null}
                  </td>
                  <td className="px-4 py-4 text-muted">{source}</td>
                  <td className="px-4 py-4">{String(flags.enabled)}</td>
                  <td className="px-4 py-4">{String(flags.humanReviewed)}</td>
                  <td className="px-4 py-4">{String(flags.featured)}</td>
                  <td className="px-4 py-4">{analyzerReady ? "ready" : "missing"}</td>
                  <td className="px-4 py-4 text-muted">
                    npm run review:project -- {projectId} --humanReviewed true
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-6 font-mono text-meta text-muted">
        Flags file: src/data/projects/projectPublicationFlags.ts
      </p>
      <p className="mt-2 font-mono text-meta text-muted">
        Registered projects: {Object.keys(projectPublicationFlags).length}
      </p>
    </div>
  );
}
