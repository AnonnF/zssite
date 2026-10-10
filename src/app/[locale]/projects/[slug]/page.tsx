import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getLocalizedProjectBySlug, getSiteContent } from "@/content";
import { portfolioProjects } from "@/content/projects";
import { hasPortfolioWalkthrough } from "@/data/projects/analyzerAvailability";
import { buildAlternates, localizeHref } from "@/lib/i18n/href";
import { resolveLocale } from "@/lib/i18n/params";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Divider } from "@/components/ui/Divider";
import { Tag } from "@/components/ui/Tag";
import {
  TechnicalThumbnail,
  resolveTechnicalVisual,
} from "@/components/ui/TechnicalThumbnail";
import { BackToHomeLink } from "@/components/layout/BackToHomeLink";
import { ArchivePath } from "@/components/ui/ArchivePath";
import { isPublicAnalyzerEnabled } from "@/lib/siteFeatures";

interface ProjectDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  return portfolioProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const locale = await resolveLocale(params);
  const project = getLocalizedProjectBySlug(slug, locale);

  if (!project) {
    return { title: "Project Not Found — ZSsite" };
  }

  return {
    title: `${project.title} — ZSsite`,
    description: project.summary,
    alternates: buildAlternates(locale, `/projects/${slug}`),
  };
}

function PortfolioSection({
  label,
  items,
}: {
  label: string;
  items: string[];
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="panel-card p-5 md:p-6">
      <p className="font-mono text-meta uppercase tracking-wider text-muted">
        {label}
      </p>
      <ul className="mt-3 space-y-2 font-[family-name:var(--font-body-sc)] text-body leading-relaxed text-muted">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="text-accent">—</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const locale = await resolveLocale(params);
  const project = getLocalizedProjectBySlug(slug, locale);

  if (!project) {
    notFound();
  }

  const visual = resolveTechnicalVisual(project.slug, project.type);
  const embed = isPublicAnalyzerEnabled() && locale === "zh"
    ? await (
        await import("@/components/projects/ProjectAnalyzerEmbed")
      ).loadProjectAnalyzerEmbed({
        slug,
        analysisId: project.analysisId,
        sourceSnapshot: project.sourceSnapshot,
      })
    : null;
  const { backToProjects, caseLabel, walkthroughZhOnly, viewChineseVersion } =
    getSiteContent(locale).projectDetail;
  const showZhOnlyNote =
    locale !== "zh" &&
    isPublicAnalyzerEnabled() &&
    hasPortfolioWalkthrough(project.slug);
  const sectionLabel = embed?.sectionLabel ?? caseLabel;

  return (
    <div
      className={`mx-auto px-6 py-section md:px-12 lg:px-16 ${
        embed?.showNav ? "max-w-content-wide" : "max-w-content"
      }`}
    >
      <nav className="mt-0 flex flex-wrap items-center justify-between gap-x-5 gap-y-3">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <BackToHomeLink locale={locale} />
          <Link
            href={localizeHref(locale, "/projects")}
            className="enter-indicator text-muted transition-colors hover:text-accent"
          >
            ← {backToProjects}
          </Link>
        </div>
        <ArchivePath
          locale={locale}
          segments={[
            { label: "Archive", href: "/" },
            { label: "Projects", href: "/projects" },
            { label: project.title },
          ]}
        />
      </nav>

      {embed?.mobileNav}

      <div className={embed?.showNav ? "project-detail-body" : undefined}>
        <div className="project-detail-main min-w-0">
          <header
            id="project-overview"
            className="scroll-mt-24 mt-6 border-b border-border-soft pb-8 md:pb-10"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <SectionLabel withAccent>{sectionLabel}</SectionLabel>
              {project.ref && (
                <span className="font-mono text-meta text-muted">{project.ref}</span>
              )}
            </div>

            <h1 className="mt-4 font-[family-name:var(--font-body-sc)] text-h1 font-black tracking-tight md:text-[3rem]">
              {project.title}
            </h1>

            {project.subtitle ? (
              <p className="mt-2 font-[family-name:var(--font-body-sc)] text-body text-muted md:text-lg">
                {project.subtitle}
              </p>
            ) : null}

            <dl className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 border-y border-border-soft py-3 font-mono text-meta">
              <div className="flex items-baseline gap-2">
                <dt className="uppercase tracking-wider text-muted">Period</dt>
                <dd className="font-semibold text-accent">{project.period}</dd>
              </div>
              <div className="flex items-baseline gap-2">
                <dt className="uppercase tracking-wider text-muted">Type</dt>
                <dd className="uppercase text-text">{project.type}</dd>
              </div>
              <div className="flex items-baseline gap-2">
                <dt className="uppercase tracking-wider text-muted">Status</dt>
                <dd>
                  <span className="status-chip">
                    <span className="status-chip__dot" aria-hidden="true" />
                    {project.status}
                  </span>
                </dd>
              </div>
              <div className="flex items-baseline gap-2">
                <dt className="uppercase tracking-wider text-muted">Context</dt>
                <dd className="text-muted">{project.context}</dd>
              </div>
            </dl>

            <Divider accent className="my-5" />

            {embed?.beforeSummary}

            <p className="max-w-3xl font-[family-name:var(--font-body-sc)] text-body leading-relaxed text-muted md:text-lg">
              {project.summary}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {project.techStack.map((tech, i) => (
                <Tag key={tech} variant={i === 0 ? "accent" : "default"}>
                  {tech}
                </Tag>
              ))}
            </div>

            <figure className="group mt-6">
              <figcaption className="mb-2 font-mono text-meta uppercase tracking-wider text-muted">
                <span className="text-accent">◆</span> Schematic — {project.type}
              </figcaption>
              <TechnicalThumbnail
                variant={visual}
                className="h-40 w-full md:h-48"
              />
            </figure>

            {embed?.afterFigure}

            {showZhOnlyNote ? (
              <p className="mt-5 font-mono text-meta text-muted">
                {walkthroughZhOnly}{" "}
                <Link
                  href={`/projects/${project.slug}`}
                  hrefLang="zh-CN"
                  className="text-accent underline-offset-4 hover:underline"
                >
                  {viewChineseVersion}
                </Link>
              </p>
            ) : null}
          </header>

          <div className="mt-8 grid gap-5 md:grid-cols-2 md:gap-6">
            <PortfolioSection label="Responsibilities" items={project.responsibilities} />
            <PortfolioSection label="Highlights" items={project.highlights} />
            <PortfolioSection label="Challenges" items={project.challenges} />
            <PortfolioSection
              label="Skills Demonstrated"
              items={project.skillsDemonstrated}
            />
          </div>

          {embed?.body}
        </div>

        {embed?.desktopNav}
      </div>
    </div>
  );
}
