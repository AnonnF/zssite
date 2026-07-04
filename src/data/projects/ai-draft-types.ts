import type {
  ProjectGuidedTourStep,
  ProjectPipelineNode,
  ProjectSkillHighlight,
  ProjectStructuredAnalysis,
  ProjectTechnicalDecision,
  ProjectTemplateId,
  ReviewMeta,
} from "./types";

export type SnippetSuggestion = {
  id: string;
  filePath: string;
  title: string;
  startLine: number;
  endLine: number;
  reason?: string;
  confidence?: "high" | "low";
  annotations?: Array<{ line: number; note: string }>;
};

export type SourceBackedSnippet = {
  id: string;
  title: string;
  filePath: string;
  startLine: number;
  endLine: number;
  reason?: string;
  code: string;
  annotations?: Array<{ line: number; note: string }>;
  validationStatus: "valid" | "invalid";
  validationReason?: string;
  confidence?: "high" | "low";
  review?: ReviewMeta;
};

export type AiDraftEntry = {
  path: string;
  type: "file" | "folder";
  analysis?: ProjectStructuredAnalysis;
  snippetSuggestions?: SnippetSuggestion[];
  snippets?: SourceBackedSnippet[];
  summary?: string;
  review?: ReviewMeta;
};

export type AiDraftProjectAnalysis = {
  overview?: string;
  suggestedPipeline?: ProjectPipelineNode[];
  suggestedGuidedTour?: ProjectGuidedTourStep[];
  technicalDecisions?: ProjectTechnicalDecision[];
  skills?: ProjectSkillHighlight[];
};

export type SelectionReportItem = {
  path: string;
  score: number;
  reasons: string[];
  category: "file" | "folder" | "test";
};

export type SelectionReport = {
  selectedFiles: SelectionReportItem[];
  selectedFolders: SelectionReportItem[];
  selectedTests: SelectionReportItem[];
  skippedFiles: Array<{ path: string; reason: string }>;
  warnings: string[];
  templateId?: ProjectTemplateId;
  stageChecklist: string[];
};

export type ValidationReport = {
  validSnippets: number;
  invalidSnippets: number;
  warnings: string[];
};

export type AiDraft = {
  projectId: string;
  generatedAt: string;
  source: "ai-draft";
  provider: "deepseek";
  model: string;
  confidence: "draft";
  projectAnalysis: AiDraftProjectAnalysis;
  entries: Record<string, AiDraftEntry>;
  warnings: string[];
  selectionReport: SelectionReport;
  validationReport: ValidationReport;
  review?: ReviewMeta;
};
