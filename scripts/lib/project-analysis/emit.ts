import fs from "node:fs";
import path from "node:path";
import type { ProjectAnalyzerGeneratedData } from "../../../src/data/projects/types.js";

const GENERATED_DIR = "src/data/projects/generated";

function toExportName(projectId: string): string {
  const camel = projectId.replace(/-([a-z])/g, (_, char: string) =>
    char.toUpperCase()
  );
  return `${camel}Generated`;
}

function toGeneratedFileName(projectId: string): string {
  return `${projectId}.generated.ts`;
}

export function writeGeneratedAnalysis(
  repoRoot: string,
  projectId: string,
  data: ProjectAnalyzerGeneratedData
): string {
  const generatedDir = path.join(repoRoot, GENERATED_DIR);
  fs.mkdirSync(generatedDir, { recursive: true });

  const fileName = toGeneratedFileName(projectId);
  const outputPath = path.join(generatedDir, fileName);
  const exportName = toExportName(projectId);

  const fileContents = `import type { ProjectAnalyzerGeneratedData } from "../types";

export const ${exportName} = ${JSON.stringify(data, null, 2)} satisfies ProjectAnalyzerGeneratedData;
`;

  fs.writeFileSync(outputPath, fileContents, "utf8");
  updateGeneratedRegistry(repoRoot);

  return path.relative(repoRoot, outputPath);
}

export function updateGeneratedRegistry(repoRoot: string): void {
  const generatedDir = path.join(repoRoot, GENERATED_DIR);
  fs.mkdirSync(generatedDir, { recursive: true });

  const generatedFiles = fs
    .readdirSync(generatedDir)
    .filter((name) => name.endsWith(".generated.ts"))
    .sort();

  const loaderEntries: string[] = [];

  for (const fileName of generatedFiles) {
    const projectId = fileName.replace(/\.generated\.ts$/, "");
    const exportName = toExportName(projectId);
    // Lazy require keeps list/detail routes from eagerly loading every project payload.
    loaderEntries.push(
      `  "${projectId}": () =>\n    require("./${projectId}.generated").${exportName} as ProjectAnalyzerGeneratedData,`
    );
  }

  const registryContents =
    loaderEntries.length > 0
      ? `import type { ProjectAnalyzerGeneratedData } from "../types";

type GeneratedLoader = () => ProjectAnalyzerGeneratedData;

const generatedLoaders: Record<string, GeneratedLoader> = {
${loaderEntries.join("\n")}
};

const generatedCache = new Map<string, ProjectAnalyzerGeneratedData>();

export function getGeneratedAnalyzer(
  projectId: string
): ProjectAnalyzerGeneratedData | undefined {
  const cached = generatedCache.get(projectId);
  if (cached) return cached;

  const loader = generatedLoaders[projectId];
  if (!loader) return undefined;

  const data = loader();
  generatedCache.set(projectId, data);
  return data;
}

export function hasGeneratedAnalyzer(projectId: string): boolean {
  return projectId in generatedLoaders;
}

/** @deprecated Prefer getGeneratedAnalyzer — kept for call-site compatibility. */
export const generatedRegistry: Record<string, ProjectAnalyzerGeneratedData> =
  new Proxy({} as Record<string, ProjectAnalyzerGeneratedData>, {
    get(_target, prop: string | symbol) {
      if (typeof prop !== "string") return undefined;
      return getGeneratedAnalyzer(prop);
    },
    has(_target, prop: string | symbol) {
      return typeof prop === "string" && hasGeneratedAnalyzer(prop);
    },
    ownKeys() {
      return Object.keys(generatedLoaders);
    },
    getOwnPropertyDescriptor(_target, prop: string | symbol) {
      if (typeof prop !== "string" || !hasGeneratedAnalyzer(prop)) {
        return undefined;
      }
      return {
        configurable: true,
        enumerable: true,
        get: () => getGeneratedAnalyzer(prop),
      };
    },
  });
`
      : `import type { ProjectAnalyzerGeneratedData } from "../types";

export function getGeneratedAnalyzer(
  _projectId: string
): ProjectAnalyzerGeneratedData | undefined {
  return undefined;
}

export function hasGeneratedAnalyzer(_projectId: string): boolean {
  return false;
}

export const generatedRegistry: Record<string, ProjectAnalyzerGeneratedData> =
  {};
`;

  fs.writeFileSync(
    path.join(generatedDir, "registry.ts"),
    registryContents,
    "utf8"
  );
}

export function listGeneratedProjectIds(repoRoot: string): string[] {
  const generatedDir = path.join(repoRoot, GENERATED_DIR);
  if (!fs.existsSync(generatedDir)) return [];

  return fs
    .readdirSync(generatedDir)
    .filter((name) => name.endsWith(".generated.ts"))
    .map((name) => name.replace(/\.generated\.ts$/, ""))
    .sort();
}
