export type ProjectStatus = "ongoing" | "completed" | "archived";

export interface Project {
  slug: string;
  title: string;
  titleEn?: string;
  year: number;
  type: string;
  status: ProjectStatus;
  summary: string;
  summaryEn?: string;
  stack: string[];
  tags: string[];
  ref?: string;
  analysis?: {
    status: "none" | "pending" | "ready";
    source?: "github" | "gitlab" | "local";
    repoUrl?: string;
  };
}

export const projects: Project[] = [
  {
    slug: "armv8-emulator-assembler",
    title: "ARMv8 Emulator & Assembler",
    year: 2024,
    type: "Systems",
    status: "completed",
    summary: "自研 ARMv8 指令集模拟器与汇编器，实现指令解码、寄存器模型与内存访问。",
    stack: ["C", "ARMv8", "Assembly"],
    tags: ["Systems"],
    ref: "REF-001",
    analysis: { status: "none" },
  },
  {
    slug: "wacc-compiler",
    title: "WACC Compiler",
    year: 2024,
    type: "Compiler",
    status: "completed",
    summary: "为 WACC 语言实现完整编译器前端与后端，涵盖词法、语法、语义分析与代码生成。",
    stack: ["Java", "ANTLR", "ARM"],
    tags: ["Compiler", "Systems"],
    ref: "REF-002",
    analysis: { status: "none" },
  },
  {
    slug: "bridgetalk",
    title: "BridgeTalk",
    year: 2025,
    type: "Web",
    status: "completed",
    summary: "面向跨语言沟通的 Web 产品，整合实时交互与结构化对话流程。",
    stack: ["TypeScript", "React", "Next.js"],
    tags: ["Web"],
    ref: "REF-003",
    analysis: { status: "none" },
  },
  {
    slug: "resume-job-matching-agent",
    title: "Resume-Job Matching Agent",
    year: 2025,
    type: "AI",
    status: "completed",
    summary: "基于 LLM 的简历与岗位匹配智能体，支持语义检索与结构化评分输出。",
    stack: ["Python", "LangChain", "OpenAI"],
    tags: ["AI"],
    ref: "REF-004",
    analysis: { status: "none" },
  },
  {
    slug: "langchain-rag-practice",
    title: "LangChain / RAG Practice",
    year: 2025,
    type: "Research",
    status: "completed",
    summary: "RAG 管线实践：文档切分、向量检索、重排序与问答链路调优。",
    stack: ["Python", "LangChain", "Vector DB"],
    tags: ["AI", "Research"],
    ref: "REF-005",
    analysis: { status: "none" },
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
