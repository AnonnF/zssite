import Link from "next/link";
import type { HomeEntryCard } from "@/content/home";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Divider } from "@/components/ui/Divider";

interface EntryCardProps {
  card: HomeEntryCard;
  ctaText: string;
}

export function EntryCard({ card, ctaText }: EntryCardProps) {
  return (
    <Link
      href={card.href}
      className="group relative block border border-border bg-surface transition-colors hover:bg-bg"
    >
      <div className="absolute left-0 top-0 h-full w-1 bg-border opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="flex flex-col gap-0 md:flex-row">
        <div className="flex flex-wrap gap-x-4 gap-y-1 border-b border-border px-5 py-3 font-mono text-meta md:flex-col md:border-b-0 md:border-r md:px-4 md:py-5">
          {card.meta.map(({ key, value }) => (
            <span key={key} className="text-muted">
              <span className="text-text">{key}:</span> {value}
            </span>
          ))}
        </div>

        <div className="flex-1 p-5 md:p-6 lg:p-8">
          <SectionLabel>{card.label}</SectionLabel>
          <h2 className="mt-3 font-[family-name:var(--font-body-sc)] text-h2 font-bold tracking-tight">
            {card.title}
          </h2>
          <Divider className="my-4" />
          <p className="max-w-2xl font-[family-name:var(--font-body-sc)] text-body leading-relaxed text-muted">
            {card.description}
          </p>
          <p className="mt-6 font-mono text-meta font-medium uppercase tracking-wider text-text transition-transform group-hover:translate-x-1">
            {ctaText}
          </p>
        </div>

        <div
          className="hidden w-12 shrink-0 border-l border-border md:block"
          aria-hidden="true"
        >
          <div className="stripe-bg h-full w-full opacity-40" />
        </div>
      </div>
    </Link>
  );
}
