"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Folder, Layers, Users, Activity, Grid2x2 } from "lucide-react";
import { useGameStore } from "@/stores/useGameStore";

interface NavTab {
  href: string;
  label: string;
  icon: typeof Folder;
  matchPrefix?: string;
}

const TABS: NavTab[] = [
  { href: "/case", label: "CASE", icon: Folder },
  { href: "/evidence", label: "EVIDENCE", icon: Layers },
  { href: "/suspects", label: "SUSPECTS", icon: Users },
  { href: "/lab/route", label: "LAB", icon: Activity, matchPrefix: "/lab" },
  { href: "/more", label: "MORE", icon: Grid2x2 },
];

export function BottomNavigation() {
  const pathname = usePathname();
  const evidenceStatus = useGameStore((s) => s.evidenceStatus);
  const hasNewEvidence = Object.values(evidenceStatus).some(
    (status) => status === "new",
  );

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 mx-auto flex w-full max-w-frame border-t border-divider bg-bg/95 backdrop-blur-md"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      {TABS.map((tab) => {
        const isActive =
          pathname === tab.href ||
          (tab.matchPrefix ? pathname?.startsWith(tab.matchPrefix) : false) ||
          (tab.href === "/case" && pathname === "/");
        const Icon = tab.icon;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`relative flex min-h-[44px] flex-1 flex-col items-center gap-1 py-2.5 ${
              isActive ? "text-text-primary" : "text-text-muted"
            }`}
          >
            {isActive && (
              <span className="absolute top-0 left-1/2 h-0.5 w-5 -translate-x-1/2 bg-cyan" />
            )}
            <Icon size={21} strokeWidth={1.6} />
            <span className="font-mono text-[10px] font-semibold tracking-wide">
              {tab.label}
            </span>
            {tab.label === "EVIDENCE" && hasNewEvidence && (
              <span className="absolute right-[calc(50%-16px)] top-1.5 h-1.5 w-1.5 rounded-full bg-amber" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
