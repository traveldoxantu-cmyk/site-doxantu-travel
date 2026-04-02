-- ============================================================
-- SQL Migration : Automatisation de l'Inscription (Vitesse & Fiabilité)
-- Description: Crée automatiquement le profil lors d'un 'signUp'.
-- ============================================================

-- 1. Fonction pour gérer la création automatique du profil
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Insertion dans la table 'users' (public) si elle existe et est liée
  -- Note: On utilise les metadata passées par le frontend lors du signUp
  INSERT INTO public.users (id, email, password, first_name, last_name, phone, role, initiales)
  VALUES (
    new.id,
    new.email,
    'encrypted_at_auth_level', -- Le mot de passe réel est dans auth.users
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.raw_user_meta_data->>'phone',
    'client',
    UPPER(LEFT(new.raw_user_meta_data->>'first_name', 1) || LEFT(new.raw_user_meta_data->>'last_name', 1))
  );

  -- Insertion dans la table 'profiles' (public)
  INSERT INTO public.profiles (id, nom, prenom, tel, role, initiales)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'last_name',
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'phone',
    'client',
    UPPER(LEFT(new.raw_user_meta_data->>'first_name', 1) || LEFT(new.raw_user_meta_data->>'last_name', 1))
  );

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Création du Trigger sur auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- FIN DU SCRIPT : L'inscription est maintenant gérée par le serveur. ✅
-- ============================================================
