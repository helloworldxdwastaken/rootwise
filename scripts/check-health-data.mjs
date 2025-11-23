import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkHealthData() {
  try {
    // Get all users
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true },
      take: 5,
    });

    console.log("👤 Users found:", users.length);

    if (users.length > 0) {
      const userId = users[0].id;
      const userName = users[0].name || users[0].email;
      console.log(`\n🔍 Checking data for: ${userName}`);
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayKey = `health_${today.toISOString().split("T")[0]}`;

      console.log(`\n📅 Today's key: ${todayKey}`);

      // Get today's health data
      const todayHealth = await prisma.userMemory.findUnique({
        where: {
          userId_key: {
            userId,
            key: todayKey,
          },
        },
      });

      if (todayHealth) {
        console.log("\n✅ TODAY'S HEALTH DATA:");
        console.log(JSON.stringify(todayHealth.value, null, 2));
      } else {
        console.log("\n❌ No health data found for today");
      }

      // Get ALL health memories (last 30 days)
      const allHealthData = await prisma.userMemory.findMany({
        where: {
          userId,
          key: {
            startsWith: "health_",
          },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      });

      console.log(`\n📊 All health records (last 10):`);
      allHealthData.forEach((record) => {
        console.log(`\n${record.key}:`);
        console.log(JSON.stringify(record.value, null, 2));
      });

      // Get recent messages mentioning migraine
      const messages = await prisma.chatMessage.findMany({
        where: {
          userId,
          content: {
            contains: "migraine",
            mode: "insensitive",
          },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      });

      console.log(`\n💬 Messages mentioning 'migraine': ${messages.length}`);
      messages.forEach((msg) => {
        console.log(`\n[${msg.role}] ${msg.createdAt}`);
        console.log(msg.content.substring(0, 150));
      });
    }
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkHealthData();

