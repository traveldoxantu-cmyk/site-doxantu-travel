import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle, ArrowRight, Shield, Clock, FileText, Globe, 
  BookOpen, X, Loader2, Send, Paperclip, Trash2, UploadCloud 
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { toast } from 'sonner';
import { apiFetch } from '../lib/api';
import { supabase } from '../lib/supabase';
import { useUser } from '../lib/context/UserContext';
import { useForm } from 'react-hook-form';
import { sheetsService } from '../lib/services/sheetsService';


const HERO_BG = 'https://images.unsplash.com/photo-1690323223790-4df744a1a033?crop=entropy&cs=tinysrgb&fit=max&fm=webp&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxEYWthciUyMFNlbmVnYWwlMjBjaXR5JTIwbW9kZXJuJTIwYWVyaWFsJTIwdmlld3xlbnwxfHx8fDE3NzIzMTAxNDl8MA&ixlib=rb-4.1.0&q=80&w=1080';

const services = [
  {
    icon: <BookOpen className="w-7 h-7" />,
    title: 'Visa Étudiant',
    badge: 'Le plus demandé',
    desc: 'Accompagnement complet pour votre visa d\'études (Campus France, D, type C...). Nous préparons votre dossier consulaire avec soin.',
    items: [
      'Analyse de votre situation',
      'Constitution du dossier',
      'Préparation à l\'entretien consulaire',
      'Suivi jusqu\'à la décision',
    ],
    highlight: true,
    tag: 'visa-etudiant'
  },
  {
    icon: <Globe className="w-7 h-7" />,
    title: 'Visa Tourisme',
    badge: null,
    desc: 'Visa Schengen, visa Canada, visa USA et bien plus. Nous simplifions vos démarches pour que vous puissiez voyager l\'esprit tranquille.',
    items: [
      'Visa Schengen (France, Espagne, etc.)',
      'Visa Canada & USA',
      'Visa Turquie & Maroc',
      'Autres destinations',
    ],
    highlight: false,
    tag: 'visa-tourisme'
  },
  {
    icon: <FileText className="w-7 h-7" />,
    title: 'Légalisation & Traduction',
    badge: null,
    desc: 'Légalisation de documents officiels, traductions certifiées et apostille. Validité internationale garantie.',
    items: [
      'Apostille de documents sénégalais',
      'Traduction certifiée (FR, EN, AR)',
      'Légalisation notariale',
      'Copie certifiée conforme',
    ],
    highlight: false,
    tag: 'legalisation'
  },
];

const process = [
  { step: '01', title: 'Consultation', desc: 'Analyse de votre dossier et identification des besoins' },
  { step: '02', title: 'Préparation', desc: 'Constitution et vérification de tous les documents requis' },
  { step: '03', title: 'Dépôt', desc: 'Dépôt du dossier à l\'ambassade ou au consulat concerné' },
  { step: '04', title: 'Suivi', desc: 'Suivi de votre dossier jusqu\'à la décision finale' },
];

interface VisaFormValues {
  nom: string;
  tel: string;
  email: string;
  destination: string;
  message: string;
  extra: Record<string, string>;
}

