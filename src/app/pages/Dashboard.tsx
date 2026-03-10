import { motion } from 'motion/react';
import { FolderOpen, FileText, MessageSquare, Calendar as CalendarIcon, Clock, CheckCircle2, ChevronRight } from 'lucide-react';

export function Dashboard() {
    const quickStats = [
        { icon: FolderOpen, label: 'Mon Dossier', value: 'Étape 3/6', color: 'text-[#0B84D8]', bg: 'bg-[#E8F4FD]' },
        { icon: FileText, label: 'Documents', value: '4 fichiers', color: 'text-purple-600', bg: 'bg-purple-50' },
        { icon: MessageSquare, label: 'Messagerie', value: '2 non lus', color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { icon: CalendarIcon, label: 'Échéances', value: '3 à venir', color: 'text-amber-600', bg: 'bg-amber-50' },
    ];

    const timeline = [
        { title: 'Soumission du dossier', date: '10 jan. 2026', status: 'completed' },
        { title: 'Vérification des documents', date: '18 jan. 2026', status: 'completed' },
        { title: 'Entretien pédagogique', date: '7 mars 2026', status: 'current' },
        { title: 'Demande de visa', date: 'Prévu avril 2026', status: 'upcoming' },
        { title: "Confirmation d'inscription", date: 'Prévu mai 2026', status: 'upcoming' },
    ];

    const deadlines = [
        { title: 'Rendez-vous Campus France', date: '7 mars 2026', daysRemaining: 5, color: 'text-red-500', bg: 'bg-red-50' },
        { title: 'Paiement frais de dossier', date: '30 mars 2026', daysRemaining: 28, color: 'text-amber-500', bg: 'bg-amber-50' },
        { title: 'Rendez-vous visa', date: '3 avr. 2026', daysRemaining: 32, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    ];

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
                        <h1 className="text-3xl font-bold mb-2">Bonsoir, Amadou</h1>
                        <p className="text-blue-100 font-medium mb-1">Dossier <span className="text-white font-bold">DXT-2026-0142</span> — Paris, France</p>
                        <p className="text-blue-200 text-sm">Master en Intelligence Artificielle – Université Paris-Saclay</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 min-w-[200px]">
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {quickStats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${stat.bg} ${stat.color}`}>
                            <stat.icon className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-[#1a2b40] mb-1">{stat.label}</h3>
                        <p className="text-sm text-gray-500 font-medium">{stat.value}</p>
                    </motion.div>
                ))}
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
                            <button className="text-sm font-semibold text-[#0B84D8] hover:text-[#0973BD] flex items-center gap-1">
                                Détails <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="relative pl-4 border-l-2 border-gray-100 space-y-8">
                            {timeline.map((item, i) => (
                                <div key={i} className="relative">
                                    {/* Timeline Node */}
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
                                        <span className={`text-sm font-medium ${item.status === 'upcoming' ? 'text-gray-400' : 'text-gray-500'
                                            }`}>
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
                            <button className="text-sm font-semibold text-[#0B84D8] hover:text-[#0973BD]">Voir tout →</button>
                        </div>
                        <div className="space-y-4">
                            {deadlines.map((deadline, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${deadline.color.replace('text-', 'bg-')}`} />
                                        <div>
                                            <p className="font-semibold text-sm text-[#1a2b40] mb-0.5">{deadline.title}</p>
                                            <p className="text-xs text-gray-500 font-medium">{deadline.date}</p>
                                        </div>
                                    </div>
                                    <div className={`px-2.5 py-1 rounded-lg text-xs font-bold ${deadline.bg} ${deadline.color}`}>
                                        J-{deadline.daysRemaining}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Advisor Widget */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                        <div className="flex justify-between items-start mb-6">
                            <h2 className="text-lg font-bold text-[#1a2b40]">Conseiller</h2>
                            <button className="text-sm font-semibold text-[#0B84D8] hover:text-[#0973BD]">Écrire →</button>
                        </div>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white text-lg shadow-sm" style={{ backgroundColor: '#0B84D8' }}>
                                FM
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-[#1a2b40]">Fatou Mbaye</p>
                                <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 mt-0.5">
                                    <span className="relative flex w-2 h-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full w-2 h-2 bg-emerald-500"></span>
                                    </span>
                                    En ligne
                                </div>
                            </div>
                        </div>
                        <div className="bg-[#E8F4FD] rounded-2xl p-4 mb-4 relative">
                            <div className="absolute top-[-8px] left-6 w-4 h-4 bg-[#E8F4FD] transform rotate-45"></div>
                            <p className="text-sm text-[#333333] relative z-10 leading-relaxed">
                                "Votre dossier avance très bien ! N'oubliez pas votre rendez-vous Campus France le 7 mars. Avez-vous des questions ?"
                            </p>
                            <p className="text-[10px] text-gray-500 mt-2 text-right">Il y a 3 heures</p>
                        </div>
                        <button className="w-full py-3 bg-[#0B84D8] text-white font-bold rounded-xl transition-colors hover:bg-[#0973BD]">
                            Répondre
                        </button>
                    </div>

                    {/* Statistics Widget */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                        <h2 className="text-lg font-bold text-[#1a2b40] mb-6 flex items-center gap-2">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#0B84D8]"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                            Statistiques
                        </h2>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="bg-[#f3f0ff] rounded-2xl p-3 text-center">
                                <p className="text-xl font-bold text-[#6D28D9]">4/7</p>
                                <p className="text-[10px] text-[#6D28D9] font-medium leading-tight mt-1">Documents</p>
                            </div>
                            <div className="bg-[#ecfdf5] rounded-2xl p-3 text-center">
                                <p className="text-xl font-bold text-[#059669]">12</p>
                                <p className="text-[10px] text-[#059669] font-medium leading-tight mt-1">Messages</p>
                            </div>
                            <div className="bg-[#fffbeb] rounded-2xl p-3 text-center">
                                <p className="text-xl font-bold text-[#D97706]">198</p>
                                <p className="text-[10px] text-[#D97706] font-medium leading-tight mt-1">Jours restants</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
