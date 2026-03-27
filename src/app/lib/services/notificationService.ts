import { apiFetch } from '../api';

export interface Notification {
    id: string;
    userId: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    read: boolean;
    createdAt: string;
}

export const notificationService = {
    getNotifications: (userId: string) => 
        apiFetch<Notification[]>(`/notifications?user_id=${userId}&_sort=createdAt&_order=desc`),
    
    markAsRead: (id: string) =>
        apiFetch(`/notifications?id=${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ read: true })
        }),
    
    createNotification: (notif: Partial<Notification>) =>
        apiFetch<Notification>('/notifications', {
            method: 'POST',
            body: JSON.stringify({
                ...notif,
                read: false,
                createdAt: new Date().toISOString()
            })
        })
};
