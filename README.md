# Rootwise

**Rootwise** is a gentle, AI-assisted wellness companion that helps you explore natural support for your body through foods, herbs, and daily habits — always with safety notes and zero pharma.

## ✨ Features

- 🗣️ **Conversational Interface**: Natural language wellness conversations
- 🧠 **AI-Powered Suggestions**: Evidence-informed nutrition and lifestyle guidance
- 🛡️ **Safety-First Approach**: Every plan includes red-flag warnings and medical disclaimers
- 🌿 **Holistic Support**: Foods, herbs, teas, and gentle daily habits
- 🌐 **Multi-Language Ready**: Built for English, Spanish, Hebrew, and Russian speakers
- 📱 **Modern UI**: Beautiful, responsive design with Tailwind CSS v4 and Framer Motion
- 🔒 **Privacy-First**: Your data stays yours — never sold or shared

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router + Turbopack)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Database**: PostgreSQL + Prisma ORM
- **UI Components**: Custom components with Lucide icons
- **Fonts**: Poppins (Google Fonts)

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ 
- npm/yarn/pnpm
- PostgreSQL database

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd rootwise
```

2. Install dependencies:

```bash
npm install
```

3. Set up your environment variables:

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/rootwise?schema=public"
```

4. Run database migrations:

```bash
npm run prisma:generate
npm run prisma:migrate
```

5. Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 📁 Project Structure

```
rootwise/
├── app/                      # Next.js app directory
│   ├── page.tsx             # Home page
│   ├── layout.tsx           # Root layout
│   ├── globals.css          # Global styles
│   ├── profile/             # User profile page
│   ├── legal/               # Legal pages (terms, privacy, etc.)
│   ├── why-trust-rootwise/  # Trust page
│   ├── our-approach/        # Approach page
│   └── how-rootwise-works/  # How it works page
├── components/              # Reusable React components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── ConversationFlow.tsx
│   ├── ProfileForm.tsx
│   └── ...
├── lib/                     # Utility functions
│   ├── prisma.ts           # Prisma client singleton
│   └── utils.ts            # Helper functions
├── prisma/                 # Database schema
│   └── schema.prisma
└── public/                 # Static assets

```

## 🗄️ Database Schema

The app uses Prisma with PostgreSQL. Key models:

- **User**: User accounts
- **UserProfile**: Health conditions, dietary preferences, languages
- **Session**: Conversation sessions (issue/goal tracking)

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations

## 🎨 Key Design Principles

1. **Gentle & Calming**: Soft gradients, smooth animations, welcoming tone
2. **Safety-First**: Clear disclaimers, red-flag warnings, medical referrals
3. **Evidence-Informed**: Grounded in research and traditional wisdom
4. **Privacy-Focused**: Transparent data practices, user control
5. **Accessible**: WCAG compliant, keyboard navigation, semantic HTML

## 🌍 Multi-Language Support

Currently supports:
- English
- Spanish (planned)
- Hebrew (planned)
- Russian (planned)

## 📄 Legal Pages

- `/legal/disclaimer` - Medical disclaimer
- `/legal/terms` - Terms of use
- `/legal/privacy` - Privacy policy
- `/legal/cookies` - Cookie notice

## 🤝 Contributing

This is an early-access wellness platform. Contributions focused on safety, accessibility, and user experience are welcome.

## ⚠️ Important Disclaimer

Rootwise provides **educational wellness information only**. It does not diagnose, treat, cure, or prevent disease. Always consult qualified healthcare professionals for medical advice.

## 📧 Contact

- Support: support@rootwise.example
- Privacy: privacy@rootwise.example

---

**Made with care for your wellness journey** 🌿
