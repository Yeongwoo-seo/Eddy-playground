import { AppShell } from "@/components/shell/AppShell";
import { EmptyState } from "@/components/system/EmptyState";

export async function generateStaticParams() {
  return [{ id: "placeholder" }];
}

export default function SuspectProfilePage() {
  return (
    <AppShell mode="ACTIVE">
      <EmptyState
        label="SUSPECT NOT FOUND"
        hint="This profile hasn't been logged yet."
      />
    </AppShell>
  );
}
