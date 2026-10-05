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
  identity: "Imperial College London · MEng Computing",
  tagline:
    "以操作系统、编译器与计算机体系结构为底层基础，专注后端工程与 LLM / Agent 应用系统的设计与实现。",
  introduction:
    "Imperial College London MEng Computing 学生，具备操作系统、编译器与计算机体系结构的扎实基础。2026 年夏季参与企业内部 LLM / Agent 平台从 Python 到 Java（Spring Boot、Spring AI）的迁移，处理 SSE 协议兼容、请求级取消与 Workflow 运行时等工程问题。此外完成了 Pintos 内核、WACC 编译器、ARMv8 模拟器与汇编器，以及 RAG Agent、AI 沟通练习平台等项目，习惯把复杂系统拆成可验证的工程模块。",
  directions: [
    "Systems Foundations",
    "Backend Engineering",
    "AI Agent Systems",
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
