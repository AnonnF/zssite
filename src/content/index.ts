import type { Locale } from "@/lib/i18n/config";
import { siteContent, type SiteContent } from "./site";
import { homeContent, type HomeContent } from "./home";
import { profile, type Profile } from "./profile";
import { resumePage } from "./resume";
import {
  portfolioProjects,
  getPortfolioProjectBySlug as getBaseProjectBySlug,
  type PortfolioProject,
} from "./projects";
import { siteContentEn } from "./en/site";
import { homeContentEn } from "./en/home";
import { profileEn } from "./en/profile";
import { resumePageEn } from "./en/resume";
import { projectTranslationsEn } from "./en/projects";

/**
 * Locale-aware content accessors. Chinese files in this directory are the source;
 * `./en/*` overrides translatable copy only.
 */

export function getSiteContent(locale: Locale): SiteContent {
  return locale === "en" ? siteContentEn : siteContent;
}

export function getHomeContent(locale: Locale): HomeContent {
  return locale === "en" ? homeContentEn : homeContent;
}

export function getProfile(locale: Locale): Profile {
  return locale === "en" ? profileEn : profile;
}

export function getResumePage(locale: Locale): typeof resumePage {
  return locale === "en" ? resumePageEn : resumePage;
}

function localizeProject(
  project: PortfolioProject,
  locale: Locale
): PortfolioProject {
  if (locale !== "en") return project;
  const translation = projectTranslationsEn[project.slug];
  return translation ? { ...project, ...translation } : project;
}

export function getPortfolioProjects(locale: Locale): PortfolioProject[] {
  return portfolioProjects.map((project) => localizeProject(project, locale));
}

export function getLocalizedProjectBySlug(
  slug: string,
  locale: Locale
): PortfolioProject | undefined {
  const project = getBaseProjectBySlug(slug);
  return project ? localizeProject(project, locale) : undefined;
}
