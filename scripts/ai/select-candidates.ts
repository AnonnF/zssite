import {
  DEFAULT_IGNORE_DIRS,
  getFileExtension,
  isBinaryExtension,
  isPreferredTextExtension,
  matchPattern,
  shouldIgnoreFile,
} from "../lib/project-analysis/filters.js";
import {
  AI_ANALYSIS_CONFIG,
  GENERIC_SCORING_PROFILE,
  TEMPLATE_SCORING_PROFILES,
  type TemplateScoringProfile,
} from "./analysis-config.js";
import { matchPriorityPattern } from "./glob-match.js";
import type { AnalyzerAiConfig } from "./load-analyzer-config.js";
import { isCodeBlockedForAi } from "./secret-detection.js";
import type {
  CandidateEntry,
  CandidateSelectionResult,
  ProjectContext,
  ScoredCandidate,
  SelectionReport,
} from "./types.js";
import type { ProjectTemplateId } from "../../src/data/projects/types.js";

type ScoreState = {
  score: number;
  reasons: string[];
};

function pathContainsIgnoredSegment(filePath: string): boolean {
  return filePath.split("/").some((segment) => DEFAULT_IGNORE_DIRS.has(segment));
}

function isSensitivePath(filePath: string): boolean {
  const name = filePath.split("/").pop() ?? filePath;
  if (shouldIgnoreFile(name)) return true;
  if (name.startsWith(".env")) return true;
  if (matchPattern(name, "*.pem")) return true;
  if (matchPattern(name, "*.key")) return true;
  return false;
}

function isConfigOrLockFile(filePath: string): boolean {
  const name = filePath.split("/").pop() ?? filePath;
  return (
    name === "package-lock.json" ||
    name === "yarn.lock" ||
    name === "pnpm-lock.yaml" ||
    name.endsWith(".lock") ||
    name === "project.scala" ||
    name === "Makefile" ||
    name === "compile"
  );
}

function isTestPath(filePath: string): boolean {
  const base = filePath.split("/").pop() ?? filePath;
  return (
    filePath.startsWith("tests/") ||
    filePath.startsWith("src/test/") ||
    filePath.includes("/test/") ||
    /Tests?\.|_test\.|\.test\./i.test(base)
  );
}

function getSkipReason(
  path: string,
  entry: ProjectContext["entries"][string]
): string | null {
  if (pathContainsIgnoredSegment(path)) return "ignored directory segment";
  if (isSensitivePath(path)) return "sensitive path pattern";
  if (entry.tooLarge) return "file too large (scanner)";
  if (entry.type === "file") {
    const name = path.split("/").pop() ?? path;
    if (shouldIgnoreFile(name)) return "ignored file name";
    const ext = getFileExtension(path);
    if (ext && isBinaryExtension(ext)) return "binary extension";
    if (isConfigOrLockFile(path)) return "config/lock/build artifact";
  }
  return null;
}

function getScoringProfile(context: ProjectContext): TemplateScoringProfile {
  const templateId = context.manual?.templateId as ProjectTemplateId | undefined;
  if (templateId && TEMPLATE_SCORING_PROFILES[templateId]) {
    return TEMPLATE_SCORING_PROFILES[templateId];
  }
  return GENERIC_SCORING_PROFILE;
}

function addReason(state: ScoreState, delta: number, reason: string): void {
  state.score += delta;
  if (!state.reasons.includes(reason)) {
    state.reasons.push(reason);
  }
}

function addPathAncestors(
  scores: Map<string, ScoreState>,
  filePath: string,
  delta: number,
  reason: string
): void {
  const parts = filePath.split("/").filter(Boolean);
  for (let i = 0; i < parts.length; i++) {
    const ancestor = parts.slice(0, i + 1).join("/");
    const state = scores.get(ancestor) ?? { score: 0, reasons: [] };
    addReason(state, delta, reason);
    scores.set(ancestor, state);
  }
  if (!filePath.includes("/")) {
    const state = scores.get(filePath) ?? { score: 0, reasons: [] };
    addReason(state, delta, reason);
    scores.set(filePath, state);
  }
}

