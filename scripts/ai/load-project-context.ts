import { generatedRegistry } from "../../src/data/projects/generated/registry.js";
import { manualRegistry } from "../../src/data/projects/manual/registry.js";
import { getProjectTemplate } from "../../src/data/projects/templates.js";
import type { ProjectContext } from "./types.js";

export function loadProjectContext(projectId: string): ProjectContext {
  const generated = generatedRegistry[projectId];

  if (!generated) {
    throw new Error(
      `No generated analysis for "${projectId}". Run: npm run generate:analysis -- ${projectId}`
    );
  }

  const manual = manualRegistry[projectId];
  const title = manual?.title ?? projectId;
  const description = manual?.description ?? "";
  const template = manual?.templateId
    ? getProjectTemplate(manual.templateId)
    : undefined;

  return {
    projectId,
    title,
    description,
    tree: generated.tree,
    entries: generated.entries,
    manual,
    template,
  };
}
