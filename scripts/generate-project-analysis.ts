#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  getSnapshotRoot,
  listSnapshotProjectIds,
  loadScannerConfig,
} from "./lib/project-analysis/config.js";
import { writeGeneratedAnalysis } from "./lib/project-analysis/emit.js";
import { scanProjectSnapshot } from "./lib/project-analysis/scanner.js";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function printUsage(): void {
  console.log(`Usage:
  npm run generate:analysis -- <projectId>
  npm run generate:analysis -- --all

Examples:
  npm run generate:analysis -- wacc-compiler
  npm run generate:analysis -- --all`);
}

function generateForProject(projectId: string): void {
  const snapshotRoot = getSnapshotRoot(repoRoot, projectId);

  if (!fs.existsSync(snapshotRoot)) {
    console.error(`project-snapshots/${projectId} does not exist.`);
    process.exit(1);
  }

  const config = loadScannerConfig(repoRoot, projectId);
  const result = scanProjectSnapshot(repoRoot, projectId, config);
  const outputPath = writeGeneratedAnalysis(repoRoot, projectId, result.data);

  console.log(`Generated analysis for ${projectId}`);
  console.log(`Files included: ${result.counters.includedFileCount}`);
  console.log(`Folders included: ${result.counters.folderCount}`);
  console.log(`Files skipped: ${result.counters.skippedFileCount}`);
  console.log(`Output: ${outputPath}`);
}

function main(): void {
  const args = process.argv.slice(2).filter((arg) => arg !== "--");

  if (args.length === 0) {
    printUsage();
    process.exit(1);
  }

  if (args[0] === "--all") {
    const projectIds = listSnapshotProjectIds(repoRoot);
    if (projectIds.length === 0) {
      console.error("No projects found in project-snapshots/.");
      process.exit(1);
    }

    for (const projectId of projectIds) {
      generateForProject(projectId);
      console.log("");
    }
    return;
  }

  if (args[0] === "--help" || args[0] === "-h") {
    printUsage();
    return;
  }

  generateForProject(args[0]);
}

main();
