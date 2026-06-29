interface TagProps {
  children: React.ReactNode;
  className?: string;
}

export function Tag({ children, className = "" }: TagProps) {
  return (
    <span
      className={`inline-block border border-border px-2 py-0.5 font-mono text-meta uppercase tracking-wider text-text ${className}`}
    >
      {children}
    </span>
  );
}
