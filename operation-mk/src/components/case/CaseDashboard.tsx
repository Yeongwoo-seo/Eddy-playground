"use client";

import Link from "next/link";
import { useGameStore } from "@/stores/useGameStore";

const TOTAL_EVIDENCE = 15;

export function CaseDashboard() {
  const evidenceStatus = useGameStore((s) => s.evidenceStatus);
  const currentObjectiveId = useGameStore((s) => s.currentObjectiveId);
  const recoveredCount = Object.keys(evidenceStatus).length;

  return (
    <div>
      <div className="font-mono text-[11px] tracking-[0.1em] text-text-muted">
        ACTIVE INVESTIGATION
      </div>
      <h1 className="mt-1.5 text-[26px] font-bold leading-[34px]">
        사라진 11분
      </h1>
      <div className="mt-0.5 font-mono text-[13px] text-text-secondary">
        THE MISSING ELEVEN MINUTES · CASE MK-01
      </div>

      <div className="mt-6 font-mono text-[11px] tracking-[0.1em] text-text-muted">
        EVIDENCE RECOVERED
      </div>
      <div className="mt-2 font-mono text-[15px] font-semibold">
        {String(recoveredCount).padStart(2, "0")} / {TOTAL_EVIDENCE}
      </div>
      <div className="mt-2.5 flex gap-[3px]">
        {Array.from({ length: TOTAL_EVIDENCE }).map((_, i) => (
          <div
            key={i}
            className={`h-[3px] flex-1 rounded-sm ${
              i < recoveredCount ? "bg-cyan" : "bg-surface-3"
            }`}
          />
        ))}
      </div>

      <div className="mt-6 font-mono text-[11px] tracking-[0.1em] text-text-muted">
        CURRENT OBJECTIVE
      </div>
      <div className="mt-2.5 rounded-card border border-white/[0.07] bg-surface-1 p-4">
        <p className="text-[16px] leading-[26px]">
          {currentObjectiveId ?? "세 용의자의 최초 진술을 검토하라."}
        </p>
        <Link
          href="/case/briefing"
          className="mt-4 flex h-[52px] w-full items-center justify-center rounded-md bg-text-primary text-[15px] font-semibold text-bg"
        >
          CONTINUE INVESTIGATION →
        </Link>
      </div>

      <div className="mt-6 font-mono text-[11px] tracking-[0.1em] text-text-muted">
        RECENT ACTIVITY
      </div>
      <div className="mt-2.5 rounded-card border border-white/[0.07] bg-surface-1 p-4 text-[13px] text-text-secondary">
        No activity logged yet.
      </div>
    </div>
  );
}
