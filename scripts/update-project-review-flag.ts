#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { getRepoRoot } from "./lib/paths.js";

type FlagUpdates = {
  enabled?: boolean;
  humanReviewed?: boolean;
  featured?: boolean;
};

type ProjectFlagState = {
  enabled: boolean;
  humanReviewed: boolean;
  featured: boolean;
  templateId?: string;
  note?: string;
};

const FLAGS_PATH = path.join(
  getRepoRoot(),
  "src/data/projects/projectPublicationFlags.ts"
);

function printUsage(): void {
  console.log(`Usage:
  npm run review:project -- <projectId> [options]

Options:
  --enabled true|false
  --humanReviewed true|false
  --featured true|false
  --create              Create a new project flag entry if missing

Examples:
  npm run review:project -- resume-jd-matcher --humanReviewed true
  npm run review:project -- resume-jd-matcher --humanReviewed true --featured true`);
}

function readFlagValue(args: string[], flag: string): string | undefined {
  const index = args.indexOf(flag);
  if (index === -1) return undefined;
  return args[index + 1];
}

function parseBooleanFlag(
  args: string[],
  flag: "--enabled" | "--humanReviewed" | "--featured"
): boolean | undefined {
  const raw = readFlagValue(args, flag);
  if (raw === undefined) return undefined;
  if (raw === "true") return true;
  if (raw === "false") return false;
  throw new Error(`Invalid value for ${flag}: "${raw}". Use true or false.`);
}

function parseArgs(argv: string[]): {
  projectId: string;
  updates: FlagUpdates;
  create: boolean;
} | null {
  const args = argv.filter((arg) => arg !== "--");

  if (args.length === 0 || args[0] === "--help" || args[0] === "-h") {
    printUsage();
    process.exit(args.length === 0 ? 1 : 0);
  }

  const projectId = args[0];
  const updates: FlagUpdates = {
    enabled: parseBooleanFlag(args, "--enabled"),
    humanReviewed: parseBooleanFlag(args, "--humanReviewed"),
    featured: parseBooleanFlag(args, "--featured"),
  };

  if (
    updates.enabled === undefined &&
    updates.humanReviewed === undefined &&
    updates.featured === undefined
  ) {
    console.error("No flag updates provided.");
    printUsage();
    process.exit(1);
  }

  return {
    projectId,
    updates,
    create: args.includes("--create"),
  };
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function parseProjectBlock(blockBody: string): ProjectFlagState {
  const enabled = /enabled:\s*(true|false)/.exec(blockBody)?.[1] === "true";
  const humanReviewed =
    /humanReviewed:\s*(true|false)/.exec(blockBody)?.[1] === "true";
  const featured = /featured:\s*(true|false)/.exec(blockBody)?.[1] === "true";
  const templateId = /templateId:\s*"([^"]+)"/.exec(blockBody)?.[1];
  const note = /note:\s*"([^"]*)"/.exec(blockBody)?.[1];

  return {
    enabled,
    humanReviewed,
    featured,
    templateId,
    note,
  };
}

function formatProjectBlock(projectId: string, state: ProjectFlagState): string {
  const lines = [
    `  "${projectId}": {`,
    `    enabled: ${state.enabled},`,
    `    humanReviewed: ${state.humanReviewed},`,
    `    featured: ${state.featured},`,
  ];

  if (state.templateId) {
    lines.push(`    templateId: "${state.templateId}",`);
  }
  if (state.note) {
    lines.push(`    note: "${state.note}",`);
  }

  lines.push("  },");
  return lines.join("\n");
}

function findProjectBlock(source: string, projectId: string): {
  start: number;
  end: number;
  body: string;
} | null {
  const pattern = new RegExp(
    `"${escapeRegExp(projectId)}"\\s*:\\s*\\{`,
    "m"
  );
  const match = pattern.exec(source);
  if (!match || match.index === undefined) {
    return null;
  }

  const start = match.index;
  let index = match.index + match[0].length;
  let depth = 1;

  while (index < source.length && depth > 0) {
    const char = source[index];
    if (char === "{") depth += 1;
    if (char === "}") depth -= 1;
    index += 1;
  }

  let end = index;
  if (source[end] === ",") {
    end += 1;
  }

  return {
    start,
    end,
    body: source.slice(match.index + match[0].length - 1, index),
  };
}

function applyUpdates(
  current: ProjectFlagState,
  updates: FlagUpdates
): ProjectFlagState {
  return {
    ...current,
    enabled: updates.enabled ?? current.enabled,
    humanReviewed: updates.humanReviewed ?? current.humanReviewed,
    featured: updates.featured ?? current.featured,
  };
}

function printState(label: string, state: ProjectFlagState): void {
  console.log(`${label}:`);
  console.log(`  enabled: ${state.enabled}`);
  console.log(`  humanReviewed: ${state.humanReviewed}`);
  console.log(`  featured: ${state.featured}`);
  if (state.templateId) {
    console.log(`  templateId: ${state.templateId}`);
  }
  if (state.note) {
    console.log(`  note: ${state.note}`);
  }
}

function insertProjectBlock(source: string, projectId: string, block: string): string {
  const marker = "export const projectPublicationFlags = {";
  const markerIndex = source.indexOf(marker);
  if (markerIndex === -1) {
    throw new Error("Could not locate projectPublicationFlags object.");
  }

  const satisfiesIndex = source.indexOf("} satisfies Record<string, ProjectPublicationFlag>;");
  if (satisfiesIndex === -1) {
    throw new Error("Could not locate projectPublicationFlags closing brace.");
  }

  const before = source.slice(0, satisfiesIndex);
  const after = source.slice(satisfiesIndex);
  const needsComma = !before.trimEnd().endsWith("{");

  return `${before}${needsComma ? ",\n" : "\n"}${block}\n${after}`;
}

function main(): void {
  const parsed = parseArgs(process.argv.slice(2));
  if (!parsed) {
    process.exit(1);
  }

  const source = fs.readFileSync(FLAGS_PATH, "utf8");
  const existingBlock = findProjectBlock(source, parsed.projectId);

  if (!existingBlock) {
    if (!parsed.create) {
      console.error(
        `Project "${parsed.projectId}" not found in projectPublicationFlags.ts.`
      );
      console.error("Add it manually or re-run with --create.");
      process.exit(1);
    }

    const createdState = applyUpdates(
      {
        enabled: true,
        humanReviewed: false,
        featured: false,
      },
      parsed.updates
    );

    printState("Before", {
      enabled: false,
      humanReviewed: false,
      featured: false,
    });
    printState("After", createdState);

    const nextSource = insertProjectBlock(
      source,
      parsed.projectId,
      formatProjectBlock(parsed.projectId, createdState)
    );
    fs.writeFileSync(FLAGS_PATH, nextSource, "utf8");
    console.log(`Updated ${FLAGS_PATH}`);
    return;
  }

  const before = parseProjectBlock(existingBlock.body);
  const after = applyUpdates(before, parsed.updates);

  printState("Before", before);
  printState("After", after);

  const replacement = formatProjectBlock(parsed.projectId, after);
  const nextSource =
    source.slice(0, existingBlock.start) +
    replacement +
    source.slice(existingBlock.end);

  fs.writeFileSync(FLAGS_PATH, nextSource, "utf8");
  console.log(`Updated ${FLAGS_PATH}`);
}

main();
