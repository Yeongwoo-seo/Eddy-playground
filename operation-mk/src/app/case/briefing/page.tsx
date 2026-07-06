import { AppShell } from "@/components/shell/AppShell";
import { EmptyState } from "@/components/system/EmptyState";

export default function CaseBriefingPage() {
  return (
    <AppShell mode="ACTIVE">
      <EmptyState
        label="BRIEFING NOT AVAILABLE"
        hint="Case content lands in a later phase."
      />
    </AppShell>
  );
}
