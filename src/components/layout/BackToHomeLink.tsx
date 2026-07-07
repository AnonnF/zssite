import Link from "next/link";
import { siteContent } from "@/content/site";

interface BackToHomeLinkProps {
  className?: string;
}

export function BackToHomeLink({ className = "" }: BackToHomeLinkProps) {
  const classes = [
    "enter-indicator text-muted transition-colors hover:text-accent",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Link href="/" className={classes}>
      ← {siteContent.backToHome}
    </Link>
  );
}
