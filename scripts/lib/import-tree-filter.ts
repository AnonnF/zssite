import type { GitHubTreeEntry } from "./github/fetchRepo.js";
import {
  getFileExtension,
  isBinaryExtension,
  isSensitivePath,
  pathContainsIgnoredSegment,
  shouldIgnoreFile,
} from "./project-analysis/filters.js";
import type { ScannerConfig } from "./project-analysis/types.js";
import { DEFAULT_SCANNER_CONFIG } from "./project-analysis/types.js";

export type ImportTreeClassification = {
  path: string;
  name: string;
  type: "file" | "folder";
  included: boolean;
  skippedReason?: string;
  shouldDownload: boolean;
  isTooLarge: boolean;
  isBinary: boolean;
  sizeBytes?: number;
  githubBlobSha?: string;
};

function isPathIncluded(relativePath: string, include: string[]): boolean {
  if (include.length === 0) return true;

  const normalized = relativePath.replace(/^\.\//, "");
  return include.some((inc) => {
    const incNorm = inc.replace(/^\.\//, "");
    return (
      normalized === incNorm ||
      normalized.startsWith(`${incNorm}/`) ||
      incNorm.startsWith(`${normalized}/`)
    );
  });
}

function isPathExcluded(relativePath: string, exclude: string[]): boolean {
  const segments = relativePath.split("/");
  for (const segment of segments) {
    if (exclude.some((pattern) => matchExcludePattern(segment, pattern))) {
      return true;
    }
  }

  const fileName = segments[segments.length - 1] ?? relativePath;
  return exclude.some((pattern) => matchExcludePattern(fileName, pattern));
}

function matchExcludePattern(name: string, pattern: string): boolean {
  if (!pattern.includes("*")) {
    return name === pattern;
  }

  if (pattern.startsWith("*.")) {
    return name.endsWith(pattern.slice(1));
  }

  if (pattern.endsWith("*")) {
    return name.startsWith(pattern.slice(0, -1));
  }

  return name === pattern;
}

export function classifyGitHubTreeEntry(
  entry: GitHubTreeEntry,
  config: Partial<ScannerConfig> = {}
): ImportTreeClassification {
  const include = config.include ?? DEFAULT_SCANNER_CONFIG.include;
  const exclude = config.exclude ?? DEFAULT_SCANNER_CONFIG.exclude;
  const maxFileSizeBytes =
    (config.maxFileSizeKb ?? DEFAULT_SCANNER_CONFIG.maxFileSizeKb) * 1024;

  const filePath = entry.path;
  const name = filePath.split("/").pop() ?? filePath;
  const type: "file" | "folder" = entry.type === "tree" ? "folder" : "file";

  if (pathContainsIgnoredSegment(filePath)) {
    return skipEntry(filePath, name, type, "ignored directory segment");
  }

  if (!isPathIncluded(filePath, include)) {
    return skipEntry(filePath, name, type, "not in include paths");
  }

  if (isPathExcluded(filePath, exclude)) {
    return skipEntry(filePath, name, type, "excluded by project config");
  }

  if (type === "folder") {
    return {
      path: filePath,
      name,
      type,
      included: true,
      shouldDownload: false,
      isTooLarge: false,
      isBinary: false,
    };
  }

  if (shouldIgnoreFile(name)) {
    return skipEntry(filePath, name, type, "ignored file name");
  }

  if (isSensitivePath(filePath)) {
    return skipEntry(filePath, name, type, "sensitive path pattern");
  }

  const extension = getFileExtension(name);
  const isBinary = extension ? isBinaryExtension(extension) : false;
  if (isBinary) {
    return {
      path: filePath,
      name,
      type,
      included: false,
      skippedReason: "binary extension",
      shouldDownload: false,
      isTooLarge: false,
      isBinary: true,
      sizeBytes: entry.size,
      githubBlobSha: entry.sha,
    };
  }

  const sizeBytes = entry.size;
  const isTooLarge =
    typeof sizeBytes === "number" && sizeBytes > maxFileSizeBytes;

  return {
    path: filePath,
    name,
    type,
    included: true,
    shouldDownload: !isTooLarge,
    isTooLarge,
    isBinary: false,
    sizeBytes,
    githubBlobSha: entry.sha,
  };
}

function skipEntry(
  filePath: string,
  name: string,
  type: "file" | "folder",
  reason: string
): ImportTreeClassification {
  return {
    path: filePath,
    name,
    type,
    included: false,
    skippedReason: reason,
    shouldDownload: false,
    isTooLarge: false,
    isBinary: false,
  };
}

export function sortDownloadPaths(paths: string[]): string[] {
  return [...paths].sort((a, b) => {
    const aReadme = a.toLowerCase() === "readme.md" ? 0 : 1;
    const bReadme = b.toLowerCase() === "readme.md" ? 0 : 1;
    if (aReadme !== bReadme) return aReadme - bReadme;
    return a.localeCompare(b);
  });
}
