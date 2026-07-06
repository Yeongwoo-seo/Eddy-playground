"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useGameStore } from "@/stores/useGameStore";
import { writeFlag } from "@/services/storage/localStorage";

interface DebugAction {
  label: string;
  run: (store: ReturnType<typeof useGameStore.getState>) => void;
}

const ACTIONS: DebugAction[] = [
  {
    label: "RESET CASE",
    run: (s) => s.resetCase(),
  },
  {
    label: "UNLOCK ALL EVIDENCE",
    run: (s) => {
      Object.keys(s.evidenceStatus).forEach((id) => s.setEvidenceStatus(id, "verified"));
    },
  },
  {
    label: "COMPLETE ALL INTERVIEWS",
    run: (s) => {
      s.setFlag("minaInterview1Complete", true);
      s.setFlag("leoInterview1Complete", true);
      s.setFlag("adrianInterview1Complete", true);
    },
  },
  {
    label: "UNLOCK TRACE LENS",
    run: (s) => s.setFlag("traceLensUnlocked", true),
  },
  {
    label: "SKIP OPERA MISSION",
    run: (s) => {
      s.setFlag("operaMissionUnlocked", true);
      s.setFlag("operaMissionSolved", true);
    },
  },
  {
    label: "SKIP BRIDGE MISSION",
    run: (s) => {
      s.setFlag("bridgeMissionUnlocked", true);
      s.setFlag("bridgeMissionSolved", true);
    },
  },
  {
    label: "SOLVE ROUTE",
    run: (s) => s.setFlag("routeSolved", true),
  },
  {
    label: "SOLVE CACHE",
    run: (s) => {
      s.setFlag("cachePuzzleUnlocked", true);
      s.setFlag("cachePuzzleSolved", true);
    },
  },
  {
    label: "UNLOCK ACCUSATION",
    run: (s) => s.setFlag("accusationUnlocked", true),
  },
  {
    label: "TRIGGER CASE CLOSED",
    run: (s) => s.setFlag("case01Closed", true),
  },
  {
    label: "TRIGGER MK INTRUSION",
    run: (s) => s.setFlag("mkSignal01Seen", true),
  },
];

const BOOT_SEEN_KEY = "operation-mk-boot-seen";

export function DebugMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [tapCount, setTapCount] = useState(0);

  function handleLogoTap() {
    const next = tapCount + 1;
    if (next >= 5) {
      setOpen(true);
      setTapCount(0);
    } else {
      setTapCount(next);
    }
  }

  function runAction(action: DebugAction) {
    action.run(useGameStore.getState());
  }

  return (
    <div>
      <button
        onClick={handleLogoTap}
        className="font-mono text-[13px] font-semibold tracking-wide text-text-primary"
      >
        MK-01
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60"
          onClick={() => setOpen(false)}
        >
          <div
            className="max-h-[78vh] w-full max-w-frame overflow-y-auto rounded-t-[14px] bg-surface-2 p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-4 h-1 w-9 rounded-full bg-divider" />
            <div className="mb-3 font-mono text-[11px] tracking-[0.1em] text-text-muted">
              DEBUG MENU
            </div>
            <div className="flex flex-col gap-2">
              {ACTIONS.map((action) => (
                <button
                  key={action.label}
                  onClick={() => runAction(action)}
                  className="rounded-md border border-white/10 bg-surface-1 px-4 py-3 text-left text-[13px] text-text-primary active:bg-surface-3"
                >
                  {action.label}
                </button>
              ))}
              <button
                onClick={() => {
                  writeFlag(BOOT_SEEN_KEY, false);
                  router.push("/boot");
                }}
                className="rounded-md border border-white/10 bg-surface-1 px-4 py-3 text-left text-[13px] text-text-primary active:bg-surface-3"
              >
                REPLAY BOOT SEQUENCE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
