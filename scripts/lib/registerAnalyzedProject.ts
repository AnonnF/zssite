import fs from "node:fs";
import path from "node:path";
import type { ProjectTemplateId } from "../../src/data/projects/types.js";

export type RegisterProjectOptions = {
  projectId: string;
  templateId?: ProjectTemplateId;
  title?: string;
  description?: string;
  year?: number;
  repoUrl?: string;
  dryRun?: boolean;
};

export type RegisterProjectResult = {
  projectId: string;
  contentUpdated: boolean;
  contentSkipped: boolean;
  flagsUpdated: boolean;
  flagsSkipped: boolean;
  aiDraftUpdated: boolean;
  aiDraftSkipped: boolean;
  warnings: string[];
};

const CONTENT_PATH = "src/content/projects.ts";
const FLAGS_PATH = "src/data/projects/projectPublicationFlags.ts";
const AI_DRAFTS_DIR = "src/data/projects/ai-drafts";
const GENERATED_DIR = "src/data/projects/generated";

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function toAiDraftExportName(projectId: string): string {
  const camel = projectId.replace(/-([a-z])/g, (_, char: string) =>
    char.toUpperCase()
  );
  return `${camel}AiDraft`;
}

export function toReadableRepoTitle(repoOrTitle: string): string {
  return repoOrTitle
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function templateToType(templateId?: ProjectTemplateId): string {
  switch (templateId) {
    case "fullstack-web":
      return "Web";
    case "systems-project":
      return "Systems";
    case "compiler-pipeline":
      return "Compiler";
    case "ai-pipeline":
    default:
      return "AI";
  }
}

function templateToTags(templateId?: ProjectTemplateId): string[] {
  switch (templateId) {
    case "fullstack-web":
      return ["Web"];
    case "systems-project":
      return ["Systems"];
    case "compiler-pipeline":
      return ["Compiler", "Systems"];
    case "ai-pipeline":
    default:
      return ["AI"];
  }
}

function templateToStack(
  templateId?: ProjectTemplateId,
  languages: string[] = []
): string[] {
  const fromTemplate: string[] = [];
  switch (templateId) {
    case "fullstack-web":
      fromTemplate.push("TypeScript", "React", "Next.js");
      break;
    case "systems-project":
      fromTemplate.push("C", "Systems");
      break;
    case "compiler-pipeline":
      fromTemplate.push("Scala", "Compiler");
      break;
    case "ai-pipeline":
    default:
      fromTemplate.push("Python", "LLM");
      break;
  }

  const merged = [...languages, ...fromTemplate];
  const unique: string[] = [];
  for (const item of merged) {
    const normalized = item.trim();
    if (!normalized) continue;
    const display =
      normalized.length <= 4
        ? normalized.toUpperCase()
        : normalized.charAt(0).toUpperCase() + normalized.slice(1);
    if (!unique.some((value) => value.toLowerCase() === display.toLowerCase())) {
      unique.push(display);
    }
  }
  return unique.slice(0, 4);
}

function detectLanguagesFromGenerated(repoRoot: string, projectId: string): string[] {
  const generatedPath = path.join(
    repoRoot,
    GENERATED_DIR,
    `${projectId}.generated.ts`
  );
  if (!fs.existsSync(generatedPath)) {
    return [];
  }

  const source = fs.readFileSync(generatedPath, "utf8");
  const matches = source.matchAll(/"language":\s*"([^"]+)"/g);
  const languages = new Set<string>();

  for (const match of matches) {
    const language = match[1];
    if (!language || language === "plaintext") continue;
    languages.add(language);
  }

  return [...languages].slice(0, 3);
}

function assertGeneratedExists(repoRoot: string, projectId: string): void {
  const generatedPath = path.join(
    repoRoot,
    GENERATED_DIR,
    `${projectId}.generated.ts`
  );
  if (!fs.existsSync(generatedPath)) {
    throw new Error(
      `Missing generated analysis at ${GENERATED_DIR}/${projectId}.generated.ts. Run generate:analysis first.`
    );
  }
}

function hasAiDraftFile(repoRoot: string, projectId: string): boolean {
  return fs.existsSync(
    path.join(repoRoot, AI_DRAFTS_DIR, `${projectId}.ai-draft.json`)
  );
}

function projectExistsInContent(source: string, slug: string): boolean {
  return new RegExp(`slug:\\s*"${escapeRegExp(slug)}"`).test(source);
}

