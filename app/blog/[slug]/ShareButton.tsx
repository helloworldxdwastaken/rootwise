"use client";

import { Share2 } from "lucide-react";
import { useEffect, useState } from "react";

export function ShareButton({ title, text, slug }: { title: string; text: string; slug: string }) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    // Get dynamic URL on client side
    if (typeof window !== "undefined") {
      setUrl(`${window.location.origin}/blog/${slug}`);
    }
  }, [slug]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
      } catch (err) {
        // User cancelled or error occurred
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        alert("Link copied to clipboard!");
      } catch (err) {
        // Fallback failed
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#174D3A]/20 hover:bg-[#174D3A]/5 transition-colors text-sm font-medium text-[#174D3A]"
      aria-label="Share article"
    >
      <Share2 className="h-4 w-4" />
      Share Article
    </button>
  );
}

