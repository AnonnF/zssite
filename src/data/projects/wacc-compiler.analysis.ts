import type { ProjectAnalyzerData } from "./types";

export const waccCompilerAnalysis: ProjectAnalyzerData = {
  projectId: "wacc-compiler",
  title: "WACC Compiler",
  description: "词法 → 语法 → 语义 → CFG → ARM 代码生成的完整 WACC 编译器管线。",
  tree: [],
  entries: {
    "": {
      path: "",
      type: "folder",
      title: "Project Root",
      summary:
        "WACC 编译器项目根目录。Scala 3 实现，源码位于 src/main/wacc/，测试位于 src/test/wacc/。",
      fixed: true,
      analysis: {
        purpose: "WACC 编译器仓库根目录，组织源码、测试与构建脚本。",
        responsibilities: [
          "在 src/main/wacc/ 下承载编译器各阶段实现",
          "在 src/test/wacc/ 下组织分阶段单元测试与集成测试",
          "提供 README、compile 与 Makefile 等构建入口",
        ],
        input: "WACC 源程序与编译器配置",
        output: "编译后的 ARM 汇编或解释执行结果",
        relatedModules: ["编译器源码", "测试集", "文档"],
        relatedPaths: ["src/main/wacc", "src/test/wacc", "README.md"],
        notes: [
          "真实项目采用扁平 Scala 包结构（wacc.*），而非按阶段拆分子目录。",
        ],
      },
    },
    "src/main/wacc": {
      path: "src/main/wacc",
      type: "folder",
      title: "Compiler Source",
      summary:
        "编译器核心源码目录。lexer、parser、AST、typeChecker、CFG 与 ARM backend 均在此包内，以 Scala 文件组织各阶段。",
      fixed: true,
      analysis: {
        purpose: "承载 WACC 编译器从前端到后端的全部实现。",
        responsibilities: [
          "词法与语法分析（lexer.scala / parser.scala）",
          "AST 定义与中间表示（ast.scala / CFG.scala）",
          "静态语义检查（typeChecker.scala）",
          "ARM 代码生成（backend/arm/）",
        ],
        input: "各编译阶段对应的 Scala 源码",
        output: "按管线顺序消费的模块与入口（Main.scala）",
        relatedModules: ["Lexer", "Parser", "AST", "Type Checker", "ARM Codegen"],
        relatedPaths: [
          "src/main/wacc/lexer.scala",
          "src/main/wacc/parser.scala",
          "src/main/wacc/ast.scala",
          "src/main/wacc/typeChecker.scala",
          "src/main/wacc/backend/arm",
        ],
      },
    },
    "src/main/wacc/backend/arm": {
      path: "src/main/wacc/backend/arm",
      type: "folder",
      title: "ARM Backend",
      summary:
        "ARM 32 位后端：指令生成、寄存器分配、活跃性分析与运行时辅助。ARMCodeGenerator 将 CFG 降低为可汇编的指令序列。",
      fixed: true,
      analysis: {
        purpose: "将类型检查后的 CFG 程序翻译为 ARM 汇编。",
        responsibilities: [
          "CFG 基本块到 ARM 指令的降低",
          "栈帧布局与 callee-saved 寄存器管理",
          "寄存器分配与活跃性分析",
          "运行时错误处理与 rodata 段生成",
        ],
        input: "CFGProgram（语句与表达式的控制流图）",
        output: "ARM 汇编指令链（Chain[Instr]）",
        relatedModules: ["CFG", "Type Checker", "RuntimeProvider"],
        relatedPaths: [
          "src/main/wacc/backend/arm/ARMCodeGenerator.scala",
          "src/main/wacc/CFG.scala",
        ],
      },
    },
    "src/test/wacc": {
      path: "src/test/wacc",
      type: "folder",
      title: "Test Suite",
      summary:
        "ScalaTest 测试集，覆盖 lexer、parser、typeChecker、codegen 与 integration 等阶段，支持分阶段验证编译器行为。",
      fixed: true,
    },
    "README.md": {
      path: "README.md",
      type: "file",
      title: "README.md",
      summary: "项目说明文档，介绍仓库结构、构建方式与 WACC 实验背景。",
      language: "markdown",
    },
    "src/main/wacc/lexer.scala": {
      path: "src/main/wacc/lexer.scala",
      type: "file",
      title: "lexer.scala",
      summary:
        "词法分析模块，基于 Parsley Lexer 定义 WACC 关键字、标识符、字面量与运算符的 token 规则。",
      language: "scala",
      analysis: {
        role: "WACC 源文本的词法分析入口。",
        keyLogic: [
          "集中定义 reserved keywords 与符号描述",
          "为 parser 提供 intLiteral、identifier、boolean 等组合子",
          "通过 fully 包装保证输入被完整消费",
        ],
        usedBy: ["parser.scala", "LexerTests"],
        relatedModules: ["Parser"],
        relatedPaths: ["src/main/wacc/parser.scala"],
      },
    },
    "src/main/wacc/parser.scala": {
      path: "src/main/wacc/parser.scala",
      type: "file",
      title: "parser.scala",
      summary:
        "语法分析主文件，用 Parsley 组合子解析 program、function、stmt 与 expr，构建 Program AST。",
      language: "scala",
      analysis: {
        role: "WACC 程序的主 parser 实现。",
        keyLogic: [
          "通过 Parsley 组合子协调语法规则",
          "precedence 组合子处理表达式优先级",
          "program parser 组合 imports、functions 与 main body",
        ],
        usedBy: ["Main.scala", "ParserTests"],
        relatedModules: ["Lexer", "AST", "Type Checker"],
        relatedPaths: [
          "src/main/wacc/lexer.scala",
          "src/main/wacc/ast.scala",
          "src/main/wacc/typeChecker.scala",
        ],
      },
      snippets: [
        {
          id: "parser-entry",
          title: "Parser entry point",
          startLine: 21,
          endLine: 23,
          reason:
            "对外暴露 parse 入口，通过 fully(program) 保证输入被完整解析为 Program AST。",
          code: `object parser {
    def parse(input: String): Result[String, Program] = progParser.parse(input)
    private val progParser = fully(program)`,
          annotations: [
            {
              line: 22,
              note: "唯一对外 parse 入口，返回 Result 以便 Main 区分语法错误与成功 AST。",
            },
            {
              line: 23,
              note: "fully 包装确保 consume 全部输入，避免部分解析后静默成功。",
            },
          ],
        },
        {
          id: "ast-construction",
          title: "AST construction flow",
          startLine: 161,
          endLine: 164,
          reason:
            "program parser 按 WACC 语法顺序解析 begin/end 块内的 imports、functions 与 main stmt，映射为 Program 根节点。",
          code: `    private lazy val program: Parsley[Program] =
        ("begin" ~> many(importDecl) <~> many(function) <~> stmt <~ "end").map {
            case ((imports, funcs), main) => Program(funcs, main, imports)
        }`,
          annotations: [
            {
              line: 161,
              note: "lazy 延迟构建 parser 图，避免规则之间的 forward reference。",
            },
            {
              line: 163,
              note: "解析顺序与 WACC 顶层结构一致：imports → functions → main body。",
            },
          ],
        },
        {
          id: "syntax-precedence",
          title: "Expression precedence",
          startLine: 138,
          endLine: 157,
          reason:
            "表达式 parser 通过 precedence 组合子声明运算符优先级，Parsley 自动区分一元/二元减号。",
          code: `    private lazy val expr: Parsley[Expr] =
        precedence(
            arrayElem,
            intLiter,
            BoolLiter(boolean.label("boolean literal")),
            CharLiter(charLiteral.label("character literal")),
            StringLiter(stringLiteral.label("string literal")),
            Var(identifier),
            (pos <~ "null").map(NullLiter()(_)),
            recvExpr,
            "(" ~> expr <~ ")"
        )(
            Ops(Prefix)(unaryOp),
            Ops(InfixL)(arithmeticOpHigh),
            Ops(InfixL)(arithmeticOpLow),
            Ops(InfixN)(comparisonOp),
            Ops(InfixN)(equalityOp),
            Ops(InfixR)(and),
            Ops(InfixR)(or)
        )`,
          annotations: [
            {
              line: 139,
              note: "precedence 将原子项与各级运算符分层，减少手工处理结合性。",
            },
            {
              line: 150,
              note: "Prefix / InfixL / InfixN / InfixR 分层定义一元、左结合、非结合与右结合运算。",
            },
          ],
        },
      ],
    },
    "src/main/wacc/ast.scala": {
      path: "src/main/wacc/ast.scala",
      type: "file",
      title: "ast.scala",
      summary:
        "WACC 抽象语法树 ADT 定义，涵盖类型、表达式、语句、函数与 Program 根节点，供 parser 与 typeChecker 共享。",
      language: "scala",
      analysis: {
        role: "Parser 与 Type Checker 之间的稳定中间表示。",
        keyLogic: [
          "sealed trait 建模表达式与语句层次",
          "ParserBridge 宏简化 parser 到 AST 的映射",
          "Import / Type / Program 等顶层结构定义",
        ],
        relatedModules: ["Parser", "Type Checker", "CFG"],
        relatedPaths: ["src/main/wacc/parser.scala", "src/main/wacc/typeChecker.scala"],
      },
    },
    "src/main/wacc/typeChecker.scala": {
      path: "src/main/wacc/typeChecker.scala",
      type: "file",
      title: "typeChecker.scala",
      summary:
        "静态语义分析入口，维护函数/变量环境，遍历 AST 报告类型不匹配、作用域与返回路径错误。",
      language: "scala",
      analysis: {
        role: "WACC 程序静态语义校验的入口。",
        keyLogic: [
          "buildFuncEnv 收集函数签名以支持 mutual recursion",
          "分层 Env 栈实现作用域与 shadowing",
          "聚合 Diagnostic 列表批量返回错误",
        ],
        usedBy: ["Main.scala", "TypeCheckerTests"],
        relatedModules: ["Parser", "AST", "ARM Codegen"],
        relatedPaths: [
          "src/main/wacc/parser.scala",
          "src/main/wacc/ast.scala",
          "src/main/wacc/backend/arm",
        ],
      },
      snippets: [
        {
          id: "semantic-entry",
          title: "Type checking entry",
          startLine: 6,
          endLine: 11,
          reason:
            "通过 extension method 为 Program AST 提供 checkTypes，语义阶段从这里进入私有 check 实现。",
          code: `object typeChecker {
    // for public entry
    extension (ast: Program) {
        def checkTypes(): Result[List[Diagnostic], TypeCheckResult] =
            typeChecker.check(ast)
    }`,
          annotations: [
            {
              line: 8,
              note: "extension 让调用方写成 program.checkTypes()，与 parser 入口风格一致。",
            },
            {
              line: 9,
              note: "Result 聚合 Diagnostic 列表，Main 可统一格式化错误输出。",
            },
          ],
        },
        {
          id: "scope-validation",
          title: "Scope validation",
          startLine: 94,
          endLine: 106,
          reason:
            "check 先构建全局函数环境，再分别检查各 function body 与 main；作用域规则在 checkStmts 中 enforced。",
          code: `    private def check(
        ast: Program
    ): Result[List[Diagnostic], TypeCheckResult] = {
        buildFuncEnv(ast.funcs) match {
            case Left(errs) =>
                Failure(errs)
            case Right(fenv) =>
                val funcErrs = ast.funcs.flatMap(checkFunc(_, fenv))
                val (mainErrs, mainEnv) = {
                    implicit val fenvImplicit: Map[String, FuncSig] = fenv
                    implicit val envImplicit: Env = List(Map.empty)
                    checkStmts(ast.main, None)
                }`,
          annotations: [
            {
              line: 97,
              note: "buildFuncEnv 收集函数签名，作为后续语句检查的顶层符号表。",
            },
            {
              line: 105,
              note: "main body 在 fresh Env 栈上检查，与 function body 的作用域隔离。",
            },
          ],
        },
        {
          id: "error-reporting",
          title: "Error accumulation / reporting",
          startLine: 108,
          endLine: 112,
          reason:
            "语义错误通过 Failure(allErrors) 批量返回，而不是遇错即停，便于一次展示多个类型/作用域问题。",
          code: `                val allErrors = funcErrs ++ mainErrs
                if (allErrors.isEmpty)
                    Success(TypeCheckResult(ast, mainEnv, fenv))
                else Failure(allErrors)
        }
    }`,
          annotations: [
            {
              line: 108,
              note: "合并 function 与 main 的全部 Diagnostic，供 CLI 统一打印。",
            },
            {
              line: 111,
              note: "仅当全部通过检查才返回 TypeCheckResult，保证 codegen 输入语义正确。",
            },
          ],
        },
      ],
    },
    "src/main/wacc/backend/arm/ARMCodeGenerator.scala": {
      path: "src/main/wacc/backend/arm/ARMCodeGenerator.scala",
      type: "file",
      title: "ARMCodeGenerator.scala",
      summary:
        "ARM 32 位代码生成器，将 CFGProgram 降低为 ARM 指令链，包含寄存器分配、栈帧管理与运行时辅助。",
      language: "scala",
      analysis: {
        role: "从已通过校验的 CFG 程序生成 ARM 汇编。",
        keyLogic: [
          "generate 串联 runtime imports、各 function 与 main 的 CFG 块",
          "FunctionGenerator 管理单函数栈帧与参数归一化",
          "RegAlloc 与 Liveness 在后端 pass 中分配物理寄存器",
        ],
        usedBy: ["Main.scala", "CodeGeneratorTests"],
        relatedModules: ["CFG", "Type Checker", "RuntimeProvider"],
        relatedPaths: ["src/main/wacc/CFG.scala", "src/main/wacc/typeChecker.scala"],
        notes: ["输出经 Printer 转为纯文本 ARM 汇编。"],
      },
      snippets: [
        {
          id: "codegen-entry",
          title: "Code generation entry",
          startLine: 47,
          endLine: 65,
          reason:
            "generate 遍历 CFGProgram 中各 function 与 main，将基本块降低为带标签的 ARM 指令链。",
          code: `    def generate(
        prog: CFGProgram[Stmt, Expr],
        optimize: Boolean = true
    ): Chain[Instr[PhysicalReg]] = {
        val header = Chain(SyntaxUnified)

        val functionBlocks =
            concatBlocks(prog.funcs.toList.sortBy(_._1)) { case (name, cfg) =>
                FunctionGenerator(name, cfg, optimize).generate()
            }
        val mainBlocks =
            FunctionGenerator("main", prog.main, optimize).generate()
        val allBlocks =
            functionBlocks ++ mainBlocks ++ runtime.helperDefinitions
        val textSection = Chain(Text, Global("main")) ++
            LabeledBlock.flatten(allBlocks)

        (header ++ Chain.fromSeq(runtime.externs) ++ runtime.bssDefinitions ++ textSection)
    }`,
          annotations: [
            {
              line: 54,
              note: "每个 function 由独立 FunctionGenerator 实例处理，便于隔离栈帧状态。",
            },
            {
              line: 61,
              note: "textSection 以 .text / .global main 开头，后接 flatten 后的全部基本块。",
            },
          ],
        },
        {
          id: "stack-frame",
          title: "Stack frame / register handling",
          startLine: 152,
          endLine: 164,
          reason:
            "函数 prologue 保存 callee-saved 寄存器、建立 FP 并预留栈帧空间，参数从 caller 栈上拷贝到 local frame slot。",
          code: `            val prologueInstrs = Chain(
                Push(
                    prologueSavedRegs
                ), // save callee-saved registers and link register
                Mov(AL, FP, Op2.Reg(SP)),
                LdrLit(AL, R12, LitExpr.Const(frameSize)),
                Sub(
                    AL,
                    false,
                    SP,
                    SP,
                    Op2.Reg(R12)
                ) // placeholder for frame size, to be filled in after register allocation
            )`,
          annotations: [
            {
              line: 153,
              note: "Push 保存 callee-saved 寄存器与 LR，为函数返回做准备。",
            },
            {
              line: 156,
              note: "Mov FP, SP 建立当前栈帧基址，局部变量相对 FP 寻址。",
            },
          ],
        },
        {
          id: "arm-emission",
          title: "ARM instruction emission",
          startLine: 59,
          endLine: 64,
          reason:
            "main 与 functions 的 CFG 基本块经 flatten 后写入 .text 段，与 runtime externs / bss 段拼接为完整输出。",
          code: `        val allBlocks =
            functionBlocks ++ mainBlocks ++ runtime.helperDefinitions
        val textSection = Chain(Text, Global("main")) ++
            LabeledBlock.flatten(allBlocks)

        (header ++ Chain.fromSeq(runtime.externs) ++ runtime.bssDefinitions ++ textSection)`,
          annotations: [
            {
              line: 60,
              note: "helperDefinitions 包含运行时错误处理等辅助基本块，与 user code 一并输出。",
            },
            {
              line: 62,
              note: "LabeledBlock.flatten 将带标签基本块序列化为线性指令链。",
            },
          ],
        },
      ],
    },
    "src/test/wacc/ParserTests.scala": {
      path: "src/test/wacc/ParserTests.scala",
      type: "file",
      title: "ParserTests.scala",
      summary: "Parser 模块的 ScalaTest 单元测试，覆盖类型、表达式、语句与完整 program 解析。",
      language: "scala",
    },
    "src/test/wacc/TypeCheckerTests.scala": {
      path: "src/test/wacc/TypeCheckerTests.scala",
      type: "file",
      title: "TypeCheckerTests.scala",
      summary: "Type Checker 模块的单元测试，验证类型错误检测、作用域规则与函数签名检查。",
      language: "scala",
    },
  },
  pipeline: [
    {
      id: "source",
      label: "Source Code",
      path: "README.md",
      language: "Markdown",
      role: "项目说明与仓库结构",
    },
    {
      id: "lexer",
      label: "Lexer",
      path: "src/main/wacc/lexer.scala",
      language: "Scala",
      role: "将源文本转换为 token",
    },
    {
      id: "parser",
      label: "Parser",
      path: "src/main/wacc/parser.scala",
      language: "Scala",
      role: "构建抽象语法树",
    },
    {
      id: "ast",
      label: "AST",
      path: "src/main/wacc/ast.scala",
      language: "Scala",
      role: "供后续阶段共享的中间表示",
    },
    {
      id: "semantic",
      label: "Type Checker",
      path: "src/main/wacc/typeChecker.scala",
      language: "Scala",
      role: "校验类型、作用域与程序规则",
    },
    {
      id: "codegen",
      label: "ARM Codegen",
      path: "src/main/wacc/backend/arm/ARMCodeGenerator.scala",
      language: "Scala / ARM",
      role: "将 CFG 降低为 ARM 汇编",
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
      path: "src/main/wacc/lexer.scala",
      title: "Lexical Analysis",
      description:
        "查看 lexer.scala 如何将 WACC 源文本切分为 token，理解 parser 的输入是如何形成的。",
    },
    {
      id: "parser",
      label: "Parser",
      path: "src/main/wacc/parser.scala",
      title: "Parsing Stage",
      description:
        "理解 parser.scala 如何用 Parsley 组合子构建 Program AST，以及表达式优先级如何处理。",
    },
    {
      id: "ast",
      label: "AST",
      path: "src/main/wacc/ast.scala",
      title: "AST Definitions",
      description:
        "查看 AST 的类型定义，理解 Parser 与 Type Checker 之间的中间表示边界。",
    },
    {
      id: "semantic",
      label: "Semantic",
      path: "src/main/wacc/typeChecker.scala",
      title: "Semantic Checking",
      description:
        "查看 typeChecker.scala 中的类型检查、作用域解析与错误聚合如何完成。",
    },
    {
      id: "codegen",
      label: "Codegen",
      path: "src/main/wacc/backend/arm",
      title: "Code Generation",
      description:
        "理解 CFG 如何被 ARMCodeGenerator 降低为 ARM 指令，关注栈帧、寄存器约定与运行时调用。",
    },
    {
      id: "tests",
      label: "Tests",
      path: "src/test/wacc",
      title: "Testing Strategy",
      description:
        "最后查看测试结构，理解项目如何分阶段验证 compiler pipeline 的正确性。",
      note: "建议对照 ParserTests 与 TypeCheckerTests 理解各阶段的测试边界。",
    },
  ],
  narrative: {
    technicalDecisions: [
      {
        title: "为什么采用分阶段 compiler pipeline",
        decision:
          "将编译过程拆分为 Lexer、Parser、AST、Type Checker 和 ARM Codegen。",
        rationale:
          "每个阶段都有明确的输入输出，错误更容易定位，模块也可以独立开发与测试。",
        impact:
          "提高了项目的可维护性，并让前端语法分析与后端代码生成之间的职责边界更清晰。",
      },
      {
        title: "为什么把 AST 作为 Parser 和 Type Checker 之间的边界",
        decision:
          "用独立的 ast.scala 承载程序结构，Parser 只负责构建，Type Checker 只负责校验。",
        rationale:
          "AST 作为稳定中间表示，可以隔离语法细节与语义规则，避免两阶段相互渗透。",
        impact:
          "后续扩展语义规则或替换 parser 实现时，不必重写整个编译器前端。",
      },
      {
        title: "为什么把语义检查和代码生成分开",
        decision:
          "Type Checker 验证程序合法性，ARM Codegen 只处理已通过检查的 CFG。",
        rationale:
          "语义错误应在进入后端前被拦截，codegen 可以假设输入程序在类型层面合法。",
        impact:
          "降低了 Codegen 的复杂度，也让语义错误报告集中在一个阶段完成。",
      },
      {
        title: "为什么需要独立的测试结构验证各阶段",
        decision:
          "为 Parser、Type Checker 等阶段分别编写单元测试，而不是只做端到端测试。",
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
          "通过 Lexer → Parser → AST → Type Checker → ARM Codegen 的分层结构，展示了对编译器整体流程的设计能力。",
      },
      {
        title: "Scala / Functional-style Modelling",
        description:
          "使用 Scala 3 与 ADT 建模 AST 和编译阶段，体现了对函数式数据建模与模块组织的掌握。",
      },
      {
        title: "AST and Semantic Analysis",
        description:
          "通过 ast.scala 与 typeChecker.scala，展示了处理程序结构、类型规则与作用域管理的能力。",
      },
      {
        title: "ARM Assembly Code Generation",
        description:
          "通过 ARM 后端与栈帧/寄存器约定，展示了对底层执行模型与代码生成细节的理解。",
      },
      {
        title: "Testing and Debugging Complex Systems",
        description:
          "通过分阶段测试与 Diagnostic 设计，展示了在复杂系统中定位问题、验证行为的工程能力。",
      },
    ],
  },
};
