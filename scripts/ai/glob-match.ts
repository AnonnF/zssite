export function matchPriorityPattern(
  filePath: string,
  pattern: string
): boolean {
  const normalized = filePath.replace(/\\/g, "/");
  const fileName = normalized.split("/").pop() ?? normalized;

  if (pattern.includes("**")) {
    const tail = pattern.replace(/^\*\*\//, "");
    const regexSource = tail
      .replace(/[.+^${}()|[\]\\]/g, "\\$&")
      .replace(/\*\*/g, ".*")
      .replace(/\*/g, ".*")
      .replace(/\?/g, ".");
    const regex = new RegExp(regexSource, "i");
    return regex.test(fileName) || regex.test(normalized);
  }

  if (pattern.includes("*") || pattern.includes("?")) {
    const regexSource = pattern
      .replace(/[.+^${}()|[\]\\]/g, "\\$&")
      .replace(/\*/g, ".*")
      .replace(/\?/g, ".");
    const regex = new RegExp(`^${regexSource}$`, "i");
    return regex.test(fileName) || regex.test(normalized);
  }

  return normalized === pattern || normalized.endsWith(`/${pattern}`);
}
