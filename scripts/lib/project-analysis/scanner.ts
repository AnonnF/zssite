import fs from "node:fs";
import path from "node:path";
import type {
  ProjectAnalysisEntry,
  ProjectAnalyzerGeneratedData,
  ProjectAnalyzerGeneratedMetadata,
  ProjectTreeNode,
} from "../../../src/data/projects/types.js";
import { GENERATED_REVIEW } from "../../../src/data/projects/reviewMeta.js";
import type { ScannerConfig } from "./types.js";
import {
  getFileExtension,
  isBinaryExtension,
  isPreferredTextExtension,
  shouldIgnoreDir,
  shouldIgnoreFile,
} from "./filters.js";
import { resolveLanguageFromPath } from "./language.js";

export type ScanCounters = {
  fileCount: number;
  folderCount: number;
  includedFileCount: number;
  skippedFileCount: number;
};

export type ScanProjectResult = {
  data: ProjectAnalyzerGeneratedData;
  counters: ScanCounters;
  outputRelativePath: string;
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

function sortTreeNodes(nodes: ProjectTreeNode[]): ProjectTreeNode[] {
  return [...nodes]
    .sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === "folder" ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    })
    .map((node) =>
      node.children
        ? { ...node, children: sortTreeNodes(node.children) }
        : node
    );
}

function folderSummary(relativePath: string): string {
  const label = relativePath || "ROOT";
  return `自动生成的文件夹条目：${label}。可以在 manual analysis 中补充该模块的职责说明。`;
}

function fileSummary(name: string, tooLarge: boolean): string {
  if (tooLarge) {
    return "File is too large for inline preview.";
  }
  return `自动生成的文件条目：${name}。可以在 manual analysis 中补充该文件的作用说明。`;
}

function isLikelyTextFile(absolutePath: string): boolean {
  const fd = fs.openSync(absolutePath, "r");
  try {
    const buffer = Buffer.alloc(8192);
    const bytesRead = fs.readSync(fd, buffer, 0, 8192, 0);
    for (let i = 0; i < bytesRead; i += 1) {
      if (buffer[i] === 0) return false;
    }
    return bytesRead > 0;
  } finally {
    fs.closeSync(fd);
  }
}

function readFileContent(
  absolutePath: string,
  maxFileSizeBytes: number,
  extension: string,
  readCode: boolean
): { code?: string; tooLarge?: boolean } {
  if (!readCode) return {};

  const stat = fs.statSync(absolutePath);
  if (stat.size > maxFileSizeBytes) {
    return { tooLarge: true };
  }

  if (isBinaryExtension(extension)) {
    return {};
  }

  if (!isPreferredTextExtension(extension) && !isLikelyTextFile(absolutePath)) {
    return {};
  }

  return { code: fs.readFileSync(absolutePath, "utf8") };
}

function buildFileEntry(
  relativePath: string,
  name: string,
  absolutePath: string,
  config: ScannerConfig,
  counters: ScanCounters
): ProjectAnalysisEntry {
  counters.fileCount += 1;
  counters.includedFileCount += 1;

  const extension = getFileExtension(name);
  const language = resolveLanguageFromPath(relativePath);
  const sizeBytes = fs.statSync(absolutePath).size;
  const maxFileSizeBytes = config.maxFileSizeKb * 1024;
  const { code, tooLarge } = readFileContent(
    absolutePath,
    maxFileSizeBytes,
    extension,
    config.readCode
  );

  const entry: ProjectAnalysisEntry = {
    path: relativePath,
    type: "file",
    title: name,
    summary: fileSummary(name, Boolean(tooLarge)),
    language,
    sizeBytes,
    generated: true,
    review: GENERATED_REVIEW,
  };

  if (tooLarge) {
    entry.tooLarge = true;
  } else if (code !== undefined) {
    entry.code = code;
  }

  return entry;
}

function buildFolderEntry(relativePath: string, name: string): ProjectAnalysisEntry {
  return {
    path: relativePath,
    type: "folder",
    title: name,
    summary: folderSummary(relativePath),
    generated: true,
    review: GENERATED_REVIEW,
  };
}

function scanDirectory(
  snapshotRoot: string,
  relativePath: string,
  name: string,
  config: ScannerConfig,
  counters: ScanCounters,
  entries: Record<string, ProjectAnalysisEntry>
): ProjectTreeNode {
  const absolutePath = path.join(snapshotRoot, relativePath);
  counters.folderCount += 1;
  entries[relativePath] = buildFolderEntry(relativePath, name);

  const dirents = fs.readdirSync(absolutePath, { withFileTypes: true });
  const children: ProjectTreeNode[] = [];

  for (const dirent of dirents) {
    const childName = dirent.name;
    const childRelativePath = relativePath
      ? `${relativePath}/${childName}`
      : childName;

    if (!isPathIncluded(childRelativePath, config.include)) {
      continue;
    }

    if (dirent.isDirectory()) {
      if (shouldIgnoreDir(childName, config.exclude)) {
        counters.skippedFileCount += 1;
        continue;
      }

      children.push(
        scanDirectory(
          snapshotRoot,
          childRelativePath,
          childName,
          config,
          counters,
          entries
        )
      );
      continue;
    }

    if (!dirent.isFile()) {
      counters.skippedFileCount += 1;
      continue;
    }

    if (shouldIgnoreFile(childName, config.exclude)) {
      counters.skippedFileCount += 1;
      continue;
    }

    const childAbsolutePath = path.join(snapshotRoot, childRelativePath);
    entries[childRelativePath] = buildFileEntry(
      childRelativePath,
      childName,
      childAbsolutePath,
      config,
      counters
    );

    children.push({
      name: childName,
      path: childRelativePath,
      type: "file",
    });
  }

  return {
    name,
    path: relativePath,
    type: "folder",
    children: sortTreeNodes(children),
  };
}

export function scanProjectSnapshot(
  repoRoot: string,
  projectId: string,
  config: ScannerConfig
): ScanProjectResult {
  const snapshotRoot = path.join(repoRoot, "project-snapshots", projectId);
  const counters: ScanCounters = {
    fileCount: 0,
    folderCount: 0,
    includedFileCount: 0,
    skippedFileCount: 0,
  };
  const entries: Record<string, ProjectAnalysisEntry> = {};

  const rootNode = scanDirectory(
    snapshotRoot,
    "",
    "ROOT",
    config,
    counters,
    entries
  );

  const metadata: ProjectAnalyzerGeneratedMetadata = {
    generatedAt: new Date().toISOString(),
    source: "project-snapshots",
    projectId,
    rootDir: `project-snapshots/${projectId}`,
    fileCount: counters.fileCount,
    folderCount: counters.folderCount,
    includedFileCount: counters.includedFileCount,
    skippedFileCount: counters.skippedFileCount,
  };

  const outputRelativePath = `src/data/projects/generated/${projectId}.generated.ts`;

  return {
    data: {
      projectId,
      metadata,
      tree: [rootNode],
      entries,
    },
    counters,
    outputRelativePath,
  };
}
