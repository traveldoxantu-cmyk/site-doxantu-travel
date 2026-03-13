import { apiFetch } from '../api';

export interface Parcours {
    universite: string;
    diplome: string;
    promotion: string;
}

export interface Profil {
    id: number;
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
}

export const profilService = {
    getProfil: () => apiFetch<Profil>('/profil'),
};
