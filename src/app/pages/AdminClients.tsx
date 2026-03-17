import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Plus, Eye, MessageSquare, GraduationCap, Briefcase, AlertCircle, X, UserPlus, Mail, Phone, MapPin, Loader2 } from 'lucide-react';
import { apiFetch } from '../lib/api';
import { supabase } from '../lib/supabase';

interface User {
    id: string | number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: string;
    initiales: string;
}

interface Client extends User {
    nom: string;
    type: string;
    telephone: string;
    dossierId: string;
    destination: string;
    formation: string;
    statut: string;
    conseillerNom: string | null;
    conseillerInitiales: string;
    conseillerCouleur: string;
    etapesFaites: number;
    etapesTotal: number;
    avancement: number;
    urgent: boolean;
}

const STATUT_STYLE: Record<string, { label: string; border: string; text: string; bg: string }> = {
    'Entretien': { label: 'Entretien', border: 'border-amber-300', text: 'text-amber-700', bg: 'bg-amber-50' },
    'En cours':  { label: 'En cours',  border: 'border-purple-300', text: 'text-purple-700', bg: 'bg-purple-50' },
    'Visa':      { label: 'Visa',      border: 'border-orange-300', text: 'text-orange-700', bg: 'bg-orange-50' },
    'Nouveau':   { label: 'Nouveau',   border: 'border-cyan-300',   text: 'text-cyan-700',   bg: 'bg-cyan-50' },
    'Validé':    { label: 'Validé ✅', border: 'border-emerald-300',text: 'text-emerald-700',bg: 'bg-emerald-50' },
    'Archivé':   { label: 'Archivé',   border: 'border-gray-200',   text: 'text-gray-500',   bg: 'bg-gray-50' },
    'Rejeté':    { label: 'Rejeté',    border: 'border-red-300',    text: 'text-red-700',    bg: 'bg-red-50' },
};

const FILTERS = ['Tous', 'Nouveau', 'En cours', 'Entretien', 'Visa', 'Validé', 'Rejeté', 'Archivé'];

