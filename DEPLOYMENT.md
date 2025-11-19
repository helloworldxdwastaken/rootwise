# Rootwise - Vercel Deployment Guide

## 🚀 Deploy to Vercel

### Prerequisites
- GitHub repository with your code
- Vercel account (sign up at https://vercel.com)
- PostgreSQL database (recommended: Neon or Supabase - both have free tiers)

### Step 1: Set Up Database

**Option A: Neon (Recommended - Free PostgreSQL)**
1. Go to https://neon.tech
2. Create a free account
3. Create a new project
4. Copy the connection string (looks like: `postgresql://user:pass@host/dbname`)

**Option B: Supabase**
1. Go to https://supabase.com
2. Create a project
3. Get connection string from Settings → Database

### Step 2: Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Ready for Vercel deployment"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/rootwise.git

# Push
git push -u origin main
```

### Step 3: Deploy on Vercel

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Vercel will auto-detect Next.js settings ✅

### Step 4: Add Environment Variables in Vercel

In your Vercel project dashboard, go to **Settings → Environment Variables** and add:

```env
# Database
DATABASE_URL=your-neon-or-supabase-connection-string

# NextAuth
NEXTAUTH_SECRET=your-random-secret-key
NEXTAUTH_URL=https://your-app.vercel.app

# Optional
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```
Or visit: https://generate-secret.vercel.app/32

### Step 5: Run Database Migrations

After deployment, you need to run migrations. Two options:

**Option A: From your local machine**
```bash
# Set DATABASE_URL in your local .env to your production database
npx prisma migrate deploy
```

**Option B: Using Vercel CLI**
```bash
npm install -g vercel
vercel env pull .env.local
npx prisma migrate deploy
```

### Step 6: Verify Deployment

1. Visit your Vercel URL: `https://your-app.vercel.app`
2. Test registration: `/auth/register`
3. Test login: `/auth/login`
4. Test profile: `/profile`

## 🔄 Auto-Deployment

Once set up, Vercel will automatically deploy when you push to GitHub:

```bash
git add .
git commit -m "Update something"
git push
# Vercel deploys automatically! 🎉
```

## ⚙️ Build Configuration

Vercel will use these commands (from package.json):
- **Build**: `npm run build`
- **Start**: `npm start`
- **Dev**: `npm run dev`

## 🗄️ Database Setup Commands

```bash
# Generate Prisma client
npm run prisma:generate

# Apply migrations to production DB
npm run prisma:migrate
```

## 📝 Important Notes

- ✅ Vercel automatically handles Next.js optimization
- ✅ API routes work out of the box
- ✅ Environment variables are secure
- ✅ Free SSL certificate included
- ⚠️ Make sure DATABASE_URL points to your production database
- ⚠️ Don't commit .env files (already in .gitignore)

## 🆘 Troubleshooting

**Build fails?**
- Check all environment variables are set in Vercel
- Verify DATABASE_URL is correct
- Run `npm run build` locally first

**Database connection fails?**
- Ensure DATABASE_URL is in Vercel environment variables
- Check database is accessible from Vercel's region
- Run `npx prisma migrate deploy` after first deployment

**Authentication not working?**
- Verify NEXTAUTH_SECRET is set
- Update NEXTAUTH_URL to your Vercel domain
- Check all environment variables are saved

## 📧 Support

If you need help: support@rootwise.example

---

**Your Rootwise app is production-ready! 🌿**

