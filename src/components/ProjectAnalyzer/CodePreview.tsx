"use client";

import { useEffect, useMemo, useState } from "react";
import type { ProjectAnalysisEntry } from "@/data/projects/types";
import { resolveHighlightLanguage } from "./resolveHighlightLanguage";
import { highlightCode } from "./shikiHighlighter";

interface CodePreviewProps {
  entry: ProjectAnalysisEntry;
}

export function CodePreview({ entry }: CodePreviewProps) {
  const code = entry.code?.trim() ?? "";
  const hasCode = Boolean(code);

  const language = useMemo(
    () => resolveHighlightLanguage(entry.language, entry.path),
    [entry.language, entry.path]
  );

  const lines = useMemo(() => (hasCode ? code.split("\n") : []), [code, hasCode]);

  const [highlightedHtml, setHighlightedHtml] = useState<string | null>(null);

  useEffect(() => {
    if (!hasCode) {
      setHighlightedHtml(null);
      return;
    }

    let cancelled = false;
    setHighlightedHtml(null);

    highlightCode(code, language)
      .then((html) => {
        if (!cancelled) setHighlightedHtml(html);
      })
      .catch(() => {
        if (!cancelled) setHighlightedHtml(null);
      });

    return () => {
      cancelled = true;
    };
  }, [code, hasCode, language]);

  const displayLanguage = entry.language ?? language;

  return (
    <section className="flex h-full min-h-0 flex-col">
      <div className="analyzer-pane-header">
        <div className="analyzer-pane-header__lead">
          <span className="accent-bar mt-0.5" aria-hidden="true" />
          <span className="analyzer-pane-header__label">Code Preview</span>
        </div>
        <div className="analyzer-pane-header__meta">
          {displayLanguage && (
            <span className="border border-border-soft px-1.5 py-0.5 uppercase tracking-wider">
              {displayLanguage}
            </span>
          )}
          <span className="max-w-[12rem] truncate md:max-w-xs">{entry.path}</span>
        </div>
      </div>

      <div className="code-preview-scroll min-h-0 flex-1 overflow-auto bg-[#1c1b19]">
        {hasCode ? (
          <div className="code-preview-body inline-flex min-w-full p-4 md:p-5">
            <div
              className="code-preview-gutter shrink-0 select-none border-r border-white/10 pr-4 text-right"
              aria-hidden
            >
              {lines.map((_, index) => (
                <div key={index} className="code-preview-line-number">
                  {index + 1}
                </div>
              ))}
            </div>

            <div className="min-w-0 flex-1 pl-4">
              {highlightedHtml ? (
                <div
                  className="code-preview-shiki"
                  // Safe: only renders static project analysis mock data from the repo.
                  dangerouslySetInnerHTML={{ __html: highlightedHtml }}
                />
              ) : (
                <pre className="code-preview-plain">
                  <code>{code}</code>
                </pre>
              )}
            </div>
          </div>
        ) : (
          <p className="p-4 font-mono text-meta uppercase tracking-wider text-[#8a857c] md:p-5">
            No code preview available for this file.
          </p>
        )}
      </div>
    </section>
  );
}
