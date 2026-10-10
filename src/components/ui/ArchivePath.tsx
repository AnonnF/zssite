import Link from "next/link";
import { defaultLocale, type Locale } from "@/lib/i18n/config";
import { localizeHref } from "@/lib/i18n/href";

export interface ArchivePathSegment {
  label: string;
  href?: string;
}

interface ArchivePathProps {
  segments: ArchivePathSegment[];
  className?: string;
  locale?: Locale;
}

export function ArchivePath({
  segments,
  className = "",
  locale = defaultLocale,
}: ArchivePathProps) {
  return (
    <nav
      aria-label="Archive path"
      className={`flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-meta uppercase tracking-[0.1em] text-muted ${className}`}
    >
      {segments.map((segment, index) => {
        const isLast = index === segments.length - 1;
        return (
          <span key={`${segment.label}-${index}`} className="inline-flex items-center gap-2">
            {index > 0 && (
              <span className="text-border-soft" aria-hidden="true">
                /
              </span>
            )}
            {segment.href && !isLast ? (
              <Link
                href={localizeHref(locale, segment.href)}
                className="transition-colors hover:text-accent"
              >
                {segment.label}
              </Link>
            ) : (
              <span className={isLast ? "text-text" : undefined}>{segment.label}</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
