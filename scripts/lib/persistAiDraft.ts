import type { AiDraft } from "../ai/types.js";
import {
  getLatestSnapshotForProject,
  getProjectBySlug,
} from "./supabaseProject.js";
import { getSupabaseAdmin } from "./supabaseAdmin.js";

export type PersistAiDraftResult = {
  id: string;
  projectId: string;
  snapshotId: string | null;
};

export async function persistAiDraftToSupabase(
  draft: AiDraft
): Promise<PersistAiDraftResult> {
  const project = await getProjectBySlug(draft.projectId);
  if (!project) {
    throw new Error(
      `No Supabase project found for slug "${draft.projectId}". Run import:github first.`
    );
  }

  const snapshot = await getLatestSnapshotForProject(project.id);
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("ai_drafts")
    .insert({
      project_id: project.id,
      snapshot_id: snapshot?.id ?? null,
      provider: draft.provider,
      model: draft.model,
      raw_json: draft,
      selection_report: draft.selectionReport,
      validation_report: draft.validationReport,
      warnings: draft.warnings,
    })
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(
      `Failed to insert ai_drafts row: ${error?.message ?? "unknown error"}`
    );
  }

  return {
    id: data.id as string,
    projectId: project.id,
    snapshotId: snapshot?.id ?? null,
  };
}
