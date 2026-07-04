export type ProjectPublicationFlag = {
  enabled: boolean;
  humanReviewed: boolean;
  featured: boolean;
  templateId?: import("./types").ProjectTemplateId;
  note?: string;
};

export const projectPublicationFlags = {
  "wacc-compiler": {
    enabled: true,
    humanReviewed: true,
    featured: true,
    templateId: "compiler-pipeline",
  },
      "resume-jd-matcher": {
    enabled: true,
    humanReviewed: false,
    featured: false,
    templateId: "ai-pipeline",
    note: "AI-generated project analysis, not yet manually reviewed.",
  },
} satisfies Record<string, ProjectPublicationFlag>;

export function getProjectPublicationFlags(
  projectId: string
): ProjectPublicationFlag | undefined {
  return projectPublicationFlags[projectId as keyof typeof projectPublicationFlags];
}
