import { profile } from "./profile";
import { isPublicAnalyzerEnabled } from "@/lib/siteFeatures";

export interface NavItem {
  label: string;
  href: string;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface SiteContent {
  brand: {
    logo: string;
    logoAlt: string;
    secondary: string;
  };
  nav: NavItem[];
  languageToggle: {
    zh: string;
    en: string;
    /** aria-labels for the two toggle targets (current / switch-to). */
    zhLabel: string;
    enLabel: string;
  };
  hero: {
    title: string;
    nameEn: string;
    subtitle: string;
    label: string;
    description: string;
    keywords: string[];
  };
  aboutPreview: {
    label: string;
    items: string[];
    cta: string;
  };
  contactPage: {
    label: string;
    title: string;
    /** Rendered as `${intro}<link>${outro}` where link points to /about. */
    intro: string;
    aboutLinkText: string;
    outro: string;
  };
  seo: {
    title: string;
    description: string;
  };
  footer: {
    copyright: string;
    links: FooterLink[];
  };
  backToHome: string;
  projectsPage: {
    title: string;
    label: string;
    description: string;
    listLabel: string;
    listDescription: string;
    detailComingSoon: string;
    viewDetail: string;
  };
  projectDetail: {
    backToProjects: string;
    caseLabel: string;
    walkthroughLabel: string;
    walkthroughUnavailable: string;
    /** Shown on locales where the code walkthrough is not translated. */
    walkthroughZhOnly: string;
    viewChineseVersion: string;
  };
  analyzerPage: {
    title: string;
    label: string;
    description: string;
    libraryLabel: string;
    libraryDescription: string;
    viewDetail: string;
    unavailable: string;
  };
  analyzerDetail: {
    backToAnalyzer: string;
    analysisLabel: string;
    analysisUnavailable: string;
  };
  placeholders: {
    about: { label: string; title: string; message: string };
    contact: { label: string; title: string; message: string };
  };
}

export const siteContent: SiteContent = {
  brand: {
    logo: "/images/zssite-zs-logo-transparent-cropped.png",
    logoAlt: "ZS",
    secondary: "SITE",
  },
  nav: [
    { label: "首页", href: "/" },
    { label: "项目", href: "/projects" },
    ...(isPublicAnalyzerEnabled()
      ? [{ label: "解析器", href: "/analyzer" }]
      : []),
    { label: "关于", href: "/about" },
    { label: "联系", href: "/contact" },
  ],
  languageToggle: {
    zh: "中",
    en: "EN",
    zhLabel: "当前语言：中文",
    enLabel: "切换至英文",
  },
  hero: {
    title: profile.nameZh,
    nameEn: profile.nameEn,
    subtitle: profile.identity,
    label: "PERSONAL SITE / ENGINEERING ARCHIVE",
    description: profile.tagline,
    keywords: profile.directions,
  },
  aboutPreview: {
    label: "ABOUT",
    items: [
      `${profile.nameEn} / ${profile.nameZh}`,
      profile.identity,
      profile.directions.join(" · "),
      profile.tagline,
    ],
    cta: "查看完整简历",
  },
  contactPage: {
    label: "CONTACT",
    title: "联系",
    intro: "欢迎通过以下渠道联系我。完整简历信息请见",
    aboutLinkText: "关于页面",
    outro: "。",
  },
  seo: {
    title: "ZSsite — 施展",
    description: `施展（${profile.nameEn}）的个人网站与工程项目档案。${profile.identity}，聚焦系统基础、后端工程与 LLM / Agent 应用。`,
  },
  footer: {
    copyright: "© 2026 ZSsite",
    links: [
      { label: "GitHub", href: profile.github.href },
      { label: "LinkedIn", href: profile.linkedIn.href },
      { label: "Email", href: `mailto:${profile.email}` },
      { label: "About", href: "/about" },
    ],
  },
  backToHome: "返回首页",
  projectsPage: {
    title: "项目经历",
    label: "PROJECT ARCHIVE",
    description:
      "系统、后端与 AI 应用方向的工程项目，包括课程团队项目与个人项目。这里记录每个项目的目标、技术选择与能力成长。",
    listLabel: "Portfolio Projects",
    listDescription:
      "按开始时间由近到远排列，涵盖系统软件、编译器、后端与 AI 应用，以及部分个人探索项目。",
    detailComingSoon: "ENTER CASE →",
    viewDetail: "ENTER CASE →",
  },
  projectDetail: {
    backToProjects: "返回项目列表",
    caseLabel: "PROJECT CASE",
    walkthroughLabel: "PROJECT WALKTHROUGH",
    walkthroughUnavailable: "该项目的代码导读尚未就绪。",
    walkthroughZhOnly: "",
    viewChineseVersion: "",
  },
  analyzerPage: {
    title: "公开项目解析器",
    label: "PUBLIC REPOSITORY ANALYZER",
    description:
      "对公开 GitHub 仓库进行结构分析并归档为分析记录。工具生成或导入的结果存放在 Analysis Library，与作品集项目数据分离。",
    libraryLabel: "Analysis Library",
    libraryDescription:
      "已分析过的公开仓库记录。此处为工具输出与导入档案，不等同于「项目经历」。",
    viewDetail: "查看分析 →",
    unavailable: "分析数据尚未就绪",
  },
  analyzerDetail: {
    backToAnalyzer: "返回分析记录库",
    analysisLabel: "REPOSITORY ANALYSIS",
    analysisUnavailable: "该分析记录的结构数据尚未就绪。",
  },
  placeholders: {
    about: {
      label: "ABOUT",
      title: "关于",
      message: "此页面即将推出。",
    },
    contact: {
      label: "CONTACT",
      title: "联系",
      message: "此页面即将推出。",
    },
  },
};
