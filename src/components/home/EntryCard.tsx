import Link from "next/link";
import type { HomeEntryCard } from "@/content/home";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Divider } from "@/components/ui/Divider";
import { Tag } from "@/components/ui/Tag";
import { ModuleTechnicalVisual } from "@/components/ui/ModuleTechnicalVisual";

interface EntryCardProps {
  card: HomeEntryCard;
  ctaText: string;
}

export function EntryCard({ card, ctaText }: EntryCardProps) {
  const moduleNumber = card.meta.find((m) => m.key === "MODULE")?.value ?? "01";
  const status = card.meta.find((m) => m.key === "STATUS")?.value;

  return (
    <Link
      href={card.href}
      className="panel-card panel-card-interactive group relative block overflow-hidden archive-frame"
    >
      <span className="accent-mark-corner" aria-hidden="true" />
      <span
        className="absolute left-0 top-0 h-full w-0.5 bg-accent opacity-0 transition-opacity group-hover:opacity-100"
        aria-hidden="true"
      />

      <div className="flex flex-col lg:flex-row">
        <div className="panel-rail flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-4 font-mono text-meta md:gap-y-3 lg:w-48 lg:shrink-0 lg:flex-col lg:items-stretch lg:px-5 lg:py-6">
          <div className="flex items-baseline gap-2 lg:flex-col lg:gap-1">
            <span className="text-[0.5625rem] uppercase tracking-[0.16em] text-muted">
              MODULE
            </span>
            <span className="archive-index text-2xl lg:text-3xl">{moduleNumber}</span>
          </div>
          {card.meta
            .filter(({ key }) => key !== "MODULE")
            .map(({ key, value }) => (
              <span
                key={key}
                className="flex w-full min-w-0 flex-wrap items-baseline gap-x-1 tracking-[0.04em] text-muted"
              >
                <span className="text-text">{key}</span>
                <span className="text-border-soft" aria-hidden="true">
                  /
                </span>
                <span className={`break-all ${key === "STATUS" ? "text-accent" : ""}`}>
                  {value}
                </span>
              </span>
            ))}
          {status === "ACTIVE" ? (
            <span className="status-chip status-chip--active mt-1 hidden w-fit lg:inline-flex">
              <span className="status-chip__dot" aria-hidden="true" />
              Live
            </span>
          ) : null}
        </div>

        <div className="flex min-w-0 flex-1 flex-col md:flex-row">
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
          </div>

          <div className="border-t border-border-soft p-4 md:w-52 md:border-l md:border-t-0 md:p-5 lg:w-56">
            <ModuleTechnicalVisual
              moduleId={card.id}
              className="h-[7.5rem] md:h-full md:min-h-[9rem]"
            />
          </div>
        </div>
      </div>

      <div className="panel-meta-strip flex items-center justify-between px-5 py-3.5 md:px-7">
        <span className="enter-indicator">
          {ctaText}
          <span aria-hidden="true">↗</span>
        </span>
        <span className="accent-signal-line" aria-hidden="true" />
      </div>
    </Link>
  );
}
