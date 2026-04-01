-- ==========================================
-- DOXANTU TRAVEL - SÉCURISATION RLS
-- Migration: 20260401000000_enable_rls_policies.sql
-- ==========================================
-- Résout les alertes Supabase :
--   1. rls_disabled_in_public  → Active RLS sur toutes les tables
--   2. sensitive_columns_exposed → Restreint l'accès aux données sensibles
-- ==========================================

-- ==========================================
-- 0. SUPPRIMER LA COLONNE PASSWORD EN CLAIR
-- Les mots de passe doivent être gérés par auth.users (Supabase Auth)
-- et JAMAIS stockés dans une table publique.
-- ==========================================
ALTER TABLE public.users DROP COLUMN IF EXISTS password;


-- ==========================================
-- 1. ACTIVER RLS SUR TOUTES LES TABLES
-- ==========================================
ALTER TABLE public.users              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demandes           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_stats        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chart_data         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dossiers_statut    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paiements          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conseillers        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quick_stats        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deadlines          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_documents     ENABLE ROW LEVEL SECURITY;


-- ==========================================
-- 2. HELPER : VÉRIFIER SI L'UTILISATEUR EST ADMIN
-- ==========================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
      AND role = 'admin'
  );
$$;


-- ==========================================
-- 3. TABLE: users
-- Un utilisateur peut lire/modifier son propre profil.
-- Seuls les admins peuvent lire tous les utilisateurs.
-- ==========================================
DROP POLICY IF EXISTS "users: lecture propre" ON public.users;
CREATE POLICY "users: lecture propre"
  ON public.users FOR SELECT
  USING (id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "users: modification propre" ON public.users;
CREATE POLICY "users: modification propre"
  ON public.users FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "users: insertion admin" ON public.users;
CREATE POLICY "users: insertion admin"
  ON public.users FOR INSERT
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "users: suppression admin" ON public.users;
CREATE POLICY "users: suppression admin"
  ON public.users FOR DELETE
  USING (public.is_admin());


-- ==========================================
-- 4. TABLE: profiles
-- Un utilisateur peut lire/modifier son propre profil.
-- Les admins peuvent tout lire.
-- ==========================================
DROP POLICY IF EXISTS "profiles: lecture propre" ON public.profiles;
CREATE POLICY "profiles: lecture propre"
  ON public.profiles FOR SELECT
  USING (id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "profiles: modification propre" ON public.profiles;
CREATE POLICY "profiles: modification propre"
  ON public.profiles FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "profiles: insertion propre" ON public.profiles;
CREATE POLICY "profiles: insertion propre"
  ON public.profiles FOR INSERT
  WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "profiles: suppression admin" ON public.profiles;
CREATE POLICY "profiles: suppression admin"
  ON public.profiles FOR DELETE
  USING (id = auth.uid() OR public.is_admin());


-- ==========================================
-- 5. TABLE: demandes
-- Un utilisateur peut voir/créer ses propres demandes.
-- Les admins peuvent tout voir et modifier.
-- ==========================================
DROP POLICY IF EXISTS "demandes: lecture" ON public.demandes;
CREATE POLICY "demandes: lecture"
  ON public.demandes FOR SELECT
  USING (user_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "demandes: insertion" ON public.demandes;
CREATE POLICY "demandes: insertion"
  ON public.demandes FOR INSERT
  WITH CHECK (user_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "demandes: mise à jour admin" ON public.demandes;
CREATE POLICY "demandes: mise à jour admin"
  ON public.demandes FOR UPDATE
  USING (public.is_admin());

DROP POLICY IF EXISTS "demandes: suppression admin" ON public.demandes;
CREATE POLICY "demandes: suppression admin"
  ON public.demandes FOR DELETE
  USING (public.is_admin());


-- ==========================================
-- 6. TABLE: admin_stats & chart_data & dossiers_statut
-- Lecture publique en lecture seule (données agrégées, non-sensibles).
-- Écriture réservée aux admins.
-- ==========================================
DROP POLICY IF EXISTS "admin_stats: lecture admin" ON public.admin_stats;
CREATE POLICY "admin_stats: lecture admin"
  ON public.admin_stats FOR SELECT
  USING (public.is_admin());

DROP POLICY IF EXISTS "admin_stats: écriture admin" ON public.admin_stats;
CREATE POLICY "admin_stats: écriture admin"
  ON public.admin_stats FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "chart_data: lecture admin" ON public.chart_data;
CREATE POLICY "chart_data: lecture admin"
  ON public.chart_data FOR SELECT
  USING (public.is_admin());

DROP POLICY IF EXISTS "chart_data: écriture admin" ON public.chart_data;
CREATE POLICY "chart_data: écriture admin"
  ON public.chart_data FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "dossiers_statut: lecture admin" ON public.dossiers_statut;
CREATE POLICY "dossiers_statut: lecture admin"
  ON public.dossiers_statut FOR SELECT
  USING (public.is_admin());

DROP POLICY IF EXISTS "dossiers_statut: écriture admin" ON public.dossiers_statut;
CREATE POLICY "dossiers_statut: écriture admin"
  ON public.dossiers_statut FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());


-- ==========================================
-- 7. TABLE: paiements
-- Un utilisateur peut voir ses propres paiements.
-- Les admins peuvent tout voir et modifier.
-- ==========================================
DROP POLICY IF EXISTS "paiements: lecture" ON public.paiements;
CREATE POLICY "paiements: lecture"
  ON public.paiements FOR SELECT
  USING (user_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "paiements: écriture admin" ON public.paiements;
CREATE POLICY "paiements: écriture admin"
  ON public.paiements FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());


-- ==========================================
-- 8. TABLE: conseillers
-- Lecture autorisée pour tous les utilisateurs connectés.
-- Écriture réservée aux admins.
-- ==========================================
DROP POLICY IF EXISTS "conseillers: lecture authentifié" ON public.conseillers;
CREATE POLICY "conseillers: lecture authentifié"
  ON public.conseillers FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "conseillers: écriture admin" ON public.conseillers;
CREATE POLICY "conseillers: écriture admin"
  ON public.conseillers FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());


-- ==========================================
-- 9. TABLES: quick_stats, timeline, deadlines
-- Données personnelles : lecture/écriture uniquement pour le propriétaire ou admin.
-- ==========================================
DROP POLICY IF EXISTS "quick_stats: accès propre" ON public.quick_stats;
CREATE POLICY "quick_stats: accès propre"
  ON public.quick_stats FOR ALL
  USING (user_id = auth.uid() OR public.is_admin())
  WITH CHECK (user_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "timeline: accès propre" ON public.timeline;
CREATE POLICY "timeline: accès propre"
  ON public.timeline FOR ALL
  USING (user_id = auth.uid() OR public.is_admin())
  WITH CHECK (user_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "deadlines: accès propre" ON public.deadlines;
CREATE POLICY "deadlines: accès propre"
  ON public.deadlines FOR ALL
  USING (user_id = auth.uid() OR public.is_admin())
  WITH CHECK (user_id = auth.uid() OR public.is_admin());


-- ==========================================
-- 10. TABLE: conversations & messages
-- Accès uniquement pour les utilisateurs authentifiés.
-- NOTE: Pour une messagerie avancée, affiner avec une table de participants.
-- ==========================================
DROP POLICY IF EXISTS "conversations: lecture authentifié" ON public.conversations;
CREATE POLICY "conversations: lecture authentifié"
  ON public.conversations FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "conversations: écriture admin" ON public.conversations;
CREATE POLICY "conversations: écriture admin"
  ON public.conversations FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "messages: lecture authentifié" ON public.messages;
CREATE POLICY "messages: lecture authentifié"
  ON public.messages FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "messages: insertion authentifié" ON public.messages;
CREATE POLICY "messages: insertion authentifié"
  ON public.messages FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "messages: suppression admin" ON public.messages;
CREATE POLICY "messages: suppression admin"
  ON public.messages FOR DELETE
  USING (public.is_admin());


-- ==========================================
-- 11. TABLE: user_documents
-- Un utilisateur peut gérer ses propres documents.
-- Les admins peuvent tout voir.
-- ==========================================
DROP POLICY IF EXISTS "user_documents: accès propre" ON public.user_documents;
CREATE POLICY "user_documents: accès propre"
  ON public.user_documents FOR ALL
  USING (user_id = auth.uid() OR public.is_admin())
  WITH CHECK (user_id = auth.uid() OR public.is_admin());


-- ==========================================
-- FIN DE LA MIGRATION
-- ==========================================
-- Pour appliquer : copier ce fichier dans l'éditeur SQL de Supabase
-- ou utiliser : supabase db push
-- ==========================================
