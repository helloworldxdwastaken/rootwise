import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getCurrentUser();

    const profile = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        profile: true,
        patientProfile: true,
        conditions: {
          where: { isActive: true },
          orderBy: { createdAt: "desc" },
        },
        userMemories: {
          where: { importance: { in: ["MEDIUM", "HIGH"] } },
          orderBy: { lastUsedAt: "desc" },
          take: 20,
        },
      },
    });

    return NextResponse.json({
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
    });
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

    // Update User
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(name !== undefined && { name }),
        ...(preferredLanguage !== undefined && { preferredLanguage }),
        ...(timezone !== undefined && { timezone }),
      },
    });

    // Upsert PatientProfile
    const patientProfile = await prisma.patientProfile.upsert({
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
    });

    // Upsert UserProfile (wellness preferences)
    const userProfile = await prisma.userProfile.upsert({
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
    });

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

