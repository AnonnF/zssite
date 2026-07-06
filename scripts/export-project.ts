#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { getRepoRoot, getSnapshotRelativePath } from "./lib/paths.js";
import {
  getLatestSnapshotForProject,
  getProjectBySlug,
} from "./lib/supabaseProject.js";
import { getSupabaseAdmin } from "./lib/supabaseAdmin.js";

function printUsage(): void {
  console.log(`Usage:
  npm run export:project -- <projectId>

Examples:
  npm run export:project -- resume-jd-matcher`);
}

function parseProjectId(argv: string[]): string | null {
  const args = argv.filter((arg) => arg !== "--");
  if (args.length === 0 || args[0] === "--help" || args[0] === "-h") {
    return null;
  }
  return args[0];
}

function assertPathExists(repoRoot: string, relativePath: string, label: string): void {
  const absolutePath = path.join(repoRoot, relativePath);
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Missing ${label}: ${relativePath}`);
  }
}

async function main(): Promise<void> {
  const projectId = parseProjectId(process.argv.slice(2));
  if (!projectId) {
    printUsage();
    process.exit(projectId === null && process.argv.includes("--help") ? 0 : 1);
  }

  const repoRoot = getRepoRoot();
  const generatedPath = `src/data/projects/generated/${projectId}.generated.ts`;
  const aiDraftPath = `src/data/projects/ai-drafts/${projectId}.ai-draft.json`;
  const snapshotPath = getSnapshotRelativePath(projectId);

  assertPathExists(repoRoot, generatedPath, "generated analysis");
  assertPathExists(repoRoot, snapshotPath, "project snapshot");

  let hasAiDraft = false;
  if (fs.existsSync(path.join(repoRoot, aiDraftPath))) {
    hasAiDraft = true;
  }

  getSupabaseAdmin();
  const project = await getProjectBySlug(projectId);
  if (!project) {
    throw new Error(
      `No Supabase project found for "${projectId}". Run import:github first.`
    );
  }

  const snapshot = await getLatestSnapshotForProject(project.id);
  const supabase = getSupabaseAdmin();
  const version = new Date().toISOString();
  const exportPaths = [generatedPath, snapshotPath];
  if (hasAiDraft) {
    exportPaths.push(aiDraftPath);
  }

  const metadata = {
    generatedPath,
    snapshotPath,
    aiDraftPath: hasAiDraft ? aiDraftPath : null,
    hasAiDraft,
    note: "Static export recorded; manual analysis merge is still required for frontend production data.",
  };

  const { data: exportRow, error: exportError } = await supabase
    .from("published_exports")
    .insert({
      project_id: project.id,
      snapshot_id: snapshot?.id ?? null,
      export_path: generatedPath,
      version,
      status: "published",
      metadata,
    })
    .select("id")
    .single();

  if (exportError || !exportRow) {
    throw new Error(
      `Failed to insert published_exports row: ${exportError?.message ?? "unknown error"}`
    );
  }

  const nextStatus = hasAiDraft ? "needs-review" : "analyzing";
  const { error: projectError } = await supabase
    .from("projects")
    .update({ status: nextStatus })
    .eq("id", project.id);

  if (projectError) {
    throw new Error(`Failed to update project status: ${projectError.message}`);
  }

  console.log(`Exported project artifacts for ${projectId}`);
  console.log(`Supabase project id: ${project.id}`);
  console.log(`Snapshot id: ${snapshot?.id ?? "none"}`);
  console.log(`Published export id: ${exportRow.id}`);
  console.log(`Project status: ${nextStatus}`);
  console.log("Recorded paths:");
  for (const exportPath of exportPaths) {
    console.log(`  - ${exportPath}`);
  }
  console.log("");
  console.log("Next steps:");
  console.log(`  Review ai-draft and curate src/data/projects/${projectId}.analysis.ts`);
  console.log(`  npm run generate:highlights -- ${projectId}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
