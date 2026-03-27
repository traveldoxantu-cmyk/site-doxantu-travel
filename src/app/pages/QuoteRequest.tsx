import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'motion/react';
import { Upload, ArrowRight, CheckCircle, Shield, GraduationCap, Plane, FileText, Globe, Scale, Package } from 'lucide-react';
import { useSearchParams } from 'react-router';
import { buildWhatsAppMessage, openWhatsAppSubmission } from '../lib/submission';
import { SEO } from '../components/SEO';
import { toast } from 'sonner';
import { apiFetch } from '../lib/api';
import { useUser } from '../lib/context/UserContext';

import { storageService } from '../lib/services/storageService';
import { sheetsService } from '../lib/services/sheetsService';

type QuoteFormValues = {
  service: string;
  destination: string;
  budget: string;
  visaType: string;
  date: string;
  documents: boolean;
  nom: string;
  email: string;
  tel: string;
  message: string;
  niveauEtude: string;
};

const HERO_BG = 'https://images.unsplash.com/photo-1690323223790-4df744a1a033?crop=entropy&cs=tinysrgb&fit=max&fm=webp&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxEYWthciUyMFNlbmVnYWwlMjBjaXR5JTIwbW9kZXJuJTIwYWVyaWFsJTIwdmlld3xlbnwxfHx8fDE3NzIzMTAxNDl8MA&ixlib=rb-4.1.0&q=80&w=1080';

