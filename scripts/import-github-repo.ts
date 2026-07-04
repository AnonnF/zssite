#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { loadAnalyzerAiConfig } from "./ai/load-analyzer-config.js";
import {
  buildGitHubBlobUrl,
  buildRawGitHubUrl,
  fetchGitHubRepoMetadata,
  warnIfNoGitHubToken,
  type GitHubRepoMetadata,
} from "./lib/github/fetchRepo.js";
import { downloadGitHubFileToDisk } from "./lib/github/downloadFile.js";
import { parseGitHubRepoInput } from "./lib/github/parseRepoUrl.js";
import { scoreImportCandidate } from "./lib/import-candidate-scoring.js";
import {
  classifyGitHubTreeEntry,
  sortDownloadPaths,
  type ImportTreeClassification,
} from "./lib/import-tree-filter.js";
import { loadScannerConfig } from "./lib/project-analysis/config.js";
import { resolveLanguageFromPath } from "./lib/project-analysis/language.js";
import {
  getRepoRoot,
  getSnapshotRelativePath,
  getSnapshotRoot,
} from "./lib/paths.js";
import { getSupabaseAdmin } from "./lib/supabaseAdmin.js";
import type { ProjectTemplateId } from "../src/data/projects/types.js";
import { projectTemplates } from "../src/data/projects/templates.js";

type CliOptions = {
  repoInput: string;
  projectId: string;
  branch?: string;
  templateId?: ProjectTemplateId;
  title?: string;
  dryRun: boolean;
};

type FileRecord = {
  item: ImportTreeClassification;
  scoring: ReturnType<typeof scoreImportCandidate>;
};

type ImportSummary = {
  owner: string;
  repo: string;
  projectId: string;
  defaultBranch: string;
  commitSha: string;
  filesInTree: number;
  filesIncluded: number;
  filesSkipped: number;
  foldersIncluded: number;
  candidates: number;
  downloaded: number;
  downloadSkippedTooLarge: number;
  downloadSkippedSecrets: number;
  treeTruncated: boolean;
  candidatePaths: string[];
};

const repoRoot = getRepoRoot();

function printUsage(): void {
  console.log(`Usage:
  npm run import:github -- <repo-url-or-slug> --projectId <slug> [options]

Options:
  --projectId, --slug   Project slug (required)
  --branch              Branch name (default: repo default branch)
  --templateId          Project template id
  --title               Project title
  --dry-run             Preview import without writing Supabase or snapshots

Examples:
  npm run import:github -- https://github.com/owner/repo --projectId bridge-talk
  npm run import:github -- owner/repo --projectId bridge-talk --dry-run`);
}

function parseArgs(argv: string[]): CliOptions {
  const args = argv.filter((arg) => arg !== "--");
  const flags = new Set<string>();
  const positional: string[] = [];

  for (const arg of args) {
    if (arg.startsWith("--")) {
      flags.add(arg);
      continue;
    }
    positional.push(arg);
  }

  if (positional.length === 0 || flags.has("--help") || flags.has("-h")) {
    printUsage();
    process.exit(positional.length === 0 ? 1 : 0);
  }

  const projectId = readFlagValue(args, "--projectId") ?? readFlagValue(args, "--slug");
  if (!projectId) {
    console.error("Missing required flag: --projectId (or --slug)");
    printUsage();
    process.exit(1);
  }

  const templateIdRaw = readFlagValue(args, "--templateId");
  let templateId: ProjectTemplateId | undefined;
  if (templateIdRaw) {
    if (!(templateIdRaw in projectTemplates)) {
      console.error(
        `Unknown templateId "${templateIdRaw}". Valid values: ${Object.keys(projectTemplates).join(", ")}`
      );
      process.exit(1);
    }
    templateId = templateIdRaw as ProjectTemplateId;
  }

  return {
    repoInput: positional[0],
    projectId,
    branch: readFlagValue(args, "--branch"),
    templateId,
    title: readFlagValue(args, "--title"),
    dryRun: flags.has("--dry-run"),
  };
}

function readFlagValue(args: string[], flag: string): string | undefined {
  const index = args.indexOf(flag);
  if (index === -1) return undefined;
  return args[index + 1];
}

