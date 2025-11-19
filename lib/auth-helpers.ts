import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * Get the current authenticated user or throw
 * @throws Error if not authenticated
 */
export async function getCurrentUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

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