function scoreEntry(
  path: string,
  entry: ProjectContext["entries"][string],
  context: ProjectContext,
  analyzerConfig: AnalyzerAiConfig,
  profile: TemplateScoringProfile
): ScoreState {
  const state: ScoreState = { score: 0, reasons: [] };

  for (const priorityPath of analyzerConfig.priorityPaths ?? []) {
    if (path === priorityPath) {
      addReason(
        state,
        AI_ANALYSIS_CONFIG.priorityPathBonus,
        `priority path: ${priorityPath}`
      );
    }
  }

  for (const pattern of analyzerConfig.priorityPatterns ?? []) {
    if (matchPriorityPattern(path, pattern)) {
      addReason(
        state,
        AI_ANALYSIS_CONFIG.priorityPatternBonus,
        `priority pattern: ${pattern}`
      );
    }
  }

  for (const node of context.manual?.pipeline ?? []) {
    if (
      path === node.path ||
      path.startsWith(`${node.path}/`) ||
      node.path.startsWith(`${path}/`)
    ) {
      addReason(state, AI_ANALYSIS_CONFIG.manualPipelineBonus, "manual pipeline path");
    }
  }

  for (const step of context.manual?.guidedTour ?? []) {
    if (
      path === step.path ||
      path.startsWith(`${step.path}/`) ||
      step.path.startsWith(`${path}/`)
    ) {
      addReason(
        state,
        AI_ANALYSIS_CONFIG.manualGuidedTourBonus,
        "manual guided tour path"
      );
    }
  }

  const manualEntry = context.manual?.entries[path];
  if (
    manualEntry &&
    (manualEntry.fixed || manualEntry.analysis || manualEntry.snippets?.length)
  ) {
    addReason(state, AI_ANALYSIS_CONFIG.manualEntryBonus, "manual entry exists");
  }

  for (const hintPath of Object.keys(context.template?.folderRoleHints ?? {})) {
    if (path === hintPath || path.startsWith(`${hintPath}/`) || hintPath.startsWith(`${path}/`)) {
      addReason(
        state,
        AI_ANALYSIS_CONFIG.templateFolderHintBonus,
        `template folder hint: ${hintPath}`
      );
    }
  }

  if (entry.type === "file") {
    const name = path.split("/").pop() ?? path;
    if (name.toLowerCase() === "readme.md") {
      addReason(state, AI_ANALYSIS_CONFIG.readmeBonus, "README.md");
    }

    for (const { pattern, label, score } of profile.fileNamePatterns) {
      if (pattern.test(path) || pattern.test(name)) {
        addReason(
          state,
          score,
          `${context.manual?.templateId ?? "generic"} template: ${label}`
        );
      }
    }

    for (const { pattern, label, score } of profile.pathPatterns) {
      if (pattern.test(path)) {
        addReason(state, score, `core path: ${label}`);
      }
    }

    const ext = getFileExtension(path);
    if (isPreferredTextExtension(ext)) {
      addReason(state, AI_ANALYSIS_CONFIG.genericFileNameBonus, "preferred text extension");
    }

    if (isTestPath(path)) {
      addReason(state, AI_ANALYSIS_CONFIG.testFileBonus, "test file");
    }
  } else if (entry.type === "folder") {
    addReason(state, 10, "folder in tree");
  }

  if (state.score === 0 && entry.type === "file") {
    state.score = 1;
    state.reasons.push("baseline file");
  }

  return state;
}

function truncateCode(code: string): { code: string; truncated: boolean } {
  const lines = code.split("\n");
  let truncated = false;
  let result = code;

  if (lines.length > AI_ANALYSIS_CONFIG.maxFileLines) {
    result = lines.slice(0, AI_ANALYSIS_CONFIG.maxFileLines).join("\n");
    truncated = true;
  }

  if (Buffer.byteLength(result, "utf8") > AI_ANALYSIS_CONFIG.maxFileBytes) {
    const buf = Buffer.from(result, "utf8");
    result = buf.subarray(0, AI_ANALYSIS_CONFIG.maxFileBytes).toString("utf8");
    truncated = true;
  }

  return { code: result, truncated };
}

function prepareCandidateContent(
  path: string,
  entry: ProjectContext["entries"][string],
  warnings: string[]
): Pick<CandidateEntry, "code" | "truncated" | "metadataOnly" | "summary" | "secretBlocked"> {
  if (entry.type === "folder") {
    return { summary: entry.summary };
  }

  if (
    entry.tooLarge ||
    (entry.sizeBytes ?? 0) > AI_ANALYSIS_CONFIG.maxAnalyzableFileSize
  ) {
    return {
      metadataOnly: true,
      summary:
        entry.summary || `File too large (${entry.sizeBytes ?? "unknown"} bytes)`,
    };
  }

  if (!entry.code) {
    return {
      metadataOnly: true,
      summary: entry.summary || "No code content available",
    };
  }

  const secretScan = isCodeBlockedForAi(entry.code);
  if (secretScan.blocked) {
    warnings.push(
      `Skipped code for ${path}: suspected secrets (${secretScan.reasons.join(", ")})`
    );
    return {
      metadataOnly: true,
      secretBlocked: true,
      summary: entry.summary || "Code omitted due to suspected secrets",
    };
  }

  const { code, truncated } = truncateCode(entry.code);
  return { code, truncated, summary: entry.summary };
}

