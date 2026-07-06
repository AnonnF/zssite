import type { ProjectTemplateId } from "@/data/projects/types";

export function buildAnalyzeGithubCommand(options: {
  owner: string;
  repo: string;
  projectId: string;
  templateId?: ProjectTemplateId;
}): string {
  const repoSlug = `${options.owner}/${options.repo}`;
  const parts = [
    "npm run analyze:github --",
    repoSlug,
    "--projectId",
    options.projectId,
  ];

  if (options.templateId) {
    parts.push("--templateId", options.templateId);
  }

  return parts.join(" ");
}

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

export function buildAnalyzerCommandPreview(options: {
  owner: string;
  repo: string;
  projectId: string;
  templateId?: ProjectTemplateId;
  preferAnalyzeGithub?: boolean;
}): string {
  if (options.preferAnalyzeGithub !== false) {
    return buildAnalyzeGithubCommand(options);
  }

  return buildAnalyzerCliCommands(options);
}
