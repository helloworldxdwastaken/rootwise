-- Enable Row Level Security (RLS) on all tables
-- This ensures users can only access their own data

-- Enable RLS on all tables
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "UserProfile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PatientProfile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Condition" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ChatSession" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ChatMessage" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "UserMemory" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "HealthJournal" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Session" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Account" ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- User Table Policies
-- ============================================================================
-- Users can read their own user record
CREATE POLICY "Users can view own user data" ON "User"
  FOR SELECT
  USING (auth.uid()::text = id);

-- Users can update their own user record
CREATE POLICY "Users can update own user data" ON "User"
  FOR UPDATE
  USING (auth.uid()::text = id);

-- ============================================================================
-- UserProfile Table Policies
-- ============================================================================
CREATE POLICY "Users can view own profile" ON "UserProfile"
  FOR SELECT
  USING (auth.uid()::text = "userId");

CREATE POLICY "Users can update own profile" ON "UserProfile"
  FOR UPDATE
  USING (auth.uid()::text = "userId");

CREATE POLICY "Users can insert own profile" ON "UserProfile"
  FOR INSERT
  WITH CHECK (auth.uid()::text = "userId");

-- ============================================================================
-- PatientProfile Table Policies
-- ============================================================================
CREATE POLICY "Users can view own patient profile" ON "PatientProfile"
  FOR SELECT
  USING (auth.uid()::text = "userId");

CREATE POLICY "Users can update own patient profile" ON "PatientProfile"
  FOR UPDATE
  USING (auth.uid()::text = "userId");

CREATE POLICY "Users can insert own patient profile" ON "PatientProfile"
  FOR INSERT
  WITH CHECK (auth.uid()::text = "userId");

-- ============================================================================
-- Condition Table Policies
-- ============================================================================
CREATE POLICY "Users can view own conditions" ON "Condition"
  FOR SELECT
  USING (auth.uid()::text = "userId");

CREATE POLICY "Users can insert own conditions" ON "Condition"
  FOR INSERT
  WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY "Users can update own conditions" ON "Condition"
  FOR UPDATE
  USING (auth.uid()::text = "userId");

CREATE POLICY "Users can delete own conditions" ON "Condition"
  FOR DELETE
  USING (auth.uid()::text = "userId");

-- ============================================================================
-- ChatSession Table Policies
-- ============================================================================
CREATE POLICY "Users can view own chat sessions" ON "ChatSession"
  FOR SELECT
  USING (auth.uid()::text = "userId");

CREATE POLICY "Users can insert own chat sessions" ON "ChatSession"
  FOR INSERT
  WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY "Users can update own chat sessions" ON "ChatSession"
  FOR UPDATE
  USING (auth.uid()::text = "userId");

CREATE POLICY "Users can delete own chat sessions" ON "ChatSession"
  FOR DELETE
  USING (auth.uid()::text = "userId");

-- ============================================================================
-- ChatMessage Table Policies
-- ============================================================================
CREATE POLICY "Users can view own chat messages" ON "ChatMessage"
  FOR SELECT
  USING (auth.uid()::text = "userId");

CREATE POLICY "Users can insert own chat messages" ON "ChatMessage"
  FOR INSERT
  WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY "Users can update own chat messages" ON "ChatMessage"
  FOR UPDATE
  USING (auth.uid()::text = "userId");

CREATE POLICY "Users can delete own chat messages" ON "ChatMessage"
  FOR DELETE
  USING (auth.uid()::text = "userId");

-- ============================================================================
-- UserMemory Table Policies
-- ============================================================================
CREATE POLICY "Users can view own memories" ON "UserMemory"
  FOR SELECT
  USING (auth.uid()::text = "userId");

CREATE POLICY "Users can insert own memories" ON "UserMemory"
  FOR INSERT
  WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY "Users can update own memories" ON "UserMemory"
  FOR UPDATE
  USING (auth.uid()::text = "userId");

CREATE POLICY "Users can delete own memories" ON "UserMemory"
  FOR DELETE
  USING (auth.uid()::text = "userId");

-- ============================================================================
-- HealthJournal Table Policies
-- ============================================================================
CREATE POLICY "Users can view own health journal" ON "HealthJournal"
  FOR SELECT
  USING (auth.uid()::text = "userId");

CREATE POLICY "Users can insert own health journal" ON "HealthJournal"
  FOR INSERT
  WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY "Users can update own health journal" ON "HealthJournal"
  FOR UPDATE
  USING (auth.uid()::text = "userId");

CREATE POLICY "Users can delete own health journal" ON "HealthJournal"
  FOR DELETE
  USING (auth.uid()::text = "userId");

-- ============================================================================
-- Session Table Policies (NextAuth sessions)
-- ============================================================================
CREATE POLICY "Users can view own sessions" ON "Session"
  FOR SELECT
  USING (auth.uid()::text = "userId");

CREATE POLICY "Users can insert own sessions" ON "Session"
  FOR INSERT
  WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY "Users can delete own sessions" ON "Session"
  FOR DELETE
  USING (auth.uid()::text = "userId");

-- ============================================================================
-- Account Table Policies (NextAuth accounts)
-- ============================================================================
CREATE POLICY "Users can view own accounts" ON "Account"
  FOR SELECT
  USING (auth.uid()::text = "userId");

CREATE POLICY "Users can insert own accounts" ON "Account"
  FOR INSERT
  WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY "Users can update own accounts" ON "Account"
  FOR UPDATE
  USING (auth.uid()::text = "userId");

CREATE POLICY "Users can delete own accounts" ON "Account"
  FOR DELETE
  USING (auth.uid()::text = "userId");

