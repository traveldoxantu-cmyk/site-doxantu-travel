-- ==========================================
-- DOXANTU TRAVEL - OPTIMISATION PERFORMANCE
-- Migration: 20260402000000_performance_indexes.sql
-- ==========================================

-- 1. Index pour la fonction is_admin() (Critique pour RLS)
-- Crée un index "couvrant" qui permet de vérifier le rôle sans lire toute la ligne
CREATE INDEX IF NOT EXISTS idx_users_id_role ON public.users(id, role);

-- 2. Index pour les relations utilisateurs (Accélère le Dashboard)
CREATE INDEX IF NOT EXISTS idx_demandes_user_id ON public.demandes(user_id);
CREATE INDEX IF NOT EXISTS idx_paiements_user_id ON public.paiements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_documents_user_id ON public.user_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);

-- 3. Optimisation de la fonction is_admin()
-- Utilise une syntaxe plus directe et stable
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
    LIMIT 1
  );
$$;

-- 4. Statistiques de performance (Analyse des tables)
ANALYZE public.users;
ANALYZE public.profiles;
ANALYZE public.demandes;
