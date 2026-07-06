import { createHighlighter, type Highlighter } from "shiki";
import {
  HIGHLIGHT_THEME,
  resolveHighlightLanguage,
  SUPPORTED_HIGHLIGHT_LANGUAGES,
} from "../../../src/data/projects/highlightLanguage.js";

let highlighterPromise: Promise<Highlighter> | null = null;

async function getBuildHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: [HIGHLIGHT_THEME],
      langs: [...SUPPORTED_HIGHLIGHT_LANGUAGES],
    });
  }
  return highlighterPromise;
}

export type HighlightResult = {
  html: string;
  resolvedLanguage: string;
  warning?: string;
};

export async function highlightCodeBuildTime(
  code: string,
  language?: string,
  path?: string
): Promise<HighlightResult> {
  const highlighter = await getBuildHighlighter();
  const requested = resolveHighlightLanguage(language, path);
  const loaded = highlighter.getLoadedLanguages();
  const lang = loaded.includes(requested) ? requested : "plaintext";

  let warning: string | undefined;
  if (lang !== requested) {
    warning = `Language "${requested}" unavailable, used plaintext`;
  }

  try {
    const html = highlighter.codeToHtml(code, {
      lang,
      theme: HIGHLIGHT_THEME,
    });
    return { html, resolvedLanguage: lang, warning };
  } catch {
    const html = highlighter.codeToHtml(code, {
      lang: "plaintext",
      theme: HIGHLIGHT_THEME,
    });
    return {
      html,
      resolvedLanguage: "plaintext",
      warning: `Failed to highlight as ${lang}, used plaintext`,
    };
  }
}
