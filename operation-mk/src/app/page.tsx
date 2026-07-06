"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { readFlag } from "@/services/storage/localStorage";

const BOOT_SEEN_KEY = "operation-mk-boot-seen";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace(readFlag(BOOT_SEEN_KEY) ? "/case" : "/boot");
  }, [router]);

  return null;
}
