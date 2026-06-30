export type ProjectTreeNode = {
  name: string;
  path: string;
  type: "file" | "folder";
  children?: ProjectTreeNode[];
};

export type ProjectCodeSnippetAnnotation = {
  line: number;
  note: string;
};

export type ProjectCodeSnippet = {
  id: string;
  title: string;
  startLine?: number;
  endLine?: number;
  reason?: string;
  code: string;
  annotations?: ProjectCodeSnippetAnnotation[];
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
  snippets?: ProjectCodeSnippet[];
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

export type ProjectGuidedTourStep = {
  id: string;
  label: string;
  path: string;
  title: string;
  description: string;
  note?: string;
};

export type ProjectTechnicalDecision = {
  title: string;
  decision: string;
  rationale: string;
  impact: string;
};

export type ProjectSkillHighlight = {
  title: string;
  description: string;
};

export type ProjectNarrative = {
  technicalDecisions?: ProjectTechnicalDecision[];
  skills?: ProjectSkillHighlight[];
};

export type ProjectAnalyzerData = {
  projectId: string;
  title: string;
  description: string;
  tree: ProjectTreeNode[];
  entries: Record<string, ProjectAnalysisEntry>;
  pipeline?: ProjectPipelineNode[];
  guidedTour?: ProjectGuidedTourStep[];
  narrative?: ProjectNarrative;
};
