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
  projectsPage: {
    title: string;
    label: string;
    description: string;
    detailComingSoon: string;
    viewDetail: string;
  };
  projectDetail: {
    backToProjects: string;
    analyzerLabel: string;
    analyzerUnavailable: string;
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
    { label: "关于", href: "/about" },
    { label: "联系", href: "/contact" },
  ],
  languageToggle: {
    zh: "中",
    en: "EN",
  },
  hero: {
    title: "施展",
    subtitle: "个人网站",
    label: "PERSONAL SITE / ENGINEERING ARCHIVE",
    description:
      "Imperial Computing 背景，聚焦 AI & ML、系统级工程项目、AI 应用落地与 Web 产品开发。",
    keywords: ["AI & ML", "Systems", "AI Apps", "Web Dev"],
  },
  aboutPreview: {
    label: "ABOUT",
    items: [
      "Imperial College London",
      "Computing / AI & ML",
      "对工程项目、AI 应用、系统开发和产品化感兴趣",
    ],
  },
  footer: {
    copyright: "© 2026 ZSsite",
    links: [
      { label: "GitHub", href: "#" },
      { label: "LinkedIn", href: "#" },
      { label: "Email", href: "#" },
      { label: "CV", href: "#" },
    ],
  },
  projectsPage: {
    title: "项目经历",
    label: "PROJECT ARCHIVE",
    description:
      "大学阶段完成的工程项目、AI 应用与 Web 产品，记录技术决策、结构分析与能力成长。",
    detailComingSoon: "查看详情 →（即将推出）",
    viewDetail: "查看详情 →",
  },
  projectDetail: {
    backToProjects: "返回项目列表",
    analyzerLabel: "PROJECT ANALYZER",
    analyzerUnavailable: "该项目的结构分析尚未就绪。",
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
