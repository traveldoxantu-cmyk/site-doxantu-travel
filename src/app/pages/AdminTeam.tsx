import { useState } from 'react';
import { motion } from 'motion/react';
import { UserPlus, Search, Mail, Phone, ExternalLink } from 'lucide-react';

const TEAM = [
  { id: 1, nom: 'Awa Diop', role: 'Conseillère Senior', dossiers: 42, performance: 94, avatar: 'AD', color: 'bg-emerald-500' },
  { id: 2, nom: 'Mamadou Faye', role: 'Conseiller Visa', dossiers: 28, performance: 88, avatar: 'MF', color: 'bg-blue-500' },
  { id: 3, nom: 'Khadija Sall', role: 'Spécialiste Campus France', dossiers: 35, performance: 91, avatar: 'KS', color: 'bg-purple-500' },
  { id: 4, nom: 'Cheikh Seck', role: 'Conseiller Junior', dossiers: 12, performance: 75, avatar: 'CS', color: 'bg-amber-500' },
];

export function AdminTeam() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1a2b40]">Gestion des Conseillers</h1>
          <p className="text-gray-500 text-sm mt-1">Annuaire de l'équipe et suivi des performances.</p>
        </div>
        <button className="bg-[#0B84D8] text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-blue-600 transition-colors shadow-sm">
          <UserPlus className="w-4 h-4" /> Ajouter un conseiller
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input 
            type="text" 
            placeholder="Rechercher par nom ou rôle..." 
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {TEAM.map((member, idx) => (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ delay: idx * 0.05 }} 
            key={member.id} 
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center group hover:shadow-md transition-shadow"
          >
            <div className={`w-16 h-16 mx-auto rounded-full ${member.color} flex items-center justify-center text-white text-xl font-bold mb-3 shadow-inner`}>
              {member.avatar}
            </div>
            <h3 className="font-bold text-[#1a2b40] text-lg">{member.nom}</h3>
            <p className="text-xs text-gray-400 font-medium mb-4">{member.role}</p>

            <div className="flex justify-center gap-2 mb-5">
              <button className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-[#0B84D8] hover:bg-blue-50 transition-colors">
                <Mail className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-[#0B84D8] hover:bg-blue-50 transition-colors">
                <Phone className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 border-t border-gray-50 pt-4">
              <div>
                <p className="text-xl font-black text-[#1a2b40]">{member.dossiers}</p>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Dossiers</p>
              </div>
              <div className="border-l border-gray-50">
                <p className="text-xl font-black text-[#0B84D8]">{member.performance}%</p>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Succès</p>
              </div>
            </div>

            <button className="w-full mt-4 py-2 border border-blue-100 text-[#0B84D8] rounded-xl text-xs font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center gap-1">
              Voir profil <ExternalLink className="w-3 h-3" />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
