import { AppShell } from "@/components/shell/AppShell";
import { DebugMenu } from "@/components/system/DebugMenu";

export default function MorePage() {
  return (
    <AppShell mode="ACTIVE">
      <div className="flex items-center justify-between rounded-card border border-white/[0.07] bg-surface-1 p-4">
        <span className="text-[13px] text-text-secondary">System</span>
        <DebugMenu />
      </div>
    </AppShell>
  );
}
