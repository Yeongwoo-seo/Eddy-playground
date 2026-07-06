interface EmptyStateProps {
  label?: string;
  hint?: string;
}

export function EmptyState({
  label = "NO EVIDENCE LOGGED",
  hint = "Continue field investigation.",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-2 py-16 text-center">
      <div className="font-mono text-[11px] tracking-[0.1em] text-text-muted">
        {label}
      </div>
      {hint && <div className="text-[13px] text-text-secondary">{hint}</div>}
    </div>
  );
}
