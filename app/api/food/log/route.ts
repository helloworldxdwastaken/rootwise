import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

/**
 * Log food entry to database
 * POST /api/food/log
 */
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    const body = await request.json();

    const {
      description,
      calories,
      protein,
      carbs,
      fat,
      fiber,
      mealType,
      portionSize,
      confidence,
      imageUrl,
      eatenAt,
    } = body;

    if (!description || calories === undefined) {
      return NextResponse.json(
        { error: "description and calories are required" },
        { status: 400 }
      );
    }

    const foodLog = await prisma.foodLog.create({
      data: {
        userId: user.id,
        description,
        calories: Math.round(calories),
        protein: protein || null,
        carbs: carbs || null,
        fat: fat || null,
        fiber: fiber || null,
        mealType: mealType || "OTHER",
        portionSize: portionSize || null,
        confidence: confidence || null,
        imageUrl: imageUrl || null,
        eatenAt: eatenAt ? new Date(eatenAt) : new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      foodLog,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Food log error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

/**
 * Get food logs for user
 * GET /api/food/log?date=2024-01-15&days=7
 */
export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    const { searchParams } = new URL(request.url);
    
    const dateStr = searchParams.get("date");
    const days = parseInt(searchParams.get("days") || "1");

    let startDate: Date;
    let endDate: Date;

    if (dateStr) {
      startDate = new Date(dateStr);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + days);
    } else {
      // Default: today
      startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
    }

    const foodLogs = await prisma.foodLog.findMany({
      where: {
        userId: user.id,
        eatenAt: {
          gte: startDate,
          lt: endDate,
        },
      },
      orderBy: { eatenAt: "desc" },
    });

    // Calculate daily totals
    const totals = foodLogs.reduce(
      (acc, log) => ({
        calories: acc.calories + log.calories,
        protein: acc.protein + (log.protein || 0),
        carbs: acc.carbs + (log.carbs || 0),
        fat: acc.fat + (log.fat || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    return NextResponse.json({
      foodLogs,
      totals,
      count: foodLogs.length,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Food log fetch error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

/**
 * Delete a food log entry
 * DELETE /api/food/log?id=xxx
 */
export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "id is required" },
        { status: 400 }
      );
    }

    // Verify ownership
    const existing = await prisma.foodLog.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== user.id) {
      return NextResponse.json(
        { error: "Food log not found" },
        { status: 404 }
      );
    }

    await prisma.foodLog.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Food log delete error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

