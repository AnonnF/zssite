import fs from "node:fs";
import path from "node:path";
import { getRepoRoot } from "./config.js";

export type AnalyzerAiConfig = {
  priorityPaths?: string[];
  priorityPatterns?: string[];
};

const CONFIG_DIR = "src/data/projects/configs";

export function loadAnalyzerAiConfig(projectId: string): {
  config: AnalyzerAiConfig;
  warnings: string[];
} {
  const repoRoot = getRepoRoot();
  const warnings: string[] = [];
  let config: AnalyzerAiConfig = {};

  const sources = [
    path.join(repoRoot, CONFIG_DIR, `${projectId}.config.json`),
    path.join(repoRoot, CONFIG_DIR, `${projectId}.analyzer.config.json`),
    path.join(repoRoot, "project-snapshots", projectId, "analyzer.config.json"),
  ];

  for (const sourcePath of sources) {
    if (!fs.existsSync(sourcePath)) continue;
    try {
      const raw = JSON.parse(fs.readFileSync(sourcePath, "utf8")) as Record<
        string,
        unknown
      >;
      const merged: AnalyzerAiConfig = {
        priorityPaths: [
          ...(config.priorityPaths ?? []),
          ...normalizeStringArray(raw.priorityPaths),
          ...normalizeStringArray(
            (raw.analyzer as Record<string, unknown> | undefined)?.priorityPaths
          ),
        ],
        priorityPatterns: [
          ...(config.priorityPatterns ?? []),
          ...normalizeStringArray(raw.priorityPatterns),
          ...normalizeStringArray(
            (raw.analyzer as Record<string, unknown> | undefined)
              ?.priorityPatterns
          ),
        ],
      };
      config = merged;
    } catch (error) {
      warnings.push(
        `Failed to read analyzer config from ${sourcePath}: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  config.priorityPaths = [...new Set(config.priorityPaths ?? [])];
  config.priorityPatterns = [...new Set(config.priorityPatterns ?? [])];

  return { config, warnings };
}

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}
