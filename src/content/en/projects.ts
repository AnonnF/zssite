import type { PortfolioProject } from "../projects";

/** Translatable fields only; structural data (type, techStack, ref, ...) is shared with the zh source. */
export type ProjectTranslation = Pick<
  PortfolioProject,
  | "subtitle"
  | "context"
  | "summary"
  | "highlights"
  | "responsibilities"
  | "challenges"
  | "skillsDemonstrated"
>;

export const projectTranslationsEn: Record<string, ProjectTranslation> = {
  bridgetalk: {
    subtitle: "AI-powered communication practice platform",
    context: "Imperial College London · Team Project",
    summary:
      "A team-built AI communication practice platform. I mainly worked on the backend APIs and the practice-flow features, and integrated an LLM to generate personalised feedback.",
    highlights: [
      "Designed and implemented RESTful APIs around practice records and scoring workflows",
      "Integrated an LLM to generate personalised feedback on practice results",
      "Vue 3 + TypeScript frontend with an Express backend; Supabase for data and auth-related capabilities",
      "Set up GitHub Actions continuous integration and a Vercel deployment pipeline",
    ],
    responsibilities: [
      "Owned the backend APIs and practice-flow features",
      "Implemented AI-related endpoint orchestration and frontend–backend collaboration",
      "Set up basic tests and continuous integration",
      "Contributed to product information architecture and Dashboard interaction design",
    ],
    challenges: [
      "Designing latency and error feedback along the AI request path",
      "Keeping state consistent and API contracts maintained across modules",
    ],
    skillsDemonstrated: [
      "Backend API design",
      "Productising AI",
      "DevOps",
      "Teamwork",
    ],
  },
  "rag-agent": {
    subtitle: "Knowledge-base Q&A agent",
    context: "Personal Project · AI Engineering",
    summary:
      "A RAG agent built with LangChain and LangGraph that integrates document retrieval into multi-turn Q&A, with task routing and persistent state.",
    highlights: [
      "Chunks PDF / DOCX / Markdown documents and indexes them with OpenAI Embeddings",
      "Combines Similarity Search, MMR and Vectorstore Retriever for retrieval",
      "Organises the agent workflow with LangGraph State / Node / Edge, implements task routing, and persists state with a SQLite Checkpointer",
    ],
    responsibilities: [
      "Designed the RAG pipeline and retrieval strategy",
      "Implemented agent state persistence and thread-level session management",
      "Iterated on recall quality and answer stability",
    ],
    challenges: [
      "Balancing chunking strategy against retrieval precision and diversity",
      "State consistency and failure recovery in multi-step agent flows",
    ],
    skillsDemonstrated: [
      "RAG systems",
      "Agent design",
      "LLM application engineering",
    ],
  },
  "wacc-compiler": {
    subtitle:
      "A complete team-built compiler: from source parsing to ARM code generation",
    context: "Imperial College London · Compiler Course · Team Project",
    summary:
      "Worked with teammates to build a complete compiler for the WACC language, from source parsing to ARM code generation. My contributions centred on semantic analysis, control-flow analysis and backend code generation, plus extensions such as constant propagation, an interpreter and module imports.",
    highlights: [
      "Collaboratively delivered the full compilation pipeline from source parsing to ARM code generation",
      "Worked on semantic analysis, control-flow analysis and backend code generation",
      "Extended the compiler with constant propagation, an interpreter and module imports, and added circular-dependency detection to improve modularity and testability",
    ],
    responsibilities: [
      "Contributed to the design and implementation of semantic analysis and control-flow analysis (CFG)",
      "Contributed to ARM backend code generation, handling function calls, stack frames and runtime layout",
      "Worked with the team on extensions: constant propagation, interpreter, module imports and circular-dependency detection",
    ],
    challenges: [
      "Keeping the AST and type inference consistent under complex syntactic structures",
      "Generating correct code under the calling convention and stack-frame layout",
      "Detecting circular dependencies in module-import scenarios",
    ],
    skillsDemonstrated: [
      "Compiler theory",
      "Language implementation",
      "Code generation",
      "Teamwork",
    ],
  },
  pintos: {
    subtitle: "Operating system kernel development",
    context: "Imperial College London · OS Course Project",
    summary:
      "Extended the Pintos teaching OS with user-program support, implementing system calls, process management and safe user-memory access, plus priority scheduling with recursive priority donation.",
    highlights: [
      "Implemented 12+ system calls, including exec, wait, exit, open, read, write and close",
      "Handled process lifecycle management, file access and safe user-memory access",
      "Implemented priority scheduling and recursive priority donation to resolve priority inversion, using locks and semaphores to synchronise interdependent threads",
      "Dealt with synchronisation and resource cleanup across kernel/user mode transitions",
    ],
    responsibilities: [
      "Designed and implemented the user-program subsystem and system-call dispatch",
      "Implemented priority scheduling and recursive priority donation",
      "Wrote kernel test cases and debugged concurrency and resource-leak issues",
      "Studied the Pintos documentation and reference implementation, iterating on edge-case handling",
    ],
    challenges: [
      "Validating user-space pointers and safely copying to kernel buffers",
      "Managing file descriptors and exit status across multiple processes",
      "Synchronisation correctness under priority inversion and nested donation",
    ],
    skillsDemonstrated: [
      "Systems programming",
      "Kernel debugging",
      "Process model",
      "Concurrency and synchronisation",
    ],
  },
  "armv8-emulator-assembler": {
    subtitle: "Emulator and assembler for an A64 instruction subset",
    context: "Imperial College London · Systems Project",
    summary:
      "Implemented in C an emulator and a two-pass assembler for an A64 instruction subset, supporting assembly parsing, machine-code generation, simulated execution and automated result verification.",
    highlights: [
      "Implemented decoding and the main execution loop for an A64 instruction subset",
      "Built a two-pass assembler covering assembly parsing and machine-code generation",
      "Designed the general-purpose register file and memory-map abstractions, and verified execution results with automated tests",
    ],
    responsibilities: [
      "Implemented instruction-encoding parsing and the simulated execution environment",
      "Wrote the assembler's lexical / syntactic processing and output format",
      "Verified instruction semantics and edge-case behaviour with test programs",
    ],
    challenges: [
      "Decoding correctness across diverse instruction formats",
      "Observability of emulator state and error localisation",
    ],
    skillsDemonstrated: [
      "ISA understanding",
      "Low-level toolchains",
      "C engineering",
    ],
  },
  "drone-llm-research": {
    subtitle: "Controlling drones with large language models",
    context: "Research Project",
    summary:
      "An exploration of controlling drones with large language models: driving drone behaviour from natural-language instructions, and studying how path-planning algorithms can be combined with LLMs.",
    highlights: [
      "Surveyed drone path-planning algorithms and the limits of LLM reasoning",
      "Designed an intermediate representation for interaction between algorithm output and the language model",
      "Validated the feasibility of mapping keywords / instructions to path plans",
    ],
    responsibilities: [
      "Clarified the problem definition and experimental hypotheses",
      "Implemented a prototype pipeline and recorded interim results",
      "Wrote up the experiments and conclusions in a paper-style format",
    ],
    challenges: [
      "Aligning deterministic algorithms with LLM-generated output",
      "Engineering boundaries when turning a research prototype into a verifiable system",
    ],
    skillsDemonstrated: [
      "Algorithm research",
      "LLM applications",
      "Cross-domain integration",
    ],
  },
  "pytorch-cifar-10": {
    subtitle: "Image classification with convolutional neural networks",
    context: "Personal Project · Machine Learning",
    summary:
      "Trained a CNN image classifier on CIFAR-10 with PyTorch, covering the data pipeline, training loop and performance evaluation.",
    highlights: [
      "Implemented reusable training / validation loops with metric logging",
      "Designed the CNN architecture and tuned hyperparameters",
      "Reached roughly 85% classification accuracy on the test set",
    ],
    responsibilities: [
      "Built the data loading, augmentation and batching pipeline",
      "Experimented with different network architectures and regularisation strategies",
      "Recorded results and analysed overfitting and convergence behaviour",
    ],
    challenges: [
      "Controlling overfitting on a small image dataset",
      "Training stability and experiment reproducibility",
    ],
    skillsDemonstrated: [
      "Deep learning",
      "PyTorch",
      "Experiment design",
    ],
  },
  "unity-rpg": {
    subtitle: "Role-playing game prototype",
    context: "Personal Project · Game Dev",
    summary:
      "A 2D RPG prototype built in Unity, covering character control, combat logic, level interaction and FSM-based game state management.",
    highlights: [
      "Implemented character movement, animation and input handling",
      "Built the combat system and basic UI flow",
      "Organised character and level logic with finite state machines",
    ],
    responsibilities: [
      "Designed the core gameplay loop and scene interaction",
      "Implemented character, enemy and trigger components",
      "Debugged collisions, animation and game-state transitions",
    ],
    challenges: [
      "FSM extensibility and decoupling gameplay modules",
      "Stability of 2D collision and combat timing",
    ],
    skillsDemonstrated: [
      "Game development",
      "C#",
      "Interaction design",
    ],
  },
};
