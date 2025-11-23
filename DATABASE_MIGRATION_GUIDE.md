# 🗄️ Database Migration Guide

## Overview
This guide will help you migrate your Rootwise database schema to Supabase after the maintenance period.

---

## 📋 What Needs to Be Migrated?

The following schema changes were made while Supabase was in maintenance:

### **New Fields on `User` Table:**
- `onboardingCompleted` (Boolean) - Tracks if user completed onboarding
- `onboardingCompletedAt` (DateTime) - When onboarding was completed
- `onboardingProgress` (JSON) - Which onboarding steps are done

### **New `HealthJournal` Table:**
- Daily symptom tracking from AI conversations
- Links to User
- Stores: date, symptoms (JSON), mood, notes, source

### **New Fields on `ChatMessage` Table:**
- `extractedHealthData` (JSON) - Extracted metrics from messages
- `wasProcessedForHealth` (Boolean) - Whether message was analyzed

### **New Field on `Condition` Table:**
- `diagnosedBy` (String) - "user", "professional", or "ai_inferred"

---

## 🚀 Method 1: Automated Migration (Recommended)

### **Prerequisites:**
1. Supabase maintenance must be complete
2. You have your `DATABASE_URL` and `DIRECT_URL` from Supabase

### **Get Your Connection Strings:**

1. Go to: [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project → **Settings** → **Database**
3. Copy **two** connection strings:
   - **Connection pooling** (port 6543) → `DATABASE_URL`
   - **Direct connection** (port 5432) → `DIRECT_URL`

### **Add to `.env`:**
```bash
DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[project-ref]:[password]@aws-0-us-east-1.compute-1.amazonaws.com:5432/postgres"
```

### **Run the Migration Script:**
```bash
cd /home/tokyo/Desktop/rootwise
./migrate-database.sh
```

The script will:
1. ✅ Verify environment variables
2. ✅ Generate Prisma Client
3. ✅ Check database connection
4. ✅ Create migration for new fields
5. ✅ Show you the SQL for review
6. ✅ Apply the migration
7. ✅ Verify the schema

---

## 🔧 Method 2: Manual Migration

If you prefer to run commands manually:

### **Step 1: Update `.env`**
```bash
# Add both URLs from Supabase Dashboard
DATABASE_URL="postgresql://..." # Pooler (6543)
DIRECT_URL="postgresql://..."   # Direct (5432)
```

### **Step 2: Generate Prisma Client**
```bash
npx prisma generate
```

### **Step 3: Create Migration**
```bash
npx prisma migrate dev --name add_onboarding_and_health_journal
```

This will:
- Compare your `schema.prisma` with the current database
- Generate SQL to add missing tables/columns
- Apply the migration locally

### **Step 4: Review the Generated SQL**
```bash
# Find the latest migration
ls -t prisma/migrations/ | head -1

# View it
cat prisma/migrations/[migration-name]/migration.sql
```

### **Step 5: Deploy to Production**
```bash
npx prisma migrate deploy
```

### **Step 6: Verify**
```bash
npx prisma db pull --force
```

---

## 🔍 Troubleshooting

### **Error: "directUrl is not defined"**
**Solution:** Uncomment line 8 in `prisma/schema.prisma`:
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")  // Uncomment this!
}
```

### **Error: "DATABASE_URL is not set"**
**Solution:** Create `.env` file with your Supabase connection strings (see Method 1).

### **Error: "Connection refused"**
**Solution:** 
1. Check Supabase is not in maintenance
2. Verify your `DIRECT_URL` uses port `5432`
3. Check firewall/network access

### **Migration Already Applied**
If you see: `No pending migrations to apply.`
- ✅ This means your database is already up to date!

---

## 🎯 After Migration

### **1. Test Locally:**
```bash
npm run dev
```

### **2. Verify in Supabase Dashboard:**
- Go to **Table Editor**
- Check for:
  - `User` table has `onboardingCompleted` column
  - `HealthJournal` table exists
  - `ChatMessage` has `extractedHealthData` column

### **3. Deploy to Vercel:**
```bash
git add .
git commit -m "Enable database migrations"
git push origin main
```

Vercel will automatically run `prisma generate` and `prisma migrate deploy` during build.

---

## 📚 Additional Resources

- **Prisma Docs:** https://www.prisma.io/docs/concepts/components/prisma-migrate
- **Supabase Docs:** https://supabase.com/docs/guides/database
- **Full System Guide:** `COMPLETE_SYSTEM_GUIDE.md`

---

## ⚠️ Important Notes

1. **Always backup** before running migrations in production
2. The migration is **idempotent** - safe to run multiple times
3. **Existing data is preserved** - only schema is updated
4. Supabase has automatic backups (Settings → Database → Backups)

---

## ✅ Success Checklist

After running the migration, verify:

- [ ] `User.onboardingCompleted` field exists
- [ ] `HealthJournal` table exists
- [ ] Local dev server starts without errors
- [ ] Can create a new user account
- [ ] Onboarding flow works
- [ ] Quick chat on overview page saves data
- [ ] No Prisma client errors in logs

---

**Questions?** Check `COMPLETE_SYSTEM_GUIDE.md` or review the migration SQL in `prisma/migrations/`

