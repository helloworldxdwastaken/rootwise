const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

async function importDatabase() {
  const prisma = new PrismaClient();
  
  try {
    // Find the most recent backup file
    const files = fs.readdirSync('.').filter(f => f.startsWith('database-backup-') && f.endsWith('.json'));
    if (files.length === 0) {
      console.error('❌ No backup file found!');
      console.log('Run export-database.js first');
      return;
    }
    
    const filename = files.sort().reverse()[0];
    console.log('📥 Importing Database to Frankfurt...');
    console.log('📄 File:', filename);
    console.log('');

    const data = JSON.parse(fs.readFileSync(filename, 'utf8'));
    
    console.log('📊 Data to import:');
    console.log('  Users:', data.stats.users);
    console.log('  Profiles:', data.stats.profiles);
    console.log('  Patient Profiles:', data.stats.patientProfiles);
    console.log('  Conditions:', data.stats.conditions);
    console.log('  Memories:', data.stats.memories);
    console.log('  Health Journal:', data.stats.healthJournal);
    console.log('  Chat Sessions:', data.stats.chatSessions);
    console.log('  Chat Messages:', data.stats.chatMessages);
    console.log('');
    console.log('⚠️  This will import data to the CURRENTLY CONFIGURED database');
    console.log('Make sure your .env points to Frankfurt!');
    console.log('');

    // Import users with all related data
    for (const user of data.users) {
      console.log(`📝 Importing user: ${user.name || user.email}`);
      
      // Create user
      await prisma.user.upsert({
        where: { id: user.id },
        update: {},
        create: {
          id: user.id,
          email: user.email,
          password: user.password,
          name: user.name,
          emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
          image: user.image,
          preferredLanguage: user.preferredLanguage,
          timezone: user.timezone,
          onboardingCompleted: user.onboardingCompleted || false,
          onboardingCompletedAt: user.onboardingCompletedAt ? new Date(user.onboardingCompletedAt) : null,
          onboardingProgress: user.onboardingProgress || null,
          createdAt: new Date(user.createdAt),
          updatedAt: new Date(user.updatedAt),
        },
      });
      
      // Import profile
      if (user.profile) {
        await prisma.userProfile.upsert({
          where: { userId: user.id },
          update: {},
          create: {
            id: user.profile.id,
            userId: user.id,
            ...user.profile,
            createdAt: new Date(user.profile.createdAt),
            updatedAt: new Date(user.profile.updatedAt),
          },
        });
      }
      
      // Import patient profile
      if (user.patientProfile) {
        await prisma.patientProfile.upsert({
          where: { userId: user.id },
          update: {},
          create: {
            id: user.patientProfile.id,
            userId: user.id,
            dateOfBirth: user.patientProfile.dateOfBirth ? new Date(user.patientProfile.dateOfBirth) : null,
            sex: user.patientProfile.sex,
            heightCm: user.patientProfile.heightCm,
            weightKg: user.patientProfile.weightKg,
            lifestyleNotes: user.patientProfile.lifestyleNotes,
            createdAt: new Date(user.patientProfile.createdAt),
            updatedAt: new Date(user.patientProfile.updatedAt),
          },
        });
      }
      
      // Import conditions
      for (const condition of user.conditions || []) {
        await prisma.condition.upsert({
          where: { id: condition.id },
          update: {},
          create: {
            id: condition.id,
            userId: user.id,
            name: condition.name,
            category: condition.category,
            diagnosedAt: condition.diagnosedAt ? new Date(condition.diagnosedAt) : null,
            diagnosedBy: condition.diagnosedBy,
            isActive: condition.isActive,
            notes: condition.notes,
            createdAt: new Date(condition.createdAt),
            updatedAt: new Date(condition.updatedAt),
          },
        });
      }
      
      // Import user memories
      for (const memory of user.userMemories || []) {
        await prisma.userMemory.upsert({
          where: { id: memory.id },
          update: {},
          create: {
            id: memory.id,
            userId: user.id,
            key: memory.key,
            value: memory.value,
            importance: memory.importance,
            lastUsedAt: new Date(memory.lastUsedAt),
            createdAt: new Date(memory.createdAt),
          },
        });
      }
      
      // Import health journal
      for (const entry of user.healthJournal || []) {
        await prisma.healthJournal.upsert({
          where: { id: entry.id },
          update: {},
          create: {
            id: entry.id,
            userId: user.id,
            date: new Date(entry.date),
            symptomName: entry.symptomName,
            severity: entry.severity,
            triggers: entry.triggers,
            duration: entry.duration,
            bodyPart: entry.bodyPart,
            notes: entry.notes,
            moodScore: entry.moodScore,
            energyLevel: entry.energyLevel,
            stressLevel: entry.stressLevel,
            sleepQuality: entry.sleepQuality,
            resolved: entry.resolved,
            resolvedAt: entry.resolvedAt ? new Date(entry.resolvedAt) : null,
            sourceMessageId: entry.sourceMessageId,
            createdAt: new Date(entry.createdAt),
            updatedAt: new Date(entry.updatedAt),
          },
        });
      }
    }
    
    // Import chat sessions and messages
    for (const session of data.chatSessions) {
      await prisma.chatSession.upsert({
        where: { id: session.id },
        update: {},
        create: {
          id: session.id,
          userId: session.userId,
          mode: session.mode,
          primaryFocus: session.primaryFocus,
          nuance: session.nuance,
          timeframe: session.timeframe,
          notes: session.notes,
          structuredData: session.structuredData,
          createdAt: new Date(session.createdAt),
          updatedAt: new Date(session.updatedAt),
        },
      });
      
      // Import messages for this session
      for (const message of session.messages || []) {
        await prisma.chatMessage.upsert({
          where: { id: message.id },
          update: {},
          create: {
            id: message.id,
            userId: message.userId,
            sessionId: message.sessionId,
            role: message.role,
            content: message.content,
            extractedHealthData: message.extractedHealthData,
            wasProcessedForHealth: message.wasProcessedForHealth || false,
            createdAt: new Date(message.createdAt),
          },
        });
      }
    }
    
    console.log('');
    console.log('✅ Import complete!');
    console.log('');
    console.log('🔍 Verifying...');
    
    const userCount = await prisma.user.count();
    const messageCount = await prisma.chatMessage.count();
    const journalCount = await prisma.healthJournal.count();
    
    console.log('  Users:', userCount);
    console.log('  Chat Messages:', messageCount);
    console.log('  Health Journal:', journalCount);
    
    if (userCount === data.stats.users && 
        messageCount === data.stats.chatMessages && 
        journalCount === data.stats.healthJournal) {
      console.log('');
      console.log('🎉 All data imported successfully!');
    } else {
      console.log('');
      console.log('⚠️  Counts don\'t match. Check for errors above.');
    }
    
  } catch (error) {
    console.error('❌ Import failed:', error.message);
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

importDatabase();

