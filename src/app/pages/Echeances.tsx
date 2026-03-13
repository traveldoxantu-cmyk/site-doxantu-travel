import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, AlertCircle, CheckCircle2, ChevronRight, Info } from 'lucide-react';
import { echeancesService, type Echeance } from '../lib/services/echeancesService';

export function Echeances() {
    const [deadlines, setDeadlines] = useState<Echeance[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        echeancesService.getEcheances()
            .then(setDeadlines)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const urgentCount  = deadlines.filter(d => d.status === 'urgent').length;
    const upcomingCount = deadlines.filter(d => d.status === 'upcoming').length;
    const firstUrgent  = deadlines.find(d => d.status === 'urgent');

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto space-y-8 pb-24 animate-pulse">
                <div className="h-10 bg-gray-200 rounded-2xl w-1/2" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1,2,3].map(i => <div key={i} className="bg-gray-200 rounded-3xl h-28" />)}
                </div>
                <div className="space-y-4">
                    {[1,2,3].map(i => <div key={i} className="bg-gray-200 rounded-3xl h-32" />)}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-24">
            {/* Header section */}
            <div>
                <h1 className="text-3xl font-bold text-[#1a2b40] mb-2">Calendrier des échéances</h1>
                <p className="text-gray-500 font-medium">Suivez vos dates clés et ne manquez aucune étape importante de votre projet.</p>
            </div>

            {/* Quick Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center mb-4">
                        <AlertCircle className="w-5 h-5" />
                    </div>
                    <p className="text-2xl font-black text-[#1a2b40]">{urgentCount}</p>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mt-1">Échéance{urgentCount > 1 ? 's' : ''} urgente{urgentCount > 1 ? 's' : ''}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0B84D8] flex items-center justify-center mb-4">
                        <Calendar className="w-5 h-5" />
                    </div>
                    <p className="text-2xl font-black text-[#1a2b40]">{upcomingCount}</p>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mt-1">À venir ce mois-ci</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center mb-4">
                        <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <p className="text-2xl font-black text-[#1a2b40]">8</p>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mt-1">Étapes validées</p>
                </div>
            </div>

            {/* Notice — shown only if there is an urgent deadline */}
            {firstUrgent && (
                <div className="bg-[#1a2b40] rounded-3xl p-6 text-white flex gap-6 items-center shadow-lg relative overflow-hidden">
                    <div className="absolute right-[-20px] top-[-20px] w-32 h-32 bg-white/5 rounded-full blur-2xl" />
                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
                        <Info className="w-7 h-7 text-blue-300" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-1">Rappel : {firstUrgent.title}</h3>
                        <p className="text-blue-100/80 text-sm leading-relaxed">
                            Cet événement est l'étape la plus cruciale. Assurez-vous d'être prêt pour le <span className="text-white font-bold">{firstUrgent.date}</span>.
                        </p>
                    </div>
                    <button className="ml-auto bg-[#0B84D8] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#0973BD] transition-all shadow-md shrink-0">
                        S'y préparer
                    </button>
                </div>
            )}

            {/* Timeline */}
            <div className="space-y-6">
                <h2 className="text-xl font-bold text-[#1a2b40] flex items-center gap-3">
                    <Clock className="w-5 h-5 text-[#0B84D8]" />
                    Planning détaillé
                </h2>

                <div className="space-y-4">
                    {deadlines.map((item, i) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={`group relative bg-white rounded-3xl p-6 border transition-all hover:shadow-xl hover:-translate-y-1 ${
                                item.status === 'urgent' ? 'border-red-100 ring-2 ring-red-500/5' : 'border-gray-100'
                            }`}
                        >
                            <div className="flex flex-col md:flex-row md:items-start gap-6">
                                {/* Date Column */}
                                <div className="md:w-32 flex flex-col items-center md:items-start shrink-0">
                                    <span className={`text-[11px] font-black uppercase tracking-widest mb-1 ${
                                        item.status === 'urgent' ? 'text-red-500' : 'text-[#0B84D8]'
                                    }`}>
                                        {item.status === 'urgent' ? '⚠️ Urgent' : 'Calendrier'}
                                    </span>
                                    <span className="text-2xl font-black text-[#1a2b40] leading-tight text-center md:text-left">
                                        {item.date.split(' ')[0]} {item.date.split(' ')[1]}
                                    </span>
                                    <span className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-wider">{item.date.split(' ')[2]}</span>
                                </div>

                                {/* Content Column */}
                                <div className="flex-1 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-lg font-bold text-[#1a2b40] group-hover:text-[#0B84D8] transition-colors">
                                            {item.title}
                                        </h3>
                                        <div className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider ${
                                            item.status === 'urgent' ? 'bg-red-50 text-red-600' :
                                            item.status === 'upcoming' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-[#0B84D8]'
                                        }`}>
                                            J-{item.daysRemaining}
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-500 leading-relaxed font-medium">{item.description}</p>

                                    <div className="flex flex-wrap gap-4 pt-3 border-t border-gray-50">
                                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wide">
                                            <Clock className="w-3.5 h-3.5" />
                                            Heure : <span className="text-[#1a2b40]">{item.time}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wide">
                                            <Calendar className="w-3.5 h-3.5" />
                                            Lieu : <span className="text-[#1a2b40]">{item.location}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Action button */}
                                <div className="flex items-center shrink-0">
                                    <button className="w-12 h-12 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center transition-all group-hover:bg-[#0B84D8] group-hover:text-white shadow-sm ring-1 ring-gray-200 group-hover:ring-[#0B84D8]/30">
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
