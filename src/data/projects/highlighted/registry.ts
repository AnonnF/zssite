import { readAnyHighlighted } from "./read-any.highlighted";
import { resumeJdMatcherHighlighted } from "./resume-jd-matcher.highlighted";
import { waccCompilerHighlighted } from "./wacc-compiler.highlighted";

import type { ProjectHighlightData } from "../highlight-types";

export const highlightedRegistry: Record<string, ProjectHighlightData> = {
  "read-any": readAnyHighlighted,
  "resume-jd-matcher": resumeJdMatcherHighlighted,
  "wacc-compiler": waccCompilerHighlighted,
};
