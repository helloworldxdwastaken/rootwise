"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertCircle } from "lucide-react";

export function DisclaimerBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has dismissed the banner
    const dismissed = localStorage.getItem("disclaimer-dismissed");
    if (!dismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("disclaimer-dismissed", "true");
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-3xl"
        >
          <div className="rounded-2xl border border-[#174D3A]/30 bg-white/95 backdrop-blur-xl p-4 shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#174D3A]/10">
                <AlertCircle className="h-5 w-5 text-[#174D3A]" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#174D3A]">
                  Educational wellness content
                </p>
                <p className="mt-1 text-xs text-[#222222]/80">
                  Not a substitute for medical care. Rootwise provides general wellness information only and does not diagnose, treat, or replace healthcare professionals.
                </p>
              </div>
              <button
                onClick={handleDismiss}
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-[#174D3A]/60 transition-colors hover:bg-[#174D3A]/10 hover:text-[#174D3A]"
                aria-label="Dismiss disclaimer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

