import { getPortfolioProjectBySlug } from "@/content/projects";
import {
  getRepositoryAnalysisByAnalyzerProjectId,
  reviewStatusToReviewMeta,
} from "@/content/repositoryAnalyses";
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
import type {
  ProjectAnalysisEntry,
  ProjectAnalyzerData,
  ProjectManualAnalysisData,
} from "./types";

function resolveGeneratedOnly(
  projectId: string,
  flags: ProjectPublicationFlag
): ProjectAnalyzerData | undefined {
  const generated = generatedRegistry[projectId];
  if (!generated) {
    return undefined;
  }

  const contentMeta = resolveAnalyzerContentMeta(projectId);
  const entries = Object.fromEntries(
    Object.entries(generated.entries).map(([path, entry]) => [
      path,
      { ...entry, review: entry.review ?? GENERATED_REVIEW },
    ])
  );

  let data: ProjectAnalyzerData = {
    projectId,
    title: contentMeta.title,
    description: contentMeta.description,
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

  const contentMeta = resolveAnalyzerContentMeta(projectId);
  let data = createAnalyzerDataFromAiDraft(generated, aiDraft, {
    title: contentMeta.title,
    description: aiDraft.projectAnalysis.overview ?? contentMeta.description,
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

function resolveAnalyzerContentMeta(projectId: string): {
  title: string;
  description: string;
} {
  const portfolio = getPortfolioProjectBySlug(projectId);
  if (portfolio) {
    return { title: portfolio.title, description: portfolio.summary };
  }

  const analysis = getRepositoryAnalysisByAnalyzerProjectId(projectId);
  if (analysis) {
    return { title: analysis.title, description: analysis.summary };
  }

  return { title: projectId, description: "" };
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

/** Strip heavy fields so analyzer data fits Vercel's SSG/RSC payload limit (~19 MB). */
export function stripAnalyzerDataForClient(
  data: ProjectAnalyzerData
): ProjectAnalyzerData {
  const entries = Object.fromEntries(
    Object.entries(data.entries).map(([path, entry]) => [
      path,
      stripAnalysisEntryForClient(entry),
    ])
  );

  return { ...data, entries };
}

function stripAnalysisEntryForClient(
  entry: ProjectAnalysisEntry
): ProjectAnalysisEntry {
  const { code: _code, highlightedHtml: _html, ...rest } = entry;
  const snippets = rest.snippets?.map(({ highlightedHtml: _snippetHtml, ...snippet }) => snippet);

  return snippets ? { ...rest, snippets } : rest;
}

export function getProjectAnalyzerEntry(
  projectId: string,
  path: string
): ProjectAnalysisEntry | undefined {
  const data = buildAnalyzerDataForProject(projectId, { includeHighlights: false });
  return data?.entries[path];
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
        const data = buildAnalyzerDataForProject(projectId, {
          includeHighlights: false,
        });
        return data
          ? ([projectId, stripAnalyzerDataForClient(data)] as const)
          : null;
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
