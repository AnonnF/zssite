import type { ProjectAnalyzerData } from "./types";

export const waccCompilerAnalysis: ProjectAnalyzerData = {
  projectId: "wacc-compiler",
  title: "WACC Compiler",
  description:
    "为 WACC 语言实现的完整编译器管线：词法分析、语法分析、语义检查与 ARM 汇编代码生成。",
  tree: [
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
            { name: "Lexer.scala", path: "src/lexer/Lexer.scala", type: "file" },
          ],
        },
        {
          name: "parser",
          path: "src/parser",
          type: "folder",
          children: [
            { name: "Parser.scala", path: "src/parser/Parser.scala", type: "file" },
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
        { name: "ParserTests.scala", path: "tests/ParserTests.scala", type: "file" },
        {
          name: "SemanticTests.scala",
          path: "tests/SemanticTests.scala",
          type: "file",
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
    },
    src: {
      path: "src",
      type: "folder",
      title: "Source Tree",
      summary:
        "编译器核心源码目录，按编译阶段划分为 lexer、parser、ast、semantic、codegen 五个模块，各模块职责单一、边界清晰。",
      fixed: true,
    },
    "src/lexer": {
      path: "src/lexer",
      type: "folder",
      title: "Lexer Module",
      summary:
        "词法分析模块，将 WACC 源字符流切分为 token 序列。基于 Parsley 组合子库实现，为后续 parser 提供稳定的输入接口。",
      fixed: true,
    },
    "src/parser": {
      path: "src/parser",
      type: "folder",
      title: "Parser Module",
      summary:
        "语法分析模块，负责将 token 流转换为抽象语法树（AST）。采用递归下降与运算符优先级解析，是前后端之间的核心桥梁。",
      fixed: true,
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
    },
    "src/codegen": {
      path: "src/codegen",
      type: "folder",
      title: "Code Generation",
      summary:
        "代码生成模块，将类型正确的 AST 降低为 ARM 汇编。处理寄存器分配、栈帧布局、控制流跳转与运行时内建函数调用。",
      fixed: true,
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
};
