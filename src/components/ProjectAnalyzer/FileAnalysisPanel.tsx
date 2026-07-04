import type { ReactNode } from "react";
import type { ProjectAnalysisEntry } from "@/data/projects/types";
import { hasStructuredAnalysis } from "@/data/projects";
import { ReviewBadge } from "./ReviewBadge";

interface FileAnalysisPanelProps {
  entry: ProjectAnalysisEntry;
  onPathSelect?: (path: string) => void;
}

function AnalysisSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-border-soft pt-4 first:border-t-0 first:pt-0">
      <h4 className="font-mono text-meta uppercase tracking-wider text-muted">
        {title}
      </h4>
      <div className="mt-2">{children}</div>
    </section>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5">
      {items.map((item) => (
        <li
          key={item}
          className="flex gap-2 font-[family-name:var(--font-body-sc)] text-body leading-relaxed text-muted"
        >
          <span className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-accent" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function TagRow({
  items,
  onItemClick,
}: {
  items: string[];
  onItemClick?: (item: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) =>
        onItemClick ? (
          <button
            key={item}
            type="button"
            className="folder-overview-tag"
            onClick={() => onItemClick(item)}
          >
            {item}
          </button>
        ) : (
          <span key={item} className="folder-overview-tag folder-overview-tag--static">
            {item}
          </span>
        )
      )}
    </div>
  );
}

function InputOutputRow({ input, output }: { input?: string; output?: string }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {input && (
        <div className="border border-border-soft bg-bg/40 px-3 py-2.5">
          <p className="font-mono text-meta uppercase tracking-wider text-muted">
            Input
          </p>
          <p className="mt-1.5 font-[family-name:var(--font-body-sc)] text-body leading-relaxed text-text">
            {input}
          </p>
        </div>
      )}
      {output && (
        <div className="border border-border-soft bg-bg/40 px-3 py-2.5">
          <p className="font-mono text-meta uppercase tracking-wider text-muted">
            Output
          </p>
          <p className="mt-1.5 font-[family-name:var(--font-body-sc)] text-body leading-relaxed text-text">
            {output}
          </p>
        </div>
      )}
    </div>
  );
}

function FolderStructuredAnalysis({
  entry,
  onPathSelect,
}: {
  entry: ProjectAnalysisEntry;
  onPathSelect?: (path: string) => void;
}) {
  const analysis = entry.analysis!;

  return (
    <div className="space-y-4">
      {analysis.purpose && (
        <AnalysisSection title="Purpose">
          <p className="font-[family-name:var(--font-body-sc)] text-body leading-relaxed text-muted">
            {analysis.purpose}
          </p>
        </AnalysisSection>
      )}
      {analysis.responsibilities && analysis.responsibilities.length > 0 && (
        <AnalysisSection title="Responsibilities">
          <BulletList items={analysis.responsibilities} />
        </AnalysisSection>
      )}
      {(analysis.input || analysis.output) && (
        <AnalysisSection title="Input / Output">
          <InputOutputRow input={analysis.input} output={analysis.output} />
        </AnalysisSection>
      )}
      {analysis.relatedModules && analysis.relatedModules.length > 0 && (
        <AnalysisSection title="Related Modules">
          <TagRow items={analysis.relatedModules} />
        </AnalysisSection>
      )}
      {analysis.relatedPaths && analysis.relatedPaths.length > 0 && (
        <AnalysisSection title="Related Paths">
          <TagRow items={analysis.relatedPaths} onItemClick={onPathSelect} />
        </AnalysisSection>
      )}
      {analysis.notes && analysis.notes.length > 0 && (
        <AnalysisSection title="Notes">
          <BulletList items={analysis.notes} />
        </AnalysisSection>
      )}
    </div>
  );
}

function FileStructuredAnalysis({
  entry,
  onPathSelect,
}: {
  entry: ProjectAnalysisEntry;
  onPathSelect?: (path: string) => void;
}) {
  const analysis = entry.analysis!;
  const relatedItems = [
    ...(analysis.usedBy ?? []),
    ...(analysis.relatedModules ?? []),
  ];

  return (
    <div className="space-y-4">
      {analysis.role && (
        <AnalysisSection title="Role">
          <p className="font-[family-name:var(--font-body-sc)] text-body leading-relaxed text-muted">
            {analysis.role}
          </p>
        </AnalysisSection>
      )}
      {analysis.keyLogic && analysis.keyLogic.length > 0 && (
        <AnalysisSection title="Key Logic">
          <BulletList items={analysis.keyLogic} />
        </AnalysisSection>
      )}
      {relatedItems.length > 0 && (
        <AnalysisSection title="Used By / Related To">
          <TagRow items={relatedItems} />
        </AnalysisSection>
      )}
      {analysis.relatedPaths && analysis.relatedPaths.length > 0 && (
        <AnalysisSection title="Related Paths">
          <TagRow items={analysis.relatedPaths} onItemClick={onPathSelect} />
        </AnalysisSection>
      )}
      {analysis.notes && analysis.notes.length > 0 && (
        <AnalysisSection title="Notes">
          <BulletList items={analysis.notes} />
        </AnalysisSection>
      )}
    </div>
  );
}

export function FileAnalysisPanel({ entry, onPathSelect }: FileAnalysisPanelProps) {
  const structured = hasStructuredAnalysis(entry);

  return (
    <section className="file-analysis-panel flex min-h-0 flex-col">
      <div className="analyzer-pane-header">
        <div className="analyzer-pane-header__lead">
          <span className="accent-bar mt-0.5" aria-hidden="true" />
          <div className="min-w-0">
            <span className="analyzer-pane-header__label">Analysis</span>
            <h3 className="analyzer-pane-header__title">{entry.title}</h3>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {entry.language && (
            <span className="border border-border-soft px-2 py-0.5 font-mono text-meta uppercase tracking-wider text-muted">
              {entry.language}
            </span>
          )}
          <span className="border border-border-soft px-2 py-0.5 font-mono text-meta uppercase tracking-wider text-muted">
            {entry.type}
          </span>
          {entry.fixed && (
            <span className="border border-accent/40 bg-accent-muted px-2 py-0.5 font-mono text-meta uppercase tracking-wider text-text">
              Fixed architecture note
            </span>
          )}
          <ReviewBadge review={entry.review} />
        </div>
      </div>

      <div className="file-analysis-panel__body min-h-0 overflow-y-auto px-4 py-4 md:px-5 md:py-5">
        <p className="mb-4 font-mono text-meta text-muted">
          <span className="uppercase tracking-wider">Path</span>
          <span className="mx-2 text-border">/</span>
          <span className="text-text">{entry.path || "/"}</span>
        </p>

        {structured ? (
          entry.type === "folder" ? (
            <FolderStructuredAnalysis entry={entry} onPathSelect={onPathSelect} />
          ) : (
            <FileStructuredAnalysis entry={entry} onPathSelect={onPathSelect} />
          )
        ) : (
          <p className="font-[family-name:var(--font-body-sc)] text-body leading-relaxed text-muted">
            {entry.summary}
          </p>
        )}
      </div>
    </section>
  );
}
