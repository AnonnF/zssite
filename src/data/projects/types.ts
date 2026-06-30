export type ProjectTreeNode = {
  name: string;
  path: string;
  type: "file" | "folder";
  children?: ProjectTreeNode[];
};

export type ProjectStructuredAnalysis = {
  purpose?: string;
  responsibilities?: string[];
  input?: string;
  output?: string;
  role?: string;
  keyLogic?: string[];
  relatedModules?: string[];
  relatedPaths?: string[];
  usedBy?: string[];
  notes?: string[];
  reviewStatus?: "draft" | "reviewed" | "verified";
};

export type ProjectAnalysisEntry = {
  path: string;
  type: "file" | "folder";
  title: string;
  summary: string;
  fixed?: boolean;
  language?: string;
  code?: string;
  analysis?: ProjectStructuredAnalysis;
};

export type ProjectPipelineNode = {
  id: string;
  label: string;
  path: string;
  language: string;
  role: string;
  kind?: string;
};

export type ProjectAnalyzerData = {
  projectId: string;
  title: string;
  description: string;
  tree: ProjectTreeNode[];
  entries: Record<string, ProjectAnalysisEntry>;
  pipeline?: ProjectPipelineNode[];
};
