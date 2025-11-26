"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Sparkles, Plus, Droplet, Moon, Battery, Loader2, Utensils } from "lucide-react";
import { cn } from "@/lib/utils";
import { PageShell } from "@/components/PageShell";
import { Footer } from "@/components/Footer";
import { EmotionShowcase } from "@/components/EmotionShowcase";
import type { EmotionKey } from "@/components/EmotionShowcase";
import { OverviewChat } from "@/components/OverviewChat";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";

type StripCardProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

function StripCard({ title, children, className }: StripCardProps) {
  return (
    <article
      className={cn(
        "rounded-2xl border border-white/50 bg-white/80 p-4 shadow-[0_8px_24px_rgba(15,40,34,0.08)] backdrop-blur-sm",
        className
      )}
    >
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      <div className="mt-2 text-sm text-slate-600">{children}</div>
    </article>
  );
}

export default function PersonalOverviewPage() {
  const { data: session } = useSession();
  const [healthData, setHealthData] = useState<any>(null);
  const [weeklyData, setWeeklyData] = useState<any>(null);
  const [foodData, setFoodData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [analyzingSymptoms, setAnalyzingSymptoms] = useState(false);
  
  useEffect(() => {
    async function loadHealthData() {
      try {
        // OPTIMIZATION 1: Load all endpoints in parallel
        const [todayResponse, weeklyResponse, foodResponse] = await Promise.all([
          fetch("/api/health/today"),
          fetch("/api/health/weekly"),
          fetch("/api/food/log"),
        ]);

        // Process today's data
        if (todayResponse.ok) {
          const data = await todayResponse.json();
          setHealthData(data);
          
          // OPTIMIZATION 2: Trigger AI analysis non-blocking (don't await)
          if (data.energyScore || data.sleepHours || data.hydrationGlasses > 0) {
            analyzeSymptoms();
          }
        }

        // Process weekly data
        if (weeklyResponse.ok) {
          const weekly = await weeklyResponse.json();
          setWeeklyData(weekly);
        }

        // Process food data
        if (foodResponse.ok) {
          const food = await foodResponse.json();
          setFoodData(food);
        }
      } catch (error) {
        console.error("Failed to load health data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadHealthData();
  }, []);

  const analyzeSymptoms = async () => {
    if (analyzingSymptoms) return; // Prevent duplicate calls
    
    setAnalyzingSymptoms(true);
    try {
      const response = await fetch("/api/health/analyze-symptoms", {
        method: "POST",
      });
      if (response.ok) {
        const data = await response.json();
        setHealthData((prev: any) => ({
          ...prev,
          analyzedSymptoms: data.symptoms,
        }));
      }
    } catch (error) {
      console.error("Failed to analyze symptoms:", error);
    } finally {
      setAnalyzingSymptoms(false);
    }
  };

  const energyScore = healthData?.energyScore || null;
  const hydrationGlasses = healthData?.hydrationGlasses || 0;
  const hydrationTarget = 6;
  const greeting = getGreeting();
  const userName = session?.user?.name || "there";
  const emotionState = getEmotionState(energyScore || 5);
  const energyFill = getEnergyFill(energyScore || 5);
  
  // Use AI-analyzed symptoms
  const analyzedSymptoms = healthData?.analyzedSymptoms || [];
  
  const symptomGroups = analyzedSymptoms.length > 0 ? [
    {
      category: "AI-Detected Patterns",
      entries: analyzedSymptoms.map((symptom: any) => ({
        icon: symptom.confidence === "high" ? "🔴" : symptom.confidence === "medium" ? "🟡" : "⚪",
        label: symptom.name,
        trend: symptom.confidence === "high" ? "Likely" : symptom.confidence === "medium" ? "Possible" : "Monitoring",
        trendColor: symptom.confidence === "high" ? "text-rose-600" : symptom.confidence === "medium" ? "text-amber-600" : "text-slate-500",
        reasoning: symptom.reasoning,
      })),
    },
  ] : [];

  const handleQuickLog = async (type: string, value: any) => {
    try {
      await fetch("/api/health/today", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [type]: value }),
      });
      // Reload health data and re-analyze symptoms
      await refreshHealthData();
    } catch (error) {
      console.error("Failed to log metric:", error);
    }
  };

  const refreshHealthData = async () => {
    try {
      // OPTIMIZATION: Parallel refresh
      const [todayResponse, weeklyResponse, foodResponse] = await Promise.all([
        fetch("/api/health/today"),
        fetch("/api/health/weekly"),
        fetch("/api/food/log"),
      ]);
      
      if (todayResponse.ok) {
        const data = await todayResponse.json();
        setHealthData(data);
        
        // Trigger symptom analysis (non-blocking)
        if (data.energyScore || data.sleepHours || data.hydrationGlasses > 0) {
          analyzeSymptoms();
        }
      }
      
      if (weeklyResponse.ok) {
        const weekly = await weeklyResponse.json();
        setWeeklyData(weekly);
      }

      if (foodResponse.ok) {
        const food = await foodResponse.json();
        setFoodData(food);
      }
    } catch (error) {
      console.error("Failed to refresh health data:", error);
    }
  };

  if (loading) {
    return (
      <PageShell className="bg-[#fdf8f3]" contentClassName="px-0 pb-0">
        <main className="relative flex flex-1 flex-col gap-6 px-6 pt-16 pb-12">
          <div className="relative mx-auto flex w-full max-w-[1600px] gap-6">
            <div className="flex flex-1 flex-col gap-6">
              {/* Hero Skeleton */}
              <LoadingSkeleton className="h-96 w-full" />
              
              {/* Cards Skeleton */}
              <div className="grid gap-4 md:grid-cols-3">
                <LoadingSkeleton className="h-40 w-full" />
                <LoadingSkeleton className="h-40 w-full" />
                <LoadingSkeleton className="h-40 w-full" />
              </div>
              
              {/* Symptoms Skeleton */}
              <LoadingSkeleton className="h-64 w-full" />
            </div>
            
            {/* Chat Skeleton */}
            <div className="w-[400px]">
              <LoadingSkeleton className="h-[700px] w-full" />
            </div>
          </div>
        </main>
      </PageShell>
    );
  }

  return (
    <PageShell className="bg-[#fdf8f3]" contentClassName="px-0 pb-0">
      {/* Full-screen background gradients */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-200/25 blur-[80px]" />
        <div className="absolute bottom-0 left-8 h-64 w-64 rounded-full bg-[#F4C977]/30 blur-[90px]" />
        <div className="absolute top-32 right-0 h-72 w-72 translate-x-1/3 rounded-full bg-[#cbd4ff]/30 blur-[100px]" />
      </div>
      
      <main className="relative flex flex-1 flex-col gap-6 px-6 pt-16 pb-12 z-10">
        <div className="relative mx-auto flex w-full max-w-[1600px] gap-6">
          {/* Left side - Overview Content */}
          <div className="flex flex-1 flex-col gap-6">
          <section className="relative overflow-hidden rounded-[36px] border border-white/40 bg-white/80 p-8 shadow-[0_20px_60px_rgba(15,40,34,0.15)] backdrop-blur-sm">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -left-10 top-0 h-40 w-40 rounded-full bg-emerald-100/60 blur-2xl" />
              <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-amber-100/70 blur-2xl" />
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
                  <p className="text-sm text-slate-500">Track your wellness and chat with AI for insights.</p>
                </div>

                {/* Quick Log Buttons */}
                {energyScore === null && (
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        const score = prompt("How's your energy? (1-10)");
                        if (score) handleQuickLog("energyScore", parseInt(score));
                      }}
                      className="flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 transition-all hover:bg-emerald-100"
                    >
                      <Battery className="h-4 w-4" />
                      Log Energy
                    </button>
                    <button
                      onClick={() => {
                        const hours = prompt("Hours slept last night? (e.g. 7.5)");
                        if (hours) handleQuickLog("sleepHours", hours);
                      }}
                      className="flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition-all hover:bg-blue-100"
                    >
                      <Moon className="h-4 w-4" />
                      Log Sleep
                    </button>
                  </div>
                )}

                {energyScore !== null ? (
                  <div className="rounded-3xl border border-white/60 bg-white/80 p-5 shadow-inner">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs uppercase tracking-[0.3em] text-slate-400">Energy</span>
                        <button
                          onClick={() => {
                            const score = prompt("Update energy? (1-10)", energyScore?.toString());
                            if (score) handleQuickLog("energyScore", parseInt(score));
                          }}
                          className="text-xs text-emerald-600 hover:underline"
                        >
                          Update
                        </button>
                      </div>
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
                    <p className="mt-4 text-sm text-slate-500">
                      {energyScore >= 7
                        ? "Great energy! Keep up the good habits."
                        : energyScore >= 5
                        ? "Moderate energy. Consider a quick walk or healthy snack."
                        : "Low energy detected. Rest, hydrate, and check in with yourself."}
                    </p>
                  </div>
                ) : (
                  <div className="rounded-3xl border border-white/60 bg-white/80 p-5 shadow-inner text-center">
                    <p className="text-sm text-slate-500">
                      Start tracking by logging your energy level or chatting with the AI →
                    </p>
                  </div>
                )}
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

          {/* Today's Nutrition Card */}
          {foodData && (
            <section className="mb-4">
              <StripCard title="Today's Nutrition" className="h-full">
                {foodData.foodLogs && foodData.foodLogs.length > 0 ? (
                  <div className="space-y-4">
                    {/* Totals Summary */}
                    <div className="grid grid-cols-4 gap-3">
                      <div className="text-center p-2 rounded-xl bg-gradient-to-b from-emerald-50 to-white border border-emerald-100">
                        <p className="text-2xl font-bold text-emerald-600">{foodData.totals?.calories || 0}</p>
                        <p className="text-[0.65rem] uppercase tracking-wide text-slate-500">Calories</p>
                      </div>
                      <div className="text-center p-2 rounded-xl bg-gradient-to-b from-blue-50 to-white border border-blue-100">
                        <p className="text-2xl font-bold text-blue-600">{Math.round(foodData.totals?.protein || 0)}g</p>
                        <p className="text-[0.65rem] uppercase tracking-wide text-slate-500">Protein</p>
                      </div>
                      <div className="text-center p-2 rounded-xl bg-gradient-to-b from-amber-50 to-white border border-amber-100">
                        <p className="text-2xl font-bold text-amber-600">{Math.round(foodData.totals?.carbs || 0)}g</p>
                        <p className="text-[0.65rem] uppercase tracking-wide text-slate-500">Carbs</p>
                      </div>
                      <div className="text-center p-2 rounded-xl bg-gradient-to-b from-rose-50 to-white border border-rose-100">
                        <p className="text-2xl font-bold text-rose-500">{Math.round(foodData.totals?.fat || 0)}g</p>
                        <p className="text-[0.65rem] uppercase tracking-wide text-slate-500">Fat</p>
                      </div>
                    </div>

                    {/* Calorie Progress */}
                    {healthData?.calorieGoal && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500">Daily Goal Progress</span>
                          <span className="font-semibold text-slate-700">
                            {foodData.totals?.calories || 0} / {healthData.calorieGoal} kcal
                          </span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={cn(
                              "h-full rounded-full transition-all",
                              (foodData.totals?.calories || 0) > healthData.calorieGoal
                                ? "bg-rose-400"
                                : "bg-gradient-to-r from-emerald-400 to-emerald-500"
                            )}
                            style={{ width: `${Math.min(100, ((foodData.totals?.calories || 0) / healthData.calorieGoal) * 100)}%` }}
                          />
                        </div>
                        <p className="text-xs text-slate-500">
                          {(foodData.totals?.calories || 0) < healthData.calorieGoal 
                            ? `${healthData.calorieGoal - (foodData.totals?.calories || 0)} kcal remaining`
                            : `${(foodData.totals?.calories || 0) - healthData.calorieGoal} kcal over goal`}
                        </p>
                      </div>
                    )}

                    {/* Meals List */}
                    <div className="space-y-2">
                      <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Meals Today</p>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {foodData.foodLogs.slice(0, 5).map((log: any) => (
                          <div 
                            key={log.id} 
                            className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-lg">
                                {log.mealType === 'BREAKFAST' ? '🍳' : 
                                 log.mealType === 'LUNCH' ? '🥗' : 
                                 log.mealType === 'DINNER' ? '🍽️' : 
                                 log.mealType === 'SNACK' ? '🍎' : '🍴'}
                              </span>
                              <div>
                                <p className="text-sm font-medium text-slate-700 line-clamp-1">{log.description}</p>
                                <p className="text-xs text-slate-400">
                                  {new Date(log.eatenAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                                </p>
                              </div>
                            </div>
                            <span className="text-sm font-semibold text-emerald-600">{log.calories} kcal</span>
                          </div>
                        ))}
                        {foodData.foodLogs.length > 5 && (
                          <p className="text-xs text-center text-slate-400">
                            +{foodData.foodLogs.length - 5} more meals
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Utensils className="h-8 w-8 mx-auto text-slate-300 mb-2" />
                    <p className="text-sm text-slate-500">No meals logged today</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Use the mobile app to scan and log your food
                    </p>
                  </div>
                )}
              </StripCard>
            </section>
          )}

          <section className="grid gap-4 md:grid-cols-3">
            <StripCard title="Sleep" className="h-full">
              {weeklyData && weeklyData.weekData ? (
                <>
                  {/* Today's sleep */}
                  {healthData?.sleepHours ? (
                    <div className="mb-3">
                      <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Today</p>
                      <div className="flex items-center justify-between">
                        <p className="text-lg font-semibold text-slate-900">{healthData.sleepHours} hrs</p>
                        <button
                          onClick={() => {
                            const hours = prompt("Update sleep hours?", healthData.sleepHours);
                            if (hours) handleQuickLog("sleepHours", hours);
                          }}
                          className="text-xs text-emerald-600 hover:underline"
                        >
                          Update
                        </button>
                      </div>
                      <p className="mt-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[0.7rem] font-semibold text-emerald-600">
                        <span className="text-base">🌙</span>
                        {parseFloat(healthData.sleepHours) >= 7 
                          ? "Great sleep!"
                          : "Try for more rest"}
                      </p>
                    </div>
                  ) : (
                    <div className="mb-3">
                      <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Today</p>
                      <p className="text-sm text-slate-500">Not logged yet</p>
                      <button
                        onClick={() => {
                          const hours = prompt("Hours slept last night? (e.g. 7.5)");
                          if (hours) handleQuickLog("sleepHours", hours);
                        }}
                        className="mt-1 text-xs text-emerald-600 hover:underline"
                      >
                        Log sleep
                      </button>
                    </div>
                  )}
                  
                  {/* Weekly sleep entries */}
                  <div className="mt-3 pt-3 border-t border-slate-200">
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-400 mb-2">This Week</p>
                    <div className="space-y-1.5">
                      {weeklyData.weekData.filter((day: any) => day.sleepHours !== null).length > 0 ? (
                        weeklyData.weekData.map((day: any, idx: number) => (
                          day.sleepHours !== null && (
                            <div key={idx} className="flex items-center justify-between text-xs">
                              <span className="text-slate-600 font-medium">{day.dayName}</span>
                              <span className={cn(
                                "font-semibold",
                                day.sleepHours >= 7 ? "text-emerald-600" : 
                                day.sleepHours >= 6 ? "text-amber-600" : "text-rose-600"
                              )}>
                                {day.sleepHours} hrs
                              </span>
                            </div>
                          )
                        ))
                      ) : (
                        <p className="text-xs text-slate-400">No sleep logged this week</p>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-sm text-slate-500">Not tracked yet</p>
                  <button
                    onClick={() => {
                      const hours = prompt("Hours slept last night? (e.g. 7.5)");
                      if (hours) handleQuickLog("sleepHours", hours);
                    }}
                    className="mt-2 text-xs text-emerald-600 hover:underline"
                  >
                    Log sleep
                  </button>
                </>
              )}
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
                <button
                  onClick={() => handleQuickLog("hydrationGlasses", hydrationGlasses + 1)}
                  className="flex items-center gap-1 rounded-full bg-sky-50 px-3 py-1.5 text-xs font-medium text-sky-600 transition-all hover:bg-sky-100"
                >
                  <Droplet className="h-3 w-3" />
                  +1
                </button>
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
              {hydrationGlasses < hydrationTarget && (
                <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-[0.7rem] font-semibold text-sky-500">
                  <span className="text-base">💧</span>
                  {hydrationTarget - hydrationGlasses} more to reach your goal
                </p>
              )}
            </StripCard>

            <StripCard title="AI Health Insights" className="h-full relative">
              {analyzingSymptoms && (
                <div className="absolute top-2 right-4 flex items-center gap-2 text-xs text-emerald-600">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>Analyzing...</span>
                </div>
              )}
              {analyzedSymptoms.length > 0 ? (
                <div className="space-y-3 text-sm text-slate-700">
                  {symptomGroups.map((group) => (
                    <div key={group.category}>
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                        {group.category}
                      </p>
                      <ul className="mt-2 space-y-3">
                        {group.entries.map((entry: any, idx: number) => (
                          <li key={idx} className="space-y-1">
                            <div className="flex items-center justify-between gap-3">
                              <span className="flex items-center gap-2">
                                <span className="text-base leading-none">{entry.icon}</span>
                                <span className="font-medium">{entry.label}</span>
                              </span>
                              <span className={cn("text-xs font-semibold", entry.trendColor)}>
                                {entry.trend}
                              </span>
                            </div>
                            {entry.reasoning && (
                              <p className="text-xs text-slate-500 pl-6">
                                {entry.reasoning}
                              </p>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : analyzingSymptoms ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
                  <p className="text-sm text-slate-500">
                    AI is analyzing your health patterns...
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-slate-500">
                    {energyScore || healthData?.sleepHours || hydrationGlasses > 0
                      ? "Ready for AI analysis"
                      : "Log your energy, sleep, or chat with AI to get personalized health insights."}
                  </p>
                  {(energyScore || healthData?.sleepHours || hydrationGlasses > 0) && (
                    <button
                      onClick={analyzeSymptoms}
                      disabled={analyzingSymptoms}
                      className="text-xs text-emerald-600 hover:underline disabled:opacity-50"
                    >
                      Analyze now
                    </button>
                  )}
                </div>
              )}
            </StripCard>
          </section>

          <StripCard title="Weekly patterns">
            {weeklyData && weeklyData.dataPoints > 0 ? (
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                <div className="space-y-4 lg:w-2/5">
                  <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                    {weeklyData.patterns.length > 0 ? (
                      weeklyData.patterns.map((pattern: any, idx: number) => (
                        <span key={idx} className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                          {pattern.description}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-500">No clear patterns yet</span>
                    )}
                  </div>
                  {weeklyData.bestDay && weeklyData.worstDay && (
                    <div className="space-y-2 text-sm text-slate-600">
                      <span>Best: {weeklyData.bestDay.day} ({weeklyData.bestDay.energy}/10)</span>
                      <br />
                      <span>Lowest: {weeklyData.worstDay.day} ({weeklyData.worstDay.energy}/10)</span>
                    </div>
                  )}
                  <div className="rounded-2xl border border-white/60 bg-white/70 p-4 text-sm text-slate-700 shadow-inner">
                    <div className="mb-2 flex items-center gap-2 font-semibold">
                      <ChartIcon />
                      <span>This week · {weeklyData.dataPoints} entries</span>
                    </div>
                    {weeklyData.avgEnergy && (
                      <p className="text-xs text-slate-500">
                        Average energy: {weeklyData.avgEnergy}/10
                      </p>
                    )}
                  </div>
                </div>
                <div className="lg:w-3/5 w-full rounded-3xl border border-white/60 bg-white/80 p-4 shadow-inner">
                  <WeeklyChart data={weeklyData.weekData} />
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-slate-500">
                  Track your energy daily to see patterns emerge over the week.
                </p>
                <p className="text-xs text-slate-400 mt-2">
                  You have {weeklyData?.dataPoints || 0} days logged so far.
                </p>
              </div>
            )}
          </StripCard>

          {analyzedSymptoms.length > 0 && (
            <section className="grid gap-4 md:grid-cols-2">
              <StripCard title="What may be affecting you">
                <ul className="mt-3 space-y-2 text-sm font-medium text-slate-800">
                  {energyScore !== null && energyScore < 6 && (
                    <li className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-rose-400" />
                      Low energy <span className="font-normal text-slate-500">{energyScore}/10</span>
                    </li>
                  )}
                  {healthData?.sleepHours && parseFloat(healthData.sleepHours) < 7 && (
                    <li className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-yellow-300" />
                      Insufficient sleep <span className="font-normal text-slate-500">{healthData.sleepHours}</span>
                    </li>
                  )}
                  {hydrationGlasses < 4 && (
                    <li className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-sky-400" />
                      Under-hydrated <span className="font-normal text-slate-500">{hydrationGlasses}/6 glasses</span>
                    </li>
                  )}
                  {analyzedSymptoms.filter((s: any) => s.confidence === "high").length === 0 && (
                    <li className="flex items-center gap-2 text-emerald-600">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      No major concerns detected
                    </li>
                  )}
                </ul>
              </StripCard>
              <StripCard title="AI recommendations">
                <ul className="mt-3 space-y-2 text-sm font-medium text-slate-800">
                  {energyScore !== null && energyScore < 6 && (
                    <li className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      Light movement & fresh air
                    </li>
                  )}
                  {healthData?.sleepHours && parseFloat(healthData.sleepHours) < 7 && (
                    <li className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-blue-400" />
                      Early bedtime <span className="font-normal text-slate-500">(aim for 7-8hr)</span>
                    </li>
                  )}
                  {hydrationGlasses < 4 && (
                    <li className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-sky-400" />
                      Increase water intake
                    </li>
                  )}
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-amber-400" />
                    Chat with AI for personalized tips →
                  </li>
                </ul>
              </StripCard>
            </section>
          )}
          </div>
          
          {/* Right side - Chat */}
          <div className="hidden lg:block w-[420px] flex-shrink-0">
            <div className="sticky top-24 h-[calc(100vh-120px)]">
              <OverviewChat 
                energyScore={energyScore}
                sleepHours={healthData?.sleepHours || null}
                hydrationGlasses={hydrationGlasses}
                symptoms={analyzedSymptoms.map((s: any) => s.name)}
                caloriesConsumed={foodData?.totals?.calories || 0}
                onDataUpdated={refreshHealthData}
              />
            </div>
          </div>
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

function WeeklyChart({ data }: { data?: any[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center text-sm text-slate-400">
        No data to display yet
      </div>
    );
  }

  // Calculate path from actual data
  const maxEnergy = 10;
  const chartHeight = 80;
  const chartWidth = 200;
  const pointSpacing = chartWidth / (data.length - 1 || 1);

  // Generate path from energy scores
  const pathPoints = data.map((day, idx) => {
    const x = idx * pointSpacing;
    const energy = day.energyScore || 5; // Default to 5 if no data
    const y = chartHeight - (energy / maxEnergy) * (chartHeight - 20); // 20px padding at top
    return { x, y, energy };
  });

  // Create smooth curve path
  const pathD = pathPoints.map((point, idx) => {
    if (idx === 0) return `M${point.x} ${point.y}`;
    const prevPoint = pathPoints[idx - 1];
    const cpx = (prevPoint.x + point.x) / 2;
    return `C ${cpx} ${prevPoint.y} ${cpx} ${point.y} ${point.x} ${point.y}`;
  }).join(" ");

  // Create fill path
  const fillD = `${pathD} L${chartWidth} ${chartHeight} L0 ${chartHeight} Z`;

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        preserveAspectRatio="none"
        className="h-32 w-full text-slate-300"
      >
        {/* Line */}
        <path
          d={pathD}
          stroke="#90b4b2"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
        {/* Fill */}
        <path
          d={fillD}
          fill="#dcefee"
          fillOpacity="0.7"
        />
        {/* Data points */}
        {pathPoints.map((point, idx) => (
          <circle
            key={idx}
            cx={point.x}
            cy={point.y}
            r="3"
            fill={point.energy >= 7 ? "#34d399" : point.energy >= 5 ? "#90b4b2" : "#f87171"}
          />
        ))}
      </svg>
      <div className="mt-3 flex justify-between text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-slate-400">
        {data.map((day) => (
          <span key={day.date} className={cn(day.energyScore ? "text-slate-600" : "text-slate-300")}>
            {day.dayName}
          </span>
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
