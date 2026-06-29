import Link from "next/link";
import type { HomeEntryCard } from "@/content/home";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Divider } from "@/components/ui/Divider";
import { Tag } from "@/components/ui/Tag";

interface EntryCardProps {
  card: HomeEntryCard;
  ctaText: string;
}

export function EntryCard({ card, ctaText }: EntryCardProps) {
  const moduleNumber = card.meta.find((m) => m.key === "MODULE")?.value ?? "01";

  return (
    <Link
      href={card.href}
      className="panel-card panel-card-interactive group relative block overflow-hidden"
    >
      <span className="accent-mark-corner" aria-hidden="true" />
      <span
        className="absolute left-0 top-0 h-full w-0.5 bg-accent opacity-0 transition-opacity group-hover:opacity-100"
        aria-hidden="true"
      />

      <div className="flex flex-col md:flex-row">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-border-soft px-5 py-4 font-mono text-meta md:w-44 md:flex-col md:items-start md:border-b-0 md:border-r md:py-6">
          <span className="text-2xl font-bold leading-none text-accent">{moduleNumber}</span>
          {card.meta.map(({ key, value }) => (
            <span key={key} className="text-muted">
              <span className="text-text">{key}</span>
              <span className="mx-1 text-border-soft">/</span>
              <span className={key === "STATUS" ? "text-accent" : ""}>{value}</span>
            </span>
          ))}
        </div>

        <div className="flex-1 p-5 md:p-7 lg:p-8">
          <SectionLabel>{card.label}</SectionLabel>

          <h2 className="mt-3 font-[family-name:var(--font-body-sc)] text-h2 font-bold tracking-tight text-text">
            {card.title}
          </h2>
          <p className="mt-1.5 font-mono text-meta uppercase tracking-wider text-accent">
            {card.subtitle}
          </p>

          <Divider className="my-5" />

          <p className="max-w-2xl font-[family-name:var(--font-body-sc)] text-body leading-relaxed text-muted">
            {card.description}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {card.categories.map((category, i) => (
              <Tag key={category} variant={i === 0 ? "accent" : "default"}>
                {category}
              </Tag>
            ))}
          </div>

          <div className="mt-7 flex items-center justify-between border-t border-border-soft pt-5">
            <span className="enter-indicator">
              {ctaText}
              <span aria-hidden="true">↗</span>
            </span>
            <span className="accent-dot opacity-60 transition-opacity group-hover:opacity-100" />
          </div>
        </div>
      </div>
    </Link>
  );
}
