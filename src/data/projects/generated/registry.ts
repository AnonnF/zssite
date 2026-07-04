import { resumeJdMatcherGenerated } from "./resume-jd-matcher.generated";
import { waccCompilerGenerated } from "./wacc-compiler.generated";

import type { ProjectAnalyzerGeneratedData } from "../types";

export const generatedRegistry: Record<string, ProjectAnalyzerGeneratedData> = {
  "resume-jd-matcher": resumeJdMatcherGenerated,
  "wacc-compiler": waccCompilerGenerated,
};
