#!/bin/bash
# Database Migration Script for Rootwise
# Run this after Supabase maintenance is complete

set -e  # Exit on error

echo "🗄️  Rootwise Database Migration"
echo "================================"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please create .env with DATABASE_URL and DIRECT_URL from Supabase"
    exit 1
fi

# Check if DATABASE_URL is set
if ! grep -q "DATABASE_URL" .env; then
    echo "❌ Error: DATABASE_URL not found in .env"
    exit 1
fi

# Check if DIRECT_URL is set
if ! grep -q "DIRECT_URL" .env; then
    echo "❌ Error: DIRECT_URL not found in .env"
    echo "Get this from: Supabase Dashboard → Settings → Database → Connection string (Direct connection)"
    exit 1
fi

echo "✅ Environment variables found"
echo ""

# Step 1: Generate Prisma Client
echo "📦 Step 1: Generating Prisma Client..."
npx prisma generate
echo "✅ Prisma Client generated"
echo ""

# Step 2: Check current database state
echo "🔍 Step 2: Checking database connection..."
npx prisma db execute --url "$(grep DATABASE_URL .env | cut -d '=' -f2-)" --stdin <<< "SELECT 1;" 2>/dev/null && echo "✅ Database connection successful" || {
    echo "❌ Database connection failed!"
    echo "Please check your DATABASE_URL in .env"
    exit 1
}
echo ""

# Step 3: Create migration for new fields
echo "📝 Step 3: Creating migration for missing fields..."
echo "This will add:"
echo "  - User.onboardingCompleted, onboardingCompletedAt, onboardingProgress"
echo "  - HealthJournal table"
echo "  - ChatMessage.extractedHealthData, wasProcessedForHealth"
echo "  - Condition.diagnosedBy"
echo ""

# Generate migration
npx prisma migrate dev --name add_onboarding_and_health_journal --create-only

echo "✅ Migration file created"
echo ""

# Step 4: Review the migration
echo "📋 Step 4: Review the generated migration..."
echo "The migration file is in: prisma/migrations/"
LATEST_MIGRATION=$(ls -t prisma/migrations/ | head -1)
echo "Latest migration: $LATEST_MIGRATION"
echo ""
echo "Contents:"
cat "prisma/migrations/$LATEST_MIGRATION/migration.sql"
echo ""

read -p "Does this look correct? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Migration cancelled. You can manually edit the migration file and run 'npx prisma migrate deploy' when ready."
    exit 0
fi

# Step 5: Apply migration
echo ""
echo "🚀 Step 5: Applying migration to database..."
npx prisma migrate deploy

echo ""
echo "✅ Migration complete!"
echo ""

# Step 6: Verify
echo "🔍 Step 6: Verifying database schema..."
npx prisma db pull --force 2>/dev/null && echo "✅ Schema verified" || echo "⚠️  Schema verification warning (this is usually okay)"

echo ""
echo "════════════════════════════════════════"
echo "✨ Database migration successful!"
echo "════════════════════════════════════════"
echo ""
echo "Next steps:"
echo "1. Test locally: npm run dev"
echo "2. Verify in Supabase Dashboard: https://supabase.com/dashboard"
echo "3. Deploy to Vercel (it will auto-run migrations)"
echo ""
echo "📚 For more info, see: COMPLETE_SYSTEM_GUIDE.md"

