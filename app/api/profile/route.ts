import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { profile: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user, profile: user.profile });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
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

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Upsert user profile
    const profile = await prisma.userProfile.upsert({
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
    });

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