export function AdminClients() {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [activeFilter, setActiveFilter] = useState('Tous');
    const [clientType, setClientType] = useState('Tous types');
    const [selectedConseiller, setSelectedConseiller] = useState('Tous conseillers');
    const [sortBy, setSortBy] = useState('Trier par date');
    
    // Create Modal state
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [newClient, setNewClient] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        destination: '',
        type: 'étudiant'
    });

    const fetchClients = useCallback(async () => {
        setLoading(true);
        try {
            const data = await apiFetch<any[]>('/users');
            const clientsOnly = data
                .filter(u => u.role === 'client')
                .map(u => ({
                    ...u,
                    id: String(u.id),
                    nom: `${u.firstName} ${u.lastName}`,
                    type: u.clientType || 'étudiant',
                    telephone: u.phone,
                    dossierId: u.id ? `DXT-2026-${u.id}` : 'DXT-NEW',
                    destination: u.destination || 'À définir',
                    formation: u.formation || 'En attente',
                    statut: u.statut || 'Nouveau',
                    conseillerNom: u.conseillerNom || null,
                    conseillerInitiales: u.conseillerNom ? u.conseillerNom.split(' ').map((n: string) => n[0]).join('') : '?',
                    conseillerCouleur: '#94a3b8',
                    etapesFaites: u.etapesFaites || 0,
                    etapesTotal: 5,
                    avancement: u.avancement || 0,
                    urgent: u.urgent || false
                }));
            setClients(clientsOnly);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchClients();

        if (supabase) {
            const channel = supabase
                .channel('admin_clients_realtime')
                .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, () => {
                    fetchClients();
                })
                .subscribe();
            return () => { 
                if (supabase) {
                    supabase.removeChannel(channel); 
                }
            };
        }
    }, [fetchClients]);

    const handleCreateClient = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreating(true);
        try {
            const payload = {
                ...newClient,
                role: 'client',
                initiales: `${newClient.firstName[0]}${newClient.lastName[0]}`.toUpperCase(),
                createdAt: new Date().toISOString()
            };
            await apiFetch('/users', {
                method: 'POST',
                body: JSON.stringify(payload)
            });
            setIsCreateModalOpen(false);
            setNewClient({ firstName: '', lastName: '', email: '', phone: '', destination: '', type: 'étudiant' });
            fetchClients();
        } catch (err) {
            console.error('Create error:', err);
            alert('Erreur lors de la création du dossier');
        } finally {
            setIsCreating(false);
        }
    };

    const filtered = clients.filter(c => {
        const q = search.toLowerCase();
        const matchSearch = !q || c.nom.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.dossierId.toLowerCase().includes(q) || c.destination.toLowerCase().includes(q);
        const matchStatus = activeFilter === 'Tous' || c.statut === activeFilter;
        const matchType = clientType === 'Tous types' || c.type === clientType.toLowerCase();
        const matchConseiller = selectedConseiller === 'Tous conseillers' || c.conseillerNom === selectedConseiller;
        
        return matchSearch && matchStatus && matchType && matchConseiller;
    }).sort((a, b) => {
        if (sortBy === 'Plus récents') return Number(b.id) - Number(a.id);
        if (sortBy === 'Plus anciens') return Number(a.id) - Number(b.id);
        if (sortBy === 'Avancement') return b.avancement - a.avancement;
        return 0;
    });

    const urgentCount = clients.filter(c => c.urgent).length;
    const nonAssignesCount = clients.filter(c => !c.conseillerNom).length;
    const validesCount = clients.filter(c => c.statut === 'Validé').length;

    if (loading && clients.length === 0) {
        return (
            <div className="space-y-4 animate-pulse">
                <div className="h-10 bg-gray-200 rounded-xl w-48" />
                <div className="h-48 bg-gray-200 rounded-2xl" />
            </div>
        );
    }

    return (
        <div className="space-y-5 pb-8 max-w-7xl mx-auto">
            {/* Create Client Modal */}
            <AnimatePresence>
                {isCreateModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-[40px] w-full max-w-2xl overflow-hidden shadow-2xl"
                        >
                            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-[#0B84D8] text-white flex items-center justify-center shadow-lg shadow-[#0B84D8]/20">
                                        <UserPlus className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-[#1a2b40]">Nouveau Dossier</h3>
                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-0.5">Création manuelle d'un client</p>
                                    </div>
                                </div>
                                <button onClick={() => setIsCreateModalOpen(false)} className="p-2.5 hover:bg-white rounded-2xl transition-all shadow-sm group">
                                    <X className="w-6 h-6 text-gray-400 group-hover:text-red-500 transition-colors" />
                                </button>
                            </div>

                            <form onSubmit={handleCreateClient} className="p-10 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Prénom</label>
                                        <div className="relative">
                                            <input required type="text" value={newClient.firstName} onChange={e => setNewClient({...newClient, firstName: e.target.value})} className="w-full pl-5 pr-5 py-4 bg-gray-50/50 border border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:ring-4 focus:ring-blue-50 outline-none transition-all" placeholder="Ex: Baye Karim" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nom</label>
                                        <div className="relative">
                                            <input required type="text" value={newClient.lastName} onChange={e => setNewClient({...newClient, lastName: e.target.value})} className="w-full pl-5 pr-5 py-4 bg-gray-50/50 border border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:ring-4 focus:ring-blue-50 outline-none transition-all" placeholder="Ex: NDIAYE" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email professionnel</label>
                                        <div className="relative flex items-center">
                                            <Mail className="absolute left-5 w-4 h-4 text-gray-400" />
                                            <input required type="email" value={newClient.email} onChange={e => setNewClient({...newClient, email: e.target.value})} className="w-full pl-12 pr-5 py-4 bg-gray-50/50 border border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:ring-4 focus:ring-blue-50 outline-none transition-all" placeholder="client@exemple.com" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Téléphone</label>
                                        <div className="relative flex items-center">
                                            <Phone className="absolute left-5 w-4 h-4 text-gray-400" />
                                            <input type="tel" value={newClient.phone} onChange={e => setNewClient({...newClient, phone: e.target.value})} className="w-full pl-12 pr-5 py-4 bg-gray-50/50 border border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:ring-4 focus:ring-blue-50 outline-none transition-all" placeholder="+221 ..." />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Destination</label>
                                        <div className="relative flex items-center">
                                            <MapPin className="absolute left-5 w-4 h-4 text-gray-400" />
                                            <input type="text" value={newClient.destination} onChange={e => setNewClient({...newClient, destination: e.target.value})} className="w-full pl-12 pr-5 py-4 bg-gray-50/50 border border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:ring-4 focus:ring-blue-50 outline-none transition-all" placeholder="Ex: Paris, France" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Type de client</label>
                                        <select value={newClient.type} onChange={e => setNewClient({...newClient, type: e.target.value})} className="w-full px-5 py-4 bg-gray-50/50 border border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:ring-4 focus:ring-blue-50 outline-none transition-all appearance-none cursor-pointer">
                                            <option value="étudiant">Étudiant</option>
                                            <option value="voyageur">Particulier / Voyageur</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4 border-t border-gray-100">
                                    <button type="button" onClick={() => setIsCreateModalOpen(false)} className="flex-1 px-8 py-4 bg-gray-50 text-gray-500 font-bold rounded-2xl hover:bg-gray-100 transition-all font-sans">
                                        Annuler
                                    </button>
                                    <button disabled={isCreating} type="submit" className="flex-2 px-8 py-4 bg-[#0B84D8] text-white font-bold rounded-2xl hover:bg-[#0973BD] shadow-lg shadow-[#0B84D8]/30 transition-all flex items-center justify-center gap-3 min-w-[200px] font-sans">
                                        {isCreating ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserPlus className="w-5 h-5" />}
                                        {isCreating ? 'Création...' : 'Créer le dossier'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ── Header ─────────────────────────────────────────────────── */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-black text-[#1a2b40] tracking-tight">Gestion des Clients</h1>
                    <p className="text-sm text-gray-400 font-medium mt-0.5">{filtered.length} dossiers actifs sur la plateforme</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-3 px-6 py-3.5 bg-[#0B84D8] text-white text-sm font-black rounded-2xl hover:bg-[#0973BD] transition-all shadow-xl shadow-[#0B84D8]/20"
                    >
                        <Plus className="w-5 h-5" /> Nouveau dossier
                    </button>
                </div>
            </div>

            {/* ── Mini KPIs ──────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { value: clients.length, label: 'Total', color: 'text-[#0B84D8]' },
                    { value: urgentCount, label: 'Urgents', color: 'text-red-500' },
                    { value: nonAssignesCount, label: 'Non assignés', color: 'text-amber-500' },
                    { value: validesCount, label: 'Validés', color: 'text-emerald-600' },
                ].map((k, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 text-center">
                        <p className={`text-2xl font-black ${k.color}`}>{k.value}</p>
                        <p className="text-xs text-gray-400 font-medium mt-0.5">{k.label}</p>
                    </div>
                ))}
            </div>

            {/* ── Search + Filters ───────────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Rechercher par nom, numéro, email..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0B84D8] focus:ring-2 focus:ring-[#0B84D8]/10 transition-all"
                    />
                </div>

                {/* Filter pills + dropdowns */}
                <div className="flex flex-col gap-4">
                    <div className="flex gap-1.5 flex-wrap">
                        {FILTERS.map(f => (
                            <button key={f} onClick={() => setActiveFilter(f)}
                                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all border shrink-0 ${
                                    activeFilter === f
                                        ? 'bg-[#1a2b40] text-white border-[#1a2b40]'
                                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                                }`}>
                                {f === 'Validé' ? 'Validé ✅' : f}
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                        <select 
                            value={clientType}
                            onChange={(e) => setClientType(e.target.value)}
                            className="flex-1 sm:flex-none text-xs sm:text-sm text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none cursor-pointer hover:border-[#0B84D8]/30 transition-colors"
                        >
                            <option>Tous types</option>
                            <option value="étudiant">Étudiants</option>
                            <option value="voyageur">Particuliers</option>
                        </select>
                        <select 
                            value={selectedConseiller}
                            onChange={(e) => setSelectedConseiller(e.target.value)}
                            className="flex-1 sm:flex-none text-xs sm:text-sm text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none cursor-pointer hover:border-[#0B84D8]/30 transition-colors"
                        >
                            <option>Tous conseillers</option>
                            <option>Fatou Mbaye</option>
                            <option>Ibrahima Fall</option>
                            <option>Omar Ba</option>
                        </select>
                        <select 
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="flex-1 sm:flex-none text-xs sm:text-sm text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none cursor-pointer hover:border-[#0B84D8]/30 transition-colors"
                        >
                            <option>Trier par date</option>
                            <option>Plus récents</option>
                            <option>Plus anciens</option>
                            <option>Avancement</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* ── Table ─────────────────────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
                <div className="min-w-[900px]">
                {/* Table header */}
                <div className="grid grid-cols-[2fr_1.5fr_1fr_1.5fr_2fr_80px] gap-4 px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wide border-b border-gray-50">
                    <span>CLIENT</span>
                    <span>DESTINATION</span>
                    <span>STATUT</span>
                    <span>CONSEILLER</span>
                    <span>DOCUMENTS / RÉGLEMENTATION</span>
                    <span className="text-right">ACTIONS</span>
                </div>

                {/* Rows */}
                {filtered.length === 0 ? (
                    <div className="py-16 text-center">
                        <Search className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                        <p className="text-gray-400 font-medium">Aucun dossier trouvé</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {filtered.map((c, idx) => {
                            const s = STATUT_STYLE[c.statut] ?? STATUT_STYLE['En cours'];
                            return (
                                <motion.div key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.03 }}
                                    className="grid grid-cols-[2fr_1.5fr_1fr_1.5fr_2fr_80px] gap-4 px-5 py-4 items-center hover:bg-gray-50/60 transition-colors">

                                    {/* Client */}
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="relative shrink-0">
                                            <div className="w-10 h-10 rounded-full bg-[#0B84D8] flex items-center justify-center text-white text-sm font-bold">
                                                {c.initiales}
                                            </div>
                                            {c.urgent && (
                                                <span className="absolute -top-0.5 -left-0.5 w-3 h-3 rounded-full bg-red-500 border-2 border-white" />
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-bold text-[#1a2b40] text-sm truncate">{c.nom}</p>
                                            <p className="text-xs text-gray-400 font-mono">{c.dossierId}</p>
                                            <span className="flex items-center gap-1 text-[11px] text-gray-400">
                                                {c.type === 'étudiant'
                                                    ? <GraduationCap className="w-3 h-3" />
                                                    : <Briefcase className="w-3 h-3" />}
                                                {c.type}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Destination */}
                                    <div>
                                        <p className="text-sm font-semibold text-[#1a2b40]">{c.destination}</p>
                                        <p className="text-xs text-gray-400 truncate">{c.formation}</p>
                                    </div>

                                    {/* Statut badge */}
                                    <div>
                                        <span className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full border ${s.border} ${s.text} ${s.bg}`}>
                                            {s.label}
                                        </span>
                                    </div>

                                    {/* Conseiller */}
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0"
                                            style={{ backgroundColor: c.conseillerCouleur }}>
                                            {c.conseillerInitiales}
                                        </div>
                                        {c.conseillerNom ? (
                                            <span className="text-sm text-gray-700 font-medium truncate">{c.conseillerNom}</span>
                                        ) : (
                                            <span className="text-xs font-semibold text-amber-600 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" /> Non assigné
                                            </span>
                                        )}
                                    </div>

                                    {/* Double progress bars */}
                                    <div className="space-y-2">
                                        {/* Étapes (purple) */}
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-gray-500 font-semibold w-8 shrink-0">{c.etapesFaites}/{c.etapesTotal}</span>
                                            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div className="h-full rounded-full" style={{ width: `${(c.etapesFaites / c.etapesTotal) * 100}%`, backgroundColor: '#8B5CF6' }} />
                                            </div>
                                        </div>
                                        {/* Avancement global (blue) */}
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-gray-500 font-semibold w-8 shrink-0">{c.avancement}%</span>
                                            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div className="h-full rounded-full" style={{ width: `${c.avancement}%`, backgroundColor: c.avancement === 100 ? '#10B981' : '#0B84D8' }} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center justify-end gap-2">
                                        <button className="p-1.5 text-gray-400 hover:text-[#0B84D8] hover:bg-blue-50 rounded-lg transition-colors">
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                                            <MessageSquare className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
                </div>
            </div>
        </div>
    );
}
