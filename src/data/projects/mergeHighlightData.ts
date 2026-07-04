import type { ProjectAnalyzerData } from "./types";
import type { ProjectHighlightData } from "./highlight-types";

export function mergeHighlightData(
  data: ProjectAnalyzerData,
  highlights?: ProjectHighlightData
): ProjectAnalyzerData {
  if (!highlights?.entries) return data;

  const entries = { ...data.entries };

  for (const [path, highlightEntry] of Object.entries(highlights.entries)) {
    const entry = entries[path];
    if (!entry) continue;

    const mergedEntry = { ...entry };

    if (highlightEntry.highlightedHtml) {
      mergedEntry.highlightedHtml = highlightEntry.highlightedHtml;
    }

    if (highlightEntry.snippets && mergedEntry.snippets?.length) {
      mergedEntry.snippets = mergedEntry.snippets.map((snippet) => {
        const snippetHighlight = highlightEntry.snippets?.[snippet.id];
        if (!snippetHighlight?.highlightedHtml) return snippet;
        return {
          ...snippet,
          highlightedHtml: snippetHighlight.highlightedHtml,
        };
      });
    }

    entries[path] = mergedEntry;
  }

  return { ...data, entries };
}
