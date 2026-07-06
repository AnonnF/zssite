import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { AiDraft } from "./ai-draft-types";

export type { AiDraft, AiDraftEntry, AiDraftProjectAnalysis } from "./ai-draft-types";

const dataDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "ai-drafts"
);

export function loadAiDraftForReview(projectId: string): AiDraft | null {
  const filePath = path.join(dataDir, `${projectId}.ai-draft.json`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw) as AiDraft;
}
