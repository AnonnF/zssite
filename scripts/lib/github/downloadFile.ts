import fs from "node:fs";
import path from "node:path";
import { scanForSecrets } from "../../ai/secret-detection.js";

export type DownloadFileResult = {
  downloaded: boolean;
  blockedBySecrets: boolean;
  secretReasons: string[];
  bytesWritten: number;
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

export async function downloadGitHubFileToDisk(options: {
  rawUrl: string;
  destinationPath: string;
  maxBytes: number;
}): Promise<DownloadFileResult> {
  const response = await fetch(options.rawUrl, { headers: buildHeaders() });

  if (!response.ok) {
    throw new Error(`Failed to download ${options.rawUrl} (${response.status})`);
  }

  const contentLength = response.headers.get("content-length");
  if (contentLength && Number(contentLength) > options.maxBytes) {
    return {
      downloaded: false,
      blockedBySecrets: false,
      secretReasons: [],
      bytesWritten: 0,
    };
  }

  const buffer = Buffer.from(await response.arrayBuffer());
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
