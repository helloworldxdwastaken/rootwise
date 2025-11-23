import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getCurrentUser();

    // OPTIMIZATION: Select only necessary fields and limit memories to 10
    const profile = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        preferredLanguage: true,
        timezone: true,
        profile: {
          select: {
            id: true,
            hasDiabetes: true,
            hasThyroidIssue: true,
            hasHeartIssue: true,
            hasKidneyLiverIssue: true,
            isPregnantOrNursing: true,
            onBloodThinners: true,
            vegetarian: true,
            vegan: true,
            lactoseFree: true,
            glutenFree: true,
            nutAllergy: true,
            preferredLanguages: true,
            otherNotes: true,
          },
        },
        patientProfile: {
          select: {
            id: true,
            dateOfBirth: true,
            sex: true,
            heightCm: true,
            weightKg: true,
            lifestyleNotes: true,
          },
        },
        conditions: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            isActive: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        },
        userMemories: {
          where: { importance: { in: ["MEDIUM", "HIGH"] } },
          select: {
            id: true,
            key: true,
            value: true,
            importance: true,
            lastUsedAt: true,
          },
          orderBy: { lastUsedAt: "desc" },
          take: 10, // Reduced from 20 to 10 for faster loading
        },
      },
    });

    // Add cache headers for client-side caching
    return NextResponse.json(
      {
        user: {
          id: profile?.id,
          name: profile?.name,
          email: profile?.email,
          preferredLanguage: profile?.preferredLanguage,
          timezone: profile?.timezone,
        },
        profile: profile?.profile,
        patientProfile: profile?.patientProfile,
        conditions: profile?.conditions || [],
        memories: profile?.userMemories || [],
      },
      {
        headers: {
          "Cache-Control": "private, max-age=300", // Cache for 5 minutes
        },
      }
    );
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser();
    const body = await request.json();

    const {
      // User-level fields
      name,
      preferredLanguage,
      timezone,
      // PatientProfile fields
      dateOfBirth,
      sex,
      heightCm,
      weightKg,
      lifestyleNotes,
      // UserProfile fields (existing)
      hasDiabetes,
      hasThyroidIssue,
      hasHeartIssue,
      hasKidneyLiverIssue,
      isPregnantOrNursing,
      onBloodThinners,
      vegetarian,
      vegan,
      lactoseFree,
      glutenFree,
      nutAllergy,
      preferredLanguages,
      otherNotes,
    } = body;

    // OPTIMIZATION: Parallel database writes (3 independent operations)
    const [updatedUser, patientProfile, userProfile] = await Promise.all([
      // Update User
      prisma.user.update({
        where: { id: user.id },
        data: {
          ...(name !== undefined && { name }),
          ...(preferredLanguage !== undefined && { preferredLanguage }),
          ...(timezone !== undefined && { timezone }),
        },
      }),

      // Upsert PatientProfile
      prisma.patientProfile.upsert({
        where: { userId: user.id },
        update: {
          ...(dateOfBirth !== undefined && { dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null }),
          ...(sex !== undefined && { sex }),
          ...(heightCm !== undefined && { heightCm }),
          ...(weightKg !== undefined && { weightKg }),
          ...(lifestyleNotes !== undefined && { lifestyleNotes }),
        },
        create: {
          userId: user.id,
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
          sex: sex || "UNKNOWN",
          heightCm,
          weightKg,
          lifestyleNotes,
        },
      }),

      // Upsert UserProfile (wellness preferences)
      prisma.userProfile.upsert({
        where: { userId: user.id },
        update: {
          hasDiabetes,
          hasThyroidIssue,
          hasHeartIssue,
          hasKidneyLiverIssue,
          isPregnantOrNursing,
          onBloodThinners,
          vegetarian,
          vegan,
          lactoseFree,
          glutenFree,
          nutAllergy,
          preferredLanguages,
          otherNotes,
        },
        create: {
          userId: user.id,
          hasDiabetes: hasDiabetes || false,
          hasThyroidIssue: hasThyroidIssue || false,
          hasHeartIssue: hasHeartIssue || false,
          hasKidneyLiverIssue: hasKidneyLiverIssue || false,
          isPregnantOrNursing: isPregnantOrNursing || false,
          onBloodThinners: onBloodThinners || false,
          vegetarian: vegetarian || false,
          vegan: vegan || false,
          lactoseFree: lactoseFree || false,
          glutenFree: glutenFree || false,
          nutAllergy: nutAllergy || false,
          preferredLanguages,
          otherNotes,
        },
      }),
    ]);

    return NextResponse.json({
      user: updatedUser,
      patientProfile,
      profile: userProfile,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

