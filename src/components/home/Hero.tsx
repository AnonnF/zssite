import { siteContent } from "@/content/site";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Divider } from "@/components/ui/Divider";
import { Tag } from "@/components/ui/Tag";

export function Hero() {
  const { title, nameEn, subtitle, label, description, keywords } = siteContent.hero;

  return (
    <section className="relative overflow-hidden border-b border-border-soft">
      <div className="stripe-bg absolute inset-0 opacity-50" aria-hidden="true" />
      <div className="absolute right-6 top-6 hidden items-center gap-2 font-mono text-meta md:flex">
        <span className="accent-dot" aria-hidden="true" />
        <span className="text-muted">
          REF: <span className="text-accent">HOME-001</span>
        </span>
      </div>

      <div className="relative mx-auto max-w-content px-6 py-16 md:px-12 md:py-24 lg:px-16 lg:py-28">
        <SectionLabel withAccent>{label}</SectionLabel>

        <div className="mt-6 flex items-start gap-4 md:mt-8">
          <span className="accent-bar mt-2 hidden h-12 md:block" aria-hidden="true" />
          <div>
            <h1 className="font-[family-name:var(--font-body-sc)] text-[3rem] font-black leading-none tracking-tight md:text-display lg:text-[5rem]">
              {title}
            </h1>
            <p className="mt-2 font-display text-h3 font-semibold uppercase tracking-wide text-muted md:text-h2">
              {nameEn}
            </p>
            <p className="mt-2 font-display text-h3 font-semibold uppercase tracking-wide text-muted md:text-h2">
              {subtitle}
            </p>
          </div>
        </div>

        <Divider accent className="my-8 md:my-10" />

        <p className="max-w-2xl font-[family-name:var(--font-body-sc)] text-body leading-relaxed text-text md:text-lg">
          {description}
        </p>

        <div className="mt-8 flex flex-wrap gap-2 md:mt-10">
          {keywords.map((keyword, i) => (
            <Tag key={keyword} variant={i === 0 ? "accent" : "default"}>
              {keyword}
            </Tag>
          ))}
        </div>
      </div>
    </section>
  );
}
