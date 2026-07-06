import type { AiDraft } from "../ai-draft-types";
import readAnyAiDraft from "./read-any.ai-draft.json";
import resumeJdMatcherAiDraft from "./resume-jd-matcher.ai-draft.json";
import waccCompilerAiDraft from "./wacc-compiler.ai-draft.json";

export const aiDraftRegistry: Record<string, AiDraft> = {
  "read-any": readAnyAiDraft as AiDraft,
  "resume-jd-matcher": resumeJdMatcherAiDraft as AiDraft,
  "wacc-compiler": waccCompilerAiDraft as AiDraft,
};

export function getAiDraft(projectId: string): AiDraft | undefined {
  return aiDraftRegistry[projectId];
}
