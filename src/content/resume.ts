import { profile } from "./profile";
import { publications } from "./publications";

export interface EducationEntry {
  institution: string;
  program: string;
  period: string;
  location?: string;
  note?: string;
}

export interface SkillCategory {
  id: string;
  label: string;
  items: string[];
}

export const resumePage = {
  label: "ABOUT & RESUME",
  title: "关于我",
  subtitle: "Profile · Education · Skills · Publications",
  summary: profile.introduction,
  directions: profile.directions,
  education: [
    {
      institution: "Imperial College London",
      program: "BEng Computing",
      period: "2024.09 — Present",
      location: "London, UK",
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
    "编程实践",
    "计算机系统及结构",
    "离散数学",
    "线性代数",
    "机器学习",
    "软件工程设计",
  ],
  skills: [
    {
      id: "programming-languages",
      label: "Programming Languages",
      items: ["C", "Kotlin", "Haskell", "C#", "Java", "Scala", "Python", "SQL"],
    },
    {
      id: "tools",
      label: "Tools",
      items: ["Git", "GitHub", "GitLab", "Linux"],
    },
    {
      id: "ai-ml",
      label: "AI / ML",
      items: [
        "PyTorch",
        "CNNs",
        "LLM",
        "Prompt Engineering",
        "LangChain",
        "RAG",
        "Vector Databases",
        "Agent Workflow",
      ],
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
