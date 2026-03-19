-- ==========================================
-- DOXANTU TRAVEL - SCHEMA FINAL SUPABASE
-- ==========================================

-- 1. Table des utilisateurs (Héritage partiel de auth.users si utilisé, sinon autonome)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL, -- Stocké en clair pour la migration, idéalement à hasher
    role TEXT DEFAULT 'client', -- 'admin' | 'client'
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    initiales TEXT,
    poste TEXT, -- Pour les admins (ex: Direction Générale)
    urgent BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Profils (Extension de la table users pour le dashboard client)
CREATE TABLE IF NOT EXISTS profil (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    adresse TEXT,
    dossier_id TEXT, -- ex: DXT-2026-0142
    destination TEXT,
    formation TEXT,
    etablissement TEXT,
    membre_depuis TEXT,
    avancement INTEGER DEFAULT 0,
    etapes_total INTEGER DEFAULT 6,
    etapes_completees INTEGER DEFAULT 0,
    avatar_url TEXT,
    cover_url TEXT,
    parcours JSONB DEFAULT '{}'::jsonb, -- universite, diplome, promotion
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Demandes (Billetterie & Accompagnement)
CREATE TABLE IF NOT EXISTS demandes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    type TEXT NOT NULL, -- 'billetterie' | 'accompagnement'
    status TEXT DEFAULT 'nouveau', -- 'nouveau' | 'pending' | 'processing' | 'completed' | 'rejected'
    data JSONB NOT NULL DEFAULT '{}'::jsonb, -- Contient les détails spécifiques au type
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Statistiques Admin (Table à clé unique ou historique)
CREATE TABLE IF NOT EXISTS admin_stats (
    key TEXT PRIMARY KEY, -- ex: 'general_stats'
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Données de Graphique
CREATE TABLE IF NOT EXISTS chart_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mois TEXT NOT NULL,
    valeur NUMERIC NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Dossiers par Statut (Pour le camembert admin)
CREATE TABLE IF NOT EXISTS dossiers_statut (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    statut TEXT NOT NULL,
    count INTEGER NOT NULL,
    color TEXT NOT NULL
);

-- 7. Paiements / Transactions
CREATE TABLE IF NOT EXISTS paiements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    client TEXT, -- Nom à plat si user_id est null
    montant NUMERIC NOT NULL,
    date TEXT NOT NULL,
    statut TEXT DEFAULT 'en_attente', -- 'reçu' | 'en_attente'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Conseillers / Équipe
CREATE TABLE IF NOT EXISTS conseillers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom TEXT NOT NULL,
    initials TEXT,
    role TEXT,
    color TEXT,
    description TEXT,
    online BOOLEAN DEFAULT false,
    dernier_message TEXT,
    temps_message TEXT,
    clients_count INTEGER DEFAULT 0
);

-- 9. Stats Widget Client (Quick summaries)
CREATE TABLE IF NOT EXISTS quick_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    value TEXT NOT NULL,
    category TEXT NOT NULL -- 'dossier' | 'documents' | etc.
);

-- 10. Timeline / Suivi Dossier
CREATE TABLE IF NOT EXISTS timeline (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    status TEXT DEFAULT 'upcoming' -- 'completed' | 'current' | 'upcoming'
);

-- 11. Échéances / Deadlines
CREATE TABLE IF NOT EXISTS deadlines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    days_remaining INTEGER,
    color_class TEXT -- 'red' | 'amber' | 'emerald'
);

-- 12. Messagerie
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    role TEXT,
    avatar TEXT,
    last_message TEXT,
    time TEXT,
    unread INTEGER DEFAULT 0,
    online BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id TEXT, -- UUID ou 'me'
    text TEXT NOT NULL,
    time TEXT,
    status TEXT DEFAULT 'unread',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 13. Documents Utilisateurs
CREATE TABLE IF NOT EXISTS user_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT,
    url TEXT NOT NULL,
    size INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ACTIVER LE TEMPS RÉEL SUR LES TABLES CLÉS
-- (A exécuter dans l'éditeur SQL de Supabase)
-- ALTER PUBLICATION supabase_realtime ADD TABLE demandes;
-- ALTER PUBLICATION supabase_realtime ADD TABLE paiements;
-- ALTER PUBLICATION supabase_realtime ADD TABLE messages;
