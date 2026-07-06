import type {
  ProjectAnalyzerData,
  ProjectAnalysisEntry,
  ProjectGuidedTourStep,
  ProjectManualAnalysisData,
  ProjectNarrative,
  ProjectPipelineNode,
  ProjectStructuredAnalysis,
  ProjectTreeNode,
} from "./types";
import { buildAnalyzerRegistry } from "./buildAnalyzerData";

export type {
  ProjectAnalyzerData,
  ProjectAnalysisEntry,
  ProjectAnalysisChecklist,
  ProjectAnalyzerGeneratedData,
  ProjectAnalyzerGeneratedMetadata,
  ProjectCodeSnippet,
  ProjectCodeSnippetAnnotation,
  ProjectGuidedTourStep,
  ProjectManualAnalysisData,
  ProjectNarrative,
  ProjectPipelineNode,
  ProjectSkillHighlight,
  ProjectStructuredAnalysis,
  ProjectTechnicalDecision,
  ProjectTemplate,
  ProjectTemplateId,
  ProjectTreeNode,
  ReviewMeta,
  ReviewSource,
  ReviewStatus,
} from "./types";
export { getProjectTemplate, projectTemplates } from "./templates";
export {
  applyTemplateDefaults,
  applyTemplateEntryHints,
  resolveProjectAnalyzerData,
} from "./applyProjectTemplate";
export {
  getReviewBadgeClass,
  getReviewLabel,
  getReviewTitle,
} from "./reviewMeta";
export type { AiDraft, AiDraftEntry, AiDraftProjectAnalysis } from "./ai-draft-types";
export {
  getProjectPublicationFlags,
  projectPublicationFlags,
  type ProjectPublicationFlag,
} from "./projectPublicationFlags";
export { applyPublicationReview, reviewFromPublicationFlags } from "./applyPublicationReview";
export { createAnalyzerDataFromAiDraft } from "./mergeAiDraftAnalysis";
export { aiDraftRegistry, getAiDraft } from "./ai-drafts";
export {
  buildAnalyzerDataForProject,
  buildAnalyzerRegistry,
  getProjectAnalyzerEntry,
  inferAnalyzerSource,
  listEnabledAnalyzerProjectIds,
  stripAnalyzerDataForClient,
} from "./buildAnalyzerData";

const analyzerRegistry: Record<string, ProjectAnalyzerData> = buildAnalyzerRegistry();

/** Temporary: hide pipeline bar while Guided Tour covers the reading path. */
export const PROJECT_ARCHITECTURE_ENABLED = false;

export function getProjectAnalyzerData(
  projectId: string
): ProjectAnalyzerData | undefined {
  return analyzerRegistry[projectId];
}

export function hasProjectAnalyzer(projectId: string): boolean {
  return projectId in analyzerRegistry;
}

export function findTreeNode(
  nodes: ProjectTreeNode[],
  path: string
): ProjectTreeNode | undefined {
  for (const node of nodes) {
    if (node.path === path) return node;
    if (node.children) {
      const found = findTreeNode(node.children, path);
      if (found) return found;
    }
  }
  return undefined;
}

export function getDirectChildren(
  tree: ProjectTreeNode[],
  path: string
): ProjectTreeNode[] {
  const node = findTreeNode(tree, path);
  return node?.children ?? [];
}

export function getAnalysisEntry(
  data: ProjectAnalyzerData,
  path: string,
  node?: ProjectTreeNode
): ProjectAnalysisEntry {
  const existing = data.entries[path];
  if (existing) return existing;

  const resolvedNode = node ?? findTreeNode(data.tree, path);
  const type = resolvedNode?.type ?? inferTypeFromPath(path);
  const name =
    resolvedNode?.name ?? (path ? path.split("/").pop() ?? path : "Unknown");

  return {
    path,
    type,
    title: name,
    summary: "暂无该路径的详细分析。",
  };
}

function inferTypeFromPath(path: string): "file" | "folder" {
  if (!path) return "folder";
  return path.includes(".") ? "file" : "folder";
}

export function collectAncestorPaths(path: string): string[] {
  if (!path) return [];

  const segments = path.split("/");
  const ancestors: string[] = [""];

  for (let i = 1; i < segments.length; i += 1) {
    ancestors.push(segments.slice(0, i).join("/"));
  }

  return ancestors;
}

