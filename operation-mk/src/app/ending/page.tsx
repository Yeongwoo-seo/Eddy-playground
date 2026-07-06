"use client";

import { AppShell } from "@/components/shell/AppShell";
import { LockedState } from "@/components/system/LockedState";
import { EmptyState } from "@/components/system/EmptyState";
import { useGameStore } from "@/stores/useGameStore";

export default function EndingPage() {
  const unlocked = useGameStore((s) => s.flags.case01Closed);

  return (
    <AppShell hideChrome mode="ACTIVE">
      {unlocked ? (
        <EmptyState
          label="ENDING NOT BUILT YET"
          hint="Lands in a later phase."
        />
      ) : (
        <LockedState reason="Submit and win the accusation first." />
      )}
    </AppShell>
  );
}