function buildFileRecords(
  metadata: GitHubRepoMetadata,
  options: CliOptions
): { fileRecords: FileRecord[]; summary: ImportSummary; downloadQueue: string[] } {
  const scannerConfig = loadScannerConfig(repoRoot, options.projectId);
  const analyzerConfig = loadAnalyzerAiConfig(options.projectId);

  for (const warning of analyzerConfig.warnings) {
    console.warn(`Warning: ${warning}`);
  }

  let filesIncluded = 0;
  let filesSkipped = 0;
  let foldersIncluded = 0;
  let candidates = 0;
  const candidatePaths: string[] = [];
  const downloadQueue: string[] = [];

  const fileRecords = metadata.tree.map((entry) => {
    const item = classifyGitHubTreeEntry(entry, scannerConfig);

    if (item.included) {
      if (item.type === "folder") {
        foldersIncluded += 1;
      } else {
        filesIncluded += 1;
      }
    } else {
      filesSkipped += 1;
    }

    const scoring = scoreImportCandidate(item.path, {
      templateId: options.templateId,
      priorityPaths: analyzerConfig.config.priorityPaths,
      priorityPatterns: analyzerConfig.config.priorityPatterns,
      entryType: item.type,
    });

    if (scoring.isCandidate) {
      candidates += 1;
      if (candidatePaths.length < 30) {
        candidatePaths.push(item.path);
      }
    }

    if (item.included && item.type === "file" && item.shouldDownload) {
      downloadQueue.push(item.path);
    }

    return { item, scoring };
  });

  const summary: ImportSummary = {
    owner: metadata.owner,
    repo: metadata.repo,
    projectId: options.projectId,
    defaultBranch: metadata.defaultBranch,
    commitSha: metadata.latestCommitSha,
    filesInTree: metadata.tree.length,
    filesIncluded,
    filesSkipped,
    foldersIncluded,
    candidates,
    downloaded: 0,
    downloadSkippedTooLarge: 0,
    downloadSkippedSecrets: 0,
    treeTruncated: metadata.treeTruncated,
    candidatePaths,
  };

  return {
    fileRecords,
    summary,
    downloadQueue: sortDownloadPaths(downloadQueue),
  };
}

async function downloadSnapshotFiles(
  metadata: GitHubRepoMetadata,
  options: CliOptions,
  downloadQueue: string[],
  classifications: ImportTreeClassification[]
): Promise<Pick<
  ImportSummary,
  "downloaded" | "downloadSkippedTooLarge" | "downloadSkippedSecrets"
