import type { AiDraft, SourceBackedSnippet } from "./ai-draft-types";
import type {
  ProjectAnalysisEntry,
  ProjectAnalyzerData,
  ProjectAnalyzerGeneratedData,
  ProjectCodeSnippet,
  ProjectTemplateId,
} from "./types";
import { AI_DRAFT_REVIEW } from "./reviewMeta";

function mapValidSnippets(
  snippets?: SourceBackedSnippet[]
): ProjectCodeSnippet[] | undefined {
  if (!snippets?.length) {
    return undefined;
  }

  const valid = snippets.filter(
    (snippet) => snippet.validationStatus === "valid"
  );

  if (!valid.length) {
    return undefined;
  }

  return valid.map((snippet) => ({
    id: snippet.id,
    title: snippet.title,
    startLine: snippet.startLine,
    endLine: snippet.endLine,
    reason: snippet.reason,
    code: snippet.code,
    annotations: snippet.annotations,
    review: snippet.review ?? AI_DRAFT_REVIEW,
  }));
}

function mergeEntry(
  generatedEntry: ProjectAnalysisEntry | undefined,
  draftEntry: AiDraft["entries"][string] | undefined,
  path: string
): ProjectAnalysisEntry {
  const name = path ? path.split("/").pop() ?? path : "ROOT";

  return {
    path,
    type: draftEntry?.type ?? generatedEntry?.type ?? (path.includes(".") ? "file" : "folder"),
    title: generatedEntry?.title ?? name,
    summary: draftEntry?.summary ?? generatedEntry?.summary ?? "",
    fixed: generatedEntry?.fixed,
    language: generatedEntry?.language,
    code: generatedEntry?.code,
    sizeBytes: generatedEntry?.sizeBytes,
    tooLarge: generatedEntry?.tooLarge,
    generated: generatedEntry?.generated,
    analysis: draftEntry?.analysis ?? generatedEntry?.analysis,
    snippets: mapValidSnippets(draftEntry?.snippets),
    review: draftEntry?.review ?? AI_DRAFT_REVIEW,
  };
}

export function createAnalyzerDataFromAiDraft(
  generated: ProjectAnalyzerGeneratedData,
  aiDraft: AiDraft,
  options: {
    title: string;
    description?: string;
    templateId?: ProjectTemplateId;
  }
): ProjectAnalyzerData {
  const paths = new Set([
    ...Object.keys(generated.entries),
    ...Object.keys(aiDraft.entries),
  ]);

  const entries: Record<string, ProjectAnalysisEntry> = {};
  for (const path of [...paths].sort()) {
    entries[path] = mergeEntry(
      generated.entries[path],
      aiDraft.entries[path],
      path
    );
  }

  const { projectAnalysis } = aiDraft;

  return {
    projectId: generated.projectId,
    title: options.title,
    description:
      options.description ??
      projectAnalysis.overview ??
      "",
    tree: generated.tree,
    entries,
    pipeline: projectAnalysis.suggestedPipeline,
    guidedTour: projectAnalysis.suggestedGuidedTour,
    narrative:
      (projectAnalysis.technicalDecisions?.length ?? 0) > 0 ||
      (projectAnalysis.skills?.length ?? 0) > 0
        ? {
            technicalDecisions: projectAnalysis.technicalDecisions?.map(
              (item) => ({
                ...item,
                review: item.review ?? AI_DRAFT_REVIEW,
              })
            ),
            skills: projectAnalysis.skills?.map((item) => ({
              ...item,
              review: item.review ?? AI_DRAFT_REVIEW,
            })),
          }
        : undefined,
    review: aiDraft.review ?? AI_DRAFT_REVIEW,
  };
}
