import { isPublicAnalyzerEnabled } from "@/lib/siteFeatures";

export interface EntryCardMeta {
  key: string;
  value: string;
}

export interface HomeEntryCard {
  id: string;
  title: string;
  subtitle: string;
  label: string;
  description: string;
  href: string;
  categories: string[];
  meta: EntryCardMeta[];
}

export interface HomeContent {
  entrySectionLabel: string;
  entrySectionTitle: string;
  entrySectionDescription: string;
  entryCta: string;
  placeholderLabel: string;
  placeholderText: string;
  cards: HomeEntryCard[];
}

export const homeContent: HomeContent = {
  entrySectionLabel: "ARCHIVE HUB",
  entrySectionTitle: "功能入口",
  entrySectionDescription: "个人工程档案入口 — 按模块展开，后续可持续扩展",
  entryCta: "ENTER ARCHIVE",
  placeholderLabel: isPublicAnalyzerEnabled() ? "MODULE / 04+" : "MODULE / 03+",
  placeholderText: "更多功能入口即将添加",
  cards: [
    {
      id: "about-resume",
      title: "关于与简历",
      subtitle: "实习经历 · 教育背景 · 技能 · 论文发表",
      label: "ABOUT & RESUME",
      description:
        "查看完整简历信息：实习经历、教育经历、课程、技能分类、论文发表与联系方式。",
      href: "/about",
      categories: ["Profile", "Experience", "Education", "Publications"],
      meta: [
        { key: "MODULE", value: "01" },
        { key: "TYPE", value: "PROFILE" },
        { key: "STATUS", value: "ACTIVE" },
      ],
    },
    {
      id: "project-archive",
      title: "项目经历",
      subtitle: "工程项目 · 技术选择 · 能力成长",
      label: "PROJECT ARCHIVE",
      description:
        "系统整理系统软件、编译器、后端与 AI 应用方向的工程项目，包括课程团队项目与个人项目，并记录每个项目的目标、技术选择与能力成长。",
      href: "/projects",
      categories: ["Projects", "Case Studies", "Engineering Notes"],
      meta: [
        { key: "MODULE", value: "02" },
        { key: "TYPE", value: "ARCHIVE" },
        { key: "STATUS", value: "ACTIVE" },
      ],
    },
    {
      id: "repository-analyzer",
      title: "公开项目解析器",
      subtitle: "仓库分析 · 结构解读 · 分析记录库",
      label: "PUBLIC REPOSITORY ANALYZER",
      description:
        "对公开 GitHub 仓库进行结构分析，生成本地 CLI 命令导入分析结果，并在 Analysis Library 中归档查看。",
      href: "/analyzer",
      categories: ["Analyzer", "Repository", "Analysis Library"],
      meta: [
        { key: "MODULE", value: "03" },
        { key: "TYPE", value: "TOOL" },
        { key: "STATUS", value: "ACTIVE" },
      ],
    },
  ].filter(
    (card) => isPublicAnalyzerEnabled() || card.id !== "repository-analyzer"
  ),
};
