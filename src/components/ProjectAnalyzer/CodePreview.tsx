"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  ProjectAnalysisEntry,
  ProjectCodeSnippet,
} from "@/data/projects/types";
import { HighlightedCodeBlock } from "./HighlightedCodeBlock";
import { resolveHighlightLanguage } from "./resolveHighlightLanguage";
import { ReviewBadge } from "./ReviewBadge";

interface CodePreviewProps {
  entry: ProjectAnalysisEntry;
}

type PreviewMode = "snippets" | "full";

function formatLineRange(
  snippet: ProjectCodeSnippet,
  lineCount: number
): string | null {
  if (snippet.startLine == null) return null;
  const end = snippet.endLine ?? snippet.startLine + Math.max(lineCount - 1, 0);
  return `Lines ${snippet.startLine}–${end}`;
}

function SnippetCard({
  snippet,
  language,
}: {
  snippet: ProjectCodeSnippet;
  language: string;
}) {
  const code = snippet.code.trim();
  const lineCount = code ? code.split("\n").length : 0;
  const lineRange = formatLineRange(snippet, lineCount);

  const annotations = useMemo(
    () =>
      (snippet.annotations ?? [])
        .filter((item) => item.line != null && item.note?.trim())
        .sort((a, b) => a.line - b.line),
    [snippet.annotations]
  );

  return (
    <article className="snippet-card">
      <div className="snippet-card__header">
        <div className="snippet-card__header-main">
          <h4 className="snippet-card__title">{snippet.title}</h4>
          <ReviewBadge review={snippet.review} className="snippet-card__review" />
        </div>
        {lineRange && (
          <span className="snippet-card__lines font-mono text-meta uppercase tracking-wider">
            {lineRange}
          </span>
        )}
      </div>

      {snippet.reason?.trim() && (
        <p className="snippet-card__reason">{snippet.reason}</p>
      )}

      <div className="snippet-card__code bg-[#1c1b19] p-3 md:p-4">
        <HighlightedCodeBlock
          code={code}
          language={language}
          startLine={snippet.startLine ?? 1}
          prebuiltHighlightedHtml={snippet.highlightedHtml}
        />
      </div>

      {annotations.length > 0 && (
        <div className="snippet-card__annotations">
          <p className="snippet-card__annotations-label font-mono text-meta uppercase tracking-wider">
            Annotations
          </p>
          <ul className="snippet-card__annotations-list">
            {annotations.map((item) => (
              <li key={`${snippet.id}-${item.line}`}>
                <span className="snippet-card__annotation-line">Line {item.line}</span>
                <span className="snippet-card__annotation-sep" aria-hidden="true">
                  —
                </span>
                <span className="snippet-card__annotation-note">{item.note}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}

export function CodePreview({ entry }: CodePreviewProps) {
  const code = entry.code?.trim() ?? "";
  const snippets = useMemo(
    () => entry.snippets?.filter((snippet) => snippet.code?.trim()) ?? [],
    [entry.snippets]
  );
  const hasSnippets = snippets.length > 0;
  const hasFullCode = Boolean(code);

  const language = useMemo(
    () => resolveHighlightLanguage(entry.language, entry.path),
    [entry.language, entry.path]
  );

  const [mode, setMode] = useState<PreviewMode>("full");

  useEffect(() => {
    if (hasSnippets) {
      setMode("snippets");
    } else if (hasFullCode) {
      setMode("full");
    } else {
      setMode("snippets");
    }
  }, [entry.path, hasSnippets, hasFullCode]);

  const displayLanguage = entry.language ?? language;
  const showModeTabs = hasSnippets && hasFullCode;
  const showSnippets = hasSnippets && mode === "snippets";
  const showFull = mode === "full" && hasFullCode;
  const showEmpty = !showSnippets && !showFull;

  return (
    <section className="flex h-full min-h-0 flex-col">
      <div className="analyzer-pane-header">
        <div className="analyzer-pane-header__lead">
          <span className="accent-bar mt-0.5" aria-hidden="true" />
          <span className="analyzer-pane-header__label">Code Preview</span>
        </div>
        <div className="analyzer-pane-header__meta">
          {showModeTabs && (
            <div className="tree-header-actions" role="tablist" aria-label="Code preview mode">
              <button
                type="button"
                role="tab"
                aria-selected={mode === "snippets"}
                className={`code-preview-mode-tab tree-header-action ${
                  mode === "snippets" ? "code-preview-mode-tab--active" : ""
                }`}
                onClick={() => setMode("snippets")}
              >
                Key Snippets
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === "full"}
                className={`code-preview-mode-tab tree-header-action ${
                  mode === "full" ? "code-preview-mode-tab--active" : ""
                }`}
                onClick={() => setMode("full")}
              >
                Full File
              </button>
            </div>
          )}
          {displayLanguage && (
            <span className="border border-border-soft px-1.5 py-0.5 uppercase tracking-wider">
              {displayLanguage}
            </span>
          )}
          <span className="max-w-[12rem] truncate md:max-w-xs">{entry.path}</span>
        </div>
      </div>

      <div className="code-preview-scroll min-h-0 flex-1 overflow-auto">
        {showSnippets && (
          <div className="snippet-list flex flex-col gap-3 p-3 md:p-4">
            {snippets.map((snippet) => (
              <SnippetCard key={snippet.id} snippet={snippet} language={language} />
            ))}
          </div>
        )}

        {showFull && (
          <div className="bg-[#1c1b19] p-4 md:p-5">
            <HighlightedCodeBlock
              code={code}
              language={language}
              startLine={1}
              prebuiltHighlightedHtml={entry.highlightedHtml}
            />
          </div>
        )}

        {showEmpty && (
          <p className="p-4 font-mono text-meta uppercase tracking-wider text-muted md:p-5">
            暂无代码预览
          </p>
        )}
      </div>
    </section>
  );
}
