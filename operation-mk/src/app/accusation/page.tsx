"use client";

import { AppShell } from "@/components/shell/AppShell";
import { LockedState } from "@/components/system/LockedState";
import { EmptyState } from "@/components/system/EmptyState";
import { useGameStore } from "@/stores/useGameStore";

export default function AccusationPage() {
  const unlocked = useGameStore((s) => s.flags.accusationUnlocked);

  return (
    <AppShell mode="ACTIVE">
      {unlocked ? (
        <EmptyState
          label="ACCUSATION FLOW NOT BUILT YET"
          hint="Lands in a later phase."
        />
      ) : (
        <LockedState reason="Gather enough evidence and testimony first." />
      )}
    </AppShell>
  );
}
