import { apiFetch } from '../api';

export interface Document {
    id: number;
    name: string;
    size: string;
    date: string;
    category: string;
    type: 'pdf' | 'image';
    status: 'verified' | 'pending';
}

export const documentsService = {
    getDocuments: () => apiFetch<Document[]>('/documents'),
    deleteDocument: (id: number) =>
        apiFetch<void>(`/documents/${id}`, { method: 'DELETE' }),
};
