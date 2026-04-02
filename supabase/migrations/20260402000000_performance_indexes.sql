-- ==========================================
-- OPTIMISATION DES PERFORMANCES - INDEX
-- ==========================================

-- 1. Index sur les clés étrangères (améliore les jointures et les filtres par utilisateur)
CREATE INDEX IF NOT EXISTS idx_demandes_user_id ON demandes(user_id);
CREATE INDEX IF NOT EXISTS idx_paiements_user_id ON paiements(user_id);
CREATE INDEX IF NOT EXISTS idx_quick_stats_user_id ON quick_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_timeline_user_id ON timeline(user_id);
CREATE INDEX IF NOT EXISTS idx_deadlines_user_id ON deadlines(user_id);
CREATE INDEX IF NOT EXISTS idx_user_documents_user_id ON user_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);

-- 2. Index sur les colonnes de statut (accélère les filtres admin et listes de tâches)
CREATE INDEX IF NOT EXISTS idx_demandes_status ON demandes(status);
CREATE INDEX IF NOT EXISTS idx_paiements_statut ON paiements(statut);
CREATE INDEX IF NOT EXISTS idx_messages_status ON messages(status);
CREATE INDEX IF NOT EXISTS idx_timeline_status ON timeline(status);

-- 3. Index sur les dates (accélère le tri par défaut du plus récent au plus ancien)
CREATE INDEX IF NOT EXISTS idx_demandes_created_at ON demandes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_paiements_created_at ON paiements(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_documents_created_at ON user_documents(created_at DESC);

-- 4. Index de recherche textuelle (pour les listes d'admin)
CREATE INDEX IF NOT EXISTS idx_profiles_nom_prenom ON profiles(nom, prenom);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
