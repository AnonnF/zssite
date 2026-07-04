import type { ProjectTemplate, ProjectTemplateId } from "./types";

const compilerPipelineTemplate: ProjectTemplate = {
  templateId: "compiler-pipeline",
  label: "Compiler Pipeline",
  description: "用于解释从源代码到目标代码生成的多阶段编译器项目。",
  defaultPipeline: [
    {
      id: "source",
      label: "Source Code",
      path: "README.md",
      language: "Markdown",
      role: "项目说明与输入程序示例",
    },
    {
      id: "lexer",
      label: "Lexer",
      path: "src/lexer",
      language: "Scala",
      role: "将源文本转换为 token",
    },
    {
      id: "parser",
      label: "Parser",
      path: "src/parser",
      language: "Scala",
      role: "构建抽象语法树",
    },
    {
      id: "ast",
      label: "AST",
      path: "src/ast",
      language: "Scala",
      role: "供后续阶段共享的中间表示",
    },
    {
      id: "semantic",
      label: "Semantic Checker",
      path: "src/semantic",
      language: "Scala",
      role: "校验类型、作用域与程序规则",
    },
    {
      id: "codegen",
      label: "Codegen",
      path: "src/codegen",
      language: "Scala",
      role: "生成目标平台代码",
    },
    {
      id: "tests",
      label: "Tests",
      path: "tests",
      language: "Scala",
      role: "分阶段验证编译器行为",
    },
  ],
  defaultGuidedTour: [
    {
      id: "overview",
      label: "Overview",
      path: "",
      title: "Project Overview",
      description:
        "先从项目根目录理解整体结构和编译器的主要阶段，建立对项目的全局认识。",
    },
    {
      id: "lexer",
      label: "Lexer",
      path: "src/lexer",
      title: "Lexical Analysis",
      description: "查看词法分析模块如何将源文本切分为 token stream。",
    },
    {
      id: "parser",
      label: "Parser",
      path: "src/parser",
      title: "Parsing Stage",
      description: "理解 Parser 如何根据语法规则构建 AST。",
    },
    {
      id: "ast",
      label: "AST",
      path: "src/ast",
      title: "AST Definitions",
      description: "查看 AST 类型定义，理解 Parser 与 Semantic Checker 之间的边界。",
    },
    {
      id: "semantic",
      label: "Semantic",
      path: "src/semantic",
      title: "Semantic Checking",
      description: "查看类型检查、作用域解析与语义错误检测如何完成。",
    },
    {
      id: "codegen",
      label: "Codegen",
      path: "src/codegen",
      title: "Code Generation",
      description: "理解 AST 如何被降低为目标平台代码。",
    },
    {
      id: "tests",
      label: "Tests",
      path: "tests",
      title: "Testing Strategy",
      description: "查看测试结构，理解项目如何分阶段验证 compiler pipeline。",
    },
  ],
  folderRoleHints: {
    lexer: "词法分析相关模块",
    parser: "语法分析相关模块",
    ast: "抽象语法树定义",
    semantic: "语义检查相关模块",
    typechecker: "类型检查相关模块",
    codegen: "目标代码生成相关模块",
    backend: "后端代码生成相关模块",
    tests: "测试与验证",
    test: "测试与验证",
  },
  analysisChecklist: {
    folder: ["Purpose", "Responsibilities", "Input / Output", "Related Modules", "Notes"],
    file: ["Role", "Key Logic", "Used By / Related To", "Notes"],
  },
  suggestedSkills: [
    {
      title: "Compiler Pipeline Design",
      description: "通过分阶段编译结构，展示对编译器整体流程的设计能力。",
    },
    {
      title: "Parsing and AST Modelling",
      description: "通过 Parser 与 AST 定义，展示对程序结构与语法建模的掌握。",
    },
    {
      title: "Semantic Analysis",
      description: "通过类型检查与作用域规则，展示静态语义分析能力。",
    },
  ],
  suggestedTechnicalDecisions: [
    {
      title: "为什么采用分阶段 compiler pipeline",
      decision: "将编译过程拆分为 Lexer、Parser、AST、Semantic Checker 和 Codegen。",
      rationale: "每个阶段都有明确的输入输出，错误更容易定位，模块可以独立开发与测试。",
      impact: "提高了可维护性，并让前后端职责边界更清晰。",
    },
    {
      title: "为什么把 AST 作为 Parser 和 Semantic Checker 之间的边界",
      decision: "用独立的 AST 模块承载程序结构，Parser 只负责构建，Semantic Checker 只负责校验。",
      rationale: "AST 作为稳定中间表示，可以隔离语法细节与语义规则。",
      impact: "后续扩展语义规则或替换 parser 实现时，不必重写整个前端。",
    },
  ],
};

