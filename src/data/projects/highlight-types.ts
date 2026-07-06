export type ProjectHighlightSnippetData = {
  highlightedHtml: string;
};

export type ProjectHighlightEntryData = {
  highlightedHtml?: string;
  snippets?: Record<string, ProjectHighlightSnippetData>;
};

export type ProjectHighlightData = {
  projectId: string;
  generatedAt: string;
  source: "build-time-highlight";
  theme: string;
  entries: Record<string, ProjectHighlightEntryData>;
};
