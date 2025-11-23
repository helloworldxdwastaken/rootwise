# 🌿 Rootwise

**AI-powered wellness companion with conversational onboarding and real-time health tracking.**

Rootwise helps you explore natural support for your body through foods, herbs, and daily habits — always with safety notes and zero pharma.

## ⚡ Quick Features

- 💬 **AI-Guided Onboarding** - Natural conversation replaces boring forms
- 🤖 **Groq AI (Llama 3.1)** - Context-aware wellness assistant
- 📊 **Real-Time Tracking** - Energy, sleep, hydration, symptoms
- 🏥 **Medical History** - Conditions, medications, allergies
- 🔐 **Privacy-First** - Your data stays yours, never sold
- 🎨 **Beautiful UI** - Glassmorphism design, optimized performance

## 🛠️ Tech Stack

- **Framework**: Next.js 16 + React 19 + TypeScript 5
- **Database**: PostgreSQL (Supabase) + Prisma ORM 5.22
- **AI**: Groq SDK (Llama 3.1 8B Instant)
- **Auth**: NextAuth.js 4.24 with JWT
- **Styling**: Tailwind CSS 4 + Framer Motion
- **Icons**: Lucide React

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up .env (see COMPLETE_SYSTEM_GUIDE.md for full config)
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..."
GROQ_API_KEY="gsk_..."

# 3. Setup database
npx prisma generate
npx prisma db push

# 4. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📚 **Complete Documentation**

**👉 See [COMPLETE_SYSTEM_GUIDE.md](./COMPLETE_SYSTEM_GUIDE.md) for full system documentation**

This is your central source of truth for:
- ✅ Architecture & data flow
- ✅ Database schema & models
- ✅ API endpoints & examples
- ✅ AI integration guide
- ✅ Onboarding system
- ✅ Health tracking
- ✅ Performance optimizations
- ✅ Testing guide

## 🗄️ Database Models

- **User** - Auth & profile
- **PatientProfile** - Clinical data (age, sex, vitals)
- **UserProfile** - Wellness preferences (diet, allergies)
- **Condition** - Medical diagnoses (from doctors)
- **HealthJournal** - Daily symptoms (from chat) ⏳ pending migration
- **ChatSession** & **ChatMessage** - Conversation history
- **UserMemory** - AI learned patterns & facts

## 🎯 Key Features

### **AI-Guided Onboarding**
New users have a natural conversation with AI (not boring forms!) to set up their profile.

### **Overview Dashboard**
Split-screen layout:
- **Left**: Real-time health metrics (energy, sleep, hydration, symptoms)
- **Right**: AI chat for instant wellness insights

### **Smart Health Tracking**
- Manual logging via quick buttons
- **Auto-logging from chat** - AI extracts symptoms, energy, sleep from your messages
- Daily reset with historical data
- Pattern detection

### **Full Patient Context**
AI reads:
- Medical conditions (diagnosed)
- Current medications & allergies
- Past symptom patterns
- Today's metrics
- Lifestyle notes

## 📜 Scripts

- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run prisma:generate` - Generate Prisma client
- `npx prisma db push` - Push schema to database
- `npx prisma studio` - Visual database browser

## ⚠️ Important Disclaimer

Rootwise provides **educational wellness information only**. It does not diagnose, treat, cure, or prevent disease. Always consult qualified healthcare professionals for medical advice.

## 📧 Contact

- Support: support@rootwise.example
- Privacy: privacy@rootwise.example

---

**Made with care for your wellness journey** 🌿
