import type {
  ProjectAnalyzerData,
  ProjectAnalysisEntry,
  ProjectPipelineNode,
  ProjectStructuredAnalysis,
  ProjectTreeNode,
} from "./types";
import { waccCompilerAnalysis } from "./wacc-compiler.analysis";

export type {
  ProjectAnalyzerData,
  ProjectAnalysisEntry,
  ProjectPipelineNode,
  ProjectStructuredAnalysis,
  ProjectTreeNode,
} from "./types";

const analyzerRegistry: Record<string, ProjectAnalyzerData> = {
  "wacc-compiler": waccCompilerAnalysis,
};

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
    summary: "No detailed analysis available for this path yet.",
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
