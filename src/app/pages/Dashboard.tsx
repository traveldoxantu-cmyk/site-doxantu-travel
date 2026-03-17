import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { FolderOpen, FileText, MessageSquare, Calendar as CalendarIcon, Clock, CheckCircle2, ChevronRight } from 'lucide-react';
import { Link } from 'react-router';
import { apiFetch } from '../lib/api';
import {
    type QuickStat,
    type TimelineItem,
    type Deadline,
    type StatsWidget,
    type Conseiller,
} from '../lib/services/dashboardService';

const STAT_STYLES: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
    dossier:    { icon: FolderOpen,     color: 'text-[#0B84D8]',    bg: 'bg-[#E8F4FD]' },
    documents:  { icon: FileText,       color: 'text-purple-600',   bg: 'bg-purple-50' },
    messagerie: { icon: MessageSquare,  color: 'text-emerald-600',  bg: 'bg-emerald-50' },
    echeances:  { icon: CalendarIcon,   color: 'text-amber-600',    bg: 'bg-amber-50' },
};

const DEADLINE_STYLES: Record<string, { color: string; bg: string; dot: string }> = {
    red:     { color: 'text-red-500',     bg: 'bg-red-50',     dot: 'bg-red-500' },
    amber:   { color: 'text-amber-500',   bg: 'bg-amber-50',   dot: 'bg-amber-500' },
    emerald: { color: 'text-emerald-500', bg: 'bg-emerald-50', dot: 'bg-emerald-500' },
};