const systemsProjectTemplate: ProjectTemplate = {
  templateId: "systems-project",
  label: "Systems Project",
  description: "用于解释底层系统、模拟器、汇编器或运行时相关项目。",
  defaultPipeline: [
    {
      id: "source",
      label: "Input Program",
      path: "README.md",
      language: "Markdown",
      role: "项目说明与输入格式",
    },
    {
      id: "parser",
      label: "Parser / Decoder",
      path: "src/parser",
      language: "C",
      role: "解析输入程序或指令编码",
    },
    {
      id: "core",
      label: "Execution Core",
      path: "src/core",
      language: "C",
      role: "指令执行与调度核心",
    },
    {
      id: "memory",
      label: "Memory / Registers",
      path: "src/memory",
      language: "C",
      role: "寄存器模型与内存访问",
    },
    {
      id: "tests",
      label: "Output / Tests",
      path: "tests",
      language: "C",
      role: "输出验证与测试用例",
    },
  ],
  defaultGuidedTour: [
    {
      id: "overview",
      label: "Overview",
      path: "",
      title: "Project Overview",
      description: "理解项目的整体架构与主要模块划分。",
    },
    {
      id: "parser",
      label: "Parser",
      path: "src/parser",
      title: "Parsing / Decoding",
      description: "查看输入如何被解析或解码为内部表示。",
    },
    {
      id: "core",
      label: "Core",
      path: "src/core",
      title: "Execution Core",
      description: "理解指令执行、调度或模拟循环的核心逻辑。",
    },
    {
      id: "memory",
      label: "Memory",
      path: "src/memory",
      title: "Memory and Registers",
      description: "查看寄存器、内存模型与访问约定。",
    },
    {
      id: "tests",
      label: "Tests",
      path: "tests",
      title: "Testing",
      description: "查看测试如何验证系统行为与边界情况。",
    },
  ],
  folderRoleHints: {
    parser: "输入解析或指令解码",
    decoder: "指令解码相关模块",
    core: "执行核心或模拟主循环",
    cpu: "处理器核心逻辑",
    memory: "内存模型与访问",
    registers: "寄存器状态与管理",
    assembler: "汇编器相关模块",
    emulator: "模拟器相关模块",
    tests: "测试与验证",
    test: "测试与验证",
  },
  analysisChecklist: {
    folder: ["Purpose", "Responsibilities", "Input / Output", "Related Modules", "Notes"],
    file: ["Role", "Key Logic", "Used By / Related To", "Notes"],
  },
  suggestedSkills: [
    {
      title: "Low-level Systems Programming",
      description: "展示对底层系统、指令集或运行时模型的理解。",
    },
    {
      title: "Memory and Register Modelling",
      description: "展示对内存布局、寄存器约定与状态管理的掌握。",
    },
  ],
  suggestedTechnicalDecisions: [
    {
      title: "为什么将解析与执行核心分离",
      decision: "Parser/Decoder 与 Execution Core 分为独立模块。",
      rationale: "输入格式变化不应影响执行逻辑，便于分别测试与替换。",
      impact: "模块边界清晰，回归定位更快。",
    },
  ],
};

const fullstackWebTemplate: ProjectTemplate = {
  templateId: "fullstack-web",
  label: "Fullstack Web",
  description: "用于解释 Web 应用、个人网站或前后端一体化项目。",
  defaultPipeline: [
    {
      id: "readme",
      label: "Overview",
      path: "README.md",
      language: "Markdown",
      role: "项目说明与运行方式",
    },
    {
      id: "frontend",
      label: "Frontend",
      path: "src/app",
      language: "TypeScript",
      role: "页面路由与 UI 入口",
    },
    {
      id: "components",
      label: "Components",
      path: "src/components",
      language: "TypeScript",
      role: "可复用 UI 组件",
    },
    {
      id: "services",
      label: "API / Services",
      path: "src/lib",
      language: "TypeScript",
      role: "业务逻辑与服务层",
    },
    {
      id: "data",
      label: "Data Layer",
      path: "src/data",
      language: "TypeScript",
      role: "数据模型与内容源",
    },
    {
      id: "deploy",
      label: "Deployment",
      path: "deploy",
      language: "Config",
      role: "部署与运行配置",
    },
  ],
  defaultGuidedTour: [
    {
      id: "overview",
      label: "Overview",
      path: "",
      title: "Project Overview",
      description: "理解项目的页面结构、技术栈与主要目录。",
    },
    {
      id: "frontend",
      label: "Frontend",
      path: "src/app",
      title: "App Shell",
      description: "查看路由、布局与页面入口如何组织。",
    },
    {
      id: "components",
      label: "Components",
      path: "src/components",
      title: "UI Components",
      description: "理解可复用组件如何支撑页面结构。",
    },
    {
      id: "services",
      label: "Services",
      path: "src/lib",
      title: "Services Layer",
      description: "查看 API、工具函数或业务逻辑的组织方式。",
    },
    {
      id: "data",
      label: "Data",
      path: "src/data",
      title: "Data Layer",
      description: "理解内容、配置或数据模型如何驱动 UI。",
    },
  ],
  folderRoleHints: {
    app: "页面路由与应用入口",
    components: "可复用 UI 组件",
    lib: "工具函数、服务或 API 层",
    data: "数据模型与内容源",
    content: "静态内容或文案",
    hooks: "React hooks 或复用逻辑",
    styles: "样式与主题",
    public: "静态资源",
    deploy: "部署与运行配置",
    tests: "测试与验证",
  },
  analysisChecklist: {
    folder: ["Purpose", "Responsibilities", "Input / Output", "Related Modules", "Notes"],
    file: ["Role", "Key Logic", "Used By / Related To", "Notes"],
  },
  suggestedSkills: [
    {
      title: "Frontend Architecture",
      description: "展示对页面结构、组件划分与 UI 组织的理解。",
    },
    {
      title: "Fullstack Integration",
      description: "展示前后端或 UI 与数据层协作的设计能力。",
    },
  ],
  suggestedTechnicalDecisions: [
    {
      title: "为什么将 UI 与数据/content 分离",
      decision: "组件负责展示，content/data 负责文案与结构化数据。",
      rationale: "便于 i18n、内容更新与组件复用，避免文案硬编码在 JSX 中。",
      impact: "页面迭代更快，结构更适合作品集或内容驱动站点。",
    },
  ],
};

