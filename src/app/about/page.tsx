import Link from "next/link";
import { profile } from "@/content/profile";
import { resumePage } from "@/content/resume";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Divider } from "@/components/ui/Divider";
import { Tag } from "@/components/ui/Tag";
import { BackToHomeLink } from "@/components/layout/BackToHomeLink";
import { ResumeSection } from "@/components/about/ResumeSection";

export default function AboutPage() {
  const { label, title, subtitle, summary, directions, sectionLabels } =
    resumePage;

  return (
    <div className="mx-auto max-w-content px-6 py-section md:px-12 lg:px-16">
      <BackToHomeLink className="mb-6" />

      <header className="border-b border-border-soft pb-8 md:pb-10">
        <SectionLabel withAccent>{label}</SectionLabel>
        <h1 className="mt-4 font-[family-name:var(--font-body-sc)] text-h1 font-black tracking-tight md:text-[3rem]">
          {title}
        </h1>
        <p className="mt-3 font-mono text-meta uppercase tracking-wider text-muted">
          {subtitle}
        </p>

        <Divider accent className="my-6" />

        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
          <h2 className="font-[family-name:var(--font-body-sc)] text-h2 font-black tracking-tight">
            {profile.nameZh}
          </h2>
          <span className="font-display text-h3 font-semibold uppercase tracking-wide text-muted">
            {profile.nameEn}
          </span>
        </div>

        <p className="mt-3 font-mono text-meta text-accent">{profile.identity}</p>

        <p className="mt-5 max-w-3xl font-[family-name:var(--font-body-sc)] text-body leading-relaxed text-muted md:text-lg">
          {summary}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {directions.map((item, index) => (
            <Tag key={item} variant={index === 0 ? "accent" : "default"}>
              {item}
            </Tag>
          ))}
        </div>
      </header>

      <div className="mt-10 flex flex-col gap-5 md:mt-12 md:gap-6">
        <ResumeSection id="education" label={sectionLabels.education}>
          <ul className="space-y-5">
            {resumePage.education.map((entry) => (
              <li
                key={entry.institution}
                className="border-b border-border-soft pb-5 last:border-b-0 last:pb-0"
              >
                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="font-[family-name:var(--font-body-sc)] text-body font-bold text-text md:text-lg">
                      {entry.institution}
                    </h3>
                    <p className="mt-1 font-[family-name:var(--font-body-sc)] text-body text-muted">
                      {entry.program}
                    </p>
                  </div>
                  <div className="font-mono text-meta text-muted md:text-right">
                    <p>{entry.period}</p>
                    {entry.location ? <p className="mt-1">{entry.location}</p> : null}
                  </div>
                </div>
                {entry.note ? (
                  <p className="mt-2 font-mono text-meta text-accent">{entry.note}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </ResumeSection>

        <ResumeSection id="coursework" label={sectionLabels.coursework}>
          <div className="flex flex-wrap gap-2">
            {resumePage.coursework.map((course, index) => (
              <Tag key={course} variant={index === 0 ? "accent" : "default"}>
                {course}
              </Tag>
            ))}
          </div>
        </ResumeSection>

        <ResumeSection id="skills" label={sectionLabels.skills}>
          <div className="grid gap-5 md:grid-cols-2">
            {resumePage.skills.map((category) => (
              <div
                key={category.id}
                className="border border-border-soft bg-surface/20 p-4 md:p-5"
              >
                <p className="font-mono text-meta uppercase tracking-wider text-muted">
                  {category.label}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {category.items.map((item, index) => (
                    <Tag key={item} variant={index === 0 ? "accent" : "default"}>
                      {item}
                    </Tag>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ResumeSection>

        <ResumeSection id="publications" label={sectionLabels.publications}>
          <ul className="space-y-5">
            {resumePage.publications.map((paper) => (
              <li
                key={paper.id}
                className="border-b border-border-soft pb-5 last:border-b-0 last:pb-0"
              >
                <h3 className="font-[family-name:var(--font-body-sc)] text-body font-bold leading-relaxed text-text md:text-lg">
                  {paper.title}
                </h3>
                <p className="mt-2 font-mono text-meta text-muted">
                  {paper.journal}, {paper.year} · {paper.pages}
                </p>
                <p className="mt-2 font-mono text-meta">
                  DOI:{" "}
                  <a
                    href={paper.doiUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent underline-offset-4 hover:underline"
                  >
                    {paper.doi}
                  </a>
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {paper.topics.map((topic, index) => (
                    <Tag key={topic} variant={index === 0 ? "accent" : "default"}>
                      {topic}
                    </Tag>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </ResumeSection>

        <ResumeSection id="contact" label={sectionLabels.contact}>
          <dl className="grid gap-4 font-mono text-meta md:grid-cols-2">
            <div>
              <dt className="uppercase tracking-wider text-muted">Email</dt>
              <dd className="mt-1">
                <a
                  href={`mailto:${resumePage.contact.email}`}
                  className="text-text transition-colors hover:text-accent"
                >
                  {resumePage.contact.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="uppercase tracking-wider text-muted">GitHub</dt>
              <dd className="mt-1">
                <a
                  href={resumePage.contact.github.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text transition-colors hover:text-accent"
                >
                  {resumePage.contact.github.href.replace("https://", "")}
                </a>
              </dd>
            </div>
            <div>
              <dt className="uppercase tracking-wider text-muted">LinkedIn</dt>
              <dd className="mt-1">
                <a
                  href={resumePage.contact.linkedIn.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text transition-colors hover:text-accent"
                >
                  {resumePage.contact.linkedIn.href.replace("https://", "")}
                </a>
              </dd>
            </div>
            <div>
              <dt className="uppercase tracking-wider text-muted">Resume</dt>
              <dd className="mt-1 text-muted">
                {resumePage.contact.resumeDownload.available ? (
                  <Link
                    href={resumePage.contact.resumeDownload.href ?? "#"}
                    className="text-text transition-colors hover:text-accent"
                  >
                    Download PDF
                  </Link>
                ) : (
                  <span>{resumePage.contact.resumeDownload.label}</span>
                )}
              </dd>
            </div>
          </dl>
        </ResumeSection>
      </div>
    </div>
  );
}
