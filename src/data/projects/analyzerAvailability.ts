import { getPortfolioProjectBySlug } from "@/content/projects";
import { getRepositoryAnalysisById } from "@/content/repositoryAnalyses";
import { getProjectPublicationFlags } from "./projectPublicationFlags";

/**
 * Lightweight availability checks for list / card UIs.
 * Do not import generated or highlighted analyzer payloads here.
 */

function isAnalyzerProjectReady(analyzerProjectId: string): boolean {
  return Boolean(getProjectPublicationFlags(analyzerProjectId)?.enabled);
}

export function hasRepositoryAnalyzer(analysisId: string): boolean {
  const analysis = getRepositoryAnalysisById(analysisId);
  if (!analysis) return false;
  return isAnalyzerProjectReady(analysis.analyzerProjectId);
}

export function hasPortfolioWalkthrough(slug: string): boolean {
  const project = getPortfolioProjectBySlug(slug);
  if (!project?.analysisId) return false;
  return hasRepositoryAnalyzer(project.analysisId);
}

export function hasProjectAnalyzer(projectId: string): boolean {
  return isAnalyzerProjectReady(projectId);
}
