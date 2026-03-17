import { apiFetch } from '../api';

export interface Document {
    id: string; // Changement en string pour UUID
    name: string;
    size: string;
    date: string;
    category: string;
    type: 'pdf' | 'image';
    status: 'verified' | 'pending';
    url: string; // Ajout de l'URL pour l'accès direct
}

export const documentsService = {
    getDocuments: (userId?: string) => 
        apiFetch<Document[]>(userId ? `/user_documents?user_id=${userId}` : '/user_documents'),
    
    uploadDocument: async (doc: Partial<Document> & { url: string, userId: string }) => {
        return apiFetch<Document>('/user_documents', {
            method: 'POST',
            body: JSON.stringify(doc)
        });
    },

    deleteDocument: (id: string) =>
        apiFetch<void>(`/user_documents?id=${id}`, { method: 'DELETE' }),
};
