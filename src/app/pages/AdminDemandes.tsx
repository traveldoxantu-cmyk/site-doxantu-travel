import { useState, useEffect, useCallback } from 'react';
import { Search, RefreshCw, FolderOpen, Calendar, Mail, Phone, Plane, ChevronRight } from 'lucide-react';
import { apiFetch } from '../lib/api';

interface Demande {
    id: number;
    type: 'billetterie' | 'accompagnement';
    data: any;
    status: string;
    createdAt: string;
    userId: string | null;
}

export function AdminDemandes() {
    const [demandes, setDemandes] = useState<Demande[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');

    const fetchDemandes = useCallback(async () => {
        setLoading(true);
        try {
            const data = await apiFetch<Demande[]>('/demandes?_sort=createdAt&_order=desc');
            setDemandes(data);
        } catch (err) {
            console.error('Erreur lors du chargement des demandes:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDemandes();
    }, [fetchDemandes]);

    const filteredDemandes = demandes.filter(d => {
        const matchesSearch = (d.data.nom || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (d.data.email || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterType === 'all' || d.type === filterType;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-[#1a2b40]">Flux des demandes réelles</h1>
                    <p className="text-sm text-gray-500">Suivi en temps réel des soumissions Billetterie & Devis</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={fetchDemandes}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-xl text-sm font-bold text-gray-600 hover:text-[#0B84D8] hover:border-[#0B84D8] transition-all"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Actualiser
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Rechercher par nom ou email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                </div>
                <div className="flex gap-2">
                    <select 
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="px-4 py-2.5 bg-gray-50 border border-transparent rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-100"
                    >
                        <option value="all">Tous types</option>
                        <option value="billetterie">Billetterie</option>
                        <option value="accompagnement">Accompagnement</option>
                    </select>
                </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50">
                                <th className="px-6 py-4">Type & Date</th>
                                <th className="px-6 py-4">Client</th>
                                <th className="px-6 py-4">Détails Projet / Vol</th>
                                <th className="px-6 py-4">Statut</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredDemandes.map((d) => (
                                <tr key={d.id} className="group hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${d.type === 'billetterie' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                                                {d.type === 'billetterie' ? <Plane className="w-5 h-5 shadow-sm" /> : <FolderOpen className="w-5 h-5 shadow-sm" />}
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-extrabold uppercase tracking-wider mb-0.5" style={{ color: d.type === 'billetterie' ? '#0B84D8' : '#8b5cf6' }}>
                                                    {d.type}
                                                </p>
                                                <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-medium">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(d.createdAt).toLocaleString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <p className="text-sm font-bold text-[#1a2b40] mb-0.5">{d.data.nom || (d.data.from ? 'Vol : ' + d.data.from : 'Anonyme')}</p>
                                        <div className="flex items-center gap-3">
                                            {d.data.email && <span className="flex items-center gap-1 text-[10px] text-gray-400 italic"><Mail className="w-3 h-3"/> {d.data.email}</span>}
                                            {d.data.tel && <span className="flex items-center gap-1 text-[10px] text-gray-400"><Phone className="w-3 h-3"/> {d.data.tel}</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="text-xs text-gray-600 flex flex-wrap gap-2">
                                            {d.type === 'billetterie' ? (
                                                <>
                                                    <span className="bg-blue-50/50 px-2 py-1 rounded-lg border border-blue-100/50"><b>De :</b> {d.data.from}</span>
                                                    <span className="bg-blue-50/50 px-2 py-1 rounded-lg border border-blue-100/50"><b>À :</b> {d.data.to}</span>
                                                    <span className="bg-gray-50 px-2 py-1 rounded-lg border border-gray-100"><b>Départ :</b> {d.data.departDate}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="bg-purple-50/50 px-2 py-1 rounded-lg border border-purple-100/50 uppercase font-bold text-[10px]">{d.data.service}</span>
                                                    <span className="bg-purple-50/50 px-2 py-1 rounded-lg border border-purple-100/50"><b>Destination :</b> {d.data.destination}</span>
                                                    {d.data.niveauEtude && <span className="bg-gray-50 px-2 py-1 rounded-lg border border-gray-100"><b>Niveau :</b> {d.data.niveauEtude}</span>}
                                                </>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-wider border border-emerald-100">
                                            {d.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <button className="p-2 text-gray-400 hover:text-[#0B84D8] hover:bg-blue-50 rounded-xl transition-all">
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredDemandes.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center">
                                        <div className="flex flex-col items-center">
                                            <div className="w-16 h-16 rounded-3xl bg-gray-50 flex items-center justify-center text-gray-300 mb-4">
                                                <Search className="w-8 h-8" />
                                            </div>
                                            <p className="text-gray-400 font-medium">Aucune demande trouvée</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
