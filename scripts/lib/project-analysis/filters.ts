export const DEFAULT_IGNORE_DIRS = new Set([
  ".git",
  "node_modules",
  "dist",
  "build",
  "target",
  "out",
  ".next",
  ".vercel",
  "coverage",
  "__pycache__",
  ".pytest_cache",
  ".idea",
  ".vscode",
  ".DS_Store",
  "vendor",
  ".gradle",
  ".metals",
  ".bloop",
]);

export const DEFAULT_IGNORE_FILES = new Set([
  ".env",
  ".env.local",
  ".env.production",
  ".env.development",
  "package-lock.json",
  "yarn.lock",
  "pnpm-lock.yaml",
  "bun.lockb",
]);

export const DEFAULT_IGNORE_FILE_PATTERNS = [
  "*.pem",
  "*.key",
  "*.crt",
  "*.p12",
  "*.sqlite",
  "*.db",
];

export const BINARY_EXTENSIONS = new Set([
  "png",
  "jpg",
  "jpeg",
  "gif",
  "webp",
  "ico",
  "pdf",
  "zip",
  "tar",
  "gz",
  "7z",
  "mp4",
  "mov",
  "mp3",
  "wav",
  "class",
  "jar",
  "exe",
  "dll",
  "so",
  "dylib",
]);

export const PREFERRED_TEXT_EXTENSIONS = new Set([
  "ts",
  "tsx",
  "js",
  "jsx",
  "py",
  "java",
  "scala",
  "c",
  "h",
  "cpp",
  "hpp",
  "md",
  "json",
  "yml",
  "yaml",
  "css",
  "scss",
  "html",
  "sh",
  "sql",
  "rs",
  "go",
]);

export function matchPattern(name: string, pattern: string): boolean {
  if (!pattern.includes("*")) {
    return name === pattern;
  }

  if (pattern.startsWith("*.")) {
    const extension = pattern.slice(1);
    return name.endsWith(extension);
  }

  if (pattern.endsWith("*")) {
    return name.startsWith(pattern.slice(0, -1));
  }

  return name === pattern;
}

export function shouldIgnoreDir(
  name: string,
  extraExclude: string[] = []
): boolean {
  if (DEFAULT_IGNORE_DIRS.has(name)) return true;
  return extraExclude.some((pattern) => matchPattern(name, pattern));
}

export function shouldIgnoreFile(
  name: string,
  extraExclude: string[] = []
): boolean {
  if (DEFAULT_IGNORE_FILES.has(name)) return true;
  if (name.startsWith(".env")) return true;

  for (const pattern of DEFAULT_IGNORE_FILE_PATTERNS) {
    if (matchPattern(name, pattern)) return true;
  }

  return extraExclude.some((pattern) => matchPattern(name, pattern));
}

export function isBinaryExtension(extension: string): boolean {
  return BINARY_EXTENSIONS.has(extension.toLowerCase());
}

export function isPreferredTextExtension(extension: string): boolean {
  return PREFERRED_TEXT_EXTENSIONS.has(extension.toLowerCase());
}

export function getFileExtension(name: string): string {
  const dotIndex = name.lastIndexOf(".");
  if (dotIndex <= 0) return "";
  return name.slice(dotIndex + 1).toLowerCase();
}
