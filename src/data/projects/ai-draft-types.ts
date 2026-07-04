import type {
  ProjectCodeSnippet,
  ProjectGuidedTourStep,
  ProjectPipelineNode,
  ProjectSkillHighlight,
  ProjectStructuredAnalysis,
  ProjectTechnicalDecision,
} from "./types";

export type AiDraftEntry = {
  path: string;
  type: "file" | "folder";
  analysis?: ProjectStructuredAnalysis;
  snippets?: ProjectCodeSnippet[];
  summary?: string;
};

export type AiDraftProjectAnalysis = {
  overview?: string;
  suggestedPipeline?: ProjectPipelineNode[];
  suggestedGuidedTour?: ProjectGuidedTourStep[];
  technicalDecisions?: ProjectTechnicalDecision[];
  skills?: ProjectSkillHighlight[];
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
};
