interface LoadingStateProps {
  label?: string;
}

export function LoadingState({ label = "ANALYSING RECORD" }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-divider border-t-cyan" />
      <div className="font-mono text-[11px] tracking-[0.1em] text-text-muted">
        {label}
      </div>
    </div>
  );
}
