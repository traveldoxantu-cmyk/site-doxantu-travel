-- ============================================================
-- SQL Migration : Automatisation de l'Inscription (VERSION ATOMIC)
-- Description: Uniquement l'essentiel pour un profil instantané.
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- 1. Création UNIQUE du profil dans public.profiles
  INSERT INTO public.profiles (id, nom, prenom, tel, role, initiales)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'last_name', 'Doxantu'),
    COALESCE(new.raw_user_meta_data->>'first_name', 'Client'),
    COALESCE(new.raw_user_meta_data->>'phone', ''),
    'client',
    UPPER(LEFT(COALESCE(new.raw_user_meta_data->>'first_name', 'C'), 1) || LEFT(COALESCE(new.raw_user_meta_data->>'last_name', 'D'), 1))
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
