import type { ProjectAnalyzerData } from "./types";

export const waccCompilerAnalysis: ProjectAnalyzerData = {
  projectId: "wacc-compiler",
  title: "WACC Compiler",
  description:
    "为 WACC 语言实现的完整编译器管线：词法分析、语法分析、语义检查与 ARM 汇编代码生成。",
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
          "Top-level entry for the WACC compiler — organizes source, tests, and project documentation.",
        responsibilities: [
          "Hosts the multi-stage compiler source tree under src/",
          "Separates implementation from test fixtures",
          "Provides project-level documentation and build entry points",
        ],
        input: "WACC source programs and compiler configuration",
        output: "Compiled ARM assembly and diagnostic messages",
        relatedModules: ["Source Tree", "Test Suite", "Docs"],
        relatedPaths: ["src", "tests", "README.md"],
        notes: [
          "Pipeline stages live under src/ and follow a classic compiler layout.",
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
          "Contains all compiler implementation modules arranged by compilation phase.",
        responsibilities: [
          "Groups frontend, middle-end, and backend stages into isolated folders",
          "Keeps module boundaries explicit for navigation and testing",
          "Serves as the main exploration entry for compiler architecture",
        ],
        input: "Organized Scala sources for each compiler phase",
        output: "Phase-specific modules consumed sequentially by the pipeline",
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
        purpose: "Tokenizes WACC source text into a stream of typed lexical units.",
        responsibilities: [
          "Recognizes keywords, identifiers, literals, and operators",
          "Normalizes whitespace and comment handling",
          "Exposes a stable token interface for the parser",
        ],
        input: "Raw WACC source characters",
        output: "Token stream",
        relatedModules: ["Parser", "Source Tree"],
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
        purpose: "Converts token streams into an abstract syntax tree.",
        responsibilities: [
          "Defines grammar-level parsing flow",
          "Builds AST nodes from tokens",
          "Bridges lexer output and semantic analysis",
        ],
        input: "Token stream",
        output: "AST",
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
          "Validates program meaning on the AST before code generation.",
        responsibilities: [
          "Performs type checking and scope resolution",
          "Resolves names and enforces WACC typing rules",
          "Reports static errors that block codegen",
        ],
        input: "AST from parser",
        output: "Type-checked AST or diagnostic list",
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
        purpose: "Lowers a type-correct AST into ARM assembly output.",
        responsibilities: [
          "Emits instruction sequences for expressions and control flow",
          "Manages stack frames and register conventions",
          "Integrates runtime helpers and built-in calls",
        ],
        input: "Type-checked AST",
        output: "ARM assembly text",
        relatedModules: ["Semantic Checker", "AST"],
        relatedPaths: ["src/semantic", "src/codegen/CodeGenerator.scala"],
        notes: ["Final stage of the compiler pipeline."],
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
        role: "Main parser implementation for WACC programs.",
        keyLogic: [
          "Coordinates grammar rules via Parsley parser combinators",
          "Produces AST representation from token input",
          "Handles syntax-level failures with parser diagnostics",
        ],
        usedBy: ["Compiler driver", "Parser tests"],
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
        role: "Entry point for static semantic validation of WACC programs.",
        keyLogic: [
          "Builds global function and variable environments",
          "Walks AST nodes to enforce typing and scope rules",
          "Aggregates diagnostics for type and name errors",
        ],
        usedBy: ["Compiler driver", "Semantic tests"],
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
        role: "Generates ARM assembly from a validated WACC AST.",
        keyLogic: [
          "Emits runtime imports and function bodies",
          "Lowers statements and expressions to ARM instructions",
          "Manages stack setup/teardown for main and functions",
        ],
        usedBy: ["Compiler driver"],
        relatedModules: ["Semantic Checker", "AST"],
        relatedPaths: ["src/semantic", "src/ast"],
        notes: ["Output is plain-text ARM assembly ready for linking."],
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
      role: "Input program written in WACC",
    },
    {
      id: "lexer",
      label: "Lexer",
      path: "src/lexer",
      language: "Scala",
      role: "Converts source text into tokens",
    },
    {
      id: "parser",
      label: "Parser",
      path: "src/parser",
      language: "Scala",
      role: "Builds the abstract syntax tree",
    },
    {
      id: "ast",
      label: "AST",
      path: "src/ast",
      language: "Scala",
      role: "Shared intermediate representation for later stages",
    },
    {
      id: "semantic",
      label: "Semantic Checker",
      path: "src/semantic",
      language: "Scala",
      role: "Validates types, scopes, and program rules",
    },
    {
      id: "codegen",
      label: "Codegen",
      path: "src/codegen",
      language: "Scala / ARM",
      role: "Generates ARM assembly output",
    },
  ],
};
