import { spawnSync } from "node:child_process";
import { getRepoRoot } from "./paths.js";

export function runNpmScript(
  scriptName: string,
  args: string[] = []
): void {
  const repoRoot = getRepoRoot();
  const npmArgs = ["run", scriptName, "--", ...args];

  const result = spawnSync("npm", npmArgs, {
    cwd: repoRoot,
    stdio: "inherit",
    shell: process.platform === "win32",
  });

  if (result.error) {
    console.error(result.error.message);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

export function formatNpmCommand(scriptName: string, args: string[] = []): string {
  if (args.length === 0) {
    return `npm run ${scriptName}`;
  }

  return `npm run ${scriptName} -- ${args.join(" ")}`;
}
