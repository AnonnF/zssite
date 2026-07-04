import type {
  ProjectAnalysisEntry,
  ProjectAnalyzerData,
  ProjectAnalyzerGeneratedData,
  ProjectManualAnalysisData,
  ProjectStructuredAnalysis,
  ProjectTemplate,
} from "./types";
import { mergeProjectAnalysis } from "./mergeProjectAnalysis";
import { getProjectTemplate } from "./templates";

function hasAnalysisContent(analysis: ProjectStructuredAnalysis): boolean {
  return Object.entries(analysis).some(([key, value]) => {
    if (key === "reviewStatus") return false;
    if (Array.isArray(value)) return value.length > 0;
    return Boolean(value);
  });
}

function hasStructuredAnalysis(entry: ProjectAnalysisEntry): boolean {
  return Boolean(entry.analysis && hasAnalysisContent(entry.analysis));
}

function stripTemplateId(manual: ProjectManualAnalysisData): ProjectAnalyzerData {
  const { templateId: _templateId, ...data } = manual;
  return data;
}

export function applyTemplateDefaults(
  manual: ProjectManualAnalysisData,
  template: ProjectTemplate
): ProjectAnalyzerData {
  const base = stripTemplateId(manual);

  const pipeline =
    (base.pipeline?.length ?? 0) > 0 ? base.pipeline : template.defaultPipeline;

  const guidedTour =
    (base.guidedTour?.length ?? 0) > 0
      ? base.guidedTour
      : template.defaultGuidedTour;

  const technicalDecisions =
    (base.narrative?.technicalDecisions?.length ?? 0) > 0
      ? base.narrative!.technicalDecisions
      : template.suggestedTechnicalDecisions;

  const skills =
    (base.narrative?.skills?.length ?? 0) > 0
      ? base.narrative!.skills
      : template.suggestedSkills;

  const narrative =
    (technicalDecisions?.length ?? 0) > 0 || (skills?.length ?? 0) > 0
      ? { technicalDecisions, skills }
      : base.narrative;

  return {
    ...base,
    pipeline,
    guidedTour,
    narrative,
  };
}

function isGenericGeneratedSummary(entry: ProjectAnalysisEntry): boolean {
  if (entry.generated) return true;
  return (
    entry.summary.startsWith("自动生成的") ||
    entry.summary.startsWith("File is too large")
  );
}

function matchFolderRoleHint(
  path: string,
  hints: Record<string, string>
): string | null {
  const normalized = path.toLowerCase();
  const segments = normalized.split("/");
  const fileName = segments.at(-1) ?? "";

  for (const [key, hint] of Object.entries(hints)) {
    const keyLower = key.toLowerCase();
    if (
      segments.some((segment) => segment === keyLower || segment.includes(keyLower)) ||
      fileName.includes(keyLower)
    ) {
      return hint;
    }
  }

  return null;
}

function buildTemplateEntrySummary(
  entry: ProjectAnalysisEntry,
  template: ProjectTemplate,
  hint: string
): string {
  const kind = entry.type === "folder" ? "文件夹" : "文件";
  return `根据 ${template.label} 模板推断，该${kind}可能与「${hint}」相关。建议在 manual analysis 中补充具体职责。`;
}

export function applyTemplateEntryHints(
  data: ProjectAnalyzerData,
  template: ProjectTemplate
): ProjectAnalyzerData {
  const entries: Record<string, ProjectAnalysisEntry> = {};

  for (const [path, entry] of Object.entries(data.entries)) {
    if (
      entry.fixed ||
      hasStructuredAnalysis(entry) ||
      !isGenericGeneratedSummary(entry)
    ) {
      entries[path] = entry;
      continue;
    }

    const hint = matchFolderRoleHint(path, template.folderRoleHints);
    if (!hint) {
      entries[path] = entry;
      continue;
    }

    entries[path] = {
      ...entry,
      summary: buildTemplateEntrySummary(entry, template, hint),
    };
  }

  return { ...data, entries };
}

export function resolveProjectAnalyzerData(
  manual: ProjectManualAnalysisData,
  generated?: ProjectAnalyzerGeneratedData
): ProjectAnalyzerData {
  const template = manual.templateId
    ? getProjectTemplate(manual.templateId)
    : undefined;

  if (manual.templateId && !template && process.env.NODE_ENV === "development") {
    console.warn(
      `[ProjectAnalyzer] Unknown templateId "${manual.templateId}" for project "${manual.projectId}".`
    );
  }

  const base = template ? applyTemplateDefaults(manual, template) : stripTemplateId(manual);
  const merged = generated ? mergeProjectAnalysis(generated, base) : base;

  return template ? applyTemplateEntryHints(merged, template) : merged;
}
