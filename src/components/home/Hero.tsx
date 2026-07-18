import { siteContent } from "@/content/site";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Divider } from "@/components/ui/Divider";
import { Tag } from "@/components/ui/Tag";
import { SystemStatus } from "@/components/ui/SystemStatus";

export function Hero() {
  const { title, nameEn, subtitle, label, description, keywords } = siteContent.hero;

  return (
    <section className="relative overflow-hidden border-b border-border-soft">
      <div className="stripe-bg absolute inset-0 opacity-40" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -right-16 top-8 hidden h-56 w-56 rounded-full border border-border-soft md:block"
        aria-hidden="true"
        style={{ opacity: 0.35 }}
      />
      <div
        className="pointer-events-none absolute -right-6 top-20 hidden h-32 w-32 rounded-full border border-accent/30 md:block"
        aria-hidden="true"
      />

      <span
        className="signal-cross absolute left-4 top-4 md:left-6 md:top-6"
        aria-hidden="true"
      />
      <span
        className="signal-cross absolute bottom-4 right-4 md:bottom-6 md:right-6"
        aria-hidden="true"
      />

      <div className="absolute right-8 top-6 hidden items-center gap-3 font-mono text-meta md:flex md:right-14 lg:right-[4.5rem]">
        <SystemStatus label="ARCHIVE" value="ACTIVE" />
        <span className="text-muted">
          REF: <span className="text-accent">HOME-001</span>
        </span>
      </div>

      <div className="relative mx-auto max-w-content px-6 py-16 md:px-12 md:py-24 lg:px-16 lg:py-28">
        <SectionLabel withAccent>{label}</SectionLabel>

        <div className="mt-6 flex items-start gap-4 md:mt-8">
          <span className="accent-bar mt-2 hidden h-14 md:block" aria-hidden="true" />
          <div>
            <h1 className="font-[family-name:var(--font-body-sc)] text-[3rem] font-black leading-none tracking-tight md:text-display lg:text-[5rem]">
              {title}
            </h1>
            <p className="mt-2 font-display text-h3 font-semibold uppercase tracking-wide text-text-secondary md:text-h2">
              {nameEn}
            </p>
            <p className="mt-1 font-display text-h3 font-semibold uppercase tracking-wide text-muted md:text-h2">
              {subtitle}
            </p>
          </div>
        </div>

        <Divider accent className="my-8 md:my-10" />

        <p className="max-w-2xl font-[family-name:var(--font-body-sc)] text-body leading-relaxed text-text md:text-lg">
          {description}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3 md:mt-10">
          {keywords.map((keyword, i) => (
            <Tag key={keyword} variant={i === 0 ? "accent" : "default"}>
              {keyword}
            </Tag>
          ))}
          <span className="ml-1 hidden font-mono text-meta uppercase tracking-[0.12em] text-muted sm:inline">
            Engineering Dossier
          </span>
        </div>
      </div>
    </section>
  );
}
