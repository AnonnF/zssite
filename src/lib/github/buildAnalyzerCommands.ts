import type { ProjectTemplateId } from "@/data/projects/types";

export function buildAnalyzerCliCommands(options: {
  owner: string;
  repo: string;
  projectId: string;
  templateId?: ProjectTemplateId;
}): string {
  const repoSlug = `${options.owner}/${options.repo}`;
  const templateFlag = options.templateId
    ? ` --templateId ${options.templateId}`
    : "";

  return [
    `npm run import:github -- ${repoSlug} --projectId ${options.projectId}${templateFlag}`,
    `npm run generate:analysis -- ${options.projectId}`,
    `npm run generate:ai-analysis -- ${options.projectId}`,
    `npm run export:project -- ${options.projectId}`,
  ].join("\n");
}
