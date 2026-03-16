import { useState } from 'react';
import { motion } from 'motion/react';
import { Upload, ArrowRight, CheckCircle, Shield, GraduationCap, Plane, FileText, Globe, Scale, Package } from 'lucide-react';
import { useSearchParams } from 'react-router';
import { buildWhatsAppMessage, openWhatsAppSubmission } from '../lib/submission';
import { SEO } from '../components/SEO';
import { apiFetch } from '../lib/api';

const HERO_BG = 'https://images.unsplash.com/photo-1690323223790-4df744a1a033?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxEYWthciUyMFNlbmVnYWwlMjBjaXR5JTIwbW9kZXJuJTIwYWVyaWFsJTIwdmlld3xlbnwxfHx8fDE3NzIzMTAxNDl8MA&ixlib=rb-4.1.0&q=80&w=1080';

export function QuoteRequest() {
  const [searchParams] = useSearchParams();
  const initialDestination = searchParams.get('destination') || '';

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
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
    
    // Enregistrement sur le serveur JSON
    try {
      await apiFetch('/demandes', {
        method: 'POST',
        body: JSON.stringify({
          type: 'accompagnement',
          data: form,
          status: 'nouveau',
          createdAt: new Date().toISOString()
        })
      });
      openWhatsAppSubmission(message);
      setCurrentStep(4);
    } catch (err) {
      console.error(err);
      alert('Erreur lors de l\'enregistrement de votre demande. Veuillez vérifier votre connexion au serveur.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <SEO 
        title="Commencer ma demande | Doxantu Travel" 
        description="Faites une évaluation gratuite de votre profil pour étudier à l'étranger avec Doxantu Travel." 
      />
      {/* Hero */}
      <section
        className="relative min-h-[45vh] flex items-center pt-32 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden"
      >
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={HERO_BG}
            alt="Dakar Aerial View"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(102deg, rgba(7,42,80,0.92) 5%, rgba(7,42,80,0.7) 40%, rgba(11,132,216,0.4) 70%, rgba(8,31,62,0.95) 100%)' }} />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <h1 className="text-white mb-6" style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 800, lineHeight: 1.2 }}>
              Commencer ma demande
            </h1>
            <p className="text-blue-100 max-w-lg mx-auto" style={{ fontSize: '1.05rem', lineHeight: 1.6 }}>
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
            className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 border border-blue-50/50"
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
                    { value: 'campus-france', label: 'Accompagnement Étudiant', desc: 'Procédure Campus France complète', icon: <GraduationCap className="w-5 h-5" /> },
                    { value: 'billet-retour', label: 'Billetterie', desc: 'Vols nationaux & internationaux', icon: <Plane className="w-5 h-5" /> },
                    { value: 'visa-etudiant', label: 'Visa Étudiant', desc: 'Préparation du dossier consulaire', icon: <FileText className="w-5 h-5" /> },
                    { value: 'visa-tourisme', label: 'Visa Tourisme', desc: 'Schengen, Canada, USA...', icon: <Globe className="w-5 h-5" /> },
                    { value: 'legalisation', label: 'Légalisation & Traduction', desc: 'Documents officiels', icon: <Scale className="w-5 h-5" /> },
                    { value: 'pack-complet', label: 'Pack Complet', desc: 'Campus France + Visa + Billet', icon: <Package className="w-5 h-5" /> },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setForm({ ...form, service: opt.value })}
                      className="p-5 rounded-3xl text-left transition-all border-2 flex flex-col gap-3 group"
                      style={{
                        borderColor: form.service === opt.value ? '#0B84D8' : '#F1F5F9',
                        backgroundColor: form.service === opt.value ? '#F0F8FF' : 'white',
                      }}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                        form.service === opt.value ? 'bg-[#0B84D8] text-white' : 'bg-[#F8FAFC] text-gray-400 group-hover:bg-[#E8F4FD] group-hover:text-[#0B84D8]'
                      }`}>
                        {opt.icon}
                      </div>
                      <div>
                        <p className="font-bold text-[#333333] text-sm">{opt.label}</p>
                        <p className="text-gray-400 text-xs mt-0.5">{opt.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  disabled={!form.service}
                  className="w-full mt-8 py-4 text-white font-bold flex items-center justify-center gap-3 transition-all hover:shadow-xl hover:-translate-y-1 disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-[#0B84D8]/20"
                  style={{ backgroundColor: '#0B84D8', borderRadius: '14px' }}
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
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm bg-gray-50 focus:outline-none focus:ring-2"
                      style={{ borderRadius: '14px' }}>
                      <option value="">Sélectionner…</option>
                      <option value="france">France</option>
                      <option value="canada">Canada</option>
                      <option value="maroc">Maroc</option>
                      <option value="turquie">Turquie</option>
                      <option value="espagne">Espagne</option>
                      <option value="autres">Autre</option>
                    </select>
                  </div>

                  {/* Nouveau champ : Type de visa (Caché si on vient de la page Études) */}
                  {!initialDestination && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Type de visa souhaité *
                      </label>
                      <select required value={form.visaType} onChange={(e) => setForm({ ...form, visaType: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm bg-gray-50 focus:outline-none focus:ring-2"
                        style={{ borderRadius: '14px' }}>
                        <option value="">Sélectionner…</option>
                        <option value="etudes">Visa Étudiant</option>
                        <option value="visiteur">Visa Visiteur / Tourisme</option>
                        <option value="travail">Visa de Travail</option>
                        <option value="affaires">Visa d'Affaires</option>
                        <option value="medical">Visa Médical</option>
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
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm bg-gray-50 focus:outline-none focus:ring-2"
                      style={{ borderRadius: '14px' }}>
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
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm bg-gray-50 focus:outline-none focus:ring-2"
                      style={{ borderRadius: '14px' }} />
                  </div>

                  <div
                    className="flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all"
                    style={{ borderColor: form.documents ? '#0B84D8' : '#E5E7EB', backgroundColor: form.documents ? '#F0F8FF' : 'white' }}
                    onClick={() => setForm({ ...form, documents: !form.documents })}
                  >
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#E8F4FD', color: '#0B84D8' }}>
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

                <div className="flex gap-4 mt-8">
                  <button type="button" onClick={handleBack}
                    className="flex-1 py-4 font-bold border-2 border-gray-100 rounded-2xl text-[#333333] hover:border-[#0B84D8] hover:text-[#0B84D8] transition-all"
                  >
                    ← Retour
                  </button>
                  <button type="submit"
                    className="flex-1 py-4 text-white font-bold flex items-center justify-center gap-3 transition-all hover:shadow-xl hover:-translate-y-1 shadow-md shadow-[#0B84D8]/20"
                    style={{ backgroundColor: '#0B84D8', borderRadius: '14px' }}>
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
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm bg-gray-50 focus:outline-none focus:ring-2"
                      style={{ borderRadius: '14px' }} />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Téléphone / WhatsApp *
                    </label>
                    <input type="tel" required placeholder="+221 7X XXX XX XX"
                      value={form.tel} onChange={(e) => setForm({ ...form, tel: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm bg-gray-50 focus:outline-none focus:ring-2"
                      style={{ borderRadius: '14px' }} />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Email
                    </label>
                    <input type="email" placeholder="votre@email.com"
                      value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm bg-gray-50 focus:outline-none focus:ring-2"
                      style={{ borderRadius: '14px' }} />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Informations complémentaires
                    </label>
                    <textarea rows={3} placeholder="Votre situation actuelle, questions particulières…"
                      value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm bg-gray-50 focus:outline-none focus:ring-2 resize-none"
                      style={{ borderRadius: '14px' }} />
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
                    className="flex-1 py-3.5 font-semibold border-2 border-gray-200 rounded-2xl text-[#333333] hover:border-[#0B84D8] transition-all"
                    style={{ borderRadius: '14px' }}>
                    ← Retour
                  </button>
                  <button type="submit"
                    disabled={loading}
                    className="flex-1 py-3.5 text-white font-semibold transition-all hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-[#0B84D8]/20"
                    style={{ backgroundColor: '#0B84D8', borderRadius: '14px' }}>
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>Envoyer ma demande ✓</>
                    )}
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
