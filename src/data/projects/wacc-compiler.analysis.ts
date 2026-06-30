import type { ProjectAnalyzerData } from "./types";

export const waccCompilerAnalysis: ProjectAnalyzerData = {
  projectId: "wacc-compiler",
  title: "WACC Compiler",
  description: "词法 → 语法 → 语义 → ARM 代码生成的完整编译器管线。",
  tree: [
    {
      name: "ROOT",
      path: "",
      type: "folder",
      children: [
        {
          name: "README.md",
          path: "README.md",
          type: "file",
        },
        {
          name: "src",
          path: "src",
          type: "folder",
          children: [
            {
              name: "lexer",
              path: "src/lexer",
              type: "folder",
              children: [
                {
                  name: "Lexer.scala",
                  path: "src/lexer/Lexer.scala",
                  type: "file",
                },
              ],
            },
            {
              name: "parser",
              path: "src/parser",
              type: "folder",
              children: [
                {
                  name: "Parser.scala",
                  path: "src/parser/Parser.scala",
                  type: "file",
                },
              ],
            },
            {
              name: "ast",
              path: "src/ast",
              type: "folder",
              children: [
                { name: "AST.scala", path: "src/ast/AST.scala", type: "file" },
              ],
            },
            {
              name: "semantic",
              path: "src/semantic",
              type: "folder",
              children: [
                {
                  name: "SemanticChecker.scala",
                  path: "src/semantic/SemanticChecker.scala",
                  type: "file",
                },
              ],
            },
            {
              name: "codegen",
              path: "src/codegen",
              type: "folder",
              children: [
                {
                  name: "CodeGenerator.scala",
                  path: "src/codegen/CodeGenerator.scala",
                  type: "file",
                },
              ],
            },
          ],
        },
        {
          name: "tests",
          path: "tests",
          type: "folder",
          children: [
            {
              name: "ParserTests.scala",
              path: "tests/ParserTests.scala",
              type: "file",
            },
            {
              name: "SemanticTests.scala",
              path: "tests/SemanticTests.scala",
              type: "file",
            },
          ],
        },
      ],
    },
  ],
  entries: {
    "": {
      path: "",
      type: "folder",
      title: "Project Root",
      summary:
        "WACC 编译器项目根目录。采用经典多阶段编译器架构：前端负责词法与语法分析，中端构建 AST 并执行语义检查，后端生成 ARM 汇编。",
      fixed: true,
      analysis: {
        purpose:
          "WACC 编译器项目根目录，组织源码、测试与项目文档。",
        responsibilities: [
          "在 src/ 下承载多阶段编译器源码树",
          "将实现代码与测试用例分离",
          "提供项目级文档与构建入口",
        ],
        input: "WACC 源程序与编译器配置",
        output: "编译后的 ARM 汇编与诊断信息",
        relatedModules: ["源码目录", "测试集", "文档"],
        relatedPaths: ["src", "tests", "README.md"],
        notes: [
          "编译管线各阶段位于 src/ 下，遵循经典编译器目录布局。",
        ],
      },
    },
    src: {
      path: "src",
      type: "folder",
      title: "Source Tree",
      summary:
        "编译器核心源码目录，按编译阶段划分为 lexer、parser、ast、semantic、codegen 五个模块，各模块职责单一、边界清晰。",
      fixed: true,
      analysis: {
        purpose:
          "按编译阶段组织全部编译器实现模块。",
        responsibilities: [
          "将前端、中端与后端阶段划分到独立目录",
          "保持模块边界清晰，便于浏览与测试",
          "作为理解编译器架构的主要入口",
        ],
        input: "各编译阶段对应的 Scala 源码",
        output: "按管线顺序消费的阶段性模块",
        relatedModules: ["Lexer", "Parser", "AST", "Semantic Checker", "Codegen"],
        relatedPaths: [
          "src/lexer",
          "src/parser",
          "src/ast",
          "src/semantic",
          "src/codegen",
        ],
      },
    },
    "src/lexer": {
      path: "src/lexer",
      type: "folder",
      title: "Lexer Module",
      summary:
        "词法分析模块，将 WACC 源字符流切分为 token 序列。基于 Parsley 组合子库实现，为后续 parser 提供稳定的输入接口。",
      fixed: true,
      analysis: {
        purpose: "将 WACC 源文本切分为带类型的词法单元（token）序列。",
        responsibilities: [
          "识别关键字、标识符、字面量与运算符",
          "统一处理空白符与注释",
          "为 parser 提供稳定的 token 接口",
        ],
        input: "WACC 源字符流",
        output: "token stream",
        relatedModules: ["Parser", "源码目录"],
        relatedPaths: ["src/parser", "src/lexer/Lexer.scala"],
      },
    },
    "src/parser": {
      path: "src/parser",
      type: "folder",
      title: "Parser Module",
      summary:
        "语法分析模块，负责将 token 流转换为抽象语法树（AST）。采用递归下降与运算符优先级解析，是前后端之间的核心桥梁。",
      fixed: true,
      analysis: {
        purpose:
          "将词法分析阶段输出的 token stream 转换为抽象语法树，为后续语义检查提供结构化表示。",
        responsibilities: [
          "定义核心语法解析流程",
          "根据 token 构建 AST 节点",
          "连接 lexer 输出与 semantic analysis 输入",
        ],
        input: "词法分析器输出的 token stream",
        output: "用于语义检查的 AST",
        relatedModules: ["Lexer", "AST", "Semantic Checker"],
        relatedPaths: ["src/lexer", "src/ast", "src/parser/Parser.scala"],
      },
    },
    "src/ast": {
      path: "src/ast",
      type: "folder",
      title: "AST Definitions",
      summary:
        "抽象语法树类型定义。以代数数据类型（ADT）建模 WACC 的表达式、语句与类型系统，为语义分析与代码生成提供统一中间表示。",
      fixed: true,
    },
    "src/semantic": {
      path: "src/semantic",
      type: "folder",
      title: "Semantic Analysis",
      summary:
        "语义分析模块，在 AST 上执行类型检查、作用域解析与名称绑定。捕获静态错误，确保进入代码生成阶段的程序在类型层面合法。",
      fixed: true,
      analysis: {
        purpose:
          "在代码生成前对 AST 进行语义校验，确保程序含义合法。",
        responsibilities: [
          "执行类型检查与作用域解析",
          "解析名称并强制执行 WACC 类型规则",
          "报告阻止进入 codegen 的静态错误",
        ],
        input: "parser 输出的 AST",
        output: "通过类型检查的 AST 或诊断列表",
        relatedModules: ["Parser", "AST", "Codegen"],
        relatedPaths: ["src/ast", "src/codegen", "src/semantic/SemanticChecker.scala"],
      },
    },
    "src/codegen": {
      path: "src/codegen",
      type: "folder",
      title: "Code Generation",
      summary:
        "代码生成模块，将类型正确的 AST 降低为 ARM 汇编。处理寄存器分配、栈帧布局、控制流跳转与运行时内建函数调用。",
      fixed: true,
      analysis: {
        purpose: "将类型正确的 AST 降低（lower）为 ARM 汇编输出。",
        responsibilities: [
          "为表达式与控制流生成指令序列",
          "管理栈帧与寄存器调用约定",
          "集成运行时辅助函数与内建调用",
        ],
        input: "通过类型检查的 AST",
        output: "ARM 汇编文本",
        relatedModules: ["Semantic Checker", "AST"],
        relatedPaths: ["src/semantic", "src/codegen/CodeGenerator.scala"],
        notes: ["编译器管线的最终阶段。"],
      },
    },
    tests: {
      path: "tests",
      type: "folder",
      title: "Test Suite",
      summary:
        "单元测试与集成测试目录，覆盖各编译阶段的正例与反例，确保管线在重构与扩展时保持行为一致。",
      fixed: true,
    },
    "README.md": {
      path: "README.md",
      type: "file",
      title: "README.md",
      summary: "项目说明文档，包含构建方式、运行示例与编译器管线概览。",
      language: "markdown",
      code: `# WACC Compiler

A multi-stage compiler for the WACC language.

## Pipeline

1. Lexer
2. Parser
3. Semantic analysis
4. Code generation (ARM)

\`\`\`bash
sbt compile
./wacc-compiler program.wacc
\`\`\`
`,
    },
    "src/lexer/Lexer.scala": {
      path: "src/lexer/Lexer.scala",
      type: "file",
      title: "Lexer.scala",
      summary: "词法分析器入口，定义 WACC 关键字、标识符、字面量与运算符的 token 规则。",
      language: "scala",
    },
    "src/parser/Parser.scala": {
      path: "src/parser/Parser.scala",
      type: "file",
      title: "Parser.scala",
      summary:
        "语法分析主文件，包含程序、语句、表达式与类型声明的解析规则，负责构建完整 AST。",
      language: "scala",
      analysis: {
        role: "WACC 程序的主 parser 实现。",
        keyLogic: [
          "通过 Parsley 组合子协调语法规则",
          "从 token 输入构建 AST 表示",
          "以 parser 诊断处理语法级错误",
        ],
        usedBy: ["编译器主程序", "Parser 单元测试"],
        relatedModules: ["Lexer", "AST", "Semantic Checker"],
        relatedPaths: ["src/lexer", "src/ast", "src/semantic"],
      },
      code: `object Parser {
  def parse(input: String): Result[String, Program] =
    progParser.parse(input)

  private val progParser = fully(program)

  private lazy val program: Parsley[Program] =
  (many(importDecl) ~> many(func) ~> Stmts(Nil)).map(Program.apply)

  private lazy val expr: Parsley[Expr] = precedence(
    atomic(parens),
    intLiteral,
    identifier,
    boolean
  )(
    Ops(Prefix)("!" as Not, "-" as Neg),
    Ops(InfixL)("*" as Mul, "/" as Div, "%" as Mod),
    Ops(InfixL)("+" as Add, "-" as Sub)
  )
}`,
    },
    "src/ast/AST.scala": {
      path: "src/ast/AST.scala",
      type: "file",
      title: "AST.scala",
      summary: "WACC 抽象语法树的 ADT 定义，涵盖表达式、语句、类型与函数声明节点。",
      language: "scala",
    },
    "src/semantic/SemanticChecker.scala": {
      path: "src/semantic/SemanticChecker.scala",
      type: "file",
      title: "SemanticChecker.scala",
      summary:
        "类型检查器主入口，遍历 AST 并维护变量与函数环境，报告类型不匹配与未定义标识符错误。",
      language: "scala",
      analysis: {
        role: "WACC 程序静态语义校验的入口。",
        keyLogic: [
          "构建全局函数与变量环境",
          "遍历 AST 节点以强制执行类型与作用域规则",
          "聚合类型与名称错误的诊断信息",
        ],
        usedBy: ["编译器主程序", "Semantic 单元测试"],
        relatedModules: ["Parser", "AST", "Codegen"],
        relatedPaths: ["src/parser", "src/ast", "src/codegen"],
      },
      code: `object SemanticChecker {
  extension (ast: Program) {
    def checkTypes(): Result[List[Diagnostic], Unit] =
      SemanticChecker.check(ast)
  }

  private def check(program: Program): Result[List[Diagnostic], Unit] = {
    val env = buildGlobalEnv(program.funcs)
    program.body.traverse(checkStmt(_, env)) match {
      case Left(diags)  => Failure(diags)
      case Right(_)     => Success(())
    }
  }

  private def typeLabel(t: Type): String = t match {
    case IntType    => "int"
    case BoolType   => "bool"
    case ArrayType(e) => s"\${typeLabel(e)}[]"
    case PairType(f, s) => s"pair(\${typeLabel(f)}, \${typeLabel(s)})"
  }
}`,
    },
    "src/codegen/CodeGenerator.scala": {
      path: "src/codegen/CodeGenerator.scala",
      type: "file",
      title: "CodeGenerator.scala",
      summary:
        "ARM 汇编代码生成器，将类型检查后的 AST 翻译为可执行的汇编指令序列，处理栈帧与寄存器约定。",
      language: "scala",
      analysis: {
        role: "从已通过校验的 WACC AST 生成 ARM 汇编。",
        keyLogic: [
          "生成运行时导入与函数体",
          "将语句与表达式降低为 ARM 指令",
          "管理 main 与函数的栈帧建立与销毁",
        ],
        usedBy: ["编译器主程序"],
        relatedModules: ["Semantic Checker", "AST"],
        relatedPaths: ["src/semantic", "src/ast"],
        notes: ["输出为可直接链接的纯文本 ARM 汇编。"],
      },
      code: `object CodeGenerator {
  def generate(program: Program): String = {
    val state = CodeGenState.fresh
    val header = emitRuntimeImports()
    val funcs  = program.funcs.map(emitFunc(_, state))
    val main   = emitMain(program.body, state)
    (header ++ funcs :+ main).mkString("\\n")
  }

  private def emitMain(stmts: Stmts, state: CodeGenState): String =
    s"""|  .text
        |  .global main
        |main:
        |  stp fp, lr, [sp, #-16]!
        |  mov fp, sp
        |\${emitStmts(stmts, state)}
        |  mov x0, #0
        |  ldp fp, lr, [sp], #16
        |  ret""".stripMargin
}`,
    },
    "tests/ParserTests.scala": {
      path: "tests/ParserTests.scala",
      type: "file",
      title: "ParserTests.scala",
      summary: "Parser 模块的单元测试，覆盖合法程序解析与语法错误报告。",
      language: "scala",
    },
    "tests/SemanticTests.scala": {
      path: "tests/SemanticTests.scala",
      type: "file",
      title: "SemanticTests.scala",
      summary: "语义分析模块的单元测试，验证类型错误检测与作用域规则。",
      language: "scala",
    },
  },
  pipeline: [
    {
      id: "source",
      label: "Source Code",
      path: "src",
      language: "WACC",
      role: "以 WACC 编写的输入程序",
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
      language: "Scala / ARM",
      role: "生成 ARM 汇编输出",
    },
  ],
  guidedTour: [
    {
      id: "overview",
      label: "Overview",
      path: "",
      title: "Project Overview",
      description:
        "先从项目根目录理解整体结构和编译器的主要阶段，建立对 WACC Compiler 的全局认识。",
    },
    {
      id: "lexer",
      label: "Lexer",
      path: "src/lexer",
      title: "Lexical Analysis",
      description:
        "查看源代码如何被转换成 token stream，理解 parser 的输入是如何形成的。",
    },
    {
      id: "parser",
      label: "Parser",
      path: "src/parser",
      title: "Parsing Stage",
      description:
        "理解 Parser 如何根据语法规则构建 AST，以及前端语法分析的核心结构。",
    },
    {
      id: "ast",
      label: "AST",
      path: "src/ast",
      title: "AST Definitions",
      description:
        "查看 AST 的类型定义，理解 Parser 与 Semantic Checker 之间的中间表示边界。",
    },
    {
      id: "semantic",
      label: "Semantic",
      path: "src/semantic",
      title: "Semantic Checking",
      description:
        "查看类型检查、作用域检查和语义错误检测如何完成，理解静态分析阶段的设计。",
    },
    {
      id: "codegen",
      label: "Codegen",
      path: "src/codegen",
      title: "Code Generation",
      description:
        "理解 AST 如何被转换为目标平台的 ARM 汇编，关注栈帧、寄存器约定与运行时调用。",
    },
    {
      id: "tests",
      label: "Tests",
      path: "tests",
      title: "Testing Strategy",
      description:
        "最后查看测试结构，理解项目如何分阶段验证 compiler pipeline 的正确性。",
      note: "建议对照 ParserTests 与 SemanticTests 理解各阶段的测试边界。",
    },
  ],
  narrative: {
    technicalDecisions: [
      {
        title: "为什么采用分阶段 compiler pipeline",
        decision:
          "将编译过程拆分为 Lexer、Parser、AST、Semantic Checker 和 Codegen。",
        rationale:
          "每个阶段都有明确的输入输出，错误更容易定位，模块也可以独立开发与测试。",
        impact:
          "提高了项目的可维护性，并让前端语法分析与后端代码生成之间的职责边界更清晰。",
      },
      {
        title: "为什么把 AST 作为 Parser 和 Semantic Checker 之间的边界",
        decision:
          "用独立的 AST 模块承载程序结构，Parser 只负责构建，Semantic Checker 只负责校验。",
        rationale:
          "AST 作为稳定中间表示，可以隔离语法细节与语义规则，避免两阶段相互渗透。",
        impact:
          "后续扩展语义规则或替换 parser 实现时，不必重写整个编译器前端。",
      },
      {
        title: "为什么把语义检查和代码生成分开",
        decision:
          "Semantic Checker 验证程序合法性，Codegen 只处理已通过检查的 AST。",
        rationale:
          "语义错误应在进入后端前被拦截，codegen 可以假设输入程序在类型层面合法。",
        impact:
          "降低了 Codegen 的复杂度，也让语义错误报告集中在一个阶段完成。",
      },
      {
        title: "为什么需要独立的测试结构验证各阶段",
        decision:
          "为 Parser、Semantic 等阶段分别编写单元测试，而不是只做端到端测试。",
        rationale:
          "分阶段测试可以在 pipeline 早期捕获回归，定位失败位置比全链路测试更快。",
        impact:
          "重构单个模块时更有信心，也更容易向访客展示每个阶段的验证方式。",
      },
    ],
    skills: [
      {
        title: "Compiler Pipeline Design",
        description:
          "通过 Lexer → Parser → AST → Semantic → Codegen 的分层结构，展示了对编译器整体流程的设计能力。",
      },
      {
        title: "Scala / Functional-style Modelling",
        description:
          "使用 Scala 与 ADT 建模 AST 和编译阶段，体现了对函数式数据建模与模块组织的掌握。",
      },
      {
        title: "AST and Semantic Analysis",
        description:
          "通过 AST 定义与 Semantic Checker，展示了处理程序结构、类型规则与作用域管理的能力。",
      },
      {
        title: "ARM Assembly Code Generation",
        description:
          "通过 ARM 汇编输出与栈帧/寄存器约定，展示了对底层执行模型与代码生成细节的理解。",
      },
      {
        title: "Testing and Debugging Complex Systems",
        description:
          "通过分阶段测试与诊断信息设计，展示了在复杂系统中定位问题、验证行为的工程能力。",
      },
    ],
  },
};
