const { PrismaClient } = require('@prisma/client');
const { Expo } = require('expo-server-sdk');

const prisma = new PrismaClient();
const expo = new Expo();

async function testPush() {
  // Get all active push tokens
  const tokens = await prisma.pushToken.findMany({
    where: { isActive: true },
    include: { user: { select: { email: true, name: true } } }
  });
  
  console.log('=== Sending Test Push Notification ===\n');
  
  if (tokens.length === 0) {
    console.log('❌ No push tokens registered.');
    console.log('\nTo register a token:');
    console.log('1. Open the mobile app');
    console.log('2. Go to Settings');
    console.log('3. Enable "Smart Reminders"');
    await prisma.$disconnect();
    return;
  }
  
  console.log(`Found ${tokens.length} token(s)\n`);
  
  const messages = [];
  
  for (const tokenRecord of tokens) {
    if (!Expo.isExpoPushToken(tokenRecord.token)) {
      console.log(`❌ Invalid token for ${tokenRecord.user?.name || tokenRecord.user?.email}`);
      continue;
    }
    
    console.log(`📱 Sending to: ${tokenRecord.user?.name || tokenRecord.user?.email}`);
    console.log(`   Platform: ${tokenRecord.platform}`);
    console.log(`   Token: ${tokenRecord.token.substring(0, 40)}...`);
    
    messages.push({
      to: tokenRecord.token,
      sound: 'default',
      title: '🧪 Test Notification',
      body: 'Push notifications are working! This is a test from RootWise server.',
      data: { type: 'test', timestamp: new Date().toISOString() },
    });
  }
  
  if (messages.length === 0) {
    console.log('\n❌ No valid tokens to send to.');
    await prisma.$disconnect();
    return;
  }
  
  // Send notifications in chunks
  const chunks = expo.chunkPushNotifications(messages);
  
  for (const chunk of chunks) {
    try {
      const tickets = await expo.sendPushNotificationsAsync(chunk);
      console.log('\n📤 Send result:');
      tickets.forEach((ticket, i) => {
        if (ticket.status === 'ok') {
          console.log(`   ✅ Notification ${i + 1}: Sent successfully`);
        } else {
          console.log(`   ❌ Notification ${i + 1}: Failed - ${ticket.message}`);
        }
      });
    } catch (error) {
      console.error('\n❌ Error sending:', error.message);
    }
  }
  
  console.log('\n✅ Test complete!');
  await prisma.$disconnect();
}

testPush();
