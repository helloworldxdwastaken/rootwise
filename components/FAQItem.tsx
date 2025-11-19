"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type FAQItemProps = {
  question: string;
  answer: string;
  className?: string;
};

export function FAQItem({ question, answer, className }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn(
        "w-full rounded-3xl border border-white/15 bg-white/10 px-8 py-6 text-[#222222] shadow-md transition-all hover:border-white/30 hover:bg-white/20 hover:shadow-xl cursor-pointer",
        isOpen && "border-white/30 bg-white/25 shadow-xl",
        className
      )}
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex w-full items-start justify-between gap-6">
        <div className="flex items-start gap-3 flex-1">
          <HelpCircle className="h-5 w-5 text-[#174D3A] flex-shrink-0 mt-0.5" />
          <span className="text-lg font-semibold text-[#174D3A]">{question}</span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="flex-shrink-0"
        >
          <ChevronDown className="h-6 w-6 text-[#174D3A]" />
        </motion.div>
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden w-full"
          >
            <div className="pt-4 w-full text-base leading-7 text-[#222222]/85">{answer}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
