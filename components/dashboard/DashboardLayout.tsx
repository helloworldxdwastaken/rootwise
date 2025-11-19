"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

type DashboardLayoutProps = {
  children: ReactNode;
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="w-full max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-6"
      >
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold text-[#0a0a0a]">
            Your Rootwise Space
          </h1>
          <p className="text-base text-[#222222]/70">
            See your wellness profile, conditions, and conversations.
          </p>
        </div>

        {children}
      </motion.div>
    </div>
  );
}

