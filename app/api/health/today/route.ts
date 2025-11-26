import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { getLocalDate } from "@/lib/timezone";

export async function GET() {
  try {
    const user = await getCurrentUser();
    const { dateKey: todayKey, dateString } = getLocalDate();

    // Get today's metrics and patient profile in parallel
    const [todayMetrics, patientProfile] = await Promise.all([
      prisma.userMemory.findUnique({
        where: {
          userId_key: {
            userId: user.id,
            key: todayKey,
          },
        },
      }),
      prisma.patientProfile.findUnique({
        where: { clerkId: user.id },
      }),
    ]);

    // Calculate calorie goal based on profile (Mifflin-St Jeor + deficit)
    let calorieGoal = 2000; // Default
    if (patientProfile?.weightKg && patientProfile?.heightCm && patientProfile?.dateOfBirth) {
      const age = Math.floor((Date.now() - new Date(patientProfile.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
      const weight = patientProfile.weightKg;
      const height = patientProfile.heightCm;
      const isMale = patientProfile.sex === 'MALE';
      
      // Mifflin-St Jeor Equation for BMR
      const bmr = isMale
        ? (10 * weight) + (6.25 * height) - (5 * age) + 5
        : (10 * weight) + (6.25 * height) - (5 * age) - 161;
      
      // Assume moderate activity (1.55 multiplier) for TDEE, then subtract 500 for deficit
      const tdee = bmr * 1.55;
      calorieGoal = Math.round(tdee - 500);
    }

    if (!todayMetrics) {
      // Return default values for new day
      return NextResponse.json({
        date: dateString,
        energyScore: null,
        sleepHours: null,
        hydrationGlasses: 0,
        moodScore: null,
        symptoms: [],
        notes: null,
        // Activity data from health apps
        steps: null,
        heartRate: null,
        activeCalories: null,
        // Calorie goal
        calorieGoal,
      });
    }

    const data = todayMetrics.value as any;
    return NextResponse.json({
      date: dateString,
      energyScore: data.energyScore || null,
      sleepHours: data.sleepHours || null,
      hydrationGlasses: data.hydrationGlasses || 0,
      moodScore: data.moodScore || null,
      symptoms: data.symptoms || [],
      analyzedSymptoms: data.analyzedSymptoms || [],
      notes: data.notes || null,
      // Activity data from health apps
      steps: data.steps || null,
      heartRate: data.heartRate || null,
      activeCalories: data.activeCalories || null,
      // Calorie goal
      calorieGoal,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Health today fetch error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    const body = await request.json();
    const { dateKey: todayKey, dateString } = getLocalDate();

    const {
      energyScore,
      sleepHours,
      hydrationGlasses,
      moodScore,
      symptoms,
      notes,
    } = body;

    // Get existing data
    const existing = await prisma.userMemory.findUnique({
      where: {
        userId_key: {
          userId: user.id,
          key: todayKey,
        },
      },
    });

    const currentData = (existing?.value as any) || {};

    // Merge with new data (allows partial updates)
    const updatedData = {
      ...currentData,
      ...(energyScore !== undefined && { energyScore }),
      ...(sleepHours !== undefined && { sleepHours }),
      ...(hydrationGlasses !== undefined && { hydrationGlasses }),
      ...(moodScore !== undefined && { moodScore }),
      ...(symptoms !== undefined && { symptoms }),
      ...(notes !== undefined && { notes }),
      lastUpdated: new Date().toISOString(),
    };

    // Upsert to database
    await prisma.userMemory.upsert({
      where: {
        userId_key: {
          userId: user.id,
          key: todayKey,
        },
      },
      update: {
        value: updatedData,
        lastUsedAt: new Date(),
      },
      create: {
        userId: user.id,
        key: todayKey,
        value: updatedData,
        importance: "MEDIUM",
        lastUsedAt: new Date(),
      },
    });

    return NextResponse.json({
      date: dateString,
      ...updatedData,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Health today update error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  // Alias for POST (partial update)
  return POST(request);
}

