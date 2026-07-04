import type { ProjectAnalysisEntry } from "../../src/data/projects/types.js";
import {
  collectSecretBlockedPaths,
  processSnippetSuggestions,
} from "./validate-snippets.js";
import type {
  AiDraftEntry,
  AiRawDraftResponse,
  ProcessedDraft,
  ProjectContext,
  SelectionReport,
  SnippetSuggestion,
  ValidationReport,
} from "./types.js";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseSnippetSuggestions(value: unknown): SnippetSuggestion[] {
  if (!Array.isArray(value)) return [];

  const suggestions: SnippetSuggestion[] = [];
  for (const item of value) {
    if (!isRecord(item)) continue;
    if (typeof item.id !== "string") continue;
    if (typeof item.filePath !== "string") continue;
    if (typeof item.title !== "string") continue;
    if (typeof item.startLine !== "number") continue;
    if (typeof item.endLine !== "number") continue;

    suggestions.push({
      id: item.id,
      filePath: item.filePath,
      title: item.title,
      startLine: item.startLine,
      endLine: item.endLine,
      reason: typeof item.reason === "string" ? item.reason : undefined,
      confidence:
        item.confidence === "high" || item.confidence === "low"
          ? item.confidence
          : undefined,
      annotations: Array.isArray(item.annotations)
        ? item.annotations
            .filter((a) => isRecord(a) && typeof a.line === "number" && typeof a.note === "string")
            .map((a) => ({ line: a.line as number, note: a.note as string }))
        : undefined,
    });
  }

  return suggestions;
}

function extractAiCodeMap(
  suggestions: unknown,
  legacySnippets: unknown
): Map<string, string> {
  const map = new Map<string, string>();

  const sources = [suggestions, legacySnippets];
  for (const source of sources) {
    if (!Array.isArray(source)) continue;
    for (const item of source) {
      if (!isRecord(item)) continue;
      if (typeof item.id === "string" && typeof item.code === "string") {
        map.set(item.id, item.code);
      }
    }
  }

  return map;
}

export function processAiDraftResponse(
  raw: AiRawDraftResponse,
  context: ProjectContext,
  selectionReport: SelectionReport
): ProcessedDraft {
  const secretBlockedPaths = collectSecretBlockedPaths(context.entries);
  const entries: Record<string, AiDraftEntry> = {};
  const validationWarnings: string[] = [];
  let totalValidSnippets = 0;
  let totalInvalidSnippets = 0;

  const rawEntries = raw.entries ?? {};

  for (const [path, rawEntry] of Object.entries(rawEntries)) {
    if (!isRecord(rawEntry)) continue;

    const snippetSuggestions = parseSnippetSuggestions(
      rawEntry.snippetSuggestions ?? rawEntry.snippets
    );

    const aiCodeById = extractAiCodeMap(
      rawEntry.snippetSuggestions,
      rawEntry.snippets
    );

    const { snippets, validationReport } = processSnippetSuggestions(
      snippetSuggestions,
      context.entries,
      secretBlockedPaths,
      aiCodeById
    );

    totalValidSnippets += validationReport.validSnippets;
    totalInvalidSnippets += validationReport.invalidSnippets;
    validationWarnings.push(...validationReport.warnings);

    const entry: AiDraftEntry = {
      path: typeof rawEntry.path === "string" ? rawEntry.path : path,
      type: rawEntry.type === "folder" ? "folder" : "file",
      summary: typeof rawEntry.summary === "string" ? rawEntry.summary : undefined,
      analysis: isRecord(rawEntry.analysis)
        ? (rawEntry.analysis as AiDraftEntry["analysis"])
        : undefined,
      snippetSuggestions: snippetSuggestions.length ? snippetSuggestions : undefined,
      snippets: snippets.length ? snippets : undefined,
    };

    entries[path] = entry;
  }

  const validationReport: ValidationReport = {
    validSnippets: totalValidSnippets,
    invalidSnippets: totalInvalidSnippets,
    warnings: validationWarnings,
  };

  return {
    projectAnalysis: raw.projectAnalysis ?? {},
    entries,
    warnings: Array.isArray(raw.warnings)
      ? raw.warnings.filter((w): w is string => typeof w === "string")
      : [],
    selectionReport,
    validationReport,
  };
}
