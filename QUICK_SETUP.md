# 🚀 Rootwise - Quick Setup Guide

## Issues Fixed:

✅ **React key error** - Fixed duplicate keys in chat demo  
✅ **Login error** - Fixed auth error handling (now returns null instead of throwing)

---

## 📋 Setup Checklist

### 1. Environment Variables

Create `.env` in project root:

```env
# Database (required)
DATABASE_URL="postgresql://user:password@localhost:5432/rootwise?schema=public"

# NextAuth (required)
NEXTAUTH_SECRET="paste-random-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

Or visit: https://generate-secret.vercel.app/32

---

### 2. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Create database & run migrations
npx prisma migrate dev --name init

# Verify tables created
npx prisma studio
```

**This creates all tables:**
- User
- Account
- Session
- UserProfile
- PatientProfile
- Condition
- ChatSession
- ChatMessage
- UserMemory

---

### 3. Start Development Server

```bash
npm run dev
```

Visit: http://localhost:3000

---

## 🧪 Test Login Flow

### Register New Account:

1. Visit: http://localhost:3000/auth/register
2. Fill form:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
   - Confirm: password123
3. Click "Create account"

**Expected:**
- ✅ User created in database
- ✅ Auto-login
- ✅ Redirect to /profile dashboard

---

### Login with Existing Account:

1. Visit: http://localhost:3000/auth/login
2. Enter email & password
3. Click "Sign in"

**Expected:**
- ✅ Session created
- ✅ Redirect to /profile
- ✅ Dashboard loads

---

### If Login Still Fails:

**Check:**

1. **Database connection:**
```bash
npx prisma studio
# Should open successfully
```

2. **User exists:**
```sql
SELECT * FROM "User" WHERE email = 'test@example.com';
```

3. **Password hashed:**
- Password field should start with `$2a$` or `$2b$`
- If it's plain text, something went wrong in registration

4. **NEXTAUTH_SECRET set:**
```bash
echo $NEXTAUTH_SECRET
# Should not be empty
```

5. **Check server logs:**
```bash
npm run dev
# Watch console for "Auth error:" messages
```

---

## 🎯 Test Dashboard Features

### After Logging In:

**1. Overview Tab:**
- Should show your email
- 0 conditions
- 0 memories

**2. Health Profile Tab:**
- Fill DOB, sex, height, weight
- Check some wellness flags
- Click Save
- Should show "Profile updated successfully!"

**3. Conditions Tab:**
- Click "Add Condition"
- Name: Anemia
- Category: Chronic
- Click "Add Condition"
- Should appear in list

**4. Memories Tab:**
- Click "Add Memory"
- Key: test_key
- Value: test_value
- Importance: MEDIUM
- Save
- Should appear in list

**5. Chat History Tab:**
- Click + to create session
- Type message
- Send
- Should appear in chat

---

## 🐛 Common Issues & Fixes

### "Unauthorized" on API calls

**Cause:** Session not working

**Fix:**
1. Make sure you're logged in
2. Check browser cookies (should have `next-auth.session-token`)
3. Restart dev server: `npm run dev`

---

### "Prisma Client not generated"

**Cause:** Missing Prisma client

**Fix:**
```bash
npx prisma generate
npm run dev
```

---

### "Table doesn't exist"

**Cause:** Migrations not run

**Fix:**
```bash
npx prisma migrate dev --name init
# or
npx prisma migrate reset
```

---

### Login shows "Invalid credentials" but password is correct

**Cause:** User might not exist or password not hashed

**Fix:**
1. Register a new account (don't try to login with non-existent user)
2. Check user exists in database:
```bash
npx prisma studio
# Go to User table
```

---

## ✅ Verification Steps

### 1. Registration Works
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","name":"Test"}'

# Should return user object (not error)
```

### 2. Database Has Data
```bash
npx prisma studio
# Check User table - should have your test user
```

### 3. Login Works
- Visit /auth/login
- Use registered email/password
- Should redirect to /profile

### 4. Dashboard Loads
- /profile should show "Your Rootwise Space"
- Tabs should be clickable
- No errors in console

### 5. API Calls Work
```javascript
// In browser console after logging in
await fetch('/api/me/profile').then(r => r.json())
// Should return your profile data (not 401)
```

---

## 🚀 Everything Should Work Now!

**What's fixed:**
- ✅ React key uniqueness (no more console warnings)
- ✅ Auth error handling (better error messages)
- ✅ All dashboard sections built
- ✅ All APIs wired
- ✅ Complete build passing

**Ready to test:**
```bash
npm run dev
```

Then visit /auth/register → Create account → Access dashboard!

---

**If issues persist, check:**
1. `.env` file exists with all 3 variables
2. Database is running (PostgreSQL)
3. Migrations completed: `npx prisma migrate dev`
4. Prisma client generated: `npx prisma generate`

Happy testing! 🌿

