import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getCurrentUser();
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // OPTIMIZATION: Generate all date keys and fetch in ONE query
    const dateKeys = [];
    const dateMap = new Map<string, { date: string; dayName: string }>();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      // Use LOCAL date, not UTC (fixes timezone bug)
      const dateKey = `health_${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      dateKeys.push(dateKey);
      dateMap.set(dateKey, {
        date: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`,
        dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
      });
    }

    // Batch fetch all 7 days in a single query
    const weekMemories = await prisma.userMemory.findMany({
      where: {
        userId: user.id,
        key: { in: dateKeys },
      },
    });

    // Create a map for quick lookup
    const memoriesMap = new Map(
      weekMemories.map(m => [m.key, m.value])
    );

    // Build week data using the fetched results
    const weekData = dateKeys.map(dateKey => {
      const dateInfo = dateMap.get(dateKey)!;
      const data = (memoriesMap.get(dateKey) as any) || {};
      
      return {
        date: dateInfo.date,
        dayName: dateInfo.dayName,
        energyScore: data.energyScore || null,
        sleepHours: data.sleepHours ? parseFloat(data.sleepHours) : null,
        hydrationGlasses: data.hydrationGlasses || 0,
        symptoms: data.symptoms || [],
        analyzedSymptoms: data.analyzedSymptoms || [],
      };
    });

    // Calculate patterns
    const energyScores = weekData.filter(d => d.energyScore !== null).map(d => d.energyScore);
    const avgEnergy = energyScores.length > 0 
      ? (energyScores.reduce((sum, val) => sum + val, 0) / energyScores.length).toFixed(1)
      : null;

    // Find best/worst days
    const daysWithEnergy = weekData.filter(d => d.energyScore !== null);
    const bestDay = daysWithEnergy.reduce((best, day) => 
      day.energyScore! > (best?.energyScore || 0) ? day : best
    , daysWithEnergy[0]);
    const worstDay = daysWithEnergy.reduce((worst, day) => 
      day.energyScore! < (worst?.energyScore || 10) ? day : worst
    , daysWithEnergy[0]);

    // Detect patterns
    const patterns = [];
    if (avgEnergy) {
      const lowEnergyDays = daysWithEnergy.filter(d => d.energyScore! < parseFloat(avgEnergy));
      if (lowEnergyDays.length >= 2) {
        const dayNames = lowEnergyDays.map(d => d.dayName).join(", ");
        patterns.push({
          type: "low_energy",
          description: `Low energy on ${dayNames}`,
          severity: "medium",
        });
      }
    }

    // Check hydration patterns
    const poorHydrationDays = weekData.filter(d => d.hydrationGlasses < 4);
    if (poorHydrationDays.length >= 3) {
      patterns.push({
        type: "hydration",
        description: `Under-hydrated ${poorHydrationDays.length} days this week`,
        severity: "medium",
      });
    }

    // Check sleep patterns
    const poorSleepDays = weekData.filter(d => d.sleepHours !== null && d.sleepHours < 6);
    if (poorSleepDays.length >= 2) {
      patterns.push({
        type: "sleep",
        description: `Poor sleep (< 6hr) on ${poorSleepDays.length} days`,
        severity: "high",
      });
    }

    return NextResponse.json({
      weekData,
      avgEnergy: avgEnergy ? parseFloat(avgEnergy) : null,
      bestDay: bestDay ? {
        day: bestDay.dayName,
        energy: bestDay.energyScore,
      } : null,
      worstDay: worstDay ? {
        day: worstDay.dayName,
        energy: worstDay.energyScore,
      } : null,
      patterns,
      dataPoints: daysWithEnergy.length,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Weekly health fetch error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

