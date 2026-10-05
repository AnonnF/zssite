import { profile } from "./profile";
import { publications } from "./publications";

export interface EducationEntry {
  institution: string;
  program: string;
  period: string;
  location?: string;
  note?: string;
}

export interface ExperienceHighlight {
  title: string;
  detail: string;
}

export interface ExperienceEntry {
  id: string;
  organization: string;
  role: string;
  period: string;
  context: string;
  summary: string;
  highlights: ExperienceHighlight[];
  techStack: string[];
}

export interface SkillCategory {
  id: string;
  label: string;
  items: string[];
}

export const resumePage = {
  label: "ABOUT & RESUME",
  title: "关于我",
  subtitle: "Profile · Experience · Education · Skills · Publications",
  summary: profile.introduction,
  directions: profile.directions,
  experience: [
    {
      id: "rongmeng-java-agent-intern",
      organization: "Rongmeng Technology Co., Ltd",
      role: "Java Backend / AI Agent Development Intern",
      period: "2026.06 — 2026.09",
      context: "内部 LLM / Agent 平台 · Python → Java 迁移",
      summary:
        "参与企业内部 LLM / Agent 平台从 Python 到 Java 的迁移，使用 Spring Boot 与 Spring AI，重点处理 SSE 协议兼容性与 Java 侧 Workflow 运行时能力。",
      highlights: [
        {
          title: "请求级取消",
          detail:
            "将请求取消机制从会话级控制重新设计为基于 request_id 的请求级取消。",
        },
        {
          title: "SSE 终止逻辑",
          detail:
            "重做 SSE 终止逻辑，确保在取消与运行时错误之后流都能干净地结束。",
        },
        {
          title: "Workflow 运行时移植",
          detail:
            "将核心的 Python YAML Workflow 运行时移植到 Java，支持异构执行节点与并行任务。",
        },
        {
          title: "兼容性与回归验证",
          detail:
            "解决 DashScope Tool Calling 的兼容性问题，并编写 49 个协议回归测试来验证行为一致性。",
        },
      ],
      techStack: [
        "Java",
        "Spring Boot",
        "Spring AI",
        "SSE",
        "DashScope",
        "YAML Workflow",
      ],
    },
  ] satisfies ExperienceEntry[],
  education: [
    {
      institution: "Imperial College London",
      program: "MEng Computing",
      period: "2024.09 — 2028.06 (Expected)",
      location: "London, UK",
      note: "3 年本科 + 1 年硕士 · 本科阶段预计 2027.06 完成",
    },
    {
      institution: "Shanghai Guanghua Qidi School",
      program: "High School",
      period: "2022.09 — 2024.06",
      location: "Shanghai, China",
      note: "GPA 4.0 / 4.0",
    },
    {
      institution: "Shanghai Foreign Language School Affiliated to SISU",
      program: "Junior High",
      period: "2021.09 — 2022.06",
      location: "Shanghai, China",
    },
  ] satisfies EducationEntry[],
  coursework: [
    "图论与算法",
    "计算机系统及结构",
    "操作系统",
    "编译器",
    "机器学习",
    "软件工程设计",
    "编程实践",
    "离散数学",
    "线性代数",
  ],
  skills: [
    {
      id: "programming-languages",
      label: "Programming Languages",
      items: ["Java", "Python", "C", "Scala", "SQL", "Kotlin", "Haskell", "C#"],
    },
    {
      id: "backend",
      label: "Backend",
      items: [
        "Spring Boot",
        "Spring AI",
        "SSE",
        "API Development",
        "Error Handling",
        "Concurrent Programming",
      ],
    },
    {
      id: "ai-applications",
      label: "AI Applications",
      items: [
        "LLM Applications",
        "Tool Calling",
        "Agent Workflow",
        "RAG",
        "Prompt Engineering",
        "LangChain",
        "LangGraph",
        "Vector Databases",
      ],
    },
    {
      id: "ml",
      label: "Machine Learning",
      items: ["PyTorch", "CNNs"],
    },
    {
      id: "foundations",
      label: "Systems Foundations",
      items: [
        "Algorithms",
        "Operating Systems",
        "Compilers",
        "Computer Architecture",
      ],
    },
    {
      id: "engineering",
      label: "Engineering",
      items: ["Git", "GitHub", "GitHub Actions", "GitLab", "Linux"],
    },
    {
      id: "other-tools",
      label: "Other Tools",
      items: ["Unity", "Godot", "Blender"],
    },
    {
      id: "language",
      label: "Language",
      items: ["IELTS 7.5 (L 8 · R 8 · W 6.5 · S 7.5)", "中文 · English"],
    },
  ] satisfies SkillCategory[],
  sectionLabels: {
    experience: "Experience",
    education: "Education",
    coursework: "Coursework",
    skills: "Skills",
    publications: "Publications",
    contact: "Contact",
  },
  publications,
  contact: {
    email: profile.email,
    github: profile.github,
    linkedIn: profile.linkedIn,
    resumeDownload: profile.resumeDownload,
  },
};
