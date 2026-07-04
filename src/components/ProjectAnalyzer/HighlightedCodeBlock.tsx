"use client";

import { useEffect, useMemo, useState } from "react";
import { highlightCode } from "./shikiHighlighter";

interface HighlightedCodeBlockProps {
  code: string;
  language: string;
  startLine?: number;
  className?: string;
  /** Pre-rendered HTML from build-time Shiki (trusted local project data). */
  prebuiltHighlightedHtml?: string;
}

export function HighlightedCodeBlock({
  code,
  language,
  startLine = 1,
  className = "",
  prebuiltHighlightedHtml,
}: HighlightedCodeBlockProps) {
  const trimmedCode = code.trim();
  const lines = useMemo(
    () => (trimmedCode ? trimmedCode.split("\n") : []),
    [trimmedCode]
  );

  const [runtimeHighlightedHtml, setRuntimeHighlightedHtml] = useState<
    string | null
  >(null);

  const usePrebuilt = Boolean(prebuiltHighlightedHtml?.trim());

  useEffect(() => {
    if (usePrebuilt) return;

    if (!trimmedCode) {
      setRuntimeHighlightedHtml(null);
      return;
    }

    let cancelled = false;
    setRuntimeHighlightedHtml(null);

    highlightCode(trimmedCode, language)
      .then((html) => {
        if (!cancelled) setRuntimeHighlightedHtml(html);
      })
      .catch(() => {
        if (!cancelled) setRuntimeHighlightedHtml(null);
      });

    return () => {
      cancelled = true;
    };
  }, [trimmedCode, language, usePrebuilt]);

  if (!trimmedCode) return null;

  const highlightedHtml = usePrebuilt
    ? prebuiltHighlightedHtml!
    : runtimeHighlightedHtml;

  return (
    <div className={`code-preview-body inline-flex min-w-full ${className}`}>
      <div
        className="code-preview-gutter shrink-0 select-none border-r border-white/10 pr-4 text-right"
        aria-hidden
      >
        {lines.map((_, index) => (
          <div key={index} className="code-preview-line-number">
            {startLine + index}
          </div>
        ))}
      </div>

      <div className="min-w-0 flex-1 pl-4">
        {highlightedHtml ? (
          <div
            className="code-preview-shiki"
            // Safe: only renders build-time Shiki output from local project data.
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />
        ) : (
          <pre className="code-preview-plain">
            <code>{trimmedCode}</code>
          </pre>
        )}
      </div>
    </div>
  );
}
