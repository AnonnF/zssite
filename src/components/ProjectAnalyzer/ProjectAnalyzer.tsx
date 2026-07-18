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
import { ReviewBadge } from "./ReviewBadge";

interface ProjectAnalyzerProps {
  data: ProjectAnalyzerData;
  defaultPath?: string;
  mode?: "walkthrough" | "repository";
}

const MODE_LABELS = {
  walkthrough: {
    panel: "Code Walkthrough",
    description: "项目代码导读 — 文件树、结构分析与关键片段。",
  },
  repository: {
    panel: "Repository Analysis",
    description: "公开仓库结构分析 — 文件树、模块解读与代码片段。",
  },
} as const;

export function ProjectAnalyzer({
  data,
  defaultPath = "src",
  mode = "walkthrough",
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

  const modeLabels = MODE_LABELS[mode];

  return (
    <div id="project-analyzer" className="panel-card archive-frame scroll-mt-24 overflow-hidden">
      <div className="analyzer-card-header border-b border-border-soft bg-surface/50 px-4 py-3 md:px-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="accent-bar" aria-hidden="true" />
              <p className="font-mono text-meta uppercase tracking-[0.12em] text-muted">
                {modeLabels.panel}
              </p>
              {data.review ? <ReviewBadge review={data.review} /> : null}
            </div>
            {data.description ? (
              <p className="analyzer-card-header__desc mt-2 font-[family-name:var(--font-body-sc)] text-muted">
                {data.description}
              </p>
            ) : (
              <p className="analyzer-card-header__desc mt-2 font-[family-name:var(--font-body-sc)] text-muted">
                {modeLabels.description}
              </p>
            )}
            {data.review?.status === "ai-draft" ? (
              <p className="mt-2 font-[family-name:var(--font-body-sc)] text-sm text-muted">
                {data.review.note ?? "该分析由 AI 自动生成，尚未人工审核。"}
              </p>
            ) : null}
          </div>
          <div className="flex flex-wrap items-center gap-2 font-mono text-meta text-muted">
            <span className="status-chip">
              <span className="status-chip__dot" aria-hidden="true" />
              Case File
            </span>
            {data.projectId ? (
              <span>
                ID <span className="text-accent">{data.projectId}</span>
              </span>
            ) : null}
          </div>
        </div>
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

        <div className="analyzer-pane-stack min-h-0 flex-1 lg:w-[65%]">
          <div className="analyzer-pane analyzer-pane--analysis">
            <FileAnalysisPanel entry={entry} onPathSelect={selectPath} />
          </div>

          <div className="analyzer-pane analyzer-pane--detail">
            {isFolder ? (
              <FolderOverview
                path={selectedPath}
                items={directChildren}
                selectedPath={selectedPath}
                getEntry={getEntry}
                onItemClick={handleOverviewItemClick}
              />
            ) : (
              <CodePreview entry={entry} projectId={data.projectId} />
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
