interface SectionLabelProps {
  children: React.ReactNode;
  withAccent?: boolean;
  className?: string;
}

export function SectionLabel({
  children,
  withAccent = false,
  className = "",
}: SectionLabelProps) {
  if (withAccent) {
    return (
      <span className={`section-heading-row ${className}`}>
        <span className="accent-bar mt-0.5" aria-hidden="true" />
        <span className="font-mono text-meta font-medium uppercase tracking-[0.12em] text-muted">
          {children}
        </span>
      </span>
    );
  }

  return (
    <span
      className={`font-mono text-meta font-medium uppercase tracking-[0.12em] text-muted ${className}`}
    >
      {children}
    </span>
  );
}
