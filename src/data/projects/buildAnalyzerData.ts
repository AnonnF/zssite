import { getProjectBySlug } from "@/content/projects";
import { aiDraftRegistry } from "./ai-drafts";
import { applyPublicationReview } from "./applyPublicationReview";
import { createAnalyzerDataFromAiDraft } from "./mergeAiDraftAnalysis";
import { generatedRegistry } from "./generated/registry";
import { highlightedRegistry } from "./highlighted/registry";
import { manualRegistry } from "./manual/registry";
import {
  getProjectPublicationFlags,
  projectPublicationFlags,
  type ProjectPublicationFlag,
} from "./projectPublicationFlags";
import {
  applyTemplateDefaults,
  applyTemplateEntryHints,
  resolveProjectAnalyzerData,
} from "./applyProjectTemplate";
import { mergeHighlightData } from "./mergeHighlightData";
import { GENERATED_REVIEW } from "./reviewMeta";
import { getProjectTemplate } from "./templates";
import type { ProjectAnalyzerData, ProjectManualAnalysisData } from "./types";

function resolveGeneratedOnly(
  projectId: string,
  flags: ProjectPublicationFlag
): ProjectAnalyzerData | undefined {
  const generated = generatedRegistry[projectId];
  if (!generated) {
    return undefined;
  }

  const contentProject = getProjectBySlug(projectId);
  const entries = Object.fromEntries(
    Object.entries(generated.entries).map(([path, entry]) => [
      path,
      { ...entry, review: entry.review ?? GENERATED_REVIEW },
    ])
  );

  let data: ProjectAnalyzerData = {
    projectId,
    title: contentProject?.title ?? projectId,
    description: contentProject?.summary ?? "",
    tree: generated.tree,
    entries,
  };

  if (flags.templateId) {
    const template = getProjectTemplate(flags.templateId);
    if (template) {
      const shell: ProjectManualAnalysisData = {
        ...data,
        templateId: flags.templateId,
      };
      data = applyTemplateDefaults(shell, template);
      data = applyTemplateEntryHints(data, template);
    }
  }

  return data;
}

function resolveDraftAnalyzerData(
  projectId: string,
  flags: ProjectPublicationFlag
): ProjectAnalyzerData | undefined {
  const generated = generatedRegistry[projectId];
  const aiDraft = aiDraftRegistry[projectId];
  if (!generated || !aiDraft) {
    return undefined;
  }

  const contentProject = getProjectBySlug(projectId);
  let data = createAnalyzerDataFromAiDraft(generated, aiDraft, {
    title: contentProject?.title ?? projectId,
    description: aiDraft.projectAnalysis.overview ?? contentProject?.summary,
    templateId: flags.templateId,
  });

  if (flags.templateId) {
    const template = getProjectTemplate(flags.templateId);
    if (template) {
      const shell: ProjectManualAnalysisData = {
        ...data,
        templateId: flags.templateId,
      };
      data = applyTemplateDefaults(shell, template);
      data = applyTemplateEntryHints(data, template);
    }
  }

  return data;
}

function buildAnalyzerDataCore(
  projectId: string,
  flags: ProjectPublicationFlag
): ProjectAnalyzerData | undefined {
  const manual = manualRegistry[projectId];
  const generated = generatedRegistry[projectId];

  let data: ProjectAnalyzerData | undefined;

  if (manual) {
    data = resolveProjectAnalyzerData(manual, generated);
  } else if (aiDraftRegistry[projectId] && generated) {
    data = resolveDraftAnalyzerData(projectId, flags);
  } else {
    data = resolveGeneratedOnly(projectId, flags);
  }

  if (!data) {
    return undefined;
  }

  return applyPublicationReview(data, flags);
}

export function buildAnalyzerDataForProject(
  projectId: string,
  options?: { includeHighlights?: boolean }
): ProjectAnalyzerData | undefined {
  const flags = getProjectPublicationFlags(projectId);
  if (!flags?.enabled) {
    return undefined;
  }

  const data = buildAnalyzerDataCore(projectId, flags);
  if (!data) {
    return undefined;
  }

  if (options?.includeHighlights === false) {
    return data;
  }

  return mergeHighlightData(data, highlightedRegistry[projectId]);
}

export function listEnabledAnalyzerProjectIds(): string[] {
  return Object.entries(projectPublicationFlags)
    .filter(([, flags]) => flags.enabled)
    .map(([projectId]) => projectId)
    .sort();
}

export function buildAnalyzerRegistry(): Record<string, ProjectAnalyzerData> {
  return Object.fromEntries(
    listEnabledAnalyzerProjectIds()
      .map((projectId) => {
        const data = buildAnalyzerDataForProject(projectId);
        return data ? ([projectId, data] as const) : null;
      })
      .filter((entry): entry is readonly [string, ProjectAnalyzerData] => entry !== null)
  );
}

export function inferAnalyzerSource(projectId: string): "manual" | "ai-draft" | "generated" | "none" {
  if (manualRegistry[projectId]) return "manual";
  if (aiDraftRegistry[projectId] && generatedRegistry[projectId]) return "ai-draft";
  if (generatedRegistry[projectId]) return "generated";
  return "none";
}
