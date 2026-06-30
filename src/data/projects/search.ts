import type {
  ProjectAnalysisEntry,
  ProjectAnalyzerData,
  ProjectStructuredAnalysis,
  ProjectTreeNode,
} from "./types";

export type ProjectSearchIndexItem = {
  path: string;
  name: string;
  type: "file" | "folder";
  language?: string;
  haystack: string;
  description: string;
};

export type ProjectSearchResult = {
  path: string;
  name: string;
  type: "file" | "folder";
  language?: string;
  description: string;
  score: number;
};

const DEFAULT_LIMIT = 10;

function findTreeNode(
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

function inferTypeFromPath(path: string): "file" | "folder" {
  if (!path) return "folder";
  return path.includes(".") ? "file" : "folder";
}

function resolveEntry(
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

export function flattenTree(nodes: ProjectTreeNode[]): ProjectTreeNode[] {
  const result: ProjectTreeNode[] = [];

  function walk(nodeList: ProjectTreeNode[]) {
    for (const node of nodeList) {
      result.push(node);
      if (node.children?.length) {
        walk(node.children);
      }
    }
  }

  walk(nodes);
  return result;
}

function appendStrings(parts: string[], values: (string | undefined)[]) {
  for (const value of values) {
    if (value) parts.push(value);
  }
}

function appendArray(parts: string[], values: string[] | undefined) {
  if (values?.length) {
    parts.push(...values);
  }
}

function collectAnalysisText(analysis: ProjectStructuredAnalysis): string[] {
  const parts: string[] = [];
  appendStrings(parts, [
    analysis.purpose,
    analysis.role,
    analysis.input,
    analysis.output,
  ]);
  appendArray(parts, analysis.responsibilities);
  appendArray(parts, analysis.keyLogic);
  appendArray(parts, analysis.notes);
  appendArray(parts, analysis.relatedModules);
  appendArray(parts, analysis.usedBy);
  return parts;
}

function collectGuidedTourText(
  data: ProjectAnalyzerData,
  path: string
): string[] {
  if (!data.guidedTour?.length) return [];

  const parts: string[] = [];
  for (const step of data.guidedTour) {
    const matches =
      path === step.path ||
      (step.path !== "" && path.startsWith(`${step.path}/`));

    if (matches) {
      appendStrings(parts, [step.label, step.title, step.description, step.note]);
    }
  }
  return parts;
}

export function getSearchResultDescription(entry: ProjectAnalysisEntry): string {
  const { analysis } = entry;
  if (entry.summary && entry.summary !== "暂无该路径的详细分析。") {
    return entry.summary;
  }
  if (analysis?.purpose) return analysis.purpose;
  if (analysis?.role) return analysis.role;
  if (analysis?.keyLogic?.[0]) return analysis.keyLogic[0];
  if (entry.summary) return entry.summary;
  return "暂无说明";
}

function collectSearchableText(
  data: ProjectAnalyzerData,
  node: ProjectTreeNode,
  entry: ProjectAnalysisEntry
): string {
  const parts: string[] = [
    node.name,
    node.path,
    node.type,
    entry.title,
    entry.summary,
  ];

  appendStrings(parts, [entry.language, entry.type]);
  if (entry.analysis) {
    parts.push(...collectAnalysisText(entry.analysis));
  }
  parts.push(...collectGuidedTourText(data, node.path));

  return parts.join(" ").toLowerCase();
}

export function buildSearchIndex(data: ProjectAnalyzerData): ProjectSearchIndexItem[] {
  return flattenTree(data.tree).map((node) => {
    const entry = resolveEntry(data, node.path, node);
    return {
      path: node.path,
      name: node.name,
      type: node.type,
      language: entry.language,
      haystack: collectSearchableText(data, node, entry),
      description: getSearchResultDescription(entry),
    };
  });
}

function scoreSearchItem(
  item: ProjectSearchIndexItem,
  normalizedQuery: string
): number {
  const name = item.name.toLowerCase();
  const path = item.path.toLowerCase();
  const type = item.type.toLowerCase();
  const language = item.language?.toLowerCase() ?? "";

  if (name === normalizedQuery) return 100;
  if (name.includes(normalizedQuery)) return 80;
  if (path.includes(normalizedQuery)) return 60;
  if (type.includes(normalizedQuery) || language.includes(normalizedQuery)) {
    return 40;
  }
  if (item.haystack.includes(normalizedQuery)) return 20;
  return 0;
}

export function searchProjectEntries(
  data: ProjectAnalyzerData,
  query: string,
  limit = DEFAULT_LIMIT
): ProjectSearchResult[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return [];

  const index = buildSearchIndex(data);

  return index
    .map((item) => ({
      path: item.path,
      name: item.name,
      type: item.type,
      language: item.language,
      description: item.description,
      score: scoreSearchItem(item, normalizedQuery),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.name.localeCompare(b.name);
    })
    .slice(0, limit);
}

export function countSearchMatches(
  data: ProjectAnalyzerData,
  query: string
): number {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return 0;

  const index = buildSearchIndex(data);
  return index.filter((item) => scoreSearchItem(item, normalizedQuery) > 0).length;
}
