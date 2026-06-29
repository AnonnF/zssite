interface TagProps {
  children: React.ReactNode;
  variant?: "default" | "accent";
  className?: string;
}

export function Tag({ children, variant = "default", className = "" }: TagProps) {
  const variantClass =
    variant === "accent"
      ? "border-accent/40 bg-accent-muted text-text"
      : "border-border-soft bg-bg/60 text-text";

  return (
    <span
      className={`inline-block border px-2.5 py-0.5 font-mono text-meta uppercase tracking-wider transition-colors ${variantClass} ${className}`}
    >
      {children}
    </span>
  );
}
