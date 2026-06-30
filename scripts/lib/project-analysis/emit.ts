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

  const imports: string[] = [];
  const registryEntries: string[] = [];

  for (const fileName of generatedFiles) {
    const projectId = fileName.replace(/\.generated\.ts$/, "");
    const exportName = toExportName(projectId);
    imports.push(`import { ${exportName} } from "./${projectId}.generated";`);
    registryEntries.push(`  "${projectId}": ${exportName},`);
  }

  const registryContents =
    imports.length > 0
      ? `${imports.join("\n")}

import type { ProjectAnalyzerGeneratedData } from "../types";

export const generatedRegistry: Record<string, ProjectAnalyzerGeneratedData> = {
${registryEntries.join("\n")}
};
`
      : `import type { ProjectAnalyzerGeneratedData } from "../types";

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
