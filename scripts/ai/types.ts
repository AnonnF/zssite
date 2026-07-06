import type {
  ProjectCodeSnippetAnnotation,
  ProjectGuidedTourStep,
  ProjectPipelineNode,
  ProjectSkillHighlight,
  ProjectStructuredAnalysis,
  ProjectTechnicalDecision,
  ProjectTreeNode,
  ProjectAnalysisEntry,
  ProjectManualAnalysisData,
  ProjectTemplate,
  ProjectTemplateId,
} from "../../src/data/projects/types.js";
import type {
  AiDraft,
  AiDraftEntry,
  AiDraftProjectAnalysis,
  SelectionReport,
  ValidationReport,
} from "../../src/data/projects/ai-draft-types.js";

export type {
  AiDraft,
  AiDraftEntry,
  AiDraftProjectAnalysis,
  SelectionReport,
  ValidationReport,
};

export type AiProviderId = "deepseek";

export interface AiProvider {
  generateJson(prompt: string, options?: { system?: string }): Promise<string>;
}

export type AiConfig = {
  apiKey: string;
  baseUrl: string;
  provider: AiProviderId;
  model: string;
  temperature: number;
  maxTokens: number;
};

export type CandidateCategory = "file" | "folder" | "test";

export type CandidateEntry = {
  path: string;
  type: "file" | "folder";
  category: CandidateCategory;
  language?: string;
  sizeBytes?: number;
  code?: string;
  summary?: string;
  truncated?: boolean;
  metadataOnly?: boolean;
  secretBlocked?: boolean;
  score: number;
  reasons: string[];
};

export type ScoredCandidate = {
  path: string;
  score: number;
  reasons: string[];
  category: CandidateCategory;
};

export type CandidateSelectionResult = {
  candidates: CandidateEntry[];
  fileCandidates: CandidateEntry[];
  selectionReport: SelectionReport;
  warnings: string[];
};

export type ProjectContext = {
  projectId: string;
  title: string;
  description: string;
  tree: ProjectTreeNode[];
  entries: Record<string, ProjectAnalysisEntry>;
  manual?: ProjectManualAnalysisData;
  template?: ProjectTemplate;
};

export type SnippetSuggestion = {
  id: string;
  filePath: string;
  title: string;
  startLine: number;
  endLine: number;
  reason?: string;
  confidence?: "high" | "low";
  annotations?: ProjectCodeSnippetAnnotation[];
};

export type SourceBackedSnippet = {
  id: string;
  title: string;
  filePath: string;
  startLine: number;
  endLine: number;
  reason?: string;
  code: string;
  annotations?: ProjectCodeSnippetAnnotation[];
  validationStatus: "valid" | "invalid";
  validationReason?: string;
  confidence?: "high" | "low";
};

export type AiRawDraftResponse = {
  projectAnalysis?: AiDraftProjectAnalysis;
  entries?: Record<
    string,
    {
      path?: string;
      type?: "file" | "folder";
      summary?: string;
      analysis?: ProjectStructuredAnalysis;
      snippetSuggestions?: unknown;
      snippets?: unknown;
    }
  >;
  warnings?: string[];
};

export type ProcessedDraft = {
  projectAnalysis: AiDraftProjectAnalysis;
  entries: Record<string, AiDraftEntry>;
  warnings: string[];
  selectionReport: SelectionReport;
  validationReport: ValidationReport;
};

export type { ProjectPipelineNode, ProjectGuidedTourStep, ProjectTechnicalDecision, ProjectSkillHighlight, ProjectStructuredAnalysis, ProjectTemplateId };
