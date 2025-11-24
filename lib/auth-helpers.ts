import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET;

/**
 * Get the current authenticated user or throw
 * Supports both web (NextAuth/cookies) and mobile (JWT) authentication
 * @throws Error if not authenticated
 */
export async function getCurrentUser() {
  // First, try NextAuth session (for web)
  const session = await getServerSession(authOptions);

  if (session?.user?.email) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        profile: true,
        patientProfile: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  // If no session, try mobile JWT token
  try {
    const headersList = await headers();
    const authHeader = headersList.get("authorization");

    if (authHeader && authHeader.startsWith("Bearer ") && JWT_SECRET) {
      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        include: {
          profile: true,
          patientProfile: true,
        },
      });

      if (user) {
        return user;
      }
    }
  } catch (error) {
    // JWT validation failed, continue to throw unauthorized
    console.error("Mobile auth failed:", error);
  }

  throw new Error("Unauthorized");
}

/**
 * Get current user session (nullable)
 */
export async function getCurrentSession() {
  return await getServerSession(authOptions);
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getServerSession(authOptions);
  return !!session?.user;
}

