interface ErrorStateProps {
  label?: string;
  hint?: string;
  onRetry?: () => void;
}

export function ErrorState({
  label = "SYSTEM PROCESS FAILED",
  hint,
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center">
      <div className="font-mono text-[11px] tracking-[0.1em] text-signal-red">
        {label}
      </div>
      {hint && <div className="text-[13px] text-text-secondary">{hint}</div>}
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 rounded-md border border-white/14 px-4 py-2 font-mono text-[11px] tracking-wide text-text-primary"
        >
          RETRY
        </button>
      )}
    </div>
  );
}
