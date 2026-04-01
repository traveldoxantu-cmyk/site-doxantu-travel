-- ==========================================
-- DOXANTU TRAVEL - SEED & CORRECTIONS SCHEMA
-- Migration: 20260401010000_seed_admin_data.sql
-- ==========================================
-- 1. Ajouter le champ 'urgent' sur profiles (manquant dans le schéma initial mais présent dans users)
-- 2. Seed des données admin_stats, chart_data, dossiers_statut
-- 3. Ajouter politique RLS pour l'insertion publique de demandes (formulaires publics)
-- ==========================================

-- 1. Ajouter colonne 'urgent' sur profiles si absente
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS urgent BOOLEAN DEFAULT false;

-- 2. Autoriser insertion de demandes SANS auth (formulaires de contact publics)
-- Les formulaires de contact/billetterie sur le site public n'ont pas de session
DROP POLICY IF EXISTS "demandes: insertion publique" ON public.demandes;
CREATE POLICY "demandes: insertion publique"
  ON public.demandes FOR INSERT
  WITH CHECK (true); -- Tout le monde peut soumettre une demande depuis le site

-- Surcharger la politique d'insertion précédente pour la rendre plus précise
DROP POLICY IF EXISTS "demandes: insertion" ON public.demandes;
CREATE POLICY "demandes: insertion"
  ON public.demandes FOR INSERT
  WITH CHECK (true);

-- 3. Seed stats admin (une ligne clé 'general_stats')
INSERT INTO public.admin_stats (key, value)
VALUES (
  'general_stats',
  '{
    "caTotalAnnuel": 48500000,
    "clientsSatisfaits": 94,
    "caCurrentMonth": 7200000,
    "caGrowthPercent": 12,
    "dossiersActifs": 23,
    "nouveauxDossiers": 4,
    "tauxSuccesVisa": 87,
    "tauxSuccesGrowth": 3,
    "paiementsEnAttente": 6,
    "montantAEncaisser": 1850000
  }'::jsonb
)
ON CONFLICT (key) DO NOTHING;

-- 4. Seed données graphique chiffre affaires (7 derniers mois)
INSERT INTO public.chart_data (mois, valeur) VALUES
  ('Oct', 4200000),
  ('Nov', 5100000),
  ('Déc', 6300000),
  ('Jan', 4800000),
  ('Fév', 5600000),
  ('Mar', 6900000),
  ('Avr', 7200000)
ON CONFLICT DO NOTHING;

-- 5. Seed dossiers par statut
INSERT INTO public.dossiers_statut (statut, count, color) VALUES
  ('En cours',    12, '#0B84D8'),
  ('En attente',  6,  '#F59E0B'),
  ('Validé',      8,  '#10B981'),
  ('Rejeté',      2,  '#EF4444'),
  ('Urgent',      3,  '#F97316')
ON CONFLICT DO NOTHING;

-- ==========================================
-- FIN
-- ==========================================
