import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-helpers";
import {
  upsertConditionFromStructuredInput,
  updateUserMemoryFromFacts,
} from "@/lib/profile-updater";

/**
 * Health intake endpoint
 * Accepts structured health data and updates patient history
 * 
 * Body format:
 * {
 *   "conditions": [
 *     { "name": "Anemia", "category": "CHRONIC", "notes": "Diagnosed 2023" },
 *     { "name": "Tachycardia", "category": "CHRONIC" }
 *   ],
 *   "facts": [
 *     { "key": "main_conditions", "value": ["anemia", "tachycardia"], "importance": "HIGH" }
 *   ]
 * }
 */
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    const body = await request.json();
    const { conditions, facts } = body;

    const results: {
      conditions?: any[];
      memories?: any[];
    } = {};

    // Process conditions if provided
    if (conditions && Array.isArray(conditions) && conditions.length > 0) {
      const upsertedConditions = await upsertConditionFromStructuredInput(
        user.id,
        conditions
      );
      results.conditions = upsertedConditions;
    }

    // Process facts/memories if provided
    if (facts && Array.isArray(facts) && facts.length > 0) {
      const upsertedMemories = await updateUserMemoryFromFacts(user.id, facts);
      results.memories = upsertedMemories;
    }

    return NextResponse.json({
      success: true,
      ...results,
    }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Health intake error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

