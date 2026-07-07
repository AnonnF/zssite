import { siteContent } from "@/content/site";
import { repositoryAnalyses } from "@/content/repositoryAnalyses";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { GitHubAnalyzerBar } from "@/components/analyzer/GitHubAnalyzerBar";
import { AnalysisCard } from "@/components/analyzer/AnalysisCard";
import { BackToHomeLink } from "@/components/layout/BackToHomeLink";

export default function AnalyzerPage() {
  const { title, label, description, libraryLabel, libraryDescription, viewDetail, unavailable } =
    siteContent.analyzerPage;

  return (
    <div className="mx-auto max-w-content px-6 py-section md:px-12 lg:px-16">
      <BackToHomeLink className="mb-6" />

      <header className="border-b border-border-soft pb-8 md:pb-10">
        <SectionLabel withAccent>{label}</SectionLabel>
        <h1 className="mt-4 font-[family-name:var(--font-body-sc)] text-h1 font-black tracking-tight md:text-[3rem]">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl font-[family-name:var(--font-body-sc)] text-body leading-relaxed text-muted md:text-lg">
          {description}
        </p>
        <p className="mt-5 font-mono text-meta text-muted">
          LIBRARY:{" "}
          <span className="font-semibold text-accent">
            {String(repositoryAnalyses.length).padStart(2, "0")}
          </span>{" "}
          RECORDS
        </p>
      </header>

      <div className="mt-8 md:mt-10">
        <GitHubAnalyzerBar />
      </div>

      <section className="mt-12 md:mt-14">
        <SectionLabel>{libraryLabel}</SectionLabel>
        <p className="mt-3 max-w-2xl font-[family-name:var(--font-body-sc)] text-body text-muted">
          {libraryDescription}
        </p>
        <div className="mt-6 flex flex-col gap-5 md:gap-6">
          {repositoryAnalyses.map((analysis, index) => (
            <AnalysisCard
              key={analysis.analysisId}
              analysis={analysis}
              index={index}
              viewDetail={viewDetail}
              unavailable={unavailable}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
