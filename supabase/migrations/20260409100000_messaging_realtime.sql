-- ==========================================
-- DOXANTU TRAVEL - MESSAGERIE TEMPS RÉEL
-- Migration: 20260409100000_messaging_realtime.sql
-- ==========================================

-- 1. Mise à jour de la table conversations
ALTER TABLE public.conversations 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.users(id) ON DELETE CASCADE;

-- Optionnel : Index pour la performance
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON public.conversations(user_id);

-- 2. Activer les publications Temps Réel pour les tables de messagerie
-- Cela permet au frontend d'écouter les nouveaux messages instantanément
BEGIN;
  -- On s'assure que la publication existe
  DO $$ 
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
      CREATE PUBLICATION supabase_realtime;
    END IF;
  END $$;

  -- On ajoute les tables à la publication
  ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
COMMIT;

-- 3. RLS - Politiques de Sécurité pour les Conversations
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- Les clients ne voient que LEUR conversation
DROP POLICY IF EXISTS "conversations: lecture propre" ON public.conversations;
CREATE POLICY "conversations: lecture propre"
  ON public.conversations FOR SELECT
  USING (user_id = auth.uid() OR public.is_admin());

-- Seul l'admin peut créer/modifier des conversations (ou le système via trigger)
DROP POLICY IF EXISTS "conversations: admin complet" ON public.conversations;
CREATE POLICY "conversations: admin complet"
  ON public.conversations FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 4. RLS - Politiques de Sécurité pour les Messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Accès aux messages si on appartient à la conversation
DROP POLICY IF EXISTS "messages: accès via conversation" ON public.messages;
CREATE POLICY "messages: accès via conversation"
  ON public.messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations c 
      WHERE c.id = messages.conversation_id 
      AND (c.user_id = auth.uid() OR public.is_admin())
    )
  );

-- Insertion de messages
DROP POLICY IF EXISTS "messages: insertion" ON public.messages;
CREATE POLICY "messages: insertion"
  ON public.messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.conversations c 
      WHERE c.id = conversation_id 
      AND (c.user_id = auth.uid() OR public.is_admin())
    )
  );
