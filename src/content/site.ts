import { profile } from "./profile";

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
    detailComingSoon: string;
    viewDetail: string;
  };
  projectDetail: {
    backToProjects: string;
    walkthroughLabel: string;
    walkthroughUnavailable: string;
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
    { label: "解析器", href: "/analyzer" },
    { label: "关于", href: "/about" },
    { label: "联系", href: "/contact" },
  ],
  languageToggle: {
    zh: "中",
    en: "EN",
  },
  hero: {
    title: profile.nameZh,
    nameEn: profile.nameEn,
    subtitle: "Imperial College London · Computing",
    label: "PERSONAL SITE / ENGINEERING ARCHIVE",
    description: profile.tagline,
    keywords: ["Systems", "AI Applications", "Web Products"],
  },
  aboutPreview: {
    label: "ABOUT",
    items: [
      `${profile.nameEn} / ${profile.nameZh}`,
      profile.identity,
      "Systems · AI Applications · Web Products",
      profile.tagline,
    ],
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
      "大学阶段完成的工程项目、AI 应用与 Web 产品。这里记录每个项目的目标、技术选择、结构分析和能力成长。",
    detailComingSoon: "查看详情 →",
    viewDetail: "查看项目 →",
  },
  projectDetail: {
    backToProjects: "返回项目列表",
    walkthroughLabel: "PROJECT WALKTHROUGH",
    walkthroughUnavailable: "该项目的代码导读尚未就绪。",
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
