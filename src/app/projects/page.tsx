import { siteContent } from "@/content/site";
import { projects } from "@/content/projects";
import { getProjectPublicationFlags } from "@/data/projects";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ProjectCard } from "@/components/projects/ProjectCard";

function partitionProjects() {
  const curated: typeof projects = [];
  const drafts: typeof projects = [];

  for (const project of projects) {
    const flags = getProjectPublicationFlags(project.slug);
    if (flags?.enabled && flags.featured === false) {
      drafts.push(project);
    } else {
      curated.push(project);
    }
  }

  return { curated, drafts };
}

export default function ProjectsPage() {
  const { title, label, description, detailComingSoon, viewDetail } =
    siteContent.projectsPage;
  const { curated, drafts } = partitionProjects();

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

      <section className="mt-10 md:mt-12">
        <SectionLabel>Curated Projects</SectionLabel>
        <div className="mt-6 flex flex-col gap-5 md:gap-6">
          {curated.map((project, index) => (
            <ProjectCard
              key={project.slug}
              project={project}
              index={index}
              detailComingSoon={detailComingSoon}
              viewDetail={viewDetail}
            />
          ))}
        </div>
      </section>

      {drafts.length > 0 && (
        <section className="mt-12 md:mt-14">
          <SectionLabel>AI Drafts / Imported Projects</SectionLabel>
          <p className="mt-3 max-w-2xl font-[family-name:var(--font-body-sc)] text-body text-muted">
            以下项目由 AI 自动生成分析，尚未进入正式编号列表。
          </p>
          <div className="mt-6 flex flex-col gap-5 md:gap-6">
            {drafts.map((project, index) => (
              <ProjectCard
                key={project.slug}
                project={project}
                index={index}
                showNumber={false}
                detailComingSoon={detailComingSoon}
                viewDetail={viewDetail}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
