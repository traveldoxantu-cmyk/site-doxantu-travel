import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Download, Plus, Eye, MessageSquare, GraduationCap, Briefcase, AlertCircle } from 'lucide-react';
import { apiFetch } from '../lib/api';

interface Client {
    id: number; nom: string; initiales: string; type: string;
    email: string; telephone: string; dossierId: string;
    destination: string; formation: string; statut: string;
    conseillerNom: string | null; conseillerInitiales: string; conseillerCouleur: string;
    etapesFaites: number; etapesTotal: number; avancement: number; urgent: boolean;
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

    useEffect(() => {
        apiFetch<Client[]>('/clients').then(setClients).catch(console.error).finally(() => setLoading(false));
    }, []);

    const filtered = clients.filter(c => {
        const q = search.toLowerCase();
        const matchSearch = !q || c.nom.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.dossierId.toLowerCase().includes(q) || c.destination.toLowerCase().includes(q);
        const matchStatus = activeFilter === 'Tous' || c.statut === activeFilter;
        const matchType = clientType === 'Tous types' || c.type === clientType.toLowerCase();
        const matchConseiller = selectedConseiller === 'Tous conseillers' || c.conseillerNom === selectedConseiller;
        
        return matchSearch && matchStatus && matchType && matchConseiller;
    }).sort((a, b) => {
        if (sortBy === 'Plus récents') return b.id - a.id;
        if (sortBy === 'Plus anciens') return a.id - b.id;
        if (sortBy === 'Avancement') return b.avancement - a.avancement;
        return 0;
    });

    const urgentCount = clients.filter(c => c.urgent).length;
    const nonAssignesCount = clients.filter(c => !c.conseillerNom).length;
    const validesCount = clients.filter(c => c.statut === 'Validé').length;

    if (loading) {
        return (
            <div className="space-y-4 animate-pulse">
                <div className="h-10 bg-gray-200 rounded-xl w-48" />
                <div className="h-48 bg-gray-200 rounded-2xl" />
            </div>
        );
    }

    return (
        <div className="space-y-5 pb-8 max-w-7xl mx-auto">

            {/* ── Header ─────────────────────────────────────────────────── */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-black text-[#1a2b40]">Gestion des dossiers</h1>
                    <p className="text-sm text-gray-400 mt-0.5">{filtered.length} dossiers trouvés</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => alert("Génération de l'export CSV en cours... Le téléchargement commencera dans quelques secondes.")}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        <Download className="w-4 h-4" /> Exporter
                    </button>
                    <button 
                        onClick={() => alert("Ouverture du formulaire de création de dossier...")}
                        className="flex items-center gap-2 px-4 py-2.5 bg-[#0B84D8] text-white text-sm font-bold rounded-xl hover:bg-[#0973BD] transition-colors shadow-md shadow-[#0B84D8]/20"
                    >
                        <Plus className="w-4 h-4" /> Nouveau dossier
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
                <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex gap-1.5 flex-wrap">
                        {FILTERS.map(f => (
                            <button key={f} onClick={() => setActiveFilter(f)}
                                className={`px-3.5 py-1.5 rounded-xl text-sm font-semibold transition-all border ${
                                    activeFilter === f
                                        ? 'bg-[#1a2b40] text-white border-[#1a2b40]'
                                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                                }`}>
                                {f === 'Validé' ? 'Validé ✅' : f}
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <select 
                            value={clientType}
                            onChange={(e) => setClientType(e.target.value)}
                            className="text-sm text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none cursor-pointer hover:border-[#0B84D8]/30 transition-colors"
                        >
                            <option>Tous types</option>
                            <option value="étudiant">Étudiants</option>
                            <option value="voyageur">Particuliers</option>
                        </select>
                        <select 
                            value={selectedConseiller}
                            onChange={(e) => setSelectedConseiller(e.target.value)}
                            className="text-sm text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none cursor-pointer hover:border-[#0B84D8]/30 transition-colors"
                        >
                            <option>Tous conseillers</option>
                            <option>Fatou Mbaye</option>
                            <option>Ibrahima Fall</option>
                            <option>Omar Ba</option>
                        </select>
                        <select 
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="text-sm text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none cursor-pointer hover:border-[#0B84D8]/30 transition-colors"
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
