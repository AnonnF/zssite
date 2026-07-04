import type { ReviewMeta } from "@/data/projects/types";
import { getReviewBadgeClass, getReviewLabel, getReviewTitle } from "@/data/projects/reviewMeta";

interface ReviewBadgeProps {
  review?: ReviewMeta;
  className?: string;
}

export function ReviewBadge({ review, className = "" }: ReviewBadgeProps) {
  if (!review?.status) return null;

  const title = getReviewTitle(review);
  const classes = [getReviewBadgeClass(review.status), className]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={classes} title={title}>
      {getReviewLabel(review.status)}
    </span>
  );
}
