import type { ProjectManualAnalysisData } from "../types";
import { waccCompilerAnalysis } from "../wacc-compiler.analysis";

export const manualRegistry: Record<string, ProjectManualAnalysisData> = {
  "wacc-compiler": waccCompilerAnalysis,
};
