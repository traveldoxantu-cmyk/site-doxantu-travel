import { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, FolderOpen, CheckCircle2, CreditCard, ArrowUpRight, ArrowRight, AlertTriangle, RefreshCw } from 'lucide-react';
import { Link } from 'react-router';
import { apiFetch } from '../lib/api';
import { supabase } from '../lib/supabase';
import { SEO } from '../components/SEO';
import { Skeleton } from '../components/ui/skeleton';

interface AdminStats {
    caTotalAnnuel: number; clientsSatisfaits: number;
    caCurrentMonth: number; caGrowthPercent: number;
    dossiersActifs: number; nouveauxDossiers: number;
    tauxSuccesVisa: number; tauxSuccesGrowth: number;
    paiementsEnAttente: number; montantAEncaisser: number;
}
interface ChartPoint { mois: string; valeur: number; }
interface StatutItem { statut: string; count: number; color: string; }
interface Paiement { id: number; client: string; montant: number; date: string; statut: string; }
interface Client { id: number; nom: string; initiales: string; dossierId: string; destination: string; formation: string; statut: string; avancement: number; urgent: boolean; conseillerNom: string | null; }
interface Demande { 
    id: number; 
    type: 'billetterie' | 'accompagnement'; 
    data: any; 
    status: string; 
    createdAt: string; 
}

// ── SVG Line Chart (inline, no library) ───────────────────────────────────
function LineChart({ data }: { data: ChartPoint[] }) {
    if (!data.length) return null;
    const W = 580, H = 180, PAD = { top: 16, right: 16, bottom: 36, left: 56 };
    const innerW = W - PAD.left - PAD.right;
    const innerH = H - PAD.top - PAD.bottom;
    const maxVal = Math.max(...data.map(d => d.valeur));
    const minVal = 0;
    const pts = data.map((d, i) => ({
        x: PAD.left + (i / (data.length - 1)) * innerW,
        y: PAD.top + innerH - ((d.valeur - minVal) / (maxVal - minVal)) * innerH,
        ...d,
    }));
    const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
    const areaD = `${pathD} L ${pts[pts.length - 1].x.toFixed(1)} ${(PAD.top + innerH).toFixed(1)} L ${PAD.left} ${(PAD.top + innerH).toFixed(1)} Z`;
    const gridLines = [0, 0.25, 0.5, 0.75, 1].map(v => ({
        y: PAD.top + innerH - v * innerH,
        label: ((minVal + v * (maxVal - minVal)) / 1e6).toFixed(1) + 'M',
    }));

    return (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 180 }}>
            <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0B84D8" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#0B84D8" stopOpacity="0" />
                </linearGradient>
            </defs>
            {/* Grid */}
            {gridLines.map((g, i) => (
                <g key={i}>
                    <line x1={PAD.left} x2={W - PAD.right} y1={g.y} y2={g.y} stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4 3" />
                    <text x={PAD.left - 6} y={g.y + 4} textAnchor="end" fontSize="10" fill="#9ca3af">{g.label}</text>
                </g>
            ))}
            {/* Area fill */}
            <path d={areaD} fill="url(#chartGrad)" />
            {/* Line */}
            <path d={pathD} fill="none" stroke="#0B84D8" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
            {/* Dots + labels */}
            {pts.map((p, i) => (
                <g key={i}>
                    <circle cx={p.x} cy={p.y} r="4" fill="white" stroke="#0B84D8" strokeWidth="2" />
                    <text x={p.x} y={H - 6} textAnchor="middle" fontSize="9.5" fill="#9ca3af">{p.mois}</text>
                </g>
            ))}
        </svg>
    );
}