export function collectExpandedPathsFor(path: string): string[] {
  if (!path) return [""];
  return [...collectAncestorPaths(path), path];
}

export function collectAllFolderPaths(nodes: ProjectTreeNode[]): string[] {
  const paths: string[] = [];

  function walk(nodeList: ProjectTreeNode[]) {
    for (const node of nodeList) {
      if (node.type === "folder" && (node.children?.length ?? 0) > 0) {
        paths.push(node.path);
        walk(node.children!);
      }
    }
  }

  walk(nodes);
  return paths;
}

export function resolveActivePipelineNodeId(
  pipeline: ProjectPipelineNode[],
  selectedPath: string
): string | null {
  let best: ProjectPipelineNode | null = null;

  for (const node of pipeline) {
    const matches =
      selectedPath === node.path ||
      (node.path !== "" && selectedPath.startsWith(`${node.path}/`));

    if (matches && (!best || node.path.length > best.path.length)) {
      best = node;
    }
  }

  return best?.id ?? null;
}

function hasAnalysisContent(analysis: ProjectStructuredAnalysis): boolean {
  return Object.entries(analysis).some(([key, value]) => {
    if (key === "reviewStatus") return false;
    if (Array.isArray(value)) return value.length > 0;
    return Boolean(value);
  });
}

export function hasStructuredAnalysis(entry: ProjectAnalysisEntry): boolean {
  return Boolean(entry.analysis && hasAnalysisContent(entry.analysis));
}

export function getEntryBlurb(entry: ProjectAnalysisEntry): string | null {
  const { analysis } = entry;
  if (analysis?.purpose) return analysis.purpose;
  if (analysis?.role) return analysis.role;
  if (entry.summary) return entry.summary;
  return null;
}

export function resolveActiveTourStepIndex(
  steps: ProjectGuidedTourStep[],
  selectedPath: string
): number {
  let bestIndex = -1;
  let bestPathLength = -1;

  for (let i = 0; i < steps.length; i += 1) {
    const step = steps[i];
    const matches =
      selectedPath === step.path ||
      (step.path !== "" && selectedPath.startsWith(`${step.path}/`));

    if (matches && step.path.length > bestPathLength) {
      bestIndex = i;
      bestPathLength = step.path.length;
    }
  }

  return bestIndex >= 0 ? bestIndex : 0;
}

export function hasNarrativeContent(narrative: ProjectNarrative): boolean {
  return hasTechnicalDecisions(narrative) || hasSkills(narrative);
}

export function hasTechnicalDecisions(narrative: ProjectNarrative): boolean {
  return (narrative.technicalDecisions?.length ?? 0) > 0;
}

export function hasSkills(narrative: ProjectNarrative): boolean {
  return (narrative.skills?.length ?? 0) > 0;
}

export type ProjectDetailNavSection = {
  id: string;
  label: string;
};

export function buildProjectDetailNavSections(
  analyzerData?: ProjectAnalyzerData
): ProjectDetailNavSection[] {
  const sections: ProjectDetailNavSection[] = [
    { id: "project-overview", label: "Overview" },
  ];

  if (analyzerData) {
    sections.push({ id: "project-analyzer", label: "Analyzer" });

    if (
      PROJECT_ARCHITECTURE_ENABLED &&
      (analyzerData.pipeline?.length ?? 0) > 0
    ) {
      sections.push({ id: "project-architecture", label: "Architecture" });
    }

    if (analyzerData.narrative && hasTechnicalDecisions(analyzerData.narrative)) {
      sections.push({ id: "technical-decisions", label: "Technical Decisions" });
    }

    if (analyzerData.narrative && hasSkills(analyzerData.narrative)) {
      sections.push({ id: "skills-demonstrated", label: "Skills Demonstrated" });
    }
  }

  return sections;
}

export type { ProjectSearchIndexItem, ProjectSearchResult } from "./search";
export {
  buildSearchIndex,
  countSearchMatches,
  flattenTree,
  getSearchResultDescription,
  searchProjectEntries,
} from "./search";
export { mergeProjectAnalysis } from "./mergeProjectAnalysis";
