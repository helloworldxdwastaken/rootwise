import { NextRequest, NextResponse } from 'next/server';
import { getMobileUser } from '@/lib/mobile-auth-helpers';
import { 
  registerPushToken, 
  deactivatePushToken, 
  getUserPushTokens 
} from '@/lib/push-service';

/**
 * POST /api/user/push-token
 * Register a new push token for the authenticated user
 */
export async function POST(req: NextRequest) {
  try {
    // Authenticate user
    const user = await getMobileUser(req);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { token, platform, deviceId } = await req.json();

    // Validate token
    if (!token || typeof token !== 'string') {
      return NextResponse.json(
        { error: 'Push token is required' },
        { status: 400 }
      );
    }

    // Validate platform if provided
    const validPlatforms = ['IOS', 'ANDROID', 'UNKNOWN'];
    const normalizedPlatform = platform?.toUpperCase() || 'UNKNOWN';
    if (!validPlatforms.includes(normalizedPlatform)) {
      return NextResponse.json(
        { error: 'Invalid platform. Must be IOS, ANDROID, or UNKNOWN' },
        { status: 400 }
      );
    }

    // Register the token
    const pushToken = await registerPushToken(
      user.id,
      token,
      normalizedPlatform as 'IOS' | 'ANDROID' | 'UNKNOWN',
      deviceId
    );

    return NextResponse.json({
      success: true,
      message: 'Push token registered successfully',
      pushToken: {
        id: pushToken.id,
        platform: pushToken.platform,
        isActive: pushToken.isActive,
        createdAt: pushToken.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Push token registration error:', error);
    
    if (error.message === 'Invalid Expo push token format') {
      return NextResponse.json(
        { error: 'Invalid push token format. Must be a valid Expo push token.' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to register push token' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/user/push-token
 * Get all active push tokens for the authenticated user
 */
export async function GET(req: NextRequest) {
  try {
    const user = await getMobileUser(req);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const tokens = await getUserPushTokens(user.id);

    return NextResponse.json({
      success: true,
      tokens: tokens.map(t => ({
        id: t.id,
        platform: t.platform,
        isActive: t.isActive,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt,
      })),
    });
  } catch (error) {
    console.error('Get push tokens error:', error);
    return NextResponse.json(
      { error: 'Failed to get push tokens' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/user/push-token
 * Deactivate a push token (e.g., on logout)
 */
export async function DELETE(req: NextRequest) {
  try {
    const user = await getMobileUser(req);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Push token is required' },
        { status: 400 }
      );
    }

    await deactivatePushToken(user.id, token);

    return NextResponse.json({
      success: true,
      message: 'Push token deactivated successfully',
    });
  } catch (error) {
    console.error('Deactivate push token error:', error);
    return NextResponse.json(
      { error: 'Failed to deactivate push token' },
      { status: 500 }
    );
  }
}


