import type { AiDraft } from "../ai-draft-types";
import resumeJdMatcherAiDraft from "./resume-jd-matcher.ai-draft.json";

export const aiDraftRegistry: Record<string, AiDraft> = {
  "resume-jd-matcher": resumeJdMatcherAiDraft as AiDraft,
};

export function getAiDraft(projectId: string): AiDraft | undefined {
  return aiDraftRegistry[projectId];
}
