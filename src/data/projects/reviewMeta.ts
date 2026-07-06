import type { ReviewMeta, ReviewStatus } from "./types";

export function getReviewLabel(status: ReviewStatus): string {
  switch (status) {
    case "generated":
      return "GENERATED";
    case "template":
      return "TEMPLATE";
    case "ai-draft":
      return "AI DRAFT";
    case "manual":
      return "MANUAL";
    case "human-reviewed":
      return "HUMAN REVIEWED";
    case "needs-review":
      return "NEEDS REVIEW";
    default:
      return status;
  }
}

export function getReviewBadgeClass(status: ReviewStatus): string {
  return `review-badge review-badge--${status}`;
}

export function getReviewTitle(review: ReviewMeta): string | undefined {
  const parts: string[] = [];

  if (review.source) {
    parts.push(`Source: ${review.source}`);
  }
  if (review.reviewedAt) {
    parts.push(`Reviewed: ${review.reviewedAt}`);
  }
  if (review.reviewer) {
    parts.push(`Reviewer: ${review.reviewer}`);
  }
  if (review.note) {
    parts.push(review.note);
  }

  return parts.length > 0 ? parts.join(" · ") : undefined;
}

export const GENERATED_REVIEW: ReviewMeta = {
  status: "generated",
  source: "generated",
};

export const TEMPLATE_REVIEW: ReviewMeta = {
  status: "template",
  source: "template",
};

export const MANUAL_REVIEW: ReviewMeta = {
  status: "manual",
  source: "manual",
};

export const AI_DRAFT_REVIEW: ReviewMeta = {
  status: "ai-draft",
  source: "ai-draft",
};

export function withTemplateReview<T extends { review?: ReviewMeta }>(
  item: T
): T {
  return {
    ...item,
    review: item.review ?? TEMPLATE_REVIEW,
  };
}
