import type { ProjectAnalysisEntry } from "@/data/projects/types";

interface CodePreviewProps {
  entry: ProjectAnalysisEntry;
}

export function CodePreview({ entry }: CodePreviewProps) {
  const hasCode = Boolean(entry.code?.trim());

  return (
    <section className="flex h-full min-h-0 flex-col">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-soft bg-surface/40 px-4 py-2.5 md:px-5">
        <span className="font-mono text-meta uppercase tracking-wider text-muted">
          Code Preview
        </span>
        <div className="flex flex-wrap items-center gap-2 font-mono text-meta text-muted">
          {entry.language && (
            <span className="border border-border-soft px-1.5 py-0.5 uppercase tracking-wider">
              {entry.language}
            </span>
          )}
          <span className="truncate max-w-[12rem] md:max-w-xs">{entry.path}</span>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto bg-[#1c1b19] p-4 md:p-5">
        {hasCode ? (
          <pre className="font-mono text-[0.8125rem] leading-relaxed text-[#e8e4dc]">
            <code>{entry.code}</code>
          </pre>
        ) : (
          <p className="font-mono text-meta uppercase tracking-wider text-[#8a857c]">
            No code preview available for this file.
          </p>
        )}
      </div>
    </section>
  );
}
