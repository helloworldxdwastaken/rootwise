-- Optimize RLS policies for better performance
-- Replace auth.uid() with (SELECT auth.uid()) to avoid per-row evaluation

-- ============================================================================
-- Drop existing policies (to recreate them with optimization)
-- ============================================================================
DROP POLICY IF EXISTS "Users can view own user data" ON "User";
DROP POLICY IF EXISTS "Users can update own user data" ON "User";
DROP POLICY IF EXISTS "Users can view own profile" ON "UserProfile";
DROP POLICY IF EXISTS "Users can update own profile" ON "UserProfile";
DROP POLICY IF EXISTS "Users can insert own profile" ON "UserProfile";
DROP POLICY IF EXISTS "Users can view own patient profile" ON "PatientProfile";
DROP POLICY IF EXISTS "Users can update own patient profile" ON "PatientProfile";
DROP POLICY IF EXISTS "Users can insert own patient profile" ON "PatientProfile";
DROP POLICY IF EXISTS "Users can view own conditions" ON "Condition";
DROP POLICY IF EXISTS "Users can insert own conditions" ON "Condition";
DROP POLICY IF EXISTS "Users can update own conditions" ON "Condition";
DROP POLICY IF EXISTS "Users can delete own conditions" ON "Condition";
DROP POLICY IF EXISTS "Users can view own chat sessions" ON "ChatSession";
DROP POLICY IF EXISTS "Users can insert own chat sessions" ON "ChatSession";
DROP POLICY IF EXISTS "Users can update own chat sessions" ON "ChatSession";
DROP POLICY IF EXISTS "Users can delete own chat sessions" ON "ChatSession";
DROP POLICY IF EXISTS "Users can view own chat messages" ON "ChatMessage";
DROP POLICY IF EXISTS "Users can insert own chat messages" ON "ChatMessage";
DROP POLICY IF EXISTS "Users can update own chat messages" ON "ChatMessage";
DROP POLICY IF EXISTS "Users can delete own chat messages" ON "ChatMessage";
DROP POLICY IF EXISTS "Users can view own memories" ON "UserMemory";
DROP POLICY IF EXISTS "Users can insert own memories" ON "UserMemory";
DROP POLICY IF EXISTS "Users can update own memories" ON "UserMemory";
DROP POLICY IF EXISTS "Users can delete own memories" ON "UserMemory";
DROP POLICY IF EXISTS "Users can view own health journal" ON "HealthJournal";
DROP POLICY IF EXISTS "Users can insert own health journal" ON "HealthJournal";
DROP POLICY IF EXISTS "Users can update own health journal" ON "HealthJournal";
DROP POLICY IF EXISTS "Users can delete own health journal" ON "HealthJournal";
DROP POLICY IF EXISTS "Users can view own sessions" ON "Session";
DROP POLICY IF EXISTS "Users can insert own sessions" ON "Session";
DROP POLICY IF EXISTS "Users can delete own sessions" ON "Session";
DROP POLICY IF EXISTS "Users can view own accounts" ON "Account";
DROP POLICY IF EXISTS "Users can insert own accounts" ON "Account";
DROP POLICY IF EXISTS "Users can update own accounts" ON "Account";
DROP POLICY IF EXISTS "Users can delete own accounts" ON "Account";

-- ============================================================================
-- Create optimized policies using (SELECT auth.uid())
-- ============================================================================

-- User Table Policies
CREATE POLICY "Users can view own user data" ON "User"
  FOR SELECT
  USING ((SELECT auth.uid())::text = id);

CREATE POLICY "Users can update own user data" ON "User"
  FOR UPDATE
  USING ((SELECT auth.uid())::text = id);

-- UserProfile Table Policies
CREATE POLICY "Users can view own profile" ON "UserProfile"
  FOR SELECT
  USING ((SELECT auth.uid())::text = "userId");

CREATE POLICY "Users can update own profile" ON "UserProfile"
  FOR UPDATE
  USING ((SELECT auth.uid())::text = "userId");

CREATE POLICY "Users can insert own profile" ON "UserProfile"
  FOR INSERT
  WITH CHECK ((SELECT auth.uid())::text = "userId");

-- PatientProfile Table Policies
CREATE POLICY "Users can view own patient profile" ON "PatientProfile"
  FOR SELECT
  USING ((SELECT auth.uid())::text = "userId");

CREATE POLICY "Users can update own patient profile" ON "PatientProfile"
  FOR UPDATE
  USING ((SELECT auth.uid())::text = "userId");

