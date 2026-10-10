import { resumePage as resumeZh } from "../resume";
import { profileEn } from "./profile";

export const resumePageEn = {
  ...resumeZh,
  title: "About Me",
  summary: profileEn.introduction,
  directions: profileEn.directions,
  experience: [
    {
      ...resumeZh.experience[0],
      context: "Internal LLM / Agent platform · Python → Java migration",
      summary:
        "Took part in migrating an enterprise internal LLM / Agent platform from Python to Java, using Spring Boot and Spring AI, with a focus on SSE protocol compatibility and Workflow runtime capabilities on the Java side.",
      highlights: [
        {
          title: "Request-level cancellation",
          detail:
            "Redesigned cancellation from session-level control to request-level cancellation based on request_id.",
        },
        {
          title: "SSE termination logic",
          detail:
            "Reworked SSE termination so streams end cleanly after both cancellations and runtime errors.",
        },
        {
          title: "Workflow runtime port",
          detail:
            "Ported the core Python YAML Workflow runtime to Java, supporting heterogeneous execution nodes and parallel tasks.",
        },
        {
          title: "Compatibility and regression testing",
          detail:
            "Resolved DashScope Tool Calling compatibility issues and wrote 49 protocol regression tests to verify behavioural parity.",
        },
      ],
    },
  ],
  education: [
    {
      ...resumeZh.education[0],
      note: "3-year bachelor's + 1-year master's · Bachelor's stage expected to complete 2027.06",
    },
    ...resumeZh.education.slice(1),
  ],
  coursework: [
    "Graph Theory & Algorithms",
    "Computer Systems & Architecture",
    "Operating Systems",
    "Compilers",
    "Machine Learning",
    "Software Engineering Design",
    "Programming Practice",
    "Discrete Mathematics",
    "Linear Algebra",
  ],
  skills: resumeZh.skills.map((category) =>
    category.id === "language"
      ? {
          ...category,
          items: ["IELTS 7.5 (L 8 · R 8 · W 6.5 · S 7.5)", "Chinese · English"],
        }
      : category
  ),
};
