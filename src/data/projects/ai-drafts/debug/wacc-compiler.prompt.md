# System

You are an offline Project Analyzer for a personal engineering portfolio.
Output ONLY a valid JSON object. No markdown fences, no explanation text outside JSON.

Critical rules:
- Do NOT invent code. Do NOT output snippet code bodies.
- For snippets, output snippetSuggestions with filePath + startLine + endLine only.
- Snippet code will be extracted from real source by the offline script.
- If you are unsure about line numbers, omit the snippet or set confidence: "low".
- Explanatory fields use Chinese. JSON keys, paths, filenames, and language names stay in English.
- Do not invent files or modules not present in the provided context.
- When inferring from path only, note uncertainty in analysis.notes or warnings.
- Prefer concise structured analysis over verbose prose.

Project-level checks (template: compiler-pipeline):
- Verify suggestedPipeline covers main stages: Lexer / Parser / AST / Semantic / Type Checker / IR or CFG / Codegen / Tests / Entry point (Main)
- Check for missing entry point (Main / index / app / server / cli)
- Check for missing IR / model / schema layer if applicable
- Check for missing tests representation
- Add gaps to warnings (e.g. "CFG stage not covered in pipeline")

Snippet rules:
- Max 3 snippetSuggestions per file entry.
- startLine/endLine must refer to lines visible in the provided source excerpt when possible.
- Do NOT include a "code" field in snippetSuggestions.

# User

# Project Analysis Request

Project ID: wacc-compiler
Title: WACC Compiler
Description: 词法 → 语法 → 语义 → CFG → ARM 代码生成的完整 WACC 编译器管线。
Template: compiler-pipeline

## Template Context
Template: compiler-pipeline
Description: 用于解释从源代码到目标代码生成的多阶段编译器项目。

Folder role hints:
- lexer: 词法分析相关模块
- parser: 语法分析相关模块
- ast: 抽象语法树定义
- semantic: 语义检查相关模块
- typechecker: 类型检查相关模块
- codegen: 目标代码生成相关模块
- backend: 后端代码生成相关模块
- tests: 测试与验证
- test: 测试与验证

## Manual Analysis (reference only — improve upon, do not plagiarize)
Title: WACC Compiler
Description: 词法 → 语法 → 语义 → CFG → ARM 代码生成的完整 WACC 编译器管线。

Existing pipeline (reference only, do not copy verbatim):
- source: Source Code → README.md (项目说明与仓库结构)
- lexer: Lexer → src/main/wacc/lexer.scala (将源文本转换为 token)
- parser: Parser → src/main/wacc/parser.scala (构建抽象语法树)
- ast: AST → src/main/wacc/ast.scala (供后续阶段共享的中间表示)
- semantic: Type Checker → src/main/wacc/typeChecker.scala (校验类型、作用域与程序规则)
- codegen: ARM Codegen → src/main/wacc/backend/arm/ARMCodeGenerator.scala (将 CFG 降低为 ARM 汇编)

Existing guided tour (reference only):
- overview: Overview →  — Project Overview
- lexer: Lexer → src/main/wacc/lexer.scala — Lexical Analysis
- parser: Parser → src/main/wacc/parser.scala — Parsing Stage
- ast: AST → src/main/wacc/ast.scala — AST Definitions
- semantic: Semantic → src/main/wacc/typeChecker.scala — Semantic Checking
- codegen: Codegen → src/main/wacc/backend/arm — Code Generation
- tests: Tests → src/test/wacc — Testing Strategy

Manual entry summaries (reference only):
- : WACC 编译器项目根目录。Scala 3 实现，源码位于 src/main/wacc/，测试位于 src/test/wacc/。
- src/main/wacc: 编译器核心源码目录。lexer、parser、AST、typeChecker、CFG 与 ARM backend 均在此包内，以 Scala 文件组织各阶段。
- src/main/wacc/backend/arm: ARM 32 位后端：指令生成、寄存器分配、活跃性分析与运行时辅助。ARMCodeGenerator 将 CFG 降低为可汇编的指令序列。
- src/test/wacc: ScalaTest 测试集，覆盖 lexer、parser、typeChecker、codegen 与 integration 等阶段，支持分阶段验证编译器行为。
- README.md: 项目说明文档，介绍仓库结构、构建方式与 WACC 实验背景。
- src/main/wacc/lexer.scala: 词法分析模块，基于 Parsley Lexer 定义 WACC 关键字、标识符、字面量与运算符的 token 规则。
- src/main/wacc/parser.scala: 语法分析主文件，用 Parsley 组合子解析 program、function、stmt 与 expr，构建 Program AST。
- src/main/wacc/ast.scala: WACC 抽象语法树 ADT 定义，涵盖类型、表达式、语句、函数与 Program 根节点，供 parser 与 typeChecker 共享。
- src/main/wacc/typeChecker.scala: 静态语义分析入口，维护函数/变量环境，遍历 AST 报告类型不匹配、作用域与返回路径错误。
- src/main/wacc/backend/arm/ARMCodeGenerator.scala: ARM 32 位代码生成器，将 CFGProgram 降低为 ARM 指令链，包含寄存器分配、栈帧管理与运行时辅助。

## File Tree (depth-limited)
- (root)/
  - src/
    - src/main/
      - src/main/wacc/
        - src/main/wacc/backend/
        - src/main/wacc/interpreter/
        - src/main/wacc/ast.scala
        - src/main/wacc/bridge.scala
        - src/main/wacc/CFG.scala
        - src/main/wacc/ConstantPropagation.scala
        - src/main/wacc/diagnostics.scala
        - src/main/wacc/ImportResolver.scala
        - src/main/wacc/lexer.scala
        - src/main/wacc/Main.scala
        - src/main/wacc/parser.scala
        - src/main/wacc/REPL.scala
        - src/main/wacc/RuntimeError.scala
        - src/main/wacc/scope.scala
        - src/main/wacc/typeChecker.scala
    - src/test/
      - src/test/wacc/
        - src/test/wacc/custom-integration/
        - src/test/wacc/imports/
        - src/test/wacc/CFGTests.scala
        - src/test/wacc/CodeGeneratorTests.scala
        - src/test/wacc/EvaluatorTests.scala
        - src/test/wacc/ImportResolverTests.scala
        - src/test/wacc/IntegrationTests.scala
        - src/test/wacc/InterpreterTests.scala
        - src/test/wacc/LexerTests.scala
        - src/test/wacc/OptimizationTests.scala
        - src/test/wacc/ParserTests.scala
        - src/test/wacc/PrimitiveEvaluatorTests.scala
        - src/test/wacc/PrinterTests.scala
        - src/test/wacc/README.md
        - src/test/wacc/RenamerTests.scala
        - src/test/wacc/TypeCheckerTests.scala
        - src/test/wacc/WaccTestBase.scala
  - compile
  - Makefile
  - project.scala
  - README.md

## Selected Source Files (20)
### File 1: src/main/wacc/CFG.scala
Score: 980
Reasons: priority path: src/main/wacc/CFG.scala; priority pattern: **/*CFG*; compiler-pipeline template: IR/CFG; core path: src/main; preferred text extension
Type: file (file)
Language: scala
Size: 13696 bytes
```
package wacc

import scala.collection.mutable
import scala.collection.mutable.ArrayBuffer

final case class CFG[A, E](
    val name: Option[String] = None,
    val params: Option[List[Param]] = None
) {
    import CFG._

    private var nextBlockId = 0
    def getNextBlockId(): BlockId = {
        val id = nextBlockId
        nextBlockId += 1
        BlockId(id)
    }
    val entry = getNextBlockId()
    val blocks = mutable.Map[BlockId, BasicBlock[A, E]]()
    val index = CFGIndex(
        succ = mutable.Map[BlockId, List[BlockId]](),
        pred = mutable.Map[BlockId, List[BlockId]](),
        order = Nil
    )

    def updateBlock(id: BlockId, block: BasicBlock[A, E]) = {
        blocks(id) = block
    }

    def getBlockIdInOrder(): List[BlockId] = {
        if (index.order.isEmpty) { // recompute order if stale
            val rpo = ArrayBuffer[BlockId]()
            dfsVisit(entry, mutable.Set.empty, rpo)
            index.order =
                rpo.toList.reverse // store the reverse-post-order traversal of cfg
        }
        index.order
    }

    def getBlocksInOrder(): List[BasicBlock[A, E]] = {
        getBlockIdInOrder().map(id => blocks(id))
    }

    // traverse cfg in post-order to get reverse post-order
    private def dfsVisit(
        entry: BlockId,
        visited: mutable.Set[BlockId],
        out: ArrayBuffer[BlockId]
    ): Unit = {
        if (!visited.contains(entry)) {
            visited.add(entry)
            for (succ <- index.succ.getOrElse(entry, List.empty)) {
                dfsVisit(succ, visited, out)
            }
            out += entry
        }
    }

    def addBlock(
        stmts: List[A],
        terminator: Terminator[A, E],
        pred: List[BlockId] = List.empty,
        id: BlockId =
            getNextBlockId() // allow passing pre-allocated id (e.g. if statement)
    ): BlockId = {
        val block = BasicBlock(id, stmts, terminator)
        blocks(id) = block
        index.succ(id) = index.succ.getOrElse(id, List.empty)
        index.pred(id) = pred
        for (p <- pred) {
            index.succ.update(p, index.succ.getOrElse(p, List.empty) :+ id)
        }
        this.index.order = Nil // mark order as stale, will be recomputed when needed
        id
    }

    def addBackEdge(from: BlockId, to: BlockId) = {
        index.succ.update(
            from,
            index.succ.getOrElse(from, List.empty) :+ to
        )
        index.pred.update(to, index.pred.getOrElse(to, List.empty) :+ from)
        this.index.order = Nil // mark order as stale, will be recomputed when needed
    }

    def getSuccessors(id: BlockId): List[BlockId] =
        index.succ.getOrElse(id, Nil)
    def getPredecessors(id: BlockId): List[BlockId] =
        index.pred.getOrElse(id, Nil)
}

object CFG {
    // wrapper of int to avoid confusion, extends AnyVal to eliminate runtime overhead
    final case class BlockId(id: Int) extends AnyVal

    final case class BasicBlock[A, E](
        id: BlockId,
        stmts: List[A],
        terminator: Terminator[A, E]
    )

    sealed trait Terminator[A, E]
    object Terminator {
        case class Jump[A, E](target: BlockId) extends Terminator[A, E]
        case class Branch[A, E](
            cond: E,
            trueTarget: BlockId,
            falseTarget: BlockId
        ) extends Terminator[A, E]
        case class Return[A, E](expr: E) extends Terminator[A, E]
        case class Exit[A, E](expr: E) extends Terminator[A, E]
    }

    final case class CFGProgram[A, E](
        funcs: Map[String, CFG[A, E]],
        main: CFG[A, E]
    )

    final case class CFGIndex(
        succ: mutable.Map[BlockId, List[BlockId]],
        pred: mutable.Map[BlockId, List[BlockId]],
        var order: List[BlockId]
    )

    def apply(prog: Program): CFGProgram[Stmt, Expr] = buildProgramCFG(prog)

    private def buildProgramCFG(prog: Program): CFGProgram[Stmt, Expr] = {
        val funcCFG = mutable.Map[String, CFG[Stmt, Expr]]()
        for (func <- prog.funcs) yield {
            val cfg = new CFG[Stmt, Expr](Some(func.ident), Some(func.params))
            buildStmtCFG(
                func.body.stmts,
                cfg,
                pred = Nil,
                curId = Some(cfg.entry)
            )
            cfg.getBlocksInOrder()
            funcCFG(func.ident) = cfg
        }
        val mainCFG = new CFG[Stmt, Expr](None, None)
        buildStmtCFG(
            prog.main.stmts,
            mainCFG,
            pred = Nil,
            curId = Some(mainCFG.entry)
        )
        mainCFG.getBlocksInOrder()
        CFGProgram(funcCFG.toMap, mainCFG)
    }

    // returns the list of block ids built out of the given stmts
    private def buildStmtCFG(
        stmts: List[Stmt],
        cfg: CFG[Stmt, Expr],
        pred: List[BlockId],
        curId: Option[BlockId], // allow passing pre-allocated id
        nextId: Option[BlockId] =
            None, // allow passing pre-allocated id for the next block after flushing current buffer, used to link if/else/while blocks to rest of stmts
        buffer: List[Stmt] =
            List.empty // the current block's statements, flushed to a new block when terminator is encountered
    ): List[BlockId] = {
        stmts match {
            case Nil =>
                if (buffer.nonEmpty || pred.nonEmpty) {
                    // implicit exit with 0 if no explicit terminator, only possible in main program
                    val terminator: Terminator[Stmt, Expr] =
                        if (nextId.nonEmpty) {
                            Terminator.Jump(nextId.get)
                        } else {
                            Terminator.Exit(IntLiter(0)(pos = (0, 0)))
                        }

                    val newBlockId: BlockId = cfg.addBlock(
                        buffer,
                        terminator,
                        pred,
                        curId.getOrElse(cfg.getNextBlockId())
                    )
                    List(newBlockId)
                } else {
                    Nil
                }
            case stmt :: rest =>
                stmt match {
                    case If(cond, thenStmt, elseStmt) => {
                        // pre-allocate if for branches, then flush current buffer with branch terminator
                        val thenBlockId = cfg.getNextBlockId()
                        val elseBlockId = cfg.getNextBlockId()
                        val curBlockId: BlockId = cfg.addBlock(
                            buffer,
                            Terminator.Branch(cond, thenBlockId, elseBlockId),
                            pred,
                            curId.getOrElse(cfg.getNextBlockId())
                        )

                        // to link then/else blocks
                        val restBlockId = cfg.getNextBlockId()

                        // build then and else blocks recursively, then build the rest of the statements with then/else blocks as pred
                        val thenBlocks: List[BlockId] = buildStmtCFG(
                            thenStmt.stmts,
                            cfg,
                            List(curBlockId),
                            curId = Some(thenBlockId),
                            nextId = Some(restBlockId)
                        )
                        val elseBlocks: List[BlockId] = buildStmtCFG(
                            elseStmt.stmts,
                            cfg,
                            List(curBlockId),
                            curId = Some(elseBlockId),
                            nextId = Some(restBlockId)
                        )

                        buildStmtCFG(
                            rest,
                            cfg,
                            thenBlocks ++ elseBlocks,
                            curId = Some(restBlockId),
                            nextId = nextId
                        )
                    }
                    case While(cond, body) => {
                        val condBlockId = cfg.getNextBlockId()
                        val bodyBlockId = cfg.getNextBlockId()
                        val restBlockId = cfg.getNextBlockId()

                        // flush buffer with jump to condition block
                        val curBlockId: BlockId = cfg.addBlock(
                            buffer,
                            Terminator.Jump(condBlockId),
                            pred,
                            curId.getOrElse(cfg.getNextBlockId())
                        )

                        // condition block with empty body and branch terminator, pred is current block and body block
                        cfg.addBlock(
                            Nil,
                            Terminator.Branch(cond, bodyBlockId, restBlockId),
                            List(
                                curBlockId
                            ), // add link from body exits to condition block later
                            condBlockId
                        )

                        // build body block with jump to condition block as terminator, pred is condition block
                        val bodyExits = buildStmtCFG(
                            body.stmts,
                            cfg,
                            List(condBlockId),
                            curId = Some(bodyBlockId),
                            nextId = Some(condBlockId)
                        )

                        for (exitId <- bodyExits) {
                            cfg.addBackEdge(exitId, condBlockId)
                        }

                        // build the rest of the statements with condition block as pred
                        buildStmtCFG(
                            rest,
                            cfg,
                            List(condBlockId),
                            curId = Some(restBlockId),
                            nextId = nextId
                        )
                    }
                    case Block(nestedStmts) => {
                        // introduce a new block for nested stmts to maintain correct structure of ast
                        val nestedBlockId = cfg.getNextBlockId()
                        val restBlockId = cfg.getNextBlockId()

                        val curBlockId: BlockId = cfg.addBlock(
                            buffer,
                            Terminator.Jump(nestedBlockId),
                            pred,
                            curId.getOrElse(cfg.getNextBlockId())
                        )

                        val blockExits = buildStmtCFG(
                            nestedStmts.stmts,
                            cfg,
                            List(curBlockId),
                            curId = Some(nestedBlockId),
                            nextId = Some(restBlockId)
                        )

                        buildStmtCFG(
                            rest,
                            cfg,
                            blockExits,
                            curId = Some(restBlockId),
                            nextId = nextId
                        )
                    }
                    case Return(expr) => {
                        cfg.addBlock(
                            buffer,
                            Terminator.Return(expr),
                            pred,
                            curId.getOrElse(cfg.getNextBlockId())
                        )
                        Nil
                    }
                    case Exit(expr) => {
                        cfg.addBlock(
                            buffer,
                            Terminator.Exit(expr),
                            pred,
                            curId.getOrElse(cfg.getNextBlockId())
                        )
                        Nil
                    }
                    case Stmts(stmts) => {
                        // flatten nested Stmts
                        buildStmtCFG(
                            stmts ++ rest,
                            cfg,
                            pred,
                            curId,
                            nextId,
                            buffer
                        )
                    }
                    case Assign(_, _) | RenamedDecl(_, _, _) | Skip | Read(_) |
                        Free(_) | Print(_) | Println(_) | Decl(_, _, _) |
                        Lock(_) | Unlock(_) | Send(_, _) => { 
                        // Decl should not exist at this stage
                        // just add to current buffer for the rest
                        buildStmtCFG(
                            rest,
                            cfg,
                            pred,
                            curId,
                            nextId,
                            buffer :+ stmt
                        )
                    }
                    case Fork(call) => buildStmtCFG(
                        rest,
                        cfg,
                        pred,
                        curId,
                        nextId,
                        buffer :+ stmt
                    )
                    case Par(_) =>
                        // Keep Par as statement (flag for codegen to emit fork/join); implicit join at block end
                        buildStmtCFG(rest, cfg, pred, curId, nextId, buffer :+ stmt)
                    case Join => buildStmtCFG(
                        rest,
                        cfg,
                        pred,
                        curId,
                        nextId,
                        buffer :+ stmt
                    )
                }
        }
    }
}

```

### File 2: src/main/wacc/backend/arm/ARMCodeGenerator.scala
Score: 790
Reasons: priority pattern: **/*CodeGenerator*; manual pipeline path; manual guided tour path; manual entry exists; compiler-pipeline template: code generation; core path: src/main; core path: backend; preferred text extension
Type: file (file)
Language: scala
Size: 46017 bytes
Content: truncated
```
package wacc
package backend
package arm

import cats.data.{Chain, NonEmptyList}
import scala.collection.mutable
import scala.collection.mutable.ArrayBuffer
import CFG._
import CFG.Terminator._
import Instr._
import Register.PhysicalReg
import Register.PhysicalReg._
import Cond._
import typeChecker.VarKey
import RuntimeError._

class ARMCodeGenerator extends CodeGenerator {
    import ARMCodeGenerator.LabeledBlock

    private given label: LabelManager = LabelManager { case (prefix, nextId) =>
        s".L_${prefix}_$nextId"
    }
    private given rodata: DataManager = DataManager()
    private given runtime: RuntimeProvider = RuntimeProvider()

    private val alignment = 4 // 4-byte alignment for all data

    // check rodata, return existing label or create new one for the string literal
    private def labelForStringLiteral(str: String): String =
        rodata.use(str, "str")

    private def concatInstrs[A, R <: Register](xs: IterableOnce[A])(
        f: A => Chain[Instr[R]]
    ): Chain[Instr[R]] =
        xs.iterator.foldLeft(Chain.empty[Instr[R]]) { (acc, x) =>
            acc ++ f(x)
        }

    private def concatBlocks[A, R <: Register](xs: IterableOnce[A])(
        f: A => Chain[LabeledBlock[R]]
    ): Chain[LabeledBlock[R]] =
        xs.iterator.foldLeft(Chain.empty[LabeledBlock[R]]) { (acc, x) =>
            acc ++ f(x)
        }

    // Entry: translate a whole CFG program into a linear list of Instr
    def generate(
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
    }

    def rodataDefinitions: List[(String, String)] =
        rodata.definitions.sortBy(_._2)

    /** Manages the generation state and logic for a single function. */
    private class FunctionGenerator(
        private val name: String,
        private val cfg: CFG[Stmt, Expr],
        private val optimize: Boolean = true
    ) {
        private val frame =
            mutable.Map.empty[VarKey, Int] // function-local frame offsets
        private val types =
            mutable.Map.empty[VarKey, Type] // function-local type info
        private val blockLabels =
            mutable.Map.empty[Int, String] // CFG block id -> emitted label
        private var nextVirtualReg: Int =
            0 // function-local virtual register counter
        private val prologueSavedRegs =
            NonEmptyList.of(R4, R5, R6, R7, R8, R9, R10, FP, LR)

        private def freshVirtualReg(): Register.VirtualReg = {
            val reg = Register.VirtualReg(nextVirtualReg)
            nextVirtualReg += 1
            reg
        }

        private def labelForBlock(blockId: Int): String = {
            blockLabels.getOrElseUpdate(
                blockId,
                label.local(s"block$blockId")
            )
        }

        private def localSlotAddress(offset: Int): Address.Offset[PhysicalReg] =
            Address.Offset(FP, Some(Op2.Imm(offset)), add = false)

        // Lower one CFG to labeled blocks and flatten only at final emission.
        def generate(): Chain[LabeledBlock[PhysicalReg]] = {
            var nextLocalOffset =
                alignment // FP points to last saved register, next available slot is at FP - 4, grow downwards
            val paramBindings = cfg.params.getOrElse(Nil).collect {
                case RenamedParam(t, renamedIdent) =>
                    val key: VarKey = (renamedIdent.ident, renamedIdent.id)
                    val slot = nextLocalOffset
                    nextLocalOffset += alignment
                    frame(key) = slot
                    types(key) = t
                    (key, slot)
            }

            val blocks = concatBlocks(cfg.getBlocksInOrder())(genBlock)

            val (rewritten, frameSize) =
                if (optimize)
                    RegAlloc.allocateBlocks(
                        blocks,
                        frame.values.maxOption.getOrElse(0) + alignment
                    )
                else
                    RegAllocNaive.allocateBlocks(
                        blocks,
                        frame.values.maxOption.getOrElse(0) + alignment
                    )

            val incomingArgBase =
                prologueSavedRegs.length * alignment // arguments passed on stack start after saved registers
            val paramNormalize = concatInstrs(paramBindings.zipWithIndex) {
                case ((_, localSlot), index) =>
                    // load arguments stored on stack by caller into local frame slots for uniform access
                    Chain(
                        Ldr(
                            AL,
                            R12, // R12 is the inter-procedural scratch register
                            Address.Offset(
                                FP,
                                Some(
                                    Op2.Imm(incomingArgBase + alignment * index)
                                ),
                                add = true
                            )
                        ),
                        Str(AL, R12, localSlotAddress(localSlot))
                    )
            }

            val prologueInstrs = Chain(
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
            ) ++ paramNormalize ++
                Chain(
                    B(AL, s"entryLabel_$name"),
                    Ltorg // put literal pool after prologue to ensure it's within range of all instructions in the function
                )

            val prologueBlock = LabeledBlock(name, prologueInstrs)
            val entryBlock = LabeledBlock(s"entryLabel_$name", Chain.empty)
            val endLtorgBlock =
                LabeledBlock(label.local(s"${name}_epilogue"), Chain(Ltorg))
            Chain(prologueBlock, entryBlock) ++ rewritten ++ Chain(
                endLtorgBlock
            )
        }

        // Generate labeled instructions for a single basic block.
        private def genBlock(
            block: BasicBlock[Stmt, Expr]
        ): Chain[LabeledBlock[Register]] = {
            val blockLabel = labelForBlock(block.id.id)
            val stmts = concatInstrs(block.stmts)(genStmt)
            val term = genTerminator(block.terminator)
            LabeledBlock.split(blockLabel, stmts ++ term)
        }

        // Terminators -> branches / returns
        private def genTerminator(
            term: Terminator[Stmt, Expr]
        ): Chain[Instr[Register]] =
            term match {
                case Jump(target) =>
                    Chain(
                        B(AL, labelForBlock(target.id)),
                        Ltorg
                    ) // put literal pool after each unconditional jump to ensure it's within range

                case Branch(cond, t, f) =>
                    val temp = freshVirtualReg()
                    genExpr(cond, temp) ++
                        Chain(
                            Cmp(AL, temp, Op2.Imm(1)),
                            B(EQ, labelForBlock(t.id)),
                            B(AL, labelForBlock(f.id)),
                            Ltorg // put literal pool after each conditional jump to ensure it's within range
                        )

                case Return(expr) =>
                    genExpr(expr, R0) ++
                        Chain(
                            Mov(AL, SP, Op2.Reg(FP)),
                            Pop(
                                NonEmptyList.of(
                                    R4,
                                    R5,
                                    R6,
                                    R7,
                                    R8,
                                    R9,
                                    R10,
                                    FP,
                                    PC
                                )
                            )
                        )

                case Exit(expr) =>
                    val temp = freshVirtualReg()
                    genExpr(expr, temp) ++
                        runtime.exit(temp)

            }

        private def genStmt(stmt: Stmt): Chain[Instr[Register]] = stmt match {
            case Skip =>
                Chain.empty

            case Assign(lvalue, rvalue) =>
                val t = freshVirtualReg()
                genRValue(rvalue, t) ++ genLValueStore(lvalue, t)

            case RenamedDecl(tp, rv, rvalue) =>
                val key: VarKey = (rv.ident, rv.id)
                types(key) = tp
                val slot = frame.values.maxOption.getOrElse(0) + alignment
                frame(key) = slot
                val t = freshVirtualReg()
                genRValue(rvalue, t) ++ Chain(
                    Str(
                        AL,
                        t,
                        localSlotAddress(slot)
                    )
                )

            case Read(lvalue) =>
                val addrReg = freshVirtualReg()
                val (addrInstrs, t) = genLValueAddr(lvalue, addrReg)
                addrInstrs ++ runtime.read(addrReg, t)

            case Print(expr) =>
                val t = freshVirtualReg()
                genExpr(expr, t) ++ printByType(expr, t, newline = false)

            case Println(expr) =>
                val t = freshVirtualReg()
                genExpr(expr, t) ++ printByType(expr, t, newline = true)

            case Free(expr) =>
                val tReg = freshVirtualReg()
                val instrs = genExpr(expr, tReg)
                // If it's an array, we must free from the start of the length header (addr - 4)
                val freeInstrs = expr match {
                    case v: RenamedVar =>
                        types.get((v.ident, v.id)) match {
                            case Some(ArrayType(_)) =>
                                runtime.freeArray(tReg)
                            case _ => runtime.free(tReg)
                        }
                    case _ => runtime.free(tReg)
                }
                instrs ++ freeInstrs

            case Block(stmts) => concatInstrs(stmts.stmts)(genStmt)

            case Decl(_, _, _) =>
                throw new UnsupportedOperationException(
                    s"unrenamed variable declarations should have been handled by frontend"
                )

            case Stmts(stmts) => concatInstrs(stmts)(genStmt)

            case Fork(call) =>
                genFork(call)

            case Par(branches) =>
                genPar(branches)

            case Join =>
                runtime.join()

            case Lock(lvalue) => 
                val addrReg = freshVirtualReg()
                val (addrInstrs, _) = genLValueAddr(lvalue, addrReg)
                addrInstrs ++ runtime.mutexLock(addrReg)

            case Unlock(lvalue) =>
                val addrReg = freshVirtualReg()
                val (addrInstrs, _) = genLValueAddr(lvalue, addrReg)
                addrInstrs ++ runtime.mutexUnlock(addrReg)

            case Send(ch, v) =>
                val chReg = freshVirtualReg()
                val vReg = freshVirtualReg()
                genExpr(ch, chReg) ++ genExpr(v, vReg) ++ runtime.channelSend(chReg, vReg)

            case _ =>
                throw new UnsupportedOperationException(s"unsupported statement: $stmt")
        }

        private def genRValue(
            rv: RValue,
            target: Register
        ): Chain[Instr[Register]] =
            rv match {
                case e: Expr           => genExpr(e, target)
                case ArrayLiter(elems) =>
                    val al = rv.asInstanceOf[ArrayLiter]
                    val elemType = al.inferredType match {
                        case Some(ArrayType(t)) => t
                        case _                  => IntType
                    }
                    val elemSize = elemType match {
                        case CharType | BoolType => 1
                        case _                   => alignment
                    }
                    val lenReg = freshVirtualReg()

                    Chain(LdrLit(AL, lenReg, LitExpr.Const(elems.length))) ++
                        runtime.mallocArray(lenReg, elemSize, target) ++
                        concatInstrs(elems.zipWithIndex) { case (elem, i) =>
                            val elemReg = freshVirtualReg()
                            genExpr(elem, elemReg) ++
                                Chain(
                                    if (elemSize == 1)
                                        Strb( // strb for 1-byte elements, str for 4-byte elements
                                            AL,
                                            elemReg,
                                            Address.Offset(
                                                target,
                                                Some(Op2.Imm(i * elemSize)),
                                                add = true
                                            )
                                        )
                                    else
                                        Str(
                                            AL,
                                            elemReg,
                                            Address.Offset(
                                                target,
                                                Some(Op2.Imm(i * elemSize)),
                                                add = true
                                            )
                                        )
                                )
                        }

                case NewPair(fst, snd) =>
                    val pairAddr = freshVirtualReg()
                    val size8 = freshVirtualReg()
                    val fstVal = freshVirtualReg()
                    val sndVal = freshVirtualReg()

                    genExpr(fst, fstVal) ++
                        genExpr(snd, sndVal) ++
                        Chain(Mov(AL, size8, Op2.Imm(alignment * 2))) ++
                        runtime.malloc(size8, pairAddr) ++
                        Chain(
                            Str(AL, fstVal, Address.Offset(pairAddr, None)),
                            Str(
                                AL,
                                sndVal,
                                Address.Offset(
                                    pairAddr,
                                    Some(Op2.Imm(alignment)),
                                    add = true
                                )
                            ),
                            Mov(AL, target, Op2.Reg(pairAddr))
                        )
                case Fst(lvalue) => getPairElem(target, lvalue, isFst = true)
                case Snd(lvalue) => getPairElem(target, lvalue, isFst = false)
                case NewChan() =>
                    runtime.newChan(target)
                case Call(ident, args) =>
                    val evaluatedArgs = args.map { arg =>
                        val temp = freshVirtualReg()
                        genExpr(arg, temp) -> temp
                    }

                    val pushArgs = evaluatedArgs.reverse.map { case (_, temp) =>
                        Push(NonEmptyList.of(temp))
                    }

                    // reclaim stack space after returning from function
                    val stackCleanup =
                        if (args.nonEmpty)
                            Chain(
                                Add(
                                    AL,
                                    false,
                                    SP,
                                    SP,
                                    Op2.Imm(args.length * alignment)
                                )
                            )
                        else Chain.empty

                    concatInstrs(evaluatedArgs)(_._1) ++
                        Chain.fromSeq(pushArgs) ++
                        Chain(Bl(AL, ident)) ++
                        stackCleanup ++
                        Chain(
                            Mov(AL, target, Op2.Reg(R0))
                        ) // return value in r0
            }

        /** Par: fork each branch, implicit join. Each branch runs in a thread; parent FP passed for shared locals. */
        private def genPar(branches: List[Stmts]): Chain[Instr[Register]] = {
            if (branches.isEmpty) return Chain.empty

            val afterLabel = label.local("par_after")
            val branchLabels = branches.indices.map(i => label.local(s"par_branch_$i")).toList

            // Thread return from a C-callable trampoline target:
            // restore callee-saved regs, then return to trampoline via LR.
            val threadReturn = Chain(
                Pop(NonEmptyList.of(R4, R5, R6, R7, R8, R9, R10, FP, LR)),
                Bx(AL, LR)
            )

            val branchCode = branches.zip(branchLabels).foldLeft(Chain.empty[Instr[Register]]) {
                case (acc, (branchStmts, branchLabel)) =>
                    val prologue = Chain(
                        LabelDef(branchLabel),
                        Ldr(AL, R12, Address.Offset(SP, None, add = false)),
                        Push(NonEmptyList.of(R4, R5, R6, R7, R8, R9, R10, FP, LR)),
                        Mov(AL, FP, Op2.Reg(R12))
                    )
                    val body = concatInstrs(branchStmts.stmts)(genStmt)
                    acc ++ prologue ++ body ++ threadReturn
            }

            val structSize = 12
            val forkForBranch = (branchLabel: String) => {
                val structPtr = freshVirtualReg()
                val sizeReg = freshVirtualReg()
                Chain(LdrLit(AL, sizeReg, LitExpr.Const(structSize))) ++
                    runtime.malloc(sizeReg, structPtr) ++
                    Chain(
                        LdrLit(AL, sizeReg, LitExpr.SymbolRef(branchLabel)),
                        Str(AL, sizeReg, Address.Offset(structPtr, None, add = false)),
                        LdrLit(AL, sizeReg, LitExpr.Const(1)),
                        Str(AL, sizeReg, Address.Offset(structPtr, Some(Op2.Imm(4)), add = true)),
                        Str(AL, FP, Address.Offset(structPtr, Some(Op2.Imm(8)), add = true))
                    ) ++ runtime.fork(structPtr)
            }

            val joins = (0 until branches.length).foldLeft(Chain.empty[Instr[Register]])(
                (acc, _) => acc ++ runtime.join()
            )

            Chain(B(AL, afterLabel)) ++
                branchCode ++
                Chain(LabelDef(afterLabel)) ++
                concatInstrs(branchLabels)(forkForBranch) ++
                joins
        }

        private def genFork(call: Call): Chain[Instr[Register]] = {
            val structSize = 8 + call.args.length * alignment
            val structPtr = freshVirtualReg()
            val sizeReg = freshVirtualReg()

            val evalArgs = call.args.map { arg =>
                val temp = freshVirtualReg()
                genExpr(arg, temp) -> temp
            }

            val storeStruct =
                Chain(LdrLit(AL, sizeReg, LitExpr.Const(structSize))) ++
                    runtime.malloc(sizeReg, structPtr) ++
                    Chain(
                        LdrLit(AL, sizeReg, LitExpr.SymbolRef(call.ident)),
                        Str(AL, sizeReg, Address.Offset(structPtr, None, add = false)),
                        LdrLit(AL, sizeReg, LitExpr.Const(call.args.length)),
                        Str(AL, sizeReg, Address.Offset(structPtr, Some(Op2.Imm(4)), add = true))
```

