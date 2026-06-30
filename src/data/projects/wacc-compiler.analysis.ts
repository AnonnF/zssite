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
};
