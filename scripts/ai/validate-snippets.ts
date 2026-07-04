import { AI_ANALYSIS_CONFIG } from "./analysis-config.js";
import { isCodeBlockedForAi } from "./secret-detection.js";
import type { ProjectAnalysisEntry } from "../../src/data/projects/types.js";
import type {
  SnippetSuggestion,
  SourceBackedSnippet,
  ValidationReport,
} from "./types.js";

export type SnippetValidationResult = {
  snippet: SourceBackedSnippet;
  valid: boolean;
};

function isValidLineNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value);
}

export function validateAndExtractSnippet(
  suggestion: SnippetSuggestion,
  entries: Record<string, ProjectAnalysisEntry>,
  secretBlockedPaths: Set<string>
): SnippetValidationResult {
  const filePath = suggestion.filePath;
  const entry = entries[filePath];
  const base: SourceBackedSnippet = {
    id: suggestion.id,
    title: suggestion.title,
    filePath,
    startLine: suggestion.startLine,
    endLine: suggestion.endLine,
    reason: suggestion.reason,
    code: "",
    annotations: suggestion.annotations,
    validationStatus: "invalid",
    validationReason: "unknown",
    confidence: suggestion.confidence,
  };

  if (!entry || entry.type !== "file") {
    return {
      valid: false,
      snippet: {
        ...base,
        validationReason: `file not found: ${filePath}`,
      },
    };
  }

  if (secretBlockedPaths.has(filePath)) {
    return {
      valid: false,
      snippet: {
        ...base,
        validationReason: "file blocked by secret detection",
      },
    };
  }

  if (!isValidLineNumber(suggestion.startLine) || !isValidLineNumber(suggestion.endLine)) {
    return {
      valid: false,
      snippet: {
        ...base,
        validationReason: "startLine/endLine must be integers",
      },
    };
  }

  if (suggestion.startLine < 1) {
    return {
      valid: false,
      snippet: {
        ...base,
        validationReason: "startLine must be >= 1",
      },
    };
  }

  if (suggestion.endLine < suggestion.startLine) {
    return {
      valid: false,
      snippet: {
        ...base,
        validationReason: "endLine must be >= startLine",
      },
    };
  }

  if (!entry.code) {
    return {
      valid: false,
      snippet: {
        ...base,
        validationReason: "source code unavailable for file",
      },
    };
  }

  const lines = entry.code.split("\n");
  const totalLines = lines.length;

  if (suggestion.endLine > totalLines) {
    return {
      valid: false,
      snippet: {
        ...base,
        validationReason: `endLine ${suggestion.endLine} exceeds file length ${totalLines}`,
      },
    };
  }

  const snippetLineCount = suggestion.endLine - suggestion.startLine + 1;
  if (snippetLineCount > AI_ANALYSIS_CONFIG.maxSnippetLines) {
    return {
      valid: false,
      snippet: {
        ...base,
        validationReason: `snippet spans ${snippetLineCount} lines (max ${AI_ANALYSIS_CONFIG.maxSnippetLines})`,
      },
    };
  }

  if (suggestion.annotations?.length) {
    for (const annotation of suggestion.annotations) {
      if (
        !isValidLineNumber(annotation.line) ||
        annotation.line < suggestion.startLine ||
        annotation.line > suggestion.endLine
      ) {
        return {
          valid: false,
          snippet: {
            ...base,
            validationReason: `annotation line ${annotation.line} outside snippet range`,
          },
        };
      }
    }
  }

  const extractedCode = lines
    .slice(suggestion.startLine - 1, suggestion.endLine)
    .join("\n");

  if (!extractedCode.trim()) {
    return {
      valid: false,
      snippet: {
        ...base,
        validationReason: "extracted snippet is empty",
      },
    };
  }

  return {
    valid: true,
    snippet: {
      ...base,
      code: extractedCode,
      validationStatus: "valid",
      validationReason: undefined,
    },
  };
}

export function processSnippetSuggestions(
  suggestions: SnippetSuggestion[] | undefined,
  entries: Record<string, ProjectAnalysisEntry>,
  secretBlockedPaths: Set<string>,
  aiCodeById?: Map<string, string>
): {
  snippets: SourceBackedSnippet[];
  validationReport: ValidationReport;
} {
  const warnings: string[] = [];
  const snippets: SourceBackedSnippet[] = [];
  let validSnippets = 0;
  let invalidSnippets = 0;

  if (!suggestions?.length) {
    return {
      snippets: [],
      validationReport: { validSnippets: 0, invalidSnippets: 0, warnings },
    };
  }

  const limited = suggestions.slice(0, AI_ANALYSIS_CONFIG.maxSnippetsPerFile);

  if (suggestions.length > limited.length) {
    warnings.push(
      `Truncated snippet suggestions from ${suggestions.length} to ${limited.length}`
    );
  }

  for (const suggestion of limited) {
    const result = validateAndExtractSnippet(
      suggestion,
      entries,
      secretBlockedPaths
    );

    if (result.valid) {
      validSnippets += 1;
      const aiCode = aiCodeById?.get(suggestion.id);
      if (aiCode && aiCode.trim() !== result.snippet.code.trim()) {
        warnings.push(
          `AI code mismatch for snippet ${suggestion.id} in ${suggestion.filePath}; using source-backed extraction`
        );
      }
      snippets.push(result.snippet);
    } else {
      invalidSnippets += 1;
      snippets.push(result.snippet);
      warnings.push(
        `Invalid snippet ${suggestion.id} (${suggestion.filePath}): ${result.snippet.validationReason}`
      );
    }
  }

  return {
    snippets,
    validationReport: {
      validSnippets,
      invalidSnippets,
      warnings,
    },
  };
}

export function collectSecretBlockedPaths(
  entries: Record<string, ProjectAnalysisEntry>
): Set<string> {
  const blocked = new Set<string>();
  for (const [path, entry] of Object.entries(entries)) {
    if (entry.type === "file" && entry.code && isCodeBlockedForAi(entry.code).blocked) {
      blocked.add(path);
    }
  }
  return blocked;
}
