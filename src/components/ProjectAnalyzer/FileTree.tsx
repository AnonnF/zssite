"use client";

import type { ProjectTreeNode } from "@/data/projects/types";

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
      <button
        type="button"
        onClick={handleClick}
        className={`flex w-full items-center gap-1.5 border-l-2 py-1.5 pr-2 text-left font-mono text-meta transition-colors ${
          isSelected
            ? "border-accent bg-accent-muted/50 text-text"
            : "border-transparent text-muted hover:border-border-soft hover:bg-surface/60 hover:text-text"
        }`}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        aria-current={isSelected ? "true" : undefined}
      >
        {isFolder ? (
          <span className="w-3 shrink-0 text-center text-[10px] text-accent" aria-hidden>
            {hasChildren ? (isExpanded ? "▾" : "▸") : "·"}
          </span>
        ) : (
          <span className="w-3 shrink-0 text-center text-[10px] text-muted/60" aria-hidden>
            ·
          </span>
        )}
        <span className="truncate">{node.name}</span>
      </button>

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

export function FileTree({
  tree,
  selectedPath,
  expandedPaths,
  onSelect,
  onToggle,
}: FileTreeProps) {
  return (
    <nav aria-label="Project file tree" className="min-h-0 flex-1 overflow-y-auto">
      <button
        type="button"
        onClick={() => onSelect("")}
        className={`mb-1 flex w-full items-center gap-1.5 border-l-2 py-1.5 pl-2 pr-2 text-left font-mono text-meta transition-colors ${
          selectedPath === ""
            ? "border-accent bg-accent-muted/50 text-text"
            : "border-transparent text-muted hover:border-border-soft hover:bg-surface/60 hover:text-text"
        }`}
        aria-current={selectedPath === "" ? "true" : undefined}
      >
        <span className="w-3 shrink-0 text-center text-[10px] text-accent" aria-hidden>
          ▸
        </span>
        <span className="truncate font-semibold uppercase tracking-wider">root</span>
      </button>

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
