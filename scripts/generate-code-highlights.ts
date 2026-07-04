#!/usr/bin/env node
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildAnalyzerDataForProject, listEnabledAnalyzerProjectIds } from "../src/data/projects/buildAnalyzerData.js";
import { HIGHLIGHT_THEME } from "../src/data/projects/highlightLanguage.js";
import type {
  ProjectHighlightData,
  ProjectHighlightEntryData,
} from "../src/data/projects/highlight-types.js";
import { shouldSkipFullFileHighlight } from "./lib/code-highlights/config.js";
import { highlightCodeBuildTime } from "./lib/code-highlights/highlighter.js";
import { writeHighlightData } from "./lib/code-highlights/emit.js";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

type Summary = {
  filesHighlighted: number;
  snippetsHighlighted: number;
  skipped: number;
  warnings: string[];
};

function printUsage(): void {
  console.log(`Usage:
  npm run generate:highlights -- <projectId>
  npm run generate:highlights -- --all

Examples:
  npm run generate:highlights -- wacc-compiler
  npm run generate:highlights -- resume-jd-matcher
  npm run generate:highlights -- --all`);
}

async function generateForProject(projectId: string): Promise<void> {
  const merged = buildAnalyzerDataForProject(projectId, { includeHighlights: false });
  if (!merged) {
    console.error(
      `No analyzer data available for "${projectId}". Ensure generated data exists and publication flags are enabled.`
    );
    process.exit(1);
  }

  const entries: Record<string, ProjectHighlightEntryData> = {};
  const summary: Summary = {
    filesHighlighted: 0,
    snippetsHighlighted: 0,
    skipped: 0,
    warnings: [],
  };

  for (const [entryPath, entry] of Object.entries(merged.entries)) {
    const highlightEntry: ProjectHighlightEntryData = {};
    let hasEntryData = false;

    const fileCode = entry.code?.trim();
    if (fileCode) {
      const skipCheck = shouldSkipFullFileHighlight(fileCode);
      if (skipCheck.skip) {
        summary.skipped += 1;
        summary.warnings.push(`${entryPath} (file): ${skipCheck.reason}`);
      } else {
        const result = await highlightCodeBuildTime(
          fileCode,
          entry.language,
          entry.path
        );
        highlightEntry.highlightedHtml = result.html;
        summary.filesHighlighted += 1;
        hasEntryData = true;
        if (result.warning) {
          summary.warnings.push(`${entryPath} (file): ${result.warning}`);
        }
      }
    }

    if (entry.snippets?.length) {
      const snippetHighlights: Record<string, { highlightedHtml: string }> =
        {};

      for (const snippet of entry.snippets) {
        const snippetCode = snippet.code?.trim();
        if (!snippetCode) {
          summary.skipped += 1;
          summary.warnings.push(
            `${entryPath} (snippet ${snippet.id}): no code`
          );
          continue;
        }

        const result = await highlightCodeBuildTime(
          snippetCode,
          entry.language,
          entry.path
        );
        snippetHighlights[snippet.id] = { highlightedHtml: result.html };
        summary.snippetsHighlighted += 1;
        hasEntryData = true;

        if (result.warning) {
          summary.warnings.push(
            `${entryPath} (snippet ${snippet.id}): ${result.warning}`
          );
        }
      }

      if (Object.keys(snippetHighlights).length > 0) {
        highlightEntry.snippets = snippetHighlights;
      }
    }

    if (hasEntryData) {
      entries[entryPath] = highlightEntry;
    }
  }

  const data: ProjectHighlightData = {
    projectId,
    generatedAt: new Date().toISOString(),
    source: "build-time-highlight",
    theme: HIGHLIGHT_THEME,
    entries,
  };

  const outputPath = writeHighlightData(repoRoot, projectId, data);

  console.log(`Generated highlights for ${projectId}`);
  console.log(`Files highlighted: ${summary.filesHighlighted}`);
  console.log(`Snippets highlighted: ${summary.snippetsHighlighted}`);
  console.log(`Skipped: ${summary.skipped}`);
  console.log(`Output: ${outputPath}`);

  if (summary.warnings.length > 0) {
    console.log("");
    console.log("Warnings:");
    for (const warning of summary.warnings) {
      console.log(`  - ${warning}`);
    }
  }
}

async function main(): Promise<void> {
  const args = process.argv.slice(2).filter((arg) => arg !== "--");

  if (args.length === 0) {
    printUsage();
    process.exit(1);
  }

  if (args[0] === "--help" || args[0] === "-h") {
    printUsage();
    return;
  }

  if (args[0] === "--all") {
    const projectIds = listEnabledAnalyzerProjectIds();
    if (projectIds.length === 0) {
      console.error("No enabled projects found in publication flags.");
      process.exit(1);
    }

    for (const projectId of projectIds) {
      await generateForProject(projectId);
      console.log("");
    }
    return;
  }

  await generateForProject(args[0]);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
