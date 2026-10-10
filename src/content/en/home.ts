import { homeContent as homeZh, type HomeContent } from "../home";

const cardsEn: Record<
  string,
  { title: string; subtitle: string; description: string; categories?: string[] }
> = {
  "about-resume": {
    title: "About & Resume",
    subtitle: "Experience · Education · Skills · Publications",
    description:
      "The full resume: internship experience, education, coursework, skill categories, publications and contact details.",
  },
  "project-archive": {
    title: "Projects",
    subtitle: "Engineering projects · Technical choices · Growth",
    description:
      "A structured archive of engineering projects across systems software, compilers, backend and AI applications, covering course team projects and personal projects, with each project's goals, technical choices and what I learned.",
  },
  "repository-analyzer": {
    title: "Public Repository Analyzer",
    subtitle: "Repository analysis · Structure walkthrough · Analysis Library",
    description:
      "Analyses the structure of public GitHub repositories, generates local CLI commands to import the results, and archives them in the Analysis Library.",
  },
};

export const homeContentEn: HomeContent = {
  ...homeZh,
  entrySectionTitle: "Modules",
  entrySectionDescription:
    "Entry points to my engineering archive, organised by module and extended over time",
  placeholderText: "More modules coming soon",
  cards: homeZh.cards.map((card) => {
    const translation = cardsEn[card.id];
    return translation ? { ...card, ...translation } : card;
  }),
};