### File 3: src/main/wacc/ast.scala
Score: 745
Reasons: priority pattern: **/*AST*; manual pipeline path; manual guided tour path; manual entry exists; compiler-pipeline template: AST; core path: src/main; preferred text extension
Type: file (file)
Language: scala
Size: 8437 bytes
```
package wacc

import parsley.Parsley
import parsley.position.pos
import parsley.macros.bridge
import diagnostics.ErrPos

// ========== IMPORTS ==========
final case class Import(path: String)(val pos: ErrPos)
object Import extends ParserBridgePos1[String, Import]

// ========== TYPES ==========
sealed trait Type

case object IntType extends Type
case object BoolType extends Type
case object CharType extends Type
case object StringType extends Type

final case class ArrayType(elemType: Type) extends Type
final case class PairType(fstType: PairElemType, sndType: PairElemType)
    extends Type

object ArrayType {
    val ArrayType = bridge[ArrayType]
    export ArrayType.apply
}

object PairType {
    val PairType = bridge[PairType]
    export PairType.apply
}

sealed trait PairElemType
final case class PairElemBaseType(base: Type) extends PairElemType
final case class PairElemArrayType(array: ArrayType) extends PairElemType
case object ErasedPairType extends PairElemType, Type
case object UnknownType extends Type

object PairElemBaseType {
    val PairElemBaseType = bridge[PairElemBaseType]
    export PairElemBaseType.apply
}

object PairElemArrayType {
    val PairElemArrayType = bridge[PairElemArrayType]
    export PairElemArrayType.apply
}

// ========== EXPRESSIONS ==========
sealed trait HasInferredType {
    var inferredType: Option[Type] = None
}

sealed trait Expr extends RValue, HasInferredType {
    def pos: ErrPos
}

final case class IntLiter(value: Int)(val pos: ErrPos) extends Expr
final case class BoolLiter(value: Boolean)(val pos: ErrPos) extends Expr
final case class CharLiter(value: Char)(val pos: ErrPos) extends Expr
final case class StringLiter(value: String)(val pos: ErrPos) extends Expr
final case class NullLiter()(val pos: ErrPos)
    extends Expr // Pair-liter corr to NullLiter
final case class Var(name: String)(val pos: ErrPos) extends Expr, LValue
final case class ArrayElem(ident: String, indices: List[Expr])(val pos: ErrPos)
    extends Expr,
      LValue
// ‘(’ ⟨expr⟩ ‘)’ handled in parser

// for semantic analysis
final case class RenamedVar(ident: String, id: Int)(val pos: ErrPos)
    extends Expr,
      LValue
final case class RenamedArrayElem(
    renamedVar: RenamedVar,
    indices: List[Expr]
)(val pos: ErrPos)
    extends Expr,
      LValue

// inherit from bridge if error message position should be at the front
object IntLiter extends ParserBridgePos1[Int, IntLiter]
object BoolLiter extends ParserBridgePos1[Boolean, BoolLiter]
object CharLiter extends ParserBridgePos1[Char, CharLiter]
object StringLiter extends ParserBridgePos1[String, StringLiter]
object Var extends ParserBridgePos1[String, Var]

enum UnaryOper(val str: String):
    case Not extends UnaryOper("!")
    case Neg extends UnaryOper("-")
    case Len extends UnaryOper("len")
    case Ord extends UnaryOper("ord")
    case Chr extends UnaryOper("chr")

enum BinaryOper(val str: String):
    case Mul extends BinaryOper("*")
    case Div extends BinaryOper("/")
    case Mod extends BinaryOper("%")
    case Add extends BinaryOper("+")
    case Sub extends BinaryOper("-")
    case Gt extends BinaryOper(">")
    case Gte extends BinaryOper(">=")
    case Lt extends BinaryOper("<")
    case Lte extends BinaryOper("<=")
    case Eq extends BinaryOper("==")
    case Neq extends BinaryOper("!=")
    case And extends BinaryOper("&&")
    case Or extends BinaryOper("||")

final case class BinaryOp(op: BinaryOper, lhs: Expr, rhs: Expr)(val pos: ErrPos)
    extends Expr
final case class UnaryOp(op: UnaryOper, expr: Expr)(val pos: ErrPos)
    extends Expr

// ========== STATEMENTS ==========
final case class Program(
    funcs: List[Func],
    main: Stmts,
    imports: List[Import] = Nil
)
final case class Func(
    retType: Type,
    ident: String,
    params: List[Param],
    body: Stmts
)(pos0: ErrPos) {
    val pos: ErrPos = pos0
}

// // for semantic analysis

// Param-list not added, only used in func
sealed trait Param {
    def t: Type
    def name: String
    def pos: ErrPos
}
final case class FuncParam(t: Type, name: String)(val pos: ErrPos) extends Param
// for semantic analysis
final case class RenamedParam(t: Type, renamedIdent: RenamedVar)(
    val pos: ErrPos
) extends Param {
    override val name: String = renamedIdent.ident
}

object FuncParam extends ParserBridgePos2[Type, String, FuncParam]

sealed trait Stmt
case object Skip extends Stmt
final case class Decl(t: Type, ident: String, rvalue: RValue)(val pos: ErrPos)
    extends Stmt
final case class Assign(lvalue: LValue, rvalue: RValue)(val pos: ErrPos)
    extends Stmt
final case class Read(lvalue: LValue)(val pos: ErrPos) extends Stmt
final case class Free(expr: Expr)(val pos: ErrPos) extends Stmt, HasInferredType
final case class Return(expr: Expr)(val pos: ErrPos)
    extends Stmt,
      HasInferredType
final case class Exit(expr: Expr)(val pos: ErrPos) extends Stmt, HasInferredType
final case class Print(expr: Expr)(val pos: ErrPos)
    extends Stmt,
      HasInferredType
final case class Println(expr: Expr)(val pos: ErrPos)
    extends Stmt,
      HasInferredType
final case class If(cond: Expr, thenStmt: Stmts, elseStmt: Stmts)(
    val pos: ErrPos
) extends Stmt,
      HasInferredType
final case class While(cond: Expr, body: Stmts)(val pos: ErrPos)
    extends Stmt,
      HasInferredType
final case class Block(stmts: Stmts)(val pos: ErrPos)
    extends Stmt // enclosed by begin-end
final case class Stmts(stmts: List[Stmt]) extends Stmt

// for semantic analysis
final case class RenamedDecl(t: Type, renamedIdent: RenamedVar, rvalue: RValue)(
    val pos: ErrPos
) extends Stmt

object Decl extends ParserBridgePos3[Type, String, RValue, Decl] {
    override def apply(
        px: Parsley[Type],
        py: Parsley[String],
        pz: Parsley[RValue]
    ): Parsley[Decl] =
        (px <~> (pos <~> py) <~> pz).map { case ((x, (p, y)), z) =>
            this.apply(x, y, z)(p)
        }
}

// inherit from bridge if error message position should be at the front
// position of Decl is handled in parser and should associate with position of identifier
object Assign extends ParserBridgePos2[LValue, RValue, Assign]
object Read extends ParserBridgePos1[LValue, Read]
object Free extends ParserBridgePos1[Expr, Free]
object Return extends ParserBridgePos1[Expr, Return]
object Exit extends ParserBridgePos1[Expr, Exit]
object Print extends ParserBridgePos1[Expr, Print]
object Println extends ParserBridgePos1[Expr, Println]
object If extends ParserBridgePos3[Expr, Stmts, Stmts, If]
object While extends ParserBridgePos2[Expr, Stmts, While]
object Block extends ParserBridgePos1[Stmts, Block]

sealed trait LValue extends HasInferredType

sealed trait RValue
// final case class RExpr(expr: Expr) extends RValue
final case class ArrayLiter(elems: List[Expr])(val pos: ErrPos)
    extends RValue,
      HasInferredType
final case class NewPair(fst: Expr, snd: Expr)(val pos: ErrPos)
    extends RValue,
      HasInferredType
// final case class RPairElem(elem: PairElem) extends RValue
final case class Call(ident: String, args: List[Expr])(val pos: ErrPos)
    extends RValue

object ArrayLiter extends ParserBridgePos1[List[Expr], ArrayLiter]
object NewPair extends ParserBridgePos2[Expr, Expr, NewPair]

sealed trait PairElem extends LValue, RValue
final case class Fst(lvalue: LValue)(val pos: ErrPos) extends PairElem
final case class Snd(lvalue: LValue)(val pos: ErrPos) extends PairElem

object Fst extends ParserBridgePos1[LValue, Fst]
object Snd extends ParserBridgePos1[LValue, Snd]

// for concurrency
// 'fork f(args)' spawns a child thread that runs f(args); child runs concurrently
final case class Fork(call: Call)(val pos: ErrPos) extends Stmt
// 'par { stmt1 || stmt2 || ...}' run multiple statements in parallel; must finish all before continuing
final case class Par(stmts: List[Stmts])(val pos: ErrPos) extends Stmt
// blocks until all forked/parallel children have completed
case object Join extends Stmt
final case class Lock(lvalue: LValue)(val pos: ErrPos) extends Stmt
final case class Unlock(lvalue: LValue)(val pos: ErrPos) extends Stmt

//for message passing
final case class ChanType(elemType: Type) extends Type
final case class Send(channel: Expr, value: Expr)(val pos: ErrPos) extends Stmt
final case class Recv(channel: Expr)(val pos: ErrPos) extends Expr
final case class NewChan()(val pos: ErrPos) extends RValue, HasInferredType

```

### File 4: src/main/wacc/typeChecker.scala
Score: 745
Reasons: priority pattern: **/*TypeChecker*; manual pipeline path; manual guided tour path; manual entry exists; compiler-pipeline template: semantic checker; core path: src/main; preferred text extension
Type: file (file)
Language: scala
Size: 36837 bytes
Content: truncated
```
package wacc

import parsley.{Result, Success, Failure}
import diagnostics.Diagnostic

object typeChecker {
    // for public entry
    extension (ast: Program) {
        def checkTypes(): Result[List[Diagnostic], TypeCheckResult] =
            typeChecker.check(ast)
    }

    // error model
    private type Error = String

    // public-facing type labels (avoid leaking internals)
    private def typeLabel(t: Type): String = t match {
        case IntType             => "int"
        case BoolType            => "bool"
        case CharType            => "char"
        case StringType          => "string"
        case ArrayType(elemType) => s"${typeLabel(elemType)}[]"
        case PairType(fst, snd)  =>
            s"pair(${pairElemLabel(fst)}, ${pairElemLabel(snd)})"
        case ErasedPairType =>
            "pair" // ErasedPairType represents null/unknown pair at runtime
        case ChanType(elem) => s"chan ${typeLabel(elem)}"
        case UnknownType =>
            "unknown" // UnkonwnType is inference failure used to avoid cascading errors
    }

    private def pairElemLabel(t: PairElemType): String = t match {
        case PairElemBaseType(base) => typeLabel(base)
        case PairElemArrayType(arr) => typeLabel(arr)
        case ErasedPairType         => "pair"
    }

    // other environment
    final case class FuncSig(ret: Type, params: List[Type])
    type VarKey = (String, Int) // (ident, unique id)
    type Scope = Map[VarKey, Type] // maps name to type
    type Env =
        List[Scope] // stack of scopes; head of Env shadows outer scope
    type FuncEnv = Map[String, FuncSig] // maps function name to signature

    final case class TypeCheckResult(
        ast: Program,
        mainEnv: Env,
        funcEnv: FuncEnv
    )

    // first pass: collect function signature to allow mutual recursion
    private def buildFuncEnv(
        fs: List[Func]
    ): Either[List[Diagnostic], FuncEnv] = {
        val (env, errs) =
            fs.foldLeft((Map.empty[String, FuncSig], List.empty[Diagnostic])) {
                case ((acc, es), func @ Func(rt, id, ps, _)) =>
                    if (acc.contains(id))
                        (
                            acc,
                            es :+ Diagnostic(
                                "Scope",
                                s"Redefinition of function '${func.ident}' is not allowed.",
                                pos = func.pos,
                                width = id.length
                            )
                        )
                    else (acc + (id -> FuncSig(rt, ps.map(_.t))), es)
            }
        if (errs.isEmpty) Right(env) else Left(errs)
    }

    // environment helper
    // Enter a new empty scope
    private def keyOf(rv: RenamedVar): VarKey = (rv.ident, rv.id)
    // private def keyOfName(name: String): VarKey = (name, 0)
    private def enter(env: Env): Env = Map.empty[VarKey, Type] :: env

    // Find nearest binding in the scope stack
    private def lookup(env: Env, k: VarKey): Option[Type] =
        env.collectFirst { case s if s.contains(k) => s(k) }

    // Declare a variable in current scope, error if duplicate in same scope
    private def declare(env: Env, k: VarKey, t: Type): Either[Error, Env] = {
        env match {
            case s :: _ if s.contains(k) => Left(s"Duplicate var in same scope")
            case s :: rest               => Right((s + (k -> t)) :: rest)
            case Nil                     => Left("Empty env")
        }
    }

    // entry
    private def check(
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
                }

                val allErrors = funcErrs ++ mainErrs
                if (allErrors.isEmpty)
                    Success(TypeCheckResult(ast, mainEnv, fenv))
                else Failure(allErrors)
        }
    }

    // type-checking each function (signature + body)
    private def checkFunc(
        f: Func,
        fenv: Map[String, FuncSig]
    ): List[Diagnostic] = {
        // start a fresh scope for each function
        val base = enter(Nil)
        val envEither =
            f.params.foldLeft[Either[Error, Env]](Right(base)) {
                case (Right(_), FuncParam(_, name)) =>
                    Left(
                        s"Renamer error: unrenamed param '${name}'"
                    ) // should not happen after renaming
                case (Right(e), RenamedParam(t, renamedIdent)) =>
                    declare(e, keyOf(renamedIdent), t)
                case (Left(err), _) => Left(err)
            }

        envEither match {
            case Left(err) =>
                List(
                    Diagnostic(
                        "Type",
                        s"In function '${f.ident}':\n $err",
                        f.pos,
                        f.ident.length
                    )
                )
            case Right(env) =>
                // check function body with known return type
                implicit val fenvImplicit: Map[String, FuncSig] = fenv
                implicit val envImplicit: Env = enter(env)
                val (errs, _) = checkStmts(f.body, Some(f.retType))
                errs.map(e =>
                    Diagnostic(
                        "Type",
                        s"In function '${f.ident}':\n ${e.message}",
                        e.pos,
                        f.ident.length
                    )
                )
        }
    }

    // type-checking for statement
    private[wacc] def checkStmts(stmts: Stmts, ret: Option[Type])(implicit
        fenv: Map[String, FuncSig],
        env: Env
    ): (List[Diagnostic], Env) = {
        stmts.stmts.foldLeft((List.empty[Diagnostic], env)) {
            case ((errorsSoFar, envSoFar), s) =>
                implicit val envImplicit: Env = envSoFar
                val (newErrors, newEnv) = checkStmt(s, ret)
                (errorsSoFar ++ newErrors, newEnv)
        }
    }

    private[wacc] def checkStmt(stmt: Stmt, ret: Option[Type])(implicit
        fenv: Map[String, FuncSig],
        env: Env
    ): (List[Diagnostic], Env) = stmt match {
        case Skip => (Nil, env) // skip has no typing effect

        case decl @ Decl(t, ident, rvalue) =>
            (
                List(
                    Diagnostic(
                        "Compiler Debugging",
                        s"unrenamed variables should not appear after renaming",
                        decl.pos,
                        ident.length
                    )
                ),
                env
            ) // should not happen after renaming

        case decl @ RenamedDecl(t, renamedIdent, rvalue) =>
            val (errs, rt) = typeRValue(rvalue, Some(t))
            val bad = rt
                .filterNot(r => compatible(r, t) || r == UnknownType)
                .map(r =>
                    Diagnostic(
                        "Type",
                        s"Type mismatch in declaration: expected ${typeLabel(t)}, got ${typeLabel(r)}",
                        decl.pos,
                        renamedIdent.ident.length
                    )
                )
            val env2 = declare(env, keyOf(renamedIdent), t).getOrElse(env)
            (errs ++ bad.toList, env2)

        case assign @ Assign(lvalue, rvalue) =>
            // LHS and RHS types must be compatible
            val (err1, lt) = typeLValue(lvalue, None)
            val (err2, rt) = typeRValue(rvalue, lt)
            val bad = (lt, rt) match {
                case (Some(l), Some(r)) =>
                    if (!compatible(r, l)) {
                        (r, l) match {
                            case (UnknownType, UnknownType) =>
                                // reject pair swap when both sides are unknown
                                Some(
                                    Diagnostic(
                                        "Type",
                                        s"Attempting to exchange values between pairs of unknown types \nPair exchange is only legal when the type of at least one of the sides is known or specified",
                                        assign.pos
                                    )
                                )
                            case (_, _) =>
                                Some(
                                    Diagnostic(
                                        "Type",
                                        s"Type mismatch in assignment: expected ${typeLabel(l)}, got ${typeLabel(r)}",
                                        assign.pos
                                    )
                                )
                        }
                    } else None
                case _ => None
            }
            (err1 ++ err2 ++ bad.toList, env)

        case read @ Read(lvalue) =>
            // read only into int or char
            val (e, t) = typeLValue(lvalue)
            val bad = t
                .filter(x => x != IntType && x != CharType)
                .map(_ =>
                    Diagnostic("Type", s"read expects int or char", read.pos)
                )
            (e ++ bad.toList, env)

        case free @ Free(expr) =>
            val (errs, t) = typeExpr(expr)
            free.inferredType = t
            val bad = t
                .filter {
                    case ArrayType(_) | PairType(_, _) => false
                    case _                             => true
                }
                .map(_ =>
                    Diagnostic("Type", s"free expects array or pair", free.pos)
                )
            (errs ++ bad.toList, env)

        case r @ Return(expr) =>
            // return must match current function return type
            val (errs, t) = typeExpr(expr)
            r.inferredType = t
            val bad = (ret, t) match {
                case (Some(retType), Some(et)) if compatible(et, retType) =>
                    None
                case (Some(retType), Some(et)) =>
                    Some(
                        Diagnostic(
                            "Type",
                            s"Return type mismatch: expected ${typeLabel(retType)}, got ${typeLabel(et)}",
                            r.pos
                        )
                    )
                case (None, _) =>
                    Some(Diagnostic("Type", s"return outside function", r.pos))
                case _ => None
            }
            (errs ++ bad.toList, env)

        case exit @ Exit(expr) =>
            val (errs, t) = typeExpr(expr)
            exit.inferredType = t
            val bad = t
                .filter(_ != IntType)
                .map(_ => Diagnostic("Type", s"exit expects int", exit.pos))
            (errs ++ bad.toList, env)

        case print @ Print(expr) =>
            // printing allows any type
            val (es, t) = typeExpr(expr)
            print.inferredType = t
            (es, env)

        case println @ Println(expr) =>
            // printing allows any type
            val (es, t) = typeExpr(expr)
            println.inferredType = t
            (es, env)

        case ifStmt @ If(c, t, e) =>
            // condition must be bool; each branch gets its own scope
            val (cErr, ct) = typeExpr(c)
            ifStmt.inferredType = ct
            val bad =
                ct.filter(_ != BoolType)
                    .map(_ =>
                        Diagnostic(
                            "Type",
                            s"if condition must be bool",
                            ifStmt.pos
                        )
                    )
            val (tErr, _) = {
                implicit val envImplicit: Env = enter(env)
                checkStmts(t, ret)
            }
            val (eErr, _) = {
                implicit val envImplicit: Env = enter(env)
                checkStmts(e, ret)
            }
            (cErr ++ bad.toList ++ tErr ++ eErr, env)

        case whileStmt @ While(c, b) =>
            val (cErr, ct) = typeExpr(c)
            whileStmt.inferredType = ct
            val bad = ct
                .filter(_ != BoolType)
                .map(_ =>
                    Diagnostic(
                        "Type",
                        s"while condition must be bool",
                        whileStmt.pos
                    )
                )
            val (bErr, _) = {
                implicit val envImplicit: Env = enter(env)
                checkStmts(b, ret)
            }
            (cErr ++ bad.toList ++ bErr, env)

        case Block(s) =>
            // block introduces a new scope
            val (es, _) = {
                implicit val envImplicit: Env = enter(env)
                checkStmts(s, ret)
            }
            (es, env)

        case Stmts(ss) =>
            checkStmts(Stmts(ss), ret)
        case forkStmt @ Fork(call) =>
            val (callErrs, _) = typeRValue(call, None)
            val forkErrs = fenv.get(call.ident) match {
                case None =>
                    List(
                        Diagnostic(
                            "Type",
                            s"Unknown function '${call.ident}' in fork",
                            forkStmt.pos,
                            call.ident.length
                        )
                    )
                case Some(FuncSig(retType, _)) =>
                    val mainErr =
                        if (call.ident == "main")
                            List(
                                Diagnostic(
                                    "Type",
                                    "Cannot fork main",
                                    forkStmt.pos,
                                    call.ident.length
                                )
                            )
                        else Nil
                    val retErr =
                        if (retType != IntType)
                            List(
                                Diagnostic(
                                    "Type",
                                    s"Forked function must return int, got ${typeLabel(retType)}",
                                    forkStmt.pos
                                )
                            )
                        else Nil
                    mainErr ++ retErr
            }
            (callErrs ++ forkErrs, env)
        case Par(branches) =>
            val allErrs = branches.flatMap { branch =>
                implicit val envImplicit: Env = enter(env)
                val (branchErrs, _) = checkStmts(branch, ret)
                branchErrs
            }
            (allErrs, env)
        case Join => (Nil, env)
        case lockStmt @ Lock(lv) =>
            val (errs, t) = typeLValue(lv)
            val bad = t.filter(_ != IntType).map(_ =>
                Diagnostic("Type", "lock expects int variable", lockStmt.pos)
            )
            (errs ++ bad.toList, env)
        case unlockStmt @ Unlock(lv) =>
            val (errs, t) = typeLValue(lv)
            val bad = t.filter(_ != IntType).map(_ =>
                Diagnostic("Type", "unlock expects int variable", unlockStmt.pos)
            )
            (errs ++ bad.toList, env)
        case sendStmt @ Send(ch, v) =>
            val (chErr, chT) = typeExpr(ch)
            val (vErr, vT) = typeExpr(v)
            val bad = chT match {
                case Some(ChanType(elem)) =>
                    vT.filter(t => !compatible(t, elem)).map(_ =>
                        Diagnostic(
                            "Type",
                            s"send value must match channel element type ${typeLabel(elem)}",
                            sendStmt.pos
                        )
                    ).toList
                case Some(_) =>
                    List(
                        Diagnostic(
                            "Type",
                            "send first operand must be a channel",
                            sendStmt.pos
                        )
                    )
                case None => Nil
            }
            (chErr ++ vErr ++ bad, env)
    }

    // expression typing
    private[wacc] def typeExpr(expr: Expr)(implicit
        fenv: Map[String, FuncSig],
        env: Env
    ): (List[Diagnostic], Option[Type]) = expr match {
        // Literals
        case IntLiter(_) =>
            expr.inferredType = Some(IntType)
            (Nil, Some(IntType))
        case BoolLiter(value) =>
            expr.inferredType = Some(BoolType)
            (Nil, Some(BoolType))
        case CharLiter(value) =>
            expr.inferredType = Some(CharType)
            (Nil, Some(CharType))
        case StringLiter(value) =>
            expr.inferredType = Some(StringType)
            (Nil, Some(StringType))
        case NullLiter() =>
            expr.inferredType = Some(ErasedPairType)
            (Nil, Some(ErasedPairType))

        case renamed @ RenamedVar(ident, id) =>
            lookup(env, keyOf(renamed)) match {
                case Some(t) =>
                    expr.inferredType = Some(t)
                    (Nil, Some(t))
                case None =>
                    (
                        List(
                            Diagnostic(
                                "Scope",
                                s"Undeclared '${ident}'",
                                renamed.pos,
                                ident.length
                            )
                        ),
                        None
                    )
            }

        case arrElem @ RenamedArrayElem(renamedVar, indices) =>
            lookup(env, keyOf(renamedVar)) match {
                case None =>
                    (
                        List(
                            Diagnostic(
                                "Scope",
                                s"Undeclared array '${renamedVar.ident}'",
                                arrElem.pos,
                                renamedVar.ident.length
                            )
                        ),
                        None
                    )
                case Some(t) =>
                    val (es, ts) = indices.map(typeExpr(_)).unzip
                    val idxErr = ts.flatten.collect {
                        case x if x != IntType =>
                            Diagnostic(
                                "Type",
                                s"Array index must be int",
                                arrElem.pos,
                                renamedVar.ident.length
                            )
                    }
                    val elemt = arrayElemType(t, indices.length)
```

