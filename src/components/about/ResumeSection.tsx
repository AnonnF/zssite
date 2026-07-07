import type { ReactNode } from "react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Divider } from "@/components/ui/Divider";

interface ResumeSectionProps {
  id?: string;
  label: string;
  children: ReactNode;
  className?: string;
}

export function ResumeSection({
  id,
  label,
  children,
  className = "",
}: ResumeSectionProps) {
  return (
    <section
      id={id}
      className={`scroll-mt-24 panel-card p-5 md:p-6 lg:p-7 ${className}`.trim()}
    >
      <SectionLabel>{label}</SectionLabel>
      <Divider accent className="my-4" />
      {children}
    </section>
  );
}
