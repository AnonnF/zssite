import { siteContent } from "@/content/site";
import { projects } from "@/content/projects";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ProjectCard } from "@/components/projects/ProjectCard";

export default function ProjectsPage() {
  const { title, label, description, detailComingSoon } = siteContent.projectsPage;

  return (
    <div className="mx-auto max-w-content px-6 py-section md:px-12 lg:px-16">
      <header className="border-b border-border-soft pb-8 md:pb-10">
        <SectionLabel withAccent>{label}</SectionLabel>
        <h1 className="mt-4 font-[family-name:var(--font-body-sc)] text-h1 font-black tracking-tight md:text-[3rem]">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl font-[family-name:var(--font-body-sc)] text-body leading-relaxed text-muted md:text-lg">
          {description}
        </p>
        <p className="mt-5 font-mono text-meta text-muted">
          TOTAL:{" "}
          <span className="font-semibold text-accent">
            {String(projects.length).padStart(2, "0")}
          </span>{" "}
          ENTRIES
        </p>
      </header>

      <div className="mt-10 flex flex-col gap-5 md:mt-12 md:gap-6">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.slug}
            project={project}
            index={index}
            detailComingSoon={detailComingSoon}
          />
        ))}
      </div>
    </div>
  );
}
