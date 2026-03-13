import { apiFetch } from '../api';

export interface AdminStats {
  clientsActifs: number;
  dossiersEnCours: number;
  messagesNonLus: number;
  revenusMois: number;
}

export interface Client {
  id: number;
  nom: string;
  initiales: string;
  email: string;
  telephone: string;
  dossierId: string;
  destination: string;
  formation: string;
  statut: 'en_cours' | 'en_attente' | 'valide' | 'urgent';
  etape: number;
  etapesTotal: number;
  dateCreation: string;
  conseiller: string;
  avancement: number;
}

export const adminService = {
  getStats: () => apiFetch<AdminStats>('/adminStats'),
  getClients: () => apiFetch<Client[]>('/clients'),
  getClientById: (id: number) => apiFetch<Client>(`/clients/${id}`),
};
