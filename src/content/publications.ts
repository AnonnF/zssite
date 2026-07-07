export interface Publication {
  id: string;
  title: string;
  journal: string;
  year: number;
  pages: string;
  doi: string;
  doiUrl: string;
  topics: string[];
}

export const publications: Publication[] = [
  {
    id: "stable-diffusion-keywords",
    title:
      "AI Application to Generate an Expected Picture Using Keywords with Stable Diffusion",
    journal: "Journal of Artificial Intelligence Practice",
    year: 2023,
    pages: "pp. 66–71",
    doi: "10.23977/jaip.2023.060110",
    doiUrl: "http://dx.doi.org/10.23977/jaip.2023.060110",
    topics: ["Stable Diffusion", "Generative AI", "Keyword Control"],
  },
];
