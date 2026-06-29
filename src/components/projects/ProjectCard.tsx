import type { Project } from "@/content/projects";
import { Tag } from "@/components/ui/Tag";
import { Divider } from "@/components/ui/Divider";

interface ProjectCardProps {
  project: Project;
  index: number;
  detailComingSoon: string;
}

export function ProjectCard({ project, index, detailComingSoon }: ProjectCardProps) {
  const refNumber = project.ref ?? `REF-${String(index + 1).padStart(3, "0")}`;

  return (
    <article className="group border border-border bg-bg transition-colors hover:bg-surface">
      <div className="flex flex-col md:flex-row">
        <div className="flex items-center justify-between border-b border-border px-5 py-3 font-mono text-meta md:w-36 md:flex-col md:items-start md:justify-start md:border-b-0 md:border-r md:py-5">
          <span className="font-medium text-text">{refNumber}</span>
          <span className="mt-0 text-muted md:mt-4">{project.year}</span>
          <span className="mt-0 uppercase text-muted md:mt-2">{project.type}</span>
        </div>

        <div className="flex-1 p-5 md:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <h2 className="font-display text-h3 font-bold uppercase tracking-tight md:text-h2">
              {project.title}
            </h2>
            <span className="font-mono text-meta uppercase text-muted">
              {project.status}
            </span>
          </div>

          <Divider className="my-4" />

          <p className="font-[family-name:var(--font-body-sc)] text-body leading-relaxed text-muted">
            {project.summary}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <Tag key={tech}>{tech}</Tag>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-meta uppercase tracking-wider text-muted"
              >
                [{tag}]
              </span>
            ))}
          </div>

          <p className="mt-6 font-mono text-meta font-medium uppercase tracking-wider text-muted">
            {detailComingSoon}
          </p>
        </div>
      </div>
    </article>
  );
}