CREATE POLICY "Users can insert own patient profile" ON "PatientProfile"
  FOR INSERT
  WITH CHECK ((SELECT auth.uid())::text = "userId");

-- Condition Table Policies
CREATE POLICY "Users can view own conditions" ON "Condition"
  FOR SELECT
  USING ((SELECT auth.uid())::text = "userId");

CREATE POLICY "Users can insert own conditions" ON "Condition"
  FOR INSERT
  WITH CHECK ((SELECT auth.uid())::text = "userId");

CREATE POLICY "Users can update own conditions" ON "Condition"
  FOR UPDATE
  USING ((SELECT auth.uid())::text = "userId");

CREATE POLICY "Users can delete own conditions" ON "Condition"
  FOR DELETE
  USING ((SELECT auth.uid())::text = "userId");

-- ChatSession Table Policies
CREATE POLICY "Users can view own chat sessions" ON "ChatSession"
  FOR SELECT
  USING ((SELECT auth.uid())::text = "userId");

CREATE POLICY "Users can insert own chat sessions" ON "ChatSession"
  FOR INSERT
  WITH CHECK ((SELECT auth.uid())::text = "userId");

CREATE POLICY "Users can update own chat sessions" ON "ChatSession"
  FOR UPDATE
  USING ((SELECT auth.uid())::text = "userId");

CREATE POLICY "Users can delete own chat sessions" ON "ChatSession"
  FOR DELETE
  USING ((SELECT auth.uid())::text = "userId");

-- ChatMessage Table Policies
CREATE POLICY "Users can view own chat messages" ON "ChatMessage"
  FOR SELECT
  USING ((SELECT auth.uid())::text = "userId");

CREATE POLICY "Users can insert own chat messages" ON "ChatMessage"
  FOR INSERT
  WITH CHECK ((SELECT auth.uid())::text = "userId");

CREATE POLICY "Users can update own chat messages" ON "ChatMessage"
  FOR UPDATE
  USING ((SELECT auth.uid())::text = "userId");

CREATE POLICY "Users can delete own chat messages" ON "ChatMessage"
  FOR DELETE
  USING ((SELECT auth.uid())::text = "userId");

-- UserMemory Table Policies
CREATE POLICY "Users can view own memories" ON "UserMemory"
  FOR SELECT
  USING ((SELECT auth.uid())::text = "userId");

CREATE POLICY "Users can insert own memories" ON "UserMemory"
  FOR INSERT
  WITH CHECK ((SELECT auth.uid())::text = "userId");

CREATE POLICY "Users can update own memories" ON "UserMemory"
  FOR UPDATE
  USING ((SELECT auth.uid())::text = "userId");

CREATE POLICY "Users can delete own memories" ON "UserMemory"
  FOR DELETE
  USING ((SELECT auth.uid())::text = "userId");

-- HealthJournal Table Policies
CREATE POLICY "Users can view own health journal" ON "HealthJournal"
  FOR SELECT
  USING ((SELECT auth.uid())::text = "userId");

CREATE POLICY "Users can insert own health journal" ON "HealthJournal"
  FOR INSERT
  WITH CHECK ((SELECT auth.uid())::text = "userId");

CREATE POLICY "Users can update own health journal" ON "HealthJournal"
  FOR UPDATE
  USING ((SELECT auth.uid())::text = "userId");

CREATE POLICY "Users can delete own health journal" ON "HealthJournal"
  FOR DELETE
  USING ((SELECT auth.uid())::text = "userId");

-- Session Table Policies
CREATE POLICY "Users can view own sessions" ON "Session"
  FOR SELECT
  USING ((SELECT auth.uid())::text = "userId");

CREATE POLICY "Users can insert own sessions" ON "Session"
  FOR INSERT
  WITH CHECK ((SELECT auth.uid())::text = "userId");

CREATE POLICY "Users can delete own sessions" ON "Session"
  FOR DELETE
  USING ((SELECT auth.uid())::text = "userId");

-- Account Table Policies
CREATE POLICY "Users can view own accounts" ON "Account"
  FOR SELECT
  USING ((SELECT auth.uid())::text = "userId");

CREATE POLICY "Users can insert own accounts" ON "Account"
  FOR INSERT
  WITH CHECK ((SELECT auth.uid())::text = "userId");

CREATE POLICY "Users can update own accounts" ON "Account"
  FOR UPDATE
  USING ((SELECT auth.uid())::text = "userId");

CREATE POLICY "Users can delete own accounts" ON "Account"
  FOR DELETE
  USING ((SELECT auth.uid())::text = "userId");

