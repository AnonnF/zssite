import type { ProjectAnalyzerData, ProjectAnalysisEntry, ProjectTreeNode } from "./types";
import { waccCompilerAnalysis } from "./wacc-compiler.analysis";

export type {
  ProjectAnalyzerData,
  ProjectAnalysisEntry,
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
  if (path === "") return tree;
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
  const parts = path.split("/");
  const ancestors: string[] = [];
  for (let i = 0; i < parts.length - 1; i += 1) {
    ancestors.push(parts.slice(0, i + 1).join("/"));
  }
  return ancestors;
}
