import { AppShell } from "@/components/shell/AppShell";
import { CaseDashboard } from "@/components/case/CaseDashboard";

export default function CasePage() {
  return (
    <AppShell mode="ACTIVE">
      <CaseDashboard />
    </AppShell>
  );
}
