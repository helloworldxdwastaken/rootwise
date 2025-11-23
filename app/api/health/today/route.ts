import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getCurrentUser();
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Use LOCAL date, not UTC (fixes timezone bug)
    const todayKey = `health_${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    const todayMetrics = await prisma.userMemory.findUnique({
      where: {
        userId_key: {
          userId: user.id,
          key: todayKey,
        },
      },
    });

    if (!todayMetrics) {
      // Return default values for new day
      return NextResponse.json({
        date: today.toISOString(),
        energyScore: null,
        sleepHours: null,
        hydrationGlasses: 0,
        moodScore: null,
        symptoms: [],
        notes: null,
      });
    }

    const data = todayMetrics.value as any;
    return NextResponse.json({
      date: today.toISOString(),
      energyScore: data.energyScore || null,
      sleepHours: data.sleepHours || null,
      hydrationGlasses: data.hydrationGlasses || 0,
      moodScore: data.moodScore || null,
      symptoms: data.symptoms || [],
      notes: data.notes || null,
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
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    // Use LOCAL date, not UTC (fixes timezone bug)
    const todayKey = `health_${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

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
      date: today.toISOString(),
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

