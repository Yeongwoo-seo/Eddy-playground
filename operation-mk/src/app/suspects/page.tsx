import { AppShell } from "@/components/shell/AppShell";
import { EmptyState } from "@/components/system/EmptyState";

export default function SuspectIndexPage() {
  return (
    <AppShell mode="ACTIVE">
      <EmptyState
        label="NO SUSPECTS LOGGED"
        hint="Continue field investigation."
      />
    </AppShell>
  );
}
