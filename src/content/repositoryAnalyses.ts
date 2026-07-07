import type { ProjectTemplateId } from "@/data/projects/types";

export type RepositoryAnalysisReviewStatus =
  | "ai-draft"
  | "human-reviewed"
  | "manual"
  | "needs-review";

export interface RepositoryAnalysis {
  /** 分析记录唯一 ID，用于 /analyzer/:analysisId */
  analysisId: string;
  /** 内部 analyzer 数据注册键（与 generated/manual registry 对齐） */
  analyzerProjectId: string;
  title: string;
  summary: string;
  repoUrl: string;
  repoOwner: string;
  repoName: string;
  analyzedAt: string;
  reviewStatus: RepositoryAnalysisReviewStatus;
  templateId?: ProjectTemplateId;
  stack: string[];
  tags: string[];
  /** 若对应作品集项目，仅作展示链接，不合并数据 */
  linkedPortfolioSlug?: string;
}

export const repositoryAnalyses: RepositoryAnalysis[] = [
  {
    analysisId: "wacc-compiler",
    analyzerProjectId: "wacc-compiler",
    title: "WACC Compiler",
    summary:
      "WACC 编译器仓库结构分析：前端 ANTLR 管线、语义检查与 ARM 代码生成模块。",
    repoUrl: "https://github.com/AnonnF/wacc-compiler",
    repoOwner: "AnonnF",
    repoName: "wacc-compiler",
    analyzedAt: "2025-11-12",
    reviewStatus: "human-reviewed",
    templateId: "compiler-pipeline",
    stack: ["Java", "ANTLR", "ARM"],
    tags: ["Compiler", "Manual"],
    linkedPortfolioSlug: "wacc-compiler",
  },
  {
    analysisId: "resume-jd-matcher",
    analyzerProjectId: "resume-jd-matcher",
    title: "Resume-JD Matcher",
    summary:
      "基于 Streamlit 与 DeepSeek 的简历—岗位匹配工具，上传 PDF 简历并粘贴 JD，生成结构化匹配报告。",
    repoUrl: "https://github.com/AnonnF/Resume-JD-Matcher",
    repoOwner: "AnonnF",
    repoName: "Resume-JD-Matcher",
    analyzedAt: "2026-02-18",
    reviewStatus: "ai-draft",
    templateId: "ai-pipeline",
    stack: ["Python", "Streamlit", "DeepSeek"],
    tags: ["AI", "Imported"],
  },
  {
    analysisId: "read-any",
    analyzerProjectId: "read-any",
    title: "ReadAny",
    summary:
      "从 GitHub 导入的公开仓库分析记录，聚焦文档阅读与知识提取相关模块。",
    repoUrl: "https://github.com/codedogQBY/ReadAny",
    repoOwner: "codedogQBY",
    repoName: "ReadAny",
    analyzedAt: "2026-03-01",
    reviewStatus: "ai-draft",
    templateId: "ai-pipeline",
    stack: ["Markdown", "JSON", "YAML", "Python"],
    tags: ["AI", "Imported"],
  },
];

export function getRepositoryAnalysisById(
  analysisId: string
): RepositoryAnalysis | undefined {
  return repositoryAnalyses.find((item) => item.analysisId === analysisId);
}

export function getRepositoryAnalysisByAnalyzerProjectId(
  analyzerProjectId: string
): RepositoryAnalysis | undefined {
  return repositoryAnalyses.find(
    (item) => item.analyzerProjectId === analyzerProjectId
  );
}

export function reviewStatusToReviewMeta(
  status: RepositoryAnalysisReviewStatus
): import("@/data/projects/types").ReviewMeta {
  switch (status) {
    case "human-reviewed":
      return {
        status: "human-reviewed",
        source: "mixed",
        note: "该分析已由人工审核。",
      };
    case "manual":
      return { status: "manual", source: "manual" };
    case "needs-review":
      return {
        status: "needs-review",
        source: "ai-draft",
        note: "该分析需要人工复核。",
      };
    case "ai-draft":
    default:
      return {
        status: "ai-draft",
        source: "ai-draft",
        note: "该分析由 AI 自动生成，尚未人工审核。",
      };
  }
}
