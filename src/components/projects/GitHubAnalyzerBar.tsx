"use client";

import { useCallback, useMemo, useState } from "react";
import type { ProjectTemplateId } from "@/data/projects/types";
import { buildAnalyzerCommandPreview } from "@/lib/github/buildAnalyzerCommands";
import {
  inferProjectIdFromRepoName,
  tryParseGitHubRepoInput,
} from "@/lib/github/parseGitHubRepo";
import { SectionLabel } from "@/components/ui/SectionLabel";

type TemplateSelection = "auto" | ProjectTemplateId;

const TEMPLATE_OPTIONS: { value: TemplateSelection; label: string }[] = [
  { value: "auto", label: "Auto" },
  { value: "ai-pipeline", label: "ai-pipeline" },
  { value: "fullstack-web", label: "fullstack-web" },
  { value: "systems-project", label: "systems-project" },
  { value: "compiler-pipeline", label: "compiler-pipeline" },
];

const INVALID_URL_MESSAGE =
  "请输入有效的 GitHub 仓库地址，例如 https://github.com/owner/repo";

async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through to legacy copy
  }

  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "true");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    document.body.removeChild(textarea);
    return copied;
  } catch {
    return false;
  }
}

export function GitHubAnalyzerBar() {
  const [repoInput, setRepoInput] = useState("");
  const [templateSelection, setTemplateSelection] =
    useState<TemplateSelection>("auto");
  const [error, setError] = useState<string | null>(null);
  const [commandPreview, setCommandPreview] = useState<string | null>(null);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">(
    "idle"
  );

  const parsedPreview = useMemo(
    () => (repoInput.trim() ? tryParseGitHubRepoInput(repoInput) : null),
    [repoInput]
  );

  const handleAnalyze = useCallback(() => {
    const trimmed = repoInput.trim();
    if (!trimmed) {
      setError(null);
      setCommandPreview(null);
      return;
    }

    const parsed = tryParseGitHubRepoInput(trimmed);
    if (!parsed) {
      setError(INVALID_URL_MESSAGE);
      setCommandPreview(null);
      return;
    }

    const projectId = inferProjectIdFromRepoName(parsed.repo);
    const templateId =
      templateSelection === "auto"
        ? undefined
        : (templateSelection as ProjectTemplateId);

    setError(null);
    setCommandPreview(
      buildAnalyzerCommandPreview({
        owner: parsed.owner,
        repo: parsed.repo,
        projectId,
        templateId,
        preferAnalyzeGithub: true,
      })
    );
    setCopyState("idle");
  }, [repoInput, templateSelection]);

  const handleCopy = useCallback(async () => {
    if (!commandPreview) {
      return;
    }

    const copied = await copyText(commandPreview);
    setCopyState(copied ? "copied" : "failed");
    if (copied) {
      window.setTimeout(() => setCopyState("idle"), 2000);
    }
  }, [commandPreview]);

  return (
    <section className="mt-8 border border-border-soft bg-surface/30 md:mt-10">
      <div className="border-b border-border-soft px-5 py-4 md:px-6">
        <SectionLabel>Repository Analyzer</SectionLabel>
        <p className="mt-2 max-w-2xl font-[family-name:var(--font-body-sc)] text-sm leading-relaxed text-muted md:text-body">
          粘贴公开 GitHub 仓库地址，生成本地 CLI 命令以导入并创建 AI Draft。
          AI 生成的分析会进入 AI Drafts，并在人工审核前保持未审核标记。
        </p>
      </div>

      <div className="flex flex-col gap-4 px-5 py-5 md:flex-row md:items-end md:gap-5 md:px-6">
        <div className="min-w-0 flex-1">
          <label
            htmlFor="github-analyzer-url"
            className="font-mono text-meta uppercase tracking-wider text-muted"
          >
            Repository URL
          </label>
          <input
            id="github-analyzer-url"
            type="url"
            value={repoInput}
            onChange={(event) => {
              setRepoInput(event.target.value);
              setError(null);
            }}
            placeholder="https://github.com/owner/repository"
            className="mt-2 w-full border border-border-soft bg-background px-3 py-2.5 font-mono text-sm text-text outline-none transition-colors focus:border-accent"
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        <div className="md:w-52">
          <label
            htmlFor="github-analyzer-template"
            className="font-mono text-meta uppercase tracking-wider text-muted"
          >
            Template
          </label>
          <select
            id="github-analyzer-template"
            value={templateSelection}
            onChange={(event) =>
              setTemplateSelection(event.target.value as TemplateSelection)
            }
            className="mt-2 w-full border border-border-soft bg-background px-3 py-2.5 font-mono text-sm text-text outline-none transition-colors focus:border-accent"
          >
            {TEMPLATE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={handleAnalyze}
          className="border border-accent bg-accent-muted px-5 py-2.5 font-mono text-meta font-semibold uppercase tracking-wider text-text transition-colors hover:border-accent hover:bg-accent hover:text-background md:shrink-0"
        >
          Analyze
        </button>
      </div>

      <div className="border-t border-border-soft px-5 py-3 md:px-6">
        <p className="font-mono text-meta text-muted">
          Public GitHub repos only · AI draft · Manual review flag supported
        </p>
        {parsedPreview && !commandPreview ? (
          <p className="mt-2 font-mono text-meta text-muted">
            projectId:{" "}
            <span className="text-accent">
              {inferProjectIdFromRepoName(parsedPreview.repo)}
            </span>
          </p>
        ) : null}
      </div>

      {error ? (
        <p className="border-t border-border-soft px-5 py-3 font-[family-name:var(--font-body-sc)] text-sm text-muted md:px-6">
          {error}
        </p>
      ) : null}

      {commandPreview ? (
        <div className="border-t border-border-soft px-5 py-4 md:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-mono text-meta uppercase tracking-wider text-muted">
              Local CLI Commands
            </p>
            <button
              type="button"
              onClick={handleCopy}
              className="tree-header-action font-mono text-meta uppercase tracking-wider"
            >
              {copyState === "copied"
                ? "Copied"
                : copyState === "failed"
                  ? "Copy failed"
                  : "Copy"}
            </button>
          </div>

          <pre className="mt-3 overflow-x-auto border border-border-soft bg-background px-4 py-3 font-mono text-sm leading-relaxed text-text">
            {commandPreview}
          </pre>

          <p className="mt-3 font-[family-name:var(--font-body-sc)] text-sm text-muted">
            运行命令后，项目会出现在 AI Drafts 分组，并带有 AI DRAFT 标记。此页面不会在线执行分析。
          </p>
          {copyState === "failed" ? (
            <p className="mt-2 font-mono text-meta text-muted">
              无法写入剪贴板，请手动选择上方命令复制。
            </p>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
