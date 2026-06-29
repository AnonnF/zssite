import { siteContent } from "@/content/site";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Divider } from "@/components/ui/Divider";

export function AboutPreview() {
  const { label, items } = siteContent.aboutPreview;

  return (
    <section className="border-t border-border bg-surface/50">
      <div className="mx-auto max-w-content px-6 py-section md:px-12 lg:px-16">
        <SectionLabel>{label}</SectionLabel>
        <Divider className="mt-4 mb-6" />

        <ul className="space-y-3">
          {items.map((item) => (
            <li
              key={item}
              className="font-[family-name:var(--font-body-sc)] text-body font-medium text-text md:text-lg"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
