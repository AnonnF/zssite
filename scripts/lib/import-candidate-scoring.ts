import {
  AI_ANALYSIS_CONFIG,
  GENERIC_SCORING_PROFILE,
  TEMPLATE_SCORING_PROFILES,
  type TemplateScoringProfile,
} from "../ai/analysis-config.js";
import { matchPriorityPattern } from "../ai/glob-match.js";
import { getProjectTemplate } from "../../src/data/projects/templates.js";
import type { ProjectTemplateId } from "../../src/data/projects/types.js";
import {
  getFileExtension,
  isPreferredTextExtension,
} from "./project-analysis/filters.js";

export type ImportCandidateScore = {
  score: number;
  reasons: string[];
  isCandidate: boolean;
};

type ScoreState = {
  score: number;
  reasons: string[];
};

const CANDIDATE_THRESHOLD = 1;

function addReason(state: ScoreState, delta: number, reason: string): void {
  state.score += delta;
  if (!state.reasons.includes(reason)) {
    state.reasons.push(reason);
  }
}

function getScoringProfile(templateId?: ProjectTemplateId): TemplateScoringProfile {
  if (templateId && TEMPLATE_SCORING_PROFILES[templateId]) {
    return TEMPLATE_SCORING_PROFILES[templateId];
  }
  return GENERIC_SCORING_PROFILE;
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

export function scoreImportCandidate(
  filePath: string,
  options: {
    templateId?: ProjectTemplateId;
    priorityPaths?: string[];
    priorityPatterns?: string[];
    entryType?: "file" | "folder";
  } = {}
): ImportCandidateScore {
  const state: ScoreState = { score: 0, reasons: [] };
  const entryType = options.entryType ?? "file";
  const profile = getScoringProfile(options.templateId);
  const template = options.templateId
    ? getProjectTemplate(options.templateId)
    : undefined;

  for (const priorityPath of options.priorityPaths ?? []) {
    if (
      filePath === priorityPath ||
      filePath.startsWith(`${priorityPath}/`) ||
      priorityPath.startsWith(`${filePath}/`)
    ) {
      addReason(
        state,
        AI_ANALYSIS_CONFIG.priorityPathBonus,
        `priority path: ${priorityPath}`
      );
    }
  }

  for (const pattern of options.priorityPatterns ?? []) {
    if (matchPriorityPattern(filePath, pattern)) {
      addReason(
        state,
        AI_ANALYSIS_CONFIG.priorityPatternBonus,
        `priority pattern: ${pattern}`
      );
    }
  }

  for (const hintPath of Object.keys(template?.folderRoleHints ?? {})) {
    if (
      filePath === hintPath ||
      filePath.startsWith(`${hintPath}/`) ||
      hintPath.startsWith(`${filePath}/`)
    ) {
      addReason(
        state,
        AI_ANALYSIS_CONFIG.templateFolderHintBonus,
        `template folder hint: ${hintPath}`
      );
    }
  }

  if (entryType === "folder") {
    addReason(state, AI_ANALYSIS_CONFIG.corePathBonus, "folder in tree");
    return {
      score: state.score,
      reasons: state.reasons,
      isCandidate: state.score >= CANDIDATE_THRESHOLD,
    };
  }

  const name = filePath.split("/").pop() ?? filePath;
  if (name.toLowerCase() === "readme.md") {
    addReason(state, AI_ANALYSIS_CONFIG.readmeBonus, "README.md");
  }

  for (const { pattern, label, score } of profile.fileNamePatterns) {
    if (pattern.test(filePath) || pattern.test(name)) {
      addReason(
        state,
        score,
        `${options.templateId ?? "generic"} template: ${label}`
      );
    }
  }

  for (const { pattern, label, score } of profile.pathPatterns) {
    if (pattern.test(filePath)) {
      addReason(state, score, `core path: ${label}`);
    }
  }

  const ext = getFileExtension(filePath);
  if (isPreferredTextExtension(ext)) {
    addReason(state, AI_ANALYSIS_CONFIG.genericFileNameBonus, "preferred text extension");
  }

  if (isTestPath(filePath)) {
    addReason(state, AI_ANALYSIS_CONFIG.testFileBonus, "test file");
  }

  if (state.score === 0) {
    addReason(state, 1, "baseline file");
  }

  return {
    score: state.score,
    reasons: state.reasons,
    isCandidate: state.score >= CANDIDATE_THRESHOLD,
  };
}
