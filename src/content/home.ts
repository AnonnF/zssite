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
  entrySectionLabel: "MODULES",
  entrySectionTitle: "功能入口",
  entrySectionDescription: "个人站点功能入口 — 按需展开各模块",
  entryCta: "Enter →",
  placeholderLabel: "MODULE / 02+",
  placeholderText: "更多功能入口即将添加",
  cards: [
    {
      id: "project-archive",
      title: "项目经历",
      subtitle: "工程项目 · 技术决策 · 能力成长",
      label: "PROJECT ARCHIVE",
      description:
        "系统整理我在大学阶段完成的工程项目、AI 应用、Web 产品与设计研究，并记录每个项目中的技术决策、结构分析和能力成长。",
      href: "/projects",
      categories: ["Projects", "Case Studies", "Engineering Notes"],
      meta: [
        { key: "MODULE", value: "01" },
        { key: "TYPE", value: "ARCHIVE" },
        { key: "STATUS", value: "ACTIVE" },
      ],
    },
  ],
};
