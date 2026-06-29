interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionLabel({ children, className = "" }: SectionLabelProps) {
  return (
    <span
      className={`font-mono text-meta font-medium uppercase tracking-[0.12em] text-muted ${className}`}
    >
      {children}
    </span>
  );
}
