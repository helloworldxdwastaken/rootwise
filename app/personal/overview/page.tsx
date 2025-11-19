"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { PageShell } from "@/components/PageShell";
import { Footer } from "@/components/Footer";

const gradientBar =
  "linear-gradient(90deg, rgba(199,235,221,1) 0%, rgba(253,227,181,1) 50%, rgba(255,210,173,1) 100%)";

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
  const [energyScore] = useState(5);
  const [hydrationGlasses] = useState(5);
  const hydrationTarget = 8;
  const greeting = getGreeting();
  const userName = "Enmanuel";

  return (
    <PageShell className="bg-[#fdf8f3]" contentClassName="px-0 pb-0">
      <main className="relative flex flex-1 flex-col gap-6 overflow-hidden px-6 pt-20 pb-16">
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
                  <p className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-600">
                    {`${greeting}, ${userName}`.toUpperCase()}
                  </p>
                  <h1 className="mt-3 text-4xl font-semibold text-slate-900">Wow, your body is doing today</h1>
                  <p className="text-sm text-slate-500">Rootwise keeps it calm so you see what matters first.</p>
                </div>
                <div className="rounded-3xl border border-white/60 bg-white/80 p-5 shadow-inner">
                  <div className="space-y-3">
                    <span className="text-xs uppercase tracking-[0.3em] text-slate-400">Energy</span>
                    <div className="flex items-center gap-3">
                      <span className="text-5xl leading-none">🙂</span>
                      <div className="flex-1">
                        <div className="relative h-3 w-full rounded-full bg-slate-100">
                          <div className="h-full rounded-full" style={{ width: `${(energyScore / 10) * 100}%`, background: gradientBar }} />
                          <span
                            className="absolute -top-6 text-xs font-semibold text-slate-600 transition-transform"
                            style={{ left: `calc(${(energyScore / 10) * 100}% - 16px)` }}
                          >
                            Calm
                          </span>
                        </div>
                        <p className="mt-3 text-xl font-semibold text-slate-900">{energyScore} / 10</p>
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-slate-500">Tip: plan lighter activities and stack hydration breaks today.</p>
                  <div className="mt-3 flex">
                    <span className="rounded-full bg-rose-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">
                      Mood: Needs rest
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-1 justify-center rounded-[40px] border border-white/40 bg-gradient-to-br from-amber-50 via-white to-emerald-50 p-6 shadow-inner">
                <MeditatingIllustration />
              </div>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            <StripCard title="Sleep" className="h-full">
              <p className="text-lg font-semibold text-slate-900">6 hr 40 min</p>
              <p className="text-xs text-slate-500">Later than usual: 12:20 am</p>
            </StripCard>

            <StripCard title="Hydration" className="h-full">
              <p className="text-lg font-semibold text-slate-900">
                {hydrationGlasses} of {hydrationTarget} glasses
              </p>
              <div className="mt-2 grid grid-cols-8 gap-1">
                <div className="col-span-8 h-3 rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(hydrationGlasses / hydrationTarget) * 100}%`,
                      backgroundImage: "linear-gradient(90deg, #1d4ed8 0%, #3b82f6 60%, #bae6fd 100%)",
                    }}
                  />
                </div>
                <div className="col-span-8 flex justify-between text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-slate-400">
                  {Array.from({ length: hydrationTarget }).map((_, idx) => (
                    <span key={idx}>●</span>
                  ))}
                </div>
              </div>
            </StripCard>

            <StripCard title="Symptoms" className="h-full">
              <ul className="space-y-1 text-slate-700">
                <li className="text-sm text-rose-500">• Headache</li>
                <li className="text-sm text-rose-500">• Fatigue</li>
              </ul>
            </StripCard>
          </section>

          <StripCard title="Weekly patterns">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                  Low energy midweek
                </span>
                <span>Most stable days: Monday & Friday</span>
              </div>
              <div className="rounded-2xl border border-white/60 bg-white/70 p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <ChartIcon />
                  <span>Average week · 6 entries</span>
                </div>
                <p className="text-xs text-slate-500">Energy dips after Wednesday workouts.</p>
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
      <svg viewBox="0 0 200 80" className="h-24 w-full text-slate-300">
        <path
          d="M0 65 C 20 60 30 45 45 42 C 65 37 80 60 95 58 C 112 56 125 43 140 46 C 150 48 155 52 200 50"
          stroke="#90b4b2"
          strokeWidth="4"
          fill="none"
        />
        <path
          d="M0 70 C 20 60 30 45 45 42 C 65 37 80 60 95 58 C 112 56 125 43 140 46 C 150 48 155 52 200 50 L200 80 L0 80 Z"
          fill="#dcefee"
          fillOpacity="0.7"
        />
      </svg>
      <div className="mt-1 flex justify-between text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-slate-400">
        {days.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
    </div>
  );
}

function MeditatingIllustration() {
  return (
    <svg viewBox="0 0 200 180" className="h-48 w-48 text-slate-700">
      <circle cx="100" cy="90" r="80" fill="#fef3c7" fillOpacity="0.4" />
      <path
        d="M100 40c10 0 18 8 18 18v14c0 5 3 9 7 12l8 6v16l-6 32h-54l-6-32V90l8-6c4-3 7-7 7-12V58c0-10 8-18 18-18z"
        fill="#fde68a"
      />
      <circle cx="100" cy="36" r="15" fill="#fcd34d" />
      <path
        d="M50 120c15-10 25-10 40 0s35 10 50 0 25-10 40 0"
        stroke="#94a3b8"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M80 138c10 0 20 4 20 4s10-4 20-4 20 4 20 4"
        stroke="#94a3b8"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
