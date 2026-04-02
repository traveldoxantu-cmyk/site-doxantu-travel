-- ============================================================
-- SQL Migration : Automatisation de l'Inscription (VERSION ATOMIC)
-- Description: Uniquement l'essentiel pour un profil instantané.
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Simplification ATOMIQUE : On insère juste l'ID.
  -- Le reste est délégué à l'application pour garantir une réponse instantanée d'Auth.
  INSERT INTO public.profiles (id, email, role)
  VALUES (new.id, new.email, 'client')
  ON CONFLICT (id) DO NOTHING;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Activation Directe
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
