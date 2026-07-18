import { siteContent } from "@/content/site";
import { portfolioProjects } from "@/content/projects";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { BackToHomeLink } from "@/components/layout/BackToHomeLink";
import { ArchivePath } from "@/components/ui/ArchivePath";

export default function ProjectsPage() {
  const { title, label, description, detailComingSoon, viewDetail } =
    siteContent.projectsPage;

  return (
    <div className="mx-auto max-w-content px-6 py-section md:px-12 lg:px-16">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <BackToHomeLink />
        <ArchivePath
          segments={[
            { label: "Archive", href: "/" },
            { label: "Projects" },
          ]}
        />
      </div>

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
            {String(portfolioProjects.length).padStart(2, "0")}
          </span>{" "}
          ENTRIES
        </p>
      </header>

      <section className="mt-10 md:mt-12">
        <SectionLabel>Portfolio Projects</SectionLabel>
        <p className="mt-3 max-w-2xl font-[family-name:var(--font-body-sc)] text-body text-muted">
          大学阶段完成的工程项目、AI 应用与 Web 产品。这里记录每个项目的目标、技术选择、结构分析和能力成长。
        </p>
        <div className="mt-6 flex flex-col gap-5 md:gap-6">
          {portfolioProjects.map((project, index) => (
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
    </div>
  );
}
