import { homeContent } from "@/content/home";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { EntryCard } from "./EntryCard";

export function EntryCards() {
  const { entrySectionLabel, entrySectionTitle, entryCta, cards } = homeContent;

  return (
    <section className="mx-auto max-w-content px-6 py-section md:px-12 lg:px-16">
      <SectionLabel>{entrySectionLabel}</SectionLabel>
      <h2 className="mt-3 font-[family-name:var(--font-body-sc)] text-h2 font-bold">
        {entrySectionTitle}
      </h2>

      <div className="mt-8 flex flex-col gap-6">
        {cards.map((card) => (
          <EntryCard key={card.id} card={card} ctaText={entryCta} />
        ))}
      </div>
    </section>
  );
}
