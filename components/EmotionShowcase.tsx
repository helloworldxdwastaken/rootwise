"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type LottiePlayerProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement>,
  HTMLElement
> & {
  src: string;
  autoplay?: boolean;
  loop?: boolean;
  mode?: string;
  background?: string;
  speed?: number | string;
  style?: React.CSSProperties;
};

const LottiePlayer = (props: LottiePlayerProps) =>
  React.createElement("lottie-player", props);

const EMOTION_ASSETS = {
  mindfull_chill: {
    src: "/emotions/mindfull_chill.json",
  },
  productive: {
    src: "/emotions/productive.json",
  },
  tired_low: {
    src: "/emotions/tired_low.json",
  },
} as const;

export type EmotionKey = keyof typeof EMOTION_ASSETS;

type EmotionShowcaseProps = {
  emotion: EmotionKey;
  label?: string;
  note?: string;
  className?: string;
};

const LOTTIE_SCRIPT_URL =
  "https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js";

export function EmotionShowcase({
  emotion,
  label,
  note,
  className,
}: EmotionShowcaseProps) {
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleLoad = () => setIsPlayerReady(true);

    if (customElements?.get("lottie-player")) {
      setIsPlayerReady(true);
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-lottie-player="true"]'
    );

    if (existingScript) {
      if (existingScript.dataset.loaded === "true") {
        setIsPlayerReady(true);
      } else {
        existingScript.addEventListener("load", handleLoad);
      }

      return () => {
        existingScript.removeEventListener("load", handleLoad);
      };
    }

    const script = document.createElement("script");
    script.src = LOTTIE_SCRIPT_URL;
    script.async = true;
    script.setAttribute("data-lottie-player", "true");
    script.addEventListener("load", () => {
      script.dataset.loaded = "true";
      handleLoad();
    });
    document.body.appendChild(script);

    return () => {
      script.removeEventListener("load", handleLoad);
    };
  }, []);

  const asset = EMOTION_ASSETS[emotion];

  return (
    <div className={cn("flex flex-col items-center text-center gap-4", className)}>
      <div className="flex w-full items-center justify-center">
        {isPlayerReady ? (
          <LottiePlayer
            autoplay
            loop
            mode="normal"
            src={asset.src}
            background="transparent"
            style={{ width: "420px", height: "420px" }}
          />
        ) : (
          <div className="flex h-[420px] w-[420px] items-center justify-center text-sm text-slate-400">
            Setting the vibe…
          </div>
        )}
      </div>
      {(label || note) && (
        <div className="space-y-1">
          {label && <p className="text-sm font-semibold text-slate-800">{label}</p>}
          {note && <p className="text-xs text-slate-500">{note}</p>}
        </div>
      )}
    </div>
  );
}
