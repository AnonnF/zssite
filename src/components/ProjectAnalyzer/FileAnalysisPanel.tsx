import type { ProjectAnalysisEntry } from "@/data/projects/types";
import { SectionLabel } from "@/components/ui/SectionLabel";

interface FileAnalysisPanelProps {
  entry: ProjectAnalysisEntry;
}

export function FileAnalysisPanel({ entry }: FileAnalysisPanelProps) {
  return (
    <section className="flex h-full min-h-0 flex-col">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border-soft px-4 py-3 md:px-5 md:py-4">
        <div className="min-w-0 flex-1">
          <SectionLabel>ANALYSIS</SectionLabel>
          <h3 className="mt-2 font-display text-h3 font-bold tracking-tight text-text">
            {entry.title}
          </h3>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="border border-border-soft px-2 py-0.5 font-mono text-meta uppercase tracking-wider text-muted">
            {entry.type}
          </span>
          {entry.fixed && (
            <span className="border border-accent/40 bg-accent-muted px-2 py-0.5 font-mono text-meta uppercase tracking-wider text-text">
              Fixed architecture note
            </span>
          )}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 md:px-5 md:py-5">
        <p className="mb-4 font-mono text-meta text-muted">
          <span className="uppercase tracking-wider">Path</span>
          <span className="mx-2 text-border">/</span>
          <span className="text-text">{entry.path || "/"}</span>
        </p>
        <p className="font-[family-name:var(--font-body-sc)] text-body leading-relaxed text-muted">
          {entry.summary}
        </p>
      </div>
    </section>
  );
}
