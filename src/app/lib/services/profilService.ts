import { apiFetch } from '../api';

export interface Parcours {
    universite: string;
    diplome: string;
    promotion: string;
}

export interface Profil {
    id: string; // Changement en string pour UUID
    nom: string;
    initiales: string;
    email: string;
    telephone: string;
    adresse: string;
    dossierId: string;
    destination: string;
    formation: string;
    etablissement: string;
    membreDepuis: string;
    parcours: Parcours;
    avancement: number;
    etapesTotal: number;
    etapesCompletees: number;
    avatarUrl?: string;
    coverUrl?: string;
}

export const profilService = {
    getProfil: (userId?: string) => apiFetch<Profil>(userId ? `/profil?user_id=${userId}` : '/profil'),
    updateProfil: (id: string, data: Partial<Profil>) => 
        apiFetch<Profil>(`/profil?id=${id}`, {
            method: 'PUT',
            body: JSON.stringify({ id, ...data })
        })
};
