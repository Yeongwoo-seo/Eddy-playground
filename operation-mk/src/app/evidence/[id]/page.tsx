import { AppShell } from "@/components/shell/AppShell";
import { EmptyState } from "@/components/system/EmptyState";

// Static export needs to know all dynamic paths at build time; real
// evidence ids are populated in a later phase, so this route generates
// no static pages yet.
export async function generateStaticParams() {
  return [{ id: "placeholder" }];
}

export default function EvidenceDetailPage() {
  return (
    <AppShell mode="ACTIVE">
      <EmptyState
        label="EVIDENCE NOT FOUND"
        hint="This case file hasn't been logged yet."
      />
    </AppShell>
  );
}
