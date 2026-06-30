"use client";

import { useCallback, useMemo, useState } from "react";
import type { ProjectAnalyzerData, ProjectTreeNode } from "@/data/projects/types";
import {
  collectAllFolderPaths,
  collectAncestorPaths,
  collectExpandedPathsFor,
  findTreeNode,
  getAnalysisEntry,
  getDirectChildren,
} from "@/data/projects";
import { FileTree } from "./FileTree";
import { FileAnalysisPanel } from "./FileAnalysisPanel";
import { CodePreview } from "./CodePreview";
import { FolderOverview } from "./FolderOverview";

interface ProjectAnalyzerProps {
  data: ProjectAnalyzerData;
  defaultPath?: string;
}

export function ProjectAnalyzer({
  data,
  defaultPath = "src",
}: ProjectAnalyzerProps) {
  const initialExpanded = useMemo(
    () => new Set(collectExpandedPathsFor(defaultPath)),
    [defaultPath]
  );

  const [selectedPath, setSelectedPath] = useState(defaultPath);
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(initialExpanded);

  const selectedNode = useMemo(
    () => findTreeNode(data.tree, selectedPath),
    [data.tree, selectedPath]
  );

  const entry = useMemo(
    () => getAnalysisEntry(data, selectedPath, selectedNode),
    [data, selectedPath, selectedNode]
  );

  const directChildren = useMemo(
    () => getDirectChildren(data.tree, selectedPath),
    [data.tree, selectedPath]
  );

  const isFolder = entry.type === "folder";

  const handleExpandAll = useCallback(() => {
    setExpandedPaths(new Set(collectAllFolderPaths(data.tree)));
  }, [data.tree]);

  const handleCollapseAll = useCallback(() => {
    setExpandedPaths(new Set([""]));
  }, []);

  const handleNodeClick = useCallback((node: ProjectTreeNode) => {
    const { path, type, children } = node;
    const hasChildren = type === "folder" && (children?.length ?? 0) > 0;

    setSelectedPath(path);

    setExpandedPaths((prev) => {
      const next = new Set(prev);

      for (const ancestor of collectAncestorPaths(path)) {
        next.add(ancestor);
      }

      if (type === "folder" && hasChildren) {
        if (next.has(path)) {
          next.delete(path);
        } else {
          next.add(path);
        }
      }

      return next;
    });
  }, []);

  return (
    <div className="panel-card overflow-hidden">
      <div className="border-b border-border-soft px-4 py-3 md:px-5">
        <p className="font-mono text-meta uppercase tracking-wider text-muted">
          Project Analyzer
        </p>
        <p className="mt-1 font-[family-name:var(--font-body-sc)] text-body text-muted">
          {data.description}
        </p>
      </div>

      <div className="flex min-h-[32rem] flex-col lg:min-h-[36rem] lg:flex-row">
        <aside className="flex max-h-64 flex-col border-b border-border-soft bg-surface/30 lg:max-h-none lg:w-[35%] lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between gap-2 border-b border-border-soft px-4 py-2.5">
            <span className="font-mono text-meta uppercase tracking-wider text-muted">
              File Tree
            </span>
            <div className="tree-header-actions">
              <button
                type="button"
                className="tree-header-action"
                aria-label="Expand all folders"
                onClick={handleExpandAll}
              >
                Expand
              </button>
              <button
                type="button"
                className="tree-header-action"
                aria-label="Collapse all folders"
                onClick={handleCollapseAll}
              >
                Collapse
              </button>
            </div>
          </div>
          <FileTree
            tree={data.tree}
            selectedPath={selectedPath}
            expandedPaths={expandedPaths}
            onNodeClick={handleNodeClick}
          />
        </aside>

        <div className="flex min-h-0 flex-1 flex-col lg:w-[65%]">
          <div className="min-h-[12rem] flex-1 border-b border-border-soft lg:min-h-0 lg:max-h-[45%]">
            <FileAnalysisPanel entry={entry} />
          </div>

          <div className="min-h-[14rem] flex-1 lg:min-h-0">
            {isFolder ? (
              <FolderOverview path={selectedPath} items={directChildren} />
            ) : (
              <CodePreview entry={entry} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
