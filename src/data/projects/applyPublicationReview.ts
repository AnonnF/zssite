import type { ProjectAnalyzerData, ReviewMeta } from "./types";
import type { ProjectPublicationFlag } from "./projectPublicationFlags";

function shouldPreserveReview(review?: ReviewMeta): boolean {
  return review?.source === "manual";
}

export function reviewFromPublicationFlags(
  flags: ProjectPublicationFlag
): ReviewMeta {
  if (flags.humanReviewed) {
    return {
      status: "human-reviewed",
      source: "mixed",
      note: "该分析已由人工审核。",
    };
  }

  return {
    status: "ai-draft",
    source: "ai-draft",
    note: flags.note ?? "该分析由 AI 自动生成，尚未人工审核。",
  };
}

function resolveReview(
  existing: ReviewMeta | undefined,
  flags: ProjectPublicationFlag
): ReviewMeta {
  if (shouldPreserveReview(existing)) {
    return existing!;
  }

  return reviewFromPublicationFlags(flags);
}

export function applyPublicationReview(
  data: ProjectAnalyzerData,
  flags: ProjectPublicationFlag
): ProjectAnalyzerData {
  const defaultReview = reviewFromPublicationFlags(flags);

  const entries = Object.fromEntries(
    Object.entries(data.entries).map(([path, entry]) => [
      path,
      {
        ...entry,
        review: resolveReview(entry.review, flags),
        snippets: entry.snippets?.map((snippet) => ({
          ...snippet,
          review: resolveReview(snippet.review, flags),
        })),
      },
    ])
  );

  let narrative = data.narrative;
  if (narrative) {
    narrative = {
      technicalDecisions: narrative.technicalDecisions?.map((item) => ({
        ...item,
        review: resolveReview(item.review, flags),
      })),
      skills: narrative.skills?.map((item) => ({
        ...item,
        review: resolveReview(item.review, flags),
      })),
    };
  }

  return {
    ...data,
    review: shouldPreserveReview(data.review) ? data.review : defaultReview,
    entries,
    narrative,
  };
}
