import fs from "node:fs";
import path from "node:path";
import { getRepoRoot, isSnapshotTmpPath } from "./paths.js";
import { getSupabaseAdmin } from "./supabaseAdmin.js";

export type CleanupStuckJobsOptions = {
  projectSlug?: string;
  thresholdMinutes?: number;
  apply?: boolean;
};

export type CleanupStuckJobsResult = {
  stuckJobs: Array<{ id: string; projectSlug: string | null; startedAt: string | null }>;
  cleanedTmpDirs: string[];
};

const STUCK_ERROR_MESSAGE =
  "Marked as aborted by cleanup because job was stuck.";

export function removeTmpDir(relativePath: string): boolean {
  if (!isSnapshotTmpPath(relativePath)) {
    throw new Error(`Refusing to remove non-tmp snapshot path: ${relativePath}`);
  }

  const absolutePath = path.join(getRepoRoot(), relativePath);
  if (!fs.existsSync(absolutePath)) {
    return false;
  }

  fs.rmSync(absolutePath, { recursive: true, force: true });
  return true;
}

function extractTmpPathFromSummary(summary: unknown): string | null {
  if (!summary || typeof summary !== "object") {
    return null;
  }

  const tmpPath = (summary as { tmpPath?: unknown }).tmpPath;
  return typeof tmpPath === "string" ? tmpPath : null;
}

export async function cleanupStuckImportJobs(
  options: CleanupStuckJobsOptions = {}
): Promise<CleanupStuckJobsResult> {
  const thresholdMinutes = options.thresholdMinutes ?? 30;
  const apply = options.apply ?? false;
  const cutoff = new Date(Date.now() - thresholdMinutes * 60 * 1000).toISOString();
  const supabase = getSupabaseAdmin();

  let query = supabase
    .from("import_jobs")
    .select("id, project_slug, started_at, summary")
    .eq("status", "running")
    .lt("started_at", cutoff);

  if (options.projectSlug) {
    query = query.eq("project_slug", options.projectSlug);
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(`Failed to query stuck import jobs: ${error.message}`);
  }

  const stuckJobs = (data ?? []).map((row) => ({
    id: row.id as string,
    projectSlug: (row.project_slug as string | null) ?? null,
    startedAt: (row.started_at as string | null) ?? null,
    summary: row.summary,
  }));

  const cleanedTmpDirs: string[] = [];

  for (const job of stuckJobs) {
    const tmpPath = extractTmpPathFromSummary(job.summary);
    if (tmpPath) {
      if (apply) {
        if (removeTmpDir(tmpPath)) {
          cleanedTmpDirs.push(tmpPath);
        }
      } else {
        cleanedTmpDirs.push(tmpPath);
      }
    }

    if (apply) {
      const { error: updateError } = await supabase
        .from("import_jobs")
        .update({
          status: "aborted",
          finished_at: new Date().toISOString(),
          error_message: STUCK_ERROR_MESSAGE,
        })
        .eq("id", job.id);

      if (updateError) {
        throw new Error(
          `Failed to mark stuck import job ${job.id} as aborted: ${updateError.message}`
        );
      }
    }
  }

  return {
    stuckJobs: stuckJobs.map(({ id, projectSlug, startedAt }) => ({
      id,
      projectSlug,
      startedAt,
    })),
    cleanedTmpDirs,
  };
}

export async function markImportJobStatus(
  jobId: string,
  status: "failed" | "aborted",
  errorMessage: string
): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("import_jobs")
    .update({
      status,
      finished_at: new Date().toISOString(),
      error_message: errorMessage,
    })
    .eq("id", jobId);

  if (error) {
    throw new Error(`Failed to update import job ${jobId}: ${error.message}`);
  }
}