### File 5: src/main/wacc/Main.scala
Score: 680
Reasons: priority path: src/main/wacc/Main.scala; compiler-pipeline template: entry point; core path: src/main; preferred text extension
Type: file (file)
Language: scala
Size: 4739 bytes
```
package wacc

import mainargs.{main, arg, Parser, Flag}
import parsley.{Success, Failure}

import scala.util.Try

import scope.rename
import typeChecker.checkTypes
import backend.arm.Printer
import wacc.typeChecker.TypeCheckResult
import wacc.backend.arm.ARMCodeGenerator
import interpreter.Interpreter
import scala.concurrent.ExecutionContext

object Main {
    // Exit codes as per the specification
    private final val SYNTAX_ERROR = 100
    private final val SEMANTIC_ERROR = 200
    private final val ERROR = 1

    def main(args: Array[String]): Unit = {
        Parser(this).runOrExit(args.toIndexedSeq)
    }

    @main
    def repl(): Unit = {
        REPL.run()
    }

    @main
    def interpret(
        @arg(doc = "Path to the .wacc file", positional = true) file: String
    ): Unit = {
        val path = os.Path(file, os.pwd)
        val code = readFile(file)
        val result = for {
            ast <- runParser(code)
            resolved <- runImportResolution(ast, path / os.up)
            checked <- runSemanticAnalysis(file, code, resolved)
        } yield checked

        result match {
            case Left(exitCode)                    => sys.exit(exitCode)
            case Right(TypeCheckResult(ast, _, _)) =>
                val cfg = CFG(ast)
                val interpreter = new Interpreter(cfg)
                val exitCode = interpreter.run()
                sys.exit(exitCode)
        }
    }

    @main
    def compile(
        @arg(
            name = "optimize",
            short = 'O',
            doc = "Enable optimizations"
        ) optimize: Flag = Flag(false),
        @arg(doc = "Path to the .wacc file", positional = true) file: String
    ): Unit = {
        val path = os.Path(file, os.pwd)
        val fileName = path.last
        val asmName = fileName.stripSuffix(".wacc") + ".s"

        val code = readFile(file)

        // Pipeline: Parse -> Semantic Analysis -> Backend
        val result = for {
            ast <- runParser(code)
            resolved <- runImportResolution(ast, path / os.up)
            checked <- runSemanticAnalysis(fileName, code, resolved)
        } yield checked

        result match {
            case Left(exitCode)                    => sys.exit(exitCode)
            case Right(TypeCheckResult(ast, _, _)) =>
                val codegen = ARMCodeGenerator()
                val cfg = CFG(ast)
                val propagatedCfg =
                    ARMConstantPropagator.propagateConstants(cfg)
                val asm = codegen.generate(propagatedCfg, optimize.value)
                val output =
                    Printer.printProgram(asm, codegen.rodataDefinitions)
                os.write.over(os.pwd / asmName, output)
        }
    }

    private def readFile(file: String): String = {
        val path = os.Path(file, os.pwd)
        Try(os.read(path)) match {
            case scala.util.Failure(err) =>
                System.err.println(s"Error: failed to read file '$file' ($err)")
                sys.exit(ERROR)
            case scala.util.Success(code) => code
        }
    }

    private def runParser(code: String): Either[Int, Program] = {
        parser.parse(code) match {
            case Success(ast) => Right(ast)
            case Failure(msg) =>
                System.err.println("Syntax Error:")
                System.err.println(msg)
                Left(SYNTAX_ERROR)
        }
    }

    private def runImportResolution(
        ast: Program,
        basePath: os.Path
    ): Either[Int, Program] = {
        if (ast.imports.isEmpty) Right(ast)
        else {
            // Use parallel resolution when there are multiple imports
            val result = if (ast.imports.size > 1) {
                implicit val ec: ExecutionContext = ExecutionContext.global
                ImportResolver.resolveParallel(ast, basePath)
            } else {
                ImportResolver.resolve(ast, basePath)
            }
            result match {
                case Right(resolved) => Right(resolved)
                case Left(err)       =>
                    System.err.println(s"Import Error: ${err.msg}")
                    Left(SEMANTIC_ERROR)
            }
        }
    }

    private def runSemanticAnalysis(
        fileName: String,
        code: String,
        ast: Program
    ): Either[Int, TypeCheckResult] = {
        val semanticResult = for {
            renamed <- ast.rename()
            checked <- renamed.checkTypes()
        } yield checked

        semanticResult match {
            case Success(result) => Right(result)
            case Failure(diags)  =>
                System.err.println(diagnostics.renderAll(fileName, code, diags))
                Left(SEMANTIC_ERROR)
        }
    }
}

```

