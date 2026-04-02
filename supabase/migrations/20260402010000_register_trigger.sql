-- ============================================================
-- SQL Migration : Automatisation de l'Inscription (ULTRA-ROBUSTE)
-- Description: Crée ou met à jour le profil lors d'un 'signUp'.
-- Gère les conflits si l'utilisateur existait déjà partiellement.
-- ============================================================

-- 1. Fonction automatique de création de profil avec UPSERT
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Crée ou met à jour dans la table public.users
  INSERT INTO public.users (id, email, password, first_name, last_name, phone, role, initiales)
  VALUES (
    new.id,
    new.email,
    'auth_sync',
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.raw_user_meta_data->>'phone',
    'client',
    UPPER(LEFT(new.raw_user_meta_data->>'first_name', 1) || LEFT(new.raw_user_meta_data->>'last_name', 1))
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    phone = EXCLUDED.phone;

  -- Crée ou met à jour dans la table public.profiles
  INSERT INTO public.profiles (id, nom, prenom, tel, role, initiales)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'last_name',
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'phone',
    'client',
    UPPER(LEFT(new.raw_user_meta_data->>'first_name', 1) || LEFT(new.raw_user_meta_data->>'last_name', 1))
  )
  ON CONFLICT (id) DO UPDATE SET
    nom = EXCLUDED.nom,
    prenom = EXCLUDED.prenom,
    tel = EXCLUDED.tel;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Activation du déclencheur (Trigger)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- FIN DU SCRIPT : Zéro conflit, Zéro problème. ✅
-- ============================================================
