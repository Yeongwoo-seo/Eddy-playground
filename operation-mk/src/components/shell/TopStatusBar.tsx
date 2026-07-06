"use client";

import { useGameStore } from "@/stores/useGameStore";

interface TopStatusBarProps {
  mode?: "ACTIVE" | "FIELD" | "ANALYSIS";
}

export function TopStatusBar({ mode = "ACTIVE" }: TopStatusBarProps) {
  const evidenceStatus = useGameStore((s) => s.evidenceStatus);
  const newCount = Object.values(evidenceStatus).filter(
    (status) => status === "new",
  ).length;

  return (
    <header className="sticky top-0 z-20 flex h-[52px] shrink-0 items-center justify-between border-b border-divider bg-bg/90 px-5 backdrop-blur-md">
      <div className="flex items-center gap-2 font-mono text-[13px] font-semibold tracking-wide text-text-primary">
        <span className="h-1.5 w-1.5 rounded-full bg-success" />
        MK-01
      </div>
      <div className="font-mono text-[10.5px] tracking-[0.12em] text-text-muted">
        {mode}
      </div>
      <div className="font-mono text-[11px] tracking-wide text-amber">
        {newCount > 0 ? `${newCount} NEW` : ""}
      </div>
    </header>
  );
}
