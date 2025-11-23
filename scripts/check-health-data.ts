import { prisma } from "../lib/prisma";

async function checkHealthData() {
  try {
    // Get all users (for testing)
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true },
    });

    console.log("👤 Users:", users);

    if (users.length > 0) {
      const userId = users[0].id;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayKey = `health_${today.toISOString().split("T")[0]}`;

      console.log("\n📅 Looking for today's health data:", todayKey);

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
        console.log("\n✅ Today's Health Data Found:");
        console.log(JSON.stringify(todayHealth.value, null, 2));
      } else {
        console.log("\n❌ No health data found for today");
      }

      // Get recent health memories (last 7 days)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const healthKeys = await prisma.userMemory.findMany({
        where: {
          userId,
          key: {
            startsWith: "health_",
          },
          createdAt: {
            gte: weekAgo,
          },
        },
        orderBy: { createdAt: "desc" },
      });

      console.log("\n📊 Health data from last 7 days:");
      healthKeys.forEach((record) => {
        console.log(`\n${record.key}:`);
        console.log(JSON.stringify(record.value, null, 2));
      });

      // Get recent chat messages
      const recentMessages = await prisma.chatMessage.findMany({
        where: {
          userId,
          createdAt: {
            gte: weekAgo,
          },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      });

      console.log("\n💬 Recent chat messages:");
      recentMessages.forEach((msg) => {
        console.log(`\n[${msg.role}] ${msg.createdAt.toISOString()}`);
        console.log(msg.content.substring(0, 200));
      });

      // Get conditions
      const conditions = await prisma.condition.findMany({
        where: {
          userId,
          isActive: true,
        },
      });

      console.log("\n🏥 Active Conditions:");
      console.log(conditions);

      // Get important memories
      const memories = await prisma.userMemory.findMany({
        where: {
          userId,
          importance: "HIGH",
        },
      });

      console.log("\n🧠 Important Memories:");
      console.log(memories);
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkHealthData();

