-- ==========================================
-- DOXANTU TRAVEL - AUTH & FORM STABILIZATION
-- Migration: 20260405000000_auth_triggers.sql
-- ==========================================

-- 1. Renommer 'profil' en 'profiles' pour la cohérence
DO $$ BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profil') THEN
        ALTER TABLE public.profil RENAME TO profiles;
    END IF;
END $$;


-- 2. Trigger Function: Création de profil automatique à l'inscription
-- Récupère les métadonnées (nom, prénom, téléphone) envoyées par Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insertion dans public.users
  INSERT INTO public.users (id, email, first_name, last_name, phone, role, initiales)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', NEW.raw_user_meta_data->>'full_name', 'Ami'),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    NEW.raw_user_meta_data->>'phone',
    COALESCE(NEW.raw_user_meta_data->>'role', 'client'),
    UPPER(LEFT(COALESCE(NEW.raw_user_meta_data->>'first_name', 'U'), 1))
  )
  ON CONFLICT (id) DO NOTHING;

  -- Insertion dans public.profiles (lié à users)
  INSERT INTO public.profiles (id, membre_depuis, avancement, etapes_total, etapes_completees)
  VALUES (
    NEW.id,
    TO_CHAR(NOW(), 'Month YYYY'),
    0,
    6,
    0
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 3. Trigger: Lancer la fonction lors de la création d'un utilisateur Auth
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 4. RLS Update: Autoriser les insertions ANONYMES dans 'demandes'
-- Pour que les formulaires de contact/visa fonctionnent sans connexion obligatoire
ALTER TABLE public.demandes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "demandes: insertion publique" ON public.demandes;
CREATE POLICY "demandes: insertion publique"
  ON public.demandes FOR INSERT
  WITH CHECK (true); -- Autorise n'importe qui à soumettre une demande

-- 5. RLS Update: Autoriser la lecture de son propre profil (profiles)
DROP POLICY IF EXISTS "profiles: lecture propre" ON public.profiles;
CREATE POLICY "profiles: lecture propre"
  ON public.profiles FOR SELECT
  USING (id = auth.uid() OR public.is_admin());

-- 6. RLS Update: Autoriser la modification de son propre profil (profiles)
DROP POLICY IF EXISTS "profiles: modification propre" ON public.profiles;
CREATE POLICY "profiles: modification propre"
  ON public.profiles FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());
