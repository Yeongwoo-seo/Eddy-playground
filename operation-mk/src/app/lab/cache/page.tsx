"use client";

import { AppShell } from "@/components/shell/AppShell";
import { LockedState } from "@/components/system/LockedState";
import { EmptyState } from "@/components/system/EmptyState";
import { useGameStore } from "@/stores/useGameStore";

export default function LabCachePage() {
  const unlocked = useGameStore((s) => s.flags.cachePuzzleUnlocked);

  return (
    <AppShell mode="ANALYSIS">
      {unlocked ? (
        <EmptyState
          label="PUZZLE NOT BUILT YET"
          hint="Deleted media recovery lands in a later phase."
        />
      ) : (
        <LockedState reason="Complete Leo's second interview first." />
      )}
    </AppShell>
  );
}
