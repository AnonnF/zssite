import { siteContent as siteZh, type SiteContent } from "../site";
import { profileEn } from "./profile";
import { isPublicAnalyzerEnabled } from "@/lib/siteFeatures";

export const siteContentEn: SiteContent = {
  ...siteZh,
  nav: [
    { label: "Home", href: "/" },
    { label: "Projects", href: "/projects" },
    ...(isPublicAnalyzerEnabled()
      ? [{ label: "Analyzer", href: "/analyzer" }]
      : []),
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  languageToggle: {
    zh: "中",
    en: "EN",
    zhLabel: "Switch to Chinese",
    enLabel: "Current language: English",
  },
  hero: {
    // English locale leads with the Latin name and keeps the Chinese name as the secondary line.
    title: profileEn.nameEn,
    nameEn: profileEn.nameZh,
    subtitle: profileEn.identity,
    label: "PERSONAL SITE / ENGINEERING ARCHIVE",
    description: profileEn.tagline,
    keywords: profileEn.directions,
  },
  aboutPreview: {
    label: "ABOUT",
    items: [
      `${profileEn.nameEn} / ${profileEn.nameZh}`,
      profileEn.identity,
      profileEn.directions.join(" · "),
      profileEn.tagline,
    ],
    cta: "View full resume",
  },
  contactPage: {
    label: "CONTACT",
    title: "Contact",
    intro: "Feel free to reach out through the channels below. For my full background, see the ",
    aboutLinkText: "About page",
    outro: ".",
  },
  seo: {
    title: "ZSsite — Zhan Shi",
    description: `Personal website and engineering project archive of ${profileEn.nameEn} (${profileEn.nameZh}). ${profileEn.identity}, focused on systems foundations, backend engineering and LLM / Agent applications.`,
  },
  footer: {
    copyright: "© 2026 ZSsite",
    links: siteZh.footer.links,
  },
  backToHome: "Back to home",
  projectsPage: {
    title: "Projects",
    label: "PROJECT ARCHIVE",
    description:
      "Engineering projects in systems, backend and AI applications, including course team projects and personal projects. Each entry records the project's goals, technical choices and what I learned.",
    listLabel: "Portfolio Projects",
    listDescription:
      "Ordered by start date, most recent first, spanning systems software, compilers, backend and AI applications, plus a few personal explorations.",
    detailComingSoon: "ENTER CASE →",
    viewDetail: "ENTER CASE →",
  },
  projectDetail: {
    backToProjects: "Back to projects",
    caseLabel: "PROJECT CASE",
    walkthroughLabel: "PROJECT WALKTHROUGH",
    walkthroughUnavailable: "The code walkthrough for this project is not available yet.",
    walkthroughZhOnly: "The code walkthrough is currently available in Chinese only.",
    viewChineseVersion: "View the Chinese version →",
  },
  analyzerPage: {
    title: "Public Repository Analyzer",
    label: "PUBLIC REPOSITORY ANALYZER",
    description:
      "Analyses the structure of public GitHub repositories and archives the results as analysis records. Tool-generated or imported results live in the Analysis Library, separate from portfolio project data.",
    libraryLabel: "Analysis Library",
    libraryDescription:
      "Records of repositories that have been analysed. These are tool outputs and imported archives, not the same as the Projects page.",
    viewDetail: "View analysis →",
    unavailable: "Analysis data is not ready yet",
  },
  analyzerDetail: {
    backToAnalyzer: "Back to analysis library",
    analysisLabel: "REPOSITORY ANALYSIS",
    analysisUnavailable: "Structural data for this analysis record is not ready yet.",
  },
  placeholders: {
    about: { label: "ABOUT", title: "About", message: "This page is coming soon." },
    contact: { label: "CONTACT", title: "Contact", message: "This page is coming soon." },
  },
};
