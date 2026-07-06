import type { ProjectTemplateId } from "../../src/data/projects/types.js";

export const AI_ANALYSIS_CONFIG = {
  maxFilesToAnalyze: 20,
  maxFoldersToAnalyze: 20,
  maxTestsToAnalyze: 5,
  maxSnippetsPerFile: 3,
  maxFileLines: 500,
  maxFileBytes: 40 * 1024,
  maxAnalyzableFileSize: 100 * 1024,
  maxTreeDepth: 4,
  maxSnippetLines: 80,
  priorityPathBonus: 500,
  priorityPatternBonus: 300,
  manualPipelineBonus: 100,
  manualGuidedTourBonus: 90,
  manualEntryBonus: 80,
  templateFolderHintBonus: 60,
  readmeBonus: 70,
  corePathBonus: 50,
  templateFileNameBonus: 65,
  genericFileNameBonus: 40,
  testFileBonus: 35,
} as const;

export type TemplateScoringProfile = {
  fileNamePatterns: Array<{ pattern: RegExp; label: string; score: number }>;
  pathPatterns: Array<{ pattern: RegExp; label: string; score: number }>;
  stageChecklist: string[];
};

export const TEMPLATE_SCORING_PROFILES: Record<
  ProjectTemplateId,
  TemplateScoringProfile
> = {
  "compiler-pipeline": {
    fileNamePatterns: [
      { pattern: /^Main\.|\/Main\./i, label: "entry point", score: 90 },
      { pattern: /lexer/i, label: "lexer", score: 85 },
      { pattern: /parser/i, label: "parser", score: 85 },
      { pattern: /\bast\b/i, label: "AST", score: 85 },
      { pattern: /typeChecker|semantic/i, label: "semantic checker", score: 85 },
      { pattern: /\bcfg\b|\/CFG\.|controlflow/i, label: "IR/CFG", score: 90 },
      { pattern: /\bir\b|intermediate/i, label: "IR", score: 80 },
      { pattern: /codeGenerator|codegen/i, label: "code generation", score: 85 },
      { pattern: /regAlloc|register/i, label: "register allocation", score: 75 },
      { pattern: /liveness/i, label: "liveness analysis", score: 70 },
    ],
    pathPatterns: [
      { pattern: /^src\/main\//, label: "src/main", score: 50 },
      { pattern: /\/backend\//, label: "backend", score: 45 },
    ],
    stageChecklist: [
      "Lexer",
      "Parser",
      "AST",
      "Semantic / Type Checker",
      "IR or CFG",
      "Codegen",
      "Tests",
      "Entry point (Main)",
    ],
  },
  "systems-project": {
    fileNamePatterns: [
      { pattern: /^Main\.|\/Main\.|index\.|app\./i, label: "entry point", score: 90 },
      { pattern: /parser|decoder/i, label: "parser/decoder", score: 85 },
      { pattern: /execut|cpu|core/i, label: "execution core", score: 85 },
      { pattern: /register/i, label: "registers", score: 80 },
      { pattern: /memory|mem\./i, label: "memory", score: 80 },
      { pattern: /assembler|asm/i, label: "assembler", score: 85 },
    ],
    pathPatterns: [
      { pattern: /^src\//, label: "src", score: 50 },
      { pattern: /\/core\//, label: "core", score: 45 },
    ],
    stageChecklist: [
      "Entry point",
      "Parser / Decoder",
      "Execution core",
      "Registers",
      "Memory",
      "Assembler",
      "Tests",
    ],
  },
  "fullstack-web": {
    fileNamePatterns: [
      { pattern: /page\.|route\.|layout\./i, label: "pages/routes", score: 85 },
      { pattern: /component/i, label: "components", score: 80 },
      { pattern: /api|service/i, label: "API/services", score: 85 },
      { pattern: /schema|model|db/i, label: "data layer", score: 80 },
      { pattern: /auth/i, label: "auth", score: 75 },
      { pattern: /deploy|docker/i, label: "deployment", score: 70 },
    ],
    pathPatterns: [
      { pattern: /^src\/app\//, label: "app routes", score: 50 },
      { pattern: /^src\/components\//, label: "components", score: 45 },
      { pattern: /^src\/api\//, label: "api", score: 45 },
    ],
    stageChecklist: [
      "Pages / Routes",
      "Components",
      "API / Services",
      "Data layer",
      "Auth",
      "Deployment",
      "Tests",
    ],
  },
  "ai-pipeline": {
    fileNamePatterns: [
      { pattern: /ingest|loader/i, label: "ingest", score: 85 },
      { pattern: /chunk/i, label: "chunk", score: 80 },
      { pattern: /embed/i, label: "embed", score: 85 },
      { pattern: /retriev/i, label: "retrieve", score: 85 },
      { pattern: /generat/i, label: "generate", score: 85 },
      { pattern: /eval/i, label: "evaluate", score: 75 },
      { pattern: /agent|tool/i, label: "agent tools", score: 80 },
      { pattern: /prompt/i, label: "prompts", score: 75 },
    ],
    pathPatterns: [
      { pattern: /^src\//, label: "src", score: 50 },
      { pattern: /\/pipeline\//, label: "pipeline", score: 45 },
    ],
    stageChecklist: [
      "Ingest",
      "Chunk",
      "Embed",
      "Retrieve",
      "Generate",
      "Evaluate",
      "Agent tools",
      "Prompts",
      "Tests",
    ],
  },
};

export const GENERIC_SCORING_PROFILE: TemplateScoringProfile = {
  fileNamePatterns: [
    { pattern: /^Main\.|\/Main\.|^index\.|^app\.|^server\.|^cli\./i, label: "entry point", score: 85 },
    { pattern: /\bmodel\b|\bschema\b/i, label: "model/schema", score: 70 },
    { pattern: /\bconfig\b/i, label: "config", score: 30 },
  ],
  pathPatterns: [
    { pattern: /^src\/main\//, label: "src/main", score: 50 },
    { pattern: /^src\//, label: "src", score: 45 },
    { pattern: /^app\//, label: "app", score: 45 },
    { pattern: /^server\//, label: "server", score: 45 },
    { pattern: /\/backend\//, label: "backend", score: 40 },
    { pattern: /\/frontend\//, label: "frontend", score: 40 },
  ],
  stageChecklist: [
    "Entry point",
    "Core modules",
    "Data / model layer",
    "Tests",
  ],
};
