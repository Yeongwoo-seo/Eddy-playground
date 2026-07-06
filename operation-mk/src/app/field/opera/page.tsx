"use client";

import { AppShell } from "@/components/shell/AppShell";
import { LockedState } from "@/components/system/LockedState";
import { EmptyState } from "@/components/system/EmptyState";
import { useGameStore } from "@/stores/useGameStore";

export default function FieldOperaPage() {
  const unlocked = useGameStore((s) => s.flags.operaMissionUnlocked);

  return (
    <AppShell mode="FIELD">
      {unlocked ? (
        <EmptyState
          label="MISSION NOT BUILT YET"
          hint="Opera House alignment mission lands in a later phase."
        />
      ) : (
        <LockedState reason="Resolve the opening case objectives first." />
      )}
    </AppShell>
  );
}
