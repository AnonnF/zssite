import type { Metadata } from "next";
import { getPortfolioProjects, getSiteContent } from "@/content";
import { buildAlternates } from "@/lib/i18n/href";
import { resolveLocale, type LocaleParams } from "@/lib/i18n/params";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { BackToHomeLink } from "@/components/layout/BackToHomeLink";
import { ArchivePath } from "@/components/ui/ArchivePath";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const { projectsPage } = getSiteContent(locale);
  return {
    title: `${projectsPage.title} — ZSsite`,
    description: projectsPage.description,
    alternates: buildAlternates(locale, "/projects"),
  };
}

export default async function ProjectsPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const portfolioProjects = getPortfolioProjects(locale);
  const {
    title,
    label,
    description,
    listLabel,
    listDescription,
    detailComingSoon,
    viewDetail,
  } = getSiteContent(locale).projectsPage;

  return (
    <div className="mx-auto max-w-content px-6 py-section md:px-12 lg:px-16">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <BackToHomeLink locale={locale} />
        <ArchivePath
          locale={locale}
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
        <SectionLabel>{listLabel}</SectionLabel>
        <p className="mt-3 max-w-2xl font-[family-name:var(--font-body-sc)] text-body text-muted">
          {listDescription}
        </p>
        <div className="mt-6 flex flex-col gap-5 md:gap-6">
          {portfolioProjects.map((project, index) => (
            <ProjectCard
              key={project.slug}
              project={project}
              index={index}
              detailComingSoon={detailComingSoon}
              viewDetail={viewDetail}
              locale={locale}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
