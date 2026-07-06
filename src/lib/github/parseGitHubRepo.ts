export type ParsedGitHubRepo = {
  owner: string;
  repo: string;
  htmlUrl: string;
};

export function inferProjectIdFromRepoName(repo: string): string {
  return repo
    .replace(/\.git$/i, "")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
}

export function parseGitHubRepoInput(input: string): ParsedGitHubRepo {
  const trimmed = input.trim().replace(/\/+$/, "");

  if (!trimmed) {
    throw new Error("GitHub repo input is empty.");
  }

  if (/^[\w.-]+\/[\w.-]+$/.test(trimmed)) {
    const [owner, repo] = trimmed.split("/");
    const normalizedRepo = repo.replace(/\.git$/, "");
    return {
      owner,
      repo: normalizedRepo,
      htmlUrl: `https://github.com/${owner}/${normalizedRepo}`,
    };
  }

  let url: URL;
  try {
    url = new URL(trimmed.includes("://") ? trimmed : `https://${trimmed}`);
  } catch {
    throw new Error("invalid");
  }

  if (url.hostname !== "github.com") {
    throw new Error("invalid");
  }

  const segments = url.pathname.split("/").filter(Boolean);
  if (segments.length < 2) {
    throw new Error("invalid");
  }

  const owner = segments[0];
  const repo = segments[1].replace(/\.git$/, "");

  return {
    owner,
    repo,
    htmlUrl: `https://github.com/${owner}/${repo}`,
  };
}

export function tryParseGitHubRepoInput(input: string): ParsedGitHubRepo | null {
  try {
    return parseGitHubRepoInput(input);
  } catch {
    return null;
  }
}
