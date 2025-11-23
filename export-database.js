const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function exportDatabase() {
  try {
    console.log('📦 Exporting Rootwise Database...');
    console.log('📍 Source: Sydney, Australia');
    console.log('');

    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `database-backup-${timestamp}.json`;

    // Export all tables
    console.log('Fetching data...');
    
    const users = await prisma.user.findMany({
      include: {
        profile: true,
        patientProfile: true,
        conditions: true,
        userMemories: true,
        healthJournal: true,
      },
    });
    
    const chatSessions = await prisma.chatSession.findMany({
      include: {
        messages: true,
      },
    });

    const data = {
      exportDate: new Date().toISOString(),
      sourceRegion: 'ap-southeast-2 (Sydney)',
      users: users,
      chatSessions: chatSessions,
      stats: {
        users: users.length,
        profiles: users.filter(u => u.profile).length,
        patientProfiles: users.filter(u => u.patientProfile).length,
        conditions: users.reduce((sum, u) => sum + u.conditions.length, 0),
        memories: users.reduce((sum, u) => sum + u.userMemories.length, 0),
        healthJournal: users.reduce((sum, u) => sum + u.healthJournal.length, 0),
        chatSessions: chatSessions.length,
        chatMessages: chatSessions.reduce((sum, s) => sum + s.messages.length, 0),
      },
    };

    // Save to file
    fs.writeFileSync(filename, JSON.stringify(data, null, 2));

    console.log('');
    console.log('✅ Export complete!');
    console.log('📄 File:', filename);
    console.log('');
    console.log('📊 Exported Data:');
    console.log('  Users:', data.stats.users);
    console.log('  User Profiles:', data.stats.profiles);
    console.log('  Patient Profiles:', data.stats.patientProfiles);
    console.log('  Conditions:', data.stats.conditions);
    console.log('  Memories:', data.stats.memories);
    console.log('  Health Journal:', data.stats.healthJournal);
    console.log('  Chat Sessions:', data.stats.chatSessions);
    console.log('  Chat Messages:', data.stats.chatMessages);
    console.log('');
    console.log('💾 File size:', (fs.statSync(filename).size / 1024).toFixed(2), 'KB');
    console.log('');
    console.log('🎯 Next: Create Frankfurt project and run import-database.js');

  } catch (error) {
    console.error('❌ Export failed:', error.message);
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

exportDatabase();

