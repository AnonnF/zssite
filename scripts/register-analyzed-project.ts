#!/usr/bin/env node
import { parseGitHubRepoInput } from "./lib/github/parseRepoUrl.js";
import { getRepoRoot } from "./lib/paths.js";
import {
  printRegisterDryRunPreview,
  registerAnalyzedProject,
  toReadableRepoTitle,
} from "./lib/registerAnalyzedProject.js";
import type { ProjectTemplateId } from "../src/data/projects/types.js";
import { projectTemplates } from "../src/data/projects/templates.js";

type RegisterCliOptions = {
  projectId: string;
  templateId?: ProjectTemplateId;
  title?: string;
  description?: string;
  year?: number;
  repoUrl?: string;
  dryRun: boolean;
};

function printUsage(): void {
  console.log(`Usage:
  npm run register:project -- <projectId> [options]

Options:
  --templateId <id>     Project template id
  --title <title>       Project title override
  --description <text>  Project summary override
  --year <number>       Project year override
  --repoUrl <url>       GitHub repo URL for content entry
  --dry-run             Preview changes without writing files

Examples:
  npm run register:project -- resume-jd-matcher --templateId ai-pipeline
  npm run register:project -- test-project --templateId ai-pipeline --dry-run`);
}

function readFlagValue(args: string[], flag: string): string | undefined {
  const index = args.indexOf(flag);
  if (index === -1) return undefined;
  return args[index + 1];
}

function parseArgs(argv: string[]): RegisterCliOptions | null {
  const args = argv.filter((arg) => arg !== "--");

  if (args.length === 0 || args[0] === "--help" || args[0] === "-h") {
    printUsage();
    process.exit(args.length === 0 ? 1 : 0);
  }

  const projectId = args[0];
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

  const yearRaw = readFlagValue(args, "--year");
  const year = yearRaw ? Number(yearRaw) : undefined;
  if (yearRaw && (!Number.isFinite(year) || year! < 1970)) {
    console.error("Invalid --year value.");
    process.exit(1);
  }

  return {
    projectId,
    templateId,
    title: readFlagValue(args, "--title"),
    description: readFlagValue(args, "--description"),
    year,
    repoUrl: readFlagValue(args, "--repoUrl"),
    dryRun: args.includes("--dry-run"),
  };
}

function printResult(result: ReturnType<typeof registerAnalyzedProject>): void {
  console.log("");
  console.log(`Registered project: ${result.projectId}`);
  console.log(
    `  content/projects.ts: ${result.contentUpdated ? "updated" : result.contentSkipped ? "skipped" : "unchanged"}`
  );
  console.log(
    `  projectPublicationFlags.ts: ${result.flagsUpdated ? "updated" : result.flagsSkipped ? "skipped" : "unchanged"}`
  );
  console.log(
    `  ai-drafts/index.ts: ${result.aiDraftUpdated ? "updated" : result.aiDraftSkipped ? "skipped" : "unchanged"}`
  );

  if (result.warnings.length > 0) {
    console.log("");
    console.log("Warnings:");
    for (const warning of result.warnings) {
      console.log(`  - ${warning}`);
    }
  }

  console.log("");
  console.log("Open: /projects/" + result.projectId);
  console.log("Review flag: src/data/projects/projectPublicationFlags.ts");
  console.log(
    `To mark reviewed: npm run review:project -- ${result.projectId} --humanReviewed true`
  );
}

function main(): void {
  const options = parseArgs(process.argv.slice(2));
  if (!options) {
    process.exit(1);
  }

  const repoRoot = getRepoRoot();

  if (options.repoUrl) {
    try {
      const parsed = parseGitHubRepoInput(options.repoUrl);
      options.repoUrl = parsed.htmlUrl;
      options.title =
        options.title ?? toReadableRepoTitle(parsed.repo.replace(/-/g, " "));
    } catch {
      // keep provided repoUrl/title as-is
    }
  }

  if (options.dryRun) {
    printRegisterDryRunPreview(repoRoot, options);
    return;
  }

  const result = registerAnalyzedProject(repoRoot, options);
  printResult(result);
}

main();
