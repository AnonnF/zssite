import { homeContent } from "@/content/home";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { EntryCard } from "./EntryCard";

export function EntryCards() {
  const {
    entrySectionLabel,
    entrySectionTitle,
    entrySectionDescription,
    entryCta,
    placeholderLabel,
    placeholderText,
    cards,
  } = homeContent;

  return (
    <section className="mx-auto max-w-content px-6 py-section md:px-12 lg:px-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <SectionLabel withAccent>{entrySectionLabel}</SectionLabel>
          <h2 className="mt-4 font-[family-name:var(--font-body-sc)] text-h2 font-bold tracking-tight">
            {entrySectionTitle}
          </h2>
          <p className="mt-2 max-w-xl font-[family-name:var(--font-body-sc)] text-body text-muted">
            {entrySectionDescription}
          </p>
        </div>
        <p className="font-mono text-meta uppercase tracking-[0.12em] text-muted">
          Hub{" "}
          <span className="text-accent">
            {String(cards.length).padStart(2, "0")}
          </span>{" "}
          Modules
        </p>
      </div>

      <div className="mt-10 flex flex-col gap-6">
        {cards.map((card) => (
          <EntryCard key={card.id} card={card} ctaText={entryCta} />
        ))}

        <div
          className="panel-card flex items-center gap-4 border-dashed px-5 py-6 opacity-55 md:px-7"
          aria-hidden="true"
        >
          <span className="accent-bar" />
          <span className="font-mono text-meta text-muted">{placeholderLabel}</span>
          <span className="font-[family-name:var(--font-body-sc)] text-body text-muted">
            {placeholderText}
          </span>
        </div>
      </div>
    </section>
  );
}