const aiPipelineTemplate: ProjectTemplate = {
  templateId: "ai-pipeline",
  label: "AI Pipeline",
  description: "用于解释 RAG、Agent 或 LLM workflow 类项目。",
  defaultPipeline: [
    {
      id: "readme",
      label: "Overview",
      path: "README.md",
      language: "Markdown",
      role: "项目说明与 pipeline 概览",
    },
    {
      id: "ingest",
      label: "Ingest",
      path: "src/ingest",
      language: "Python",
      role: "数据采集与预处理入口",
    },
    {
      id: "chunk",
      label: "Chunk",
      path: "src/chunk",
      language: "Python",
      role: "文档切分与结构化",
    },
    {
      id: "embed",
      label: "Embed",
      path: "src/embed",
      language: "Python",
      role: "向量化与索引构建",
    },
    {
      id: "retrieve",
      label: "Retrieve",
      path: "src/retrieve",
      language: "Python",
      role: "检索相关上下文",
    },
    {
      id: "generate",
      label: "Generate",
      path: "src/generate",
      language: "Python",
      role: "LLM 生成与 prompt 编排",
    },
    {
      id: "evaluate",
      label: "Evaluate",
      path: "src/evaluate",
      language: "Python",
      role: "效果评估与基准测试",
    },
  ],
  defaultGuidedTour: [
    {
      id: "overview",
      label: "Overview",
      path: "",
      title: "Project Overview",
      description: "理解 AI pipeline 的整体阶段与数据流向。",
    },
    {
      id: "ingest",
      label: "Ingest",
      path: "src/ingest",
      title: "Data Ingestion",
      description: "查看原始数据如何进入系统。",
    },
    {
      id: "chunk",
      label: "Chunk",
      path: "src/chunk",
      title: "Chunking",
      description: "理解文档如何被切分为可检索单元。",
    },
    {
      id: "embed",
      label: "Embed",
      path: "src/embed",
      title: "Embedding",
      description: "查看向量化与索引构建逻辑。",
    },
    {
      id: "retrieve",
      label: "Retrieve",
      path: "src/retrieve",
      title: "Retrieval",
      description: "理解查询如何匹配相关上下文。",
    },
    {
      id: "generate",
      label: "Generate",
      path: "src/generate",
      title: "Generation",
      description: "查看 LLM 调用与 prompt 编排方式。",
    },
  ],
  folderRoleHints: {
    ingest: "数据采集与预处理",
    chunk: "文档切分与结构化",
    embed: "向量化与索引",
    retrieve: "检索与召回",
    generate: "LLM 生成与 prompt 编排",
    agent: "Agent 编排与工具调用",
    evaluate: "评估与基准测试",
    prompts: "Prompt 模板与管理",
    tests: "测试与验证",
  },
  analysisChecklist: {
    folder: ["Purpose", "Responsibilities", "Input / Output", "Related Modules", "Notes"],
    file: ["Role", "Key Logic", "Used By / Related To", "Notes"],
  },
  suggestedSkills: [
    {
      title: "RAG Pipeline Design",
      description: "展示对 ingest → retrieve → generate 流程的设计能力。",
    },
    {
      title: "LLM Workflow Engineering",
      description: "展示对 prompt、工具调用与评估环节的理解。",
    },
  ],
  suggestedTechnicalDecisions: [
    {
      title: "为什么将 retrieval 与 generation 分离",
      decision: "Retrieve 负责召回上下文，Generate 负责 LLM 输出。",
      rationale: "便于独立优化召回质量与生成策略，降低 pipeline 耦合。",
      impact: "各阶段可单独测试与迭代，更适合作品集展示。",
    },
  ],
};

export const projectTemplates: Record<ProjectTemplateId, ProjectTemplate> = {
  "compiler-pipeline": compilerPipelineTemplate,
  "systems-project": systemsProjectTemplate,
  "fullstack-web": fullstackWebTemplate,
  "ai-pipeline": aiPipelineTemplate,
};

export function getProjectTemplate(
  templateId: ProjectTemplateId
): ProjectTemplate | undefined {
  return projectTemplates[templateId];
}
