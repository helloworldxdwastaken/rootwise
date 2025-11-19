import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

type ConditionInput = {
  name: string;
  category?: "CHRONIC" | "ACUTE" | "SYMPTOM" | "DIAGNOSIS";
  notes?: string;
  diagnosedAt?: Date | string;
};

type MemoryFact = {
  key: string;
  value: Prisma.InputJsonValue;
  importance?: "LOW" | "MEDIUM" | "HIGH";
};

/**
 * Upsert conditions from structured input
 * Prevents duplicates by checking existing active conditions with same name
 */
export async function upsertConditionFromStructuredInput(
  userId: string,
  conditions: ConditionInput[]
) {
  const results = [];

  for (const condition of conditions) {
    // Check if condition already exists (case-insensitive)
    const existing = await prisma.condition.findFirst({
      where: {
        userId,
        name: {
          equals: condition.name,
          mode: "insensitive",
        },
        isActive: true,
      },
    });

    if (existing) {
      // Update existing condition
      const updated = await prisma.condition.update({
        where: { id: existing.id },
        data: {
          ...(condition.category && { category: condition.category }),
          ...(condition.notes && { notes: condition.notes }),
          ...(condition.diagnosedAt && {
            diagnosedAt:
              typeof condition.diagnosedAt === "string"
                ? new Date(condition.diagnosedAt)
                : condition.diagnosedAt,
          }),
        },
      });
      results.push(updated);
    } else {
      // Create new condition
      const created = await prisma.condition.create({
        data: {
          userId,
          name: condition.name,
          category: condition.category || "SYMPTOM",
          notes: condition.notes,
          diagnosedAt:
            condition.diagnosedAt
              ? typeof condition.diagnosedAt === "string"
                ? new Date(condition.diagnosedAt)
                : condition.diagnosedAt
              : null,
        },
      });
      results.push(created);
    }
  }

  return results;
}

/**
 * Update user memory from facts
 * Upserts based on userId + key combination
 */
export async function updateUserMemoryFromFacts(
  userId: string,
  facts: MemoryFact[]
) {
  const results = [];

  for (const fact of facts) {
    const memory = await prisma.userMemory.upsert({
      where: {
        userId_key: {
          userId,
          key: fact.key,
        },
      },
      update: {
        value: fact.value,
        importance: fact.importance || "MEDIUM",
        lastUsedAt: new Date(),
      },
      create: {
        userId,
        key: fact.key,
        value: fact.value,
        importance: fact.importance || "MEDIUM",
        lastUsedAt: new Date(),
      },
    });
    results.push(memory);
  }

  return results;
}

/**
 * Helper to mark memory as recently used
 */
export async function touchMemory(userId: string, key: string) {
  try {
    await prisma.userMemory.updateMany({
      where: {
        userId,
        key,
      },
      data: {
        lastUsedAt: new Date(),
      },
    });
  } catch (error) {
    console.error("Error touching memory:", error);
  }
}

/**
 * Get high-importance memories for context
 */
export async function getImportantMemories(userId: string, limit: number = 10) {
  return await prisma.userMemory.findMany({
    where: {
      userId,
      importance: { in: ["HIGH", "MEDIUM"] },
    },
    orderBy: [
      { importance: "desc" },
      { lastUsedAt: "desc" },
    ],
    take: limit,
  });
}

