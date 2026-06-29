export interface EntryCardMeta {
  key: string;
  value: string;
}

export interface HomeEntryCard {
  id: string;
  title: string;
  label: string;
  description: string;
  href: string;
  meta: EntryCardMeta[];
}

export interface HomeContent {
  entrySectionLabel: string;
  entrySectionTitle: string;
  entryCta: string;
  cards: HomeEntryCard[];
}

export const homeContent: HomeContent = {
  entrySectionLabel: "MODULES",
  entrySectionTitle: "功能入口",
  entryCta: "进入模块 →",
  cards: [
    {
      id: "project-archive",
      title: "项目经历",
      label: "PROJECT ARCHIVE",
      description:
        "系统整理我在大学阶段完成的工程项目、AI 应用、Web 产品与设计研究，并记录每个项目中的技术决策、结构分析和能力成长。",
      href: "/projects",
      meta: [
        { key: "MODULE", value: "01" },
        { key: "TYPE", value: "ARCHIVE" },
        { key: "STATUS", value: "ACTIVE" },
      ],
    },
  ],
};
