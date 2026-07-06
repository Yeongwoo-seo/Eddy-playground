import { Lock } from "lucide-react";

interface LockedStateProps {
  reason: string;
}

/**
 * Rendered whenever a route's unlock flag isn't set — including direct
 * URL navigation, not just in-app link taps.
 */
export function LockedState({ reason }: LockedStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center">
      <Lock size={28} strokeWidth={1.4} className="text-text-muted opacity-60" />
      <div className="font-mono text-[11px] tracking-[0.1em] text-text-muted">
        ACCESS RESTRICTED
      </div>
      <div className="max-w-[260px] text-[13px] text-text-secondary">{reason}</div>
    </div>
  );
}
