-- Mise à jour de la table profil pour les images
ALTER TABLE profil ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE profil ADD COLUMN IF NOT EXISTS cover_url TEXT;

-- Table pour les documents des utilisateurs
CREATE TABLE IF NOT EXISTS user_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT, -- ex: 'passport', 'diploma', etc.
    url TEXT NOT NULL,
    size INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Note: Les buckets 'avatars' (public) et 'documents' (privé) doivent être créés via l'interface Supabase
-- ou via une politique RLS appropriée.
