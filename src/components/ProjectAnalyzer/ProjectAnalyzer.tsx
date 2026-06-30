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
  resolveActiveTourStepIndex,
  PROJECT_ARCHITECTURE_ENABLED,
} from "@/data/projects";
import { FileTree } from "./FileTree";
import { FileTreeSearch } from "./FileTreeSearch";
import { FileAnalysisPanel } from "./FileAnalysisPanel";
import { CodePreview } from "./CodePreview";
import { FolderOverview } from "./FolderOverview";
import { ProjectArchitecture } from "./ProjectArchitecture";
import { GuidedTour } from "./GuidedTour";

interface ProjectAnalyzerProps {
  data: ProjectAnalyzerData;
  defaultPath?: string;
}

export function ProjectAnalyzer({
  data,
  defaultPath = "src",
}: ProjectAnalyzerProps) {
  const resolvedDefaultPath = data.guidedTour?.[0]?.path ?? defaultPath;

  const initialExpanded = useMemo(
    () => new Set(collectExpandedPathsFor(resolvedDefaultPath)),
    [resolvedDefaultPath]
  );

  const [selectedPath, setSelectedPath] = useState(resolvedDefaultPath);
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(initialExpanded);
  const [activeTourStep, setActiveTourStep] = useState(0);

  const selectedNode = useMemo(
    () => findTreeNode(data.tree, selectedPath),
    [data.tree, selectedPath]
  );

  const entry = useMemo(
    () => getAnalysisEntry(data, selectedPath, selectedNode),
    [data, selectedPath, selectedNode]
  );

  const getEntry = useCallback(
    (path: string) => getAnalysisEntry(data, path, findTreeNode(data.tree, path)),
    [data]
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

  const selectPath = useCallback(
    (path: string, options?: { toggleFolder?: boolean }) => {
      setSelectedPath(path);

      if (data.guidedTour?.length) {
        setActiveTourStep(resolveActiveTourStepIndex(data.guidedTour, path));
      }

      setExpandedPaths((prev) => {
        const next = new Set(prev);

        for (const ancestor of collectAncestorPaths(path)) {
          next.add(ancestor);
        }

        if (options?.toggleFolder) {
          const node = findTreeNode(data.tree, path);
          const hasChildren =
            node?.type === "folder" && (node.children?.length ?? 0) > 0;

          if (node?.type === "folder" && hasChildren) {
            if (next.has(path)) {
              next.delete(path);
            } else {
              next.add(path);
            }
          }
        } else {
          next.add(path);
        }

        return next;
      });
    },
    [data.tree, data.guidedTour]
  );

  const handleTourStepSelect = useCallback(
    (index: number) => {
      const step = data.guidedTour?.[index];
      if (!step) return;
      selectPath(step.path);
    },
    [data.guidedTour, selectPath]
  );

  const handleNodeClick = useCallback(
    (node: ProjectTreeNode) => {
      selectPath(node.path, { toggleFolder: true });
    },
    [selectPath]
  );

  const handleOverviewItemClick = useCallback(
    (node: ProjectTreeNode) => {
      selectPath(node.path);
    },
    [selectPath]
  );

  const handleSearchResultSelect = useCallback(
    (path: string) => {
      selectPath(path);
    },
    [selectPath]
  );

  return (
    <div id="project-analyzer" className="panel-card scroll-mt-24 overflow-hidden">
      <div className="border-b border-border-soft px-4 py-3 md:px-5">
        <p className="font-mono text-meta uppercase tracking-wider text-muted">
          Project Analyzer
        </p>
        <p className="mt-1 font-[family-name:var(--font-body-sc)] text-body text-muted">
          {data.description}
        </p>
      </div>

      {data.guidedTour && data.guidedTour.length > 0 && (
        <GuidedTour
          steps={data.guidedTour}
          activeStepIndex={activeTourStep}
          onStepSelect={handleTourStepSelect}
        />
      )}

      <div className="analyzer-workspace min-h-[32rem] lg:min-h-[36rem]">
        <aside className="analyzer-pane analyzer-pane--tree flex max-h-64 flex-col lg:max-h-none lg:w-[35%] lg:min-h-0">
          <div className="analyzer-pane-header">
            <div className="analyzer-pane-header__lead">
              <span className="accent-bar mt-0.5" aria-hidden="true" />
              <span className="analyzer-pane-header__label">File Tree</span>
            </div>
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
          <FileTreeSearch
            data={data}
            selectedPath={selectedPath}
            onResultSelect={handleSearchResultSelect}
          />
          <FileTree
            tree={data.tree}
            selectedPath={selectedPath}
            expandedPaths={expandedPaths}
            onNodeClick={handleNodeClick}
          />
        </aside>

        <div className="flex min-h-0 flex-1 flex-col gap-3 lg:w-[65%]">
          <div className="analyzer-pane min-h-[12rem] flex-1 lg:min-h-0 lg:max-h-[45%]">
            <FileAnalysisPanel entry={entry} onPathSelect={selectPath} />
          </div>

          <div className="analyzer-pane min-h-[14rem] flex-1 lg:min-h-0">
            {isFolder ? (
              <FolderOverview
                path={selectedPath}
                items={directChildren}
                selectedPath={selectedPath}
                getEntry={getEntry}
                onItemClick={handleOverviewItemClick}
              />
            ) : (
              <CodePreview entry={entry} />
            )}
          </div>
        </div>
      </div>

      {PROJECT_ARCHITECTURE_ENABLED &&
        data.pipeline &&
        data.pipeline.length > 0 && (
        <ProjectArchitecture
          pipeline={data.pipeline}
          selectedPath={selectedPath}
          onNodeClick={selectPath}
        />
      )}
    </div>
  );
}
