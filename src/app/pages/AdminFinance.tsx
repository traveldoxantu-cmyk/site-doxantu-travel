import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CreditCard, Download, Search, Filter, TrendingUp, TrendingDown, MoreVertical } from 'lucide-react';
import { apiFetch } from '../lib/api';

interface Transaction {
  id: string;
  client: string;
  date: string;
  montant: number;
  type: string;
  statut: string;
}

export function AdminFinance() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter] = useState('Tous');

  useEffect(() => {
    apiFetch<Transaction[]>('/transactions')
      .then(setTransactions)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredTransactions = transactions.filter(t => {
    const matchSearch = !searchTerm || t.client.toLowerCase().includes(searchTerm.toLowerCase()) || t.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'Tous' || t.statut === statusFilter;
    return matchSearch && matchStatus;
  });

  if (loading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto pb-8">
        <div className="h-20 bg-gray-100 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[1,2,3].map(i => <div key={i} className="h-32 bg-white rounded-2xl border border-gray-100 animate-pulse" />)}
        </div>
        <div className="h-[400px] bg-white rounded-2xl border border-gray-100 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1a2b40]">Pilotage Financier</h1>
          <p className="text-gray-500 text-sm mt-1">Gérez votre trésorerie et le suivi de facturation.</p>
        </div>
        <button 
          onClick={() => alert("Préparation du rapport financier... L'export sera téléchargé au format PDF.")}
          className="bg-[#0B84D8] text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-blue-600 transition-colors shadow-sm"
        >
          <Download className="w-4 h-4" /> Exporter le rapport
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-3">
            <CreditCard className="w-5 h-5 text-[#0B84D8]" />
          </div>
          <p className="text-2xl font-black text-[#1a2b40]">12.5M FCFA</p>
          <p className="text-sm font-medium text-gray-400 mb-2">Revenus du mois</p>
          <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +15.2% vs le mois dernier</p>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mb-3">
            <CreditCard className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-[#1a2b40]">850K FCFA</p>
          <p className="text-sm font-medium text-gray-400 mb-2">Paiements en attente</p>
          <p className="text-xs font-semibold text-amber-600 flex items-center gap-1">12 factures non-réglées</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center mb-3">
            <TrendingDown className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-2xl font-black text-[#1a2b40]">3.2%</p>
          <p className="text-sm font-medium text-gray-400 mb-2">Taux d'échec de paiement</p>
          <p className="text-xs font-semibold text-red-600 flex items-center gap-1">Stable depuis 30 jours</p>
        </motion.div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-lg font-bold text-[#1a2b40]">Dernières Transactions</h2>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input 
                type="text" 
                placeholder="Chercher une transaction..." 
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="px-3 py-2 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">ID</th>
                <th className="px-6 py-4 font-semibold">Client</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Motif</th>
                <th className="px-6 py-4 font-semibold text-right">Montant</th>
                <th className="px-6 py-4 font-semibold text-center">Statut</th>
                <th className="px-6 py-4 font-semibold text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredTransactions.map((trx, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: idx * 0.05 }} 
                  key={trx.id} 
                  className="hover:bg-blue-50/30 transition-colors group cursor-pointer"
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-500">{trx.id}</td>
                  <td className="px-6 py-4 text-sm font-bold text-[#1a2b40]">{trx.client}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{trx.date}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{trx.type}</td>
                  <td className="px-6 py-4 text-sm font-bold text-[#1a2b40] text-right">{trx.montant.toLocaleString('fr-FR')} FCFA</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                      trx.statut === 'Payé' ? 'bg-emerald-100 text-emerald-700' :
                      trx.statut === 'En attente' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {trx.statut}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-gray-400 hover:text-[#0B84D8]">
                    <MoreVertical className="w-5 h-5 inline-block cursor-pointer" />
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-gray-50 text-center">
          <button className="text-[#0B84D8] text-sm font-semibold hover:underline">Voir toutes les transactions historiques →</button>
        </div>
      </div>
    </div>
  );
}
