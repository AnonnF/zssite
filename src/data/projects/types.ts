export type ProjectTreeNode = {
  name: string;
  path: string;
  type: "file" | "folder";
  children?: ProjectTreeNode[];
};

export type ProjectAnalysisEntry = {
  path: string;
  type: "file" | "folder";
  title: string;
  summary: string;
  fixed?: boolean;
  language?: string;
  code?: string;
};

export type ProjectAnalyzerData = {
  projectId: string;
  title: string;
  description: string;
  tree: ProjectTreeNode[];
  entries: Record<string, ProjectAnalysisEntry>;
};
