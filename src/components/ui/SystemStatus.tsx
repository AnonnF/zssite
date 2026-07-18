interface SystemStatusProps {
  label?: string;
  value?: string;
  className?: string;
}

export function SystemStatus({
  label = "SYSTEM",
  value = "ONLINE",
  className = "",
}: SystemStatusProps) {
  return (
    <span className={`status-chip status-chip--active ${className}`}>
      <span className="status-chip__dot" aria-hidden="true" />
      <span>
        {label}
        <span className="mx-1.5 text-border-soft">/</span>
        {value}
      </span>
    </span>
  );
}
