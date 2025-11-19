"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

type CardProps = {
  className?: string;
  hoverEffect?: boolean;
  children: ReactNode;
} & Omit<HTMLAttributes<HTMLDivElement>, "className" | "children">;

export function Card({ className, hoverEffect = true, children, ...props }: CardProps) {
  if (!hoverEffect) {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-3xl border border-white/20 bg-[#F4EDE1]/40 p-8 text-[#222222] shadow-lg backdrop-blur-md",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "relative overflow-hidden rounded-3xl border border-white/20 bg-[#F4EDE1]/40 p-8 text-[#222222] shadow-lg backdrop-blur-md hover:shadow-2xl hover:border-white/30 transition-all",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
