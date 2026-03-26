import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BarChart3, Download, ArrowUpRight, Calendar, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { apiFetch } from '../lib/api';

interface KPI {
  label: string;
  value: string;
  trend: string;
  status: string;
}

interface ChartItem {
  mois: string;
  valeur: number;
}

interface DestinationPerf {
  pays: string;
  dossiers: number;
  succes: string;
  color: string;
}

export function AdminReporting() {
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [chartData, setChartData] = useState<ChartItem[]>([]);
  const [destinations, setDestinations] = useState<DestinationPerf[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch KPIs from admin_stats (key: reporting_kpis)
        const kpiData = await apiFetch<KPI[]>('/adminStats/reporting_kpis');
        setKpis(kpiData || []);

        // Fetch Chart Data
        const chartRes = await apiFetch<ChartItem[]>('/chartData?_sort=created_at&_limit=6');
        setChartData(chartRes || []);

        // Fetch Destination Perf from admin_stats (key: internal_perf)
        const destData = await apiFetch<DestinationPerf[]>('/adminStats/destinations_perf');
        setDestinations(destData || []);
      } catch (err) {
        console.error('Error fetching reporting data:', err);
        toast.error("Erreur lors de la récupération des données de reporting.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 animate-spin text-[#0B84D8]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#1a2b40]">Reporting & Statistiques</h1>
          <p className="text-gray-500 text-sm mt-1 font-medium">Analyse en temps réel des performances de l'agence.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => toast.info("Filtre temporel activé (Données 2026)")}
            className="bg-white border border-gray-100 text-gray-700 px-4 py-2.5 rounded-2xl text-sm font-black flex items-center gap-2 hover:bg-gray-50 transition-all shadow-sm active:scale-95"
          >
            <Calendar className="w-4 h-4 text-[#0B84D8]" /> 2026
          </button>
          <button 
            onClick={() => toast.info("Exportation du rapport analytique en cours...")}
            className="bg-[#0B84D8] text-white px-5 py-2.5 rounded-2xl text-sm font-black flex items-center gap-2 hover:bg-black transition-all shadow-lg shadow-blue-500/20 active:scale-95"
          >
            <Download className="w-4 h-4" /> Export complet
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {kpis.map((kpi, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: idx * 0.1 }}
            key={idx} 
            className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-xl hover:shadow-blue-500/5 transition-all"
          >
            <div className="absolute top-6 right-6 text-emerald-500 opacity-60 group-hover:scale-110 transition-transform">
              <ArrowUpRight className="w-6 h-6" />
            </div>
            <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">{kpi.label}</p>
            <p className="text-4xl font-black text-[#1a2b40] mb-3">{kpi.value}</p>
            <p className="text-[10px] uppercase font-black text-emerald-600 bg-emerald-50 w-max px-3 py-1 rounded-xl">
              {kpi.trend} croiss. mensuelle
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Evolution Chart */}
        <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm flex flex-col group hover:shadow-xl hover:shadow-blue-500/5 transition-all">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="font-black text-[#1a2b40] text-xl">Évolution des dossiers</h2>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Volume de traitement par mois</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#0B84D8]">
              <BarChart3 className="w-6 h-6" />
            </div>
          </div>
          <div className="flex-1 min-h-[300px] flex items-end justify-between gap-3 border-b border-gray-100 pb-4 relative mt-4">
            {chartData.map((item, i) => (
              <div key={item.mois} className="w-full flex flex-col items-center gap-4 z-10 h-full justify-end">
                <motion.div 
                  initial={{ height: 0 }} 
                  animate={{ height: chartData.length > 0 ? `${(item.valeur / Math.max(...chartData.map(d => d.valeur)) * 100) || 10}%` : '10%' }} 
                  transition={{ duration: 1.5, delay: i * 0.1, ease: "circOut" }}
                  className="w-full bg-[#0B84D8] rounded-2xl opacity-80 hover:opacity-100 transition-all cursor-pointer relative group/bar shadow-lg shadow-blue-500/10"
                >
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-black px-3 py-1.5 rounded-xl opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap shadow-xl">
                    {item.valeur} DOSSIERS
                  </div>
                </motion.div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.mois}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Perf Destinations */}
        <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm group hover:shadow-xl hover:shadow-blue-500/5 transition-all">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="font-black text-[#1a2b40] text-xl">Performance Destinations</h2>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Taux de réussite par pays</p>
            </div>
          </div>
          <div className="space-y-8">
            {destinations.map((dest, i) => (
              <div key={dest.pays} className="group/row">
                <div className="flex justify-between text-sm mb-3">
                  <span className="font-black text-[#1a2b40] uppercase tracking-wide">{dest.pays}</span>
                  <span className="text-[#0B84D8] font-black text-xs bg-blue-50 px-2 py-0.5 rounded-lg">{dest.succes} SUCCESS RATE</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-3 bg-gray-50 rounded-full overflow-hidden p-[2px]">
                    <motion.div 
                      initial={{ width: 0 }} 
                      animate={{ width: dest.succes }} 
                      transition={{ duration: 1.5, delay: i * 0.1, ease: "circOut" }}
                      className={`h-full ${dest.color} rounded-full shadow-sm`} 
                    />
                  </div>
                  <span className="text-[10px] font-black w-16 text-right text-gray-400">{dest.dossiers} DOSSIERS</span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-10 py-4 bg-gray-50 text-gray-500 rounded-3xl text-[11px] font-black uppercase tracking-widest hover:bg-[#0B84D8] hover:text-white transition-all active:scale-95 shadow-sm">
            Voir le détail analytique complet
          </button>
        </div>
      </div>
    </div>
  );
}
