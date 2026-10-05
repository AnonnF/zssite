export type PortfolioProjectStatus = "ongoing" | "completed" | "archived";

export interface PortfolioProjectLinks {
  github?: string;
  demo?: string;
  paper?: string;
}

export interface PortfolioProject {
  slug: string;
  title: string;
  subtitle?: string;
  period: string;
  context: string;
  type: string;
  techStack: string[];
  summary: string;
  highlights: string[];
  responsibilities: string[];
  challenges: string[];
  skillsDemonstrated: string[];
  status: PortfolioProjectStatus;
  /** Featured projects use the full archive card; others use a compact row. */
  featured?: boolean;
  links?: PortfolioProjectLinks;
  analysisId?: string;
  sourceSnapshot?: string;
  ref?: string;
}

/**
 * Ordered by start date, most recent first (direction-neutral; not tied to any CV variant).
 * `ref` values are stable archive IDs and intentionally not re-numbered.
 */
export const portfolioProjects: PortfolioProject[] = [
  {
    slug: "bridgetalk",
    title: "Bridge Talk",
    subtitle: "AI 驱动的沟通练习平台",
    period: "2026.05 — 2026.07",
    context: "Imperial College London · Team Project",
    type: "AI Application",
    techStack: [
      "Vue 3",
      "TypeScript",
      "Express",
      "Supabase",
      "GitHub Actions",
      "Vercel",
    ],
    summary:
      "团队协作开发的 AI 沟通练习平台。我主要负责后端 API 与练习流程功能，并接入 LLM 生成个性化反馈。",
    highlights: [
      "围绕练习记录与评分工作流设计并实现 RESTful API",
      "接入 LLM，为练习结果生成个性化反馈",
      "使用 Vue 3 + TypeScript 前端与 Express 后端，Supabase 管理数据与鉴权相关能力",
      "配置 GitHub Actions 持续集成与 Vercel 部署流水线",
    ],
    responsibilities: [
      "主要负责后端 API 与练习流程功能",
      "实现 AI 相关接口编排与前后端协作",
      "建立基础测试与持续集成配置",
      "参与产品信息架构与 Dashboard 交互流程设计",
    ],
    challenges: [
      "AI 请求链路下的延迟与错误反馈设计",
      "多模块协作时的状态一致性与接口契约维护",
    ],
    skillsDemonstrated: ["后端 API 设计", "AI 产品化", "DevOps", "团队协作"],
    status: "completed",
    featured: true,
    ref: "REF-004",
    sourceSnapshot: "project-experience/bridgetalk",
  },
  {
    slug: "rag-agent",
    title: "LangChain / LangGraph RAG Agent",
    subtitle: "知识库问答智能体",
    period: "2026.03 — 2026.06",
    context: "Personal Project · AI Engineering",
    type: "AI Application",
    techStack: [
      "Python",
      "LangChain",
      "LangGraph",
      "OpenAI",
      "Chroma",
      "SQLite",
    ],
    summary:
      "基于 LangChain 与 LangGraph 构建的 RAG Agent，将文档检索整合进多轮问答，支持任务路由与持久化状态。",
    highlights: [
      "支持 PDF / DOCX / Markdown 文档切分与 OpenAI Embeddings 索引",
      "实现 Similarity Search、MMR 与 Vectorstore Retriever 组合检索",
      "使用 LangGraph State / Node / Edge 组织 Agent 工作流，实现任务路由，并接入 SQLite Checkpointer 持久化状态",
    ],
    responsibilities: [
      "设计 RAG 管线与检索策略",
      "实现 Agent 状态持久化与线程级会话管理",
      "针对召回质量与回答稳定性做迭代调优",
    ],
    challenges: [
      "chunk 策略与召回精度、多样性的平衡",
      "多步 Agent 流程中的状态一致性与失败恢复",
    ],
    skillsDemonstrated: ["RAG 系统", "Agent 设计", "LLM 应用工程"],
    status: "completed",
    ref: "REF-005",
    sourceSnapshot: "project-experience/rag-agent",
  },
  {
    slug: "wacc-compiler",
    title: "WACC Compiler",
    subtitle: "团队协作的完整编译器：从源码解析到 ARM 代码生成",
    period: "2026.01 — 2026.03",
    context: "Imperial College London · Compiler Course · Team Project",
    type: "Compiler",
    techStack: ["Scala", "Parsley", "ARM"],
    summary:
      "与队友协作为 WACC 语言实现从源码解析到 ARM 代码生成的完整编译器。我的贡献集中在语义分析、控制流分析与后端代码生成，并参与了常量传播、解释器与模块导入等扩展。",
    highlights: [
      "协作完成从源码解析到 ARM 代码生成的完整编译流水线",
      "参与语义分析、控制流分析与后端代码生成",
      "扩展常量传播、解释器与模块导入，并加入循环依赖检测以提升模块化与可测试性",
    ],
    responsibilities: [
      "参与语义分析与控制流分析（CFG）的设计与实现",
      "参与后端 ARM 代码生成，处理函数调用、栈帧与运行时布局",
      "与团队共同推进扩展功能：常量传播、解释器、模块导入与循环依赖检测",
    ],
    challenges: [
      "复杂语法结构下的 AST 与类型推导一致性",
      "调用约定与栈帧布局的正确代码生成",
      "模块导入场景下的循环依赖检测",
    ],
    skillsDemonstrated: ["编译原理", "语言实现", "代码生成", "团队协作"],
    status: "completed",
    featured: true,
    analysisId: "wacc-compiler",
    ref: "REF-003",
    sourceSnapshot: "project-experience/wacc-compiler",
  },
  {
    slug: "pintos",
    title: "Pintos",
    subtitle: "操作系统内核开发",
    period: "2025.10 — 2025.11",
    context: "Imperial College London · OS Course Project",
    type: "Systems",
    techStack: ["C", "x86 Assembly", "Pintos"],
    summary:
      "在 Pintos 教学操作系统上扩展用户程序支持，实现系统调用、进程管理与安全的用户内存访问，并实现优先级调度与递归优先级捐赠。",
    highlights: [
      "实现 12+ 个系统调用，包括 exec、wait、exit、open、read、write、close",
      "处理进程生命周期管理、文件访问与安全的用户内存访问",
      "实现优先级调度与递归优先级捐赠以解决优先级反转，使用 locks 与 semaphores 协调相互依赖线程间的同步",
      "处理内核态与用户态切换中的同步与资源回收问题",
    ],
    responsibilities: [
      "设计并实现用户程序子系统与系统调用分发逻辑",
      "实现优先级调度与递归优先级捐赠",
      "编写内核测试用例并调试并发与资源泄漏问题",
      "阅读 Pintos 文档与参考实现，迭代完善边界条件处理",
    ],
    challenges: [
      "用户态指针校验与内核缓冲区安全拷贝",
      "多进程场景下的文件描述符与退出状态管理",
      "优先级反转与嵌套捐赠场景下的同步正确性",
    ],
    skillsDemonstrated: ["系统编程", "内核调试", "进程模型", "并发与同步"],
    status: "completed",
    featured: true,
    ref: "REF-001",
    sourceSnapshot: "project-experience/pintos",
  },
  {
    slug: "armv8-emulator-assembler",
    title: "ARMv8 Emulator & Assembler",
    subtitle: "A64 指令子集模拟器与汇编器",
    period: "2025.05 — 2025.06",
    context: "Imperial College London · Systems Project",
    type: "Systems",
    techStack: ["C", "ARMv8", "AArch64", "Assembly"],
    summary:
      "使用 C 实现 A64 指令子集的模拟器与两遍（two-pass）汇编器，支持汇编解析、机器码生成、模拟执行与自动化结果验证。",
    highlights: [
      "实现 A64 指令子集的解码与执行主循环",
      "构建两遍汇编器，完成汇编解析与机器码生成",
      "设计通用寄存器组与内存映射抽象，并通过自动化测试验证执行结果",
    ],
    responsibilities: [
      "实现指令编码解析与仿真执行环境",
      "编写汇编器词法/语法处理与输出格式",
      "通过测试程序验证指令语义与边界行为",
    ],
    challenges: [
      "指令格式多样情况下的解码正确性",
      "模拟器状态可观测性与错误定位",
    ],
    skillsDemonstrated: ["ISA 理解", "底层工具链", "C 工程化"],
    status: "completed",
    featured: true,
    ref: "REF-002",
    sourceSnapshot: "project-experience/armv8-emulator-assembler",
  },
  {
    slug: "drone-llm-research",
    title: "Drone Pathfinding × LLM",
    subtitle: "通过大语言模型控制无人机",
    period: "2025",
    context: "Research Project",
    type: "Research",
    techStack: ["Python", "LLM", "Algorithms"],
    summary:
      "探索通过大语言模型控制无人机：以自然语言指令驱动无人机行为，并研究路径规划算法与 LLM 的结合方式。",
    highlights: [
      "调研无人机路径规划算法与 LLM 推理能力边界",
      "设计算法输出与语言模型交互的中间表示",
      "验证关键词 / 指令到路径方案的映射可行性",
    ],
    responsibilities: [
      "梳理问题定义与实验假设",
      "实现原型流程并记录阶段性结果",
      "整理论文式实验描述与结论",
    ],
    challenges: [
      "算法确定性与 LLM 生成结果之间的对齐",
      "研究原型向可验证系统转化的工程边界",
    ],
    skillsDemonstrated: ["算法研究", "LLM 应用", "跨领域整合"],
    status: "completed",
    ref: "REF-008",
  },
  {
    slug: "pytorch-cifar-10",
    title: "PyTorch CIFAR-10",
    subtitle: "卷积神经网络图像分类",
    period: "2024.12 — 2025.03",
    context: "Personal Project · Machine Learning",
    type: "ML",
    techStack: ["Python", "PyTorch", "CNN"],
    summary:
      "基于 PyTorch 在 CIFAR-10 上训练 CNN 图像分类模型，完成数据管线、训练循环与性能评估。",
    highlights: [
      "实现可复用的训练 / 验证循环与指标记录",
      "设计 CNN 结构并调优超参数",
      "在测试集上达到约 85% 分类准确率",
    ],
    responsibilities: [
      "搭建数据加载、增强与批处理流程",
      "实验不同网络结构与正则化策略",
      "记录实验结果并分析过拟合与收敛行为",
    ],
    challenges: [
      "小图像数据集上的过拟合控制",
      "训练稳定性与实验可复现性",
    ],
    skillsDemonstrated: ["深度学习", "PyTorch", "实验设计"],
    status: "completed",
    ref: "REF-007",
    sourceSnapshot: "project-experience/pytorch-cifar-10",
  },
  {
    slug: "unity-rpg",
    title: "Unity 2D RPG",
    subtitle: "角色扮演游戏原型",
    period: "2024.03 — Present",
    context: "Personal Project · Game Dev",
    type: "Game",
    techStack: ["C#", "Unity", "2D"],
    summary:
      "使用 Unity 开发的 2D RPG 原型，覆盖角色控制、战斗逻辑、关卡交互与基于 FSM 的游戏状态管理。",
    highlights: [
      "实现角色移动、动画与输入响应",
      "搭建战斗系统与基础 UI 流程",
      "使用有限状态机组织角色与关卡逻辑",
    ],
    responsibilities: [
      "设计核心玩法循环与场景交互",
      "实现角色、敌人与触发器组件",
      "调试碰撞、动画与游戏状态切换",
    ],
    challenges: [
      "FSM 扩展性与玩法模块解耦",
      "2D 碰撞与战斗时序的稳定性",
    ],
    skillsDemonstrated: ["游戏开发", "C#", "交互设计"],
    status: "ongoing",
    ref: "REF-006",
    sourceSnapshot: "project-experience/unity-rpg",
  },
];

export function getPortfolioProjectBySlug(
  slug: string
): PortfolioProject | undefined {
  return portfolioProjects.find((project) => project.slug === slug);
}

export function getPortfolioProjectByAnalysisId(
  analysisId: string
): PortfolioProject | undefined {
  return portfolioProjects.find((project) => project.analysisId === analysisId);
}

/** @deprecated Use `portfolioProjects` from this module directly. */
export const projects = portfolioProjects;

export function getProjectBySlug(slug: string): PortfolioProject | undefined {
  return getPortfolioProjectBySlug(slug);
}
