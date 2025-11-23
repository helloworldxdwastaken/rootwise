#!/bin/bash
# Merge Frankfurt database URLs with existing env vars

echo "🔄 Merging Frankfurt DB with existing env vars..."

# Extract non-database vars from Sydney backup
grep -v "^DATABASE_URL=" .env.sydney-backup | grep -v "^DIRECT_URL=" > .env.temp

# Add Frankfurt database URLs
cat .env.frankfurt >> .env.temp

# Replace main .env
mv .env.temp .env

echo "✅ Updated .env with Frankfurt database"
echo ""
echo "📋 Database URLs updated:"
echo "  Region: Europe (Frankfurt) 🇩🇪"
echo "  Ref: dbwtwljgaazrqzbryxmi"
echo ""
