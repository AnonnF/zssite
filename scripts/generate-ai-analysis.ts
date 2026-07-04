#!/usr/bin/env node
import { buildAnalysisPrompt } from "./ai/build-prompt.js";
import { getAiConfig } from "./ai/config.js";
import {
  emitAiDraft,
  emitPromptDebug,
  emitRawDebug,
  emitSelectionDebug,
} from "./ai/emit-draft.js";
import { loadAnalyzerAiConfig } from "./ai/load-analyzer-config.js";
import { loadProjectContext } from "./ai/load-project-context.js";
import { processAiDraftResponse } from "./ai/process-draft.js";
import { getAiProvider } from "./ai/providers/index.js";
import { selectAnalysisCandidates } from "./ai/select-candidates.js";
import { parseJsonResponse, validateAiDraft } from "./ai/validate-draft.js";

function printUsage(): void {
  console.log(`Usage:
  npm run generate:ai-analysis -- <projectId>
  npm run generate:ai-analysis -- <projectId> --dry-run

Examples:
  npm run generate:ai-analysis -- wacc-compiler
  npm run generate:ai-analysis -- wacc-compiler --dry-run`);
}

function parseArgs(argv: string[]): { projectId: string; dryRun: boolean } | null {
  const args = argv.filter((arg) => arg !== "--");

  if (args.length === 0) {
    return null;
  }

  const dryRun = args.includes("--dry-run");
  const projectId = args.find((arg) => !arg.startsWith("--"));

  if (!projectId) {
    return null;
  }

  return { projectId, dryRun };
}

function printSelectionSummary(projectId: string, selectionReport: ReturnType<typeof selectAnalysisCandidates>["selectionReport"]): void {
  console.log(`Selection for ${projectId}:`);
  console.log(`  Source files: ${selectionReport.selectedFiles.length}`);
  console.log(`  Test files: ${selectionReport.selectedTests.length}`);
  console.log(`  Folders: ${selectionReport.selectedFolders.length}`);
  console.log(`  Skipped: ${selectionReport.skippedFiles.length}`);

  const topFiles = selectionReport.selectedFiles.slice(0, 8);
  for (const item of topFiles) {
    console.log(`    [${item.score}] ${item.path} — ${item.reasons.slice(0, 2).join("; ")}`);
  }
}

async function main(): Promise<void> {
  const parsed = parseArgs(process.argv.slice(2));

  if (!parsed) {
    printUsage();
    process.exit(1);
  }

  const { projectId, dryRun } = parsed;
  const config = getAiConfig();

  let context;
  try {
    context = loadProjectContext(projectId);
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }

  const { config: analyzerConfig, warnings: configWarnings } =
    loadAnalyzerAiConfig(projectId);

  const { candidates, selectionReport, warnings: selectionWarnings } =
    selectAnalysisCandidates(context, analyzerConfig, configWarnings);

  const selectionDebugPath = emitSelectionDebug(projectId, selectionReport);
  const { system, user } = buildAnalysisPrompt(context, candidates);

  if (dryRun) {
    const promptContent = `# System\n\n${system}\n\n# User\n\n${user}`;
    const outputPath = emitPromptDebug(projectId, promptContent);

    console.log(`Dry-run prompt for ${projectId}`);
    printSelectionSummary(projectId, selectionReport);
    console.log(`Selection warnings: ${selectionWarnings.length}`);
    console.log(`Provider: ${config.provider} (${config.model})`);
    console.log(`Selection report: ${selectionDebugPath}`);
    console.log(`Prompt output: ${outputPath}`);
    return;
  }

  if (!config.apiKey) {
    console.error(
      "DEEPSEEK_API_KEY is missing. Add it to .env or run with --dry-run."
    );
    process.exit(1);
  }

  const provider = getAiProvider();
  let rawResponse: string;

  try {
    rawResponse = await provider.generateJson(user, { system });
  } catch (error) {
    console.error("AI provider request failed:");
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }

  let parsedJson: unknown;
  try {
    parsedJson = parseJsonResponse(rawResponse);
  } catch (error) {
    const rawPath = emitRawDebug(projectId, rawResponse);
    console.error("Failed to parse AI response as JSON:");
    console.error(error instanceof Error ? error.message : String(error));
    console.error(`Raw output saved: ${rawPath}`);
    process.exit(1);
  }

  const processed = processAiDraftResponse(
    parsedJson as import("./ai/types.js").AiRawDraftResponse,
    context,
    selectionReport
  );

  const draftWithMeta = {
    projectId,
    generatedAt: new Date().toISOString(),
    source: "ai-draft" as const,
    provider: config.provider,
    model: config.model,
    confidence: "draft" as const,
    projectAnalysis: processed.projectAnalysis,
    entries: processed.entries,
    warnings: [
      ...selectionWarnings,
      ...processed.warnings,
      ...processed.validationReport.warnings,
    ],
    selectionReport: processed.selectionReport,
    validationReport: processed.validationReport,
  };

  const { draft, errors } = validateAiDraft(draftWithMeta, projectId);

  if (errors.length > 0) {
    const rawPath = emitRawDebug(projectId, rawResponse);
    console.error("AI draft validation failed:");
    for (const err of errors) {
      console.error(`  - ${err}`);
    }
    console.error(`Raw output saved: ${rawPath}`);
    process.exit(1);
  }

  const outputPath = emitAiDraft(draft);

  console.log(`AI draft generated for ${projectId}`);
  console.log(`Provider: ${config.provider} (${config.model})`);
  printSelectionSummary(projectId, draft.selectionReport);
  console.log(`Entries analyzed: ${Object.keys(draft.entries).length}`);
  console.log(
    `Snippets: ${draft.validationReport.validSnippets} valid, ${draft.validationReport.invalidSnippets} invalid`
  );
  console.log(`Warnings: ${draft.warnings.length}`);
  console.log(`Selection report: ${selectionDebugPath}`);
  console.log(`Output: ${outputPath}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
