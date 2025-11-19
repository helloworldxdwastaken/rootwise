"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollToTopOnMount() {
  const pathname = usePathname();

  useEffect(() => {
    // Only scroll to top on page mount/navigation, not on hash changes
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}

