import { apiFetch } from '../api';

export interface DossierDetails {
    description: string;
    date: string;
    heure: string;
    lieu: string;
}

export interface DossierStep {
    id: string;
    title: string;
    date: string;
    status: 'completed' | 'current' | 'upcoming';
    iconType: string;
    details?: DossierDetails;
}

export const dossierService = {
    getSteps: (userId?: string) => 
        apiFetch<DossierStep[]>(userId ? `/dossierSteps?userId=${userId}` : '/dossierSteps'),
};
