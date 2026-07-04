#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { cleanupStuckImportJobs, removeTmpDir } from "./lib/importJobCleanup.js";
import { getRepoRoot } from "./lib/paths.js";
import { getSupabaseAdmin } from "./lib/supabaseAdmin.js";
import { getProjectBySlug } from "./lib/supabaseProject.js";

type CleanupOptions = {
  projectId?: string;
  apply: boolean;
  tmpMaxAgeHours: number;
};

function printUsage(): void {
  console.log(`Usage:
  npm run cleanup:imports -- [projectId] [options]
  npm run cleanup:imports -- --projectId <slug> [options]

Options:
  --apply               Apply cleanup actions (default is dry-run)
  --tmp-max-age-hours   Expired tmp dir threshold in hours (default: 24)

Examples:
  npm run cleanup:imports -- resume-jd-matcher
  npm run cleanup:imports -- --projectId resume-jd-matcher --apply`);
}

function readFlagValue(args: string[], flag: string): string | undefined {
  const index = args.indexOf(flag);
  if (index === -1) return undefined;
  return args[index + 1];
}

function parseArgs(argv: string[]): CleanupOptions | null {
  const args = argv.filter((arg) => arg !== "--");

  if (args.length === 0 || args[0] === "--help" || args[0] === "-h") {
    printUsage();
    process.exit(args.length === 0 ? 1 : 0);
  }

  const projectId =
    readFlagValue(args, "--projectId") ??
    args.find((arg) => !arg.startsWith("--"));

  const tmpMaxAgeHoursRaw = readFlagValue(args, "--tmp-max-age-hours");
  const tmpMaxAgeHours = tmpMaxAgeHoursRaw ? Number(tmpMaxAgeHoursRaw) : 24;

  if (!Number.isFinite(tmpMaxAgeHours) || tmpMaxAgeHours <= 0) {
    console.error("Invalid --tmp-max-age-hours value.");
    process.exit(1);
  }

  return {
    projectId,
    apply: args.includes("--apply"),
    tmpMaxAgeHours,
  };
}

function listExpiredTmpDirs(projectId: string | undefined, maxAgeHours: number): string[] {
  const repoRoot = getRepoRoot();
  const tmpRoot = path.join(repoRoot, "project-snapshots", ".tmp");
  if (!fs.existsSync(tmpRoot)) {
    return [];
  }

  const cutoffMs = Date.now() - maxAgeHours * 60 * 60 * 1000;
  const expired: string[] = [];

  for (const entry of fs.readdirSync(tmpRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;

    const relativePath = `project-snapshots/.tmp/${entry.name}`;
    if (projectId && !entry.name.startsWith(`${projectId}-`)) {
      continue;
    }

    const absolutePath = path.join(tmpRoot, entry.name);
    const stats = fs.statSync(absolutePath);
    if (stats.mtimeMs <= cutoffMs) {
      expired.push(relativePath);
    }
  }

  return expired.sort();
}

async function findOrphanSnapshots(projectId: string | undefined): Promise<
  Array<{ id: string; projectSlug: string | null; commitSha: string | null; active: boolean }>
> {
  const supabase = getSupabaseAdmin();

  let projectUuid: string | undefined;
  if (projectId) {
    const project = await getProjectBySlug(projectId);
    if (!project) {
      console.warn(`No Supabase project found for slug "${projectId}".`);
      return [];
    }
    projectUuid = project.id;
  }

  let query = supabase
    .from("repo_snapshots")
    .select("id, project_id, commit_sha, active, job_id, snapshot_status, projects(slug)")
    .eq("snapshot_status", "imported");

  if (projectUuid) {
    query = query.eq("project_id", projectUuid);
  }

  const { data, error } = await query;
  if (error) {
    if (error.message.includes("active")) {
      throw new Error(
        `${error.message}\nApply migration supabase/migrations/20260704190000_import_cleanup_active_snapshot.sql with: npx supabase db push`
      );
    }
    throw new Error(`Failed to query repo snapshots: ${error.message}`);
  }

  const orphanCandidates: Array<{
    id: string;
    projectSlug: string | null;
    commitSha: string | null;
    active: boolean;
  }> = [];

  for (const row of data ?? []) {
    if (row.active) continue;

    const jobId = row.job_id as string | null;
    if (!jobId) {
      orphanCandidates.push({
        id: row.id as string,
        projectSlug: ((row.projects as { slug?: string } | null)?.slug ?? null) as
          | string
          | null,
        commitSha: (row.commit_sha as string | null) ?? null,
        active: Boolean(row.active),
      });
      continue;
    }

    const { data: job, error: jobError } = await supabase
      .from("import_jobs")
      .select("status")
      .eq("id", jobId)
      .maybeSingle();

    if (jobError) {
      throw new Error(`Failed to query import job ${jobId}: ${jobError.message}`);
    }

    if (!job || job.status !== "completed") {
      orphanCandidates.push({
        id: row.id as string,
        projectSlug: ((row.projects as { slug?: string } | null)?.slug ?? null) as
          | string
          | null,
        commitSha: (row.commit_sha as string | null) ?? null,
        active: Boolean(row.active),
      });
    }
  }

  return orphanCandidates;
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  if (!options) {
    process.exit(1);
  }

  getSupabaseAdmin();

  console.log(options.apply ? "Import cleanup (apply mode)" : "Import cleanup dry run");

  const stuck = await cleanupStuckImportJobs({
    projectSlug: options.projectId,
    apply: options.apply,
  });

  console.log("");
  console.log(`Stuck import jobs: ${stuck.stuckJobs.length}`);
  for (const job of stuck.stuckJobs) {
    console.log(
      `  - ${job.id} slug=${job.projectSlug ?? "unknown"} started=${job.startedAt ?? "unknown"}`
    );
  }

  const expiredTmpDirs = listExpiredTmpDirs(options.projectId, options.tmpMaxAgeHours);
  console.log("");
  console.log(`Expired tmp directories: ${expiredTmpDirs.length}`);
  for (const tmpDir of expiredTmpDirs) {
    console.log(`  - ${tmpDir}`);
    if (options.apply) {
      removeTmpDir(tmpDir);
      console.log("    removed");
    }
  }

  if (options.apply && stuck.cleanedTmpDirs.length > 0) {
    console.log("");
    console.log("Tmp dirs cleaned from stuck jobs:");
    for (const tmpDir of stuck.cleanedTmpDirs) {
      console.log(`  - ${tmpDir}`);
    }
  }

  const orphanSnapshots = await findOrphanSnapshots(options.projectId);
  console.log("");
  console.log(`Orphan/inactive snapshots: ${orphanSnapshots.length}`);
  for (const snapshot of orphanSnapshots) {
    console.log(
      `  - ${snapshot.id} slug=${snapshot.projectSlug ?? "unknown"} commit=${snapshot.commitSha ?? "unknown"}`
    );
  }

  if (options.apply && orphanSnapshots.length > 0) {
    const supabase = getSupabaseAdmin();
    for (const snapshot of orphanSnapshots) {
      const { error } = await supabase
        .from("repo_snapshots")
        .update({ active: false })
        .eq("id", snapshot.id);

      if (error) {
        throw new Error(
          `Failed to mark orphan snapshot ${snapshot.id} inactive: ${error.message}`
        );
      }
      console.log(`    marked inactive: ${snapshot.id}`);
    }
  }

  if (!options.apply) {
    console.log("");
    console.log("Dry run only. Re-run with --apply to perform cleanup actions.");
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
