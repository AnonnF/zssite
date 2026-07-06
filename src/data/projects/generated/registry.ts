import { readAnyGenerated } from "./read-any.generated";
import { resumeJdMatcherGenerated } from "./resume-jd-matcher.generated";
import { waccCompilerGenerated } from "./wacc-compiler.generated";

import type { ProjectAnalyzerGeneratedData } from "../types";

export const generatedRegistry: Record<string, ProjectAnalyzerGeneratedData> = {
  "read-any": readAnyGenerated,
  "resume-jd-matcher": resumeJdMatcherGenerated,
  "wacc-compiler": waccCompilerGenerated,
};
