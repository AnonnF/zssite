const EXTENSION_LANGUAGE: Record<string, string> = {
  scala: "scala",
  java: "java",
  ts: "typescript",
  tsx: "tsx",
  js: "javascript",
  jsx: "jsx",
  py: "python",
  c: "c",
  h: "c",
  cpp: "cpp",
  hpp: "cpp",
  md: "markdown",
  json: "json",
  yml: "yaml",
  yaml: "yaml",
  css: "css",
  scss: "css",
  html: "html",
  sh: "bash",
  sql: "sql",
  rs: "rust",
  go: "go",
};

const SPECIAL_FILENAMES: Record<string, string> = {
  "README.md": "markdown",
  Dockerfile: "dockerfile",
  Makefile: "makefile",
  "docker-compose.yml": "yaml",
  "docker-compose.yaml": "yaml",
};

export function resolveLanguageFromPath(relativePath: string): string {
  const baseName = relativePath.split("/").pop() ?? relativePath;

  const special = SPECIAL_FILENAMES[baseName];
  if (special) return special;

  const dotIndex = baseName.lastIndexOf(".");
  if (dotIndex <= 0) return "plaintext";

  const extension = baseName.slice(dotIndex + 1).toLowerCase();
  return EXTENSION_LANGUAGE[extension] ?? "plaintext";
}
