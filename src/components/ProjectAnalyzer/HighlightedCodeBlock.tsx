"use client";

import { useEffect, useMemo, useState } from "react";
import { highlightCode } from "./shikiHighlighter";

interface HighlightedCodeBlockProps {
  code: string;
  language: string;
  startLine?: number;
  className?: string;
}

export function HighlightedCodeBlock({
  code,
  language,
  startLine = 1,
  className = "",
}: HighlightedCodeBlockProps) {
  const trimmedCode = code.trim();
  const lines = useMemo(
    () => (trimmedCode ? trimmedCode.split("\n") : []),
    [trimmedCode]
  );

  const [highlightedHtml, setHighlightedHtml] = useState<string | null>(null);

  useEffect(() => {
    if (!trimmedCode) {
      setHighlightedHtml(null);
      return;
    }

    let cancelled = false;
    setHighlightedHtml(null);

    highlightCode(trimmedCode, language)
      .then((html) => {
        if (!cancelled) setHighlightedHtml(html);
      })
      .catch(() => {
        if (!cancelled) setHighlightedHtml(null);
      });

    return () => {
      cancelled = true;
    };
  }, [trimmedCode, language]);

  if (!trimmedCode) return null;

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
            // Safe: only renders static project analysis mock data from the repo.
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
