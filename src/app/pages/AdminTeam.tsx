import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { UserPlus, Search, Mail, Phone, ExternalLink } from 'lucide-react';
import { apiFetch } from '../lib/api';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  initials: string;
  color: string;
  desc: string;
}

export function AdminTeam() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    apiFetch<TeamMember[]>('/conseillers_full')
      .then(setTeam)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredTeam = team.filter(member => {
    const name = member.name || (member as any).nom || '';
    const role = member.role || '';
    const search = searchTerm.toLowerCase();
    return name.toLowerCase().includes(search) || 
           role.toLowerCase().includes(search);
  });

  if (loading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto pb-8">
        <div className="h-20 bg-gray-100 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1,2,3,4].map(i => <div key={i} className="h-64 bg-white rounded-2xl border border-gray-100 animate-pulse" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1a2b40]">Gestion des Conseillers</h1>
          <p className="text-gray-500 text-sm mt-1">Annuaire de l'équipe et suivi des performances.</p>
        </div>
        <button 
          onClick={() => alert("Ouverture du formulaire d'ajout de nouveau membre de l'équipe...")}
          className="bg-[#0B84D8] text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-blue-600 transition-colors shadow-sm"
        >
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
        {filteredTeam.map((member, idx) => (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ delay: idx * 0.05 }} 
            key={member.id} 
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center group hover:shadow-md transition-shadow flex flex-col h-full"
          >
            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-white text-xl font-bold mb-3 shadow-inner`} style={{ backgroundColor: member.color }}>
              {member.initials}
            </div>
            <h3 className="font-bold text-[#1a2b40] text-lg">{member.name}</h3>
            <p className="text-xs text-[#0B84D8] font-bold uppercase tracking-wider mb-2">{member.role}</p>
            <p className="text-xs text-gray-500 line-clamp-2 mb-4 flex-grow">{member.desc}</p>

            <div className="flex justify-center gap-2 mb-5">
              <button 
                onClick={() => alert(`Envoyer un mail à ${member.name}`)}
                className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-[#0B84D8] hover:bg-blue-50 transition-colors border border-gray-100"
              >
                <Mail className="w-4 h-4" />
              </button>
              <button 
                onClick={() => alert(`Appeler ${member.name}`)}
                className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-[#0B84D8] hover:bg-blue-50 transition-colors border border-gray-100"
              >
                <Phone className="w-4 h-4" />
              </button>
            </div>

            <button 
              onClick={() => alert(`Ouverture du profil complet de ${member.name}...`)}
              className="w-full mt-auto py-2.5 bg-gray-50 border border-gray-100 text-[#1a2b40] rounded-xl text-xs font-bold hover:bg-blue-50 hover:text-[#0B84D8] hover:border-blue-100 transition-all flex items-center justify-center gap-1"
            >
              Voir profil détaillé <ExternalLink className="w-3 h-3" />
            </button>
          </motion.div>
        ))}
        {filteredTeam.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <Search className="w-12 h-12 text-gray-100 mx-auto mb-4" />
            <p className="text-gray-400 font-medium">Aucun conseiller trouvé pour "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
}
