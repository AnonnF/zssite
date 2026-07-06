import type { AiDraft } from "./types.js";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function validateEntry(value: unknown, path: string, errors: string[]): void {
  if (!isRecord(value)) {
    errors.push(`entries["${path}"] must be an object`);
    return;
  }

  if (typeof value.path !== "string") {
    errors.push(`entries["${path}"].path must be a string`);
  }

  if (value.type !== "file" && value.type !== "folder") {
    errors.push(`entries["${path}"].type must be "file" or "folder"`);
  }
}

function validateSelectionReport(value: unknown, errors: string[]): void {
  if (!isRecord(value)) {
    errors.push("selectionReport must be an object");
    return;
  }
  if (!Array.isArray(value.selectedFiles)) {
    errors.push("selectionReport.selectedFiles must be an array");
  }
  if (!Array.isArray(value.skippedFiles)) {
    errors.push("selectionReport.skippedFiles must be an array");
  }
}

function validateValidationReport(value: unknown, errors: string[]): void {
  if (!isRecord(value)) {
    errors.push("validationReport must be an object");
    return;
  }
  if (typeof value.validSnippets !== "number") {
    errors.push("validationReport.validSnippets must be a number");
  }
  if (typeof value.invalidSnippets !== "number") {
    errors.push("validationReport.invalidSnippets must be a number");
  }
}

export function validateAiDraft(
  raw: unknown,
  expectedProjectId: string
): { draft: AiDraft; errors: string[] } {
  const errors: string[] = [];

  if (!isRecord(raw)) {
    return { draft: raw as AiDraft, errors: ["Root must be a JSON object"] };
  }

  if (typeof raw.projectId !== "string") {
    errors.push("projectId must be a string");
  } else if (raw.projectId !== expectedProjectId) {
    errors.push(`projectId mismatch: expected "${expectedProjectId}", got "${raw.projectId}"`);
  }

  if (typeof raw.generatedAt !== "string") {
    errors.push("generatedAt must be a string");
  }

  if (raw.source !== "ai-draft") {
    errors.push('source must be "ai-draft"');
  }

  if (raw.provider !== "deepseek") {
    errors.push('provider must be "deepseek"');
  }

  if (typeof raw.model !== "string") {
    errors.push("model must be a string");
  }

  if (raw.confidence !== "draft") {
    errors.push('confidence must be "draft"');
  }

  if (!isRecord(raw.projectAnalysis)) {
    errors.push("projectAnalysis must be an object");
  }

  if (!isRecord(raw.entries)) {
    errors.push("entries must be an object");
  } else {
    for (const [path, entry] of Object.entries(raw.entries)) {
      validateEntry(entry, path, errors);
    }
  }

  if (!isStringArray(raw.warnings)) {
    errors.push("warnings must be a string array");
  }

  validateSelectionReport(raw.selectionReport, errors);
  validateValidationReport(raw.validationReport, errors);

  return { draft: raw as AiDraft, errors };
}

export function parseJsonResponse(text: string): unknown {
  const trimmed = text.trim();

  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  const jsonText = fenced ? fenced[1].trim() : trimmed;

  return JSON.parse(jsonText);
}
