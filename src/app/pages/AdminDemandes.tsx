import { useState, useEffect, useCallback } from 'react';
import { Search, RefreshCw, FolderOpen, Calendar, Mail, Plane, ChevronRight, X, CheckCircle, Clock, AlertCircle, Eye } from 'lucide-react';
import { apiFetch } from '../lib/api';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'motion/react';
import { notificationService } from '../lib/services/notificationService';

interface Demande {
    id: string;
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
    const [selectedDemande, setSelectedDemande] = useState<Demande | null>(null);
    const [updating, setUpdating] = useState(false);

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

        // Realtime Subscription
        if (supabase) {
            const channel = supabase
                .channel('admin_demandes_realtime')
                .on('postgres_changes', { 
                    event: '*', 
                    schema: 'public', 
                    table: 'demandes' 
                }, () => {
                    fetchDemandes(); // Simple refresh for now, could be optimized
                })
                .subscribe();

            return () => {
                if (supabase) {
                    supabase.removeChannel(channel);
                }
            };
        }
    }, [fetchDemandes]);

    const handleUpdateStatus = async (id: string, newStatus: string) => {
        setUpdating(true);
        try {
            await apiFetch(`/demandes?id=${id}`, {
                method: 'PATCH',
                body: JSON.stringify({ status: newStatus })
            });
            setSelectedDemande(null);
            fetchDemandes();
            toast.success(`Statut mis à jour : ${newStatus}`);
            
            // Notification courtoise pour l'utilisateur
            if (selectedDemande?.userId) {
                const statusLabels: Record<string, string> = {
                    'processing': 'en cours de traitement',
                    'completed': 'terminé avec succès',
                    'rejected': 'non retenu'
                };
                const label = statusLabels[newStatus] || newStatus;
                
                await notificationService.createNotification({
                    userId: selectedDemande.userId,
                    title: "Mise à jour de votre dossier",
                    message: `Votre demande pour le service ${selectedDemande.data?.service || ''} est désormais ${label}.`,
                    type: newStatus === 'completed' ? 'success' : newStatus === 'rejected' ? 'error' : 'info'
                });
            }
        } catch (err) {
            console.error('Update failed:', err);
            toast.error("Échec de la mise à jour du statut.");
        } finally {
            setUpdating(false);
        }
    };

    const openAttachments = (demande: Demande) => {
        const urls = demande.data?.fileUrls || [];
        if (urls.length === 0) {
            toast.error("Aucun document joint à cette demande.");
            return;
        }
        
        if (urls.length === 1) {
            window.open(urls[0], '_blank');
        } else {
            // Si plusieurs fichiers, on peut soit les ouvrir tous, soit afficher un sélecteur
            // Ici on ouvre le premier et on notifie
            window.open(urls[0], '_blank');
            toast.info(`${urls.length} fichiers détectés. Le premier a été ouvert.`);
        }
    };

    const filteredDemandes = demandes.filter(d => {
        const nom = d.data?.nom || d.data?.from || '';
        const email = d.data?.email || '';
        const matchesSearch = nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterType === 'all' || d.type === filterType;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Modal de Traitement */}
            <AnimatePresence>
                {selectedDemande && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-[32px] w-full max-w-lg overflow-hidden shadow-2xl"
                        >
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <div>
                                    <h3 className="text-xl font-black text-[#1a2b40]">Traiter la demande</h3>
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">ID: #{selectedDemande.id}</p>
                                </div>
                                <button onClick={() => setSelectedDemande(null)} className="p-2 hover:bg-white rounded-xl transition-all shadow-sm">
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>

                            <div className="p-8 space-y-6">
                                <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-lg font-bold text-[#1a2b40]">{selectedDemande.data?.nom || 'Client Anonyme'}</p>
                                            <p className="text-sm text-gray-600">{selectedDemande.data?.email}</p>
                                        </div>
                                        {selectedDemande.data?.fileUrls && selectedDemande.data.fileUrls.length > 0 && (
                                            <button 
                                                onClick={() => openAttachments(selectedDemande)}
                                                className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-xl text-xs font-bold hover:bg-purple-100 transition-all border border-purple-100"
                                            >
                                                <Eye className="w-4 h-4" /> Voir les {selectedDemande.data.fileUrls.length} fichier(s)
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Modifier le statut</p>
                                    <div className="grid grid-cols-1 gap-3">
                                        {[
                                            { label: 'En attente', val: 'pending', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
                                            { label: 'En cours', val: 'processing', icon: RefreshCw, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
                                            { label: 'Terminé', val: 'completed', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
                                            { label: 'Rejeté', val: 'rejected', icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100' }
                                        ].map((s) => (
                                            <button
                                                key={s.val}
                                                disabled={updating}
                                                onClick={() => handleUpdateStatus(selectedDemande.id, s.val)}
                                                className={`flex items-center justify-between p-4 rounded-2xl border transition-all hover:scale-[1.02] active:scale-95 ${selectedDemande.status === s.val ? `${s.bg} ${s.border}` : 'bg-gray-50 border-transparent hover:border-gray-200'}`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`p-2 rounded-xl bg-white shadow-sm ${s.color}`}>
                                                        <s.icon className="w-5 h-5" />
                                                    </div>
                                                    <span className={`font-bold ${selectedDemande.status === s.val ? s.color : 'text-gray-600'}`}>{s.label}</span>
                                                </div>
                                                {selectedDemande.status === s.val && <div className={`w-2 h-2 rounded-full ${s.color.replace('text', 'bg')}`} />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-[#1a2b40] tracking-tight">Gestion des Dossiers</h1>
                    <p className="text-sm text-gray-500 font-medium">Flux d'accompagnement et billetterie en temps réel</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={fetchDemandes}
                        className="group flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-gray-600 hover:text-[#0B84D8] hover:border-[#0B84D8] transition-all shadow-sm"
                    >
                        <RefreshCw className={`w-4 h-4 transition-transform duration-700 ${loading ? 'animate-spin' : 'group-hover:rotate-180'}`} />
                        Actualiser
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-[32px] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Rechercher par nom ou email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-6 py-3.5 bg-gray-50/50 border border-transparent rounded-2xl text-sm font-medium focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                    />
                </div>
                <div className="flex gap-2">
                    <select 
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="px-6 py-3.5 bg-gray-50/50 border border-transparent rounded-2xl text-sm font-bold text-[#1a2b40] focus:ring-4 focus:ring-blue-50 outline-none cursor-pointer"
                    >
                        <option value="all">Tous les types</option>
                        <option value="billetterie">Billetterie</option>
                        <option value="accompagnement">Accompagnement</option>
                    </select>
                </div>
            </div>

            {/* Content Table */}
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-black text-gray-400 border-b border-gray-50 uppercase tracking-[0.15em]">
                                <th className="px-8 py-6">Type & Date</th>
                                <th className="px-8 py-6">Client</th>
                                <th className="px-8 py-6">Détails Projet / Vol</th>
                                <th className="px-8 py-6">Statut</th>
                                <th className="px-8 py-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredDemandes.map((d) => (
                                <tr key={d.id} className="group hover:bg-gray-50/50 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm ${d.type === 'billetterie' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                                                {d.type === 'billetterie' ? <Plane className="w-6 h-6" /> : <FolderOpen className="w-6 h-6" />}
                                            </div>
                                            <div>
                                                <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${d.type === 'billetterie' ? 'text-[#0B84D8]' : 'text-purple-600'}`}>
                                                    {d.type}
                                                </p>
                                                <div className="flex items-center gap-1.5 text-gray-400 text-[11px] font-bold">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    {new Date(d.createdAt).toLocaleDateString('fr-FR')}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-sm font-black text-[#1a2b40] mb-1">{d.data?.nom || (d.data?.from ? 'Vol : ' + d.data.from : 'Anonyme')}</p>
                                        <div className="flex items-center gap-4">
                                            {d.data?.email && <span className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold"><Mail className="w-3 h-3"/> {d.data.email}</span>}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-wrap gap-2">
                                            {d.type === 'billetterie' ? (
                                                <div className="inline-flex items-center gap-2 bg-blue-50/50 px-3 py-1.5 rounded-xl border border-blue-100 text-[11px] font-bold text-blue-700">
                                                    <span>{d.data?.from}</span>
                                                    <Plane className="w-3 h-3 rotate-90" />
                                                    <span>{d.data?.to}</span>
                                                </div>
                                            ) : (
                                                <span className="bg-purple-50/50 px-3 py-1.5 rounded-xl border border-purple-100 text-[11px] font-bold text-purple-700 uppercase">
                                                    {d.data?.service || 'Accompagnement'}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border ${
                                            d.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                            d.status === 'processing' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                            d.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                            'bg-red-50 text-red-600 border-red-100'
                                        }`}>
                                            {d.status === 'pending' ? 'Attente' : d.status === 'processing' ? 'En cours' : d.status === 'completed' ? 'Terminé' : 'Rejeté'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button 
                                            onClick={() => setSelectedDemande(d)}
                                            className="p-3 bg-gray-50 text-gray-400 hover:text-[#0B84D8] hover:bg-blue-50 hover:shadow-md rounded-2xl transition-all"
                                        >
                                            <ChevronRight className="w-6 h-6" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
