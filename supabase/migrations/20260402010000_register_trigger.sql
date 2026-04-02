-- ============================================================
-- SQL Migration : Automatisation de l'Inscription (VERSION ATOMIC)
-- Description: Uniquement l'essentiel pour un profil instantané.
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- 1. On insère d'abord dans la table public.users (Clé primaire)
  INSERT INTO public.users (id, email, password, role)
  VALUES (
    new.id, 
    new.email, 
    'auth_user_redirect', 
    'client'
  )
  ON CONFLICT (id) DO NOTHING;

  -- 2. On insère ensuite dans la table public.profiles
  -- IMPORTANT: Pas de colonne 'email' dans 'profiles'
  INSERT INTO public.profiles (id, nom, prenom, tel, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'last_name', 'Doxantu'),
    COALESCE(new.raw_user_meta_data->>'first_name', 'Client'),
    COALESCE(new.raw_user_meta_data->>'phone', ''),
    'client'
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Activation Directe
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
