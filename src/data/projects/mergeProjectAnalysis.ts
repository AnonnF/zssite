import type {
  ProjectAnalysisEntry,
  ProjectAnalyzerData,
  ProjectAnalyzerGeneratedData,
  ProjectCodeSnippet,
  ProjectManualAnalysisData,
  ReviewMeta,
} from "./types";
import {
  GENERATED_REVIEW,
  MANUAL_REVIEW,
  TEMPLATE_REVIEW,
} from "./reviewMeta";

function resolveGeneratedReview(entry: ProjectAnalysisEntry): ReviewMeta {
  return entry.review ?? GENERATED_REVIEW;
}

function resolveManualReview(entry: ProjectAnalysisEntry): ReviewMeta {
  return entry.review ?? MANUAL_REVIEW;
}

function mergeSnippets(
  generatedSnippets?: ProjectCodeSnippet[],
  manualSnippets?: ProjectCodeSnippet[]
): ProjectCodeSnippet[] | undefined {
  if (!generatedSnippets?.length && !manualSnippets?.length) {
    return undefined;
  }

  if (!manualSnippets?.length) {
    return generatedSnippets;
  }

  if (!generatedSnippets?.length) {
    return manualSnippets;
  }

  const byId = new Map(generatedSnippets.map((snippet) => [snippet.id, snippet]));
  for (const snippet of manualSnippets) {
    byId.set(snippet.id, snippet);
  }

  return [...byId.values()];
}

function mergeEntryReview(
  generatedEntry?: ProjectAnalysisEntry,
  manualEntry?: ProjectAnalysisEntry
): ReviewMeta | undefined {
  if (manualEntry?.review) return manualEntry.review;
  if (manualEntry) return resolveManualReview(manualEntry);
  if (generatedEntry) return resolveGeneratedReview(generatedEntry);
  return undefined;
}

function mergeEntries(
  generated: Record<string, ProjectAnalysisEntry>,
  manual: Record<string, ProjectAnalysisEntry>
): Record<string, ProjectAnalysisEntry> {
  const paths = new Set([...Object.keys(generated), ...Object.keys(manual)]);
  const merged: Record<string, ProjectAnalysisEntry> = {};

  for (const path of [...paths].sort()) {
    const generatedEntry = generated[path];
    const manualEntry = manual[path];

    if (generatedEntry && manualEntry) {
      merged[path] = {
        ...generatedEntry,
        ...manualEntry,
        snippets: mergeSnippets(generatedEntry.snippets, manualEntry.snippets),
        review: mergeEntryReview(generatedEntry, manualEntry),
      };
    } else if (manualEntry) {
      merged[path] = {
        ...manualEntry,
        review: mergeEntryReview(undefined, manualEntry),
      };
    } else if (generatedEntry) {
      merged[path] = {
        ...generatedEntry,
        review: mergeEntryReview(generatedEntry, undefined),
      };
    }
  }

  return merged;
}

export function mergeProjectAnalysis(
  generated: ProjectAnalyzerGeneratedData,
  manual: ProjectAnalyzerData
): ProjectAnalyzerData {
  const tree = generated.tree.length > 0 ? generated.tree : manual.tree;

  return {
    projectId: manual.projectId,
    title: manual.title,
    description: manual.description,
    tree,
    entries: mergeEntries(generated.entries, manual.entries),
    pipeline: manual.pipeline,
    guidedTour: manual.guidedTour,
    narrative: manual.narrative,
    review: manual.review,
  };
}

export function applyGeneratedReviewDefaults(
  data: ProjectAnalyzerGeneratedData
): ProjectAnalyzerGeneratedData {
  const entries: Record<string, ProjectAnalysisEntry> = {};

  for (const [path, entry] of Object.entries(data.entries)) {
    entries[path] = {
      ...entry,
      review: entry.review ?? GENERATED_REVIEW,
    };
  }

  return { ...data, entries };
}

export function applyTemplateReviewToEntry(
  entry: ProjectAnalysisEntry
): ProjectAnalysisEntry {
  return {
    ...entry,
    review: entry.review ?? TEMPLATE_REVIEW,
  };
}

export function stripTemplateId(
  manual: ProjectManualAnalysisData
): ProjectAnalyzerData {
  const { templateId: _templateId, ...data } = manual;
  return data;
}
