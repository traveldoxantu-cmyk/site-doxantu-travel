import { apiFetch } from '../api';

export interface QuickStat {
    id: number;
    label: string;
    value: string;
    category: string;
}

export interface TimelineItem {
    id: number;
    title: string;
    date: string;
    status: 'completed' | 'current' | 'upcoming';
}

export interface Deadline {
    id: number;
    title: string;
    date: string;
    daysRemaining: number;
    colorClass: 'red' | 'amber' | 'emerald';
}

export interface StatsWidget {
    documents: { fait: number; total: number };
    messages: number;
    joursRestants: number;
}

export interface Conseiller {
    id: number;
    nom: string;
    initiales: string;
    online: boolean;
    dernierMessage: string;
    tempsMessage: string;
}

export const dashboardService = {
    getQuickStats: () => apiFetch<QuickStat[]>('/quickStats'),
    getTimeline: () => apiFetch<TimelineItem[]>('/timeline'),
    getDeadlines: () => apiFetch<Deadline[]>('/deadlines'),
    getStatsWidget: () => apiFetch<StatsWidget>('/statsWidget'),
    getConseiller: () => apiFetch<Conseiller>('/conseiller'),
};