>> {
  const snapshotRoot = getSnapshotRoot(repoRoot, options.projectId);
  const scannerConfig = loadScannerConfig(repoRoot, options.projectId);
  const maxFileSizeBytes = scannerConfig.maxFileSizeKb * 1024;

  if (fs.existsSync(snapshotRoot)) {
    console.warn(
      `Warning: snapshot directory already exists at ${getSnapshotRelativePath(options.projectId)}; new files will be merged/overwritten.`
    );
  }

  let downloaded = 0;
  let downloadSkippedTooLarge = 0;
  let downloadSkippedSecrets = 0;

  for (const filePath of downloadQueue) {
    const classification = classifications.find((entry) => entry.path === filePath);
    if (!classification) continue;

    const rawUrl = buildRawGitHubUrl(
      metadata.owner,
      metadata.repo,
      metadata.latestCommitSha,
      filePath
    );
    const destinationPath = path.join(snapshotRoot, filePath);

    try {
      const result = await downloadGitHubFileToDisk({
        rawUrl,
        destinationPath,
        maxBytes: maxFileSizeBytes,
      });

      if (result.downloaded) {
        downloaded += 1;
      } else if (result.blockedBySecrets) {
        downloadSkippedSecrets += 1;
        if (fs.existsSync(destinationPath)) {
          fs.unlinkSync(destinationPath);
        }
      } else {
        downloadSkippedTooLarge += 1;
      }
    } catch (error) {
      console.warn(
        `Warning: failed to download ${filePath}: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  return { downloaded, downloadSkippedTooLarge, downloadSkippedSecrets };
}

function printDryRunSummary(summary: ImportSummary, repoUrl: string): void {
  console.log("Dry-run GitHub import preview");
  console.log(`Repo: ${summary.owner}/${summary.repo}`);
  console.log(`Project slug: ${summary.projectId}`);
  console.log(`Default branch: ${summary.defaultBranch}`);
  console.log(`Commit: ${summary.commitSha}`);
  console.log(`Repo URL: ${repoUrl}`);
  console.log(`Files in tree: ${summary.filesInTree}`);
  console.log(`Files included: ${summary.filesIncluded}`);
  console.log(`Folders included: ${summary.foldersIncluded}`);
  console.log(`Files skipped: ${summary.filesSkipped}`);
  console.log(`Candidate paths: ${summary.candidates}`);
  if (summary.treeTruncated) {
    console.log("Warning: tree truncated — import may be incomplete.");
  }
  if (summary.candidatePaths.length > 0) {
    console.log("Sample candidate paths:");
    for (const candidatePath of summary.candidatePaths) {
      console.log(`  - ${candidatePath}`);
    }
  }
  console.log("Dry-run complete. No Supabase rows or snapshot files were written.");
}

function printSuccessSummary(options: {
  summary: ImportSummary;
  projectId: string;
  supabaseProjectId: string;
  snapshotId: string;
}): void {
  const { summary, projectId, supabaseProjectId, snapshotId } = options;

  console.log(`Imported GitHub repo: ${summary.owner}/${summary.repo}`);
  console.log(`Project slug: ${projectId}`);
  console.log(`Default branch: ${summary.defaultBranch}`);
  console.log(`Commit: ${summary.commitSha}`);
  console.log(`Files in tree: ${summary.filesInTree}`);
  console.log(`Files included: ${summary.filesIncluded}`);
  console.log(`Files skipped: ${summary.filesSkipped}`);
  console.log(`Files downloaded: ${summary.downloaded}`);
  console.log(`Snapshot path: ${getSnapshotRelativePath(projectId)}`);
  console.log(`Supabase project id: ${supabaseProjectId}`);
  console.log(`Snapshot id: ${snapshotId}`);
  console.log("Next steps:");
  console.log(`  npm run generate:analysis -- ${projectId}`);
  console.log(`  npm run generate:ai-analysis -- ${projectId} --dry-run`);
}

async function persistToSupabase(
  options: CliOptions,
  summary: ImportSummary,
  metadata: GitHubRepoMetadata,
  fetchMeta: Awaited<ReturnType<typeof fetchGitHubRepoMetadata>>,
  fileRecords: FileRecord[]
): Promise<{ projectId: string; snapshotId: string }> {
  const supabase = getSupabaseAdmin();
  const repoUrl = metadata.htmlUrl;
  const title = options.title ?? `${metadata.owner}/${metadata.repo}`;

  const { data: jobInsert, error: jobInsertError } = await supabase
    .from("import_jobs")
    .insert({
      repo_url: repoUrl,
      project_slug: options.projectId,
      status: "pending",
    })
    .select("id")
    .single();

  if (jobInsertError || !jobInsert) {
    throw new Error(`Failed to create import job: ${jobInsertError?.message ?? "unknown error"}`);
  }

  const jobId = jobInsert.id as string;

  await supabase
    .from("import_jobs")
    .update({
      status: "running",
      started_at: new Date().toISOString(),
    })
    .eq("id", jobId);

  try {
    const { data: projectRow, error: projectError } = await supabase
      .from("projects")
      .upsert(
        {
          slug: options.projectId,
          title,
          description: metadata.description,
          repo_url: repoUrl,
          github_owner: metadata.owner,
          github_repo: metadata.repo,
          default_branch: metadata.defaultBranch,
          template_id: options.templateId ?? null,
          status: "imported",
        },
        { onConflict: "slug" }
      )
      .select("id")
      .single();

    if (projectError || !projectRow) {
      throw new Error(
        `Failed to upsert project: ${projectError?.message ?? "unknown error"}`
      );
    }

    const supabaseProjectId = projectRow.id as string;

    await supabase
      .from("import_jobs")
      .update({ project_id: supabaseProjectId })
      .eq("id", jobId);

    const snapshotMetadata = {
      treeTruncated: metadata.treeTruncated,
      rateLimitRemaining: fetchMeta.rateLimitRemaining,
      rateLimitLimit: fetchMeta.rateLimitLimit,
      foldersIncluded: summary.foldersIncluded,
      candidates: summary.candidates,
      downloaded: summary.downloaded,
      downloadSkippedTooLarge: summary.downloadSkippedTooLarge,
      downloadSkippedSecrets: summary.downloadSkippedSecrets,
    };

    const { data: snapshotRow, error: snapshotError } = await supabase
      .from("repo_snapshots")
      .insert({
        project_id: supabaseProjectId,
        source: "github",
        repo_url: repoUrl,
        branch: metadata.defaultBranch,
        commit_sha: metadata.latestCommitSha,
        tree_sha: metadata.treeSha,
        file_count: summary.filesInTree,
        included_file_count: summary.filesIncluded + summary.foldersIncluded,
        skipped_file_count: summary.filesSkipped,
        snapshot_status: "imported",
        metadata: snapshotMetadata,
      })
      .select("id")
      .single();

    if (snapshotError || !snapshotRow) {
      throw new Error(
        `Failed to create repo snapshot: ${snapshotError?.message ?? "unknown error"}`
      );
    }

    const snapshotId = snapshotRow.id as string;

    const rows = fileRecords.map(({ item, scoring }) => ({
      project_id: supabaseProjectId,
      snapshot_id: snapshotId,
      path: item.path,
      name: item.name,
      type: item.type,
      language: item.type === "file" ? resolveLanguageFromPath(item.path) : null,
      size_bytes: item.sizeBytes ?? null,
      github_blob_sha: item.githubBlobSha ?? null,
      github_url:
        item.type === "file"
          ? buildGitHubBlobUrl(
              metadata.owner,
              metadata.repo,
              metadata.latestCommitSha,
              item.path
            )
          : null,
      raw_url:
        item.type === "file"
          ? buildRawGitHubUrl(
              metadata.owner,
              metadata.repo,
              metadata.latestCommitSha,
              item.path
            )
          : null,
      is_too_large: item.isTooLarge,
      is_binary: item.isBinary,
      is_candidate: scoring.isCandidate,
      score: scoring.score,
      score_reasons: scoring.reasons,
      review_status: "generated",
      metadata: item.skippedReason ? { skippedReason: item.skippedReason } : {},
    }));

    const chunkSize = 500;
    for (let i = 0; i < rows.length; i += chunkSize) {
      const chunk = rows.slice(i, i + chunkSize);
      const { error: filesError } = await supabase.from("project_files").insert(chunk);
      if (filesError) {
        throw new Error(`Failed to insert project_files: ${filesError.message}`);
      }
    }

    await supabase
      .from("import_jobs")
      .update({
        status: "completed",
        finished_at: new Date().toISOString(),
        summary: {
          ...summary,
          snapshotPath: getSnapshotRelativePath(options.projectId),
          supabaseProjectId,
          snapshotId,
        },
      })
      .eq("id", jobId);

    return { projectId: supabaseProjectId, snapshotId };
  } catch (error) {
    await supabase
      .from("import_jobs")
      .update({
        status: "failed",
        finished_at: new Date().toISOString(),
        error_message: error instanceof Error ? error.message : String(error),
      })
      .eq("id", jobId);
    throw error;
  }
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));

  if (!options.dryRun) {
    getSupabaseAdmin();
  }

  warnIfNoGitHubToken();

  const parsed = parseGitHubRepoInput(options.repoInput);
  const fetchResult = await fetchGitHubRepoMetadata(parsed, options.branch);
  const metadata = fetchResult.metadata;

  const { fileRecords, summary, downloadQueue } = buildFileRecords(metadata, options);

  if (options.dryRun) {
    summary.downloaded = downloadQueue.length;
    printDryRunSummary(summary, parsed.htmlUrl);
    return;
  }

  try {
    const downloadStats = await downloadSnapshotFiles(
      metadata,
      options,
      downloadQueue,
      fileRecords.map((record) => record.item)
    );
    summary.downloaded = downloadStats.downloaded;
    summary.downloadSkippedTooLarge = downloadStats.downloadSkippedTooLarge;
    summary.downloadSkippedSecrets = downloadStats.downloadSkippedSecrets;

    const persisted = await persistToSupabase(
      options,
      summary,
      metadata,
      fetchResult,
      fileRecords
    );

    printSuccessSummary({
      summary,
      projectId: options.projectId,
      supabaseProjectId: persisted.projectId,
      snapshotId: persisted.snapshotId,
    });
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

main();
