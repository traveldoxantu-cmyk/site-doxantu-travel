import { motion } from 'motion/react';
import { BarChart3, Download, ArrowUpRight, Calendar } from 'lucide-react';

const KPIS = [
  { label: 'Taux de succès Global', value: '89%', trend: '+2.4%', status: 'up' },
  { label: 'Dossiers complétés', value: '342', trend: '+15', status: 'up' },
  { label: 'Délai moyen', value: '14 jrs', trend: '-2 jrs', status: 'up' },
];

const DESTINATIONS_PERF = [
  { pays: 'France', dossiers: 184, succes: '92%', color: 'bg-blue-500' },
  { pays: 'Canada', dossiers: 98, succes: '85%', color: 'bg-red-500' },
  { pays: 'Maroc', dossiers: 45, succes: '95%', color: 'bg-emerald-500' },
  { pays: 'Turquie', dossiers: 15, succes: '78%', color: 'bg-amber-500' },
];

export function AdminReporting() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1a2b40]">Reporting & Statistiques</h1>
          <p className="text-gray-500 text-sm mt-1">Analyse des performances de l'agence.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-gray-50 transition-colors shadow-sm">
            <Calendar className="w-4 h-4" /> Cette Année
          </button>
          <button className="bg-[#0B84D8] text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-blue-600 transition-colors shadow-sm">
            <Download className="w-4 h-4" /> Export complet
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {KPIS.map((kpi, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: idx * 0.1 }}
            key={idx} 
            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden"
          >
            <div className="absolute top-5 right-5 text-emerald-500 opacity-60">
              <ArrowUpRight className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-gray-500 mb-2">{kpi.label}</p>
            <p className="text-3xl font-black text-[#1a2b40] mb-2">{kpi.value}</p>
            <p className="text-[11px] uppercase tracking-wider font-bold text-emerald-600 bg-emerald-50 w-max px-2 py-0.5 rounded-lg">
              {kpi.trend} vs prec.
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Graph Mockup */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-[#1a2b40]">Évolution des dossiers</h2>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <div className="flex-1 min-h-[250px] flex items-end justify-between gap-2 border-b border-gray-100 pb-2 relative mt-4">
            {/* Fake Grid lines */}
            <div className="absolute w-full border-t border-gray-100 border-dashed top-0"></div>
            <div className="absolute w-full border-t border-gray-100 border-dashed top-[33%]"></div>
            <div className="absolute w-full border-t border-gray-100 border-dashed top-[66%]"></div>
            
            {/* Bars */}
            {['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'].map((m, i) => {
              const heights = [40, 55, 30, 70, 85, 60];
              const h = heights[i];
              return (
                <div key={m} className="w-full flex flex-col items-center gap-3 z-10 h-full justify-end">
                  <motion.div 
                    initial={{ height: 0 }} 
                    animate={{ height: `${h}%` }} 
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className="w-full bg-[#0B84D8] rounded-t-lg opacity-80 hover:opacity-100 transition-opacity cursor-pointer relative group"
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded hidden group-hover:block whitespace-nowrap">
                      {h * 2} dos.
                    </div>
                  </motion.div>
                  <span className="text-xs font-medium text-gray-400">{m}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Perf Destinations */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-[#1a2b40]">Performance par destination</h2>
          </div>
          <div className="space-y-6">
            {DESTINATIONS_PERF.map((dest, i) => (
              <div key={dest.pays}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-bold text-[#1a2b40]">{dest.pays}</span>
                  <span className="text-gray-500 font-medium text-xs">{dest.succes} de réussite</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }} 
                      animate={{ width: dest.succes }} 
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className={`h-full ${dest.color} rounded-full`} 
                    />
                  </div>
                  <span className="text-xs font-bold w-14 text-right text-gray-400">{dest.dossiers} dos.</span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 border border-blue-100 text-[#0B84D8] rounded-xl text-xs font-semibold hover:bg-blue-50 transition-colors">
            Voir le détail analytique
          </button>
        </div>
      </div>
    </div>
  );
}
