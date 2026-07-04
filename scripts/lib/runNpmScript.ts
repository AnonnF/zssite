import { spawn } from "node:child_process";
import { getRepoRoot } from "./paths.js";

export function runNpmScript(
  scriptName: string,
  args: string[] = []
): Promise<void> {
  const repoRoot = getRepoRoot();
  const npmArgs = ["run", scriptName, "--", ...args];

  return new Promise((resolve) => {
    const child = spawn("npm", npmArgs, {
      cwd: repoRoot,
      stdio: "inherit",
      shell: process.platform === "win32",
    });

    child.on("error", (error) => {
      console.error(error.message);
      process.exit(1);
    });

    child.on("close", (code) => {
      if (code !== 0) {
        process.exit(code ?? 1);
      }
      resolve();
    });
  });
}

export function formatNpmCommand(scriptName: string, args: string[] = []): string {
  if (args.length === 0) {
    return `npm run ${scriptName}`;
  }

  return `npm run ${scriptName} -- ${args.join(" ")}`;
}