### File 6: src/main/wacc/backend/CodeGenerator.scala
Score: 520
Reasons: priority pattern: **/*CodeGenerator*; compiler-pipeline template: code generation; core path: src/main; core path: backend; preferred text extension
Type: file (file)
Language: scala
Size: 183 bytes
```
package wacc
package backend

import wacc.CFG.CFGProgram
import cats.data.Chain

trait CodeGenerator {
    def generate(prog: CFGProgram[Stmt, Expr], optimize: Boolean): Chain[Any]
}

```

### File 7: src/main/wacc/lexer.scala
Score: 445
Reasons: manual pipeline path; manual guided tour path; manual entry exists; compiler-pipeline template: lexer; core path: src/main; preferred text extension
Type: file (file)
Language: scala
Size: 4762 bytes
```
package wacc

import parsley.Parsley
import parsley.token.Lexer
import parsley.token.Basic
import parsley.token.descriptions.*
import parsley.token.errors.*

object lexer {
    // reserved keywords, identidiers not able to have the same name
    private val keywords = Set(
        // types
        "int",
        "char",
        "bool",
        "string",
        "pair",
        "newpair",
        "call",
        "fst",
        "snd",

        // keywords
        "import",
        "len",
        "ord",
        "chr",
        "true",
        "false",
        "null",
        "begin",
        "end", // Program
        "is", // Function

        // Stmt
        "skip",
        "read",
        "free",
        "return",
        "exit",
        "print",
        "println",
        "if",
        "then",
        "else",
        "fi",
        "while",
        "do",
        "done",
        "fork",
        "par",
        "join",
        "lock",
        "unlock",
        "chan",
        "send",
        "recv",
        "newchan"
    )

    val operators = Set(
        ">=",
        "<=",
        "==",
        "!=",
        "&&",
        "||",
        "=",
        ">",
        "<",
        "+",
        "-",
        "*",
        "/",
        "%",
        "!"
    )

    val symbols = Set("(", ")", "[", "]", ",", ";")

    private val desc = LexicalDesc.plain.copy(
        // your configuration goes here
        // Whitespace: space, tab, newline, carriage return
        spaceDesc = SpaceDesc.plain.copy(
            space = Basic(c => c == ' ' || c == '\t' || c == '\n' || c == '\r'),
            lineCommentStart = "#"
        ),
        numericDesc = NumericDesc.plain.copy(
            positiveSign = PlusSignPresence.Optional
        ),

        // Identifier: start with _ or letter, contain _ letter or digit
        nameDesc = NameDesc.plain.copy(
            identifierStart = Basic(c => c.isLetter || c == '_'),
            identifierLetter = Basic(c => c.isLetterOrDigit || c == '_')
        ),

        // Symbols / Operators: single and multi-char
        symbolDesc = SymbolDesc.plain.copy(
            hardKeywords = keywords,
            // hardOperators are always regarded as reversed operators, so they will be parsed in longest match first order
            hardOperators = operators ++ symbols
        ),

        // Text literals
        textDesc = TextDesc.plain.copy(
            escapeSequences = EscapeDesc.plain.copy(
                escBegin = '\\',
                literals = Set('"', '\'', '\\'),
                mapping = Map(
                    "0" -> '\u0000'.toInt,
                    "b" -> '\b'.toInt,
                    "t" -> '\t'.toInt,
                    "n" -> '\n'.toInt,
                    "f" -> '\f'.toInt,
                    "r" -> '\r'.toInt
                )
            ),
            graphicCharacter =
                Basic(c => !c.isControl && c != '"' && c != '\'' && c != '\\'),
            stringEnds = Set(("\"", "\"")),
            characterLiteralEnd = '\''
        )
    )

    private val errConfig = new ErrorConfig {
        // labelSymbol is only responsible for labeling symbols in symbolDesc
        override def labelSymbol: Map[String, LabelWithExplainConfig] = Map(
            "(" -> Label("opening parenthesis"),
            ")" -> Label("closing parenthesis"),
            "[" -> Label("opening bracket"),
            "]" -> Label("closing bracket"),
            "," -> Label("comma"),
            ";" -> Label("semicolon"),
            "=" -> Label("assignment operator")
        )

        override def labelIntegerSignedNumber = Label("integer literal")
        override def filterCharNonAscii = new Because {
            override def reason(x: Int): String =
                "non-ASCII character"
        }

        override def filterStringNonAscii =
            new SpecializedMessage {
                override def message(x: StringBuilder): Seq[String] =
                    List("string contains non-ASCII character")
            }

        override def labelStringAsciiEnd(
            multi: Boolean,
            raw: Boolean
        ): LabelConfig = Label("string delimiter")

        override def labelCharAsciiEnd: LabelConfig = Label(
            "character delimiter"
        )
    }

    private val lexer = Lexer(desc, errConfig)

    val intLiteral = lexer.lexeme.signed.decimal
    val stringLiteral = lexer.lexeme.string.ascii
    val charLiteral = lexer.lexeme.character.ascii
    val identifier = lexer.lexeme.names.identifier
    val boolean = (lexer.lexeme.symbol("true").as(true) <|> lexer.lexeme
        .symbol("false")
        .as(false))
    val implicits = lexer.lexeme.symbol.implicits
    def fully[A](p: Parsley[A]): Parsley[A] = lexer.fully(p)
}

```

### File 8: src/main/wacc/parser.scala
Score: 445
Reasons: manual pipeline path; manual guided tour path; manual entry exists; compiler-pipeline template: parser; core path: src/main; preferred text extension
Type: file (file)
Language: scala
Size: 11056 bytes
```
package wacc

import parsley.{Parsley, Result}
import parsley.Parsley.{many, some, atomic, notFollowedBy}
import parsley.combinator.sepBy
import parsley.errors.combinator.ErrorMethods
import parsley.expr.*
import parsley.position.pos
// import parsley.debug.*

import lexer.implicits.given
import lexer.{
    intLiteral,
    stringLiteral,
    charLiteral,
    identifier,
    boolean,
    fully
}

object parser {
    def parse(input: String): Result[String, Program] = progParser.parse(input)
    private val progParser = fully(program)

    // Package-private parsers for testing
    private[wacc] def parseType(input: String): Result[String, Type] =
        fully(typeParser).parse(input)
    private[wacc] def parseExpr(input: String): Result[String, Expr] =
        fully(expr).parse(input)
    private[wacc] def parseStmt(input: String): Result[String, Stmts] =
        fully(stmt).parse(input)

    // ========== IMPORTS ==========
    private lazy val stdlibImport: Parsley[String] =
        atomic(("<" ~> identifier <~ ">").map(name => s"<$name>"))

    private lazy val importDecl: Parsley[Import] = Import(
        "import" ~> (stdlibImport <|> stringLiteral)
    )

    // ========== TYPES ==========
    private lazy val typeParser: Parsley[Type] = {
        lazy val baseType: Parsley[Type] =
            (("int" as IntType)
                <|> ("bool" as BoolType)
                <|> ("char" as CharType)
                <|> ("string" as StringType)).label("base type")

        lazy val pairElemType: Parsley[PairElemType] =
            atomic(typeParser.collect {
                case a: ArrayType                   => PairElemArrayType(a)
                case t if !t.isInstanceOf[PairType] => PairElemBaseType(t)
            }) <|> ("pair" as ErasedPairType)

        lazy val pairType: Parsley[Type] =
            PairType(
                "pair" ~> "(" ~> pairElemType <~ ",",
                pairElemType <~ ")"
            ).label("pair type")

        lazy val chanType: Parsley[Type] =
            ("chan" ~> typeParser).map(ChanType.apply).label("channel type")

        (baseType <|> pairType <|> chanType) <~> many("[" ~> "]") map {
            case (t, brackets) =>
                brackets.foldLeft(t)((acc, _) => ArrayType(acc))
        }
    }

    // ========== EXPRESSIONS ==========
    private def binary(
        op: BinaryOper,
        symbol: String
    ): Parsley[(Expr, Expr) => Expr] =
        pos <**> (symbol as (p => (x: Expr, y: Expr) => BinaryOp(op, x, y)(p)))
    private def unary(op: UnaryOper, symbol: String): Parsley[Expr => Expr] =
        pos <**> (symbol as (p => (x: Expr) => UnaryOp(op, x)(p)))

    private val add = binary(BinaryOper.Add, "+")
    private val sub = binary(BinaryOper.Sub, "-")
    private val mul = binary(BinaryOper.Mul, "*")
    private val div = binary(BinaryOper.Div, "/")
    private val mod = binary(BinaryOper.Mod, "%")
    private val gt = binary(BinaryOper.Gt, ">")
    private val gte = binary(BinaryOper.Gte, ">=")
    private val lt = binary(BinaryOper.Lt, "<")
    private val lte = binary(BinaryOper.Lte, "<=")
    private val eq = binary(BinaryOper.Eq, "==")
    private val neq = binary(BinaryOper.Neq, "!=")
    private val and = binary(BinaryOper.And, "&&").label("logical and operator")
    private val or = binary(BinaryOper.Or, "||").label("logical or operator")
    private val neg = unary(UnaryOper.Neg, "-")
    private val not = unary(UnaryOper.Not, "!")
    private val len = unary(UnaryOper.Len, "len")
    private val ord = unary(UnaryOper.Ord, "ord")
    private val chr = unary(UnaryOper.Chr, "chr")

    private lazy val index: Parsley[Expr] =
        "[" ~> expr <~ "]"

    private lazy val arrayElem: Parsley[ArrayElem] =
        atomic(((pos <~> identifier) <~> some(index)).map {
            case ((p, name), indices) =>
                ArrayElem(name, indices)(p)
        })

    private lazy val intLiter: Parsley[Expr] =
        (pos <~> intLiteral)
            .collectMsg(n => Seq(s"Integer $n out of bounds")) {
                case (p, n) if n.isValidInt => IntLiter(n.toInt)(p)
            }

    private lazy val unaryOp = (not <|> neg <|> len <|> ord <|> chr)
        .label("unary operator")
        .explain("unary operators include !, -, len, ord and chr")

    private lazy val arithmeticOpHigh = (mul <|> div <|> mod)
        .label("arithmetic operator")
        .explain("arithmetic operators include *, /, %, + and -")

    private lazy val arithmeticOpLow = (add <|> sub)
        .label("arithmetic operator")
        .explain("arithmetic operators include *, /, %, + and -")

    private lazy val comparisonOp = (gt <|> gte <|> lt <|> lte)
        .label("comparison operator")
        .explain("comparison operators include >, >=, < and <=")

    private lazy val equalityOp = (eq <|> neq)
        .label("equality operator")
        .explain("equality operators include == and !=")

    private lazy val recvExpr: Parsley[Expr] =
        (pos <~ "recv" <~> expr).map { case (p, ch) => Recv(ch)(p) }

    // precedence combinator expects a operator between atoms and distinguishes between binary minus,
    // unary minus and negative numbers automatically
    private lazy val expr: Parsley[Expr] =
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
        )

    // ========== STATEMENTS ==========
    // Program parser
    private lazy val program: Parsley[Program] =
        ("begin" ~> many(importDecl) <~> many(function) <~> stmt <~ "end").map {
            case ((imports, funcs), main) => Program(funcs, main, imports)
        }

    // Function parser
    private lazy val function: Parsley[Func] =
        atomic(
            typeParser <~> (pos <~> identifier) <~ "(" <~> paramList <~ ")" <~ "is" <~> stmt <~ "end"
        ).collectMsg { case (((_, (_, ident)), _), _) =>
            Seq(s"Function \"$ident\" is not returning on all paths")
        } {
            case (((retType, (pos, ident)), params), body)
                if checkReturning(body) =>
                Func(retType, ident, params, body)(pos)
        }.label("function definition")

    private def checkReturning(stmts: Stmts): Boolean = {
        stmts.stmts.lastOption.fold(false) {
            case Return(_)                 => true
            case If(_, thenStmt, elseStmt) =>
                checkReturning(thenStmt) && checkReturning(elseStmt)
            case Exit(_)         => true
            case Block(subStmts) => checkReturning(subStmts)
            case _               => false
        }
    }

    // Param-list parser
    private lazy val paramList: Parsley[List[Param]] =
        sepBy(param, ",")

    // Param parser
    private lazy val param: Parsley[Param] = FuncParam(typeParser, identifier)

    private lazy val semiAndStmt = ";" ~> notFollowedBy(";").explain(
        "Extra semicolon is not allowed between statements"
    ) ~> simpleStmt.explain(
        "Trailing semicolon is not allowed at the end of a block"
    )

    // Stmt parser
    private lazy val stmt: Parsley[Stmts] =
        (simpleStmt <~> many(semiAndStmt)).map { case (first, rest) =>
            Stmts(first :: rest)
        }

    private lazy val simpleStmt: Parsley[Stmt] = {
        lazy val skipStmt = ("skip" #> Skip)
        lazy val declStmt =
            Decl(typeParser, identifier, "=" ~> rvalue).label(
                "variable declaration"
            )
        lazy val assignStmt = Assign(lvalue <~ "=", rvalue).label("assignment")
        lazy val readStmt = Read("read" ~> lvalue)
        lazy val freeStmt = Free("free" ~> expr)
        lazy val returnStmt = Return("return" ~> expr)
        lazy val exitStmt = Exit("exit" ~> expr)
        lazy val printStmt = Print("print" ~> expr)
        lazy val printlnStmt = Println("println" ~> expr)
        lazy val ifStmt =
            // evaluation of stmt should be lazy to avoid infinite recursion/deadlock
            // hence it should not appear on lhs of ~> to avoid forced evaluation
            If(
                "if" ~> expr,
                "then" ~> stmt,
                "else" ~> stmt <~ "fi"
            )
        lazy val whileStmt =
            While(
                "while" ~> expr,
                "do" ~> stmt <~ "done"
            )
        lazy val blockStmt = Block("begin" ~> stmt <~ "end").label("new scope")
        lazy val forkStmt = ((pos <~ "fork") <~> call).map { case (p, c) =>
            Fork(c)(p)
        }
        lazy val parStmt =
            ((pos <~ "par") <~> ("begin" ~> sepBy(stmt, "||") <~ "end")).map {
                case (p, branches) => Par(branches)(p)
            }
        lazy val joinStmt = "join" #> Join
        lazy val lockStmt =
            ((pos <~ "lock" <~> lvalue).map { case (p, lv) => Lock(lv)(p) })
        lazy val unlockStmt = ((pos <~ "unlock") <~> lvalue).map {
            case (p, lv) => Unlock(lv)(p)
        }
        lazy val sendStmt = ((pos <~ "send") <~> (expr <~> expr)).map {
            case (p, (ch, v)) => Send(ch, v)(p)
        }

        skipStmt <|> declStmt <|> assignStmt <|> readStmt <|> freeStmt <|>
            returnStmt <|> exitStmt <|> printlnStmt <|> printStmt <|>
            ifStmt <|> whileStmt <|> blockStmt <|> forkStmt <|> parStmt <|>
            joinStmt <|> lockStmt <|> unlockStmt <|> sendStmt
    }.label("statement")

    private lazy val pairElem: Parsley[PairElem] =
        Fst("fst" ~> lvalue) <|> Snd("snd" ~> lvalue)

    // Lvalue parser
    private lazy val lvalue: Parsley[LValue] = {
        lazy val ident: Parsley[LValue] = Var(identifier)

        arrayElem <|> pairElem <|> ident
    }

    private lazy val call: Parsley[Call] =
        ("call" ~> (pos <~> identifier) <~> ("(" ~> sepBy(
            expr,
            ","
        ) <~ ")"))
            .map { case ((pos, name), args) =>
                Call(name, args)(pos)
            }
            .label("function call")

    // Rvalue parser
    private lazy val rvalue: Parsley[RValue] = {
        lazy val arrayLit: Parsley[RValue] =
            ArrayLiter("[" ~> sepBy(expr, ",") <~ "]")

        lazy val newChan: Parsley[RValue] =
            (pos <~ "newchan").map(NewChan()(_))

        lazy val newPair: Parsley[RValue] =
            ((pos <~ "newpair") <~> ("(" ~> expr <~ ",") <~> (expr <~ ")"))
                .map { case ((pos, fst), snd) =>
                    NewPair(fst, snd)(pos)
                }

        expr <|> arrayLit <|> newChan <|> newPair <|> pairElem <|> call
    }
}

```

### File 9: src/main/wacc/backend/arm/RegAlloc.scala
Score: 300
Reasons: manual guided tour path; compiler-pipeline template: register allocation; core path: src/main; core path: backend; preferred text extension
Type: file (file)
Language: scala
Size: 20311 bytes
Content: truncated
```
package wacc
package backend
package arm

import cats.data.Chain
import Instr._
import Address._
import Register.PhysicalReg
import Register.PhysicalReg._
import Register.VirtualReg
import Cond._
import Liveness._

import scala.collection.mutable

object RegAlloc {
    import ARMCodeGenerator.LabeledBlock

    private val alignment = 4
    private val allocRegOrder: Vector[PhysicalReg] =
        Vector(R4, R5, R6, R7, R8, R9, R10)
    private val allocRegs: Set[PhysicalReg] = allocRegOrder.toSet

    // returns mapping from virtual register to physical register, and set of spilled virtual registers
    private def colorGraph(
        edges: Map[VirtualReg, Set[Register]]
    ): (Map[VirtualReg, PhysicalReg], Set[VirtualReg]) = {
        val k = allocRegs.size
        val stack = mutable.Stack.empty[VirtualReg]
        val spill = mutable.Set.empty[VirtualReg]

        val virtualAdj = edges.map { case (v, neighbors) =>
            v -> neighbors.collect { case r: VirtualReg => r }
        }

        val physAdj = edges.map { case (v, neighbors) =>
            v -> neighbors.collect { case r: PhysicalReg => r }
        }

        val adj = mutable.Map.from(
            virtualAdj.map { case (v, ns) => v -> mutable.Set.from(ns) }
        )

        def removeNode(v: VirtualReg): Unit = {
            adj.remove(v)
            adj.values.foreach(_.remove(v))
        }

        while (adj.nonEmpty) {
            adj.find { case (v, ns) =>
                ns.size + physAdj(v).count(allocRegs.contains) < k
            } match {
                case Some((v, _)) =>
                    stack.push(v)
                    removeNode(v)
                case None =>
                    // All nodes have degree >= k: pick the node of largest degree and push to stack optimistically
                    val v = adj.maxBy(_._2.size)._1
                    stack.push(v)
                    removeNode(v)
            }
        }

        val color = mutable.Map.empty[VirtualReg, PhysicalReg]
        while (stack.nonEmpty) {
            val v = stack.pop()
            val neighborColors = virtualAdj(v).flatMap(color.get)
            val neighborPhys = physAdj(v)
            val usedColors = neighborColors ++ neighborPhys
            allocRegOrder.find(r => !usedColors.contains(r)) match {
                case Some(c) => color.put(v, c)
                case None    => spill.add(v)
            }
        }

        (color.toMap, spill.toSet)
    }

    /** Perform register allocation for the given chain of block of instruction,
      * returning the rewritten blocks with physical registers only
      * @return
      *   (rewritten blocks, next available frame offset for spilled virtual
      *   registers)
      */
    def allocateBlocks(
        blocks: Chain[LabeledBlock[Register]],
        nextFrameOffset: Int
    ): (Chain[LabeledBlock[PhysicalReg]], Int) = {
        var linear: Chain[Instr[Register]] =
            blocks.flatMap(b => Chain.one(LabelDef(b.label)) ++ b.instrs)
        val firstLabel = blocks.headOption.map(_.label).getOrElse("entry")

        var nextVirtualReg =
            collectVirtualRegs(linear).map(_.id).maxOption.getOrElse(0) + 1

        def getNewVirtualReg(): VirtualReg = {
            val v = VirtualReg(nextVirtualReg)
            nextVirtualReg += 1
            v
        }

        // val liveness = analyze(linear)
        // val nodes = collectVirtualRegs(linear)
        // val graph = buildInterferenceGraph(nodes, liveness)
        var coloring: Map[VirtualReg, PhysicalReg] = Map.empty
        var spill: Set[VirtualReg] = Set.empty
        // val (coloring, spill) = colorGraph(graph)

        val virtualToFrame = mutable.Map.empty[VirtualReg, Int]
        var nextOffset: Int = nextFrameOffset

        var done = false
        while (!done) {
            val liveness = analyze(linear)
            val nodes = collectVirtualRegs(linear)
            val graph = buildInterferenceGraph(nodes, liveness)
            val (newColoring, newSpill) = colorGraph(graph)
            coloring = newColoring
            spill = newSpill

            if (spill.isEmpty) {
                done = true
            } else {
                spill.toList.sortBy(_.id).foreach { v =>
                    if (!virtualToFrame.contains(v)) {
                        virtualToFrame(v) = nextOffset
                        nextOffset += alignment
                    }
                }

                linear = linear.flatMap { instr =>
                    val (uses, defs) = useDef(instr)
                    val spillUses =
                        uses.collect {
                            case v: VirtualReg if spill.contains(v) => v
                        }
                    val spillDefs =
                        defs.collect {
                            case v: VirtualReg if spill.contains(v) => v
                        }
                    val spillTemp = mutable.Map[VirtualReg, VirtualReg]()
                    val pre = spillUses.toList
                        .sortBy(_.id)
                        .foldLeft(Chain.empty[Instr[Register]]) { (acc, v) =>
                            val temp = getNewVirtualReg()
                            spillTemp(v) = temp
                            acc ++ Chain.one(
                                Ldr(
                                    AL,
                                    temp,
                                    Offset(
                                        FP,
                                        Some(Op2.Imm(virtualToFrame(v))),
                                        add = false
                                    )
                                )
                            )
                        }
                    val post = spillDefs.toList
                        .sortBy(_.id)
                        .foldLeft(Chain.empty[Instr[Register]]) { (acc, v) =>
                            val temp =
                                spillTemp.getOrElse(v, getNewVirtualReg())
                            spillTemp(v) = temp
                            acc ++ Chain.one(
                                Str(
                                    instrCond(instr),
                                    temp,
                                    Offset(
                                        FP,
                                        Some(Op2.Imm(virtualToFrame(v))),
                                        add = false
                                    )
                                )
                            )
                        }
                    val rewrittenInstr: Instr[Register] =
                        rewriteSpill(instr, spillTemp.toMap)
                    pre ++ Chain(rewrittenInstr) ++ post
                }
            }
        }

        // At this point all virtual registers have been colored

        // pre: all virtual registers are colored
        def getPhysReg(r: Register): PhysicalReg = r match {
            case v: VirtualReg =>
                coloring.getOrElse(
                    v,
                    throw new RuntimeException(
                        s"Virtual register $v not colored in instruction"
                    )
                )
            case other: PhysicalReg => other
        }

        def rewriteOp2(op2: Op2[Register]): Op2[PhysicalReg] =
            op2 match {
                case Op2.Imm(value) => Op2.Imm(value)
                case Op2.Reg(r)     => Op2.Reg(getPhysReg(r))
                case Op2.ShiftedReg(r, shiftType, shiftAmount) =>
                    val newShiftAmount = shiftAmount match {
                        case ShiftAmount.ByReg(s) =>
                            ShiftAmount.ByReg(getPhysReg(s))
                        case other: ShiftAmount.Imm => other
                    }
                    Op2.ShiftedReg(
                        getPhysReg(r),
                        shiftType,
                        newShiftAmount
                    )
            }

        def rewriteAddress(
            address: Address[Register]
        ): Address[PhysicalReg] = {
            address match {
                case Offset(base, maybeOffset, add) =>
                    Offset(
                        getPhysReg(base),
                        maybeOffset.map(rewriteOp2),
                        add
                    )
                case PreIndexed(base, offset, add, writeBack) =>
                    PreIndexed(
                        getPhysReg(base),
                        rewriteOp2(offset),
                        add,
                        writeBack
                    )
                case PostIndexed(base, offset, add, writeBack) =>
                    PostIndexed(
                        getPhysReg(base),
                        rewriteOp2(offset),
                        add,
                        writeBack
                    )
            }
        }

        def rewriteRegs(regs: List[Register]): List[PhysicalReg] =
            regs.map(getPhysReg)

        def rewriteInstr(instr: Instr[Register]): Instr[PhysicalReg] = instr match {
            case Mov(cond, rd, op2) =>
                Mov(cond, getPhysReg(rd), rewriteOp2(op2))
            case Mvn(cond, rd, op2) =>
                Mvn(cond, getPhysReg(rd), rewriteOp2(op2))
            case Add(cond, setFlags, rd, rn, op2) =>
                Add(
                    cond,
                    setFlags,
                    getPhysReg(rd),
                    getPhysReg(rn),
                    rewriteOp2(op2)
                )
            case Sub(cond, setFlags, rd, rn, op2) =>
                Sub(
                    cond,
                    setFlags,
                    getPhysReg(rd),
                    getPhysReg(rn),
                    rewriteOp2(op2)
                )
            case And(cond, setFlags, rd, rn, op2) =>
                And(
                    cond,
                    setFlags,
                    getPhysReg(rd),
                    getPhysReg(rn),
                    rewriteOp2(op2)
                )
            case Bic(cond, setFlags, rd, rn, op2) =>
                Bic(
                    cond,
                    setFlags,
                    getPhysReg(rd),
                    getPhysReg(rn),
                    rewriteOp2(op2)
                )
            case Orr(cond, setFlags, rd, rn, op2) =>
                Orr(
                    cond,
                    setFlags,
                    getPhysReg(rd),
                    getPhysReg(rn),
                    rewriteOp2(op2)
                )
            case Eor(cond, setFlags, rd, rn, op2) =>
                Eor(
                    cond,
                    setFlags,
                    getPhysReg(rd),
                    getPhysReg(rn),
                    rewriteOp2(op2)
                )
            case Cmp(cond, rn, op2) =>
                Cmp(cond, getPhysReg(rn), rewriteOp2(op2))
            case Mul(cond, rd, rm, rs) =>
                Mul(
                    cond,
                    getPhysReg(rd),
                    getPhysReg(rm),
                    getPhysReg(rs)
                )
            case Smull(cond, rdLo, rdHi, rm, rs) =>
                Smull(
                    cond,
                    getPhysReg(rdLo),
                    getPhysReg(rdHi),
                    getPhysReg(rm),
                    getPhysReg(rs)
                )
            case Ldr(cond, rd, address) =>
                Ldr(cond, getPhysReg(rd), rewriteAddress(address))
            case Str(cond, rd, address) =>
                Str(cond, getPhysReg(rd), rewriteAddress(address))
            case Ldrb(cond, rd, address) =>
                Ldrb(cond, getPhysReg(rd), rewriteAddress(address))
            case Strb(cond, rd, address) =>
                Strb(cond, getPhysReg(rd), rewriteAddress(address))
            case B(cond, label) =>
                B(cond, label)
            case Bl(cond, label) =>
                Bl(cond, label)
            case Blx(cond, rn) =>
                Blx(cond, getPhysReg(rn))
            case Bx(cond, rm) =>
                Bx(cond, getPhysReg(rm))
            case LdrLit(cond, rd, expr) =>
                LdrLit(cond, getPhysReg(rd), expr)
            case Push(rs) =>
                Push(
                    cats.data.NonEmptyList.fromListUnsafe(
                        rewriteRegs(rs.toList)
                    )
                )
            case Pop(rs) =>
                Pop(
                    cats.data.NonEmptyList.fromListUnsafe(
                        rewriteRegs(rs.toList)
                    )
                )
            case LabelDef(label) =>
                LabelDef(label)
            case Comment(text) =>
                Comment(text)
            case directive: Directive =>
                directive
        }
            
        val rewritten = LabeledBlock.split(firstLabel, Chain.fromSeq(linear.toList.map(rewriteInstr)))
        (rewritten, nextOffset - alignment)
    }

    /** Collect the condition flag used by the instruction */
    private def instrCond(i: Instr[Register]): Cond = {
        i match {
            case Mov(cond, _, _)                             => cond
            case Mvn(cond, _, _)                             => cond
            case Add(cond, _, _, _, _)                       => cond
            case Sub(cond, _, _, _, _)                       => cond
            case And(cond, _, _, _, _)                       => cond
            case Bic(cond, _, _, _, _)                       => cond
            case Orr(cond, _, _, _, _)                       => cond
            case Eor(cond, _, _, _, _)                       => cond
            case Cmp(cond, _, _)                             => cond
            case Mul(cond, _, _, _)                          => cond
            case Smull(cond, _, _, _, _)                     => cond
            case Ldr(cond, _, _)                             => cond
            case Str(cond, _, _)                             => cond
            case Ldrb(cond, _, _)                            => cond
            case Strb(cond, _, _)                            => cond
            case B(cond, _)                                  => cond
            case Bl(cond, _)                                 => cond
            case Blx(cond, _)                               => cond
            case Bx(cond, _)                                 => cond
            case LdrLit(cond, _, _)                          => cond
            case Push(_) | Pop(_) | LabelDef(_) | Comment(_) =>
                AL
            case _: Directive =>
                AL
        }
    }

    private def rewriteSpill(
        instr: Instr[Register],
        env: Map[VirtualReg, VirtualReg]
    ): Instr[Register] = {
        def rewriteReg(reg: Register): Register = reg match {
            case v: VirtualReg if env.contains(v) => env(v)
            case other                            => other
        }
        def rewriteOp2(op2: Op2[Register]): Op2[Register] = op2 match {
            case Op2.Imm(value) => Op2.Imm(value)
            case Op2.Reg(r)     => Op2.Reg(rewriteReg(r))
            case Op2.ShiftedReg(r, shiftType, shiftAmount) =>
                val newR = rewriteReg(r)
                val newShiftAmount = shiftAmount match {
                    case ShiftAmount.ByReg(s) =>
                        ShiftAmount.ByReg(rewriteReg(s))
                    case other: ShiftAmount.Imm => other
                }
                Op2.ShiftedReg(newR, shiftType, newShiftAmount)
        }

        def rewriteAddress(address: Address[Register]): Address[Register] =
            address match {
                case Offset(base, maybeOffset, add) =>
                    val newBase = rewriteReg(base)
                    val newMaybeOffset = maybeOffset.map(rewriteOp2)
                    Offset(newBase, newMaybeOffset, add)
                case PreIndexed(base, offset, add, writeBack) =>
                    val newBase = rewriteReg(base)
                    val newOffset = rewriteOp2(offset)
                    PreIndexed(newBase, newOffset, add, writeBack)
                case PostIndexed(base, offset, add, writeBack) =>
                    val newBase = rewriteReg(base)
                    val newOffset = rewriteOp2(offset)
                    PostIndexed(newBase, newOffset, add, writeBack)
            }

        instr match {
            case Mov(cond, rd, op2) =>
                Mov(cond, rewriteReg(rd), rewriteOp2(op2))
            case Mvn(cond, rd, op2) =>
                Mvn(cond, rewriteReg(rd), rewriteOp2(op2))
            case Add(cond, setFlags, rd, rn, op2) =>
                val newRd = rewriteReg(rd)
                val newRn = rewriteReg(rn)
                val newOp2 = rewriteOp2(op2)
                Add(cond, setFlags, newRd, newRn, newOp2)
            case Sub(cond, setFlags, rd, rn, op2) =>
                val newRd = rewriteReg(rd)
                val newRn = rewriteReg(rn)
                val newOp2 = rewriteOp2(op2)
                Sub(cond, setFlags, newRd, newRn, newOp2)
            case And(cond, setFlags, rd, rn, op2) =>
                val newRd = rewriteReg(rd)
                val newRn = rewriteReg(rn)
                val newOp2 = rewriteOp2(op2)
                And(cond, setFlags, newRd, newRn, newOp2)
            case Bic(cond, setFlags, rd, rn, op2) =>
                val newRd = rewriteReg(rd)
                val newRn = rewriteReg(rn)
                val newOp2 = rewriteOp2(op2)
                Bic(cond, setFlags, newRd, newRn, newOp2)
            case Orr(cond, setFlags, rd, rn, op2) =>
                val newRd = rewriteReg(rd)
                val newRn = rewriteReg(rn)
                val newOp2 = rewriteOp2(op2)
                Orr(cond, setFlags, newRd, newRn, newOp2)
            case Eor(cond, setFlags, rd, rn, op2) =>
                val newRd = rewriteReg(rd)
                val newRn = rewriteReg(rn)
                val newOp2 = rewriteOp2(op2)
                Eor(cond, setFlags, newRd, newRn, newOp2)
            case Cmp(cond, rn, op2) =>
                val newRn = rewriteReg(rn)
                val newOp2 = rewriteOp2(op2)
                Cmp(cond, newRn, newOp2)
            case Mul(cond, rd, rm, rs) =>
                val newRd = rewriteReg(rd)
                val newRm = rewriteReg(rm)
                val newRs = rewriteReg(rs)
                Mul(cond, newRd, newRm, newRs)
            case Smull(cond, rdLo, rdHi, rm, rs) =>
                val newRdLo = rewriteReg(rdLo)
                val newRdHi = rewriteReg(rdHi)
                val newRm = rewriteReg(rm)
                val newRs = rewriteReg(rs)
                Smull(cond, newRdLo, newRdHi, newRm, newRs)
            case Ldr(cond, rd, address) =>
                val newRd = rewriteReg(rd)
                val newAddress = rewriteAddress(address)
                Ldr(cond, newRd, newAddress)
            case Str(cond, rd, address) =>
                val newRd = rewriteReg(rd)
                val newAddress = rewriteAddress(address)
                Str(cond, newRd, newAddress)
            case Ldrb(cond, rd, address) =>
                val newRd = rewriteReg(rd)
                val newAddress = rewriteAddress(address)
                Ldrb(cond, newRd, newAddress)
            case Strb(cond, rd, address) =>
                val newRd = rewriteReg(rd)
                val newAddress = rewriteAddress(address)
                Strb(cond, newRd, newAddress)
            case Blx(cond, rn) =>
                Blx(cond, rewriteReg(rn))
            case Bx(cond, rm) =>
                Bx(cond, rewriteReg(rm))
            case LdrLit(cond, rd, expr) =>
                LdrLit(cond, rewriteReg(rd), expr)
            case Push(rs) =>
                Push(
                    cats.data.NonEmptyList.fromListUnsafe(
                        rs.toList.map(rewriteReg)
                    )
```

### File 10: src/main/wacc/backend/arm/RegAllocNaive.scala
Score: 300
Reasons: manual guided tour path; compiler-pipeline template: register allocation; core path: src/main; core path: backend; preferred text extension
Type: file (file)
Language: scala
Size: 18207 bytes
```
package wacc
package backend
package arm

import cats.data.Chain
import Instr._
import Address._
import Register.PhysicalReg
import Register.PhysicalReg._
import Register.VirtualReg
import Cond._

import scala.collection.mutable

object RegAllocNaive {
    import ARMCodeGenerator.LabeledBlock

    private val alignment = 4

    private var scratchRegs = Set(
        R4,
        R5,
        R6,
        R7,
        R8,
        R9,
        R10
    ) // temporary registers available for allocation

    private def getScratchReg(): PhysicalReg = {
        if (scratchRegs.isEmpty) {
            throw new RuntimeException(
                "Ran out of scratch registers for register allocation"
            )
        }
        val reg = scratchRegs.head
        scratchRegs -= reg
        reg
    }

    private def resetScratchRegs(): Unit = {
        scratchRegs = Set(R4, R5, R6, R7, R8, R9, R10)
    }

    def allocateBlocks(
        blocks: Chain[LabeledBlock[Register]],
        nextFrameOffset: Int
    ): (Chain[LabeledBlock[PhysicalReg]], Int) = { // return (rewritten instructions, total frame size needed for the function)
        var nextOffset: Int = nextFrameOffset
        val virtualToFrame = mutable.Map
            .empty[Int, Int] // map from virtual register id to frame offset

        val rewrittenBlocks = blocks.map { block =>
            val rewrittenInstrs = block.instrs.flatMap { instr =>
                resetScratchRegs() // reset scratch registers for each instruction to allow reuse across instructions
                val (uses, defs) = useDef(instr)
                val regAlloc = mutable.Map.empty[
                    VirtualReg,
                    PhysicalReg
                ] // map from virtual register to physical register

                def getPhysReg(r: Register): PhysicalReg = {
                    r match {
                        case v @ VirtualReg(id) =>
                            if (regAlloc.contains(v)) {
                                regAlloc(v)
                            } else {
                                virtualToFrame.getOrElseUpdate(
                                    id, {
                                        val offset = nextOffset
                                        nextOffset += alignment
                                        offset
                                    }
                                )
                                val physReg = getScratchReg()
                                regAlloc.addOne(v -> physReg)
                                physReg
                            }
                        case other: PhysicalReg => other
                    }
                }

                def rewriteOp2(op2: Op2[Register]): Op2[PhysicalReg] = {
                    op2 match {
                        case Op2.Imm(value) => Op2.Imm(value)
                        case Op2.Reg(r)     => Op2.Reg(getPhysReg(r))
                        case Op2.ShiftedReg(r, shiftType, shiftAmount) =>
                            val newShiftAmount = shiftAmount match {
                                case ShiftAmount.ByReg(s) =>
                                    ShiftAmount.ByReg(getPhysReg(s))
                                case other: ShiftAmount.Imm => other
                            }
                            Op2.ShiftedReg(
                                getPhysReg(r),
                                shiftType,
                                newShiftAmount
                            )
                    }
                }

                def rewriteAddress(
                    address: Address[Register]
                ): Address[PhysicalReg] = {
                    address match {
                        case Offset(base, maybeOffset, add) =>
                            Offset(
                                getPhysReg(base),
                                maybeOffset.map(rewriteOp2),
                                add
                            )
                        case PreIndexed(base, offset, add, writeBack) =>
                            PreIndexed(
                                getPhysReg(base),
                                rewriteOp2(offset),
                                add,
                                writeBack
                            )
                        case PostIndexed(base, offset, add, writeBack) =>
                            PostIndexed(
                                getPhysReg(base),
                                rewriteOp2(offset),
                                add,
                                writeBack
                            )
                    }
                }

                def rewriteRegs(regs: List[Register]): List[PhysicalReg] =
                    regs.map(getPhysReg)

                // pre: virtual registers in use is already mapped to stack frame
                // load used virtual registers from stack frame before the instruction
                val pre: Chain[Instr[PhysicalReg]] =
                    uses.toList.foldLeft(Chain.empty[Instr[PhysicalReg]]) {
                        (acc, r) =>
                            r match {
                                case VirtualReg(id) =>
                                    val frameOffset =
                                        virtualToFrame.getOrElseUpdate(
                                            id, {
                                                val offset = nextOffset
                                                nextOffset += alignment
                                                offset
                                            }
                                        )
                                    val physReg = getPhysReg(r)
                                    acc ++ Chain(
                                        Ldr(
                                            AL,
                                            physReg,
                                            Offset(
                                                FP,
                                                Some(Op2.Imm(frameOffset)),
                                                add = false
                                            )
                                        )
                                    )
                                case _ => acc
                            }
                    }
                // store virtual registers defined in the instruction to stack frame after the instruction
                val post: Chain[Instr[PhysicalReg]] =
                    defs.toList.foldLeft(Chain.empty[Instr[PhysicalReg]]) {
                        (acc, r) =>
                            r match {
                                case VirtualReg(id) =>
                                    val physReg = getPhysReg(r)
                                    val frameOffset =
                                        virtualToFrame.getOrElseUpdate(
                                            id, {
                                                val offset = nextOffset
                                                nextOffset += alignment
                                                offset
                                            }
                                        )
                                    acc ++ Chain(
                                        Str(
                                            instrCond(
                                                instr
                                            ), // only store defined regs if the instruction is executed
                                            physReg,
                                            Offset(
                                                FP,
                                                Some(Op2.Imm(frameOffset)),
                                                add = false
                                            )
                                        )
                                    )
                                case _ => acc
                            }
                    }

                val rewrittenCore: Instr[PhysicalReg] = instr match {
                    case Mov(cond, rd, op2) =>
                        Mov(cond, getPhysReg(rd), rewriteOp2(op2))
                    case Mvn(cond, rd, op2) =>
                        Mvn(cond, getPhysReg(rd), rewriteOp2(op2))
                    case Add(cond, setFlags, rd, rn, op2) =>
                        Add(
                            cond,
                            setFlags,
                            getPhysReg(rd),
                            getPhysReg(rn),
                            rewriteOp2(op2)
                        )
                    case Sub(cond, setFlags, rd, rn, op2) =>
                        Sub(
                            cond,
                            setFlags,
                            getPhysReg(rd),
                            getPhysReg(rn),
                            rewriteOp2(op2)
                        )
                    case And(cond, setFlags, rd, rn, op2) =>
                        And(
                            cond,
                            setFlags,
                            getPhysReg(rd),
                            getPhysReg(rn),
                            rewriteOp2(op2)
                        )
                    case Bic(cond, setFlags, rd, rn, op2) =>
                        Bic(
                            cond,
                            setFlags,
                            getPhysReg(rd),
                            getPhysReg(rn),
                            rewriteOp2(op2)
                        )
                    case Orr(cond, setFlags, rd, rn, op2) =>
                        Orr(
                            cond,
                            setFlags,
                            getPhysReg(rd),
                            getPhysReg(rn),
                            rewriteOp2(op2)
                        )
                    case Eor(cond, setFlags, rd, rn, op2) =>
                        Eor(
                            cond,
                            setFlags,
                            getPhysReg(rd),
                            getPhysReg(rn),
                            rewriteOp2(op2)
                        )
                    case Cmp(cond, rn, op2) =>
                        Cmp(cond, getPhysReg(rn), rewriteOp2(op2))
                    case Mul(cond, rd, rm, rs) =>
                        Mul(
                            cond,
                            getPhysReg(rd),
                            getPhysReg(rm),
                            getPhysReg(rs)
                        )
                    case Smull(cond, rdLo, rdHi, rm, rs) =>
                        Smull(
                            cond,
                            getPhysReg(rdLo),
                            getPhysReg(rdHi),
                            getPhysReg(rm),
                            getPhysReg(rs)
                        )
                    case Ldr(cond, rd, address) =>
                        Ldr(cond, getPhysReg(rd), rewriteAddress(address))
                    case Str(cond, rd, address) =>
                        Str(cond, getPhysReg(rd), rewriteAddress(address))
                    case Ldrb(cond, rd, address) =>
                        Ldrb(cond, getPhysReg(rd), rewriteAddress(address))
                    case Strb(cond, rd, address) =>
                        Strb(cond, getPhysReg(rd), rewriteAddress(address))
                    case B(cond, label) =>
                        B(cond, label)
                    case Bl(cond, label) =>
                        Bl(cond, label)
                    case Blx(cond, rn) =>
                        Blx(cond, getPhysReg(rn))
                    case Bx(cond, rm) =>
                        Bx(cond, getPhysReg(rm))
                    case LdrLit(cond, rd, expr) =>
                        LdrLit(cond, getPhysReg(rd), expr)
                    case Push(rs) =>
                        Push(
                            cats.data.NonEmptyList.fromListUnsafe(
                                rewriteRegs(rs.toList)
                            )
                        )
                    case Pop(rs) =>
                        Pop(
                            cats.data.NonEmptyList.fromListUnsafe(
                                rewriteRegs(rs.toList)
                            )
                        )
                    case Comment(text) =>
                        Comment(text)
                    case directive: Directive =>
                        directive
                    case LabelDef(_) =>
                        throw new IllegalStateException(
                            "LabelDef should not appear inside LabeledBlock instructions"
                        )
                }

                pre ++ Chain(rewrittenCore) ++ post
            }
            LabeledBlock(block.label, rewrittenInstrs)
        }
        (rewrittenBlocks, nextOffset - alignment)
    }

    def op2Uses(op2: Op2[Register]): Set[Register] = op2 match {
        case Op2.Reg(r)                                 => Set(r)
        case Op2.ShiftedReg(r, _, ShiftAmount.ByReg(s)) => Set(r, s)
        case Op2.ShiftedReg(r, _, _)                    => Set(r)
        case _                                          => Set.empty
    }

    def addrUsesDefs(
        addr: Address[Register]
    ): (Set[Register], Set[Register]) = {
        addr match {
            case Offset(base, maybeOffset, _) =>
                (
                    Set(base) ++ maybeOffset.map(op2Uses).getOrElse(Set.empty),
                    Set.empty
                )
            case PreIndexed(base, offset, _, writeBack) =>
                (
                    Set(base) ++ op2Uses(offset),
                    if (writeBack) Set(base) else Set.empty
                )
            case PostIndexed(base, offset, _, writeBack) =>
                (
                    Set(base) ++ op2Uses(offset),
                    if (writeBack) Set(base) else Set.empty
                )
        }
    }

    def useDef(i: Instr[Register]): (Set[Register], Set[Register]) = {
        i match {
            case Mov(_, rd, op2)        => (op2Uses(op2), Set(rd))
            case Mvn(_, rd, op2)        => (op2Uses(op2), Set(rd))
            case Add(_, _, rd, rn, op2) => (Set(rn) ++ op2Uses(op2), Set(rd))
            case Sub(_, _, rd, rn, op2) => (Set(rn) ++ op2Uses(op2), Set(rd))
            case And(_, _, rd, rn, op2) => (Set(rn) ++ op2Uses(op2), Set(rd))
            case Bic(_, _, rd, rn, op2) => (Set(rn) ++ op2Uses(op2), Set(rd))
            case Orr(_, _, rd, rn, op2) => (Set(rn) ++ op2Uses(op2), Set(rd))
            case Eor(_, _, rd, rn, op2) => (Set(rn) ++ op2Uses(op2), Set(rd))
            case Cmp(_, rn, op2)        => (Set(rn) ++ op2Uses(op2), Set.empty)
            case Mul(_, rd, rm, rs)     => (Set(rm, rs), Set(rd))
            case Smull(_, rdLo, rdHi, rm, rs) => (Set(rm, rs), Set(rdLo, rdHi))
            case Ldr(_, rd, address)          =>
                val (addrUses, addrDefs) = addrUsesDefs(address)
                (addrUses, Set(rd) ++ addrDefs)
            case Ldrb(_, rd, address) =>
                val (addrUses, addrDefs) = addrUsesDefs(address)
                (addrUses, Set(rd) ++ addrDefs)
            case Str(_, rd, address) =>
                val (addrUses, addrDefs) = addrUsesDefs(address)
                (Set(rd) ++ addrUses, addrDefs)
            case Strb(_, rd, address) =>
                val (addrUses, addrDefs) = addrUsesDefs(address)
                (Set(rd) ++ addrUses, addrDefs)
            case B(_, _) =>
                (Set.empty, Set.empty)
            case Bl(_, _) =>
                (
                    Set.empty,
                    Set(
                        R0,
                        R1,
                        R2,
                        R3,
                        R12,
                        LR
                    )
                )
            case Blx(_, rn)               => (Set(rn), Set.empty)
            case Bx(_, rm)                => (Set(rm), Set.empty)
            case LdrLit(_, rd, _)         => (Set.empty, Set(rd))
            case Push(rs)                 => (rs.toList.toSet + SP, Set(SP))
            case Pop(rs)                  => (Set(SP), rs.toList.toSet + SP)
            case LabelDef(_) | Comment(_) => (Set.empty, Set.empty)
            case _: Directive             => (Set.empty, Set.empty)
        }
    }

    def instrCond(i: Instr[Register]): Cond = {
        i match {
            case Mov(cond, _, _)                             => cond
            case Mvn(cond, _, _)                             => cond
            case Add(cond, _, _, _, _)                       => cond
            case Sub(cond, _, _, _, _)                       => cond
            case And(cond, _, _, _, _)                       => cond
            case Bic(cond, _, _, _, _)                       => cond
            case Orr(cond, _, _, _, _)                       => cond
            case Eor(cond, _, _, _, _)                       => cond
            case Cmp(cond, _, _)                             => cond
            case Mul(cond, _, _, _)                          => cond
            case Smull(cond, _, _, _, _)                     => cond
            case Ldr(cond, _, _)                             => cond
            case Str(cond, _, _)                             => cond
            case Ldrb(cond, _, _)                            => cond
            case Strb(cond, _, _)                            => cond
            case B(cond, _)                                  => cond
            case Bl(cond, _)                                 => cond
            case Blx(cond, _)                                => cond
            case Bx(cond, _)                                 => cond
            case LdrLit(cond, _, _)                          => cond
            case Push(_) | Pop(_) | LabelDef(_) | Comment(_) =>
                AL
            case _: Directive =>
                AL
        }
    }
}

```

### File 11: src/main/wacc/backend/arm/Liveness.scala
Score: 295
Reasons: manual guided tour path; compiler-pipeline template: liveness analysis; core path: src/main; core path: backend; preferred text extension
Type: file (file)
Language: scala
Size: 9077 bytes
```
package wacc
package backend
package arm

import cats.data.Chain
import Instr._
import Address._
import Register.PhysicalReg
import Register.PhysicalReg._
import Register.VirtualReg
import Cond._

object Liveness {
    final case class LivenessResult(
        in: Vector[Set[Register]],
        out: Vector[Set[Register]],
        succ: Vector[Set[Int]],
        useDef: Vector[(Set[Register], Set[Register])],
        labelToIndex: Map[String, Int]
    )

    def op2Uses(op2: Op2[Register]): Set[Register] = op2 match {
        case Op2.Reg(r)                                 => Set(r)
        case Op2.ShiftedReg(r, _, ShiftAmount.ByReg(s)) => Set(r, s)
        case Op2.ShiftedReg(r, _, _)                    => Set(r)
        case _                                          => Set.empty
    }

    /** Calculate the registers used and defined by an address */
    def addrUsesDefs(
        addr: Address[Register]
    ): (Set[Register], Set[Register]) = { // returns (uses, defs)
        addr match {
            case Offset(base, maybeOffset, _) =>
                (
                    Set(base) ++ maybeOffset.map(op2Uses).getOrElse(Set.empty),
                    Set.empty
                )
            case PreIndexed(base, offset, _, writeBack) =>
                (
                    Set(base) ++ op2Uses(offset),
                    if (writeBack) Set(base) else Set.empty
                )
            case PostIndexed(base, offset, _, writeBack) =>
                (
                    Set(base) ++ op2Uses(offset),
                    if (writeBack) Set(base) else Set.empty
                )
        }
    }

    /** Calculate the registers used and defined by an instruction 
     * @return (uses, defs) of the instruction
    */
    def useDef(i: Instr[Register]): (Set[Register], Set[Register]) = {
        i match {
            case Mov(_, rd, op2)        => (op2Uses(op2), Set(rd))
            case Mvn(_, rd, op2)        => (op2Uses(op2), Set(rd))
            case Add(_, _, rd, rn, op2) => (Set(rn) ++ op2Uses(op2), Set(rd))
            case Sub(_, _, rd, rn, op2) => (Set(rn) ++ op2Uses(op2), Set(rd))
            case And(_, _, rd, rn, op2) => (Set(rn) ++ op2Uses(op2), Set(rd))
            case Bic(_, _, rd, rn, op2) => (Set(rn) ++ op2Uses(op2), Set(rd))
            case Orr(_, _, rd, rn, op2) => (Set(rn) ++ op2Uses(op2), Set(rd))
            case Eor(_, _, rd, rn, op2) => (Set(rn) ++ op2Uses(op2), Set(rd))
            case Cmp(_, rn, op2)        => (Set(rn) ++ op2Uses(op2), Set.empty)
            case Mul(_, rd, rm, rs)     => (Set(rm, rs), Set(rd))
            case Smull(_, rdLo, rdHi, rm, rs) => (Set(rm, rs), Set(rdLo, rdHi))
            case Ldr(_, rd, address)          =>
                val (addrUses, addrDefs) = addrUsesDefs(address)
                (addrUses, Set(rd) ++ addrDefs)
            case Ldrb(_, rd, address) =>
                val (addrUses, addrDefs) = addrUsesDefs(address)
                (addrUses, Set(rd) ++ addrDefs)
            case Str(_, rd, address) =>
                val (addrUses, addrDefs) = addrUsesDefs(address)
                (Set(rd) ++ addrUses, addrDefs)
            case Strb(_, rd, address) =>
                val (addrUses, addrDefs) = addrUsesDefs(address)
                (Set(rd) ++ addrUses, addrDefs)
            case B(_, _) =>
                (Set.empty, Set.empty)
            case Bl(_, _) => // assume all caller-saved registers are defined by the call
                (
                    Set.empty,
                    Set(
                        R0,
                        R1,
                        R2,
                        R3,
                        R12,
                        LR
                    )
                )
            case Blx(_, rn) => // indirect call: uses rn, defines caller-saved
                (Set(rn), Set(R0, R1, R2, R3, R12, LR))
            case Bx(_, rm)                => (Set(rm), Set.empty)
            case LdrLit(_, rd, _)         => (Set.empty, Set(rd))
            case Push(rs)                 => (rs.toList.toSet + SP, Set(SP))
            case Pop(rs)                  => (Set(SP), rs.toList.toSet + SP)
            case LabelDef(_) | Comment(_) => (Set.empty, Set.empty)
            case _: Directive             => (Set.empty, Set.empty)
        }
    }

    def inRegs(
        use: Set[Register],
        defn: Set[Register],
        out: Set[Register]
    ): Set[Register] = {
        use ++ (out -- defn)
    }

    /** Build mapping from label to instruction index for checking successors when building out set */
    def buildLabelToIndex(instrs: List[Instr[Register]]): Map[String, Int] = {
        instrs.zipWithIndex.collect { case (LabelDef(name), idx) =>
            name -> idx
        }.toMap
    }

    /** Check if the instruction is to return from a function, which should have no successors */
    private def isReturnPop(instr: Instr[Register]): Boolean = instr match {
        case Pop(rs) => rs.toList.contains(PhysicalReg.PC)
        case _       => false
    }

    /** For each instruction, find the set of indices of all its possible successors (fallthrough or branch target) */
    def buildSuccessors(
        instrs: List[Instr[Register]],
        labelToIndex: Map[String, Int]
    ): Vector[Set[Int]] = {
        val n = instrs.length
        Vector.tabulate(n) { i =>
            val fallthrough = if (i + 1 < n) Set(i + 1) else Set.empty[Int]
            instrs(i) match {
                case B(AL, label) =>
                    labelToIndex.get(label).toSet
                case B(_, label) =>
                    labelToIndex.get(label).toSet ++ fallthrough
                case Bx(_, _) =>
                    Set.empty
                case instr if isReturnPop(instr) =>
                    Set.empty
                case _ =>
                    fallthrough
            }
        }
    }

    /** Perform liveness analysis on the given list of instructions, returning the in/out/use/def sets for each instruction and other relevant info for register allocation */
    def analyze(instrs: Chain[Instr[Register]]): LivenessResult = {
        val instrsList = instrs.toList
        val n = instrsList.length
        val labelToIndex = buildLabelToIndex(instrsList)
        val succ = buildSuccessors(instrsList, labelToIndex)
        val useDefVec = instrsList.map(useDef).toVector

        var in = Vector.fill(n)(Set.empty[Register])
        var out = Vector.fill(n)(Set.empty[Register])

        // fixed-point iteration for dataflow: in/out is dependent on other edges, one pass is not enough
        // keep udpating in/out from back to front until a full pass causes no updates
        var changed = true
        while (changed) {
            changed = false
            var i = n - 1
            while (i >= 0) {
                val oldIn = in(i)
                val oldOut = out(i)
                val newOut = succ(i).flatMap(in).toSet
                val (useI, defI) = useDefVec(i)
                val newIn = inRegs(useI, defI, newOut)

                if (newIn != oldIn || newOut != oldOut) {
                    in = in.updated(i, newIn)
                    out = out.updated(i, newOut)
                    changed = true
                }
                i -= 1
            }
        }

        LivenessResult(in, out, succ, useDefVec, labelToIndex)
    }

    def collectVirtualRegs(instrs: Chain[Instr[Register]]): Set[VirtualReg] = {
        collectRegs(instrs).collect { case v: VirtualReg => v }
    }

    private def collectRegs(instrs: Chain[Instr[Register]]): Set[Register] = {
        instrs.map { instr =>
            val (useSet, defSet) = Liveness.useDef(instr)
            useSet ++ defSet
        }.foldLeft(Set.empty[Register])(_ ++ _)
    }

    /** Build a mapping from virtual registers to the set of registers they interfere with (live at the same time) */
    def buildInterferenceGraph(
        nodes: Set[VirtualReg],
        liveness: LivenessResult
    ): Map[VirtualReg, Set[Register]] = {
        var graph = nodes.iterator.map(v => v -> Set.empty[Register]).toMap

        // for each instruction, each defined virtual reg d interferes with every out register l where l != d
        // since d and l are alive at the same time, they cannot be allocated to the same physical register
        liveness.useDef.zip(liveness.out).foreach {
            case ((_, defSet), liveOut) =>
                val defs = defSet.collect { case v: VirtualReg => v }
                for {
                    d <- defs
                    l <- liveOut
                    if l != d
                } {
                    graph = graph.updated(d, graph.getOrElse(d, Set.empty) + l)
                    l match {
                        case v: VirtualReg if nodes.contains(v) =>
                            graph = graph.updated(
                                v,
                                graph.getOrElse(v, Set.empty) + d
                            )
                        case _ =>
                    }
                }
        }

        graph
    }

}

```

### File 12: src/main/wacc/backend/arm/ARMInstruction.scala
Score: 225
Reasons: manual guided tour path; core path: src/main; core path: backend; preferred text extension
Type: file (file)
Language: scala
Size: 9169 bytes
```
package wacc
package backend
package arm

import cats.data.NonEmptyList

// Registers
sealed trait Register {
    def name: String
}
object Register {
    sealed trait PhysicalReg extends Register
    object PhysicalReg {
        case object R0 extends PhysicalReg { val name = "r0" }
        case object R1 extends PhysicalReg { val name = "r1" }
        case object R2 extends PhysicalReg { val name = "r2" }
        case object R3 extends PhysicalReg { val name = "r3" }
        case object R4 extends PhysicalReg { val name = "r4" }
        case object R5 extends PhysicalReg { val name = "r5" }
        case object R6 extends PhysicalReg { val name = "r6" }
        case object R7 extends PhysicalReg { val name = "r7" }
        case object R8 extends PhysicalReg { val name = "r8" }
        case object R9 extends PhysicalReg { val name = "r9" }
        case object R10 extends PhysicalReg { val name = "r10" }
        case object R11 extends PhysicalReg { val name = "r11" }
        case object R12 extends PhysicalReg { val name = "r12" }
        case object SP extends PhysicalReg { val name = "sp" }
        case object LR extends PhysicalReg { val name = "lr" }
        case object PC extends PhysicalReg { val name = "pc" }
        case object FP extends PhysicalReg { val name = "fp" }
    }

    // Virtual Register - for temporaries during code generation
    final case class VirtualReg(id: Int) extends Register { val name = s"t$id" }
}

// Condition codes
sealed trait Cond {
    def suffix: String
}
object Cond {
    case object AL extends Cond {
        val suffix = ""
    } // Always. This suffix is normally omitted.
    case object EQ extends Cond { val suffix = "eq" } // Equal
    case object NE extends Cond { val suffix = "ne" } // Not equal
    case object CS extends Cond {
        val suffix = "cs"
    } // Higher or same (unsigned >= )
    case object CC extends Cond { val suffix = "cc" } // Lower (unsigned < )
    case object MI extends Cond { val suffix = "mi" } // Negative
    case object PL extends Cond { val suffix = "pl" } // Positive or zero
    case object VS extends Cond { val suffix = "vs" } // Overflow
    case object VC extends Cond { val suffix = "vc" } // No overflow
    case object HI extends Cond { val suffix = "hi" } // Higher (unsigned >)
    case object LS extends Cond {
        val suffix = "ls"
    } // Lower or same (unsigned <=)
    case object GE extends Cond { val suffix = "ge" } // Signed >=
    case object LT extends Cond { val suffix = "lt" } // Signed <
    case object GT extends Cond { val suffix = "gt" } // Signed >
    case object LE extends Cond { val suffix = "le" } // Signed <=
}

// Shifts
sealed trait ShiftType
object ShiftType {
    case object LSL extends ShiftType { val name = "lsl" } // Logical shift left
    case object LSR extends ShiftType {
        val name = "lsr"
    } // Logical shift right
    case object ASR extends ShiftType {
        val name = "asr"
    } // Arithmetic shift right
    case object ROR extends ShiftType { val name = "ror" } // Rotate right
    case object RRX extends ShiftType {
        val name = "rrx"
    } // Rotate right with extend
}

sealed trait ShiftAmount[+R <: Register]
object ShiftAmount {
    case class Imm(value: Int) extends ShiftAmount[Nothing]
    case class ByReg[+R <: Register](reg: R) extends ShiftAmount[R]
}

// Operand2
sealed trait Op2[+R <: Register]
object Op2 {
    final case class Imm(value: Int) extends Op2[Nothing]
    final case class Reg[+R <: Register](reg: R) extends Op2[R]
    final case class ShiftedReg[+R <: Register](
        reg: R,
        shiftType: ShiftType,
        shiftAmount: ShiftAmount[R]
    ) extends Op2[R]
}

// Literal expressions
sealed trait LitExpr
object LitExpr {
    final case class Const(value: Int) extends LitExpr
    final case class SymbolRef(name: String) extends LitExpr
    // for example ".Larr + 4" (optional)
    final case class SymbolRefPlus(name: String, offset: Int) extends LitExpr
}

// Addresses (addresing mode 2)
sealed trait Address[+R <: Register]
object Address {
    // offset can be added or subtracted
    final case class Offset[+R <: Register](
        base: R,
        offset: Option[Op2[R]],
        add: Boolean = true
    ) extends Address[R]
    // writeBack flag controls whether base register is updated
    final case class PreIndexed[+R <: Register](
        base: R,
        offset: Op2[R],
        add: Boolean = true,
        writeBack: Boolean = false
    ) extends Address[R]
    final case class PostIndexed[+R <: Register](
        base: R,
        offset: Op2[R],
        add: Boolean = true,
        writeBack: Boolean = false
    ) extends Address[R]
}

// Instructions
sealed trait Instr[+R <: Register]
object Instr {
    // defining label for jump and branch
    final case class LabelDef(name: String) extends Instr
    final case class Comment(text: String) extends Instr

    // Data processing instructions
    final case class Mov[+R <: Register](
        cond: Cond = Cond.AL,
        rd: R,
        op2: Op2[R]
    ) extends Instr[R]
    final case class Mvn[+R <: Register](
        cond: Cond = Cond.AL,
        rd: R,
        op2: Op2[R]
    ) extends Instr[R]
    final case class Add[+R <: Register](
        cond: Cond = Cond.AL,
        setFlags: Boolean,
        rd: R,
        rn: R,
        op2: Op2[R]
    ) extends Instr[R]
    final case class Sub[+R <: Register](
        cond: Cond = Cond.AL,
        setFlags: Boolean,
        rd: R,
        rn: R,
        op2: Op2[R]
    ) extends Instr[R]
    final case class And[+R <: Register](
        cond: Cond = Cond.AL,
        setFlags: Boolean,
        rd: R,
        rn: R,
        op2: Op2[R]
    ) extends Instr[R]
    final case class Bic[+R <: Register](
        cond: Cond = Cond.AL,
        setFlags: Boolean,
        rd: R,
        rn: R,
        op2: Op2[R]
    ) extends Instr[R]
    final case class Orr[+R <: Register](
        cond: Cond = Cond.AL,
        setFlags: Boolean,
        rd: R,
        rn: R,
        op2: Op2[R]
    ) extends Instr[R]
    final case class Eor[+R <: Register](
        cond: Cond = Cond.AL,
        setFlags: Boolean,
        rd: R,
        rn: R,
        op2: Op2[R]
    ) extends Instr[R]
    final case class Cmp[+R <: Register](
        cond: Cond = Cond.AL,
        rn: R,
        op2: Op2[R]
    ) extends Instr[R]
    final case class Mul[+R <: Register](
        cond: Cond = Cond.AL,
        rd: R,
        rm: R,
        rs: R
    ) extends Instr[R]
    final case class Smull[
        +R <: Register
    ]( // multiply two 32 bit integer to get a 64 bit result, store in two registers
        cond: Cond = Cond.AL,
        rdLo: R,
        rdHi: R,
        rm: R,
        rs: R
    ) extends Instr[R]

    // Load and store instructions
    final case class Ldr[+R <: Register](
        cond: Cond = Cond.AL,
        rd: R,
        address: Address[R]
    ) extends Instr[R]
    final case class Str[+R <: Register](
        cond: Cond = Cond.AL,
        rd: R,
        address: Address[R]
    ) extends Instr[R]
    final case class Ldrb[+R <: Register](
        cond: Cond = Cond.AL,
        rd: R,
        address: Address[R]
    ) extends Instr[R]
    final case class Strb[+R <: Register](
        cond: Cond = Cond.AL,
        rd: R,
        address: Address[R]
    ) extends Instr[R]

    // Branch/Call instructions
    final case class B(cond: Cond = Cond.AL, label: String)
        extends Instr[Nothing]
    final case class Bl(cond: Cond = Cond.AL, label: String)
        extends Instr[Nothing]
    final case class Blx[+R <: Register](cond: Cond = Cond.AL, rn: R)
        extends Instr[R]
    final case class Bx[+R <: Register](cond: Cond = Cond.AL, rm: R)
        extends Instr[R]

    // pseudo-instructions
    final case class LdrLit[+R <: Register](
        cond: Cond = Cond.AL,
        rd: R,
        expr: LitExpr
    ) extends Instr[R]
    // push: decrement sp, then store the registers to memory at the new stack addresses.
    final case class Push[+R <: Register](registers: NonEmptyList[R])
        extends Instr[R]
    // pop: load the registers from memory at the current stack addresses, then increment sp.
    final case class Pop[+R <: Register](registers: NonEmptyList[R])
        extends Instr[R]

    // Directives
    sealed trait Directive extends Instr[Nothing]
    case object SyntaxUnified extends Directive // .syntax unified
    case object Data extends Directive // .data
    case object Text extends Directive // .text
    final case class Section(name: String) extends Directive // .section <name>
    final case class Global(symbol: String)
        extends Directive // .global <symbol>
    final case class Align(power: Int)
        extends Directive // .align <n>, where n is a power of 2
    case object Ltorg extends Directive // .ltorg
    final case class Word(expr: LitExpr) extends Directive // .word <expr>
    final case class Asciz(value: String) extends Directive // .asciz <string>
    final case class Comm(name: String, size: Int) extends Directive
    final case class Extern(symbol: String)
        extends Directive // .extern <symbol>
}

```

### File 13: src/main/wacc/backend/arm/Printer.scala
Score: 225
Reasons: manual guided tour path; core path: src/main; core path: backend; preferred text extension
Type: file (file)
Language: scala
Size: 8475 bytes
```
package wacc.backend.arm

import Instr._
import Register.PhysicalReg
import scala.collection.mutable
import cats.data.Chain

object Printer {
    private val defaultRodataAlignment = 4

    def printInstr(instrs: Chain[Instr[PhysicalReg]]): String = {
        val builder = new mutable.StringBuilder
        for (instr <- instrs.toList) {
            val line = toString(instr)
            if (line.nonEmpty) {
                builder.append(line)
                builder.append("\n")
            }
        }
        builder.toString()
    }

    def printProgram(
        instrs: Chain[Instr[PhysicalReg]],
        rodataDefs: List[(String, String)]
    ): String = {
        renderRodata(rodataDefs) + printInstr(instrs)
    }

    private def renderRodata(rodataDefs: List[(String, String)]): String = {
        if (rodataDefs.isEmpty) return ""

        val builder = new mutable.StringBuilder
        builder.append(".section .rodata\n")
        for ((str, label) <- rodataDefs.toList.sortBy(_._2)) {
            builder.append(indent(s".align $defaultRodataAlignment"))
            builder.append("\n")
            builder.append(indent(s".word ${str.length}"))
            builder.append("\n")
            builder.append(s"$label:\n")
            builder.append(indent(s".asciz ${escapeString(str)}"))
            builder.append("\n")
        }
        builder.toString()
    }

    private def toString(instr: Instr[PhysicalReg]): String = {
        instr match {
            // Directives (no indent)
            case SyntaxUnified  => ".syntax unified"
            case Data           => ".data"
            case Text           => ".text"
            case Section(name)  => s".section $name"
            case Global(symbol) => s".global $symbol"
            case Extern(symbol) => s".extern $symbol"
            case Align(n)       => s".align $n"
            case Word(expr)     => indent(s".word ${litExprToString(expr)}")
            case Asciz(str)     => indent(s".asciz ${escapeString(str)}")
            case Comm(name, size) => indent(s".comm $name, $size")

            // Labels (no indent)
            case LabelDef(name) => s"$name:"

            // Comments (indent)
            case Comment(text) => indent(s"@ $text")

            // Pseudo-instructions
            case LdrLit(cond, rd, expr) =>
                indent(
                    s"ldr${condSuffix(cond)} ${regName(rd)}, =${litExprToString(expr)}"
                )
            case Push(regs) =>
                indent(s"push {${regs.toList.map(regName).mkString(", ")}}")
            case Pop(regs) =>
                indent(s"pop {${regs.toList.map(regName).mkString(", ")}}")
            case Ltorg => indent(".ltorg")

            // Data movement
            case Mov(cond, rd, op2) =>
                indent(s"mov${condSuffix(cond)} ${regName(rd)}, ${op2Str(op2)}")
            case Mvn(cond, rd, op2) =>
                indent(s"mvn${condSuffix(cond)} ${regName(rd)}, ${op2Str(op2)}")

            // Arithmetic
            case Add(cond, setFlags, rd, rn, op2) =>
                indent(
                    s"add${condSuffix(cond)}${sFlagSuffix(setFlags)} ${regName(rd)}, ${regName(rn)}, ${op2Str(op2)}"
                )
            case Sub(cond, setFlags, rd, rn, op2) =>
                indent(
                    s"sub${condSuffix(cond)}${sFlagSuffix(setFlags)} ${regName(rd)}, ${regName(rn)}, ${op2Str(op2)}"
                )

            // Logical
            case And(cond, setFlags, rd, rn, op2) =>
                indent(
                    s"and${condSuffix(cond)}${sFlagSuffix(setFlags)} ${regName(rd)}, ${regName(rn)}, ${op2Str(op2)}"
                )
            case Orr(cond, setFlags, rd, rn, op2) =>
                indent(
                    s"orr${condSuffix(cond)}${sFlagSuffix(setFlags)} ${regName(rd)}, ${regName(rn)}, ${op2Str(op2)}"
                )
            case Eor(cond, setFlags, rd, rn, op2) =>
                indent(
                    s"eor${condSuffix(cond)}${sFlagSuffix(setFlags)} ${regName(rd)}, ${regName(rn)}, ${op2Str(op2)}"
                )
            case Bic(cond, setFlags, rd, rn, op2) =>
                indent(
                    s"bic${condSuffix(cond)}${sFlagSuffix(setFlags)} ${regName(rd)}, ${regName(rn)}, ${op2Str(op2)}"
                )

            // Comparison
            case Cmp(cond, rn, op2) =>
                indent(s"cmp${condSuffix(cond)} ${regName(rn)}, ${op2Str(op2)}")

            // Multiplication
            case Mul(cond, rd, rm, rs) =>
                indent(
                    s"mul${condSuffix(cond)} ${regName(rd)}, ${regName(rm)}, ${regName(rs)}"
                )
            case Smull(cond, rdLo, rdHi, rm, rs) =>
                indent(
                    s"smull${condSuffix(cond)} ${regName(rdLo)}, ${regName(rdHi)}, ${regName(rm)}, ${regName(rs)}"
                )

            // Load/Store
            case Ldr(cond, rd, addr) =>
                indent(
                    s"ldr${condSuffix(cond)} ${regName(rd)}, ${addressStr(addr)}"
                )
            case Str(cond, rd, addr) =>
                indent(
                    s"str${condSuffix(cond)} ${regName(rd)}, ${addressStr(addr)}"
                )
            case Ldrb(cond, rd, addr) =>
                indent(
                    s"ldrb${condSuffix(cond)} ${regName(rd)}, ${addressStr(addr)}"
                )
            case Strb(cond, rd, addr) =>
                indent(
                    s"strb${condSuffix(cond)} ${regName(rd)}, ${addressStr(addr)}"
                )

            // Branches
            case B(cond, label) =>
                indent(s"b${condSuffix(cond)} $label")
            case Bl(cond, label) =>
                indent(s"bl${condSuffix(cond)} $label")
            case Blx(cond, rn) =>
                indent(s"blx${condSuffix(cond)} ${regName(rn)}")
            case Bx(cond, rm) =>
                indent(s"bx${condSuffix(cond)} ${regName(rm)}")
        }
    }

    private def indent(instr: String): String =
        "    " + instr

    private def regName(r: PhysicalReg): String = r.name

    private def condSuffix(cond: Cond): String =
        if (cond == Cond.AL) "" else cond.toString.toLowerCase

    private def sFlagSuffix(setFlags: Boolean): String =
        if (setFlags) "s" else ""

    private def op2Str(op2: Op2[PhysicalReg]): String = op2 match {
        case Op2.Imm(value)                            => s"#$value"
        case Op2.Reg(r)                                => regName(r)
        case Op2.ShiftedReg(r, shiftType, shiftAmount) =>
            val shift = shiftAmount match {
                case ShiftAmount.Imm(n)    => s"#$n"
                case ShiftAmount.ByReg(rs) => regName(rs)
            }
            s"${regName(r)}, ${shiftType.toString.toLowerCase} $shift"
    }

    private def addressStr(addr: Address[PhysicalReg]): String = addr match {
        case Address.Offset(base, None, _) =>
            s"[${regName(base)}]"
        case Address.Offset(base, Some(offset), isAdd) =>
            s"[${regName(base)}, ${signedOp2Str(offset, isAdd)}]"
        case Address.PreIndexed(base, offset, isAdd, _) =>
            s"[${regName(base)}, ${signedOp2Str(offset, isAdd)}]!"
        case Address.PostIndexed(base, offset, isAdd, _) =>
            s"[${regName(base)}], ${signedOp2Str(offset, isAdd)}"
    }

    private def signedOp2Str(op2: Op2[PhysicalReg], isAdd: Boolean): String =
        op2 match {
            case Op2.Imm(value) =>
                if (isAdd) s"#$value" else s"-${value}"
            case _ =>
                val sign = if (isAdd) "" else "-"
                s"$sign${op2Str(op2)}"
        }

    private def litExprToString(expr: LitExpr): String = expr match {
        case LitExpr.Const(value)                => value.toString
        case LitExpr.SymbolRef(name)             => name
        case LitExpr.SymbolRefPlus(name, offset) => s"$name+$offset"
    }

    private def escapeString(s: String): String = {
        val escaped = s.flatMap {
            case '\n'                   => "\\n"
            case '\t'                   => "\\t"
            case '\r'                   => "\\r"
            case '\\'                   => "\\\\"
            case '\"'                   => "\\\""
            case '\u0000'               => "\\0"
            case c if c < 32 || c > 126 => f"\\x$c%02x"
            case c                      => c.toString
        }
        s"\"$escaped\""
    }
}

```

### File 14: src/main/wacc/backend/arm/RuntimeProvider.scala
Score: 225
Reasons: manual guided tour path; core path: src/main; core path: backend; preferred text extension
Type: file (file)
Language: scala
Size: 31791 bytes
Content: truncated
```
package wacc
package backend
package arm

import cats.data.{Chain, NonEmptyList}
import Cond._
import Instr._
import Register.PhysicalReg
import Register.PhysicalReg._
import RuntimeError.*

import scala.collection.mutable

class RuntimeProvider(using rodata: DataManager) {
    private val WaccThreadStackSize = 64 * 4 // 64 pthread_t (4 bytes each)
    import ARMCodeGenerator.LabeledBlock

    private val externals = mutable.Set.empty[String]
    private val usedHelpers =
        mutable.Map.empty[String, Chain[LabeledBlock[PhysicalReg]]]
    private val runtimeErr = 255 // exit code for runtime errors
    private val StackAlignMask = 7 // for 8-byte alignment
    private val alignment = 4

    def externs: List[Extern] = externals.toList.sorted.map(Extern.apply)
    def helperDefinitions: Chain[LabeledBlock[PhysicalReg]] =
        usedHelpers.values.foldLeft(Chain.empty[LabeledBlock[PhysicalReg]])(
            _ ++ _
        )

    def usesPthread: Boolean = externals.contains("pthread_create")
    private def usesMutex: Boolean = externals.contains("pthread_mutex_lock")
    private val PthreadMutexSize = 24 // sizeof(pthread_mutex_t) on ARM Linux

    def bssDefinitions: Chain[Instr[PhysicalReg]] = {
        val pthreadBss =
            if (usesPthread)
                Chain(
                    Instr.Comm("wacc_thread_stack", WaccThreadStackSize),
                    Instr.Comm("wacc_thread_count", 4)
                )
            else Chain.empty
        val mutexBss =
            if (usesMutex)
                Chain(
                    Instr.Comm("wacc_global_mutex", PthreadMutexSize),
                    Instr.Comm("wacc_mutex_inited", 4)
                )
            else Chain.empty
        if (usesPthread || usesMutex)
            Chain(Instr.Section(".bss")) ++ pthreadBss ++ mutexBss
        else Chain.empty
    }

    private def useHelper(name: String)(gen: => Chain[Instr[PhysicalReg]]): String = {
        usedHelpers.getOrElseUpdate(name, LabeledBlock.split(name, gen))
        name
    }

    def print(
        reg: Register,
        t: Type,
        newline: Boolean
    ): Chain[Instr[Register]] = {
        externals.add("printf")
        val name = t match {
            case IntType  => if (newline) "p_print_int_ln" else "p_print_int"
            case BoolType => if (newline) "p_print_bool_ln" else "p_print_bool"
            case CharType => if (newline) "p_print_char_ln" else "p_print_char"
            case StringType | ArrayType(CharType) =>
                if (newline) "p_print_string_ln" else "p_print_string"
            case PairType(_, _) =>
                if (newline) "p_print_pair_ln" else "p_print_pair"
            case _ => if (newline) "p_print_ptr_ln" else "p_print_ptr"
        }
        val helperBody = t match {
            case IntType => {
                val fmt = if (newline) "%d\n\u0000" else "%d\u0000"
                Chain(
                    Push(cats.data.NonEmptyList.of(FP, LR)),
                    Mov(AL, FP, Op2.Reg(SP)),
                    Mov(AL, R1, Op2.Reg(R0)),
                    LdrLit(AL, R0, LitExpr.SymbolRef(rodata.use(fmt))),
                    Bic(AL, false, SP, SP, Op2.Imm(StackAlignMask)),
                    Bl(AL, "printf"),
                    Mov(AL, SP, Op2.Reg(FP)),
                    // TODO fflush (if necessary)
                    Pop(cats.data.NonEmptyList.of(FP, PC))
                )
            }
            case BoolType => {
                val trueLabel = rodata.use(
                    "true\u0000",
                    "str"
                ) // ensure "true" and "false" are in the data section, with str as label prefix
                val falseLabel = rodata.use("false\u0000", "str")
                val fmt = if (newline) "%s\n\u0000" else "%s\u0000"
                Chain(
                    Push(cats.data.NonEmptyList.of(FP, LR)),
                    Mov(AL, FP, Op2.Reg(SP)),
                    Cmp(AL, R0, Op2.Imm(0)),
                    LdrLit(NE, R1, LitExpr.SymbolRef(trueLabel)),
                    LdrLit(EQ, R1, LitExpr.SymbolRef(falseLabel)),
                    LdrLit(AL, R0, LitExpr.SymbolRef(rodata.use(fmt, "str"))),
                    Bic(AL, false, SP, SP, Op2.Imm(StackAlignMask)),
                    Bl(AL, "printf"),
                    Mov(AL, SP, Op2.Reg(FP)),
                    Pop(cats.data.NonEmptyList.of(FP, PC))
                )
            }
            case CharType => {
                val fmt = if (newline) "%c\n\u0000" else "%c\u0000"
                Chain(
                    Push(cats.data.NonEmptyList.of(FP, LR)),
                    Mov(AL, FP, Op2.Reg(SP)),
                    Mov(AL, R1, Op2.Reg(R0)),
                    LdrLit(AL, R0, LitExpr.SymbolRef(rodata.use(fmt, "str"))),
                    Bic(AL, false, SP, SP, Op2.Imm(StackAlignMask)),
                    Bl(AL, "printf"),
                    Mov(AL, SP, Op2.Reg(FP)),
                    Pop(cats.data.NonEmptyList.of(FP, PC))
                )
            }
            case StringType | ArrayType(CharType) => {
                val fmt = if (newline) "%.*s\n\u0000" else "%.*s\u0000"
                Chain(
                    Push(cats.data.NonEmptyList.of(FP, LR)),
                    Mov(AL, FP, Op2.Reg(SP)),
                    Mov(AL, R2, Op2.Reg(R0)),
                    Ldr(
                        AL,
                        R1,
                        Address.Offset(
                            R0,
                            Some(Op2.Imm(alignment)),
                            add = false
                        )
                    ),
                    LdrLit(AL, R0, LitExpr.SymbolRef(rodata.use(fmt, "str"))),
                    Bic(AL, false, SP, SP, Op2.Imm(StackAlignMask)),
                    Bl(AL, "printf"),
                    Mov(AL, SP, Op2.Reg(FP)),
                    Pop(cats.data.NonEmptyList.of(FP, PC))
                )
            }
            case PairType(_, _) => {
                val fmtPtr = if (newline) "%p\n\u0000" else "%p\u0000"
                val fmtStr = if (newline) "%s\n\u0000" else "%s\u0000"
                val nilLabel = rodata.use("(nil)\u0000", "str")
                val nonNullLabel = s"${name}_nonnull"
                val doneLabel = s"${name}_done"
                Chain(
                    Push(cats.data.NonEmptyList.of(FP, LR)),
                    Mov(AL, FP, Op2.Reg(SP)),
                    Cmp(AL, R0, Op2.Imm(0)),
                    B(NE, nonNullLabel),
                    LdrLit(AL, R1, LitExpr.SymbolRef(nilLabel)),
                    LdrLit(
                        AL,
                        R0,
                        LitExpr.SymbolRef(rodata.use(fmtStr, "str"))
                    ),
                    B(AL, doneLabel),
                    LabelDef(nonNullLabel),
                    Mov(AL, R1, Op2.Reg(R0)),
                    LdrLit(
                        AL,
                        R0,
                        LitExpr.SymbolRef(rodata.use(fmtPtr, "str"))
                    ),
                    LabelDef(doneLabel),
                    Bic(AL, false, SP, SP, Op2.Imm(StackAlignMask)),
                    Bl(AL, "printf"),
                    Mov(AL, SP, Op2.Reg(FP)),
                    Pop(cats.data.NonEmptyList.of(FP, PC))
                )
            }
            case _ => {
                val fmt = if (newline) "%p\n\u0000" else "%p\u0000"
                Chain(
                    Push(cats.data.NonEmptyList.of(FP, LR)),
                    Mov(AL, FP, Op2.Reg(SP)),
                    Mov(AL, R1, Op2.Reg(R0)),
                    LdrLit(AL, R0, LitExpr.SymbolRef(rodata.use(fmt, "str"))),
                    Bic(AL, false, SP, SP, Op2.Imm(StackAlignMask)),
                    Bl(AL, "printf"),
                    Mov(AL, SP, Op2.Reg(FP)),
                    Pop(cats.data.NonEmptyList.of(FP, PC))
                )
            }
        }
        val helperLabel = useHelper(name)(helperBody)
        Chain(
            Mov(AL, R0, Op2.Reg(reg)),
            Bl(AL, helperLabel)
        )
    }

    def malloc(sizeReg: Register, destReg: Register): Chain[Instr[Register]] = {
        externals.add("malloc")

        val helperLabel = useHelper("p_malloc") {
            Chain(
                Push(cats.data.NonEmptyList.of(FP, LR)),
                Mov(AL, FP, Op2.Reg(SP)),
                Bic(AL, false, SP, SP, Op2.Imm(StackAlignMask)),
                Bl(AL, "malloc"),
                Mov(AL, SP, Op2.Reg(FP)),
                Pop(cats.data.NonEmptyList.of(FP, PC))
            )
        }

        Chain(
            Mov(AL, R0, Op2.Reg(sizeReg)),
            Bl(AL, helperLabel),
            Mov(AL, destReg, Op2.Reg(R0))
        )
    }

    def mallocArray(
        lenReg: Register,
        elemSize: Int,
        destReg: Register
    ): Chain[Instr[Register]] = {
        externals.add("malloc")
        val helperLabel = useHelper("p_malloc_array") {
            // R0: length, R1: elemSize
            Chain(
                Push(cats.data.NonEmptyList.of(R4, FP, LR)),
                Mov(AL, FP, Op2.Reg(SP)),
                Mov(AL, R4, Op2.Reg(R0)), // save length
                Mul(AL, R0, R0, R1), // size = len * elemSize
                Add(AL, false, R0, R0, Op2.Imm(alignment)), // size += 4
                Bic(AL, false, SP, SP, Op2.Imm(StackAlignMask)),
                Bl(AL, "malloc"),
                Str(AL, R4, Address.Offset(R0, None)), // store length at start
                Add(AL, false, R0, R0, Op2.Imm(alignment)), // return ptr + 4
                Mov(AL, SP, Op2.Reg(FP)),
                Pop(cats.data.NonEmptyList.of(R4, FP, PC))
            )
        }
        Chain(
            Mov(AL, R0, Op2.Reg(lenReg)),
            Mov(AL, R1, Op2.Imm(elemSize)),
            Bl(AL, helperLabel),
            Mov(AL, destReg, Op2.Reg(R0))
        )
    }

    def free(ptrReg: Register): Chain[Instr[Register]] = {
        externals.add("free")

        val helperLabel = useHelper("p_free") {
            Chain(
                Push(cats.data.NonEmptyList.of(FP, LR)),
                Mov(AL, FP, Op2.Reg(SP)),
                Cmp(AL, R0, Op2.Imm(0)),
                B(EQ, "free_null"),
                Bic(AL, false, SP, SP, Op2.Imm(StackAlignMask)),
                Bl(AL, "free"),
                Mov(AL, SP, Op2.Reg(FP)),
                Pop(cats.data.NonEmptyList.of(FP, PC)),
                LabelDef("free_null")
            ) ++ raise(NullPointer)
        }

        Chain(
            Mov(AL, R0, Op2.Reg(ptrReg)),
            Bl(AL, helperLabel)
        )
    }

    def freeArray(ptrReg: Register): Chain[Instr[Register]] = {
        externals.add("free")
        val helperLabel = useHelper("p_free_array") {
            Chain(
                Push(cats.data.NonEmptyList.of(FP, LR)),
                Mov(AL, FP, Op2.Reg(SP)),
                Sub(AL, false, R0, R0, Op2.Imm(alignment)), // ptr - 4
                Bic(AL, false, SP, SP, Op2.Imm(StackAlignMask)),
                Bl(AL, "free"),
                Mov(AL, SP, Op2.Reg(FP)),
                Pop(cats.data.NonEmptyList.of(FP, PC))
            )
        }
        Chain(
            Mov(AL, R0, Op2.Reg(ptrReg)),
            Bl(AL, helperLabel)
        )
    }

    def exit(statusReg: Register): Chain[Instr[Register]] = {
        externals.add("exit")

        Chain(
            Mov(AL, R0, Op2.Reg(statusReg)),
            Bic(
                AL,
                false,
                SP,
                SP,
                Op2.Imm(StackAlignMask)
            ), // align stack to 8 bytes
            Bl(AL, "exit")
        )
    }

    def read(addrReg: Register, t: Type): Chain[Instr[Register]] = {
        externals.add("scanf")
        val name = t match {
            case CharType => "p_read_char"
            case _        => "p_read_int"
        }
        val helperBody = t match {
            case CharType => {
                val fmt = " %c\u0000"
                Chain(
                    Push(cats.data.NonEmptyList.of(R4, FP, LR)),
                    Mov(AL, FP, Op2.Reg(SP)),
                    Mov(
                        AL,
                        R4,
                        Op2.Reg(R0)
                    ), // store address in R4, write to address only if scanf succeeds
                    Sub(
                        AL,
                        false,
                        SP,
                        SP,
                        Op2.Imm(alignment)
                    ), // allocate temp slot for scanf to write the char
                    Sub(
                        AL,
                        false,
                        R1,
                        FP,
                        Op2.Imm(alignment)
                    ), // address of temp slot
                    LdrLit(AL, R0, LitExpr.SymbolRef(rodata.use(fmt, "str"))),
                    Bic(AL, false, SP, SP, Op2.Imm(StackAlignMask)),
                    Bl(AL, "scanf"),
                    Cmp(
                        AL,
                        R0,
                        Op2.Imm(1)
                    ), // check if scanf successfully read a char
                    B(NE, "done_read_char"),
                    Ldrb(
                        AL,
                        R3,
                        Address.Offset(
                            FP,
                            Some(Op2.Imm(alignment)),
                            add = false
                        )
                    ), // load char from temp slot
                    Strb(
                        AL,
                        R3,
                        Address.Offset(R4, None)
                    ), // write char to target
                    LabelDef("done_read_char"),
                    Mov(AL, SP, Op2.Reg(FP)),
                    Pop(cats.data.NonEmptyList.of(R4, FP, PC))
                )
            }
            case _ => {
                val fmt = "%d\u0000"
                Chain(
                    Push(cats.data.NonEmptyList.of(R4, FP, LR)),
                    Mov(AL, FP, Op2.Reg(SP)),
                    Mov(
                        AL,
                        R4,
                        Op2.Reg(R0)
                    ), // store address in R4, write to address only if scanf succeeds
                    Sub(
                        AL,
                        false,
                        SP,
                        SP,
                        Op2.Imm(alignment)
                    ), // allocate temp slot for scanf to write the int
                    Sub(
                        AL,
                        false,
                        R1,
                        FP,
                        Op2.Imm(alignment)
                    ), // address of temp slot
                    LdrLit(AL, R0, LitExpr.SymbolRef(rodata.use(fmt, "str"))),
                    Bic(AL, false, SP, SP, Op2.Imm(StackAlignMask)),
                    Bl(AL, "scanf"),
                    Cmp(
                        AL,
                        R0,
                        Op2.Imm(1)
                    ), // check if scanf successfully read a char
                    B(NE, "done_read_int"),
                    Ldr(
                        AL,
                        R3,
                        Address.Offset(
                            FP,
                            Some(Op2.Imm(alignment)),
                            add = false
                        )
                    ), // load int from temp slot
                    Str(
                        AL,
                        R3,
                        Address.Offset(R4, None)
                    ), // write int to target
                    LabelDef("done_read_int"),
                    Mov(AL, SP, Op2.Reg(FP)),
                    Pop(cats.data.NonEmptyList.of(R4, FP, PC))
                )
            }
        }
        val helperLabel = useHelper(name)(helperBody)
        Chain(
            Mov(AL, R0, Op2.Reg(addrReg)),
            Bl(AL, helperLabel)
        )
    }

    def raise(
        err: Overflow.type | NullPointer.type | DivisionByZero.type
    ): Chain[Instr[PhysicalReg]] = {
        externals.add("printf")
        externals.add("exit")
        val msg = err match {
            case Overflow =>
                "fatal error: integer overflow or underflow occurred\n"
            case NullPointer => "fatal error: null pair dereferenced or freed\n"
            case DivisionByZero => "fatal error: division or modulo by zero\n"
        }
        val msgLabel = rodata.use(msg, "str")
        val name = err match {
            case Overflow       => "p_overflow_error"
            case NullPointer    => "p_null_pointer_error"
            case DivisionByZero => "p_div_by_zero_error"
        }
        val helperLabel = useHelper(name) {
            Chain(
                LdrLit(AL, R0, LitExpr.SymbolRef(msgLabel)),
                Bic(AL, false, SP, SP, Op2.Imm(StackAlignMask)),
                Bl(AL, "printf"),
                Mov(AL, R0, Op2.Imm(runtimeErr)),
                Bic(AL, false, SP, SP, Op2.Imm(StackAlignMask)),
                Bl(AL, "exit")
            )
        }
        Chain(Bl(AL, helperLabel))
    }

    def raiseWithReg(
        err: BadChr.type | ArrayBounds.type,
        indexReg: Register
    ): Chain[Instr[Register]] = {
        externals.add("printf")
        externals.add("exit")
        val msg = err match {
            case BadChr => "fatal error: int %d is not ascii character 0-127 \n"
            case ArrayBounds => "fatal error: array index %d out of bounds\n"
        }
        val msgLabel = rodata.use(msg, "str")
        val name = err match {
            case BadChr      => "p_bad_chr_error"
            case ArrayBounds => "p_array_bounds_error"
        }
        val body = err match {
            case BadChr =>
                Chain(
                    Push(cats.data.NonEmptyList.of(FP, LR)),
                    Mov(AL, FP, Op2.Reg(SP)),
                    Mov(AL, R1, Op2.Reg(R0)), // pass the bad int in r1
                    LdrLit(AL, R0, LitExpr.SymbolRef(msgLabel)),
                    Bic(AL, false, SP, SP, Op2.Imm(StackAlignMask)),
                    Bl(AL, "printf"),
                    // Mov(AL, R0, Op2.Imm(FlushAllStreams)),
                    // Bl(AL, "fflush"),
                    Mov(AL, R0, Op2.Imm(runtimeErr)),
                    Bic(AL, false, SP, SP, Op2.Imm(StackAlignMask)),
                    Bl(AL, "exit")
                )
            case ArrayBounds =>
                Chain(
                    Push(cats.data.NonEmptyList.of(FP, LR)),
                    Mov(AL, FP, Op2.Reg(SP)),
                    Mov(
                        AL,
                        R1,
                        Op2.Reg(R0)
                    ), // Move index from R0 to R1 for printf
                    LdrLit(AL, R0, LitExpr.SymbolRef(msgLabel)),
                    Bic(AL, false, SP, SP, Op2.Imm(StackAlignMask)),
                    Bl(AL, "printf"),
                    Mov(AL, R0, Op2.Imm(runtimeErr)),
                    Bic(AL, false, SP, SP, Op2.Imm(StackAlignMask)),
```

### File 15: README.md
Score: 210
Reasons: manual pipeline path; README.md; preferred text extension
Type: file (file)
Language: markdown
Size: 1588 bytes
```
This is the provided git repository for the WACC compilers lab. You should work
in this repository regularly committing and pushing your work back to GitLab.

# Provided files/directories

## src/main

The src/main directory is where you code for your compiler should go, and just
contains a stub hello world file with a simple calculator inside.

## src/test
The src/test directory is where you should put the code for your tests, which
can be ran via `scala-cli test .`. The suggested framework is `scalatest`, the dependency
for which has already been included.

## project.scala
The `project.scala` is the definition of your project's build requirements. By default,
this skeleton has added the latest stable versions of both `scalatest` and `parsley`
to the build: you should check **regularly** to see if your `parsley` needs updating
during the course of WACC!

## compile

The compile script can be edited to change the frontend interface to your WACC
compiler. You are free to change the language used in this script, but do not
change its name.

## Makefile

Your Makefile should be edited so that running 'make' in the root directory
builds your WACC compiler. Currently running 'make' will call
`scala --power package . --server=false --jvm system --graalvm-jvm-id graalvm-java21 --native-image --force -o wacc-compiler`, producing a file called
`wacc-compiler`
in the root directory of the project. If this doesn't work for whatever reason, there are a few
different alternatives you can try in the makefile. **Do not use the makefile as you're working, it's for labts/CI!**

```

### File 16: src/main/wacc/backend/DataManager.scala
Score: 135
Reasons: core path: src/main; core path: backend; preferred text extension
Type: file (file)
Language: scala
Size: 415 bytes
```
package wacc.backend

import scala.collection.mutable

class DataManager(using label: LabelManager) {
    /** Maps strings to labels in a data section */
    private val labels = mutable.Map.empty[String, String]

    def use(content: String, prefix: String | Null = null): String = {
        labels.getOrElseUpdate(content, label.local(prefix))
    }

    def definitions: List[(String, String)] = labels.toList
}

```

### File 17: src/main/wacc/backend/LabelManager.scala
Score: 135
Reasons: core path: src/main; core path: backend; preferred text extension
Type: file (file)
Language: scala
Size: 394 bytes
```
package wacc.backend

import scala.collection.mutable

class LabelManager(genLocalLabel: (String | Null, Int) => String) {
    /** For generating unique labels */
    private val nextId =
        mutable.Map.empty[String | Null, Int].withDefaultValue(-1)

    def local(prefix: String | Null = null): String = {
        nextId(prefix) += 1
        genLocalLabel(prefix, nextId(prefix))
    }
}

```

### File 18: src/main/wacc/bridge.scala
Score: 90
Reasons: core path: src/main; preferred text extension
Type: file (file)
Language: scala
Size: 1060 bytes
```
package wacc

import parsley.Parsley
import parsley.position.pos

import diagnostics.ErrPos

// parser consumes A and output B, A should be contravariant and B covariant
trait ParserBridgePos1[-A, +B] {
    def apply(x: A)(p: ErrPos): B
    final def apply(px: Parsley[A]): Parsley[B] =
        // <**>: reverse app
        // first parse pos, then parse px,
        // if both succeed, the value returned by pos is applied to the apply method
        pos <**> px.map(this.apply(_))
}

trait ParserBridgePos2[-A, -B, +C] {
    def apply(x: A, y: B)(p: ErrPos): C
    final def apply(px: Parsley[A], py: Parsley[B]): Parsley[C] =
        // use lazy <~> to allow for mutual recursion
        pos <**> (px <~> py).map { case (x, y) => this.apply(x, y)(_) }
}

trait ParserBridgePos3[-A, -B, -C, +D] {
    def apply(x: A, y: B, z: C)(p: ErrPos): D
    def apply(
        px: Parsley[A],
        py: Parsley[B],
        pz: Parsley[C]
    ): Parsley[D] =
        pos <**> (px <~> py <~> pz).map { case ((x, y), z) =>
            this.apply(x, y, z)(_)
        }
}

```

### File 19: src/main/wacc/ConstantPropagation.scala
Score: 90
Reasons: core path: src/main; preferred text extension
Type: file (file)
Language: scala
Size: 12018 bytes
```
package wacc

import scala.collection.mutable
import CFG._
import wacc.CFG.Terminator.Branch
import interpreter._
import interpreter.PrimitiveEvaluator.PrimitiveEnv

trait ConstantPropagator[A, E] {
    def propagateConstants(prog: CFGProgram[A, E]): CFGProgram[A, E]
}

object ARMConstantPropagator extends ConstantPropagator[Stmt, Expr] {
    def propagateConstants(
        prog: CFGProgram[Stmt, Expr]
    ): CFGProgram[Stmt, Expr] = {
        val newFuncs = prog.funcs.map { (ident, func) =>
            ident -> propagateCfg(func)
        }
        val newMain = propagateCfg(prog.main)
        CFGProgram(newFuncs, newMain)
    }

    /** Perform constant propagation on given CFG, returns a new CFG */
    private def propagateCfg(cfg: CFG[Stmt, Expr]): CFG[Stmt, Expr] = {
        val inEnv = mutable.Map.empty[BlockId, PrimitiveEnv]
        val outEnv = mutable.Map.empty[BlockId, PrimitiveEnv]
        propagateCfgEnv(cfg)(using inEnv, outEnv)
        val newBlocks = cfg.blocks.map { (id, block) =>
            id -> updateBlock(block, inEnv.getOrElse(id, Map.empty))
        }.toMap
        newBlocks.foreach { (id, block) => cfg.updateBlock(id, block) }
        cfg
    }

    /** Returns a new block with expressions propagated according to the given
      * constant environment, and updates the environment according to the
      * statements in the block
      */
    private def updateBlock(
        block: BasicBlock[Stmt, Expr],
        env: PrimitiveEnv
    ): BasicBlock[Stmt, Expr] = {
        var localEnv = env

        def propagateAndStep(expr: Expr, stmt: Stmt): Expr = {
            val newExpr = propagateExpr(expr, localEnv)
            localEnv = step(stmt, localEnv)
            newExpr
        }

        val newStmts: List[Stmt] = block.stmts.map {
            case stmt @ RenamedDecl(_, _, rv) =>
                val newRv = propagateRValue(rv, localEnv)
                localEnv = step(stmt, localEnv)
                stmt.copy(rvalue = newRv)(stmt.pos)
            case stmt @ Assign(lv, rv) =>
                val newRv = propagateRValue(rv, localEnv)
                val newLv = propagateLValue(lv, localEnv)
                localEnv = step(stmt, localEnv)
                stmt.copy(lvalue = newLv, rvalue = newRv)(stmt.pos)
            // copy method for the case classes is used, best not to abstract here
            case stmt @ Return(expr) =>
                // val newExpr = propagateExpr(expr, localEnv)
                // localEnv = step(stmt, localEnv)
                val newExpr = propagateAndStep(expr, stmt)
                val newStmt = stmt.copy(expr = newExpr)(stmt.pos)
                preserveType(newStmt, stmt)
            case stmt @ Exit(expr) =>
                val newExpr = propagateAndStep(expr, stmt)
                val newStmt = stmt.copy(expr = newExpr)(stmt.pos)
                preserveType(newStmt, stmt)
            case stmt @ Print(expr) =>
                val newExpr = propagateAndStep(expr, stmt)
                val newStmt = stmt.copy(expr = newExpr)(stmt.pos)
                preserveType(newStmt, stmt)
                newStmt
            case stmt @ Println(expr) =>
                val newExpr = propagateAndStep(expr, stmt)
                val newStmt = stmt.copy(expr = newExpr)(stmt.pos)
                preserveType(newStmt, stmt)
            case stmt @ Send(ch, v) =>
                val newCh = propagateExpr(ch, localEnv)
                val newV = propagateExpr(v, localEnv)
                localEnv = step(stmt, localEnv)
                stmt.copy(channel = newCh, value = newV)(stmt.pos)
            case stmt =>
                localEnv = step(stmt, localEnv)
                stmt
        }

        val newTerminator: Terminator[Stmt, Expr] = block.terminator match {
            case Branch(cond, trueTarget, falseTarget) =>
                val newCond = propagateExpr(cond, localEnv)
                Branch(newCond, trueTarget, falseTarget)
            case Terminator.Exit(expr) =>
                val newExpr = propagateExpr(expr, localEnv)
                Terminator.Exit(newExpr)
            case Terminator.Return(expr) =>
                val newExpr = propagateExpr(expr, localEnv)
                Terminator.Return(newExpr)
            case term => term
        }

        block.copy(stmts = newStmts, terminator = newTerminator)
    }

    private def preserveType[T <: HasInferredType](
        node: T,
        source: HasInferredType
    ): T = {
        node.inferredType = source.inferredType
        node
    }

    /** Apply constant propagation on the given expression using the given
      * constant environment
      */
    private def propagateExpr(expr: Expr, env: PrimitiveEnv): Expr = {
        expr match {
            case v: RenamedVar =>
                env.get(v) match {
                    case Some(IntVal(value)) =>
                        preserveType(IntLiter(value)(expr.pos), expr)
                    case Some(BoolVal(value)) =>
                        preserveType(BoolLiter(value)(expr.pos), expr)
                    case Some(CharVal(value)) =>
                        preserveType(CharLiter(value)(expr.pos), expr)
                    case Some(StringVal(value)) =>
                        preserveType(StringLiter(value)(expr.pos), expr)
                    case None => expr
                }
            case RenamedArrayElem(ident, indices) =>
                preserveType(
                    RenamedArrayElem(
                        ident,
                        indices.map(e => propagateExpr(e, env))
                    )(expr.pos),
                    expr
                )
            case UnaryOp(oper, e) =>
                preserveType(
                    UnaryOp(oper, propagateExpr(e, env))(expr.pos),
                    expr
                )
            case BinaryOp(oper, l, r) =>
                preserveType(
                    BinaryOp(
                        oper,
                        propagateExpr(l, env),
                        propagateExpr(r, env)
                    )(expr.pos),
                    expr
                )
            case Recv(ch) =>
                preserveType(
                    Recv(propagateExpr(ch, env))(expr.pos),
                    expr
                )
            case _ => expr
        }
    }

    /** Apply constant propagation on the given Rvalue using the given constant
      * environment
      */
    private def propagateRValue(rv: RValue, env: PrimitiveEnv): RValue = {
        rv match {
            case expr: Expr                => propagateExpr(expr, env)
            case rv @ ArrayLiter(elements) =>
                val out =
                    ArrayLiter(elements.map(e => propagateExpr(e, env)))(rv.pos)
                preserveType(out, rv)
            case rv @ NewPair(fst, snd) =>
                val out =
                    NewPair(propagateExpr(fst, env), propagateExpr(snd, env))(
                        rv.pos
                    )
                preserveType(out, rv)
            case rv @ Call(ident, args) =>
                Call(ident, args.map(arg => propagateExpr(arg, env)))(rv.pos)
            case rv @ Fst(lv) =>
                preserveType(Fst(propagateLValue(lv, env))(rv.pos), rv)
            case rv @ Snd(lv) =>
                preserveType(Snd(propagateLValue(lv, env))(rv.pos), rv)
            case nc @ NewChan() => nc
        }
    }

    /** Apply constant propagation on the given Lvalue using the given constant
      * environment (variables in lvalue are not substituted)
      */
    private def propagateLValue(lv: LValue, env: PrimitiveEnv): LValue = {
        lv match {
            case RenamedVar(_, _)                           => lv
            case arrElem @ RenamedArrayElem(ident, indices) =>
                preserveType(
                    RenamedArrayElem(
                        ident,
                        indices.map(e => propagateExpr(e, env))
                    )(arrElem.pos),
                    arrElem
                )
            case fst @ Fst(lv) =>
                preserveType(Fst(propagateLValue(lv, env))(fst.pos), fst)
            case snd @ Snd(lv) =>
                preserveType(Snd(propagateLValue(lv, env))(snd.pos), snd)
            case _ => lv
        }
    }

    /** Do fixed point iteration to propagate in and out constant environments
      * for each cfg block
      */
    private def propagateCfgEnv(cfg: CFG[Stmt, Expr])(using
        inEnv: mutable.Map[BlockId, PrimitiveEnv],
        outEnv: mutable.Map[BlockId, PrimitiveEnv]
    ) = {

        val blocks = cfg.getBlockIdInOrder()
        var lastIn = inEnv.toMap
        var lastOut = outEnv.toMap
        var changed = true
        while (changed) {
            changed = false
            for (blockId <- blocks) {
                val in = getInEnv(cfg, blockId)(using outEnv)
                val out = maintainEnv(cfg, blockId, in)
                if (in != lastIn.getOrElse(blockId, Map.empty)) {
                    inEnv.update(blockId, in)
                    changed = true
                }
                if (out != lastOut.getOrElse(blockId, Map.empty)) {
                    outEnv.update(blockId, out)
                    changed = true
                }
            }
            lastIn = inEnv.toMap
            lastOut = outEnv.toMap
        }
    }

    /** Calculate the in constant environment for a block by merging the out
      * environments of its predecessors, only variables existing in all
      * predecessors with the same constant value are kept, otherwise the
      * variable is removed from the in environment
      */
    private def getInEnv(cfg: CFG[Stmt, Expr], blockId: BlockId)(using
        outEnv: mutable.Map[BlockId, PrimitiveEnv]
    ): PrimitiveEnv = {
        val preds = cfg.index.pred.getOrElse(blockId, Nil)
        val outEnvs = preds.map(id => outEnv.getOrElse(id, Map.empty))
        val entries = outEnvs.flatMap(_.toList)
        // group by variable key, only keep keys that appear in all predecessor outEnvs, and all values are the same
        val grouped = entries.groupMap(_._1)(_._2).filter { p =>
            p._2.length == preds.length && p._2.forall(_ == p._2.head)
        }
        grouped.map { (key, values) => key -> values.head }.toMap
    }

    /** Step through the statements in a block, updating the given constant
      * environment along the way to produce out environment.
      * @pre
      *   typeChecking has been done, no type errors expected here
      */
    private def maintainEnv(
        cfg: CFG[Stmt, Expr],
        blockId: BlockId,
        in: PrimitiveEnv
    ): PrimitiveEnv = {
        val block =
            cfg.blocks.getOrElse(
                blockId,
                throw new IllegalArgumentException("Block not found")
            )
        block.stmts
            .asInstanceOf[List[Stmt]]
            .foldLeft(in) { (env, stmt) => step(stmt, env) }
    }

    /** evaluate a single statement using the given constant environment, return
      * the updated environment
      */
    private def step(stmt: Stmt, env: PrimitiveEnv): PrimitiveEnv = {
        stmt match {
            case RenamedDecl(t, x, rv: Expr) =>
                PrimitiveEvaluator(env)
                    .evalExpr(rv)
                    .toOption
                    .map(v => env.updated(x, v))
                    .getOrElse(env - x)

            case Assign(renamed: RenamedVar, rv: Expr) =>
                PrimitiveEvaluator(env)
                    .evalExpr(rv)
                    .toOption
                    .map(v => env.updated(renamed, v))
                    .getOrElse(env - renamed)

            case Assign(renamed: RenamedVar, _) =>
                env - renamed // clear the variable if it's assigned non-expr rvalue

            case Read(renamed: RenamedVar) =>
                env - renamed

            // No constant environment changes for other statements/lvalues.
            case _ =>
                env
        }
    }
}

```

### File 20: src/main/wacc/diagnostics.scala
Score: 90
Reasons: core path: src/main; preferred text extension
Type: file (file)
Language: scala
Size: 2471 bytes
```
package wacc

object diagnostics {
    final val SUCCESS = 0
    final val SYNTAX_ERROR = 100
    final val SEMANTIC_ERROR = 200

    type ErrPos = (Int, Int) // (line, column)
    private final val TabWidth = 4

    final case class Diagnostic(
        phase: String, // Scope or Type
        message: String,
        pos: ErrPos,
        width: Int = 1 // caret width for highlighting
    )

    private def render(
        fileName: String,
        code: String,
        diag: Diagnostic
    ): String = {
        val (line, col) = diag.pos
        val lines = code.linesIterator.toArray
        val lineIdx = line - 1
        val colIdx = col - 1

        val errLine =
            if (lineIdx >= 0 && lineIdx < lines.length) lines(lineIdx) else ""
        val prevLine =
            if (lineIdx - 1 >= 0 && lineIdx - 1 < lines.length)
                Some(lines(lineIdx - 1))
            else None
        val nextLine =
            if (lineIdx + 1 < lines.length && lineIdx + 1 >= 0)
                Some(lines(lineIdx + 1))
            else None

        def expandTabs(line: String): String = {
            val sb = new StringBuilder
            var col = 0
            line.foreach { ch =>
                if (ch == '\t') {
                    val spaces = TabWidth - (col % TabWidth)
                    sb.append(" " * spaces)
                    col += spaces
                } else {
                    sb.append(ch)
                    col += 1
                }
            }
            sb.toString
        }

        val caret = " " * colIdx + "^" * math.max(1, diag.width)

        val header =
            s"${diag.phase} error in $fileName at line $line, column $col:\n"

        List(
            header,
            diag.message + "\n",
            if (prevLine.nonEmpty)
                s"${line - 1} |  ${expandTabs(prevLine.get)}\n"
            else "",
            s"$line |  ${expandTabs(errLine)}\n",
            " " * line.toString.length() + " |  " + caret + "\n",
            if (nextLine.nonEmpty)
                s"${line + 1} |  ${expandTabs(nextLine.get)}\n"
            else ""
        ).filter(_.nonEmpty).mkString
    }

    def renderAll(
        fileName: String,
        code: String,
        diags: List[Diagnostic]
    ): String = {
        val sorted = diags.sortBy(diag => (diag.pos._1, diag.pos._2))
        sorted
            .map(diag => render(fileName, code, diag))
            .mkString("\n----------------\n")
    }
}

```

## Selected Test Files (5)
### Test 1: src/test/wacc/CodeGeneratorTests.scala
Score: 850
Reasons: priority pattern: **/*CodeGenerator*; priority pattern: **/*Test*; manual guided tour path; compiler-pipeline template: code generation; preferred text extension; test file
Type: file (test)
Language: scala
Size: 12957 bytes
```
package wacc

import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers
import org.scalatest.BeforeAndAfterEach
import parsley.{Success, Failure}
import org.scalatest.Assertions.fail
import diagnostics.ErrPos
import wacc.backend.arm.{ARMCodeGenerator, Instr, LitExpr, Op2}
import Instr._
import CFG._
import scope._
import wacc.typeChecker.checkTypes

def programToCFG(program: Program): CFGProgram[Stmt, Expr] = {
    program.rename() match {
        case Success(renamed) =>
            renamed.checkTypes() match {
                case Success(result) => CFG.apply(result.ast)
                case Failure(msg) => fail(s"Type check failed: $msg")
            }
        case Failure(msg) => fail(s"Rename failed: $msg")
    }
}

class CodeGeneratorTests extends AnyFlatSpec with Matchers with BeforeAndAfterEach {
    val dummyPos: ErrPos = (0, 0)

    override def beforeEach(): Unit = scope.resetVarCounter()

    behavior of "The CodeGenerator"

    it should "generate code for integer literal expression" in {
        val program = Program(
            funcs = Nil,
            main = Stmts(List(
                Decl(IntType, "x", IntLiter(42)(dummyPos))(dummyPos),
                Exit(Var("x")(dummyPos))(dummyPos)
            ))
        )
        val instrs = new ARMCodeGenerator().generate(programToCFG(program))
        instrs.exists { case Instr.LdrLit(_, _, LitExpr.Const(42)) => true; case _ => false } shouldBe true
    }

    it should "generate code for bool literal expression" in {
        val program = Program(
            funcs = Nil,
            main = Stmts(List(
                Decl(BoolType, "b", BoolLiter(true)(dummyPos))(dummyPos),
                Exit(IntLiter(0)(dummyPos))(dummyPos)
            ))
        )
        val instrs = new ARMCodeGenerator().generate(programToCFG(program))
        instrs.exists { case Instr.Mov(_, _, Op2.Imm(1)) => true; case _ => false } shouldBe true
    }

    it should "generate code for char literal expression" in {
        val program = Program(
            funcs = Nil,
            main = Stmts(List(
                Decl(CharType, "c", CharLiter('A')(dummyPos))(dummyPos),
                Exit(IntLiter(0)(dummyPos))(dummyPos)
            ))
        )
        val instrs = new ARMCodeGenerator().generate(programToCFG(program))
        instrs.exists { case Instr.LdrLit(_, _, LitExpr.Const(65)) => true; case _ => false } shouldBe true
    }

    it should "generate code for string literal and emit rodata" in {
        val program = Program(
            funcs = Nil,
            main = Stmts(List(
                Print(StringLiter("hi")(dummyPos))(dummyPos),
                Exit(IntLiter(0)(dummyPos))(dummyPos)
            ))
        )
        val codegen = new ARMCodeGenerator()
        val instrs = codegen.generate(programToCFG(program))
        codegen.rodataDefinitions.exists(_._1 == "hi") shouldBe true
        instrs.exists { case Instr.LdrLit(_, _, LitExpr.SymbolRef(_)) => true; case _ => false } shouldBe true
    }

    it should "generate code for null literal" in {
        val program = Program(
            funcs = Nil,
            main = Stmts(List(
                Decl(PairType(ErasedPairType, ErasedPairType), "p", NullLiter()(dummyPos))(dummyPos),
                Exit(IntLiter(0)(dummyPos))(dummyPos)
            ))
        )
        val instrs = new ARMCodeGenerator().generate(programToCFG(program))
        instrs.exists { case Instr.Mov(_, _, Op2.Imm(0)) => true; case _ => false } shouldBe true
    }

    it should "generate code for variable declaration and assignment" in {
        val program = Program(
            funcs = Nil,
            main = Stmts(List(
                Decl(IntType, "x", IntLiter(10)(dummyPos))(dummyPos),
                Assign(Var("x")(dummyPos), IntLiter(20)(dummyPos))(dummyPos),
                Exit(Var("x")(dummyPos))(dummyPos)
            ))
        )
        val instrs = new ARMCodeGenerator().generate(programToCFG(program))
        instrs.exists { case Instr.Str(_, _, _) => true; case _ => false } shouldBe true
        instrs.exists { case Instr.Ldr(_, _, _) => true; case _ => false } shouldBe true
    }

    it should "generate code for print int" in {
        val program = Program(
            funcs = Nil,
            main = Stmts(List(
                Print(IntLiter(42)(dummyPos))(dummyPos),
                Exit(IntLiter(0)(dummyPos))(dummyPos)
            ))
        )
        val instrs = new ARMCodeGenerator().generate(programToCFG(program))
        instrs.exists { case Instr.Bl(_, "p_print_int") => true; case _ => false } shouldBe true
    }

    it should "generate code for println int" in {
        val program = Program(
            funcs = Nil,
            main = Stmts(List(
                Println(IntLiter(1)(dummyPos))(dummyPos),
                Exit(IntLiter(0)(dummyPos))(dummyPos)
            ))
        )
        val instrs = new ARMCodeGenerator().generate(programToCFG(program))
        instrs.exists { case Instr.Bl(_, "p_print_int_ln") => true; case _ => false } shouldBe true
    }

    it should "generate code for print string" in {
        val program = Program(
            funcs = Nil,
            main = Stmts(List(
                Print(StringLiter("hello")(dummyPos))(dummyPos),
                Exit(IntLiter(0)(dummyPos))(dummyPos)
            ))
        )
        val instrs = new ARMCodeGenerator().generate(programToCFG(program))
        instrs.exists { case Instr.Bl(_, "p_print_string") => true; case _ => false } shouldBe true
    }

    it should "generate code for read statement" in {
        val program = Program(
            funcs = Nil,
            main = Stmts(List(
                Decl(IntType, "x", IntLiter(0)(dummyPos))(dummyPos),
                Read(Var("x")(dummyPos))(dummyPos),
                Exit(Var("x")(dummyPos))(dummyPos)
            ))
        )
        val instrs = new ARMCodeGenerator().generate(programToCFG(program))
        instrs.exists { case Instr.Bl(_, "p_read_int") => true; case _ => false } shouldBe true
    }

    it should "generate code for addition" in {
        val program = Program(
            funcs = Nil,
            main = Stmts(List(
                Decl(IntType, "r", BinaryOp(BinaryOper.Add, IntLiter(1)(dummyPos), IntLiter(2)(dummyPos))(dummyPos))(dummyPos),
                Exit(Var("r")(dummyPos))(dummyPos)
            ))
        )
        val instrs = new ARMCodeGenerator().generate(programToCFG(program))
        instrs.exists { case Instr.Add(_, _, _, _, _) => true; case _ => false } shouldBe true
    }

    it should "generate code for subtraction" in {
        val program = Program(
            funcs = Nil,
            main = Stmts(List(
                Decl(IntType, "r", BinaryOp(BinaryOper.Sub, IntLiter(5)(dummyPos), IntLiter(2)(dummyPos))(dummyPos))(dummyPos),
                Exit(Var("r")(dummyPos))(dummyPos)
            ))
        )
        val instrs = new ARMCodeGenerator().generate(programToCFG(program))
        instrs.exists { case Instr.Sub(_, _, _, _, _) => true; case _ => false } shouldBe true
    }

    it should "generate code for multiplication" in {
        val program = Program(
            funcs = Nil,
            main = Stmts(List(
                Decl(IntType, "r", BinaryOp(BinaryOper.Mul, IntLiter(3)(dummyPos), IntLiter(4)(dummyPos))(dummyPos))(dummyPos),
                Exit(Var("r")(dummyPos))(dummyPos)
            ))
        )
        val instrs = new ARMCodeGenerator().generate(programToCFG(program))
        instrs.exists { case Instr.Smull(_, _, _, _, _) => true; case _ => false } shouldBe true
    }

    it should "generate code for division" in {
        val program = Program(
            funcs = Nil,
            main = Stmts(List(
                Decl(IntType, "r", BinaryOp(BinaryOper.Div, IntLiter(10)(dummyPos), IntLiter(2)(dummyPos))(dummyPos))(dummyPos),
                Exit(Var("r")(dummyPos))(dummyPos)
            ))
        )
        val instrs = new ARMCodeGenerator().generate(programToCFG(program))
        instrs.exists { case Instr.Bl(_, "__aeabi_idiv") => true; case _ => false } shouldBe true
    }

    it should "generate code for negation" in {
        val program = Program(
            funcs = Nil,
            main = Stmts(List(
                Decl(IntType, "r", UnaryOp(UnaryOper.Neg, IntLiter(5)(dummyPos))(dummyPos))(dummyPos),
                Exit(Var("r")(dummyPos))(dummyPos)
            ))
        )
        val instrs = new ARMCodeGenerator().generate(programToCFG(program))
        instrs.exists { case Instr.Sub(_, _, _, _, _) => true; case _ => false } shouldBe true
    }

    it should "generate code for logical not" in {
        val program = Program(
            funcs = Nil,
            main = Stmts(List(
                Decl(BoolType, "r", UnaryOp(UnaryOper.Not, BoolLiter(false)(dummyPos))(dummyPos))(dummyPos),
                Exit(IntLiter(0)(dummyPos))(dummyPos)
            ))
        )
        val instrs = new ARMCodeGenerator().generate(programToCFG(program))
        instrs.exists { case Instr.Cmp(_, _, _) => true; case _ => false } shouldBe true
    }

    it should "generate code for if statement" in {
        val program = Program(
            funcs = Nil,
            main = Stmts(List(
                Decl(IntType, "x", IntLiter(0)(dummyPos))(dummyPos),
                If(
                    BoolLiter(true)(dummyPos),
                    Stmts(List(Assign(Var("x")(dummyPos), IntLiter(1)(dummyPos))(dummyPos))),
                    Stmts(List(Assign(Var("x")(dummyPos), IntLiter(0)(dummyPos))(dummyPos)))
                )(dummyPos),
                Exit(Var("x")(dummyPos))(dummyPos)
            ))
        )
        val instrs = new ARMCodeGenerator().generate(programToCFG(program))
        instrs.exists { case Instr.B(_, _) => true; case _ => false } shouldBe true
    }

    it should "generate code for while loop" in {
        val program = Program(
            funcs = Nil,
            main = Stmts(List(
                Decl(IntType, "i", IntLiter(0)(dummyPos))(dummyPos),
                While(
                    BinaryOp(BinaryOper.Lt, Var("i")(dummyPos), IntLiter(3)(dummyPos))(dummyPos),
                    Stmts(List(Assign(Var("i")(dummyPos), BinaryOp(BinaryOper.Add, Var("i")(dummyPos), IntLiter(1)(dummyPos))(dummyPos))(dummyPos)))
                )(dummyPos),
                Exit(Var("i")(dummyPos))(dummyPos)
            ))
        )
        val instrs = new ARMCodeGenerator().generate(programToCFG(program))
        instrs.exists { case Instr.B(_, _) => true; case _ => false } shouldBe true
    }

    it should "generate code for function definition and call" in {
        val program = Program(
            funcs = List(
                Func(
                    IntType,
                    "double",
                    List(FuncParam(IntType, "n")(dummyPos)),
                    Stmts(List(
                        Return(BinaryOp(BinaryOper.Mul, Var("n")(dummyPos), IntLiter(2)(dummyPos))(dummyPos))(dummyPos)
                    ))
                )(dummyPos)
            ),
            main = Stmts(List(
                Decl(IntType, "r", Call("double", List(IntLiter(21)(dummyPos)))(dummyPos))(dummyPos),
                Exit(Var("r")(dummyPos))(dummyPos)
            ))
        )
        val instrs = new ARMCodeGenerator().generate(programToCFG(program))
        instrs.exists { case Instr.LabelDef("double") => true; case _ => false } shouldBe true
        instrs.exists { case Instr.Bl(_, "double") => true; case _ => false } shouldBe true
        instrs.exists { case Instr.Push(_) => true; case _ => false } shouldBe true
    }

    it should "generate code for free statement" in {
        val program = Program(
            funcs = Nil,
            main = Stmts(List(
                Decl(ArrayType(IntType), "arr", ArrayLiter(List(IntLiter(1)(dummyPos)))(dummyPos))(dummyPos),
                Free(Var("arr")(dummyPos))(dummyPos),
                Exit(IntLiter(0)(dummyPos))(dummyPos)
            ))
        )
        val instrs = new ARMCodeGenerator().generate(programToCFG(program))
        instrs.exists { case Instr.Bl(_, "free") => true; case _ => false } shouldBe true
    }

    it should "generate code for fork statement" in {
        val program = Program(
            funcs = List(
                Func(IntType, "worker", Nil, Stmts(List(Return(IntLiter(0)(dummyPos))(dummyPos))))(
                    dummyPos
                )
            ),
            main = Stmts(List(
                Fork(Call("worker", Nil)(dummyPos))(dummyPos),
                Exit(IntLiter(0)(dummyPos))(dummyPos)
            ))
        )
        val instrs = new ARMCodeGenerator().generate(programToCFG(program))
        instrs.exists { case Instr.Bl(_, "p_fork") => true; case _ => false } shouldBe true
        instrs.exists { case Instr.LabelDef("worker") => true; case _ => false } shouldBe true
    }
}

```

### Test 2: src/test/wacc/TypeCheckerTests.scala
Score: 850
Reasons: priority pattern: **/*TypeChecker*; priority pattern: **/*Test*; manual guided tour path; compiler-pipeline template: semantic checker; preferred text extension; test file
Type: file (test)
Language: scala
Size: 22218 bytes
Content: truncated
```
package wacc

import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers
import org.scalatest.BeforeAndAfterEach
import parsley.{Success, Failure}
import diagnostics.ErrPos

class TypeCheckerTests
    extends AnyFlatSpec
    with Matchers
    with BeforeAndAfterEach {
    import scope._
    import typeChecker._

    override def beforeEach(): Unit = scope.resetVarCounter()
    val dummyPos: ErrPos = (0, 0) // Line 0, Column 0

    behavior of "The TypeChecker"

    // ========== VARIABLES ==========

    it should "typecheck a valid variable declaration" in {
        val program = Program(
            funcs = Nil,
            main = Stmts(
                List(
                    Decl(IntType, "x", IntLiter(42)(dummyPos))(dummyPos)
                )
            )
        )
        program.rename() match {
            case Success(renamed) =>
                renamed.checkTypes() should matchPattern {
                    case Success(
                            TypeCheckResult(
                                Program(
                                    Nil,
                                    Stmts(
                                        List(
                                            RenamedDecl(
                                                IntType,
                                                RenamedVar("x", 1),
                                                IntLiter(42)
                                            )
                                        )
                                    ),
                                    _
                                ),
                                _,
                                _
                            )
                        ) =>
                }
            case Failure(msg) =>
                fail(s"Renaming failed: $msg")

        }
    }

    it should "typecheck a valid array declaration and assignment" in {
        val program = Program(
            funcs = Nil,
            main = Stmts(
                List(
                    Decl(
                        ArrayType(IntType),
                        "arr",
                        ArrayLiter(
                            List(IntLiter(1)(dummyPos), IntLiter(2)(dummyPos))
                        )(dummyPos)
                    )(dummyPos),
                    Assign(
                        ArrayElem("arr", List(IntLiter(0)(dummyPos)))(dummyPos),
                        IntLiter(42)(dummyPos)
                    )(dummyPos)
                )
            )
        )
        program.rename() match {
            case Success(renamed) =>
                renamed.checkTypes() should matchPattern {
                    case Success(
                            TypeCheckResult(
                                Program(
                                    Nil,
                                    Stmts(
                                        List(
                                            RenamedDecl(
                                                ArrayType(IntType),
                                                RenamedVar("arr", 1),
                                                ArrayLiter(
                                                    List(
                                                        IntLiter(1),
                                                        IntLiter(2)
                                                    )
                                                )
                                            ),
                                            Assign(
                                                RenamedArrayElem(
                                                    RenamedVar("arr", 1),
                                                    List(IntLiter(0))
                                                ),
                                                IntLiter(42)
                                            )
                                        )
                                    ),
                                    _
                                ),
                                _,
                                _
                            )
                        ) =>
                }
            case Failure(msg) =>
                fail(s"Renaming failed: $msg")
        }
    }

    it should "typecheck a valid pair declaration and assignment" in {
        val program = Program(
            funcs = Nil,
            main = Stmts(
                List(
                    Decl(
                        PairType(
                            PairElemBaseType(IntType),
                            PairElemBaseType(BoolType)
                        ),
                        "p",
                        NewPair(
                            IntLiter(7)(dummyPos),
                            BoolLiter(true)(dummyPos)
                        )(dummyPos)
                    )(dummyPos),
                    Assign(
                        Fst(Var("p")(dummyPos))(dummyPos),
                        IntLiter(99)(dummyPos)
                    )(dummyPos),
                    Assign(
                        Snd(Var("p")(dummyPos))(dummyPos),
                        BoolLiter(false)(dummyPos)
                    )(dummyPos)
                )
            )
        )
        program.rename() match {
            case Success(renamed) =>
                renamed.checkTypes() should matchPattern {
                    case Success(
                            TypeCheckResult(
                                Program(
                                    Nil,
                                    Stmts(
                                        List(
                                            RenamedDecl(
                                                PairType(
                                                    PairElemBaseType(IntType),
                                                    PairElemBaseType(BoolType)
                                                ),
                                                RenamedVar("p", 1),
                                                NewPair(
                                                    IntLiter(7),
                                                    BoolLiter(true)
                                                )
                                            ),
                                            Assign(
                                                Fst(RenamedVar("p", 1)),
                                                IntLiter(99)
                                            ),
                                            Assign(
                                                Snd(RenamedVar("p", 1)),
                                                BoolLiter(false)
                                            )
                                        )
                                    ),
                                    _
                                ),
                                _,
                                _
                            )
                        ) =>
                }
            case Failure(msg) =>
                fail(s"Renaming failed: $msg")
        }
    }

    it should "fail on type mismatch in variable assignment" in {
        val program = Program(
            funcs = Nil,
            main = Stmts(
                List(
                    Decl(IntType, "x", IntLiter(42)(dummyPos))(dummyPos),
                    Assign(
                        Var("x")(dummyPos),
                        BoolLiter(true)(dummyPos)
                    )(dummyPos) // Type mismatch: assigning bool to int
                )
            )
        )
        program.rename() match {
            case Success(renamed) =>
                renamed.checkTypes() match {
                    case Failure(diags) =>
                        assert(
                            diags.exists(
                                _.message.contains(
                                    "Type mismatch in assignment"
                                )
                            )
                        )
                    case Success(_) =>
                        fail(
                            "Expected a type error, but type-checking succeeded"
                        )
                }
            case Failure(msg) =>
                fail(s"Renaming failed: $msg")
        }
    }

    // ========== FUNCTIONS AND EXPRESSIONS ==========

    it should "typecheck a valid function call" in {
        val program = Program(
            funcs = List(
                Func(
                    IntType,
                    "f",
                    List(FuncParam(IntType, "x")(dummyPos)),
                    Stmts(
                        List(
                            Return(Var("x")(dummyPos))(dummyPos)
                        )
                    )
                )(dummyPos)
            ),
            main = Stmts(
                List(
                    Decl(
                        IntType,
                        "result",
                        Call("f", List(IntLiter(42)(dummyPos)))(dummyPos)
                    )(dummyPos)
                )
            )
        )
        program.rename() match {
            case Success(renamed) =>
                renamed.checkTypes() should matchPattern {
                    case Success(
                            TypeCheckResult(
                                Program(
                                    List(
                                        Func(
                                            IntType,
                                            "f",
                                            List(
                                                RenamedParam(
                                                    IntType,
                                                    RenamedVar("x", 1)
                                                )
                                            ),
                                            Stmts(
                                                List(Return(RenamedVar("x", 1)))
                                            )
                                        )
                                    ),
                                    Stmts(
                                        List(
                                            RenamedDecl(
                                                IntType,
                                                RenamedVar("result", 1),
                                                Call("f", List(IntLiter(42)))
                                            )
                                        )
                                    ),
                                    _
                                ),
                                _,
                                _
                            )
                        ) =>
                }
            case Failure(msg) =>
                fail(s"Renaming failed: $msg")
        }
    }

    it should "fail on type mismatch in function return" in {
        val program = Program(
            funcs = List(
                Func(
                    IntType,
                    "f",
                    List(FuncParam(IntType, "x")(dummyPos)),
                    Stmts(
                        List(
                            Return(
                                BoolLiter(true)(dummyPos)
                            )(
                                dummyPos
                            ) // Type mismatch: returning bool instead of int
                        )
                    )
                )(dummyPos)
            ),
            main = Stmts(Nil)
        )
        program.rename() match {
            case Success(renamed) =>
                renamed.checkTypes() match {
                    case Failure(diags) =>
                        assert(
                            diags.exists(
                                _.message.contains(
                                    "In function 'f':"
                                )
                            )
                        )
                        assert(
                            diags.exists(
                                _.message.contains(
                                    "Return type mismatch"
                                )
                            )
                        )
                    case Success(_) =>
                        fail(
                            "Expected a type error, but type-checking succeeded"
                        )
                }
            case Failure(msg) =>
                fail(s"Renaming failed: $msg")
        }
    }

    it should "fail on type mismatch in binary operations" in {
        val program = Program(
            funcs = Nil,
            main = Stmts(
                List(
                    Decl(IntType, "x", IntLiter(42)(dummyPos))(dummyPos),
                    Decl(BoolType, "y", BoolLiter(true)(dummyPos))(dummyPos),
                    Decl(
                        IntType,
                        "z",
                        BinaryOp(
                            BinaryOper.Add,
                            Var("x")(dummyPos),
                            Var("y")(dummyPos)
                        )(dummyPos)
                    )(dummyPos) // Type mismatch: int + bool
                )
            )
        )
        program.rename() match {
            case Success(renamed) =>
                renamed.checkTypes() match {
                    case Failure(diags) =>
                        assert(
                            diags.exists(
                                _.message.contains(
                                    "Binary operator \"+\" expects int operands"
                                )
                            )
                        )
                    case Success(_) =>
                        fail(
                            "Expected a type error, but type-checking succeeded"
                        )
                }
            case Failure(msg) =>
                fail(s"Renaming failed: $msg")
        }
    }

    // ========== SCOPES ==========

    it should "typecheck nested blocks" in {
        val program = Program(
            funcs = Nil,
            main = Stmts(
                List(
                    Decl(IntType, "x", IntLiter(42)(dummyPos))(dummyPos),
                    Block(
                        Stmts(
                            List(
                                Decl(
                                    IntType,
                                    "x",
                                    IntLiter(10)(dummyPos)
                                )(dummyPos), // Shadowing outer 'x'
                                Assign(
                                    Var("x")(dummyPos),
                                    IntLiter(20)(dummyPos)
                                )(dummyPos)
                            )
                        )
                    )(dummyPos),
                    Assign(Var("x")(dummyPos), IntLiter(50)(dummyPos))(
                        dummyPos
                    ) // Refers to outer 'x'
                )
            )
        )
        program.rename() match {
            case Success(renamed) =>
                renamed.checkTypes() should matchPattern {
                    case Success(
                            TypeCheckResult(
                                Program(
                                    Nil,
                                    Stmts(
                                        List(
                                            RenamedDecl(
                                                IntType,
                                                RenamedVar("x", 1),
                                                IntLiter(42)
                                            ),
                                            Block(
                                                Stmts(
                                                    List(
                                                        RenamedDecl(
                                                            IntType,
                                                            RenamedVar("x", 2),
                                                            IntLiter(10)
                                                        ),
                                                        Assign(
                                                            RenamedVar("x", 2),
                                                            IntLiter(20)
                                                        )
                                                    )
                                                )
                                            ),
                                            Assign(
                                                RenamedVar("x", 1),
                                                IntLiter(50)
                                            )
                                        )
                                    ),
                                    _
                                ),
                                _,
                                _
                            )
                        ) =>
                }
            case Failure(msg) =>
                fail(s"Type-checking failed: $msg")
        }
    }

    // ========== CONCURRENCY ==========
    behavior of "The TypeChecker (concurrency)"

    it should "typecheck valid fork" in {
        val program = Program(
            funcs = List(
                Func(
                    IntType,
                    "worker",
                    Nil,
                    Stmts(List(Return(IntLiter(0)(dummyPos))(dummyPos)))
                )(
                    dummyPos
                )
            ),
            main = Stmts(List(Fork(Call("worker", Nil)(dummyPos))(dummyPos)))
        )
        program.rename() match {
            case Success(renamed) =>
                renamed.checkTypes() should matchPattern { case Success(_) => }
            case Failure(msg) => fail(s"Renaming failed: $msg")
        }
    }

    it should "reject fork of unknown function" in {
        val program = Program(
            funcs = Nil,
            main = Stmts(List(Fork(Call("unknown", Nil)(dummyPos))(dummyPos)))
        )
        program.rename() match {
            case Success(renamed) =>
                renamed.checkTypes() match {
                    case Failure(diags) =>
                        diags.exists(
                            _.message.contains("Unknown function")
                        ) shouldBe true
                    case Success(_) => fail("Expected type check to fail")
                }
            case Failure(diags) =>
                // Scope rejects Call to unknown function before typecheck
                diags.exists(_.message.contains("not declared")) shouldBe true
        }
    }

    it should "reject fork of main" in {
        val program = Program(
```

### Test 3: src/test/wacc/CFGTests.scala
Score: 765
Reasons: priority pattern: **/*CFG*; priority pattern: **/*Test*; manual guided tour path; preferred text extension; test file
Type: file (test)
Language: scala
Size: 8733 bytes
```
package wacc

import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers
import diagnostics.ErrPos

class CFGTests extends AnyFlatSpec with Matchers {
    import CFG._

    val dummyPos: ErrPos = (0, 0)

    behavior of "CFG Builder"

    it should "build a CFG for a minimal program with skip" in {
        val program = Program(
            funcs = Nil,
            main = Stmts(List(Skip))
        )
        val cfgProg = CFG(program)
        val mainCfg = cfgProg.main
        val blocks = mainCfg.getBlocksInOrder()

        blocks should have size 1
        val block = blocks.head
        block.stmts should be (List(Skip))
        block.terminator should matchPattern {
            case Terminator.Exit(IntLiter(0)) =>
        }
    }

    it should "build a CFG for a program with multiple linear statements" in {
        val program = Program(
            funcs = Nil,
            main = Stmts(List(
                Assign(Var("x")(dummyPos), IntLiter(1)(dummyPos))(dummyPos),
                Print(Var("x")(dummyPos))(dummyPos),
                Println(StringLiter("done")(dummyPos))(dummyPos)
            ))
        )
        val cfgProg = CFG(program)
        val mainCfg = cfgProg.main
        val blocks = mainCfg.getBlocksInOrder()

        blocks should have size 1
        val block = blocks.head
        block.stmts should have size 3
        block.stmts should be (List(
            Assign(Var("x")(dummyPos), IntLiter(1)(dummyPos))(dummyPos),
            Print(Var("x")(dummyPos))(dummyPos),
            Println(StringLiter("done")(dummyPos))(dummyPos)
        ))
        block.terminator should matchPattern {
            case Terminator.Exit(IntLiter(0)) =>
        }
    }

    it should "build a CFG for a program ending with an explicit exit" in {
        val program = Program(
            funcs = Nil,
            main = Stmts(List(
                Assign(Var("x")(dummyPos), IntLiter(1)(dummyPos))(dummyPos),
                Exit(Var("x")(dummyPos))(dummyPos)
            ))
        )
        val cfgProg = CFG(program)
        val mainCfg = cfgProg.main
        val blocks = mainCfg.getBlocksInOrder()

        blocks should have size 1
        val block = blocks.head
        block.stmts should be (List(
            Assign(Var("x")(dummyPos), IntLiter(1)(dummyPos))(dummyPos)
        ))
        block.terminator should matchPattern {
            case Terminator.Exit(Var("x")) =>
        }
    }

    it should "build a CFG for a simple if-then-else statement" in {
        val program = Program(
            funcs = Nil,
            main = Stmts(List(
                If(
                    BoolLiter(true)(dummyPos),
                    Stmts(List(Assign(Var("x")(dummyPos), IntLiter(1)(dummyPos))(dummyPos))),
                    Stmts(List(Assign(Var("x")(dummyPos), IntLiter(2)(dummyPos))(dummyPos)))
                )(dummyPos),
                Print(Var("x")(dummyPos))(dummyPos)
            ))
        )
        val cfgProg = CFG(program)
        val mainCfg = cfgProg.main
        val blocks = mainCfg.getBlocksInOrder()

        blocks should have size 4
        
        val entryBlock = blocks.find(_.id == mainCfg.entry).get
        entryBlock.terminator should matchPattern {
            case Terminator.Branch(BoolLiter(true), _, _) =>
        }

        val branch = entryBlock.terminator.asInstanceOf[Terminator.Branch[Stmt, Expr]]
        val thenBlock = blocks.find(_.id == branch.trueTarget).get
        val elseBlock = blocks.find(_.id == branch.falseTarget).get

        thenBlock.stmts should be (List(Assign(Var("x")(dummyPos), IntLiter(1)(dummyPos))(dummyPos)))
        elseBlock.stmts should be (List(Assign(Var("x")(dummyPos), IntLiter(2)(dummyPos))(dummyPos)))

        thenBlock.terminator should matchPattern { case Terminator.Jump(_) => }
        elseBlock.terminator should matchPattern { case Terminator.Jump(_) => }
    }

    it should "not connect Return/Exit blocks to subsequent blocks" in {
        val function = Func(
            IntType,
            "f",
            params = Nil,
            body = Stmts(List(
                If(
                    BoolLiter(true)(dummyPos),
                    Stmts(List(Return(IntLiter(1)(dummyPos))(dummyPos))),
                    Stmts(List(Skip))
                )(dummyPos),
                Return(IntLiter(0)(dummyPos))(dummyPos)
            ))
        )(dummyPos)
        val program = Program(funcs = List(function), main = Stmts(List(Skip)))
        val cfgProg = CFG(program)
        val fCfg = cfgProg.funcs("f")
        val blocks = fCfg.getBlocksInOrder()

        val returnBlock1 = blocks.find(_.terminator match {
            case Terminator.Return(IntLiter(1)) => true
            case _ => false
        }).get

        fCfg.getSuccessors(returnBlock1.id) should be (Nil)
    }

    it should "build a CFG for a while loop" in {
        // while x > 0 do x = x - 1 done
        val program = Program(
            funcs = Nil,
            main = Stmts(List(
                Assign(Var("x")(dummyPos), IntLiter(1)(dummyPos))(dummyPos),
                While(
                    BinaryOp(BinaryOper.Gt, Var("x")(dummyPos), IntLiter(0)(dummyPos))(dummyPos),
                    Stmts(List(
                        Assign(Var("x")(dummyPos), BinaryOp(BinaryOper.Sub, Var("x")(dummyPos), IntLiter(1)(dummyPos))(dummyPos))(dummyPos)
                    ))
                )(dummyPos),
                Print(StringLiter("end")(dummyPos))(dummyPos)
            ))
        )
        val cfgProg = CFG(program)
        val mainCfg = cfgProg.main
        val blocks = mainCfg.getBlocksInOrder()

        // Structure:
        // B0: x = 1, Jump(B1)
        // B1 (Cond): Branch(x > 0, B2, B3)
        // B2 (Body): x = x - 1, Jump(B1)  <-- Back edge
        // B3 (Rest): print "end", Exit(0)

        // Find blocks by content/structure
        val entryBlock = blocks.find(_.id == mainCfg.entry).get
        entryBlock.terminator should matchPattern { case Terminator.Jump(_) => }
        
        val condBlockId = entryBlock.terminator.asInstanceOf[Terminator.Jump[Stmt, Expr]].target
        val condBlock = blocks.find(_.id == condBlockId).get
        condBlock.terminator should matchPattern {
            case Terminator.Branch(BinaryOp(BinaryOper.Gt, _, _), _, _) =>
        }

        val branch = condBlock.terminator.asInstanceOf[Terminator.Branch[Stmt, Expr]]
        val bodyBlock = blocks.find(_.id == branch.trueTarget).get
        val restBlock = blocks.find(_.id == branch.falseTarget).get

        // Check back edge from body to cond
        bodyBlock.terminator should matchPattern {
            case Terminator.Jump(target) if target == condBlockId =>
        }

        // Check rest block
        restBlock.stmts should be (List(Print(StringLiter("end")(dummyPos))(dummyPos)))
        restBlock.terminator should matchPattern { case Terminator.Exit(IntLiter(0)) => }
    }

    it should "build a CFG for nested blocks" in {
        // begin
        //   int x = 1;
        //   begin
        //     int y = 2;
        //     x = y
        //   end;
        //   print x
        // end
        val program = Program(
            funcs = Nil,
            main = Stmts(List(
                Decl(IntType, "x", IntLiter(1)(dummyPos))(dummyPos),
                Block(Stmts(List(
                    Decl(IntType, "y", IntLiter(2)(dummyPos))(dummyPos),
                    Assign(Var("x")(dummyPos), Var("y")(dummyPos))(dummyPos)
                )))(dummyPos),
                Print(Var("x")(dummyPos))(dummyPos)
            ))
        )
        val cfgProg = CFG(program)
        val mainCfg = cfgProg.main
        val blocks = mainCfg.getBlocksInOrder()

        // Structure:
        // B0: int x = 1, Jump(B1)
        // B1 (Nested): int y = 2; x = y, Jump(B2)
        // B2: print x, Exit(0)

        blocks should have size 3
        
        val entryBlock = blocks.find(_.id == mainCfg.entry).get
        entryBlock.stmts should have size 1 // Decl x
        entryBlock.terminator should matchPattern { case Terminator.Jump(_) => }

        val nestedBlockId = entryBlock.terminator.asInstanceOf[Terminator.Jump[Stmt, Expr]].target
        val nestedBlock = blocks.find(_.id == nestedBlockId).get
        nestedBlock.stmts should have size 2 // Decl y, Assign
        nestedBlock.terminator should matchPattern { case Terminator.Jump(_) => }

        val restBlockId = nestedBlock.terminator.asInstanceOf[Terminator.Jump[Stmt, Expr]].target
        val restBlock = blocks.find(_.id == restBlockId).get
        restBlock.stmts should have size 1 // Print x
        restBlock.terminator should matchPattern { case Terminator.Exit(IntLiter(0)) => }
    }
}

```

### Test 4: src/test/wacc/LexerTests.scala
Score: 550
Reasons: priority pattern: **/*Test*; manual guided tour path; compiler-pipeline template: lexer; preferred text extension; test file
Type: file (test)
Language: scala
Size: 4659 bytes
```
package wacc

import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers
import parsley.{Success, Failure}

class LexerTests extends AnyFlatSpec with Matchers {
    // Import your lexer and the implicit conversions for string -> parser
    import lexer.*
    import lexer.implicits.given

    behavior of "The Integer Lexer"

    it should "parse valid integers" in {
        intLiteral.parse("123") should matchPattern {
            case Success(x) if x == BigInt(123) =>
        }
        intLiteral.parse("0") should matchPattern {
            case Success(x) if x == BigInt(0) =>
        }
        intLiteral.parse("-123") should matchPattern {
            case Success(x) if x == BigInt(-123) =>
        }
        intLiteral.parse("+42") should matchPattern {
            case Success(x) if x == BigInt(42) =>
        }
    }

    it should "not parse integers with space after sign" in {
        intLiteral.parse("- 5") should matchPattern { case Failure(_) => }
        intLiteral.parse("+ 5") should matchPattern { case Failure(_) => }
    }

    behavior of "The Char and String Lexer"

    it should "parse valid string literals" in {
        stringLiteral.parse("\"hello world\"") should matchPattern {
            case Success("hello world") =>
        }
        stringLiteral.parse("\"\"") should matchPattern { case Success("") => }
    }

    it should "parse string literals with escapes" in {
        stringLiteral.parse("\"hello\\nworld\"") should matchPattern {
            case Success("hello\nworld") =>
        }
        stringLiteral.parse("\"\\t\\0\"") should matchPattern {
            case Success("\t\u0000") =>
        }
        stringLiteral.parse("\"\\\"\"") should matchPattern {
            case Success("\"") =>
        }
    }

    it should "reject non-ascii strings" in {
        stringLiteral.parse("\"£\"") should matchPattern { case Failure(_) => }
    }

    it should "parse valid char literals" in {
        charLiteral.parse("'a'") should matchPattern { case Success('a') => }
        charLiteral.parse("' '") should matchPattern { case Success(' ') => }
    }

    it should "parse char literals with escapes" in {
        charLiteral.parse("'\\n'") should matchPattern { case Success('\n') => }
        charLiteral.parse("'\\''") should matchPattern { case Success('\'') => }
        charLiteral.parse("'\\0'") should matchPattern {
            case Success('\u0000') =>
        }
    }

    it should "fail on invalid string/char literals" in {
        // String must be double quoted
        stringLiteral.parse("'hello'") should matchPattern { case Failure(_) =>
        }
        // Char must be single quoted
        charLiteral.parse("\"a\"") should matchPattern { case Failure(_) => }
        // Char must be single character
        charLiteral.parse("'ab'") should matchPattern { case Failure(_) => }
        // Empty char is invalid
        charLiteral.parse("''") should matchPattern { case Failure(_) => }
    }

    behavior of "The Identifier Lexer"

    it should "parse valid identifiers" in {
        identifier.parse("x") should matchPattern { case Success("x") => }
        identifier.parse("_camelCase123") should matchPattern {
            case Success("_camelCase123") =>
        }
    }

    it should "reject keywords as identifiers" in {
        identifier.parse("while") should matchPattern { case Failure(_) => }
        identifier.parse("begin") should matchPattern { case Failure(_) => }
    }

    behavior of "Token Implicits (Keywords & Operators)"

    it should "parse keywords correctly" in {
        val p = "skip"
        p.parse("skip") should matchPattern { case Success(_) => }
        // Ensure it doesn't match prefix of identifier
        p.parse("skipping") should matchPattern { case Failure(_) => }
    }

    it should "parse operators correctly" in {
        var p = ">="
        p.parse(">=") should matchPattern { case Success(_) => }
        p.parse(">") should matchPattern { case Failure(_) =>
        } // This might depend on order/input

        p = "+"
        p.parse("+") should matchPattern { case Success(_) => }

        p = "len"
        p.parse("len") should matchPattern { case Success(_) => }

        p = "=="
        p.parse("==") should matchPattern { case Success(_) => }
        p.parse("=") should matchPattern { case Failure(_) => }
    }

    behavior of "Comments"

    it should "ignore comments" in {
        // We test this by putting a comment before a token
        val p = "skip"
        fully(p).parse("# This is a comment\nskip") should matchPattern {
            case Success(_) =>
        }
    }
}

```

### Test 5: src/test/wacc/ParserTests.scala
Score: 550
Reasons: priority pattern: **/*Test*; manual guided tour path; compiler-pipeline template: parser; preferred text extension; test file
Type: file (test)
Language: scala
Size: 28372 bytes
Content: truncated
```
package wacc

import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers
import parsley.{Success, Failure}

class ParserTests extends AnyFlatSpec with Matchers {
    import parser.*

    // ========== TYPES ==========
    behavior of "The Type Parser"

    it should "parse int type" in {
        parseType("int") should matchPattern { case Success(IntType) => }
    }

    it should "parse bool type" in {
        parseType("bool") should matchPattern { case Success(BoolType) =>
        }
    }

    it should "parse char type" in {
        parseType("char") should matchPattern { case Success(CharType) =>
        }
    }

    it should "parse string type" in {
        parseType("string") should matchPattern { case Success(StringType) =>
        }
    }

    it should "parse array type" in {
        parseType("int[]") should matchPattern {
            case Success(ArrayType(IntType)) =>
        }
    }

    it should "parse pair type" in {
        parseType("pair(int, bool)") should matchPattern {
            case Success(
                    PairType(
                        PairElemBaseType(IntType),
                        PairElemBaseType(BoolType)
                    )
                ) =>
        }
    }

    it should "reject invalid types" in {
        parseType("double") should matchPattern { case Failure(_) =>
        }
        parseType("True") should matchPattern { case Failure(_) =>
        }
    }

    // Valid: Array of pairs
    it should "parse array of pairs" in {
        parseType("pair(int, int)[]") should matchPattern {
            case Success(
                    ArrayType(
                        PairType(
                            PairElemBaseType(IntType),
                            PairElemBaseType(IntType)
                        )
                    )
                ) =>
        }
    }

    // Valid: Pair containing array of pairs
    it should "parse pair containing array of pairs" in {
        parseType("pair(int, pair(int, int)[])") should matchPattern {
            case Success(
                    PairType(
                        PairElemBaseType(IntType),
                        PairElemArrayType(
                            ArrayType(
                                PairType(
                                    PairElemBaseType(IntType),
                                    PairElemBaseType(IntType)
                                )
                            )
                        )
                    )
                ) =>
        }
    }

    // Invalid: Nested full pair
    it should "reject nested full pair" in {
        parseType("pair(int, pair(int, int))") should matchPattern {
            case Failure(_) =>
        }
    }

    // Valid: Nested erased pair
    it should "parse nested erased pair" in {
        parseType("pair(int, pair)") should matchPattern {
            case Success(
                    PairType(
                        PairElemBaseType(IntType),
                        ErasedPairType
                    )
                ) =>
        }
    }

    // ========== EXPRESSIONS ==========
    behavior of "The Expression Parser"

    it should "not parse keyword as identifier" in {
        parseExpr("skip") should matchPattern { case Failure(_) => }
    }

    // ----- ATOMS -----
    it should "parse int literal" in {
        parseExpr("42") should matchPattern {
            case Success(IntLiter(value)) if value == 42 =>
        }
    }

    it should "parse the minimum 32-bit integer" in {
        parseExpr("-2147483648") should matchPattern {
            case Success(IntLiter(value)) if value == -2147483648 =>
        }
    }

    it should "not parse out-of-bounds integers" in {
        parseExpr("2147483648") should matchPattern { case Failure(_) => }
        parseExpr("-2147483649") should matchPattern { case Failure(_) => }
    }

    it should "parse bool literal" in {
        parseExpr("true") should matchPattern { case Success(BoolLiter(true)) =>
        }
        parseExpr("false") should matchPattern {
            case Success(BoolLiter(false)) =>
        }
    }

    it should "parse char literal" in {
        parseExpr("'a'") should matchPattern { case Success(CharLiter('a')) =>
        }
        parseExpr("'\\n'") should matchPattern {
            case Success(CharLiter('\n')) =>
        }
    }

    it should "not parse invalid char literals" in {
        parseExpr("'ab'") should matchPattern { case Failure(_) => }
        parseExpr("'\\x'") should matchPattern { case Failure(_) => }
        parseExpr("'") should matchPattern { case Failure(_) => }
    }

    it should "parse string literal" in {
        parseExpr("\"hello\"") should matchPattern {
            case Success(StringLiter("hello")) =>
        }
        parseExpr("\"\"") should matchPattern { case Success(StringLiter("")) =>
        }
    }

    it should "reject invalid string literals" in {
        parseExpr("\"unterminated") should matchPattern { case Failure(_) => }
        parseExpr("\"invalid \\x escape\"") should matchPattern {
            case Failure(_) =>
        }
    }

    it should "parse identifier" in {
        parseExpr("x") should matchPattern { case Success(Var("x")) =>
        }
        parseExpr("variableName") should matchPattern {
            case Success(Var("variableName")) =>
        }
    }

    it should "parse pair literal" in {
        parseExpr("null") should matchPattern { case Success(NullLiter()) =>
        }
    }

    it should "parse array element" in {
        parseExpr("array[0]") should matchPattern {
            case Success(ArrayElem("array", List(IntLiter(value))))
                if value == 0 =>
        }
        parseExpr("array[1][2]") should matchPattern {
            case Success(
                    ArrayElem(
                        "array",
                        List(IntLiter(v1), IntLiter(v2))
                    )
                ) if v1 == 1 && v2 == 2 =>
        }
    }

    it should "parse expressions with parentheses" in {
        parseExpr("(42)") should matchPattern {
            case Success(IntLiter(value)) if value == 42 =>
        }
        parseExpr("(true)") should matchPattern {
            case Success(BoolLiter(true)) =>
        }
    }

    // ----- UNARY OPERATORS -----
    it should "parse unary negation" in {
        // Compact negative number -> IntLiter
        parseExpr("-42") should matchPattern {
            case Success(IntLiter(value)) if value == -42 =>
        }
        // Spaced negative number -> UnaryOp(Neg, IntLiter)
        parseExpr("- 42") should matchPattern {
            case Success(UnaryOp(UnaryOper.Neg, IntLiter(value)))
                if value == 42 =>
        }
        // Double negation with space
        parseExpr("- -42") should matchPattern {
            case Success(UnaryOp(UnaryOper.Neg, IntLiter(value)))
                if value == -42 =>
        }
    }

    it should "parse unary negation on variables" in {
        parseExpr("-x") should matchPattern {
            case Success(UnaryOp(UnaryOper.Neg, Var("x"))) =>
        }
    }

    it should "parse logical negation" in {
        parseExpr("!true") should matchPattern {
            case Success(UnaryOp(UnaryOper.Not, BoolLiter(true))) =>
        }
        parseExpr("!(false)") should matchPattern {
            case Success(UnaryOp(UnaryOper.Not, BoolLiter(false))) =>
        }
    }

    it should "parse len operator" in {
        parseExpr("len \"hello\"") should matchPattern {
            case Success(UnaryOp(UnaryOper.Len, StringLiter("hello"))) =>
        }
    }

    it should "parse ord operator" in {
        parseExpr("ord 'a'") should matchPattern {
            case Success(UnaryOp(UnaryOper.Ord, CharLiter('a'))) =>
        }
    }

    it should "parse chr operator" in {
        parseExpr("chr 97") should matchPattern {
            case Success(UnaryOp(UnaryOper.Chr, IntLiter(value)))
                if value == 97 =>
        }
    }

    // ----- BINARY OPERATORS -----
    it should "parse addition" in {
        parseExpr("1 + 2") should matchPattern {
            case Success(
                    BinaryOp(
                        BinaryOper.Add,
                        IntLiter(v1),
                        IntLiter(v2)
                    )
                ) if v1 == 1 && v2 == 2 =>
        }
    }

    it should "parse subtraction" in {
        parseExpr("5 - 3") should matchPattern {
            case Success(
                    BinaryOp(
                        BinaryOper.Sub,
                        IntLiter(v1),
                        IntLiter(v2)
                    )
                ) if v1 == 5 && v2 == 3 =>
        }
    }

    it should "parse binary subtraction correctly" in {
        // 1-1 should be 1 minus 1, not 1 followed by -1 (which would be a syntax error)
        parseExpr("1-1") should matchPattern {
            case Success(
                    BinaryOp(
                        BinaryOper.Sub,
                        IntLiter(v1),
                        IntLiter(v2)
                    )
                ) if v1 == 1 && v2 == 1 =>
        }
    }

    it should "parse multiplication" in {
        parseExpr("3 * 4") should matchPattern {
            case Success(
                    BinaryOp(
                        BinaryOper.Mul,
                        IntLiter(v1),
                        IntLiter(v2)
                    )
                ) if v1 == 3 && v2 == 4 =>
        }
    }

    it should "parse division" in {
        parseExpr("10 / 2") should matchPattern {
            case Success(
                    BinaryOp(
                        BinaryOper.Div,
                        IntLiter(v1),
                        IntLiter(v2)
                    )
                ) if v1 == 10 && v2 == 2 =>
        }
    }

    it should "parse modulo" in {
        parseExpr("10 % 3") should matchPattern {
            case Success(
                    BinaryOp(
                        BinaryOper.Mod,
                        IntLiter(v1),
                        IntLiter(v2)
                    )
                ) if v1 == 10 && v2 == 3 =>
        }
    }

    it should "parse greater than" in {
        parseExpr("5 > 3") should matchPattern {
            case Success(
                    BinaryOp(
                        BinaryOper.Gt,
                        IntLiter(v1),
                        IntLiter(v2)
                    )
                ) if v1 == 5 && v2 == 3 =>
        }
    }

    it should "parse greater than or equal" in {
        parseExpr("5 >= 3") should matchPattern {
            case Success(
                    BinaryOp(
                        BinaryOper.Gte,
                        IntLiter(v1),
                        IntLiter(v2)
                    )
                ) if v1 == 5 && v2 == 3 =>
        }
    }

    it should "parse less than" in {
        parseExpr("3 < 5") should matchPattern {
            case Success(
                    BinaryOp(
                        BinaryOper.Lt,
                        IntLiter(v1),
                        IntLiter(v2)
                    )
                ) if v1 == 3 && v2 == 5 =>
        }
    }

    it should "parse less than or equal" in {
        parseExpr("3 <= 5") should matchPattern {
            case Success(
                    BinaryOp(
                        BinaryOper.Lte,
                        IntLiter(v1),
                        IntLiter(v2)
                    )
                ) if v1 == 3 && v2 == 5 =>
        }
    }

    it should "parse equality" in {
        parseExpr("5 == 5") should matchPattern {
            case Success(
                    BinaryOp(
                        BinaryOper.Eq,
                        IntLiter(v1),
                        IntLiter(v2)
                    )
                ) if v1 == 5 && v2 == 5 =>
        }
    }

    it should "parse inequality" in {
        parseExpr("5 != 3") should matchPattern {
            case Success(
                    BinaryOp(
                        BinaryOper.Neq,
                        IntLiter(v1),
                        IntLiter(v2)
                    )
                ) if v1 == 5 && v2 == 3 =>
        }
    }

    it should "parse logical AND" in {
        parseExpr("true && false") should matchPattern {
            case Success(
                    BinaryOp(
                        BinaryOper.And,
                        BoolLiter(v1),
                        BoolLiter(v2)
                    )
                ) if v1 == true && v2 == false =>
        }
    }

    it should "parse logical OR" in {
        parseExpr("true || false") should matchPattern {
            case Success(
                    BinaryOp(
                        BinaryOper.Or,
                        BoolLiter(v1),
                        BoolLiter(v2)
                    )
                ) if v1 == true && v2 == false =>
        }
    }

    it should "respect multiplication precedence over addition" in {
        parseExpr("2 + 3 * 4") should matchPattern {
            case Success(
                    BinaryOp(
                        BinaryOper.Add,
                        IntLiter(v1),
                        BinaryOp(BinaryOper.Mul, IntLiter(v2), IntLiter(v3))
                    )
                ) if v1 == 2 && v2 == 3 && v3 == 4 =>
        }
    }

    it should "respect division precedence over subtraction" in {
        parseExpr("10 - 8 / 2") should matchPattern {
            case Success(
                    BinaryOp(
                        BinaryOper.Sub,
                        IntLiter(v1),
                        BinaryOp(BinaryOper.Div, IntLiter(v2), IntLiter(v3))
                    )
                ) if v1 == 10 && v2 == 8 && v3 == 2 =>
        }
    }

    it should "respect comparison precedence over logical operators" in {
        parseExpr("1 < 2 && 3 < 4") should matchPattern {
            case Success(
                    BinaryOp(
                        BinaryOper.And,
                        BinaryOp(BinaryOper.Lt, IntLiter(v1), IntLiter(v2)),
                        BinaryOp(BinaryOper.Lt, IntLiter(v3), IntLiter(v4))
                    )
                ) if v1 == 1 && v2 == 2 && v3 == 3 && v4 == 4 =>
        }
    }

    it should "parse left-associative addition" in {
        parseExpr("1 + 2 + 3") should matchPattern {
            case Success(
                    BinaryOp(
                        BinaryOper.Add,
                        BinaryOp(BinaryOper.Add, IntLiter(v1), IntLiter(v2)),
                        IntLiter(v3)
                    )
                ) if v1 == 1 && v2 == 2 && v3 == 3 =>
        }
    }

    it should "parse left-associative multiplication" in {
        parseExpr("2 * 3 * 4") should matchPattern {
            case Success(
                    BinaryOp(
                        BinaryOper.Mul,
                        BinaryOp(BinaryOper.Mul, IntLiter(v1), IntLiter(v2)),
                        IntLiter(v3)
                    )
                ) if v1 == 2 && v2 == 3 && v3 == 4 =>
        }
    }

    it should "parse right-associative logical AND" in {
        parseExpr("true && true && true") should matchPattern {
            case Success(
                    BinaryOp(
                        BinaryOper.And,
                        BoolLiter(v1),
                        BinaryOp(BinaryOper.And, BoolLiter(v2), BoolLiter(v3))
                    )
                ) if v1 == true && v2 == true && v3 == true =>
        }
    }

```

## Selected Folders (12, metadata only)
### Folder 1: src
Score: 1050
Reasons: manual pipeline path; manual guided tour path; folder in tree
Type: folder (folder)
Summary: 自动生成的文件夹条目：src。可以在 manual analysis 中补充该模块的职责说明。

### Folder 2: src/main/wacc
Score: 1040
Reasons: manual pipeline path; manual guided tour path; manual entry exists; folder in tree
Type: folder (folder)
Summary: 自动生成的文件夹条目：src/main/wacc。可以在 manual analysis 中补充该模块的职责说明。

### Folder 3: src/main
Score: 960
Reasons: manual pipeline path; manual guided tour path; folder in tree
Type: folder (folder)
Summary: 自动生成的文件夹条目：src/main。可以在 manual analysis 中补充该模块的职责说明。

### Folder 4: src/test/wacc
Score: 480
Reasons: priority pattern: **/*Test*; manual guided tour path; manual entry exists; folder in tree
Type: folder (folder)
Summary: 自动生成的文件夹条目：src/test/wacc。可以在 manual analysis 中补充该模块的职责说明。

### Folder 5: src/test
Score: 400
Reasons: priority pattern: **/*Test*; manual guided tour path; folder in tree
Type: folder (folder)
Summary: 自动生成的文件夹条目：src/test。可以在 manual analysis 中补充该模块的职责说明。

### Folder 6: src/test/wacc/custom-integration
Score: 400
Reasons: priority pattern: **/*Test*; manual guided tour path; folder in tree
Type: folder (folder)
Summary: 自动生成的文件夹条目：src/test/wacc/custom-integration。可以在 manual analysis 中补充该模块的职责说明。

### Folder 7: src/test/wacc/imports
Score: 400
Reasons: priority pattern: **/*Test*; manual guided tour path; folder in tree
Type: folder (folder)
Summary: 自动生成的文件夹条目：src/test/wacc/imports。可以在 manual analysis 中补充该模块的职责说明。

### Folder 8: src/test/wacc/imports/stdlib
Score: 400
Reasons: priority pattern: **/*Test*; manual guided tour path; folder in tree
Type: folder (folder)
Summary: 自动生成的文件夹条目：src/test/wacc/imports/stdlib。可以在 manual analysis 中补充该模块的职责说明。

### Folder 9: src/main/wacc/backend/arm
Score: 280
Reasons: manual pipeline path; manual guided tour path; manual entry exists; folder in tree
Type: folder (folder)
Summary: 自动生成的文件夹条目：src/main/wacc/backend/arm。可以在 manual analysis 中补充该模块的职责说明。

### Folder 10: src/main/wacc/backend
Score: 200
Reasons: manual pipeline path; manual guided tour path; folder in tree
Type: folder (folder)
Summary: 自动生成的文件夹条目：src/main/wacc/backend。可以在 manual analysis 中补充该模块的职责说明。

### Folder 11: 
Score: 180
Reasons: manual guided tour path; manual entry exists; folder in tree
Type: folder (folder)
Summary: 自动生成的文件夹条目：ROOT。可以在 manual analysis 中补充该模块的职责说明。

### Folder 12: src/main/wacc/interpreter
Score: 10
Reasons: folder in tree
Type: folder (folder)
Summary: 自动生成的文件夹条目：src/main/wacc/interpreter。可以在 manual analysis 中补充该模块的职责说明。

## Target JSON Schema
Return a single JSON object matching this structure:
{
  "projectId": "<string>",
  "generatedAt": "<ISO8601>",
  "source": "ai-draft",
  "provider": "deepseek",
  "model": "<string>",
  "confidence": "draft",
  "projectAnalysis": {
    "overview": "<Chinese overview>",
    "suggestedPipeline": [{ "id": "", "label": "", "path": "", "language": "", "role": "" }],
    "suggestedGuidedTour": [{ "id": "", "label": "", "path": "", "title": "", "description": "" }],
    "technicalDecisions": [{ "title": "", "decision": "", "rationale": "", "impact": "" }],
    "skills": [{ "title": "", "description": "" }]
  },
  "entries": {
    "<path>": {
      "path": "<path>",
      "type": "file" | "folder",
      "summary": "<Chinese summary>",
      "analysis": {
        "purpose": "",
        "responsibilities": [],
        "input": "",
        "output": "",
        "role": "",
        "keyLogic": [],
        "relatedModules": [],
        "relatedPaths": [],
        "usedBy": [],
        "notes": []
      },
      "snippetSuggestions": [
        {
          "id": "parser-entry",
          "filePath": "src/main/wacc/parser.scala",
          "title": "Parser entry point",
          "startLine": 21,
          "endLine": 23,
          "reason": "<Chinese reason>",
          "confidence": "high",
          "annotations": [{ "line": 22, "note": "<Chinese note>" }]
        }
      ]
    }
  },
  "warnings": ["<uncertainty or gaps, e.g. missing CFG stage>"]
}