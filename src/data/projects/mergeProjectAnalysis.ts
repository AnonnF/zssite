import type {
  ProjectAnalysisEntry,
  ProjectAnalyzerData,
  ProjectAnalyzerGeneratedData,
} from "./types";

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
      merged[path] = { ...generatedEntry, ...manualEntry };
    } else if (manualEntry) {
      merged[path] = manualEntry;
    } else if (generatedEntry) {
      merged[path] = generatedEntry;
    }
  }

  return merged;
}

export function mergeProjectAnalysis(
  generated: ProjectAnalyzerGeneratedData,
  manual: ProjectAnalyzerData
): ProjectAnalyzerData {
  const tree =
    generated.tree.length > 0 ? generated.tree : manual.tree;

  return {
    projectId: manual.projectId,
    title: manual.title,
    description: manual.description,
    tree,
    entries: mergeEntries(generated.entries, manual.entries),
    pipeline: manual.pipeline,
    guidedTour: manual.guidedTour,
    narrative: manual.narrative,
  };
}
