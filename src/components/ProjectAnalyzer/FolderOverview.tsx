import type { ProjectTreeNode } from "@/data/projects/types";

interface FolderOverviewProps {
  path: string;
  items: ProjectTreeNode[];
}

export function FolderOverview({ path, items }: FolderOverviewProps) {
  const folderCount = items.filter((c) => c.type === "folder").length;
  const fileCount = items.filter((c) => c.type === "file").length;

  return (
    <section className="flex h-full min-h-0 flex-col">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-soft bg-surface/40 px-4 py-2.5 md:px-5">
        <span className="font-mono text-meta uppercase tracking-wider text-muted">
          Folder Overview
        </span>
        <span className="font-mono text-meta text-muted">
          {path || "/"}
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 md:px-5 md:py-5">
        <div className="flex flex-wrap gap-4 border-b border-border-soft pb-4">
          <div>
            <p className="font-mono text-meta uppercase tracking-wider text-muted">
              Folders
            </p>
            <p className="mt-1 font-display text-h2 font-bold text-accent">
              {String(folderCount).padStart(2, "0")}
            </p>
          </div>
          <div>
            <p className="font-mono text-meta uppercase tracking-wider text-muted">
              Files
            </p>
            <p className="mt-1 font-display text-h2 font-bold text-text">
              {String(fileCount).padStart(2, "0")}
            </p>
          </div>
        </div>

        {items.length > 0 ? (
          <ul className="mt-4 divide-y divide-border-soft">
            {items.map((child) => (
              <li
                key={child.path}
                className="flex items-center justify-between gap-3 py-2.5"
              >
                <span className="font-mono text-body text-text">{child.name}</span>
                <span className="shrink-0 border border-border-soft px-1.5 py-0.5 font-mono text-meta uppercase tracking-wider text-muted">
                  {child.type}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 font-mono text-meta text-muted">
            This folder is empty.
          </p>
        )}

        <p className="mt-6 border-t border-border-soft pt-4 font-mono text-meta uppercase tracking-wider text-muted">
          Select a file in the tree to view its code preview.
        </p>
      </div>
    </section>
  );
}
