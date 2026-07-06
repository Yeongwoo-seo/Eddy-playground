"use client";

import { AppShell } from "@/components/shell/AppShell";
import { LockedState } from "@/components/system/LockedState";
import { EmptyState } from "@/components/system/EmptyState";
import { useGameStore } from "@/stores/useGameStore";

export default function FieldBridgePage() {
  const unlocked = useGameStore((s) => s.flags.bridgeMissionUnlocked);

  return (
    <AppShell mode="FIELD">
      {unlocked ? (
        <EmptyState
          label="MISSION NOT BUILT YET"
          hint="Harbour Bridge perspective mission lands in a later phase."
        />
      ) : (
        <LockedState reason="Resolve Mina's second interview first." />
      )}
    </AppShell>
  );
}
