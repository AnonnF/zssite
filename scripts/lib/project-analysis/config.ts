import fs from "node:fs";
import path from "node:path";
import { getSnapshotRoot as resolveSnapshotRoot } from "../paths.js";
import type { ScannerConfig } from "./types.js";
import { DEFAULT_SCANNER_CONFIG } from "./types.js";

const CONFIG_DIR = "src/data/projects/configs";

export function loadScannerConfig(
  repoRoot: string,
  projectId: string
): ScannerConfig {
  const committedPath = path.join(repoRoot, CONFIG_DIR, `${projectId}.config.json`);
  const snapshotPath = path.join(
    repoRoot,
    "project-snapshots",
    projectId,
    "analyzer.config.json"
  );

  let config: Partial<ScannerConfig> = { projectId };

  if (fs.existsSync(committedPath)) {
    config = { ...config, ...readJsonConfig(committedPath) };
  }

  if (fs.existsSync(snapshotPath)) {
    config = { ...config, ...readJsonConfig(snapshotPath) };
  }

  return {
    projectId,
    title: config.title,
    include: config.include ?? DEFAULT_SCANNER_CONFIG.include,
    exclude: config.exclude ?? DEFAULT_SCANNER_CONFIG.exclude,
    maxFileSizeKb: config.maxFileSizeKb ?? DEFAULT_SCANNER_CONFIG.maxFileSizeKb,
    readCode: config.readCode ?? DEFAULT_SCANNER_CONFIG.readCode,
  };
}

function readJsonConfig(filePath: string): Partial<ScannerConfig> {
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw) as Partial<ScannerConfig>;
}

export function getSnapshotRoot(repoRoot: string, projectId: string): string {
  return resolveSnapshotRoot(repoRoot, projectId);
}

export function listSnapshotProjectIds(repoRoot: string): string[] {
  const snapshotsDir = path.join(repoRoot, "project-snapshots");
  if (!fs.existsSync(snapshotsDir)) return [];

  return fs
    .readdirSync(snapshotsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}