function formatProjectEntry(options: {
  projectId: string;
  title: string;
  year: number;
  type: string;
  summary: string;
  stack: string[];
  tags: string[];
  repoUrl?: string;
}): string {
  const analysisBlock = options.repoUrl
    ? `    analysis: {
      status: "ready",
      source: "github",
      repoUrl: "${options.repoUrl}",
    },`
    : `    analysis: { status: "ready", source: "github" },`;

  const stack = options.stack.map((item) => `"${item}"`).join(", ");
  const tags = options.tags.map((item) => `"${item}"`).join(", ");

  return `  {
    slug: "${options.projectId}",
    title: "${options.title.replace(/"/g, '\\"')}",
    year: ${options.year},
    type: "${options.type}",
    status: "completed",
    summary: "${options.summary.replace(/"/g, '\\"')}",
    stack: [${stack}],
    tags: [${tags}],
${analysisBlock}
  },`;
}

function registerContentProject(
  repoRoot: string,
  options: RegisterProjectOptions
): { updated: boolean; skipped: boolean } {
  const filePath = path.join(repoRoot, CONTENT_PATH);
  const source = fs.readFileSync(filePath, "utf8");

  if (projectExistsInContent(source, options.projectId)) {
    return { updated: false, skipped: true };
  }

  const languages = detectLanguagesFromGenerated(repoRoot, options.projectId);
  const title =
    options.title ?? toReadableRepoTitle(options.projectId.replace(/-/g, " "));
  const summary =
    options.description ??
    "AI-generated project analysis imported from GitHub.";
  const year = options.year ?? new Date().getFullYear();
  const type = templateToType(options.templateId);
  const tags = templateToTags(options.templateId);
  const stack = templateToStack(options.templateId, languages);
  const entry = formatProjectEntry({
    projectId: options.projectId,
    title,
    year,
    type,
    summary,
    stack,
    tags,
    repoUrl: options.repoUrl,
  });

  const marker = "\n];\n\nexport function getProjectBySlug";
  const markerIndex = source.indexOf(marker);
  if (markerIndex === -1) {
    throw new Error(
      `Could not locate projects array closing marker in ${CONTENT_PATH}.`
    );
  }

  const nextSource = `${source.slice(0, markerIndex)}\n${entry}${source.slice(markerIndex)}`;

  if (!options.dryRun) {
    fs.writeFileSync(filePath, nextSource, "utf8");
  }

  return { updated: true, skipped: false };
}

function findProjectFlagBlock(
  source: string,
  projectId: string
): { start: number; end: number; body: string } | null {
  const pattern = new RegExp(`"${escapeRegExp(projectId)}"\\s*:\\s*\\{`, "m");
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

function formatPublicationFlagBlock(
  projectId: string,
  templateId?: ProjectTemplateId
): string {
  const lines = [
    `  "${projectId}": {`,
    "    enabled: true,",
    "    humanReviewed: false,",
    "    featured: false,",
  ];

  if (templateId) {
    lines.push(`    templateId: "${templateId}",`);
  }

  lines.push(
    '    note: "AI-generated project analysis imported from GitHub.",',
    "  },"
  );

  return lines.join("\n");
}

function registerPublicationFlags(
  repoRoot: string,
  options: RegisterProjectOptions
): { updated: boolean; skipped: boolean } {
  const filePath = path.join(repoRoot, FLAGS_PATH);
  const source = fs.readFileSync(filePath, "utf8");
  const existing = findProjectFlagBlock(source, options.projectId);

  if (existing) {
    if (!options.templateId || /templateId:\s*"/.test(existing.body)) {
      return { updated: false, skipped: true };
    }

    const nextBody = existing.body.replace(
      /(\n\s*\})/,
      `\n    templateId: "${options.templateId}",$1`
    );
    const nextSource =
      source.slice(0, existing.start) +
      `"${options.projectId}": ${nextBody}` +
      source.slice(existing.end);

    if (!options.dryRun) {
      fs.writeFileSync(filePath, nextSource, "utf8");
    }
    return { updated: true, skipped: false };
  }

  const block = formatPublicationFlagBlock(options.projectId, options.templateId);
  const marker = "} satisfies Record<string, ProjectPublicationFlag>;";
  const markerIndex = source.indexOf(marker);
  if (markerIndex === -1) {
    throw new Error(
      `Could not locate publication flags closing marker in ${FLAGS_PATH}.`
    );
  }

  const before = source.slice(0, markerIndex).trimEnd();
  const after = source.slice(markerIndex);
  const needsComma = !before.endsWith("{");
  const nextSource = `${before}${needsComma ? ",\n" : "\n"}${block}\n${after}`;

  if (!options.dryRun) {
    fs.writeFileSync(filePath, nextSource, "utf8");
  }

  return { updated: true, skipped: false };
}

