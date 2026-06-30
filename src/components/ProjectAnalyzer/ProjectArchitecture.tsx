"use client";

import { useMemo, useState } from "react";
import type { ProjectPipelineNode } from "@/data/projects/types";
import { resolveActivePipelineNodeId } from "@/data/projects";
import { Tag } from "@/components/ui/Tag";

interface ProjectArchitectureProps {
  pipeline: ProjectPipelineNode[];
  selectedPath: string;
  onNodeClick: (path: string) => void;
}

function PipelineArrow() {
  return (
    <div
      className="flex shrink-0 items-center self-center px-1 text-muted"
      aria-hidden="true"
    >
      <svg
        width="20"
        height="12"
        viewBox="0 0 20 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 6H16M16 6L11 1.5M16 6L11 10.5"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export function ProjectArchitecture({
  pipeline,
  selectedPath,
  onNodeClick,
}: ProjectArchitectureProps) {
  const [expanded, setExpanded] = useState(true);

  const activeNodeId = useMemo(
    () => resolveActivePipelineNodeId(pipeline, selectedPath),
    [pipeline, selectedPath]
  );

  if (pipeline.length === 0) return null;

  return (
    <section id="project-architecture" className="scroll-mt-24 border-t border-border-soft">
      <div className="flex items-start justify-between gap-3 px-4 py-3 md:px-5">
        <div>
          <p className="font-mono text-meta uppercase tracking-wider text-muted">
            Project Architecture
          </p>
          <p className="mt-1 font-[family-name:var(--font-body-sc)] text-body text-muted">
            How the main modules connect
          </p>
        </div>
        <button
          type="button"
          className="tree-header-action shrink-0"
          aria-expanded={expanded}
          aria-label={expanded ? "Collapse architecture" : "Expand architecture"}
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? "Collapse" : "Expand"}
        </button>
      </div>

      <div
        className="grid transition-[grid-template-rows] duration-300 ease-in-out"
        style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="border-t border-border-soft bg-surface/20 px-4 pb-4 pt-3 md:px-5 md:pb-5">
            <div className="overflow-x-auto pb-1">
              <div className="flex min-w-min items-stretch">
                {pipeline.map((node, index) => (
                  <div key={node.id} className="flex items-stretch">
                    <button
                      type="button"
                      className={`pipeline-node flex w-[11.5rem] shrink-0 flex-col gap-2 border px-3 py-3 text-left transition-colors duration-200 md:w-[12.5rem] ${
                        activeNodeId === node.id
                          ? "pipeline-node--active"
                          : "border-border-soft bg-bg/50 hover:border-border-strong hover:bg-surface/60"
                      }`}
                      onClick={() => onNodeClick(node.path)}
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-display text-body font-bold leading-tight text-text">
                          {node.label}
                        </span>
                        <Tag variant="accent" className="shrink-0">
                          {node.language}
                        </Tag>
                      </div>
                      <p className="font-[family-name:var(--font-body-sc)] text-meta leading-relaxed text-muted">
                        {node.role}
                      </p>
                    </button>
                    {index < pipeline.length - 1 && <PipelineArrow />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
