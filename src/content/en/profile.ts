import { profile as profileZh, type Profile } from "../profile";

export const profileEn: Profile = {
  ...profileZh,
  tagline:
    "Building on operating systems, compilers and computer architecture, I focus on designing and implementing backend engineering and LLM / Agent application systems.",
  introduction:
    "MEng Computing student at Imperial College London with a solid foundation in operating systems, compilers and computer architecture. In summer 2026 I took part in migrating an internal enterprise LLM / Agent platform from Python to Java (Spring Boot, Spring AI), working on SSE protocol compatibility, request-level cancellation and the Workflow runtime. I have also built a Pintos kernel, a WACC compiler, an ARMv8 emulator and assembler, a RAG agent and an AI communication practice platform, and I like to break complex systems down into verifiable engineering modules.",
};
