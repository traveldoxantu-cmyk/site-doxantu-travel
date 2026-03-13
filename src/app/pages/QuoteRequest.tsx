import { useState } from 'react';
import { motion } from 'motion/react';
import { Upload, ArrowRight, CheckCircle, Shield } from 'lucide-react';
import { useSearchParams } from 'react-router';
import { buildWhatsAppMessage, openWhatsAppSubmission } from '../lib/submission';
import { SEO } from '../components/SEO';

export function QuoteRequest() {
  const [searchParams] = useSearchParams();
  const initialDestination = searchParams.get('destination') || '';

  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState({
    service: initialDestination ? 'campus-france' : '', // Pré-sélection Campus France si destination définie depuis la page Études
    destination: initialDestination,
    budget: '',
    visaType: initialDestination ? 'etudes' : '', // Pré-sélectionne le visa étudiant si ça vient de la page études
    date: '',
    documents: false,
    nom: '',
    email: '',
    tel: '',
    message: '',
  });

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };
  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = buildWhatsAppMessage("Nouvelle demande d'accompagnement", {
      "Service": form.service,
      "Destination": form.destination,
      "Type de visa": form.visaType || 'Non spécifié',
      Budget: form.budget,
      'Date prevue': form.date,
      'Documents a joindre': form.documents ? 'Oui' : 'Non',
      Nom: form.nom,
      Telephone: form.tel,
      Email: form.email,
      Message: form.message,
    });
    openWhatsAppSubmission(message);
    setCurrentStep(4);
  };

  return (
    <div>
      <SEO 
        title="Démarrer mon projet" 
        description="Faites une évaluation gratuite de votre profil pour étudier à l'étranger avec Doxantu Travel." 
      />
      {/* Hero */}
      <section
        className="relative pt-40 pb-16 px-4 sm:px-6 lg:px-8"
        style={{ background: 'linear-gradient(135deg, #072a50 0%, #0B84D8 100%)' }}
      >
        <div className="max-w-2xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="text-5xl mb-4">📋</div>
            <h1 className="text-white mb-4" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800 }}>
              Démarrer mon projet
            </h1>
            <p className="text-blue-200" style={{ fontSize: '1rem', lineHeight: 1.7 }}>
              Renseignez ces informations pour que nos experts évaluent gratuitement votre profil 
              et vous proposent un accompagnement sur mesure dans les 24h.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Form Area */}
      <section className="py-16 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#F8FAFC' }}>
        <div className="max-w-2xl mx-auto">
          {/* Progress steps */}
          <div className="flex items-center justify-center mb-10">
            {[
              { id: 1, label: 'Service' },
              { id: 2, label: 'Détails' },
              { id: 3, label: 'Coordonnées' },
              { id: 4, label: 'Confirmation' },
            ].map((step, i) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300"
                    style={{
                      backgroundColor: currentStep >= step.id ? '#0B84D8' : '#E5E7EB',
                      color: currentStep >= step.id ? 'white' : '#9CA3AF',
                    }}
                  >
                    {currentStep > step.id ? <CheckCircle className="w-5 h-5" /> : step.id}
                  </div>
                  <span className="text-xs mt-1 font-medium" style={{ color: currentStep >= step.id ? '#0B84D8' : '#9CA3AF' }}>
                    {step.label}
                  </span>
                </div>
                {i < 3 && (
                  <div
                    className="h-0.5 w-12 sm:w-20 mx-2 mb-4 transition-all duration-300"
                    style={{ backgroundColor: currentStep > step.id ? '#0B84D8' : '#E5E7EB' }}
                  />
                )}
              </div>
            ))}
          </div>

          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl shadow-xl p-6 sm:p-10"
          >
            {/* Step 1: Service */}
            {currentStep === 1 && (
              <div>
                <h2 className="text-[#333333] mb-2" style={{ fontSize: '1.3rem', fontWeight: 700 }}>
                  Quel service recherchez-vous ?
                </h2>
                <p className="text-gray-400 text-sm mb-6">Sélectionnez le service qui correspond à votre besoin.</p>

                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { value: 'campus-france', label: '🎓 Accompagnement Campus France', desc: 'Procédure complète' },
                    { value: 'billet-retour', label: '✈️ Billet aller-retour', desc: 'Vols nationaux & internationaux' },
                    { value: 'visa-etudiant', label: '📄 Visa Étudiant', desc: 'Préparation du dossier consulaire' },
                    { value: 'visa-tourisme', label: '🌍 Visa Tourisme', desc: 'Schengen, Canada, USA...' },
                    { value: 'legalisation', label: '🔏 Légalisation & Traduction', desc: 'Documents officiels' },
                    { value: 'pack-complet', label: '📦 Pack Complet', desc: 'Campus France + Visa + Billet' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setForm({ ...form, service: opt.value })}
                      className="p-4 rounded-2xl text-left transition-all border-2"
                      style={{
                        borderColor: form.service === opt.value ? '#0B84D8' : '#E5E7EB',
                        backgroundColor: form.service === opt.value ? '#F0F8FF' : 'white',
                      }}
                    >
                      <p className="font-semibold text-[#333333] text-sm">{opt.label}</p>
                      <p className="text-gray-400 text-xs mt-0.5">{opt.desc}</p>
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  disabled={!form.service}
                  className="w-full mt-6 py-3.5 text-white font-semibold flex items-center justify-center gap-2 transition-all hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ backgroundColor: '#0B84D8', borderRadius: '12px' }}
                >
                  Continuer <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Step 2: Détails */}
            {currentStep === 2 && (
              <form onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
                <h2 className="text-[#333333] mb-2" style={{ fontSize: '1.3rem', fontWeight: 700 }}>
                  Détails de votre projet
                </h2>
                <p className="text-gray-400 text-sm mb-6">Plus vous êtes précis, mieux nous pourrons vous orienter.</p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Pays de destination *
                    </label>
                    <select required value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-gray-50 focus:outline-none focus:ring-2"
                      style={{ borderRadius: '12px' }}>
                      <option value="">Sélectionner…</option>
                      <option value="france">🇫🇷 France</option>
                      <option value="canada">🇨🇦 Canada</option>
                      <option value="maroc">🇲🇦 Maroc</option>
                      <option value="turquie">🇹🇷 Turquie</option>
                      <option value="espagne">🇪🇸 Espagne</option>
                      <option value="autres">🌍 Autre</option>
                    </select>
                  </div>

                  {/* Nouveau champ : Type de visa (Caché si on vient de la page Études) */}
                  {!initialDestination && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Type de visa souhaité *
                      </label>
                      <select required value={form.visaType} onChange={(e) => setForm({ ...form, visaType: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-gray-50 focus:outline-none focus:ring-2"
                        style={{ borderRadius: '12px' }}>
                        <option value="">Sélectionner…</option>
                        <option value="etudes">🎓 Visa Étudiant</option>
                        <option value="visiteur">🧳 Visa Visiteur / Tourisme</option>
                        <option value="travail">💼 Visa de Travail</option>
                        <option value="affaires">🤝 Visa d'Affaires</option>
                        <option value="medical">🏥 Visa Médical</option>
                        <option value="autre">Plusieurs / Autre</option>
                        <option value="aucun">Je ne sais pas encore</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Budget estimatif (FCFA)
                    </label>
                    <select value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-gray-50 focus:outline-none focus:ring-2"
                      style={{ borderRadius: '12px' }}>
                      <option value="">Non défini pour l'instant</option>
                      <option value="moins-100k">Moins de 100 000 FCFA</option>
                      <option value="100k-300k">100 000 – 300 000 FCFA</option>
                      <option value="300k-500k">300 000 – 500 000 FCFA</option>
                      <option value="500k-1m">500 000 – 1 000 000 FCFA</option>
                      <option value="plus-1m">Plus de 1 000 000 FCFA</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Date de départ prévue
                    </label>
                    <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-gray-50 focus:outline-none focus:ring-2"
                      style={{ borderRadius: '12px' }} />
                  </div>

                  <div
                    className="flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all"
                    style={{ borderColor: form.documents ? '#0B84D8' : '#E5E7EB', backgroundColor: form.documents ? '#F0F8FF' : 'white' }}
                    onClick={() => setForm({ ...form, documents: !form.documents })}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#E8F4FD', color: '#0B84D8' }}>
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#333333] text-sm">J'ai des documents à joindre</p>
                      <p className="text-gray-400 text-xs">Diplômes, relevés de notes, justificatifs…</p>
                    </div>
                    <div className="ml-auto w-5 h-5 rounded flex items-center justify-center border-2"
                      style={{ borderColor: form.documents ? '#0B84D8' : '#D1D5DB', backgroundColor: form.documents ? '#0B84D8' : 'transparent' }}>
                      {form.documents && <CheckCircle className="w-3 h-3 text-white" />}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button type="button" onClick={handleBack}
                    className="flex-1 py-3.5 font-semibold border-2 border-gray-200 rounded-xl text-[#333333] hover:border-[#0B84D8] transition-all"
                    style={{ borderRadius: '12px' }}>
                    ← Retour
                  </button>
                  <button type="submit"
                    className="flex-1 py-3.5 text-white font-semibold flex items-center justify-center gap-2 transition-all hover:shadow-lg"
                    style={{ backgroundColor: '#0B84D8', borderRadius: '12px' }}>
                    Continuer <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: Coordonnées */}
            {currentStep === 3 && (
              <form onSubmit={handleSubmit}>
                <h2 className="text-[#333333] mb-2" style={{ fontSize: '1.3rem', fontWeight: 700 }}>
                  Vos coordonnées
                </h2>
                <p className="text-gray-400 text-sm mb-6">Pour vous recontacter avec votre bilan personnalisé.</p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Nom complet *
                    </label>
                    <input type="text" required placeholder="Prénom NOM"
                      value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-gray-50 focus:outline-none focus:ring-2"
                      style={{ borderRadius: '12px' }} />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Téléphone / WhatsApp *
                    </label>
                    <input type="tel" required placeholder="+221 7X XXX XX XX"
                      value={form.tel} onChange={(e) => setForm({ ...form, tel: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-gray-50 focus:outline-none focus:ring-2"
                      style={{ borderRadius: '12px' }} />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Email
                    </label>
                    <input type="email" placeholder="votre@email.com"
                      value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-gray-50 focus:outline-none focus:ring-2"
                      style={{ borderRadius: '12px' }} />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Informations complémentaires
                    </label>
                    <textarea rows={3} placeholder="Votre situation actuelle, questions particulières…"
                      value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-gray-50 focus:outline-none focus:ring-2 resize-none"
                      style={{ borderRadius: '12px' }} />
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4 mb-6 p-3 rounded-xl bg-[#F0F8FF]">
                  <Shield className="w-4 h-4" style={{ color: '#0B84D8' }} />
                  <p className="text-xs text-gray-500">
                    Vos données personnelles sont protégées et ne seront jamais partagées avec des tiers.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={handleBack}
                    className="flex-1 py-3.5 font-semibold border-2 border-gray-200 rounded-xl text-[#333333] hover:border-[#0B84D8] transition-all"
                    style={{ borderRadius: '12px' }}>
                    ← Retour
                  </button>
                  <button type="submit"
                    className="flex-1 py-3.5 text-white font-semibold transition-all hover:shadow-lg"
                    style={{ backgroundColor: '#0B84D8', borderRadius: '12px' }}>
                    Envoyer ma demande ✓
                  </button>
                </div>
              </form>
            )}

            {/* Step 4: Confirmation */}
            {currentStep === 4 && (
              <div className="text-center py-8">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: '#E8F4FD' }}>
                  <CheckCircle className="w-10 h-10" style={{ color: '#0B84D8' }} />
                </div>
                <h2 className="text-[#333333] mb-3" style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                  🎉 Demande envoyée !
                </h2>
                <p className="text-gray-500 mb-2 max-w-sm mx-auto">
                  Votre demande de devis a bien été reçue. Un conseiller Doxantu Travel vous
                  contactera dans les <strong>24 heures</strong>.
                </p>
                <p className="text-gray-400 text-sm mb-8">
                  Vous serez contacté par téléphone ou WhatsApp au numéro renseigné.
                </p>

                <div className="grid sm:grid-cols-2 gap-3 max-w-sm mx-auto mb-8">
                  <div className="p-4 rounded-2xl text-left" style={{ backgroundColor: '#F0F8FF' }}>
                    <p className="text-xs text-gray-500 mb-0.5">Service demandé</p>
                    <p className="font-semibold text-[#333333] text-sm">{form.service || '—'}</p>
                  </div>
                  <div className="p-4 rounded-2xl text-left" style={{ backgroundColor: '#F0F8FF' }}>
                    <p className="text-xs text-gray-500 mb-0.5">Destination</p>
                    <p className="font-semibold text-[#333333] text-sm">{form.destination || '—'}</p>
                  </div>
                  <div className="p-4 rounded-2xl text-left sm:col-span-2" style={{ backgroundColor: '#F0F8FF' }}>
                    <p className="text-xs text-gray-500 mb-0.5">Type de visa</p>
                    <p className="font-semibold text-[#333333] text-sm">{form.visaType || '—'}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 justify-center">
                  <a href="/" className="px-6 py-3 font-semibold text-sm"
                    style={{ backgroundColor: '#0B84D8', color: 'white', borderRadius: '12px' }}>
                    Retour à l'accueil
                  </a>
                  <a href="https://wa.me/221780000000" target="_blank" rel="noopener noreferrer"
                    className="px-6 py-3 font-semibold text-sm"
                    style={{ backgroundColor: '#25D366', color: 'white', borderRadius: '12px' }}>
                    💬 WhatsApp direct
                  </a>
                </div>
              </div>
            )}
          </motion.div>

          {/* Trust indicators */}
          {currentStep < 4 && (
            <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Données protégées</span>
              <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Gratuit & sans engagement</span>
              <span className="flex items-center gap-1">⏱ Réponse en moins de 24h</span>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
