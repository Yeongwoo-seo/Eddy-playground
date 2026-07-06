"use client";

import { AppShell } from "@/components/shell/AppShell";
import { LockedState } from "@/components/system/LockedState";
import { EmptyState } from "@/components/system/EmptyState";
import { useGameStore } from "@/stores/useGameStore";

export default function LabRoutePage() {
  const unlocked = useGameStore((s) => s.flags.bridgeMissionSolved);

  return (
    <AppShell mode="ANALYSIS">
      {unlocked ? (
        <EmptyState
          label="PUZZLE NOT BUILT YET"
          hint="Route reconstruction lands in a later phase."
        />
      ) : (
        <LockedState reason="Complete the Harbour Bridge mission first." />
      )}
    </AppShell>
  );
}
