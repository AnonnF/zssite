import Link from "next/link";

interface LinkedToPortfolioBadgeProps {
  portfolioSlug: string;
  className?: string;
}

export function LinkedToPortfolioBadge({
  portfolioSlug,
  className = "",
}: LinkedToPortfolioBadgeProps) {
  return (
    <Link
      href={`/projects/${portfolioSlug}`}
      className={`review-badge review-badge--human-reviewed ${className}`.trim()}
      title="该分析记录关联至作品集项目"
    >
      LINKED TO PORTFOLIO
    </Link>
  );
}
