import type { Highlighter } from "shiki";

const HIGHLIGHT_THEME = "github-dark";

const PRELOADED_LANGS = [
  "scala",
  "typescript",
  "tsx",
  "javascript",
  "jsx",
  "python",
  "markdown",
  "json",
  "css",
  "c",
  "plaintext",
] as const;

let highlighterPromise: Promise<Highlighter> | null = null;

async function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = (async () => {
      const { createHighlighter } = await import("shiki");
      return createHighlighter({
        themes: [HIGHLIGHT_THEME],
        langs: [...PRELOADED_LANGS],
      });
    })();
  }

  return highlighterPromise;
}

export async function highlightCode(
  code: string,
  language: string
): Promise<string> {
  const highlighter = await getHighlighter();
  const lang = PRELOADED_LANGS.includes(
    language as (typeof PRELOADED_LANGS)[number]
  )
    ? language
    : "plaintext";

  try {
    return highlighter.codeToHtml(code, {
      lang,
      theme: HIGHLIGHT_THEME,
    });
  } catch {
    return highlighter.codeToHtml(code, {
      lang: "plaintext",
      theme: HIGHLIGHT_THEME,
    });
  }
}
