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
  links?: PortfolioProjectLinks;
  analysisId?: string;
  sourceSnapshot?: string;
  ref?: string;
}

export const portfolioProjects: PortfolioProject[] = [
  {
    slug: "pintos",
    title: "Pintos",
    subtitle: "操作系统内核开发",
    period: "2025.10 — 2025.11",
    context: "Imperial College London · OS Course Project",
    type: "Systems",
    techStack: ["C", "x86", "Pintos"],
    summary:
      "在 Pintos 教学操作系统上实现用户程序、系统调用与同步机制，完成从内核启动到用户态执行的完整链路。",
    highlights: [
      "实现 12+ 个系统调用，包括 exec、wait、exit、open、read、write、close",
      "完成用户程序加载、参数传递与进程生命周期管理",
      "处理内核态与用户态切换中的同步与资源回收问题",
    ],
    responsibilities: [
      "设计并实现用户程序子系统与系统调用分发逻辑",
      "编写内核测试用例并调试并发与资源泄漏问题",
      "阅读 Pintos 文档与参考实现，迭代完善边界条件处理",
    ],
    challenges: [
      "用户态指针校验与内核缓冲区安全拷贝",
      "多进程场景下的文件描述符与退出状态管理",
    ],
    skillsDemonstrated: ["系统编程", "内核调试", "进程模型"],
    status: "completed",
    ref: "REF-001",
    sourceSnapshot: "project-experience/pintos",
  },
  {
    slug: "armv8-emulator-assembler",
    title: "ARMv8 Emulator & Assembler",
    subtitle: "AArch64 模拟器与汇编器",
    period: "2025.05 — 2025.06",
    context: "Imperial College London · Systems Project",
    type: "Systems",
    techStack: ["C", "ARMv8", "AArch64", "Assembly"],
    summary:
      "自研 AArch64 指令集模拟器与汇编器，覆盖指令解码、寄存器模型、内存访问与基础程序执行。",
    highlights: [
      "实现 ARMv8 A64 指令解码与执行主循环",
      "构建汇编器前端，完成助记符到机器码的转换",
      "设计通用寄存器组与内存映射抽象，支持基础程序跑通",
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
    ref: "REF-002",
    sourceSnapshot: "project-experience/armv8-emulator-assembler",
  },
  {
    slug: "wacc-compiler",
    title: "WACC Compiler",
    subtitle: "完整编译器前端与 ARM 后端",
    period: "2026.01 — 2026.03",
    context: "Imperial College London · Compiler Course",
    type: "Compiler",
    techStack: ["Scala", "Parsley", "ARM"],
    summary:
      "为 WACC 语言实现自前端到后端的完整编译器，覆盖语法分析、语义检查、CFG 构建与 ARM 汇编生成。",
    highlights: [
      "使用 Parsley 构建 AST 与语法分析管线",
      "实现类型检查、作用域分析与中间表示生成",
      "生成 ARM 汇编并处理函数调用、栈帧与运行时布局",
    ],
    responsibilities: [
      "设计多 Pass 编译流程与符号表结构",
      "实现语义错误报告与源码位置追踪",
      "完成后端代码生成与集成测试",
    ],
    challenges: [
      "复杂语法结构下的 AST 与类型推导一致性",
      "调用约定与栈帧布局的正确代码生成",
    ],
    skillsDemonstrated: ["编译原理", "语言实现", "代码生成"],
    status: "completed",
    analysisId: "wacc-compiler",
    ref: "REF-003",
    sourceSnapshot: "project-experience/wacc-compiler",
  },
  {
    slug: "bridgetalk",
    title: "Bridge Talk",
    subtitle: "AI 驱动的跨语言沟通 Web 应用",
    period: "2026.05 — Present",
    context: "Personal Project",
    type: "AI Application",
    techStack: ["Vue 3", "TypeScript", "Express", "Supabase"],
    summary:
      "面向跨语言沟通场景的全栈 Web 产品，整合 AI 辅助对话、后台管理与可部署的现代化工程流程。",
    highlights: [
      "搭建 Vue 3 + TypeScript 前端与 Express REST API 后端",
      "使用 Supabase 管理数据与鉴权相关能力",
      "配置 GitHub Actions CI 与 Vercel 部署流水线",
    ],
    responsibilities: [
      "设计产品信息架构与 Dashboard 交互流程",
      "实现 AI 相关接口编排与前后端协作",
      "建立基础测试与持续集成配置",
    ],
    challenges: [
      "AI 请求链路下的延迟与错误反馈设计",
      "多模块协作时的状态一致性与接口契约维护",
    ],
    skillsDemonstrated: ["全栈 Web", "AI 产品化", "DevOps"],
    status: "ongoing",
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
      "基于 LangChain 与 LangGraph 构建可检索增强的 Agent，支持多格式文档导入、向量检索与有状态对话。",
    highlights: [
      "支持 PDF / DOCX / Markdown 文档切分与 OpenAI Embeddings 索引",
      "实现 Similarity Search、MMR 与 Vectorstore Retriever 组合检索",
      "使用 LangGraph State / Node / Edge 组织 Agent 工作流，并接入 SQLite Checkpointer",
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
    status: "ongoing",
    ref: "REF-005",
    sourceSnapshot: "project-experience/rag-agent",
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
  {
    slug: "pytorch-cifar-10",
    title: "PyTorch CIFAR-10",
    subtitle: "卷积神经网络图像分类",
    period: "2024.12 — 2025.03",
    context: "Imperial College London · ML Coursework",
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
    slug: "drone-llm-research",
    title: "Drone Pathfinding × LLM",
    subtitle: "无人机算法与 LLM 结合研究",
    period: "2025",
    context: "Research Project",
    type: "Research",
    techStack: ["Python", "LLM", "Algorithms"],
    summary:
      "探索将无人机路径规划算法与大语言模型结合，研究自然语言指令驱动下的路径生成与任务理解。",
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
