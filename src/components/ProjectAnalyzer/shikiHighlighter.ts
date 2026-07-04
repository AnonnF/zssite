import { createHighlighter, type Highlighter } from "shiki";
import {
  HIGHLIGHT_THEME,
  resolveHighlightLanguage,
  SUPPORTED_HIGHLIGHT_LANGUAGES,
} from "@/data/projects/highlightLanguage";

let highlighterPromise: Promise<Highlighter> | null = null;

async function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: [HIGHLIGHT_THEME],
      langs: [...SUPPORTED_HIGHLIGHT_LANGUAGES],
    });
  }

  return highlighterPromise;
}

export async function highlightCode(
  code: string,
  language: string,
  path?: string
): Promise<string> {
  const highlighter = await getHighlighter();
  const resolved = resolveHighlightLanguage(language, path);
  const loaded = highlighter.getLoadedLanguages();
  const lang = loaded.includes(resolved) ? resolved : "plaintext";

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
