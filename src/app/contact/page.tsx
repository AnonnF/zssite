import { siteContent } from "@/content/site";
import { SectionLabel } from "@/components/ui/SectionLabel";

export default function ContactPage() {
  const { label, title, message } = siteContent.placeholders.contact;

  return (
    <div className="mx-auto max-w-content px-6 py-section md:px-12 lg:px-16">
      <SectionLabel>{label}</SectionLabel>
      <h1 className="mt-3 font-[family-name:var(--font-body-sc)] text-h1 font-black">
        {title}
      </h1>
      <p className="mt-6 font-[family-name:var(--font-body-sc)] text-body text-muted">
        {message}
      </p>
    </div>
  );
}
