-- ============================================================
-- SQL Migration : Automatisation de l'Inscription (VERSION ATOMIC)
-- Description: Uniquement l'essentiel pour un profil instantané.
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- 1. On insère ou met à jour dans la table public.users
  -- (Le mot de passe a été supprimé par une migration précédente, on ne l'inclut pas)
  INSERT INTO public.users (id, email, role)
  VALUES (new.id, new.email, 'client')
  ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;

  -- 2. On insère ou met à jour dans la table public.profiles
  INSERT INTO public.profiles (id, nom, prenom, tel, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'last_name', 'Doxantu'),
    COALESCE(new.raw_user_meta_data->>'first_name', 'Client'),
    COALESCE(new.raw_user_meta_data->>'phone', ''),
    'client'
  )
  ON CONFLICT (id) DO UPDATE SET
    nom = EXCLUDED.nom,
    prenom = EXCLUDED.prenom,
    tel = EXCLUDED.tel;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Activation Directe
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
