"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/Navbar";
import { ScrollToTop } from "@/components/ScrollToTop";
import { ScrollToTopOnMount } from "@/components/ScrollToTopOnMount";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";

type PageShellProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

export function PageShell({ children, className, contentClassName }: PageShellProps) {
  return (
    <div className={cn("relative min-h-screen w-full max-w-full overflow-x-hidden bg-[var(--color-background)] text-[#222222]", className)}>
      {/* Animated background gradients */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.4, 0.3],
          }}
          transition={{
            duration: 8,
            ease: "easeInOut",
          }}
          className="absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[#A6C7A3]/30 blur-2xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 10,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute left-8 top-32 h-64 w-64 rounded-full bg-[#174D3A]/10 blur-2xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.2, 0.25, 0.2],
          }}
          transition={{
            duration: 12,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute bottom-0 right-0 h-[28rem] w-[28rem] translate-x-1/3 rounded-full bg-[#F4C977]/20 blur-2xl"
        />
      </div>
      
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-0">
        <Navbar />
        <div className={cn("flex flex-col gap-0 pt-28 min-h-0", contentClassName)}>
          {children}
        </div>
      </div>
      <ScrollToTop />
      <ScrollToTopOnMount />
      <DisclaimerBanner />
    </div>
  );
}