export function Dashboard() {
    const [user, setUser]                 = useState<any>(null);
    const [loading, setLoading]           = useState(true);
    const [quickStats, setQuickStats]     = useState<QuickStat[]>([]);
    const [timeline, setTimeline]         = useState<TimelineItem[]>([]);
    const [deadlines, setDeadlines]       = useState<Deadline[]>([]);
    const [statsWidget, setStatsWidget]   = useState<StatsWidget | null>(null);
    const [conseiller, setConseiller]     = useState<Conseiller | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            
            // On ne lance les appels que si on a un utilisateur
            const userId = parsedUser.id;
            
            Promise.all([
                apiFetch<QuickStat[]>(`/quick_stats?user_id=${userId}`),
                apiFetch<TimelineItem[]>(`/timeline?user_id=${userId}`),
                apiFetch<Deadline[]>(`/deadlines?user_id=${userId}`),
                apiFetch<any[]>(`/stats_widget?user_id=${userId}`),
                apiFetch<Conseiller[]>('/conseillers?limit=1'),
            ]).then(([stats, tl, dl, sw, cons]) => {
                setQuickStats(stats || []);
                setTimeline(tl || []);
                setDeadlines(dl || []);
                if (sw && sw.length > 0) setStatsWidget(sw[0].data || sw[0]);
                if (cons && cons.length > 0) setConseiller(cons[0]);
            }).catch(console.error)
              .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    if (loading) {
        return (
            <div className="space-y-8 pb-10">
                {/* Banner Skeleton */}
                <div className="rounded-[32px] p-8 h-48 bg-gray-100 animate-pulse flex items-center justify-between">
                    <div className="space-y-3">
                        <div className="h-8 w-64 bg-gray-200 rounded-lg" />
                        <div className="h-4 w-48 bg-gray-200 rounded-lg" />
                    </div>
                    <div className="h-20 w-48 bg-gray-200 rounded-2xl hidden md:block" />
                </div>
                {/* Stats Grid Skeleton */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-white p-6 rounded-[32px] border border-gray-100 h-32 animate-pulse space-y-4">
                            <div className="w-10 h-10 bg-gray-100 rounded-xl" />
                            <div className="h-4 w-20 bg-gray-100 rounded" />
                        </div>
                    ))}
                </div>
                {/* Content Skeleton */}
                <div className="grid lg:grid-cols-3 gap-8">
                     <div className="lg:col-span-2 h-96 bg-gray-50 border border-gray-100 rounded-[32px] animate-pulse" />
                     <div className="h-96 bg-gray-50 border border-gray-100 rounded-[32px] animate-pulse" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-10">
            {/* Welcome Banner */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl p-8 text-white relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #072a50 0%, #0B84D8 100%)' }}
            >
                <div className="absolute top-[-20%] right-[-10%] w-[300px] h-[300px] rounded-full bg-white/10 blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">
                            {new Date().getHours() > 17 ? 'Bonsoir' : 'Bonjour'}, {user?.firstName || 'Ami'}
                        </h1>
                        <p className="text-blue-100 font-medium mb-1">Dossier <span className="text-white font-bold">DXT-2026-0142</span> - {user?.role === 'admin' ? 'Administration' : 'Paris, France'}</p>
                        <p className="text-blue-200 text-sm">
                            {user?.role === 'admin' ? 'Gestionnaire de la plateforme Doxantu Travel' : 'Master en Intelligence Artificielle – Université Paris-Saclay'}
                        </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 w-full md:min-w-[200px]">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-blue-100">Avancement global</span>
                            <span className="text-2xl font-black">33%</span>
                        </div>
                        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                            <div className="h-full bg-white rounded-full transition-all duration-1000 ease-out" style={{ width: '33%' }} />
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {quickStats.map((stat, i) => {
                    const styles = STAT_STYLES[stat.category] ?? STAT_STYLES.dossier;
                    const Icon = styles.icon;
                    return (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                        >
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${styles.bg} ${styles.color}`}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-[#1a2b40] mb-1">{stat.label}</h3>
                            <p className="text-sm text-gray-500 font-medium">{stat.value}</p>
                        </motion.div>
                    );
                })}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Timeline (Left Column: takes 2/3) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-xl font-bold text-[#1a2b40] mb-1">Suivi de mon dossier</h2>
                                <p className="text-sm text-gray-500">Étape 3 sur 6 en cours</p>
                            </div>
                            <Link to="/mon-espace/dossier" className="text-sm font-semibold text-[#0B84D8] hover:text-[#0973BD] flex items-center gap-1">
                                Détails <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>

                        <div className="relative pl-4 border-l-2 border-gray-100 space-y-8">
                            {timeline.map((item, i) => (
                                <div key={i} className="relative">
                                    <div className={`absolute -left-[25px] flex items-center justify-center w-6 h-6 rounded-full bg-white ring-4 ring-white ${item.status === 'completed' ? 'text-emerald-500' :
                                        item.status === 'current' ? 'text-[#0B84D8]' : 'text-gray-300'
                                        }`}>
                                        {item.status === 'completed' ? <CheckCircle2 className="w-5 h-5 fill-emerald-50 stroke-emerald-500" /> :
                                            item.status === 'current' ? <Clock className="w-5 h-5 fill-[#E8F4FD]" /> :
                                                <div className="w-3 h-3 rounded-full bg-gray-200" />}
                                    </div>

                                    <div className="flex justify-between items-start pt-0.5">
                                        <div>
                                            <p className={`font-semibold mb-1 ${item.status === 'completed' ? 'text-emerald-700' :
                                                item.status === 'current' ? 'text-[#1a2b40]' : 'text-gray-400'
                                                }`}>
                                                {item.title}
                                            </p>
                                            {item.status === 'current' && (
                                                <span className="inline-block px-2.5 py-1 bg-[#0B84D8] text-white text-xs font-bold rounded-lg mb-2">
                                                    En cours
                                                </span>
                                            )}
                                        </div>
                                        <span className={`text-sm font-medium ${item.status === 'upcoming' ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {item.date}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Widgets (Right Column: takes 1/3) */}
                <div className="space-y-6">
                    {/* Deadlines Widget */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold text-[#1a2b40]">Échéances</h2>
                            <Link to="/mon-espace/echeances" className="text-sm font-semibold text-[#0B84D8] hover:text-[#0973BD]">Voir tout →</Link>
                        </div>
                        <div className="space-y-4">
                            {deadlines.map((deadline) => {
                                const styles = DEADLINE_STYLES[deadline.colorClass] ?? DEADLINE_STYLES.amber;
                                return (
                                    <div key={deadline.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${styles.dot}`} />
                                            <div>
                                                <p className="font-semibold text-sm text-[#1a2b40] mb-0.5">{deadline.title}</p>
                                                <p className="text-xs text-gray-500 font-medium">{deadline.date}</p>
                                            </div>
                                        </div>
                                        <div className={`px-2.5 py-1 rounded-lg text-xs font-bold ${styles.bg} ${styles.color}`}>
                                            J-{deadline.daysRemaining}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Advisor Widget */}
                    {conseiller && (
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-lg font-bold text-[#1a2b40]">Conseiller</h2>
                                <Link to="/mon-espace/messagerie" className="text-sm font-semibold text-[#0B84D8] hover:text-[#0973BD]">Écrire →</Link>
                            </div>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white text-lg shadow-sm" style={{ backgroundColor: '#0B84D8' }}>
                                    {conseiller.initiales}
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-[#1a2b40]">{conseiller.nom}</p>
                                    {conseiller.online && (
                                        <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 mt-0.5">
                                            <span className="relative flex w-2 h-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full w-2 h-2 bg-emerald-500"></span>
                                            </span>
                                            En ligne
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="bg-[#E8F4FD] rounded-2xl p-4 mb-4 relative">
                                <div className="absolute top-[-8px] left-6 w-4 h-4 bg-[#E8F4FD] transform rotate-45"></div>
                                <p className="text-sm text-[#333333] relative z-10 leading-relaxed">
                                    "{conseiller.dernierMessage}"
                                </p>
                                <p className="text-[10px] text-gray-500 mt-2 text-right">{conseiller.tempsMessage}</p>
                            </div>
                            <Link to="/mon-espace/messagerie" className="w-full py-3 bg-[#0B84D8] text-white font-bold rounded-xl transition-colors hover:bg-[#0973BD] text-center inline-block">
                                Répondre
                            </Link>
                        </div>
                    )}

                    {/* Statistics Widget */}
                    {statsWidget && (
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                            <h2 className="text-lg font-bold text-[#1a2b40] mb-6 flex items-center gap-2">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#0B84D8]"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                                Statistiques
                            </h2>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="bg-[#f3f0ff] rounded-2xl p-3 text-center">
                                    <p className="text-xl font-bold text-[#6D28D9]">{statsWidget.documents.fait}/{statsWidget.documents.total}</p>
                                    <p className="text-[10px] text-[#6D28D9] font-medium leading-tight mt-1">Documents</p>
                                </div>
                                <div className="bg-[#ecfdf5] rounded-2xl p-3 text-center">
                                    <p className="text-xl font-bold text-[#059669]">{statsWidget.messages}</p>
                                    <p className="text-[10px] text-[#059669] font-medium leading-tight mt-1">Messages</p>
                                </div>
                                <div className="bg-[#fffbeb] rounded-2xl p-3 text-center">
                                    <p className="text-xl font-bold text-[#D97706]">{statsWidget.joursRestants}</p>
                                    <p className="text-[10px] text-[#D97706] font-medium leading-tight mt-1">Jours restants</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
