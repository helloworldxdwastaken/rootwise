"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { PageShell } from "@/components/PageShell";
import { Footer } from "@/components/Footer";
import { EmotionShowcase } from "@/components/EmotionShowcase";
import type { EmotionKey } from "@/components/EmotionShowcase";

type StripCardProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

function StripCard({ title, children, className }: StripCardProps) {
  return (
    <article
      className={cn(
        "rounded-2xl border border-white/50 bg-white/80 p-4 shadow-[0_18px_45px_rgba(15,40,34,0.08)] backdrop-blur",
        className
      )}
    >
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      <div className="mt-2 text-sm text-slate-600">{children}</div>
    </article>
  );
}

export default function PersonalOverviewPage() {
  const [energyScore] = useState(6);
  const [hydrationGlasses] = useState(5);
  const hydrationTarget = 6;
  const greeting = getGreeting();
  const userName = "Enmanuel";
  const emotionState = getEmotionState(energyScore);
  const energyFill = getEnergyFill(energyScore);
  const symptomGroups = [
    {
      category: "Energy & mood",
      entries: [
        { icon: "😊", label: "Steady energy", trend: "Better today", trendColor: "text-emerald-600" },
        { icon: "🙂", label: "Soft focus", trend: "Same as yesterday", trendColor: "text-slate-500" },
      ],
    },
    {
      category: "Body cues",
      entries: [
        { icon: "💛", label: "Light muscle tension", trend: "Same", trendColor: "text-slate-500" },
        { icon: "🟢", label: "Gentle appetite", trend: "Better", trendColor: "text-emerald-600" },
      ],
    },
    {
      category: "Calming wins",
      entries: [
        { icon: "🌿", label: "Calm breathing", trend: "Better", trendColor: "text-emerald-600" },
      ],
    },
  ];

  return (
    <PageShell className="bg-[#fdf8f3]" contentClassName="px-0 pb-0">
      <main className="relative flex flex-1 flex-col gap-6 overflow-hidden px-6 pt-16 pb-12">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-200/25 blur-[140px]" />
          <div className="absolute bottom-0 left-8 h-64 w-64 rounded-full bg-[#F4C977]/30 blur-[160px]" />
          <div className="absolute top-32 right-0 h-72 w-72 translate-x-1/3 rounded-full bg-[#cbd4ff]/30 blur-[180px]" />
        </div>
        <div className="relative mx-auto flex w-full max-w-[1200px] flex-col gap-6">
          <section className="relative overflow-hidden rounded-[36px] border border-white/40 bg-white/80 p-8 shadow-[0_40px_120px_rgba(15,40,34,0.2)] backdrop-blur">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -left-10 top-0 h-40 w-40 rounded-full bg-emerald-100/60 blur-3xl" />
              <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-amber-100/70 blur-3xl" />
            </div>
            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-5">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.45em] text-emerald-600">
                    {`${greeting}, ${userName}`.toUpperCase()}
                  </p>
                  <h1 className="mt-3 text-5xl font-semibold text-slate-900 leading-tight">
                    How your body is doing today
                  </h1>
                  <p className="text-sm text-slate-500">Rootwise keeps it calm so you see what matters first.</p>
                </div>
                <div className="rounded-3xl border border-white/60 bg-white/80 p-5 shadow-inner">
                  <div className="space-y-3">
                    <span className="text-xs uppercase tracking-[0.3em] text-slate-400">Energy</span>
                    <div className="flex items-center gap-3">
                      <span className="text-5xl leading-none">{energyFill.emoji}</span>
                      <div className="flex-1">
                        <div className="relative h-3 w-full rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${(energyScore / 10) * 100}%`,
                              background: energyFill.gradient,
                            }}
                          />
                          <span
                            className={cn(
                              "absolute -top-6 text-xs font-semibold transition-transform",
                              energyFill.labelColor
                            )}
                            style={{ left: `calc(${(energyScore / 10) * 100}% - 16px)` }}
                          >
                            {energyFill.label}
                          </span>
                        </div>
                        <p className="mt-3 text-xl font-semibold text-slate-900">{energyScore} / 10</p>
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-slate-500">Tip: keep the mini stretch + hydration pause every few hours to stay centered.</p>
                </div>
                <div className="mt-4 flex items-start gap-3 rounded-2xl border border-white/60 bg-white/70 px-4 py-3 text-sm text-slate-600 shadow-sm">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-200 via-rose-200 to-sky-200 text-[#174D3A]">
                    <Sparkles className="h-4 w-4" />
                  </span>
                  <div className="flex-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                      AI insight
                    </p>
                    <p className="mt-1 text-sm">
                      Afternoon stretch breaks kept your energy balanced yesterday. Repeat the 5-minute pause today to stay in this calm groove.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-1 flex-col items-center justify-center">
                <EmotionShowcase
                  emotion={emotionState.key}
                  label={emotionState.label}
                  note={emotionState.note}
                />
              </div>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            <StripCard title="Sleep" className="h-full">
              <p className="text-lg font-semibold text-slate-900">7 hr 05 min</p>
              <p className="text-xs text-slate-500">Lights out: 11:10 pm</p>
              <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[0.7rem] font-semibold text-emerald-600">
                <span className="text-base">🌙</span>
                Right on schedule — keep the same wind-down.
              </p>
            </StripCard>

            <StripCard title="Hydration" className="h-full">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold text-slate-900">
                    {hydrationGlasses} of {hydrationTarget} glasses
                  </p>
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                    {Math.round((hydrationGlasses / hydrationTarget) * 100)}% to goal
                  </p>
                </div>
                <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-500">
                  +1 glass = streak bonus
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {Array.from({ length: hydrationTarget }).map((_, idx) => (
                  <HydrationCup
                    key={idx}
                    label={`Glass ${idx + 1}`}
                    filled={idx < hydrationGlasses}
                  />
                ))}
              </div>
              <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-[0.7rem] font-semibold text-sky-500">
                <span className="text-base">💧</span>
                Almost there — one more refill.
              </p>
            </StripCard>

            <StripCard title="Symptoms" className="h-full">
              <div className="space-y-3 text-sm text-slate-700">
                {symptomGroups.map((group) => (
                  <div key={group.category}>
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                      {group.category}
                    </p>
                    <ul className="mt-2 space-y-2">
                      {group.entries.map((entry) => (
                        <li key={entry.label} className="flex items-center justify-between gap-3">
                          <span className="flex items-center gap-2">
                            <span className="text-base leading-none">{entry.icon}</span>
                            {entry.label}
                          </span>
                          <span className={cn("text-xs font-semibold", entry.trendColor)}>
                            {entry.trend}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </StripCard>
          </section>

          <StripCard title="Weekly patterns">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
              <div className="space-y-4 lg:w-2/5">
                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                    Low energy midweek
                  </span>
                  <span>Most stable days: Monday & Friday</span>
                </div>
                <div className="rounded-2xl border border-white/60 bg-white/70 p-4 text-sm text-slate-700 shadow-inner">
                  <div className="mb-2 flex items-center gap-2 font-semibold">
                    <ChartIcon />
                    <span>Average week · 6 entries</span>
                  </div>
                  <p className="text-xs text-slate-500">Energy dips after Wednesday workouts.</p>
                </div>
              </div>
              <div className="lg:w-3/5 w-full rounded-3xl border border-white/60 bg-white/80 p-4 shadow-inner">
                <WeeklyChart />
              </div>
            </div>
          </StripCard>

          <section className="grid gap-4 md:grid-cols-2">
            <StripCard title="What affected you today">
              <ul className="mt-3 space-y-2 text-sm font-medium text-slate-800">
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                  Heavier meal
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-yellow-300" />
                  Low sleep <span className="font-normal text-slate-500">5 h 50 min</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-sky-400" />
                  Stress
                </li>
              </ul>
            </StripCard>
            <StripCard title="Based on this, try tomorrow">
              <ul className="mt-3 space-y-2 text-sm font-medium text-slate-800">
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                  Light movement
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-yellow-300" />
                  <span className="font-semibold">Protein</span>-rich breakfast
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-sky-400" />
                  Early bedtime{" "}
                  <span className="font-normal text-slate-500">(no screens)</span>
                </li>
              </ul>
            </StripCard>
          </section>
        </div>
      </main>
      <Footer />
    </PageShell>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  if (hour < 22) return "Good evening";
  return "Good night";
}

type HydrationCupProps = {
  label: string;
  filled: boolean;
};

function HydrationCup({ label, filled }: HydrationCupProps) {
  return (
    <div className="flex flex-col items-center gap-2 text-[0.65rem] font-semibold">
      <div
        className={cn(
          "relative h-16 w-10 overflow-hidden rounded-2xl border border-slate-200 bg-white/60 transition",
          filled && "border-sky-200 bg-white/80 shadow-sm"
        )}
        title={label}
      >
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-transparent to-white/60" />
        <div
          className="absolute inset-x-1 bottom-1 rounded-2xl transition-all duration-300"
          style={{
            height: filled ? "70%" : "15%",
            background: filled ? "#bae6fd" : "#e2e8f0",
            opacity: filled ? 0.9 : 0.6,
          }}
        />
        <div className="absolute inset-x-[3px] top-[3px] h-[2px] rounded-full bg-white/80" />
      </div>
      <span className={cn("text-[0.55rem] uppercase tracking-[0.2em]", filled ? "text-sky-500" : "text-slate-400")}>
        {label.replace("Glass ", "G")}
      </span>
    </div>
  );
}

function ChartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="11" width="3" height="8" rx="1" fill="#94a3b8" />
      <rect x="8.5" y="7" width="3" height="12" rx="1" fill="#cbd5f5" />
      <rect x="14" y="9" width="3" height="10" rx="1" fill="#94a3b8" />
      <rect x="19.5" y="5" width="3" height="14" rx="1" fill="#e2e8f0" />
    </svg>
  );
}

function WeeklyChart() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return (
    <div className="w-full">
      <svg
        viewBox="0 0 200 80"
        preserveAspectRatio="none"
        className="h-32 w-full text-slate-300"
      >
        <path
          d="M0 65 C 20 60 30 45 45 42 C 65 37 80 60 95 58 C 112 56 125 43 140 46 C 150 48 155 52 200 50"
          stroke="#90b4b2"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M0 70 C 20 60 30 45 45 42 C 65 37 80 60 95 58 C 112 56 125 43 140 46 C 150 48 155 52 200 50 L200 80 L0 80 Z"
          fill="#dcefee"
          fillOpacity="0.7"
        />
      </svg>
      <div className="mt-3 flex justify-between text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-slate-400">
        {days.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
    </div>
  );
}

type EmotionState = {
  key: EmotionKey;
  label: string;
  note: string;
};

function getEmotionState(score: number): EmotionState {
  if (score <= 4) {
    return {
      key: "tired_low",
      label: "Rest mode",
      note: "Energy is low — soften the pace today.",
    };
  }

  if (score >= 7) {
    return {
      key: "productive",
      label: "Bright & focused",
      note: "Momentum feels strong — ride the wave.",
    };
  }

  return {
    key: "mindfull_chill",
    label: "Steady & calm",
    note: "Balanced pace with gentle focus.",
  };
}

type EnergyFill = {
  gradient: string;
  label: string;
  labelColor: string;
  emoji: string;
};

function getEnergyFill(score: number): EnergyFill {
  if (score <= 3) {
    return {
      gradient: "linear-gradient(90deg, #fee2e2 0%, #f87171 100%)",
      label: "Low",
      labelColor: "text-rose-500",
      emoji: "😓",
    };
  }

  if (score >= 7) {
    return {
      gradient: "linear-gradient(90deg, #bae6fd 0%, #38bdf8 100%)",
      label: "Energetic",
      labelColor: "text-sky-500",
      emoji: "😄",
    };
  }

  return {
    gradient: "linear-gradient(90deg, #dcfce7 0%, #34d399 100%)",
    label: "Calm",
    labelColor: "text-emerald-600",
    emoji: "🙂",
  };
}
