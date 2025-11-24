import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET;
const TOKEN_EXPIRY = '30d'; // Token expires in 30 days

/**
 * Mobile Login Endpoint
 * Returns JWT token for React Native app authentication
 * Web authentication continues to use NextAuth with cookies
 */
export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user (case-insensitive email)
    const user = await prisma.user.findFirst({
      where: { 
        email: {
          equals: email.toLowerCase(),
          mode: 'insensitive',
        }
      },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        onboardingCompleted: true,
        createdAt: true,
      },
    });

    if (!user || !user.password) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate JWT token
    if (!JWT_SECRET) {
      console.error('JWT_SECRET is not configured');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        type: 'mobile',
      },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRY }
    );

    // Return user data and token (exclude password)
    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        onboardingCompleted: user.onboardingCompleted,
      },
    });
  } catch (error) {
    console.error('Mobile login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

