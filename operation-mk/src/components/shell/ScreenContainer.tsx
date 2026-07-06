"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function ScreenContainer({ children }: { children: ReactNode }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
      className="min-h-[calc(100vh-52px)] px-5 pb-24 pt-5"
    >
      {children}
    </motion.main>
  );
}
