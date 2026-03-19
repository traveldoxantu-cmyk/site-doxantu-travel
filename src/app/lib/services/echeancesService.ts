import { apiFetch } from '../api';

export interface Echeance {
    id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    status: 'urgent' | 'upcoming' | 'planned';
    daysRemaining: number;
    description: string;
}

export const echeancesService = {
    getEcheances: () => apiFetch<Echeance[]>('/echeances'),
};
