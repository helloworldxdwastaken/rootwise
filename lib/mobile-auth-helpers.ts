import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET;

interface JWTPayload {
  userId: string;
  email: string;
  type: string;
}

/**
 * Get user from mobile JWT token
 * Used by mobile app (React Native) authentication
 * @param req NextRequest object
 * @returns User object or null
 */
export async function getMobileUser(req: NextRequest) {
  try {
    // Check for Authorization header
    const authHeader = req.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!JWT_SECRET) {
      console.error('JWT_SECRET is not configured');
      return null;
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;

    // Fetch user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        profile: true,
        patientProfile: true,
        conditions: {
          where: { isActive: true },
        },
        userMemories: {
          orderBy: [
            { importance: 'desc' },
            { lastUsedAt: 'desc' },
          ],
        },
      },
    });

    return user;
  } catch (error) {
    // Token invalid or expired
    console.error('Mobile auth error:', error);
    return null;
  }
}

/**
 * Validate mobile JWT token
 * @param token JWT token string
 * @returns Decoded payload or null
 */
export function validateMobileToken(token: string): JWTPayload | null {
  try {
    if (!JWT_SECRET) {
      return null;
    }
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

