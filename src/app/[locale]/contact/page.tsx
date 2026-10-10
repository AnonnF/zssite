import Link from "next/link";
import type { Metadata } from "next";
import { getProfile, getSiteContent } from "@/content";
import { buildAlternates, localizeHref } from "@/lib/i18n/href";
import { resolveLocale, type LocaleParams } from "@/lib/i18n/params";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { BackToHomeLink } from "@/components/layout/BackToHomeLink";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return {
    title: `${getSiteContent(locale).contactPage.title} — ZSsite`,
    alternates: buildAlternates(locale, "/contact"),
  };
}

export default async function ContactPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const profile = getProfile(locale);
  const { label, title, intro, aboutLinkText, outro } =
    getSiteContent(locale).contactPage;

  return (
    <div className="mx-auto max-w-content px-6 py-section md:px-12 lg:px-16">
      <BackToHomeLink className="mb-6" locale={locale} />

      <SectionLabel withAccent>{label}</SectionLabel>
      <h1 className="mt-3 font-[family-name:var(--font-body-sc)] text-h1 font-black">
        {title}
      </h1>
      <p className="mt-4 max-w-2xl font-[family-name:var(--font-body-sc)] text-body text-muted">
        {intro}
        <Link
          href={localizeHref(locale, "/about")}
          className="text-accent underline-offset-4 hover:underline"
        >
          {aboutLinkText}
        </Link>
        {outro}
      </p>

      <dl className="panel-card mt-8 grid gap-5 p-5 font-mono text-meta md:grid-cols-2 md:p-6">
        <div>
          <dt className="uppercase tracking-wider text-muted">Email</dt>
          <dd className="mt-1">
            <a
              href={`mailto:${profile.email}`}
              className="text-text transition-colors hover:text-accent"
            >
              {profile.email}
            </a>
          </dd>
        </div>
        <div>
          <dt className="uppercase tracking-wider text-muted">GitHub</dt>
          <dd className="mt-1">
            <a
              href={profile.github.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text transition-colors hover:text-accent"
            >
              {profile.github.href.replace("https://", "")}
            </a>
          </dd>
        </div>
        <div>
          <dt className="uppercase tracking-wider text-muted">LinkedIn</dt>
          <dd className="mt-1">
            <a
              href={profile.linkedIn.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text transition-colors hover:text-accent"
            >
              {profile.linkedIn.href.replace("https://", "")}
            </a>
          </dd>
        </div>
        <div>
          <dt className="uppercase tracking-wider text-muted">Resume</dt>
          <dd className="mt-1 text-muted">{profile.resumeDownload.label}</dd>
        </div>
      </dl>
    </div>
  );
}
