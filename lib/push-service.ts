import { Expo, ExpoPushMessage, ExpoPushTicket, ExpoPushReceipt } from 'expo-server-sdk';
import { prisma } from '@/lib/prisma';

// Create a new Expo SDK client
const expo = new Expo();

// ==================== TYPES ====================

export interface SendPushNotificationParams {
  userId: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  type?: 'WEEKLY_SUMMARY' | 'PATTERN_DETECTED' | 'HEALTH_INSIGHT' | 'REMINDER' | 'SYSTEM';
}

export interface SendBulkNotificationParams {
  userIds: string[];
  title: string;
  body: string;
  data?: Record<string, unknown>;
  type?: 'WEEKLY_SUMMARY' | 'PATTERN_DETECTED' | 'HEALTH_INSIGHT' | 'REMINDER' | 'SYSTEM';
}

// ==================== TOKEN MANAGEMENT ====================

/**
 * Register or update a push token for a user
 */
export async function registerPushToken(
  userId: string,
  token: string,
  platform: 'IOS' | 'ANDROID' | 'UNKNOWN' = 'UNKNOWN',
  deviceId?: string
) {
  // Validate the token format
  if (!Expo.isExpoPushToken(token)) {
    throw new Error('Invalid Expo push token format');
  }

  // Upsert the token (create or update)
  const pushToken = await prisma.pushToken.upsert({
    where: {
      userId_token: {
        userId,
        token,
      },
    },
    update: {
      platform,
      deviceId,
      isActive: true,
      updatedAt: new Date(),
    },
    create: {
      userId,
      token,
      platform,
      deviceId,
      isActive: true,
    },
  });

  console.log(`Push token registered for user ${userId}: ${token.substring(0, 30)}...`);
  return pushToken;
}

/**
 * Deactivate a push token (e.g., on logout)
 */
export async function deactivatePushToken(userId: string, token: string) {
  await prisma.pushToken.updateMany({
    where: {
      userId,
      token,
    },
    data: {
      isActive: false,
    },
  });
}

/**
 * Deactivate all push tokens for a user (e.g., on account deletion)
 */
export async function deactivateAllUserTokens(userId: string) {
  await prisma.pushToken.updateMany({
    where: { userId },
    data: { isActive: false },
  });
}

/**
 * Get all active push tokens for a user
 */
export async function getUserPushTokens(userId: string) {
  return prisma.pushToken.findMany({
    where: {
      userId,
      isActive: true,
    },
  });
}

// ==================== SEND NOTIFICATIONS ====================

/**
 * Send a push notification to a single user
 */
export async function sendPushNotification({
  userId,
  title,
  body,
  data = {},
  type = 'SYSTEM',
}: SendPushNotificationParams): Promise<boolean> {
  try {
    // Get user's active push tokens
    const tokens = await getUserPushTokens(userId);

    if (tokens.length === 0) {
      console.log(`No active push tokens found for user ${userId}`);
      return false;
    }

    // Build messages for each token
    const messages: ExpoPushMessage[] = tokens
      .filter(t => Expo.isExpoPushToken(t.token))
      .map(t => ({
        to: t.token,
        sound: 'default' as const,
        title,
        body,
        data: { ...data, type },
        priority: 'high' as const,
      }));

    if (messages.length === 0) {
      console.log('No valid push tokens to send to');
      return false;
    }

    // Log the notification attempt
    const notificationLog = await prisma.pushNotificationLog.create({
      data: {
        userId,
        type,
        title,
        body,
        data: data as any,
        status: 'PENDING',
      },
    });

    // Send notifications in chunks
    const chunks = expo.chunkPushNotifications(messages);
    const tickets: ExpoPushTicket[] = [];

    for (const chunk of chunks) {
      try {
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        console.error('Error sending push notification chunk:', error);
      }
    }

    // Process tickets and update log
    const successTickets = tickets.filter(t => t.status === 'ok');
    const errorTickets = tickets.filter(t => t.status === 'error');

    if (successTickets.length > 0) {
      await prisma.pushNotificationLog.update({
        where: { id: notificationLog.id },
        data: {
          status: 'SENT',
          ticketId: successTickets[0].status === 'ok' ? successTickets[0].id : null,
          sentAt: new Date(),
        },
      });
    }

    if (errorTickets.length > 0) {
      const errorTicket = errorTickets[0] as { status: 'error'; message: string; details?: { error: string } };
      console.error('Push notification errors:', errorTicket.message);
      
      // Handle invalid tokens
      if (errorTicket.details?.error === 'DeviceNotRegistered') {
        // Deactivate invalid tokens
        for (const token of tokens) {
          await deactivatePushToken(userId, token.token);
        }
      }

      await prisma.pushNotificationLog.update({
        where: { id: notificationLog.id },
        data: {
          status: 'FAILED',
          errorMessage: errorTicket.message,
        },
      });
    }

    console.log(`Push notification sent to user ${userId}: ${successTickets.length}/${tickets.length} succeeded`);
    return successTickets.length > 0;
  } catch (error) {
    console.error('Error sending push notification:', error);
    return false;
  }
}

/**
 * Send push notifications to multiple users
 */
export async function sendBulkPushNotifications({
  userIds,
  title,
  body,
  data = {},
  type = 'SYSTEM',
}: SendBulkNotificationParams): Promise<{ sent: number; failed: number }> {
  let sent = 0;
  let failed = 0;

  // Process in parallel with concurrency limit
  const batchSize = 10;
  for (let i = 0; i < userIds.length; i += batchSize) {
    const batch = userIds.slice(i, i + batchSize);
    const results = await Promise.all(
      batch.map(userId => sendPushNotification({ userId, title, body, data, type }))
    );
    
    results.forEach(success => {
      if (success) sent++;
      else failed++;
    });
  }

  console.log(`Bulk push notifications: ${sent} sent, ${failed} failed`);
  return { sent, failed };
}

// ==================== NOTIFICATION TEMPLATES ====================

/**
 * Send weekly summary notification
 */
export async function sendWeeklySummaryNotification(userId: string, summaryHighlights: string) {
  return sendPushNotification({
    userId,
    title: '📊 Your Weekly Summary is Ready',
    body: summaryHighlights,
    data: { screen: 'overview', action: 'view_weekly' },
    type: 'WEEKLY_SUMMARY',
  });
}

/**
 * Send pattern detected notification
 */
export async function sendPatternDetectedNotification(userId: string, patternDescription: string) {
  return sendPushNotification({
    userId,
    title: '🔍 AI Detected a Pattern',
    body: patternDescription,
    data: { screen: 'overview', action: 'view_insights' },
    type: 'PATTERN_DETECTED',
  });
}

/**
 * Send health insight notification
 */
export async function sendHealthInsightNotification(userId: string, insight: string) {
  return sendPushNotification({
    userId,
    title: '💡 Health Insight',
    body: insight,
    data: { screen: 'chat', action: 'discuss_insight' },
    type: 'HEALTH_INSIGHT',
  });
}

/**
 * Send custom reminder notification
 */
export async function sendReminderNotification(userId: string, title: string, message: string) {
  return sendPushNotification({
    userId,
    title,
    body: message,
    type: 'REMINDER',
  });
}

