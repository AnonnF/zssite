export interface ProfileLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface Profile {
  nameZh: string;
  nameEn: string;
  identity: string;
  tagline: string;
  introduction: string;
  directions: string[];
  email: string;
  github: ProfileLink;
  linkedIn: ProfileLink;
  resumeDownload: {
    available: boolean;
    href?: string;
    label: string;
  };
}

export const profile: Profile = {
  nameZh: "施展",
  nameEn: "Zhan Shi",
  identity: "Imperial College London · Computing",
  tagline:
    "系统软件、编译器与操作系统项目经验，同时持续探索 AI 应用、RAG 智能体与机器学习工程实践。",
  introduction:
    "Imperial College London Computing 学生，方向涵盖 Software Engineering、AI Engineering、Backend 与 Systems。过去几年里，我完成了从操作系统内核、指令集模拟器、编译器到 LangGraph RAG 智能体、全栈 Web 产品与深度学习实验的一系列项目，习惯把复杂系统拆成可验证的工程模块。",
  directions: [
    "Software Engineering",
    "AI Engineering",
    "Backend",
    "Systems",
  ],
  email: "briansz@126.com",
  github: {
    label: "GitHub",
    href: "https://github.com/AnonnF",
    external: true,
  },
  linkedIn: {
    label: "LinkedIn",
    href: "https://linkedin.com/in/zhan-shi-brian",
    external: true,
  },
  resumeDownload: {
    available: false,
    label: "Resume Download — Coming Soon",
  },
};
