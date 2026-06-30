"use client";

import type { ProjectTreeNode } from "@/data/projects/types";
import { FileTreeIcon } from "./getFileIcon";

interface FileTreeProps {
  tree: ProjectTreeNode[];
  selectedPath: string;
  expandedPaths: Set<string>;
  onNodeClick: (node: ProjectTreeNode) => void;
}

interface TreeNodeProps {
  node: ProjectTreeNode;
  depth: number;
  selectedPath: string;
  expandedPaths: Set<string>;
  onNodeClick: (node: ProjectTreeNode) => void;
}

interface TreeRowProps {
  node: ProjectTreeNode;
  depth: number;
  isSelected: boolean;
  isExpanded: boolean;
  hasChildren: boolean;
  onClick: () => void;
  labelClassName?: string;
}

function TreeChevron({
  isFolder,
  hasChildren,
  isExpanded,
}: {
  isFolder: boolean;
  hasChildren: boolean;
  isExpanded: boolean;
}) {
  return (
    <span className="tree-chevron" aria-hidden>
      {isFolder && hasChildren ? (isExpanded ? "▾" : "▸") : null}
    </span>
  );
}

function TreeRow({
  node,
  depth,
  isSelected,
  isExpanded,
  hasChildren,
  onClick,
  labelClassName = "",
}: TreeRowProps) {
  const isFolder = node.type === "folder";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`tree-item ${isSelected ? "tree-item--selected text-text" : "text-muted"}`}
      style={{ paddingLeft: `${depth * 12 + 8}px` }}
      aria-current={isSelected ? "true" : undefined}
      aria-expanded={isFolder && hasChildren ? isExpanded : undefined}
    >
      <TreeChevron
        isFolder={isFolder}
        hasChildren={hasChildren}
        isExpanded={isExpanded}
      />
      <FileTreeIcon node={node} expanded={isExpanded} />
      <span className={`tree-name ${labelClassName}`.trim()}>{node.name}</span>
    </button>
  );
}

function TreeNode({
  node,
  depth,
  selectedPath,
  expandedPaths,
  onNodeClick,
}: TreeNodeProps) {
  const isFolder = node.type === "folder";
  const isSelected = selectedPath === node.path;
  const isExpanded = isFolder && expandedPaths.has(node.path);
  const hasChildren = isFolder && (node.children?.length ?? 0) > 0;
  const isRoot = node.path === "";

  return (
    <div>
      <TreeRow
        node={node}
        depth={depth}
        isSelected={isSelected}
        isExpanded={isExpanded}
        hasChildren={hasChildren}
        onClick={() => onNodeClick(node)}
        labelClassName={
          isRoot ? "font-semibold uppercase tracking-wider" : undefined
        }
      />

      {isFolder && isExpanded && hasChildren && (
        <div>
          {node.children!.map((child) => (
            <TreeNode
              key={child.path}
              node={child}
              depth={depth + 1}
              selectedPath={selectedPath}
              expandedPaths={expandedPaths}
              onNodeClick={onNodeClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function FileTree({
  tree,
  selectedPath,
  expandedPaths,
  onNodeClick,
}: FileTreeProps) {
  return (
    <nav
      aria-label="Project file tree"
      className="project-analyzer-tree min-h-0 flex-1 overflow-y-auto"
    >
      {tree.map((node) => (
        <TreeNode
          key={node.path || "root"}
          node={node}
          depth={0}
          selectedPath={selectedPath}
          expandedPaths={expandedPaths}
          onNodeClick={onNodeClick}
        />
      ))}
    </nav>
  );
}
