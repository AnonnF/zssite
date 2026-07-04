export type ParsedGitHubRepo = {
  owner: string;
  repo: string;
  htmlUrl: string;
};

export function parseGitHubRepoInput(input: string): ParsedGitHubRepo {
  const trimmed = input.trim().replace(/\/+$/, "");

  if (!trimmed) {
    throw new Error("GitHub repo input is empty.");
  }

  if (/^[\w.-]+\/[\w.-]+$/.test(trimmed)) {
    const [owner, repo] = trimmed.split("/");
    return {
      owner,
      repo: repo.replace(/\.git$/, ""),
      htmlUrl: `https://github.com/${owner}/${repo.replace(/\.git$/, "")}`,
    };
  }

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    throw new Error(
      `Invalid GitHub repo input: "${input}". Use owner/repo or https://github.com/owner/repo`
    );
  }

  if (url.hostname !== "github.com") {
    throw new Error(`Unsupported host "${url.hostname}". Only github.com is supported.`);
  }

  const segments = url.pathname.split("/").filter(Boolean);
  if (segments.length < 2) {
    throw new Error(`Invalid GitHub URL path: "${url.pathname}"`);
  }

  const owner = segments[0];
  const repo = segments[1].replace(/\.git$/, "");

  return {
    owner,
    repo,
    htmlUrl: `https://github.com/${owner}/${repo}`,
  };
}
