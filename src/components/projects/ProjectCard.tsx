import Link from "next/link";
import type { PortfolioProject } from "@/content/projects";
import { hasPortfolioWalkthrough } from "@/data/projects/analyzerAvailability";
import { Tag } from "@/components/ui/Tag";
import { Divider } from "@/components/ui/Divider";
import {
  TechnicalThumbnail,
  resolveTechnicalVisual,
} from "@/components/ui/TechnicalThumbnail";

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
  const visual = resolveTechnicalVisual(project.slug, project.type);
  const isLive = project.status === "ongoing";

  return (
    <Link href={`/projects/${project.slug}`} className="block">
      <article className="panel-card panel-card-interactive group relative overflow-hidden archive-frame">
        <span className="accent-mark-corner opacity-0 transition-opacity group-hover:opacity-100" />

        <div className="flex flex-col xl:flex-row">
          <div className="panel-rail flex items-center justify-between gap-4 px-4 py-4 font-mono text-meta xl:w-48 xl:shrink-0 xl:flex-col xl:items-stretch xl:gap-3 xl:px-5 xl:py-6">
            <div className="flex items-baseline gap-2 xl:flex-col xl:gap-1">
              <span className="text-[0.5625rem] uppercase tracking-[0.16em] text-muted">
                CASE
              </span>
              <span className="archive-index text-3xl xl:text-4xl">{displayNumber}</span>
            </div>
            <span className="break-words font-semibold tracking-[0.04em] text-accent">
              {project.period}
            </span>
            <span className="uppercase tracking-[0.04em] text-muted">{project.type}</span>
            <span className={`status-tag w-fit ${isLive ? "status-tag--live" : ""}`}>
              {project.status}
            </span>
          </div>

          <div className="flex min-w-0 flex-1 flex-col lg:flex-row">
            <div className="flex-1 p-5 md:p-6 lg:p-7">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-h3 font-bold uppercase tracking-tight text-text md:text-h2">
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
            </div>

            <div className="border-t border-border-soft p-4 lg:w-64 lg:border-l lg:border-t-0 lg:p-5 xl:w-72">
              <p className="mb-2 font-mono text-[0.625rem] uppercase tracking-[0.1em] text-muted">
                Structure Preview
              </p>
              <TechnicalThumbnail
                variant={visual}
                className="h-[7rem] w-full lg:h-[9.5rem]"
              />
            </div>
          </div>
        </div>

        <div className="panel-meta-strip flex items-center justify-between px-5 py-3.5 md:px-6">
          <span className="enter-indicator">{footerLabel}</span>
          <span className="accent-signal-line" aria-hidden="true" />
        </div>
      </article>
    </Link>
  );
}
