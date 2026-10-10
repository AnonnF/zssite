import Link from "next/link";
import { getSiteContent } from "@/content";
import { defaultLocale, type Locale } from "@/lib/i18n/config";
import { localizeHref } from "@/lib/i18n/href";

interface BackToHomeLinkProps {
  className?: string;
  locale?: Locale;
}

export function BackToHomeLink({
  className = "",
  locale = defaultLocale,
}: BackToHomeLinkProps) {
  const classes = [
    "enter-indicator text-muted transition-colors hover:text-accent",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Link href={localizeHref(locale, "/")} className={classes}>
      ← {getSiteContent(locale).backToHome}
    </Link>
  );
}
