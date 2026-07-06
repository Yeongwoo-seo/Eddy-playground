import { AppShell } from "@/components/shell/AppShell";
import { EmptyState } from "@/components/system/EmptyState";

export async function generateStaticParams() {
  return [{ suspectId: "placeholder" }];
}

export default function InterrogationPage() {
  return (
    <AppShell mode="ANALYSIS">
      <EmptyState
        label="NO INTERVIEW AVAILABLE"
        hint="Interrogation content hasn't been logged yet."
      />
    </AppShell>
  );
}
