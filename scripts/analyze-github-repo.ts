#!/usr/bin/env node
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
  skipRegister: boolean;
  registerOnly: boolean;
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
  --skip-register       Skip automatic frontend registration
  --register-only       Only run register:project
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
    skipRegister: flags.has("--skip-register"),
    registerOnly: flags.has("--register-only"),
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

function buildRegisterArgs(options: AnalyzeOptions): string[] {
  const parsed = parseGitHubRepoInput(options.repoInput);
  const args = [options.projectId, "--repoUrl", parsed.htmlUrl];
  if (options.templateId) {
    args.push("--templateId", options.templateId);
  }
  return args;
}

function buildSteps(options: AnalyzeOptions): AnalyzeStep[] {
  if (options.registerOnly) {
    return [
      {
        label: "Register project for frontend",
        scriptName: "register:project",
        args: buildRegisterArgs(options),
      },
    ];
  }

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

  if (!options.skipRegister) {
    steps.push({
      label: "Register project for frontend",
      scriptName: "register:project",
      args: buildRegisterArgs(options),
    });
  }

  return steps;
}

function printDryRun(steps: AnalyzeStep[]): void {
  console.log("Analyze GitHub repo dry run:");
  steps.forEach((step, index) => {
    console.log(`${index + 1}. ${formatNpmCommand(step.scriptName, step.args)}`);
  });
}

function printSuccess(options: AnalyzeOptions): void {
  console.log("");
  console.log("Done.");
  if (!options.skipRegister || options.registerOnly) {
    console.log("Project registered.");
  }
  console.log(`Project: ${options.projectId}`);
  console.log(`Open: /projects/${options.projectId}`);
  console.log("Review flag: src/data/projects/projectPublicationFlags.ts");
  console.log(
    `To mark reviewed: npm run review:project -- ${options.projectId} --humanReviewed true`
  );
  console.log(
    "This project appears under AI Drafts with an AI DRAFT badge until manually reviewed."
  );
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
