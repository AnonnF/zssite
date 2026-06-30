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
  c: "c",
  h: "c",
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
  c: "c",
  h: "c",
};

const SUPPORTED_LANGUAGES = new Set([
  "scala",
  "typescript",
  "tsx",
  "javascript",
  "jsx",
  "python",
  "markdown",
  "json",
  "css",
  "c",
  "plaintext",
]);

export function resolveHighlightLanguage(
  language?: string,
  path?: string
): string {
  if (language) {
    const normalized = LANGUAGE_ALIASES[language.toLowerCase()];
    if (normalized && SUPPORTED_LANGUAGES.has(normalized)) {
      return normalized;
    }
  }

  if (path?.includes(".")) {
    const extension = path.split(".").pop()?.toLowerCase() ?? "";
    const fromExtension = EXTENSION_LANGUAGE[extension];
    if (fromExtension && SUPPORTED_LANGUAGES.has(fromExtension)) {
      return fromExtension;
    }
  }

  return "plaintext";
}
