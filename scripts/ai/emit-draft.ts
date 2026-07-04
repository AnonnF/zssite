import fs from "node:fs";
import path from "node:path";
import type { AiDraft, SelectionReport } from "./types.js";
import { getRepoRoot } from "./config.js";

function getAiDraftsDir(): string {
  return path.join(getRepoRoot(), "src/data/projects/ai-drafts");
}

function ensureDir(dir: string): void {
  fs.mkdirSync(dir, { recursive: true });
}

export function emitPromptDebug(projectId: string, content: string): string {
  const debugDir = path.join(getAiDraftsDir(), "debug");
  ensureDir(debugDir);
  const outputPath = path.join(debugDir, `${projectId}.prompt.md`);
  fs.writeFileSync(outputPath, content, "utf8");
  return outputPath;
}

export function emitSelectionDebug(
  projectId: string,
  report: SelectionReport
): string {
  const debugDir = path.join(getAiDraftsDir(), "debug");
  ensureDir(debugDir);
  const outputPath = path.join(debugDir, `${projectId}.selection.json`);
  fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  return outputPath;
}

export function emitRawDebug(projectId: string, raw: string): string {
  const debugDir = path.join(getAiDraftsDir(), "debug");
  ensureDir(debugDir);
  const outputPath = path.join(debugDir, `${projectId}.raw.txt`);
  fs.writeFileSync(outputPath, raw, "utf8");
  return outputPath;
}

export function emitAiDraft(draft: AiDraft): string {
  const draftsDir = getAiDraftsDir();
  ensureDir(draftsDir);
  const outputPath = path.join(draftsDir, `${draft.projectId}.ai-draft.json`);
  fs.writeFileSync(outputPath, `${JSON.stringify(draft, null, 2)}\n`, "utf8");
  return outputPath;
}
