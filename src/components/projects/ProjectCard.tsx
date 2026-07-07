import Link from "next/link";
import type { PortfolioProject } from "@/content/projects";
import { hasPortfolioWalkthrough } from "@/data/projects";
import { Tag } from "@/components/ui/Tag";
import { Divider } from "@/components/ui/Divider";

interface ProjectCardProps {
  project: PortfolioProject;
  index: number;
  detailComingSoon: string;
  viewDetail: string;
}

export function ProjectCard({
  project,
  index,
  detailComingSoon,
  viewDetail,
}: ProjectCardProps) {
  const displayNumber = String(index + 1).padStart(2, "0");
  const hasWalkthrough = hasPortfolioWalkthrough(project.slug);
  const footerLabel = hasWalkthrough ? viewDetail : detailComingSoon;

  const card = (
    <article className="panel-card panel-card-interactive group relative overflow-hidden">
      <span className="accent-mark-corner opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="flex flex-col lg:flex-row">
        <div className="flex items-center justify-between gap-4 border-b border-border-soft px-5 py-4 font-mono text-meta lg:w-44 lg:flex-col lg:items-start lg:border-b-0 lg:border-r lg:py-6">
          <span className="text-3xl font-bold leading-none text-accent">
            {displayNumber}
          </span>
          <span className="font-semibold text-accent">{project.period}</span>
          <span className="uppercase text-muted">{project.type}</span>
          <span className="rounded-sm border border-border-soft px-1.5 py-0.5 uppercase text-muted transition-colors group-hover:border-accent/40 group-hover:text-text">
            {project.status}
          </span>
        </div>

        <div className="flex-1 p-5 md:p-6 lg:p-7">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-h3 font-bold uppercase tracking-tight text-text transition-colors group-hover:text-text md:text-h2">
                {project.title}
              </h2>
              {project.subtitle ? (
                <p className="mt-1 font-[family-name:var(--font-body-sc)] text-sm text-muted md:text-body">
                  {project.subtitle}
                </p>
              ) : null}
            </div>
            {project.ref && (
              <span className="font-mono text-meta text-muted">{project.ref}</span>
            )}
          </div>

          <p className="mt-2 font-mono text-meta text-muted">{project.context}</p>

          <Divider accent className="my-4" />

          <p className="font-[family-name:var(--font-body-sc)] text-body leading-relaxed text-muted">
            {project.summary}
          </p>

          <ul className="mt-4 space-y-1.5 font-[family-name:var(--font-body-sc)] text-body text-muted">
            {project.highlights.slice(0, 3).map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-accent">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-5 flex flex-wrap gap-2">
            {project.techStack.map((tech, i) => (
              <Tag key={tech} variant={i === 0 ? "accent" : "default"}>
                {tech}
              </Tag>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-border-soft pt-4">
            <span className="enter-indicator">{footerLabel}</span>
            <span className="font-mono text-lg text-accent opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1">
              →
            </span>
          </div>
        </div>
      </div>
    </article>
  );

  return (
    <Link href={`/projects/${project.slug}`} className="block">
      {card}
    </Link>
  );
}
