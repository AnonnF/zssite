import Link from "next/link";
import { siteContent } from "@/content/site";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Divider } from "@/components/ui/Divider";

export function AboutPreview() {
  const { label, items } = siteContent.aboutPreview;

  return (
    <section className="border-t border-border-soft bg-bg-secondary/50">
      <div className="mx-auto max-w-content px-6 py-section md:px-12 lg:px-16">
        <SectionLabel withAccent>{label}</SectionLabel>
        <Divider className="mt-5 mb-7" />

        <div className="border-l-2 border-accent/60 pl-5 md:pl-6">
          <p className="font-[family-name:var(--font-body-sc)] text-body font-medium leading-relaxed text-text md:text-lg">
            {items[3]}
          </p>
          <p className="mt-4 font-mono text-meta uppercase tracking-[0.12em] text-muted">
            {items[0]}
            <span className="mx-2 text-border-soft">/</span>
            {items[1]}
          </p>
          <p className="mt-1.5 font-mono text-meta uppercase tracking-[0.12em] text-accent">
            {items[2]}
          </p>
        </div>

        <Link href="/about" className="enter-indicator mt-8 inline-flex">
          查看完整简历
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
