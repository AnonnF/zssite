import type { ProjectAnalyzerGeneratedData } from "../types";

type GeneratedLoader = () => ProjectAnalyzerGeneratedData;

const generatedLoaders: Record<string, GeneratedLoader> = {
  "read-any": () =>
    require("./read-any.generated").readAnyGenerated as ProjectAnalyzerGeneratedData,
  "resume-jd-matcher": () =>
    require("./resume-jd-matcher.generated")
      .resumeJdMatcherGenerated as ProjectAnalyzerGeneratedData,
  "wacc-compiler": () =>
    require("./wacc-compiler.generated")
      .waccCompilerGenerated as ProjectAnalyzerGeneratedData,
};

const generatedCache = new Map<string, ProjectAnalyzerGeneratedData>();

export function getGeneratedAnalyzer(
  projectId: string
): ProjectAnalyzerGeneratedData | undefined {
  const cached = generatedCache.get(projectId);
  if (cached) return cached;

  const loader = generatedLoaders[projectId];
  if (!loader) return undefined;

  const data = loader();
  generatedCache.set(projectId, data);
  return data;
}

export function hasGeneratedAnalyzer(projectId: string): boolean {
  return projectId in generatedLoaders;
}

/** @deprecated Prefer getGeneratedAnalyzer — kept for call-site compatibility. */
export const generatedRegistry: Record<string, ProjectAnalyzerGeneratedData> =
  new Proxy({} as Record<string, ProjectAnalyzerGeneratedData>, {
    get(_target, prop: string | symbol) {
      if (typeof prop !== "string") return undefined;
      return getGeneratedAnalyzer(prop);
    },
    has(_target, prop: string | symbol) {
      return typeof prop === "string" && hasGeneratedAnalyzer(prop);
    },
    ownKeys() {
      return Object.keys(generatedLoaders);
    },
    getOwnPropertyDescriptor(_target, prop: string | symbol) {
      if (typeof prop !== "string" || !hasGeneratedAnalyzer(prop)) {
        return undefined;
      }
      return {
        configurable: true,
        enumerable: true,
        get: () => getGeneratedAnalyzer(prop),
      };
    },
  });
