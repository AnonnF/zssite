"use client";

import type { ProjectTreeNode } from "@/data/projects/types";
import { FileTreeIcon } from "./getFileIcon";

interface FileTreeProps {
  tree: ProjectTreeNode[];
  selectedPath: string;
  expandedPaths: Set<string>;
  onSelect: (path: string) => void;
  onToggle: (path: string) => void;
}

interface TreeNodeProps {
  node: ProjectTreeNode;
  depth: number;
  selectedPath: string;
  expandedPaths: Set<string>;
  onSelect: (path: string) => void;
  onToggle: (path: string) => void;
}

interface TreeRowProps {
  label: string;
  depth: number;
  isSelected: boolean;
  node: Pick<ProjectTreeNode, "type" | "name" | "path">;
  isExpanded?: boolean;
  hasChildren?: boolean;
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
  if (!isFolder || !hasChildren) {
    return <span className="inline-block w-3 shrink-0" aria-hidden />;
  }

  return (
    <span
      className="inline-flex w-3 shrink-0 items-center justify-center text-[10px] text-muted"
      aria-hidden
    >
      {isExpanded ? "▾" : "▸"}
    </span>
  );
}

function TreeRow({
  label,
  depth,
  isSelected,
  node,
  isExpanded = false,
  hasChildren = false,
  onClick,
  labelClassName = "",
}: TreeRowProps) {
  const isFolder = node.type === "folder";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center border-l-2 py-1.5 pr-2 text-left font-mono text-meta transition-colors ${
        isSelected
          ? "border-accent bg-accent-muted/50 text-text"
          : "border-transparent text-muted hover:border-border-soft hover:bg-surface/60 hover:text-text"
      }`}
      style={{ paddingLeft: `${depth * 12 + 8}px` }}
      aria-current={isSelected ? "true" : undefined}
    >
      <TreeChevron
        isFolder={isFolder}
        hasChildren={hasChildren}
        isExpanded={isExpanded}
      />
      <FileTreeIcon node={node} expanded={isExpanded} size={18} />
      <span className={`ml-2 truncate ${labelClassName}`.trim()}>{label}</span>
    </button>
  );
}

function TreeNode({
  node,
  depth,
  selectedPath,
  expandedPaths,
  onSelect,
  onToggle,
}: TreeNodeProps) {
  const isFolder = node.type === "folder";
  const isSelected = selectedPath === node.path;
  const isExpanded = isFolder && expandedPaths.has(node.path);
  const hasChildren = isFolder && (node.children?.length ?? 0) > 0;

  const handleClick = () => {
    onSelect(node.path);
    if (isFolder && hasChildren) {
      onToggle(node.path);
    }
  };

  return (
    <div>
      <TreeRow
        label={node.name}
        depth={depth}
        isSelected={isSelected}
        node={node}
        isExpanded={isExpanded}
        hasChildren={hasChildren}
        onClick={handleClick}
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
              onSelect={onSelect}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const ROOT_NODE: Pick<ProjectTreeNode, "type" | "name" | "path"> = {
  type: "folder",
  name: "root",
  path: "",
};

export function FileTree({
  tree,
  selectedPath,
  expandedPaths,
  onSelect,
  onToggle,
}: FileTreeProps) {
  return (
    <nav aria-label="Project file tree" className="min-h-0 flex-1 overflow-y-auto">
      <TreeRow
        label="root"
        depth={0}
        isSelected={selectedPath === ""}
        node={ROOT_NODE}
        isExpanded={false}
        hasChildren={tree.length > 0}
        onClick={() => onSelect("")}
        labelClassName="font-semibold uppercase tracking-wider"
      />

      {tree.map((node) => (
        <TreeNode
          key={node.path}
          node={node}
          depth={0}
          selectedPath={selectedPath}
          expandedPaths={expandedPaths}
          onSelect={onSelect}
          onToggle={onToggle}
        />
      ))}
    </nav>
  );
}
