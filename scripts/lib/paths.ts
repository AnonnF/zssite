import path from "node:path";
import { fileURLToPath } from "node:url";

let cachedRepoRoot: string | undefined;

export function getRepoRoot(): string {
  if (cachedRepoRoot) return cachedRepoRoot;

  // Anchor on this file (scripts/lib/paths.ts) so callers at other depths
  // cannot accidentally resolve to a parent directory.
  cachedRepoRoot = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../.."
  );
  return cachedRepoRoot;
}

export function getSnapshotRoot(repoRoot: string, projectId: string): string {
  return path.join(repoRoot, "project-snapshots", projectId);
}

export function getSnapshotRelativePath(projectId: string): string {
  return `project-snapshots/${projectId}`;
}