// ── Mini horizontal bar for statut ───────────────────────────────────────
function StatutBar({ color, count, max }: { color: string; count: number; max: number }) {
    return (
        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(count / max) * 100}%`, backgroundColor: color }} />
        </div>
    );
}

export function AdminDashboard() {
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [chart, setChart] = useState<ChartPoint[]>([]);
    const [statuts, setStatuts] = useState<StatutItem[]>([]);
    const [paiements, setPaiements] = useState<Paiement[]>([]);
    const [urgent, setUrgent] = useState<Client[]>([]);
    const [demandes, setDemandes] = useState<Demande[]>([]);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(() => {
        setLoading(true);
        Promise.all([
            // admin_stats : clé TEXT 'general_stats'
            supabase?.from('admin_stats').select('value').eq('key', 'general_stats').single()
                .then(r => r?.data?.value ?? null),
            apiFetch<ChartPoint[]>('/chart_data'),
            apiFetch<StatutItem[]>('/dossiers_statut'),
            apiFetch<any[]>('/paiements?_limit=5&_sort=created_at&_order=desc'),
            // Clients urgents : clients avec champ urgent=true dans profiles
            supabase?.from('profiles')
                .select('id, nom, prenom, initiales, dossier_id, destination, avancement')
                .match({ urgent: true })
                .limit(5)
                .then(r => r?.data ?? []),
            apiFetch<Demande[]>('/demandes?_limit=5&_sort=created_at&_order=desc'),
        ]).then(([s, c, st, p, dUrgent, dem]) => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) setUser(JSON.parse(storedUser));

            setStats(s || null);
            setChart(c || []);
            setStatuts(st || []);

            setPaiements((p || []).map(pay => ({
                ...pay,
                client: pay.clientNom || pay.client || 'Client inconnu'
            })));

            // Mapper les profils urgents
            setUrgent(((dUrgent as any[]) || []).map(d => ({
                id: d.id,
                nom: `${d.prenom || ''} ${d.nom || ''}`.trim() || 'Client',
                initiales: d.initiales || 'DX',
                dossierId: d.dossier_id || '—',
                destination: d.destination || '—',
                formation: '',
                statut: 'urgent',
                etape: 0,
                etapesTotal: 6,
                dateCreation: '',
                conseiller: '',
                avancement: d.avancement || 0,
                urgent: true,
                conseillerNom: null,
            })));

            setDemandes(dem || []);
        }).catch(err => {
            console.error('Erreur lors du chargement du dashboard admin:', err);
        }).finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        fetchData();
        
        // Configuration du Temps Réel avec Supabase
        const channel = supabase
            ?.channel('admin_dashboard_realtime')
            .on('postgres_changes', { 
                event: '*', 
                schema: 'public', 
                table: 'demandes' 
            }, () => {
                fetchData(); // Rafraîchit les données dès qu'une demande change
            })
            .on('postgres_changes', { 
                event: '*', 
                schema: 'public', 
                table: 'paiements' 
            }, () => {
                fetchData(); // Rafraîchit les données dès qu'un paiement change
            })
            .subscribe();

        return () => {
            if (channel) {
                supabase?.removeChannel(channel);
            }
        };
    }, [fetchData]);

    const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const maxStatut = statuts.length ? Math.max(...statuts.map(s => s.count)) : 1;

    const kpis = stats ? [
        { icon: TrendingUp, label: 'CA ce mois', value: `${(stats.caCurrentMonth / 1e6).toFixed(2)}M FCFA`, sub: `+${stats.caGrowthPercent}% vs mois précédent`, subColor: 'text-emerald-600', to: '/admin/finance' },
        { icon: FolderOpen, label: 'Nouvelles demandes', value: `${demandes.length}`, sub: `Dernières 24h`, subColor: 'text-emerald-600', to: '/admin/demandes' },
        { icon: CheckCircle2, label: 'Taux succès visa', value: `${stats.tauxSuccesVisa}%`, sub: `+${stats.tauxSuccesGrowth}pts vs trimestre préc.`, subColor: 'text-emerald-600', to: '/admin/reporting' },
        { icon: CreditCard, label: 'Paiements en attente', value: `${stats.paiementsEnAttente}`, sub: `${(stats.montantAEncaisser / 1000).toFixed(0)}K FCFA à encaisser`, subColor: 'text-amber-600', to: '/admin/finance' },
    ] : [];

    if (loading) {
        return (
            <div className="space-y-6 max-w-7xl mx-auto">
                <Skeleton className="h-32 rounded-3xl" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => (
                        <Skeleton key={i} className="h-32 rounded-[28px]" />
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    <Skeleton className="lg:col-span-2 h-[350px] rounded-3xl" />
                    <Skeleton className="h-[350px] rounded-3xl" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-5 pb-8 max-w-7xl mx-auto">
            <SEO 
                title="Tableau de Bord Admin" 
                description="Gestion des dossiers, paiements et statistiques de l'agence Doxantu Travel." 
            />

            {/* ── Welcome banner ───────────────────────────────────────────── */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between px-6 md:px-8 py-6 gap-6"
                style={{ background: 'linear-gradient(135deg, #0e1e38 0%, #1a3a5c 100%)' }}>
                <div>
                    <h1 className="text-xl md:text-2xl font-extrabold text-white mb-1">Bonjour, {user?.firstName || 'Admin'} 👋</h1>
                    <p className="text-blue-300/80 text-xs md:text-sm">Direction Générale · {today}</p>
                </div>
                <div className="flex gap-6 md:gap-8 w-full md:w-auto border-t border-white/10 md:border-0 pt-4 md:pt-0">
                    <div className="flex-1 md:text-right">
                        <p className="text-blue-300/60 text-[10px] md:text-xs font-medium uppercase tracking-wide mb-0.5">CA total</p>
                        <p className="text-white font-extrabold text-xl md:text-2xl">{((stats?.caTotalAnnuel ?? 0) / 1e6).toFixed(2)}M FCFA</p>
                    </div>
                    <div className="flex-1 md:text-right md:pl-8 md:border-l md:border-white/10">
                        <p className="text-blue-300/60 text-[10px] md:text-xs font-medium uppercase tracking-wide mb-0.5">Satisfaction</p>
                        <p className="text-white font-extrabold text-xl md:text-2xl">{stats?.clientsSatisfaits ?? 0}%</p>
                    </div>
                </div>
            </motion.div>

            {/* ── 4 KPI Cards ──────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map((k, idx) => (
                    <Link key={idx} to={k.to}>
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.07 }}
                            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm relative overflow-hidden h-full hover:shadow-md transition-shadow">
                            <div className="absolute top-4 right-4 text-emerald-500 opacity-60">
                                <ArrowUpRight className="w-4 h-4" />
                            </div>
                            <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center mb-3 border border-gray-100">
                                <k.icon className="w-4 h-4 text-[#0B84D8]" />
                            </div>
                            <p className="text-xl font-black text-[#1a2b40]">{k.value}</p>
                            <p className="text-xs text-gray-400 font-medium mb-2">{k.label}</p>
                            <p className={`text-xs font-semibold ${k.subColor}`}>{k.sub}</p>
                        </motion.div>
                    </Link>
                ))}
            </div>

            {/* ── Chart + Dossiers/Statut ───────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Line chart */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <div className="flex items-center justify-between mb-1">
                        <div>
                            <h2 className="font-bold text-[#1a2b40]">Chiffre d'affaires mensuel</h2>
                            <p className="text-xs text-gray-400">7 derniers mois</p>
                        </div>
                        <Link to="/admin/reporting" className="text-xs text-[#0B84D8] font-semibold hover:underline flex items-center gap-1">
                            Détails <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                    <LineChart data={chart} />
                </div>

                {/* Dossiers par statut */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="font-bold text-[#1a2b40]">Dossiers /</h2>
                            <h2 className="font-bold text-[#1a2b40]">Statut</h2>
                        </div>
                        <Link to="/admin/clients" className="text-xs text-[#0B84D8] font-semibold hover:underline flex items-center gap-1">
                            Voir tout <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {statuts.map((s) => (
                            <div key={s.statut} className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                                <span className="text-sm text-gray-600 font-medium w-20 shrink-0">{s.statut}</span>
                                <span className="text-sm font-bold text-gray-700 w-4 shrink-0">{s.count}</span>
                                <StatutBar color={s.color} count={s.count} max={maxStatut} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Urgents + Paiements ───────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Dossiers urgents */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-bold text-[#1a2b40] flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-500" /> Dossiers urgents
                        </h2>
                        <Link to="/admin/clients" className="text-xs text-[#0B84D8] font-semibold hover:underline flex items-center gap-1">
                            Voir tout <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {urgent.map(c => (
                            <Link key={c.id} to="/admin/clients" className="block w-full">
                                <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-100 rounded-xl hover:bg-red-100 transition-colors">
                                    <div className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                                        {c.initiales}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-red-800 truncate">{c.nom}</p>
                                        <p className="text-xs text-red-400">{c.dossierId} · {c.destination}</p>
                                    </div>
                                    <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-lg shrink-0">{c.avancement}%</span>
                                </div>
                            </Link>
                        ))}
                        {urgent.length === 0 && (
                            <p className="text-sm text-gray-400 text-center py-4">✅ Aucun dossier urgent</p>
                        )}
                    </div>
                </div>

                {/* Derniers paiements */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-bold text-[#1a2b40]">Derniers paiements</h2>
                        <Link to="/admin/clients" className="text-xs text-[#0B84D8] font-semibold hover:underline flex items-center gap-1">
                            Voir tout <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {paiements.map(p => (
                            <div key={p.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                                <div>
                                    <p className="text-sm font-semibold text-[#1a2b40]">{p.client}</p>
                                    <p className="text-xs text-gray-400">{p.date}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-[#1a2b40]">{p.montant.toLocaleString('fr-FR')} FCFA</p>
                                    <span className={`text-xs font-semibold ${p.statut === 'reçu' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                        {p.statut === 'reçu' ? '✓ Reçu' : '⏳ En attente'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Dernières Demandes du Site ────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 overflow-hidden">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-lg font-bold text-[#1a2b40]">Flux des demandes réelles</h2>
                        <p className="text-xs text-gray-400">Demandes soumises via Billetterie & Devis</p>
                    </div>
                    <Link to="/admin/demandes" className="text-xs text-[#0B84D8] font-semibold hover:underline flex items-center gap-1">
                        Voir tout <ArrowRight className="w-3 h-3" />
                    </Link>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => fetchData()}
                            disabled={loading}
                            className="p-2 text-gray-400 hover:text-[#0B84D8] transition-colors rounded-lg hover:bg-blue-50"
                            title="Rafraîchir les données"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                        <span className="px-3 py-1 bg-blue-50 text-[#0B84D8] text-[10px] font-bold rounded-full uppercase tracking-wider">Direct API</span>
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50">
                                <th className="pb-3 pr-4">Type</th>
                                <th className="pb-3 pr-4">Client</th>
                                <th className="pb-3 pr-4">Détails</th>
                                <th className="pb-3 pr-4">Date</th>
                                <th className="pb-3">Statut</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {demandes.map((d) => (
                                <tr key={d.id} className="group hover:bg-gray-50/50 transition-colors">
                                    <td className="py-4 pr-4">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${d.type === 'billetterie' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                                            {d.type === 'billetterie' ? <ArrowRight className="w-4 h-4 rotate-[-45deg]" /> : <FolderOpen className="w-4 h-4" />}
                                        </div>
                                    </td>
                                    <td className="py-4 pr-4">
                                        <p className="text-sm font-bold text-[#1a2b40]">{d.data.nom || (d.data.from ? 'Vol : ' + d.data.from : 'Anonyme')}</p>
                                        <p className="text-[10px] text-gray-400">{d.data.email || d.data.tel || '--'}</p>
                                    </td>
                                    <td className="py-4 pr-4">
                                        <p className="text-xs text-gray-600 truncate max-w-[200px]">
                                            {d.type === 'billetterie' ? `${d.data.from} → ${d.data.to}` : d.data.service || d.data.destination}
                                        </p>
                                    </td>
                                    <td className="py-4 pr-4">
                                        <p className="text-[10px] text-gray-400">{new Date(d.createdAt).toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                                    </td>
                                    <td className="py-4">
                                        <span className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase">
                                            {d.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {demandes.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-sm text-gray-400 italic">
                                        Aucune demande réelle enregistrée pour le moment.
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
