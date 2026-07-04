import type { ProjectAnalysisEntry, ProjectTreeNode } from "@/data/projects/types";
import { getEntryBlurb } from "@/data/projects";

interface FolderOverviewProps {
  path: string;
  items: ProjectTreeNode[];
  selectedPath: string;
  getEntry: (path: string) => ProjectAnalysisEntry;
  onItemClick: (node: ProjectTreeNode) => void;
}

export function FolderOverview({
  path,
  items,
  selectedPath,
  getEntry,
  onItemClick,
}: FolderOverviewProps) {
  const folderCount = items.filter((c) => c.type === "folder").length;
  const fileCount = items.filter((c) => c.type === "file").length;

  return (
    <section className="flex h-full min-h-0 flex-col">
      <div className="analyzer-pane-header">
        <div className="analyzer-pane-header__lead">
          <span className="accent-bar mt-0.5" aria-hidden="true" />
          <span className="analyzer-pane-header__label">Folder Overview</span>
        </div>
        <span className="analyzer-pane-header__meta max-w-[12rem] truncate md:max-w-xs">
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
            {items.map((child) => {
              const blurb = getEntryBlurb(getEntry(child.path));
              const isSelected = selectedPath === child.path;

              return (
                <li key={child.path}>
                  <button
                    type="button"
                    className={`folder-overview-item group w-full py-3 text-left ${
                      isSelected ? "folder-overview-item--selected" : ""
                    }`}
                    onClick={() => onItemClick(child)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <span className="font-mono text-body text-text transition-colors group-hover:text-text">
                          {child.name}
                        </span>
                        <p className="mt-1 font-[family-name:var(--font-body-sc)] text-meta leading-relaxed text-muted">
                          {blurb ?? "暂无说明。"}
                        </p>
                      </div>
                      <span className="shrink-0 border border-border-soft px-1.5 py-0.5 font-mono text-meta uppercase tracking-wider text-muted transition-colors group-hover:border-border-strong">
                        {child.type}
                      </span>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-4 font-mono text-meta text-muted">此文件夹为空。</p>
        )}

        <p className="mt-6 border-t border-border-soft pt-4 font-mono text-meta uppercase tracking-wider text-muted">
          在下方或左侧文件树中选择一项以继续浏览。
        </p>
      </div>
    </section>
  );
}
