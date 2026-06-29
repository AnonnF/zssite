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
      <SectionLabel withAccent>{entrySectionLabel}</SectionLabel>
      <h2 className="mt-4 font-[family-name:var(--font-body-sc)] text-h2 font-bold tracking-tight">
        {entrySectionTitle}
      </h2>
      <p className="mt-2 max-w-xl font-[family-name:var(--font-body-sc)] text-body text-muted">
        {entrySectionDescription}
      </p>

      <div className="mt-10 flex flex-col gap-6">
        {cards.map((card) => (
          <EntryCard key={card.id} card={card} ctaText={entryCta} />
        ))}

        {/* 占位结构：后续模块入口 */}
        <div
          className="panel-card flex items-center gap-4 border-dashed px-5 py-6 opacity-50 md:px-7"
          aria-hidden="true"
        >
          <span className="font-mono text-meta text-muted">{placeholderLabel}</span>
          <span className="font-[family-name:var(--font-body-sc)] text-body text-muted">
            {placeholderText}
          </span>
        </div>
      </div>
    </section>
  );
}
