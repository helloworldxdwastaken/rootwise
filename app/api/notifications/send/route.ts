import { NextRequest, NextResponse } from 'next/server';
import { getMobileUser } from '@/lib/mobile-auth-helpers';
import { getCurrentUser } from '@/lib/auth-helpers';
import { 
  sendPushNotification,
  sendWeeklySummaryNotification,
  sendPatternDetectedNotification,
  sendHealthInsightNotification,
} from '@/lib/push-service';

/**
 * POST /api/notifications/send
 * Send a push notification to a user (for testing or admin use)
 * 
 * Body: {
 *   type: 'test' | 'weekly_summary' | 'pattern' | 'insight',
 *   title?: string,
 *   body?: string,
 *   targetUserId?: string (admin only)
 * }
 */
export async function POST(req: NextRequest) {
  try {
    // Try mobile auth first, then web auth
    // We only need the user id, so extract it from either auth method
    let userId: string | null = null;
    
    const mobileUser = await getMobileUser(req);
    if (mobileUser) {
      userId = mobileUser.id;
    } else {
      try {
        const webUser = await getCurrentUser();
        userId = webUser.id;
      } catch {
        // Not authenticated via web either
      }
    }
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { type, title, body, targetUserId } = await req.json();

    // For now, users can only send to themselves
    // In the future, you could add admin check for targetUserId
    const targetId = targetUserId || userId;
    if (targetId !== userId) {
      return NextResponse.json(
        { error: 'Cannot send notifications to other users' },
        { status: 403 }
      );
    }

    let success = false;
    let message = '';

    switch (type) {
      case 'test':
        success = await sendPushNotification({
          userId: targetId,
          title: title || '🧪 Test Notification',
          body: body || 'Push notifications are working! You\'ll receive health insights here.',
          data: { test: true },
          type: 'SYSTEM',
        });
        message = success ? 'Test notification sent' : 'Failed to send - check if you have registered push tokens';
        break;

      case 'weekly_summary':
        success = await sendWeeklySummaryNotification(
          targetId,
          body || 'Your energy averaged 7/10 this week. Sleep improved by 15%!'
        );
        message = success ? 'Weekly summary notification sent' : 'Failed to send';
        break;

      case 'pattern':
        success = await sendPatternDetectedNotification(
          targetId,
          body || 'We noticed your energy drops on days with less than 6 hours of sleep.'
        );
        message = success ? 'Pattern notification sent' : 'Failed to send';
        break;

      case 'insight':
        success = await sendHealthInsightNotification(
          targetId,
          body || 'Based on your recent data, try increasing water intake in the afternoon.'
        );
        message = success ? 'Health insight notification sent' : 'Failed to send';
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid notification type. Use: test, weekly_summary, pattern, or insight' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success,
      message,
      type,
    });
  } catch (error) {
    console.error('Send notification error:', error);
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    );
  }
}

