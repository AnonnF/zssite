import fs from "node:fs";
import path from "node:path";
import type { ProjectHighlightData } from "../../../src/data/projects/highlight-types.js";

const HIGHLIGHTED_DIR = "src/data/projects/highlighted";

function toExportName(projectId: string): string {
  const camel = projectId.replace(/-([a-z])/g, (_, char: string) =>
    char.toUpperCase()
  );
  return `${camel}Highlighted`;
}

function toHighlightedFileName(projectId: string): string {
  return `${projectId}.highlighted.ts`;
}

export function writeHighlightData(
  repoRoot: string,
  projectId: string,
  data: ProjectHighlightData
): string {
  const highlightedDir = path.join(repoRoot, HIGHLIGHTED_DIR);
  fs.mkdirSync(highlightedDir, { recursive: true });

  const fileName = toHighlightedFileName(projectId);
  const outputPath = path.join(highlightedDir, fileName);
  const exportName = toExportName(projectId);

  const fileContents = `import type { ProjectHighlightData } from "../highlight-types";

export const ${exportName} = ${JSON.stringify(data, null, 2)} satisfies ProjectHighlightData;
`;

  fs.writeFileSync(outputPath, fileContents, "utf8");
  updateHighlightedRegistry(repoRoot);

  return path.relative(repoRoot, outputPath);
}

export function updateHighlightedRegistry(repoRoot: string): void {
  const highlightedDir = path.join(repoRoot, HIGHLIGHTED_DIR);
  fs.mkdirSync(highlightedDir, { recursive: true });

  const highlightedFiles = fs
    .readdirSync(highlightedDir)
    .filter((name) => name.endsWith(".highlighted.ts"))
    .sort();

  const imports: string[] = [];
  const registryEntries: string[] = [];

  for (const fileName of highlightedFiles) {
    const projectId = fileName.replace(/\.highlighted\.ts$/, "");
    const exportName = toExportName(projectId);
    imports.push(
      `import { ${exportName} } from "./${projectId}.highlighted";`
    );
    registryEntries.push(`  "${projectId}": ${exportName},`);
  }

  const registryContents =
    imports.length > 0
      ? `${imports.join("\n")}

import type { ProjectHighlightData } from "../highlight-types";

export const highlightedRegistry: Record<string, ProjectHighlightData> = {
${registryEntries.join("\n")}
};
`
      : `import type { ProjectHighlightData } from "../highlight-types";

export const highlightedRegistry: Record<string, ProjectHighlightData> = {};
`;

  fs.writeFileSync(
    path.join(highlightedDir, "registry.ts"),
    registryContents,
    "utf8"
  );
}
