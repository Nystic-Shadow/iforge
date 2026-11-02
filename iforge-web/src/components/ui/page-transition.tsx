"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Fades the main content in on every route change. Keyed on pathname so Next's
 * App Router swaps are animated. The old page is replaced at once (no exit
 * fade to wait for), and the first page load isn't animated. Reduced-motion
 * users get an instant swap.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const [firstPath] = React.useState(pathname);
  const [navigated, setNavigated] = React.useState(false);
  if (!navigated && pathname !== firstPath) setNavigated(true);

  if (reduced) return <>{children}</>;

  return (
    <motion.div
      key={pathname}
      initial={navigated ? { opacity: 0, y: 8 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
