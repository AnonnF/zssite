import fs from "node:fs";
import path from "node:path";
import { scanForSecrets } from "../../ai/secret-detection.js";

export type DownloadFileResult = {
  downloaded: boolean;
  blockedBySecrets: boolean;
  secretReasons: string[];
  bytesWritten: number;
};

export type DownloadGitHubFileOptions = {
  rawUrl: string;
  destinationPath: string;
  maxBytes: number;
  expectedBytes?: number | null;
  onStart?: (expectedBytes: number | null) => void;
  onProgress?: (downloadedBytes: number, totalBytes: number | null) => void;
};

function buildHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "User-Agent": "zssite-project-analyzer-import",
  };

  const token = process.env.GITHUB_TOKEN?.trim();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

async function readResponseBodyWithProgress(options: {
  response: Response;
  maxBytes: number;
  expectedBytes?: number | null;
  onProgress?: (downloadedBytes: number, totalBytes: number | null) => void;
}): Promise<Buffer> {
  const contentLengthHeader = options.response.headers.get("content-length");
  const headerTotal =
    contentLengthHeader && Number.isFinite(Number(contentLengthHeader))
      ? Number(contentLengthHeader)
      : null;
  const totalBytes =
    headerTotal ??
    (typeof options.expectedBytes === "number" ? options.expectedBytes : null);

  if (headerTotal !== null && headerTotal > options.maxBytes) {
    return Buffer.alloc(0);
  }

  const body = options.response.body;
  if (!body) {
    const buffer = Buffer.from(await options.response.arrayBuffer());
    options.onProgress?.(buffer.byteLength, totalBytes ?? buffer.byteLength);
    return buffer;
  }

  const reader = body.getReader();
  const chunks: Buffer[] = [];
  let downloaded = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    if (!value) {
      continue;
    }

    downloaded += value.byteLength;
    options.onProgress?.(downloaded, totalBytes);

    if (downloaded > options.maxBytes) {
      await reader.cancel();
      break;
    }

    chunks.push(Buffer.from(value));
  }

  return Buffer.concat(chunks);
}

export async function downloadGitHubFileToDisk(
  options: DownloadGitHubFileOptions
): Promise<DownloadFileResult> {
  options.onStart?.(
    typeof options.expectedBytes === "number" ? options.expectedBytes : null
  );

  const response = await fetch(options.rawUrl, { headers: buildHeaders() });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`.trim());
  }

  const buffer = await readResponseBodyWithProgress({
    response,
    maxBytes: options.maxBytes,
    expectedBytes: options.expectedBytes,
    onProgress: options.onProgress,
  });

  if (buffer.byteLength === 0) {
    const contentLength = response.headers.get("content-length");
    if (contentLength && Number(contentLength) > options.maxBytes) {
      return {
        downloaded: false,
        blockedBySecrets: false,
        secretReasons: [],
        bytesWritten: 0,
      };
    }
  }

  if (buffer.byteLength > options.maxBytes) {
    return {
      downloaded: false,
      blockedBySecrets: false,
      secretReasons: [],
      bytesWritten: 0,
    };
  }

  const content = buffer.toString("utf8");
  const secretScan = scanForSecrets(content);
  if (secretScan.blocked) {
    return {
      downloaded: false,
      blockedBySecrets: true,
      secretReasons: secretScan.reasons,
      bytesWritten: 0,
    };
  }

  fs.mkdirSync(path.dirname(options.destinationPath), { recursive: true });
  fs.writeFileSync(options.destinationPath, content, "utf8");

  return {
    downloaded: true,
    blockedBySecrets: false,
    secretReasons: [],
    bytesWritten: buffer.byteLength,
  };
}
