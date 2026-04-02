-- ============================================================
-- SQL Migration : Automatisation de l'Inscription (VERSION ULTRA-FAIL-SAFE)
-- Description: Crée le profil de manière indestructible avec gestion totale des NULL.
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  f_name text := COALESCE(new.raw_user_meta_data->>'first_name', 'Client');
  l_name text := COALESCE(new.raw_user_meta_data->>'last_name', 'Doxantu');
  u_role text := 'client';
  p_initiales text;
BEGIN
  -- Calcul des initiales en mode blindé
  p_initiales := UPPER(LEFT(f_name, 1) || LEFT(l_name, 1));
  IF p_initiales IS NULL OR p_initiales = '' THEN p_initiales := 'U'; END IF;

  -- 1. Création du profil (Critique)
  BEGIN
    INSERT INTO public.profiles (id, nom, prenom, tel, role, initiales)
    VALUES (
      new.id,
      l_name,
      f_name,
      COALESCE(new.raw_user_meta_data->>'phone', ''),
      u_role,
      p_initiales
    )
    ON CONFLICT (id) DO UPDATE SET
      nom = EXCLUDED.nom,
      prenom = EXCLUDED.prenom,
      tel = EXCLUDED.tel;
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING '⚠️ Échec (non-bloquant) création profil id % : %', new.id, SQLERRM;
  END;

  -- 2. Création du compte utilisateur interne (Shadow)
  BEGIN
    INSERT INTO public.users (id, email, password, first_name, last_name, phone, role, initiales)
    VALUES (
      new.id,
      new.email,
      'auth_synced',
      f_name,
      l_name,
      COALESCE(new.raw_user_meta_data->>'phone', ''),
      u_role,
      p_initiales
    )
    ON CONFLICT (id) DO NOTHING;
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-activation du Trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