function toCandidateEntry(
  scored: ScoredCandidate,
  entry: ProjectContext["entries"][string],
  warnings: string[]
): CandidateEntry {
  const content = prepareCandidateContent(scored.path, entry, warnings);
  return {
    path: scored.path,
    type: entry.type,
    category: scored.category,
    language: entry.language,
    sizeBytes: entry.sizeBytes,
    score: scored.score,
    reasons: scored.reasons,
    ...content,
  };
}

function selectFromPool(
  pool: ScoredCandidate[],
  limit: number,
  selectedPaths: Set<string>
): ScoredCandidate[] {
  const selected: ScoredCandidate[] = [];
  for (const item of pool) {
    if (selected.length >= limit) break;
    if (selectedPaths.has(item.path)) continue;
    selected.push(item);
    selectedPaths.add(item.path);
  }
  return selected;
}

export function selectAnalysisCandidates(
  context: ProjectContext,
  analyzerConfig: AnalyzerAiConfig,
  configWarnings: string[] = []
): CandidateSelectionResult {
  const warnings = [...configWarnings];
  const profile = getScoringProfile(context);
  const skippedFiles: SelectionReport["skippedFiles"] = [];
  const scoreMap = new Map<string, ScoreState>();

  for (const priorityPath of analyzerConfig.priorityPaths ?? []) {
    if (!context.entries[priorityPath]) {
      warnings.push(`priority path not found: ${priorityPath}`);
    }
  }

  for (const [path, entry] of Object.entries(context.entries)) {
    const skipReason = getSkipReason(path, entry);
    if (skipReason) {
      if (entry.type === "file") {
        skippedFiles.push({ path, reason: skipReason });
      }
      continue;
    }
    scoreMap.set(path, scoreEntry(path, entry, context, analyzerConfig, profile));
  }

  const filePool: ScoredCandidate[] = [];
  const folderPool: ScoredCandidate[] = [];
  const testPool: ScoredCandidate[] = [];

  for (const [path, state] of scoreMap) {
    const entry = context.entries[path];
    if (!entry) continue;

    const item: ScoredCandidate = {
      path,
      score: state.score,
      reasons: state.reasons,
      category: entry.type === "folder" ? "folder" : "file",
    };

    if (entry.type === "folder") {
      folderPool.push({ ...item, category: "folder" });
    } else if (isTestPath(path)) {
      testPool.push({ ...item, category: "test" });
    } else {
      filePool.push({ ...item, category: "file" });
    }
  }

  const sortPool = (pool: ScoredCandidate[]) =>
    pool.sort((a, b) => b.score - a.score || a.path.localeCompare(b.path));

  sortPool(filePool);
  sortPool(folderPool);
  sortPool(testPool);

  const selectedPaths = new Set<string>();
  const selectedFiles = selectFromPool(
    filePool,
    AI_ANALYSIS_CONFIG.maxFilesToAnalyze,
    selectedPaths
  );
  const selectedTests = selectFromPool(
    testPool,
    AI_ANALYSIS_CONFIG.maxTestsToAnalyze,
    selectedPaths
  );
  const selectedFolders = selectFromPool(
    folderPool,
    AI_ANALYSIS_CONFIG.maxFoldersToAnalyze,
    selectedPaths
  );

  const allSelected = [...selectedFiles, ...selectedTests, ...selectedFolders];
  const candidates: CandidateEntry[] = allSelected.map((scored) =>
    toCandidateEntry(scored, context.entries[scored.path], warnings)
  );

  const selectionReport: SelectionReport = {
    selectedFiles: selectedFiles.map((item) => ({
      path: item.path,
      score: item.score,
      reasons: item.reasons,
      category: "file" as const,
    })),
    selectedFolders: selectedFolders.map((item) => ({
      path: item.path,
      score: item.score,
      reasons: item.reasons,
      category: "folder" as const,
    })),
    selectedTests: selectedTests.map((item) => ({
      path: item.path,
      score: item.score,
      reasons: item.reasons,
      category: "test" as const,
    })),
    skippedFiles,
    warnings,
    templateId: context.manual?.templateId,
    stageChecklist: profile.stageChecklist,
  };

  return { candidates, selectionReport, warnings, fileCandidates: candidates };
}

export function getStageChecklist(context: ProjectContext): string[] {
  return getScoringProfile(context).stageChecklist;
}
