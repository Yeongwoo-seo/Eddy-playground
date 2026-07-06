"use client";

import type { ReactNode } from "react";
import { TopStatusBar } from "./TopStatusBar";
import { BottomNavigation } from "./BottomNavigation";
import { ScreenContainer } from "./ScreenContainer";

interface AppShellProps {
  children: ReactNode;
  mode?: "ACTIVE" | "FIELD" | "ANALYSIS";
  hideChrome?: boolean;
}

/**
 * Standard mobile app frame: top status bar, scroll content, bottom nav.
 * Boot/cinematic screens pass hideChrome to render full-bleed instead.
 */
export function AppShell({ children, mode, hideChrome = false }: AppShellProps) {
  if (hideChrome) {
    return (
      <div className="mx-auto flex min-h-screen w-full max-w-frame flex-col justify-center bg-bg px-5">
        {children}
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-frame flex-col bg-bg">
      <TopStatusBar mode={mode} />
      <ScreenContainer>{children}</ScreenContainer>
      <BottomNavigation />
    </div>
  );
}
