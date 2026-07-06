export const HIGHLIGHT_THEME = "github-dark";

const LANGUAGE_ALIASES: Record<string, string> = {
  scala: "scala",
  typescript: "typescript",
  ts: "typescript",
  tsx: "tsx",
  javascript: "javascript",
  js: "javascript",
  jsx: "jsx",
  python: "python",
  py: "python",
  markdown: "markdown",
  md: "markdown",
  json: "json",
  css: "css",
  html: "html",
  htm: "html",
  c: "c",
  h: "c",
  cpp: "cpp",
  cc: "cpp",
  hpp: "cpp",
  java: "java",
  yaml: "yaml",
  yml: "yaml",
  bash: "bash",
  sh: "bash",
  shell: "bash",
  makefile: "makefile",
  plaintext: "plaintext",
  text: "plaintext",
  txt: "plaintext",
};

const EXTENSION_LANGUAGE: Record<string, string> = {
  scala: "scala",
  ts: "typescript",
  tsx: "tsx",
  js: "javascript",
  jsx: "jsx",
  py: "python",
  md: "markdown",
  json: "json",
  css: "css",
  html: "html",
  htm: "html",
  c: "c",
  h: "c",
  cpp: "cpp",
  cc: "cpp",
  hpp: "cpp",
  java: "java",
  yml: "yaml",
  yaml: "yaml",
  sh: "bash",
};

export const SUPPORTED_HIGHLIGHT_LANGUAGES = [
  "scala",
  "typescript",
  "tsx",
  "javascript",
  "jsx",
  "python",
  "c",
  "cpp",
  "java",
  "markdown",
  "json",
  "yaml",
  "css",
  "html",
  "bash",
  "makefile",
  "plaintext",
] as const;

export type SupportedHighlightLanguage =
  (typeof SUPPORTED_HIGHLIGHT_LANGUAGES)[number];

export function resolveHighlightLanguage(
  language?: string,
  path?: string
): SupportedHighlightLanguage {
  if (language) {
    const normalized = LANGUAGE_ALIASES[language.toLowerCase()];
    if (
      normalized &&
      SUPPORTED_HIGHLIGHT_LANGUAGES.includes(
        normalized as SupportedHighlightLanguage
      )
    ) {
      return normalized as SupportedHighlightLanguage;
    }
  }

  if (path?.includes(".")) {
    const extension = path.split(".").pop()?.toLowerCase() ?? "";
    const fromExtension = EXTENSION_LANGUAGE[extension];
    if (
      fromExtension &&
      SUPPORTED_HIGHLIGHT_LANGUAGES.includes(
        fromExtension as SupportedHighlightLanguage
      )
    ) {
      return fromExtension as SupportedHighlightLanguage;
    }
  }

  return "plaintext";
}
