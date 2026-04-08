-- ==========================================
-- DOXANTU TRAVEL - SECURITY HARDENING (RLS)
-- Migration: 20260408000000_hardening_rls_fix.sql
-- ==========================================
-- Goal: Resolve the "Table publicly accessible" warning.
-- This script ensures RLS is enabled on ALL tables and sets 
-- restrictive policies by default.
-- ==========================================

-- 1. SECURITY HELPER: is_admin
-- Used to bypass RLS for administrative tasks
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
      AND role = 'admin'
  );
$$;

-- 2. ENSURE ALL TABLES HAVE RLS ENABLED
-- List of tables to protect
DO $$ 
DECLARE 
    t text;
BEGIN
    FOR t IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename IN (
            'users', 'profiles', 'demandes', 'admin_stats', 
            'chart_data', 'dossiers_statut', 'paiements', 
            'conseillers', 'quick_stats', 'timeline', 
            'deadlines', 'conversations', 'messages', 'user_documents'
        )
    LOOP
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
        EXECUTE format('DROP POLICY IF EXISTS "Deny all by default" ON public.%I', t);
    END LOOP;
END $$;

-- 3. SPECIFIC POLICIES

-- Users
DROP POLICY IF EXISTS "users: access self or admin" ON public.users;
CREATE POLICY "users: access self or admin" ON public.users FOR ALL
USING (id = auth.uid() OR is_admin());

-- Profiles
DROP POLICY IF EXISTS "profiles: access self or admin" ON public.profiles;
CREATE POLICY "profiles: access self or admin" ON public.profiles FOR ALL
USING (id = auth.uid() OR is_admin());

-- Demandes (CRITICAL: Public insertion allowed, but NO public read)
DROP POLICY IF EXISTS "demandes: anonymous insert" ON public.demandes;
CREATE POLICY "demandes: anonymous insert" ON public.demandes FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "demandes: owner or admin read" ON public.demandes;
CREATE POLICY "demandes: owner or admin read" ON public.demandes FOR SELECT 
USING (user_id = auth.uid() OR is_admin());

-- Admin Data (admin_stats, chart_data, dossiers_statut)
DROP POLICY IF EXISTS "admin only access" ON public.admin_stats;
CREATE POLICY "admin only access" ON public.admin_stats FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "admin only access" ON public.chart_data;
CREATE POLICY "admin only access" ON public.chart_data FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "admin only access" ON public.dossiers_statut;
CREATE POLICY "admin only access" ON public.dossiers_statut FOR ALL USING (is_admin());

-- Payments
DROP POLICY IF EXISTS "paiements: owner or admin" ON public.paiements;
CREATE POLICY "paiements: owner or admin" ON public.paiements FOR ALL 
USING (user_id = auth.uid() OR is_admin());

-- Team / Advisors (Publicly visible to authenticated users, admin can edit)
DROP POLICY IF EXISTS "conseillers: public read" ON public.conseillers;
CREATE POLICY "conseillers: public read" ON public.conseillers FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "conseillers: admin write" ON public.conseillers;
CREATE POLICY "conseillers: admin write" ON public.conseillers FOR ALL USING (is_admin());

-- User data (timeline, deadlines, stats, documents)
DROP POLICY IF EXISTS "data access: self or admin" ON public.quick_stats;
CREATE POLICY "data access: self or admin" ON public.quick_stats FOR ALL USING (user_id = auth.uid() OR is_admin());

DROP POLICY IF EXISTS "data access: self or admin" ON public.timeline;
CREATE POLICY "data access: self or admin" ON public.timeline FOR ALL USING (user_id = auth.uid() OR is_admin());

DROP POLICY IF EXISTS "data access: self or admin" ON public.deadlines;
CREATE POLICY "data access: self or admin" ON public.deadlines FOR ALL USING (user_id = auth.uid() OR is_admin());

DROP POLICY IF EXISTS "data access: self or admin" ON public.user_documents;
CREATE POLICY "data access: self or admin" ON public.user_documents FOR ALL USING (user_id = auth.uid() OR is_admin());

-- Messaging (Authenticated users)
DROP POLICY IF EXISTS "messaging: authenticated users" ON public.conversations;
CREATE POLICY "messaging: authenticated users" ON public.conversations FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "messaging: authenticated users" ON public.messages;
CREATE POLICY "messaging: authenticated users" ON public.messages FOR ALL USING (auth.role() = 'authenticated');

-- ==========================================
-- END OF SCRIPT
-- ==========================================
