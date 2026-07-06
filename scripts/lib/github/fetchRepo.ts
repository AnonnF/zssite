import type { ParsedGitHubRepo } from "./parseRepoUrl.js";

export type GitHubTreeEntry = {
  path: string;
  mode: string;
  type: "blob" | "tree";
  sha: string;
  size?: number;
  url?: string;
};

export type GitHubRepoMetadata = ParsedGitHubRepo & {
  description: string | null;
  defaultBranch: string;
  htmlUrl: string;
  latestCommitSha: string;
  treeSha: string;
  tree: GitHubTreeEntry[];
  treeTruncated: boolean;
};

export type GitHubFetchResult = {
  metadata: GitHubRepoMetadata;
  rateLimitRemaining: number | null;
  rateLimitLimit: number | null;
};

function getGitHubToken(): string | undefined {
  const token = process.env.GITHUB_TOKEN?.trim();
  return token || undefined;
}

export function warnIfNoGitHubToken(): void {
  if (!getGitHubToken()) {
    console.warn(
      "Warning: GITHUB_TOKEN is not set. Public repo import may work, but GitHub API rate limit is ~60 requests/hour for unauthenticated requests."
    );
  }
}

function buildHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "zssite-project-analyzer-import",
  };

  const token = getGitHubToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

async function githubFetch<T>(
  url: string,
  label: string
): Promise<{ data: T; rateLimitRemaining: number | null; rateLimitLimit: number | null }> {
  const response = await fetch(url, { headers: buildHeaders() });

  const rateLimitRemaining = response.headers.get("x-ratelimit-remaining");
  const rateLimitLimit = response.headers.get("x-ratelimit-limit");

  if (!response.ok) {
    let detail = "";
    try {
      const body = (await response.json()) as { message?: string };
      if (body.message) detail = `: ${body.message}`;
    } catch {
      // ignore parse errors
    }

    if (response.status === 404) {
      throw new Error(`GitHub ${label} not found (404)${detail}`);
    }
    if (response.status === 403) {
      throw new Error(
        `GitHub ${label} forbidden (403)${detail}. Check repo visibility or rate limits.`
      );
    }
    if (response.status === 401) {
      throw new Error(`GitHub ${label} unauthorized (401)${detail}. Check GITHUB_TOKEN.`);
    }

    throw new Error(`GitHub ${label} failed (${response.status})${detail}`);
  }

  const remaining = rateLimitRemaining ? Number(rateLimitRemaining) : null;
  if (remaining !== null && remaining <= 5) {
    console.warn(
      `Warning: GitHub API rate limit nearly exhausted (${remaining} requests remaining).`
    );
  }

  const data = (await response.json()) as T;
  return {
    data,
    rateLimitRemaining: remaining,
    rateLimitLimit: rateLimitLimit ? Number(rateLimitLimit) : null,
  };
}

type RepoResponse = {
  description: string | null;
  default_branch: string;
  html_url: string;
};

type CommitResponse = {
  sha: string;
  commit: { tree: { sha: string } };
};

type TreeResponse = {
  sha: string;
  truncated: boolean;
  tree: GitHubTreeEntry[];
};

export async function fetchGitHubRepoMetadata(
  parsed: ParsedGitHubRepo,
  branchOverride?: string
): Promise<GitHubFetchResult> {
  const repoUrl = `https://api.github.com/repos/${parsed.owner}/${parsed.repo}`;

  const repoResult = await githubFetch<RepoResponse>(repoUrl, "repository metadata");
  const branch = branchOverride ?? repoResult.data.default_branch;

  const commitUrl = `https://api.github.com/repos/${parsed.owner}/${parsed.repo}/commits/${encodeURIComponent(branch)}`;
  const commitResult = await githubFetch<CommitResponse>(commitUrl, `branch "${branch}" commit`);

  const commitSha = commitResult.data.sha;
  const treeSha = commitResult.data.commit.tree.sha;

  const treeUrl = `https://api.github.com/repos/${parsed.owner}/${parsed.repo}/git/trees/${treeSha}?recursive=1`;
  const treeResult = await githubFetch<TreeResponse>(treeUrl, "git tree");

  if (treeResult.data.truncated) {
    console.warn(
      "Warning: GitHub git tree response is truncated. Import will use partial tree data; very large repos may be incomplete."
    );
  }

  return {
    metadata: {
      ...parsed,
      description: repoResult.data.description,
      defaultBranch: branch,
      htmlUrl: repoResult.data.html_url,
      latestCommitSha: commitSha,
      treeSha: treeResult.data.sha,
      tree: treeResult.data.tree,
      treeTruncated: treeResult.data.truncated,
    },
    rateLimitRemaining: treeResult.rateLimitRemaining,
    rateLimitLimit: treeResult.rateLimitLimit,
  };
}

export function buildGitHubBlobUrl(owner: string, repo: string, commitSha: string, filePath: string): string {
  return `https://github.com/${owner}/${repo}/blob/${commitSha}/${filePath}`;
}

export function buildRawGitHubUrl(owner: string, repo: string, commitSha: string, filePath: string): string {
  return `https://raw.githubusercontent.com/${owner}/${repo}/${commitSha}/${filePath}`;
}
