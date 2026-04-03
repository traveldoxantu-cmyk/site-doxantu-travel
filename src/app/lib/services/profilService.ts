import { supabase } from '../supabase';

export interface Parcours {
    universite: string;
    diplome: string;
    promotion: string;
}

export interface Profil {
    id: string;
    nom: string;
    prenom?: string;
    initiales: string;
    email?: string;
    telephone?: string;
    tel?: string;
    adresse?: string;
    dossierId?: string;
    dossier_id?: string;
    destination?: string;
    formation?: string;
    etablissement?: string;
    membreDepuis?: string;
    membre_depuis?: string;
    parcours?: Parcours;
    avancement?: number;
    etapesTotal?: number;
    etapes_total?: number;
    etapesCompletees?: number;
    etapes_completees?: number;
    avatarUrl?: string;
    avatar_url?: string;
    coverUrl?: string;
    cover_url?: string;
    role?: string;
}

export const profilService = {
    /**
     * Récupère le profil d'un utilisateur depuis Supabase.
     * userId est obligatoire pour que la RLS fonctionne.
     */
    getProfil: async (userId: string): Promise<Profil | null> => {
        if (!supabase || !userId) return null;

        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .maybeSingle();

            if (error) {
                if (error.code === '42501') {
                    console.warn('[profilService] Erreur RLS (Accès refusé):', userId);
                    return null;
                }
                console.error('[profilService] Erreur lors de la récupération du profil:', error);
                return null;
            }

            return data;
        } catch (err) {
            console.error('[profilService] Erreur inattendue:', err);
            return null;
        }
    },

    /**
     * Met à jour le profil d'un utilisateur.
     */
    updateProfil: async (userId: string, data: Partial<Profil>): Promise<Profil | null> => {
        if (!supabase || !userId) return null;

        // Nettoyer les champs non-editables
        const { id: _id, ...updateData } = data as any;

        const { data: updated, error } = await supabase
            .from('profiles')
            .update(updateData)
            .eq('id', userId)
            .select()
            .single();

        if (error) throw error;
        return updated;
    }
};