function rebuildAiDraftRegistry(repoRoot: string, dryRun: boolean): string {
  const aiDraftsDir = path.join(repoRoot, AI_DRAFTS_DIR);
  const jsonFiles = fs
    .readdirSync(aiDraftsDir)
    .filter((name) => name.endsWith(".ai-draft.json"))
    .sort();

  const imports: string[] = [
    'import type { AiDraft } from "../ai-draft-types";',
  ];
  const registryEntries: string[] = [];

  for (const fileName of jsonFiles) {
    const projectId = fileName.replace(/\.ai-draft\.json$/, "");
    const exportName = toAiDraftExportName(projectId);
    imports.push(`import ${exportName} from "./${fileName}";`);
    registryEntries.push(`  "${projectId}": ${exportName} as AiDraft,`);
  }

  return `${imports.join("\n")}

export const aiDraftRegistry: Record<string, AiDraft> = {
${registryEntries.join("\n")}
};

export function getAiDraft(projectId: string): AiDraft | undefined {
  return aiDraftRegistry[projectId];
}
`;
}

function registerAiDraftRegistry(
  repoRoot: string,
  options: RegisterProjectOptions
): { updated: boolean; skipped: boolean; warnings: string[] } {
  const warnings: string[] = [];

  if (!hasAiDraftFile(repoRoot, options.projectId)) {
    warnings.push(
      `Missing ai-draft JSON at ${AI_DRAFTS_DIR}/${options.projectId}.ai-draft.json. Skipping ai-draft registry update.`
    );
    return { updated: false, skipped: true, warnings };
  }

  const indexPath = path.join(repoRoot, AI_DRAFTS_DIR, "index.ts");
  const before = fs.existsSync(indexPath) ? fs.readFileSync(indexPath, "utf8") : "";
  const next = rebuildAiDraftRegistry(repoRoot, Boolean(options.dryRun));

  if (options.dryRun) {
    return { updated: true, skipped: false, warnings };
  }

  if (before === next) {
    return { updated: false, skipped: true, warnings };
  }

  fs.writeFileSync(indexPath, next, "utf8");
  return { updated: true, skipped: false, warnings };
}

export function registerAnalyzedProject(
  repoRoot: string,
  options: RegisterProjectOptions
): RegisterProjectResult {
  assertGeneratedExists(repoRoot, options.projectId);

  const warnings: string[] = [];
  if (!hasAiDraftFile(repoRoot, options.projectId)) {
    warnings.push(
      `Ai-draft JSON not found for "${options.projectId}". Project will register without ai-draft until generate:ai-analysis completes.`
    );
  }

  const content = registerContentProject(repoRoot, options);
  const flags = registerPublicationFlags(repoRoot, options);
  const aiDraft = registerAiDraftRegistry(repoRoot, options);

  return {
    projectId: options.projectId,
    contentUpdated: content.updated,
    contentSkipped: content.skipped,
    flagsUpdated: flags.updated,
    flagsSkipped: flags.skipped,
    aiDraftUpdated: aiDraft.updated,
    aiDraftSkipped: aiDraft.skipped,
    warnings: [...warnings, ...aiDraft.warnings],
  };
}

export function printRegisterDryRunPreview(
  repoRoot: string,
  options: RegisterProjectOptions
): void {
  console.log("Register project dry run:");
  console.log(`  Project ID: ${options.projectId}`);
  console.log(`  Template: ${options.templateId ?? "none"}`);
  console.log(`  Repo URL: ${options.repoUrl ?? "none"}`);

  const contentExists = projectExistsInContent(
    fs.readFileSync(path.join(repoRoot, CONTENT_PATH), "utf8"),
    options.projectId
  );
  const flagsExists = Boolean(
    findProjectFlagBlock(
      fs.readFileSync(path.join(repoRoot, FLAGS_PATH), "utf8"),
      options.projectId
    )
  );
  const aiDraftExists = hasAiDraftFile(repoRoot, options.projectId);

  console.log("");
  console.log(
    `  content/projects.ts: ${contentExists ? "skip (exists)" : "add entry"}`
  );
  console.log(
    `  projectPublicationFlags.ts: ${flagsExists ? "skip or patch templateId only" : "add draft flags"}`
  );
  console.log(
    `  ai-drafts/index.ts: ${aiDraftExists ? "rebuild registry" : "skip (no ai-draft JSON)"}`
  );
}
