import { useState } from 'react';
import { Settings, Save, Bell, Shield, MapPin, Mail, Globe, Lock } from 'lucide-react';

export function AdminSettings() {
  const [activeTab, setActiveTab] = useState('agence');

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1a2b40]">Paramètres</h1>
          <p className="text-gray-500 text-sm mt-1">Configuration globale de l'agence Doxantu Travel.</p>
        </div>
        <button className="bg-[#0B84D8] text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-blue-600 transition-colors shadow-sm">
          <Save className="w-4 h-4" /> Enregistrer les modifications
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          {[
            { id: 'agence', icon: MapPin, label: 'Infos Agence' },
            { id: 'notifications', icon: Bell, label: 'Notifications' },
            { id: 'templates', icon: Mail, label: 'Templates d\'emails' },
            { id: 'securite', icon: Shield, label: 'Sécurité & Accès' },
            { id: 'systeme', icon: Settings, label: 'Configuration Système' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-semibold transition-colors ${
                activeTab === tab.id ? 'bg-[#0B84D8] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
          {activeTab === 'agence' && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <h2 className="text-lg font-bold text-[#1a2b40] mb-6 flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#0B84D8]" /> Informations de l'Agence
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nom de l'entreprise</label>
                  <input type="text" defaultValue="Doxantu Travel" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0B84D8] focus:ring-1 focus:ring-[#0B84D8] transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email de contact principal</label>
                  <input type="email" defaultValue="contact@doxantu-travel.com" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0B84D8] focus:ring-1 focus:ring-[#0B84D8] transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Téléphone</label>
                  <input type="tel" defaultValue="+221 33 000 00 00" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0B84D8] focus:ring-1 focus:ring-[#0B84D8] transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Numéro WhatsApp</label>
                  <input type="tel" defaultValue="+221 78 000 00 00" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0B84D8] focus:ring-1 focus:ring-[#0B84D8] transition-all" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Adresse du siège</label>
                  <textarea rows={2} defaultValue="Sacré-Cœur 3, VDN, Dakar, Sénégal" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0B84D8] focus:ring-1 focus:ring-[#0B84D8] transition-all resize-none" />
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <h3 className="font-bold text-[#1a2b40] mb-4">Réseaux Sociaux</h3>
                <div className="space-y-4">
                  <div className="flex gap-4 items-center">
                    <span className="w-24 text-sm font-medium text-gray-500">Facebook</span>
                    <input type="url" defaultValue="https://facebook.com/doxantutravel" className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm" />
                  </div>
                  <div className="flex gap-4 items-center">
                    <span className="w-24 text-sm font-medium text-gray-500">Instagram</span>
                    <input type="url" defaultValue="https://instagram.com/doxantutravel" className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab !== 'agence' && (
            <div className="h-48 flex flex-col items-center justify-center text-center animate-in fade-in duration-300">
              <Lock className="w-12 h-12 text-gray-200 mb-3" />
              <h3 className="text-lg font-bold text-gray-400 mb-1">Accès Restreint</h3>
              <p className="text-sm text-gray-400">Ces configurations requièrent des droits Super Admin confirmés.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
