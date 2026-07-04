import process from "node:process";

export type DownloadProgressOptions = {
  totalFiles: number;
  estimatedTotalBytes: number | null;
  repoLabel: string;
  noProgress?: boolean;
  verbose?: boolean;
  refreshIntervalMs?: number;
  nonTtyLogEvery?: number;
};

export type DownloadProgressSummary = {
  filesSelected: number;
  downloaded: number;
  skipped: number;
  failed: number;
  downloadedBytes: number;
  durationMs: number;
  averageSpeed: number;
  failedFiles: Array<{ path: string; reason: string }>;
};

type FileState = {
  index: number;
  path: string;
  expectedBytes: number | null;
  downloadedBytes: number;
  startedAt: number;
};

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) {
    return "0 B";
  }

  if (bytes < 1024) {
    return `${Math.round(bytes)} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

export function formatDuration(ms: number): string {
  if (!Number.isFinite(ms) || ms < 0) {
    return "00:00";
  }

  const totalSeconds = Math.max(0, Math.round(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function formatSpeed(bytesPerSecond: number): string {
  if (!Number.isFinite(bytesPerSecond) || bytesPerSecond <= 0) {
    return "—";
  }

  return `${formatBytes(bytesPerSecond)}/s`;
}

function formatBytesTotal(current: number, total: number | null): string {
  if (total === null || total <= 0) {
    return `${formatBytes(current)} / unknown`;
  }

  return `${formatBytes(current)} / ${formatBytes(total)}`;
}

export function sumEstimatedBytes(
  sizes: Array<number | null | undefined>
): number | null {
  let sum = 0;
  let hasAny = false;

  for (const size of sizes) {
    if (typeof size === "number" && size >= 0) {
      sum += size;
      hasAny = true;
    }
  }

  return hasAny ? sum : null;
}

export function createDownloadProgressReporter(
  options: DownloadProgressOptions
): {
  printBatchHeader: () => void;
  startFile: (index: number, path: string, expectedBytes: number | null) => void;
  updateFileBytes: (downloadedBytes: number, totalBytes?: number | null) => void;
  markFileDone: (bytesWritten: number) => void;
  markFileSkipped: () => void;
  markFileFailed: (path: string, index: number, reason: string) => void;
  warn: (message: string) => void;
  finish: () => DownloadProgressSummary;
} {
  const refreshIntervalMs = options.refreshIntervalMs ?? 200;
  const nonTtyLogEvery = options.nonTtyLogEvery ?? 25;
  const isTty =
    Boolean(process.stdout.isTTY) &&
    !process.env.CI &&
    !options.noProgress;
  const verbose = Boolean(options.verbose);
  const suppressLiveOutput = Boolean(options.noProgress);

  const batchStartedAt = Date.now();
  let currentFile: FileState | null = null;
  let downloadedCount = 0;
  let skippedCount = 0;
  let failedCount = 0;
  let totalDownloadedBytes = 0;
  let completedDownloadedBytes = 0;
  let failedFiles: Array<{ path: string; reason: string }> = [];
  let progressLineCount = 0;
  let dirty = false;
  let lastRenderAt = 0;
  let lastNonTtyLogAt = 0;
  let refreshTimer: ReturnType<typeof setInterval> | null = null;

  const stopTimer = (): void => {
    if (refreshTimer) {
      clearInterval(refreshTimer);
      refreshTimer = null;
    }
  };

  const startTimer = (): void => {
    if (!isTty || refreshTimer) {
      return;
    }

    refreshTimer = setInterval(() => {
      if (dirty) {
        renderProgress();
      }
    }, refreshIntervalMs);
  };

  const clearProgressBlock = (): void => {
    if (!isTty || progressLineCount === 0) {
      return;
    }

    process.stdout.write(`\x1b[${progressLineCount}A`);
    for (let i = 0; i < progressLineCount; i += 1) {
      process.stdout.write("\x1b[2K\n");
    }
    process.stdout.write(`\x1b[${progressLineCount}A`);
    progressLineCount = 0;
  };

  const writeProgressBlock = (lines: string[]): void => {
    if (progressLineCount > 0) {
      process.stdout.write(`\x1b[${progressLineCount}A`);
    }

    for (let i = 0; i < lines.length; i += 1) {
      process.stdout.write("\x1b[2K\r");
      process.stdout.write(lines[i] ?? "");
      if (i < lines.length - 1) {
        process.stdout.write("\n");
      }
    }

    progressLineCount = lines.length;
    lastRenderAt = Date.now();
    dirty = false;
  };

  const overallSpeed = (): number => {
    const elapsedMs = Date.now() - batchStartedAt;
    if (elapsedMs <= 0) {
      return 0;
    }

    const activeBytes = completedDownloadedBytes + (currentFile?.downloadedBytes ?? 0);
    return (activeBytes / elapsedMs) * 1000;
  };

  const fileSpeed = (file: FileState): number => {
    const elapsedMs = Date.now() - file.startedAt;
    if (elapsedMs <= 0) {
      return 0;
    }

    return (file.downloadedBytes / elapsedMs) * 1000;
  };

  const computeEtaMs = (): number | null => {
    const speed = overallSpeed();
    if (speed <= 0) {
      return null;
    }

    if (options.estimatedTotalBytes !== null && options.estimatedTotalBytes > 0) {
      const activeBytes = completedDownloadedBytes + (currentFile?.downloadedBytes ?? 0);
      const remainingBytes = Math.max(0, options.estimatedTotalBytes - activeBytes);
      return (remainingBytes / speed) * 1000;
    }

    const processedFiles = downloadedCount + skippedCount + failedCount;
    const remainingFiles = Math.max(0, options.totalFiles - processedFiles);
    if (remainingFiles === 0 || processedFiles === 0) {
      return null;
    }

    const elapsedMs = Date.now() - batchStartedAt;
    const msPerFile = elapsedMs / processedFiles;
    return msPerFile * remainingFiles;
  };

  const buildProgressLines = (): string[] => {
    const file = currentFile;
    const index = file?.index ?? downloadedCount + skippedCount + failedCount + 1;
    const path = file?.path ?? "…";
    const fileTotal = file?.expectedBytes ?? null;
    const fileDownloaded = file?.downloadedBytes ?? 0;
    const activeTotalBytes =
      completedDownloadedBytes + fileDownloaded;
    const etaMs = computeEtaMs();
    const etaLabel = etaMs === null ? "ETA —" : `ETA ${formatDuration(etaMs)}`;

    return [
      `[${index}/${options.totalFiles}] ${path}`,
      `File: ${formatBytesTotal(fileDownloaded, fileTotal)} · ${formatSpeed(file ? fileSpeed(file) : 0)}`,
      `Total: ${formatBytesTotal(activeTotalBytes, options.estimatedTotalBytes)} · ${formatSpeed(overallSpeed())} · ${etaLabel}`,
      `Done: ${downloadedCount} · Skipped: ${skippedCount} · Failed: ${failedCount}`,
    ];
  };

  const renderProgress = (): void => {
    if (!isTty || suppressLiveOutput) {
      return;
    }

    writeProgressBlock(buildProgressLines());
  };

  const logNonTtyProgress = (force = false): void => {
    if (isTty || suppressLiveOutput) {
      return;
    }

    const now = Date.now();
    const shouldLog =
      force ||
      verbose ||
      downloadedCount + skippedCount + failedCount === 0 ||
      downloadedCount + skippedCount + failedCount === options.totalFiles ||
      (downloadedCount + skippedCount + failedCount) % nonTtyLogEvery === 0 ||
      now - lastNonTtyLogAt >= 5000;

    if (!shouldLog || !currentFile) {
      return;
    }

    lastNonTtyLogAt = now;
    const lines = buildProgressLines();
    console.log(lines.join("\n"));
  };

  const logVerbose = (message: string): void => {
    if (!verbose || suppressLiveOutput) {
      return;
    }

    if (isTty && progressLineCount > 0) {
      clearProgressBlock();
      console.log(message);
      dirty = true;
      renderProgress();
      return;
    }

    console.log(message);
  };

  return {
    printBatchHeader(): void {
      if (suppressLiveOutput) {
        return;
      }

      console.log(`Importing GitHub repository: ${options.repoLabel}`);
      console.log(`Files selected for download: ${options.totalFiles}`);
      if (options.estimatedTotalBytes === null) {
        console.log("Estimated total size: unknown");
      } else {
        console.log(`Estimated total size: ${formatBytes(options.estimatedTotalBytes)}`);
      }
      console.log("");
      console.log("Downloading files...");
      console.log("");

      startTimer();
    },

    startFile(index: number, path: string, expectedBytes: number | null): void {
      currentFile = {
        index,
        path,
        expectedBytes,
        downloadedBytes: 0,
        startedAt: Date.now(),
      };
      dirty = true;

      logVerbose(`[${index}/${options.totalFiles}] start ${path}`);
      renderProgress();
      logNonTtyProgress(true);
    },

    updateFileBytes(downloadedBytes: number, totalBytes?: number | null): void {
      if (!currentFile) {
        return;
      }

      currentFile.downloadedBytes = downloadedBytes;
      if (totalBytes !== undefined && totalBytes !== null && totalBytes > 0) {
        currentFile.expectedBytes = totalBytes;
      }

      dirty = true;

      const now = Date.now();
      if (isTty && now - lastRenderAt >= refreshIntervalMs) {
        renderProgress();
      }
    },

    markFileDone(bytesWritten: number): void {
      downloadedCount += 1;
      completedDownloadedBytes += bytesWritten;
      totalDownloadedBytes += bytesWritten;
      currentFile = null;
      dirty = true;

      if (verbose && !suppressLiveOutput) {
        logVerbose(
          `[${downloadedCount + skippedCount + failedCount}/${options.totalFiles}] done (${formatBytes(bytesWritten)})`
        );
      }

      renderProgress();
      logNonTtyProgress();
    },

    markFileSkipped(): void {
      skippedCount += 1;
      currentFile = null;
      dirty = true;
      renderProgress();
      logNonTtyProgress();
    },

    markFileFailed(path: string, index: number, reason: string): void {
      failedCount += 1;
      if (failedFiles.length < 10) {
        failedFiles.push({ path, reason });
      }
      currentFile = null;
      dirty = true;
      renderProgress();
      logNonTtyProgress();
    },

    warn(message: string): void {
      if (isTty && progressLineCount > 0) {
        clearProgressBlock();
      }

      console.warn(message);

      dirty = true;
      renderProgress();
    },

    finish(): DownloadProgressSummary {
      stopTimer();

      if (isTty && progressLineCount > 0) {
        clearProgressBlock();
      }

      const durationMs = Date.now() - batchStartedAt;
      const averageSpeed =
        durationMs > 0 ? (totalDownloadedBytes / durationMs) * 1000 : 0;

      if (!suppressLiveOutput) {
        console.log("");
        console.log("Download summary:");
        console.log(`Files selected: ${options.totalFiles}`);
        console.log(`Downloaded: ${downloadedCount}`);
        console.log(`Skipped: ${skippedCount}`);
        console.log(`Failed: ${failedCount}`);
        console.log(`Downloaded size: ${formatBytes(totalDownloadedBytes)}`);
        console.log(`Average speed: ${formatSpeed(averageSpeed)}`);
        console.log(`Duration: ${(durationMs / 1000).toFixed(1)}s`);

        if (failedFiles.length > 0) {
          console.log("");
          console.log("Failed files:");
          for (const entry of failedFiles) {
            console.log(`- ${entry.path} — ${entry.reason}`);
          }
          if (failedCount > failedFiles.length) {
            console.log(`… and ${failedCount - failedFiles.length} more`);
          }
        }
      }

      return {
        filesSelected: options.totalFiles,
        downloaded: downloadedCount,
        skipped: skippedCount,
        failed: failedCount,
        downloadedBytes: totalDownloadedBytes,
        durationMs,
        averageSpeed,
        failedFiles,
      };
    },
  };
}
