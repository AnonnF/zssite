"use client";

import { useMemo, useState } from "react";
import type { ProjectAnalyzerData } from "@/data/projects/types";
import { searchProjectEntries } from "@/data/projects/search";
import { FileTreeIcon } from "./getFileIcon";

const RESULT_LIMIT = 10;

interface FileTreeSearchProps {
  data: ProjectAnalyzerData;
  selectedPath: string;
  onResultSelect: (path: string) => void;
}

export function FileTreeSearch({
  data,
  selectedPath,
  onResultSelect,
}: FileTreeSearchProps) {
  const [query, setQuery] = useState("");

  const trimmedQuery = query.trim();
  const { results, totalMatches } = useMemo(() => {
    if (!trimmedQuery) {
      return { results: [], totalMatches: 0 };
    }

    const allMatches = searchProjectEntries(data, trimmedQuery, Number.MAX_SAFE_INTEGER);
    return {
      results: allMatches.slice(0, RESULT_LIMIT),
      totalMatches: allMatches.length,
    };
  }, [data, trimmedQuery]);

  const showResults = trimmedQuery.length > 0;

  return (
    <div className="file-tree-search border-b border-border-soft">
      <div className="px-3 py-2 md:px-4">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setQuery("");
            }
          }}
          placeholder="Search files, folders, modules..."
          aria-label="Search files, folders, and modules"
          className="file-tree-search-input w-full"
        />
      </div>

      {showResults && (
        <div className="file-tree-search-results px-3 pb-2 md:px-4 md:pb-3">
          <div className="flex items-center justify-between gap-2 px-1 pb-2">
            <span className="font-mono text-meta uppercase tracking-wider text-muted">
              Search Results ({totalMatches})
            </span>
            {totalMatches > RESULT_LIMIT && (
              <span className="font-mono text-meta text-muted">
                Showing top {RESULT_LIMIT} results
              </span>
            )}
          </div>

          {results.length > 0 ? (
            <ul className="max-h-48 overflow-y-auto">
              {results.map((result) => {
                const isSelected = selectedPath === result.path;
                const iconNode = {
                  name: result.name,
                  path: result.path,
                  type: result.type,
                };

                return (
                  <li key={result.path}>
                    <button
                      type="button"
                      className={`file-tree-search-result group w-full text-left ${
                        isSelected ? "file-tree-search-result--selected" : ""
                      }`}
                      onClick={() => onResultSelect(result.path)}
                    >
                      <div className="flex items-start gap-2">
                        <FileTreeIcon
                          node={iconNode}
                          expanded={false}
                          className="mt-0.5"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-mono text-body text-text">
                              {result.name || "/"}
                            </span>
                            <span className="shrink-0 border border-border-soft px-1.5 py-0.5 font-mono text-meta uppercase tracking-wider text-muted">
                              {result.type}
                            </span>
                          </div>
                          <p className="mt-0.5 truncate font-mono text-meta text-muted">
                            {result.path || "/"}
                          </p>
                          <p className="mt-1 line-clamp-2 font-[family-name:var(--font-body-sc)] text-meta leading-relaxed text-muted">
                            {result.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="px-1 py-2 font-[family-name:var(--font-body-sc)] text-meta text-muted">
              没有找到匹配的文件或模块。
            </p>
          )}
        </div>
      )}
    </div>
  );
}
