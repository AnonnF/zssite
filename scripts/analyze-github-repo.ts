#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { parseGitHubRepoInput } from "./lib/github/parseRepoUrl.js";
import { getRepoRoot } from "./lib/paths.js";
import { formatNpmCommand, runNpmScript } from "./lib/runNpmScript.js";
import { inferProjectIdFromRepoName } from "../src/lib/github/parseGitHubRepo.js";
import type { ProjectTemplateId } from "../src/data/projects/types.js";
import { projectTemplates } from "../src/data/projects/templates.js";

type AnalyzeOptions = {
  repoInput: string;
  projectId: string;
  templateId?: ProjectTemplateId;
  branch?: string;
  dryRun: boolean;
  skipImport: boolean;
  skipAi: boolean;
  skipExport: boolean;
  skipHighlights: boolean;
  force: boolean;
};

type AnalyzeStep = {
  label: string;
  scriptName: string;
  args: string[];
};

function printUsage(): void {
  console.log(`Usage:
  npm run analyze:github -- <repo-url-or-slug> [options]

Options:
  --projectId, --slug   Project slug (default: inferred from repo name)
  --templateId          Project template id
  --branch              Branch name (passed to import:github)
  --dry-run             Print planned steps without executing
  --skip-import         Skip import:github
  --skip-ai             Skip generate:ai-analysis
  --skip-export         Skip export:project
  --skip-highlights     Skip generate:highlights
  --force               Force re-import even if snapshot exists

Examples:
  npm run analyze:github -- AnonnF/Resume-JD-Matcher --projectId resume-jd-matcher --templateId ai-pipeline
  npm run analyze:github -- https://github.com/owner/repo --dry-run`);
}

function readFlagValue(args: string[], flag: string): string | undefined {
  const index = args.indexOf(flag);
  if (index === -1) return undefined;
  return args[index + 1];
}

function parseArgs(argv: string[]): AnalyzeOptions | null {
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

  const parsed = parseGitHubRepoInput(positional[0]);
  const projectId =
    readFlagValue(args, "--projectId") ??
    readFlagValue(args, "--slug") ??
    inferProjectIdFromRepoName(parsed.repo);

  return {
    repoInput: positional[0],
    projectId,
    templateId,
    branch: readFlagValue(args, "--branch"),
    dryRun: flags.has("--dry-run"),
    skipImport: flags.has("--skip-import"),
    skipAi: flags.has("--skip-ai"),
    skipExport: flags.has("--skip-export"),
    skipHighlights: flags.has("--skip-highlights"),
    force: flags.has("--force"),
  };
}

function buildImportArgs(options: AnalyzeOptions): string[] {
  const args = [options.repoInput, "--projectId", options.projectId];
  if (options.templateId) {
    args.push("--templateId", options.templateId);
  }
  if (options.branch) {
    args.push("--branch", options.branch);
  }
  if (options.force) {
    args.push("--force");
  }
  return args;
}

function buildSteps(options: AnalyzeOptions): AnalyzeStep[] {
  const steps: AnalyzeStep[] = [];

  if (!options.skipImport) {
    steps.push({
      label: "Import GitHub repository",
      scriptName: "import:github",
      args: buildImportArgs(options),
    });
  }

  steps.push({
    label: "Generate project analysis",
    scriptName: "generate:analysis",
    args: [options.projectId],
  });

  if (!options.skipAi) {
    steps.push({
      label: "Generate AI analysis draft",
      scriptName: "generate:ai-analysis",
      args: [options.projectId],
    });
  }

  if (!options.skipExport) {
    steps.push({
      label: "Export project audit record",
      scriptName: "export:project",
      args: [options.projectId],
    });
  }

  if (!options.skipHighlights) {
    steps.push({
      label: "Generate code highlights",
      scriptName: "generate:highlights",
      args: [options.projectId],
    });
  }

  return steps;
}

function readPublicationFlags(projectId: string): {
  exists: boolean;
  humanReviewed?: boolean;
} {
  const flagsPath = path.join(
    getRepoRoot(),
    "src/data/projects/projectPublicationFlags.ts"
  );
  const source = fs.readFileSync(flagsPath, "utf8");
  const blockPattern = new RegExp(
    `"${projectId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"\\s*:\\s*\\{([\\s\\S]*?)\\n\\s*\\}`,
    "m"
  );
  const match = source.match(blockPattern);
  if (!match) {
    return { exists: false };
  }

  const humanReviewedMatch = match[1].match(/humanReviewed:\s*(true|false)/);
  return {
    exists: true,
    humanReviewed: humanReviewedMatch?.[1] === "true",
  };
}

function printDryRun(steps: AnalyzeStep[]): void {
  console.log("Analyze GitHub repo dry run:");
  steps.forEach((step, index) => {
    console.log(`${index + 1}. ${formatNpmCommand(step.scriptName, step.args)}`);
  });
}

function printSuccess(options: AnalyzeOptions): void {
  const flags = readPublicationFlags(options.projectId);

  console.log("");
  console.log("Done.");
  console.log(`Project: ${options.projectId}`);
  console.log(`Open: /projects/${options.projectId}`);
  console.log("Review flag: src/data/projects/projectPublicationFlags.ts");
  console.log("Manual frontend wiring still required:");
  console.log("  - src/content/projects.ts");
  console.log("  - src/data/projects/ai-drafts/index.ts");
  console.log("  - src/data/projects/projectPublicationFlags.ts");

  if (!flags.exists || flags.humanReviewed === false) {
    console.log("This project is visible as AI DRAFT until manually reviewed.");
  }
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  if (!options) {
    process.exit(1);
  }

  const steps = buildSteps(options);

  if (options.dryRun) {
    printDryRun(steps);
    return;
  }

  for (let index = 0; index < steps.length; index += 1) {
    const step = steps[index];
    console.log("");
    console.log(`=== Step ${index + 1}: ${step.label} ===`);
    runNpmScript(step.scriptName, step.args);
  }

  printSuccess(options);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
