import { apiFetch } from '../api';

export interface Conversation {
    id: string;
    name: string;
    role: string;
    avatar: string;
    lastMessage: string;
    time: string;
    unread: number;
    online: boolean;
}

export interface Message {
    id: string;
    conversationId: string;
    senderId: string | 'me';
    text: string;
    time: string;
    status: 'read' | 'unread';
}

export const messagerieService = {
    getConversations: () => apiFetch<Conversation[]>('/conversations'),
    getMessages: (conversationId: string) =>
        apiFetch<Message[]>(`/messages?conversationId=${conversationId}`),
};
