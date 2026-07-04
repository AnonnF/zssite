import { resumeJdMatcherHighlighted } from "./resume-jd-matcher.highlighted";
import { waccCompilerHighlighted } from "./wacc-compiler.highlighted";

import type { ProjectHighlightData } from "../highlight-types";

export const highlightedRegistry: Record<string, ProjectHighlightData> = {
  "resume-jd-matcher": resumeJdMatcherHighlighted,
  "wacc-compiler": waccCompilerHighlighted,
};
