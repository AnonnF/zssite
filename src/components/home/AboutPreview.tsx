import Link from "next/link";
import { siteContent } from "@/content/site";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Divider } from "@/components/ui/Divider";

export function AboutPreview() {
  const { label, items } = siteContent.aboutPreview;

  return (
    <section className="border-t border-border-soft bg-surface/40">
      <div className="mx-auto max-w-content px-6 py-section md:px-12 lg:px-16">
        <SectionLabel withAccent>{label}</SectionLabel>
        <Divider className="mt-5 mb-7" />

        <ul className="space-y-4">
          {items.map((item, i) => (
            <li
              key={item}
              className="flex items-start gap-3 font-[family-name:var(--font-body-sc)] text-body font-medium text-text md:text-lg"
            >
              <span
                className={`accent-dot mt-2.5 ${i === 0 ? "opacity-100" : "opacity-40"}`}
                aria-hidden="true"
              />
              {item}
            </li>
          ))}
        </ul>

        <Link href="/about" className="enter-indicator mt-8 inline-block">
          查看完整简历 →
        </Link>
      </div>
    </section>
  );
}
