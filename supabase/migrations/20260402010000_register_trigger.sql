-- ============================================================
-- SQL Migration : Automatisation de l'Inscription (VERSION DE SECOURS - ANTI-ERREUR)
-- Description: Crée le profil avec gestion des exceptions pour ne jamais bloquer l'auth.
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- 1. Création du profil (Critique)
  BEGIN
    INSERT INTO public.profiles (id, nom, prenom, tel, role, initiales)
    VALUES (
      new.id,
      COALESCE(new.raw_user_meta_data->>'last_name', 'Client'),
      COALESCE(new.raw_user_meta_data->>'first_name', 'Nouveau'),
      new.raw_user_meta_data->>'phone',
      'client',
      COALESCE(UPPER(LEFT(new.raw_user_meta_data->>'first_name', 1) || LEFT(new.raw_user_meta_data->>'last_name', 1)), 'U')
    )
    ON CONFLICT (id) DO UPDATE SET
      nom = EXCLUDED.nom,
      prenom = EXCLUDED.prenom,
      tel = EXCLUDED.tel;
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Échec création profil : %', SQLERRM;
  END;

  -- 2. Création shadow user (Optionnel)
  BEGIN
    INSERT INTO public.users (id, email, password, first_name, last_name, phone, role, initiales)
    VALUES (
      new.id,
      new.email,
      'auth_sync',
      COALESCE(new.raw_user_meta_data->>'first_name', 'Nouveau'),
      COALESCE(new.raw_user_meta_data->>'last_name', 'Client'),
      new.raw_user_meta_data->>'phone',
      'client',
      COALESCE(UPPER(LEFT(new.raw_user_meta_data->>'first_name', 1) || LEFT(new.raw_user_meta_data->>'last_name', 1)), 'U')
    )
    ON CONFLICT (id) DO NOTHING;
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Activation / Remplacement du Trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
