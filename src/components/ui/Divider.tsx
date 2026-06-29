interface DividerProps {
  className?: string;
  accent?: boolean;
}

export function Divider({ className = "", accent = false }: DividerProps) {
  return (
    <hr
      className={`border-0 border-t ${accent ? "border-accent/30" : "border-border-soft"} ${className}`}
    />
  );
}
