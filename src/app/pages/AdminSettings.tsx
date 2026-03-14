import { useState } from 'react';
import { motion } from 'motion/react';
import { Settings, Save, Bell, Shield, MapPin, Mail, Globe, Lock, CheckCircle2 } from 'lucide-react';

export function AdminSettings() {
  const [activeTab, setActiveTab] = useState('agence');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1000);
  };

  const tabLabels = {
    notifications: 'Notifications',
    templates: "Templates d'emails",
    securite: 'Sécurité & Accès',
    systeme: 'Configuration Système',
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1a2b40]">Paramètres</h1>
          <p className="text-gray-500 text-sm mt-1">Configuration globale de l'agence Doxantu Travel.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-sm ${
            saved ? 'bg-emerald-500 text-white' : 'bg-[#0B84D8] text-white hover:bg-blue-600'
          } disabled:opacity-70`}
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : saved ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saved ? 'Modifications enregistrées' : 'Enregistrer les modifications'}
        </button>
      </div>

      {saved && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="fixed top-24 right-8 bg-white border border-emerald-100 shadow-xl rounded-2xl p-4 flex items-center gap-3 z-50 animate-in fade-in slide-in-from-top-4"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#1a2b40]">Paramètres mis à jour</p>
            <p className="text-[11px] text-gray-400 font-medium">Les changements sont effectifs immédiatement.</p>
          </div>
        </motion.div>
      )}

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

          {activeTab === 'notifications' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div>
                <h2 className="text-lg font-bold text-[#1a2b40] mb-6 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-[#0B84D8]" /> Alertes & Notifications
                </h2>
                <div className="space-y-4">
                  {[
                    { id: 'not_email', label: 'Notifications par email', desc: "Recevoir un récapitulatif quotidien des nouveaux dossiers." },
                    { id: 'not_wa', label: 'Alertes WhatsApp', desc: "Être notifié instantanément lors d'un message client urgent." },
                    { id: 'not_doc', label: 'Dépôt de documents', desc: "Alerte lors d'un nouveau document uploaded par un client." },
                  ].map(n => (
                    <div key={n.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <div>
                        <p className="font-bold text-[#1a2b40] text-sm">{n.label}</p>
                        <p className="text-xs text-gray-400 font-medium">{n.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0B84D8]"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'templates' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <h2 className="text-lg font-bold text-[#1a2b40] mb-6 flex items-center gap-2">
                <Mail className="w-5 h-5 text-[#0B84D8]" /> Modèles d'emails automatiques
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: 'Confirmation de Dossier', code: 'CONF_DOSSIER', type: 'Accusé de réception' },
                  { title: 'Document Validé', code: 'DOC_VALID', type: 'Suivi de dossier' },
                  { title: 'Rappel Échéance', code: 'REMIND_DATE', type: 'Alerte' },
                  { title: 'Bienvenue Nouveau Client', code: 'WELCOME_MAIL', type: 'Onboarding' },
                ].map((t, idx) => (
                  <div key={idx} className="p-4 rounded-2xl border border-gray-100 hover:border-[#0B84D8]/30 transition-all group cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                       <span className="text-[10px] font-bold text-[#0B84D8] uppercase tracking-widest px-2 py-1 bg-blue-50 rounded-lg">{t.type}</span>
                       <Settings className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#0B84D8]" />
                    </div>
                    <p className="font-bold text-sm text-[#1a2b40]">{t.title}</p>
                    <p className="text-xs text-gray-400 font-mono mt-1">{t.code}.html</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'securite' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <h2 className="text-lg font-bold text-[#1a2b40] mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#0B84D8]" /> Sécurité & Accès
              </h2>
              <div className="max-w-md space-y-6">
                 <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Changer le mot de passe administrateur</label>
                   <input type="password" placeholder="Mot de passe actuel" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm mb-3" />
                   <input type="password" placeholder="Nouveau mot de passe" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm" />
                 </div>
                 <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-3">
                    <Shield className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-amber-900">Double authentification (2FA)</p>
                      <p className="text-xs text-amber-700 leading-relaxed">Renforcez la sécurité de votre compte en ajoutant une étape de vérification via Google Authenticator.</p>
                      <button className="text-sm font-bold text-[#0B84D8] mt-2">Activer maintenant →</button>
                    </div>
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'systeme' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <h2 className="text-lg font-bold text-[#1a2b40] mb-6 flex items-center gap-2">
                <Settings className="w-5 h-5 text-[#0B84D8]" /> Configuration Système
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <div className="p-5 rounded-2xl border border-gray-100 space-y-4">
                    <p className="text-sm font-bold text-[#1a2b40]">Base de données</p>
                    <p className="text-xs text-gray-400">Dernière sauvegarde automatique : il y a 2 heures.</p>
                    <button className="w-full py-2.5 bg-gray-50 text-gray-600 text-xs font-bold rounded-xl hover:bg-gray-100 transition-colors border border-gray-200">
                      Exporter la base (.json)
                    </button>
                 </div>
                 <div className="p-5 rounded-2xl border border-gray-100 space-y-4">
                    <p className="text-sm font-bold text-[#1a2b40]">Mode Maintenance</p>
                    <p className="text-xs text-gray-400">Empêche l'accès aux clients pendant les mises à jour.</p>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                      <span className="ml-3 text-xs font-bold text-red-500">Désactivé</span>
                    </label>
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