export function QuoteRequest() {
  const { user } = useUser();
  const [searchParams] = useSearchParams();
  const initialDestination = searchParams.get('destination') || '';
  const initialService = searchParams.get('service') || '';

  const [currentStep, setCurrentStep] = useState((initialDestination || initialService) ? 3 : 1);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, setValue, watch, trigger } = useForm<QuoteFormValues>({
    defaultValues: {
      service: initialService || (initialDestination ? 'campus-france' : ''),
      destination: initialDestination,
      budget: '',
      visaType: (initialDestination || initialService === 'visa-etudiant') ? 'etudes' : '',
      date: '',
      documents: false,
      nom: '',
      email: '',
      tel: '',
      message: '',
      niveauEtude: '',
    }
  });

  const [files, setFiles] = useState<File[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const form = watch();
  const isProjectMode = searchParams.get('mode') === 'projet';
  const needsStudyLevel = ['campus-france', 'visa-etudiant', 'pack-complet'].includes(form.service);

  const handleNext = async () => {
    let fieldsToValidate: (keyof QuoteFormValues)[] = [];
    if (currentStep === 1) fieldsToValidate = ['service'];
    if (currentStep === 2) fieldsToValidate = ['destination', 'visaType'];
    if (currentStep === 3) fieldsToValidate = ['nom', 'tel', 'email', 'niveauEtude'];

    const isValid = await trigger(fieldsToValidate);
    if (!isValid && currentStep !== 1) {
      toast.error("Veuillez remplir les champs obligatoires.");
      return;
    }

    if (currentStep === 1 && isProjectMode) {
      setCurrentStep(3);
    } else if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep === 3 && isProjectMode) {
      setCurrentStep(1);
    } else if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onFormSubmit = async (data: QuoteFormValues) => {
    setLoading(true);
    let uploadedUrls: string[] = [];

    try {
      // 1. Upload files first if any
      if (files.length > 0) {
        setUploadingFiles(true);
        const uploadPromises = files.map(file => {
          const path = `demandes/${Date.now()}_${file.name}`;
          return storageService.uploadFile('documents', path, file);
        });
        uploadedUrls = await Promise.all(uploadPromises);
        setUploadingFiles(false);
      }

      const message = buildWhatsAppMessage("Nouvelle demande d'accompagnement", {
        "Service": data.service,
        "Destination": data.destination,
        "Type de visa": data.visaType || 'Non spécifié',
        Budget: data.budget,
        'Date prevue': data.date,
        'Documents': uploadedUrls.length > 0 ? `${uploadedUrls.length} fichiers joints` : 'Aucun',
        Nom: data.nom,
        Telephone: data.tel,
        Email: data.email,
        "Niveau d'etudes": data.niveauEtude || 'Non renseigné',
        Message: data.message,
      });
      
      // 2. Enregistrement en base de données
      await apiFetch('/demandes', {
        method: 'POST',
        body: JSON.stringify({
          type: data.service === 'billet-retour' ? 'billetterie' : 'accompagnement',
          nom: data.nom,
          email: data.email,
          tel: data.tel,
          service: data.service,
          status: 'pending',
          user_id: user?.id || null,
          data: {
            ...data,
            fileUrls: uploadedUrls,
            recipient: 'traveldoxantu@gmail.com',
            createdAt: new Date().toISOString()
          }
        })
      });

      // 3. Envoi vers Google Sheets (Automation Marketing)
      await sheetsService.sendDemande({
        ...data,
        files: uploadedUrls.join(', ')
      });

      openWhatsAppSubmission(message);
      setCurrentStep(4);
      toast.success("Votre demande et vos documents ont été transmis avec succès !");
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de l'envoi. Veuillez vérifier vos fichiers ou votre connexion.");
    } finally {
      setLoading(false);
      setUploadingFiles(false);
    }
  };

  return (
    <div>
      <SEO 
        title="Demande de Devis Personnalisé | Doxantu Travel" 
        description="Obtenez un devis gratuit pour votre projet de voyage ou d'études à l'étranger. Réponse rapide en moins de 24h par nos experts conseillers."
        image={HERO_BG}
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
              {isProjectMode ? 'Lancer mon projet' : 'Faire ma demande'}
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
              { id: 2, label: 'Détails', hidden: isProjectMode },
              { id: 3, label: 'Projet' },
              { id: 4, label: 'Validation' },
            ].filter(s => !s.hidden).map((step, i, filtered) => (
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
                {i < filtered.length - 1 && (
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
                      type="button"
                      onClick={() => setValue('service', opt.value)}
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
                  type="button"
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
              <div>
                <h2 className="text-[#333333] mb-2" style={{ fontSize: '1.3rem', fontWeight: 700 }}>
                  Détails de votre projet
                </h2>
                <p className="text-gray-400 text-sm mb-6">Plus vous êtes précis, mieux nous pourrons vous orienter.</p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Pays de destination *
                    </label>
                    <select 
                      {...register('destination', { required: true })}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm bg-gray-50 focus:outline-none focus:ring-2"
                      style={{ borderRadius: '14px' }}>
                      <option value="">Sélectionner…</option>
                      <option value="france">🇫🇷 France</option>
                      <option value="canada">🇨🇦 Canada</option>
                      <option value="maroc">🇲🇦 Maroc</option>
                      <option value="turquie">🇹🇷 Turquie</option>
                      <option value="espagne">🇪🇸 Espagne</option>
                      <option value="autres">🌍 Autre</option>
                    </select>
                  </div>

                  {!initialDestination && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Type de visa souhaité *
                      </label>
                      <select 
                        {...register('visaType', { required: true })}
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
                    <select 
                      {...register('budget')}
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
                    <input 
                      {...register('date')}
                      type="date" 
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm bg-gray-50 focus:outline-none focus:ring-2"
                      style={{ borderRadius: '14px' }} />
                  </div>

                  <div
                    className="flex flex-col gap-4 p-5 rounded-2xl border-2 transition-all"
                    style={{ borderColor: form.documents ? '#0B84D8' : '#E5E7EB', backgroundColor: form.documents ? '#F0F8FF' : 'white' }}
                  >
                    <div className="flex items-center gap-4 cursor-pointer" onClick={() => setValue('documents', !form.documents)}>
                      <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#E8F4FD', color: '#0B84D8' }}>
                        <Upload className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-[#333333] text-sm">Joindre mes justificatifs</p>
                        <p className="text-gray-400 text-xs">Passeport, diplômes, relevés (PDF/Images)</p>
                      </div>
                      <div className="w-5 h-5 rounded flex items-center justify-center border-2"
                        style={{ borderColor: form.documents ? '#0B84D8' : '#D1D5DB', backgroundColor: form.documents ? '#0B84D8' : 'transparent' }}>
                        {form.documents && <CheckCircle className="w-3 h-3 text-white" />}
                      </div>
                    </div>

                    {form.documents && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-2 pt-4 border-t border-blue-100"
                      >
                        <input
                          type="file"
                          multiple
                          accept=".pdf,image/*"
                          className="hidden"
                          id="file-upload"
                          onChange={(e) => {
                            const newFiles = Array.from(e.target.files || []);
                            setFiles(prev => [...prev, ...newFiles]);
                          }}
                        />
                        <label 
                          htmlFor="file-upload"
                          className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-blue-200 rounded-xl bg-white hover:bg-blue-50 transition-colors cursor-pointer group"
                        >
                          <Upload className="w-6 h-6 text-[#0B84D8] mb-2 group-hover:scale-110 transition-transform" />
                          <p className="text-xs font-bold text-gray-500">Ajouter des fichiers</p>
                          <p className="text-[10px] text-gray-400 mt-1">PDF ou Images (Max 10MB)</p>
                        </label>
                        
                        {files.length > 0 && (
                          <div className="mt-4 space-y-2">
                            {files.map((file, i) => (
                              <div key={i} className="flex justify-between items-center p-2 bg-white rounded-lg border border-gray-100 text-[11px] font-medium">
                                <div className="flex items-center gap-2 truncate">
                                  <FileText className="w-3 h-3 text-[#0B84D8]" />
                                  <span className="truncate">{file.name}</span>
                                </div>
                                <button 
                                  type="button"
                                  onClick={() => setFiles(prev => prev.filter((_, idx) => idx !== i))}
                                  className="text-red-400 hover:text-red-600 p-1"
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <button type="button" onClick={handleBack}
                    className="flex-1 py-4 font-bold border-2 border-gray-100 rounded-2xl text-[#333333] hover:border-[#0B84D8] hover:text-[#0B84D8] transition-all"
                  >
                    ← Retour
                  </button>
                  <button 
                    type="button"
                    onClick={handleNext}
                    className="flex-1 py-4 text-white font-bold flex items-center justify-center gap-3 transition-all hover:shadow-xl hover:-translate-y-1 shadow-md shadow-[#0B84D8]/20"
                    style={{ backgroundColor: '#0B84D8', borderRadius: '14px' }}>
                    Continuer <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Coordonnées */}
            {currentStep === 3 && (
              <form onSubmit={handleSubmit(onFormSubmit)}>
                <h2 className="text-[#333333] mb-2" style={{ fontSize: '1.3rem', fontWeight: 700 }}>
                  {isProjectMode ? 'À propos de vous' : 'Vos coordonnées'}
                </h2>
                <p className="text-gray-400 text-sm mb-6">
                  {isProjectMode ? 'Parlez-nous de vous pour démarrer l\'évaluation.' : 'Pour vous recontacter avec votre bilan personnalisé.'}
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Nom complet *
                    </label>
                    <input 
                      {...register('nom', { required: true })}
                      type="text" 
                      placeholder="Prénom NOM"
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm bg-gray-50 focus:outline-none focus:ring-2"
                      style={{ borderRadius: '14px' }} />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Téléphone / WhatsApp *
                    </label>
                    <input 
                      {...register('tel', { required: true })}
                      type="tel" 
                      placeholder="+221 7X XXX XX XX"
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm bg-gray-50 focus:outline-none focus:ring-2"
                      style={{ borderRadius: '14px' }} />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Email
                    </label>
                    <input 
                      {...register('email', { pattern: /^\S+@\S+$/i })}
                      type="email" 
                      placeholder="votre@email.com"
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm bg-gray-50 focus:outline-none focus:ring-2"
                      style={{ borderRadius: '14px' }} />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Niveau d'études actuel {needsStudyLevel ? '*' : '(optionnel)'}
                    </label>
                    <select 
                      {...register('niveauEtude', { required: needsStudyLevel })}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm bg-gray-50 focus:outline-none focus:ring-2"
                      style={{ borderRadius: '14px' }}>
                      <option value="">Sélectionner votre niveau…</option>
                      <option value="bac">Baccalauréat</option>
                      <option value="licence-1">Licence 1</option>
                      <option value="licence-2">Licence 2</option>
                      <option value="licence-3">Licence 3</option>
                      <option value="master-1">Master 1</option>
                      <option value="master-2">Master 2</option>
                      <option value="doctorat">Doctorat</option>
                      <option value="professionnel">Professionnel / Autre</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Informations complémentaires
                    </label>
                    <textarea 
                      {...register('message')}
                      rows={3} 
                      placeholder="Votre situation actuelle, questions particulières…"
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
                  <button
                    type="submit"
                    disabled={loading || uploadingFiles}
                    className="w-full py-4 text-white font-bold rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-xl hover:-translate-y-1 active:scale-95 disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg, #0B84D8 0%, #0973BD 100%)' }}
                  >
                    {loading || uploadingFiles ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>Transmettre mon dossier <ArrowRight className="w-4 h-4" /></>
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
                  <a href="https://wa.me/221776748596" target="_blank" rel="noopener noreferrer"
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
