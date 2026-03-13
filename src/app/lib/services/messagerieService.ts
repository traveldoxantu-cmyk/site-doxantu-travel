import { apiFetch } from '../api';

export interface Conversation {
    id: number;
    name: string;
    role: string;
    avatar: string;
    lastMessage: string;
    time: string;
    unread: number;
    online: boolean;
}

export interface Message {
    id: number;
    conversationId: number;
    senderId: number | 'me';
    text: string;
    time: string;
    status: 'read' | 'unread';
}

export const messagerieService = {
    getConversations: () => apiFetch<Conversation[]>('/conversations'),
    getMessages: (conversationId: number) =>
        apiFetch<Message[]>(`/messages?conversationId=${conversationId}`),
};