export function VisaAssistance() {
  const { user } = useUser();
  const [selectedService, setSelectedService] = useState<typeof services[0] | null>(null);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset } = useForm<VisaFormValues>({
    defaultValues: {
      nom: '',
      tel: '',
      email: '',
      destination: '',
      message: '',
      extra: {}
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (idx: number) => {
    setFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const onFormSubmit = async (data: VisaFormValues) => {
    setLoading(true);

    try {

      // 1. Upload files first if any
      const fileUrls: string[] = [];
      if (files.length > 0) {
        if (!supabase) {
          console.error("Supabase client non initialisé");
          toast.error("Le service de stockage est indisponible.");
          setLoading(false);
          return;
        }

        for (const file of files) {
          // File Size Check (10MB limit)
          if (file.size > 10 * 1024 * 1024) {
            toast.error(`Le fichier "${file.name}" est trop volumineux (max 10Mo).`);
            setLoading(false);
            return;
          }

          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
          const filePath = `visa_requests/${Date.now()}_${fileName}`;

          console.log(`Tentative d'upload: ${filePath}`);
          const toastId = toast.loading(`Envoi de "${file.name}"...`);
          
          const { error: uploadError } = await supabase.storage
            .from('documents')
            .upload(filePath, file, { 
              cacheControl: '3600',
              upsert: false 
            });

          toast.dismiss(toastId);

          if (uploadError) {
            console.error("Erreur Upload Supabase:", uploadError);
            toast.error(`Échec de l'envoi du fichier "${file.name}".`);
            throw uploadError;
          }

          const { data: { publicUrl } } = supabase.storage
            .from('documents')
            .getPublicUrl(filePath);
          fileUrls.push(publicUrl);
        }
      }

      // 2. Save demand to DB
      const demandData = {
        type: 'visa_request',
        nom: data.nom,
        email: data.email,
        tel: data.tel,
        service: selectedService?.title || 'Visa',
        status: 'nouveau',
        user_id: user?.id || null,
        data: {
          serviceTag: selectedService?.tag,
          ...data,
          files: fileUrls,
          recipient: 'traveldoxantu@gmail.com',
          submittedAt: new Date().toISOString()
        }
      };

      // 2. Save demand to DB (EN ARRIÈRE-PLAN)
      apiFetch('/demandes', {
        method: 'POST',
        body: JSON.stringify(demandData)
      }).catch(err => {
        console.error("Échec discret de l'enregistrement Visa DB:", err);
      });

      // 3. Sync to Google Sheets (CRM)
      sheetsService.sendDemande({
        nom: data.nom,
        email: data.email,
        tel: data.tel,
        service: selectedService?.title || 'Visa',
        destination: data.destination || data.extra?.destination || 'Non spécifiée',
        message: data.message,
        files: fileUrls,
        source: 'Formulaire Visa Assistance'
      }).catch(err => console.error("[VisaAssistance] Erreur synchro Sheets:", err));

      toast.success("Votre demande et vos documents ont été envoyés !");
      setSelectedService(null);
      setFiles([]);
      reset();
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de l'envoi. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-sans">
      <SEO 
        title="Assistance Visa Sénégal | France, Canada, Schengen, USA" 
        description="Besoin d'aide pour votre visa au Sénégal ? Doxantu Travel vous accompagne pour vos demandes de visa étudiant (Campus France), tourisme ou affaires. Dossier complet, vérifié et suivi consulaire à Dakar." 
        image={HERO_BG}
      />
      
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden pt-28">
        <div className="absolute inset-0 z-0">
          <img
            src={HERO_BG}
            alt="Dakar Aerial View"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(102deg, rgba(7,42,80,0.92) 5%, rgba(7,42,80,0.7) 40%, rgba(11,132,216,0.4) 70%, rgba(8,31,62,0.95) 100%)' }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full mb-6"
              style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'white' }}>
              <FileText className="w-4 h-4 mr-1 text-blue-300" /> Visa & Documents officiels
            </span>
            <h1 className="text-white mb-5"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 800, lineHeight: 1.2 }}>
              Simplifiez vos<br />
              <span style={{ color: '#7dd3fc' }}>démarches administratives</span>
            </h1>
            <p className="text-blue-100 max-w-xl mb-8" style={{ fontSize: '1.05rem', lineHeight: 1.7 }}>
              Visa étudiant, visa tourisme, légalisation de documents, nous gérons tout
              pour vous permettre de vous concentrer sur l'essentiel.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="https://wa.me/221776748596" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-4 font-semibold transition-all shadow-lg hover:shadow-blue-400/20 active:scale-95"
                style={{ backgroundColor: 'white', color: '#072a50', borderRadius: '16px' }}>
                💬 Discuter sur WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-white" id="services">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <span className="text-sm font-semibold uppercase tracking-widest mb-3 block" style={{ color: '#0B84D8' }}>
              Nos services visa
            </span>
            <h2 className="text-[#1a2b40]" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800 }}>
              Une expertise pour chaque besoin
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className={`rounded-[40px] p-10 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden group ${
                  s.highlight ? 'border-2 border-[#0B84D8] bg-blue-50/30' : 'border border-gray-100 bg-white'
                }`}
              >
                {s.badge && (
                  <div
                    className="absolute top-5 right-5 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full text-white shadow-lg shadow-blue-500/20"
                    style={{ backgroundColor: '#0B84D8' }}
                  >
                    {s.badge}
                  </div>
                )}
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-transform group-hover:scale-110 duration-500 ${
                    s.highlight ? 'bg-[#0B84D8] text-white shadow-lg shadow-blue-500/30' : 'bg-blue-50 text-[#0B84D8]'
                  }`}
                >
                  {s.icon}
                </div>
                <h3 className="text-[#1a2b40] mb-4" style={{ fontSize: '1.4rem', fontWeight: 800 }}>
                  {s.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6 font-medium">{s.desc}</p>
                <ul className="space-y-3 mb-10">
                  {s.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-3 text-[13px] font-bold text-gray-600">
                      <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-3 h-3" style={{ color: '#0B84D8' }} />
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setSelectedService(s)}
                  className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl text-sm font-black transition-all group/btn"
                  style={s.highlight 
                    ? { backgroundColor: '#0B84D8', color: 'white', boxShadow: '0 10px 20px -5px rgba(11,132,216,0.3)' } 
                    : { border: '2px solid #F1F5F9', color: '#1a2b40' }
                  }
                >
                  Faire ma demande 
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-sm font-semibold uppercase tracking-widest mb-3 block" style={{ color: '#0B84D8' }}>
              Comment ça marche
            </span>
            <h2 className="text-[#1a2b40]" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800 }}>
              Un processus simple en 4 étapes
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 text-center hover:shadow-xl transition-all group"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6 font-black text-white text-lg transition-transform group-hover:rotate-12 duration-500 shadow-lg shadow-blue-500/20"
                  style={{ backgroundColor: '#0B84D8' }}
                >
                  {p.step}
                </div>
                <h4 className="text-[#1a2b40] font-black mb-3">{p.title}</h4>
                <p className="text-gray-400 text-sm font-medium leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & CTA */}
      <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8 mb-20">
            {[
              { icon: <Shield />, title: 'Dossier vérifié', desc: 'Chaque document est contrôlé avant soumission pour maximiser vos chances.' },
              { icon: <Clock />, title: 'Délais respectés', desc: 'Nous suivons vos délais consulaires avec rigueur pour aucun retard.' },
              { icon: <CheckCircle />, title: 'Taux de succès élevé', desc: 'Plus de 95% de nos dossiers obtiennent un résultat positif la première fois.' },
            ].map((t, i) => (
              <motion.div
                key={i}
                className="p-8 rounded-[32px] border border-gray-100 hover:border-[#0B84D8]/30 hover:bg-blue-50/10 transition-all flex flex-col items-center text-center group"
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-blue-50 text-[#0B84D8] group-hover:scale-110 transition-transform duration-500">
                  {t.icon}
                </div>
                <h4 className="text-[#1a2b40] font-black mb-3">{t.title}</h4>
                <p className="text-gray-500 text-sm font-medium leading-relaxed">{t.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="relative p-12 md:p-20 rounded-[48px] overflow-hidden group shadow-2xl">
            <div className="absolute inset-0 bg-[#072a50]" />
            <div className="absolute inset-0 opacity-40 mix-blend-overlay bg-[url('https://images.unsplash.com/photo-1539650116574-8efeb43e2750?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(7,42,80,0.9) 0%, rgba(11,132,216,0.7) 100%)' }} />
            
            <div className="relative text-center max-w-2xl mx-auto">
              <h2 className="text-white mb-6" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, lineHeight: 1.2 }}>
                Prêt à démarrer votre demande ?
              </h2>
              <p className="text-blue-100/80 mb-10 text-lg font-medium">Réponse garantie en moins de 24 heures. Consultation gratuite et sans engagement.</p>
              <div className="flex flex-wrap gap-4 justify-center">
                <button 
                  onClick={() => setSelectedService(services[0])}
                  className="px-10 py-5 bg-white text-[#0B84D8] font-black rounded-2xl hover:scale-105 transition-all shadow-xl active:scale-95"
                >
                  Faire ma demande immédiate
                </button>
                <a href="https://wa.me/221776748596" target="_blank" rel="noopener noreferrer" className="px-10 py-5 bg-white/10 backdrop-blur-md border border-white/20 text-white font-black rounded-2xl hover:bg-white/20 transition-all active:scale-95">
                  Parler à un expert
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MODAL FORM */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelectedService(null)}
              className="fixed inset-0 bg-[#072a50]/60 backdrop-blur-xl" 
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-[40px] shadow-2xl my-auto border border-white/20 overflow-hidden"
            >
              <button 
                onClick={() => setSelectedService(null)}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-[#0B84D8] hover:text-white transition-all z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-8 sm:p-10 max-h-[90vh] overflow-y-auto custom-scrollbar">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-[#0B84D8]">
                    {selectedService.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-[#1a2b40] leading-none">Demande de {selectedService.title}</h3>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1.5">Formulaire confidentiel</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
                  {/* Common Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Nom complet</label>
                      <input 
                        {...register('nom', { required: true })}
                        type="text" 
                        placeholder="Votre nom complet"
                        className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#0B84D8]/20 focus:bg-white transition-all text-sm font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Téléphone</label>
                      <input 
                        {...register('tel', { required: true })}
                        type="tel" 
                        placeholder="+221 7X XXX XX XX"
                        className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#0B84D8]/20 focus:bg-white transition-all text-sm font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Email</label>
                    <input 
                      {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
                      type="email" 
                      placeholder="votre@email.com"
                      className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#0B84D8]/20 focus:bg-white transition-all text-sm font-bold"
                    />
                  </div>

                  {/* Contextual Fields */}
                  <div className="space-y-6 pt-2 border-t border-gray-100">
                    {selectedService.tag === 'legalisation' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Langue cible</label>
                          <select 
                            {...register('extra.langue')}
                            className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#0B84D8]/20 focus:bg-white transition-all text-sm font-bold"
                          >
                            <option value="Francais">Français</option>
                            <option value="Anglais">Anglais</option>
                            <option value="Arabe">Arabe</option>
                            <option value="Autre">Autre</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Nombre de pages</label>
                          <input 
                            {...register('extra.pages')}
                            type="number" 
                            min="1"
                            placeholder="1"
                            className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#0B84D8]/20 focus:bg-white transition-all text-sm font-bold"
                          />
                        </div>
                      </div>
                    )}

                    {selectedService.tag === 'visa-etudiant' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Niveau d'études</label>
                          <select 
                            {...register('extra.niveau')}
                            className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#0B84D8]/20 focus:bg-white transition-all text-sm font-bold"
                          >
                            <option value="Licence">Licence</option>
                            <option value="Master">Master</option>
                            <option value="Doctorat">Doctorat</option>
                            <option value="Autre">Autre</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Destination</label>
                          <input 
                            {...register('destination')}
                            type="text" 
                            placeholder="Ex: France, Canada..."
                            className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#0B84D8]/20 focus:bg-white transition-all text-sm font-bold"
                          />
                        </div>
                      </div>
                    )}

                    {selectedService.tag === 'visa-tourisme' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Motif du voyage</label>
                          <select 
                            {...register('extra.motif')}
                            className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#0B84D8]/20 focus:bg-white transition-all text-sm font-bold"
                          >
                            <option value="Tourisme">Tourisme</option>
                            <option value="Visite familiale">Visite familiale</option>
                            <option value="Affaires">Affaires</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Durée du séjour</label>
                          <input 
                            {...register('extra.duree')}
                            type="text" 
                            placeholder="Ex: 15 jours"
                            className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#0B84D8]/20 focus:bg-white transition-all text-sm font-bold"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Message / Précisions */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Précisions (Optionnel)</label>
                    <textarea 
                      {...register('message')}
                      placeholder="Comment pouvons-nous vous aider ?"
                      rows={3}
                      className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#0B84D8]/20 focus:bg-white transition-all text-sm font-bold resize-none"
                    />
                  </div>

                  {/* File Upload Section */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">
                      {selectedService.tag === 'legalisation' ? 'Documents à traduire / légaliser' : 'Documents complémentaires (Optionnel)'}
                    </label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="group cursor-pointer border-2 border-dashed border-gray-200 rounded-3xl p-8 flex flex-col items-center justify-center transition-all hover:border-[#0B84D8] hover:bg-blue-50/30"
                    >
                      <input 
                        type="file" 
                        multiple 
                        ref={fileInputRef}
                        className="hidden" 
                        onChange={handleFileChange}
                      />
                      <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#0B84D8] group-hover:text-white transition-all mb-3">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <p className="text-xs font-bold text-gray-500">Cliquez pour ajouter vos documents</p>
                      <p className="text-[9px] text-gray-300 mt-1 uppercase font-black tracking-widest">PDF, JPG, PNG (Max 10MB)</p>
                    </div>

                    {/* File List */}
                    <AnimatePresence>
                      {files.length > 0 && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="space-y-2 mt-4"
                        >
                          {files.map((f, i) => (
                            <motion.div 
                              key={i}
                              initial={{ x: -10, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                            >
                              <div className="flex items-center gap-3">
                                <Paperclip className="w-4 h-4 text-[#0B84D8]" />
                                <span className="text-[11px] font-bold text-gray-600 truncate max-w-[200px]">{f.name}</span>
                              </div>
                              <button 
                                type="button"
                                onClick={() => removeFile(i)}
                                className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all rounded-lg"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="pt-4">
                    <button 
                      disabled={loading}
                      className="w-full py-5 bg-[#0B84D8] text-white font-black rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-blue-500/20 hover:bg-black transition-all active:scale-95 disabled:opacity-50"
                    >
                      {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          Soumettre mon dossier <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                    <p className="text-[9px] text-gray-400 text-center font-bold uppercase tracking-widest mt-4">
                      🔐 Vos données sont sécurisées et traitées sous 24h
                    </p>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
