"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { writeFlag } from "@/services/storage/localStorage";

const BOOT_SEEN_KEY = "operation-mk-boot-seen";

const STEPS = [
  { delay: 0, text: "OPERATION MK" },
  { delay: 800, text: "ESTABLISHING SECURE CHANNEL" },
  { delay: 2200, text: "IDENTITY CONFIRMED" },
  { delay: 2800, text: "WELCOME, DETECTIVE." },
];

const FINISH_DELAY = 3400;

export function BootSequence() {
  const router = useRouter();
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    const timers = STEPS.map((step, i) =>
      setTimeout(() => setLineIndex(i), step.delay),
    );
    const finishTimer = setTimeout(finish, FINISH_DELAY);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(finishTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function finish() {
    writeFlag(BOOT_SEEN_KEY, true);
    router.replace("/case");
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black px-6 text-center">
      <div className="font-mono text-xl font-semibold tracking-[0.18em] text-text-primary">
        {STEPS[lineIndex]?.text}
      </div>
      <div className="mx-auto my-5 h-px w-40 bg-divider">
        <div
          className="h-full bg-cyan transition-[width] duration-1000 ease-linear"
          style={{ width: lineIndex >= 1 ? "100%" : "0%" }}
        />
      </div>
      <button
        onClick={finish}
        className="absolute bottom-8 right-6 font-mono text-[11px] tracking-wide text-text-muted"
      >
        SKIP
      </button>
    </div>
  );
}
