import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion, Variants } from 'motion/react';
import {
  GraduationCap,
  Plane,
  FileText,
  Shield,
  CheckCircle,
  Star,
  ArrowRight,
  MapPin,
  Calendar,
  Briefcase,
  ChevronRight,
  Users,
  Award,
  Zap,
  Clock,
  User,
  Send,
  Globe,
  Loader2
} from 'lucide-react';
import { buildWhatsAppMessage, openWhatsAppSubmission } from '../lib/submission';
import { SEO } from '../components/SEO';
import { submitContactForm } from '../lib/services/contactService';

const HERO_BG = 'https://images.unsplash.com/photo-1690323223790-4df744a1a033?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxEYWthciUyMFNlbmVnYWwlMjBjaXR5JTIwbW9kZXJuJTIwYWVyaWFsJTIwdmlld3xlbnwxfHx8fDE3NzIzMTAxNDl8MA&ixlib=rb-4.1.0&q=80&w=1080';
const STUDENT_IMG = 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMHN0dWR5aW5nJTIwYWJyb2FkJTIwdW5pdmVyc2l0eSUyMGNhbXB1c3xlbnwxfHx8fDE3NzIzMTAxNTF8MA&ixlib=rb-4.1.0&q=80&w=1080';

import visaLogo from '../../assets/visa.png';
import waveLogo from '../../assets/wave.png';
import orangeMoneyLogo from '../../assets/orange-money.png';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const stagger: Variants = {
  visible: { transition: { staggerChildren: 0.12 } },
};

const testimonials = [
  {
    id: 1,
    name: 'Fatou Diallo',
    program: 'Master en Informatique - Paris',
    text: 'Grâce à Doxantu Travel, ma procédure Campus France s\'est déroulée sans stress. Tout était clair et suivi de A à Z.',
    rating: 5,
    avatar: <User className="w-6 h-6 text-[#0B84D8]" />,
  },
  {
    id: 2,
    name: 'Moussa Ndiaye',
    program: 'Licence en Finance - Montréal',
    text: 'Service exceptionnel ! Mon visa a été obtenu en 3 semaines. L\'équipe est réactive et professionnelle.',
    rating: 5,
    avatar: <User className="w-6 h-6 text-[#0B84D8]" />,
  },
  {
    id: 3,
    name: 'Aminata Sow',
    program: 'BTS Commerce - Casablanca',
    text: 'Je recommande fortement Doxantu Travel. Leur accompagnement m\'a permis d\'éviter de nombreuses erreurs dans mon dossier.',
    rating: 5,
    avatar: <User className="w-6 h-6 text-[#0B84D8]" />,
  },
];

const stats = [
  { icon: <Users className="w-6 h-6" />, value: '500+', label: 'Étudiants accompagnés' },
  { icon: <Award className="w-6 h-6" />, value: '98%', label: 'Taux de satisfaction' },
  { icon: <Zap className="w-6 h-6" />, value: '72h', label: 'Délai de réponse moyen' },
  { icon: <Clock className="w-6 h-6" />, value: '5 ans', label: 'D\'expérience' },
];

export function Home() {
  const navigate = useNavigate();
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [service, setService] = useState('');
  const [formData, setFormData] = useState({ nom: '', tel: '', service: '', message: '' });
  const [formSent, setFormSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/devis');
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Save to Firebase
    const result = await submitContactForm(formData);

    if (result.success) {
      const message = buildWhatsAppMessage('Nouvelle demande rapide', {
        Nom: formData.nom,
        Telephone: formData.tel,
        Service: formData.service,
        Message: formData.message,
      });
      openWhatsAppSubmission(message);
      setFormSent(true);
    } else {
      alert("Une erreur est survenue lors de l'envoi. Veuillez réessayer ou nous contacter directement via WhatsApp.");
    }
    setIsSubmitting(false);
  };

  return (
    <div>
      <SEO title="Accueil" description="Doxantu Travel, la première agence 100% digitale pour les étudiants sénégalais. Étudiez en France, au Canada, au Maroc avec un accompagnement sur mesure." />
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
        {/* Background */}
        <div className="absolute inset-0" aria-hidden="true">
          <img
            src={HERO_BG}
            alt="Vue aérienne de Dakar, la capitale du Sénégal"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(102deg, rgba(7,42,80,0.96) 5%, rgba(11,132,216,0.72) 58%, rgba(8,31,62,0.92) 100%)' }} />
        </div>

        {/* Floating shapes */}
        <div className="absolute top-32 right-10 w-64 h-64 rounded-full opacity-10" style={{ background: '#7dd3fc', filter: 'blur(80px)' }} />
        <div className="absolute bottom-20 left-10 w-48 h-48 rounded-full opacity-10" style={{ background: '#0B84D8', filter: 'blur(60px)' }} />
        <div className="absolute left-0 right-0 top-[42%] h-24 opacity-20" style={{ background: 'linear-gradient(90deg, transparent, #7dd3fc, transparent)', filter: 'blur(32px)' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-14 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <motion.div initial="hidden" animate="visible" variants={stagger}>
              <motion.div variants={fadeUp}>
                <span className="inline-flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-full mb-6"
                  style={{ backgroundColor: 'rgba(255,255,255,0.16)', color: 'white', backdropFilter: 'blur(12px)' }}>
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  Agence certifiée Dakar, Sénégal
                </span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="text-white mb-10"
                style={{ fontSize: 'clamp(2.2rem, 5vw, 4.2rem)', fontWeight: 800, lineHeight: 1.15 }}
              >
                <span style={{ color: '#7dd3fc' }}>Votre voyage</span> commence<br />
                ici, en un clic
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="text-blue-100 mb-8 max-w-lg"
                style={{ fontSize: '1.1rem', lineHeight: 1.65 }}
              >
                Accompagnement étudiant, billetterie et assistance visa en toute transparence
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mb-10">
                <Link
                  to="/devis"
                  className="inline-flex items-center gap-2 px-8 py-4 text-white font-semibold transition-all hover:shadow-2xl hover:-translate-y-0.5"
                  style={{ backgroundColor: '#0B84D8', borderRadius: '14px', fontSize: '1rem' }}
                >
                  Commencer ma demande <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/services/accompagnement-etudiant"
                  className="inline-flex items-center gap-2 px-8 py-4 font-semibold transition-all hover:bg-white hover:text-[#0B84D8]"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.12)',
                    color: 'white',
                    borderRadius: '14px',
                    border: '1.5px solid rgba(255,255,255,0.3)',
                    backdropFilter: 'blur(10px)',
                    fontSize: '1rem',
                  }}
                >
                  Campus France →
                </Link>
              </motion.div>

              {/* Stats bar */}
              <motion.div variants={fadeUp} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {stats.map((s) => (
                  <div key={s.label} className="text-center p-3.5 rounded-2xl border border-white/10" style={{ backgroundColor: 'rgba(82,136,177,0.35)', backdropFilter: 'blur(12px)' }}>
                    <div className="flex justify-center mb-1" style={{ color: '#7dd3fc' }}>{s.icon}</div>
                    <div className="text-white font-bold text-lg">{s.value}</div>
                    <div className="text-blue-200 text-xs">{s.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right: Search Engine */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <div
                className="p-7 shadow-2xl border border-gray-100"
                style={{
                  backgroundColor: 'rgba(250,250,252,0.98)',
                  borderRadius: '26px',
                  backdropFilter: 'blur(20px)',
                }}
              >
                <div className="mb-6">
                  <h2 className="text-[#333333] font-bold mb-1 flex items-center gap-2" style={{ fontSize: '1.8rem' }}>
                    <Send className="w-6 h-6 text-[#0B84D8]" /> Démarrer ma demande
                  </h2>
                  <p className="text-gray-400 text-sm">En moins de 3 clics</p>
                </div>

                <form onSubmit={handleSearch} className="space-y-4">
                  {/* Destination */}
                  <div className="relative">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                      Destination
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0B84D8]" />
                      <select
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:border-transparent bg-gray-50 appearance-none"
                        style={{ borderRadius: '12px', ['--tw-ring-color' as string]: '#0B84D8' }}
                      >
                        <option value="">Choisir un pays…</option>
                        <option value="france">🇫🇷 France</option>
                        <option value="canada">🇨🇦 Canada</option>
                        <option value="maroc">🇲🇦 Maroc</option>
                        <option value="turquie">🇹🇷 Turquie</option>
                        <option value="autres">🌍 Autres destinations</option>
                      </select>
                    </div>
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                      Date prévue
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0B84D8]" />
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 text-sm bg-gray-50 focus:outline-none focus:ring-2"
                        style={{ borderRadius: '12px' }}
                      />
                    </div>
                  </div>

                  {/* Service */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                      Type de service
                    </label>
                    <div className="relative">
                      <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0B84D8]" />
                      <select
                        value={service}
                        onChange={(e) => setService(e.target.value)}
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 text-sm bg-gray-50 focus:outline-none focus:ring-2 appearance-none"
                        style={{ borderRadius: '12px' }}
                      >
                        <option value="">Choisir un service…</option>
                        <option value="etudiant">Accompagnement Étudiant</option>
                        <option value="billet">Billetterie</option>
                        <option value="visa">Assistance Visa</option>
                        <option value="etudes">Études à l'Étranger</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 text-white font-semibold transition-all hover:shadow-lg hover:-translate-y-0.5"
                    style={{ backgroundColor: '#0B84D8', borderRadius: '14px', fontSize: '1rem' }}
                  >
                    Démarrer ma demande →
                  </button>
                </form>

                <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
                  <Shield className="w-3 h-3" /> Gratuit et sans engagement · Réponse en 24h
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/70 animate-bounce">
          <Plane className="w-8 h-8 opacity-80 md:w-10 md:h-10 rotate-180 transition-transform" />
        </div>
      </section>

      {/* ── SERVICES BENTO BOX ───────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#F8FAFC' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <span className="text-sm font-semibold uppercase tracking-widest mb-3 block" style={{ color: '#0B84D8' }}>
              Nos Services
            </span>
            <h2 className="text-[#333333] mb-4" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700 }}>
              Tout pour votre voyage, en un seul endroit
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Des solutions pensées pour les étudiants sénégalais et les voyageurs qui souhaitent partir sereinement.
            </p>
          </motion.div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Large tile: Accompagnement Étudiant */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2 relative overflow-hidden rounded-3xl group cursor-pointer"
              style={{ minHeight: '380px' }}
            >
              <img
                src={STUDENT_IMG}
                alt="Groupe d'étudiants souriants sur un campus universitaire, symbolisant la réussite académique à l'étranger"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(135deg, rgba(7,42,80,0.95) 0%, rgba(11,132,216,0.78) 100%)' }}
              />
              <div className="relative p-8 h-full flex flex-col justify-between" style={{ minHeight: '380px' }}>
                <header>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
                    <GraduationCap className="w-7 h-7 text-white" aria-hidden="true" />
                  </div>
                  <h3 className="text-white mb-3" style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                    Accompagnement Étudiant
                  </h3>
                  <p className="text-blue-100 mb-5 max-w-sm leading-relaxed">
                    Spécialiste Campus France au Sénégal. Nous gérons votre dossier de A à Z :
                    inscription, entretien, visa, billet, tout inclus.
                  </p>
                </header>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {['Campus France', 'Dossier complet', 'Suivi personnalisé', 'Visa étudiant'].map((tag) => (
                      <span key={tag} className="text-xs px-3 py-1.5 rounded-full font-medium" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'white' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                <Link
                  to="/services/accompagnement-etudiant"
                  className="inline-flex items-center gap-2 px-5 py-3 text-white font-semibold transition-all hover:shadow-lg group-hover:-translate-y-0.5 self-start"
                  style={{ backgroundColor: '#0B84D8', borderRadius: '12px' }}
                >
                  En savoir plus <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>

            {/* Medium tile: Billetterie */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="rounded-3xl p-7 flex flex-col justify-between group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
              style={{ backgroundColor: '#ffffff', minHeight: '250px' }}
            >
              <article>
                <header>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: '#E8F4FD' }}>
                    <Plane className="w-6 h-6" style={{ color: '#0B84D8' }} aria-hidden="true" />
                  </div>
                  <h3 className="text-[#333333] mb-2" style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                    Billetterie
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">
                    Vols nationaux & internationaux au meilleur prix. Assistance modification et annulation.
                  </p>
                </header>
                <ul className="space-y-1.5">
                  {['Vols internationaux', 'Vols domestiques', 'Meilleurs tarifs'].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#0B84D8' }} />
                      {f}
                    </li>
                  ))}
                </ul>
              </article>
              <Link
                to="/services/billetterie"
                className="inline-flex items-center gap-1 text-sm font-semibold mt-4 hover:gap-2 transition-all"
                style={{ color: '#0B84D8' }}
              >
                Obtenir un devis vol <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* Medium tile: Assistance Visa */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="rounded-3xl p-7 flex flex-col justify-between group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-blue-100"
              style={{ backgroundColor: '#E8F4FD', minHeight: '220px' }}
            >
              <article>
                <header>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: '#0B84D8' }}>
                    <FileText className="w-6 h-6 text-white" aria-hidden="true" />
                  </div>
                  <h3 className="text-[#333333] mb-2" style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                    Assistance Visa & Documents
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    Visa étudiant, tourisme, légalisation, traduction, on simplifie vos démarches.
                  </p>
                </header>
              </article>
              <Link
                to="/services/visa-documents"
                className="inline-flex items-center gap-1 text-sm font-semibold hover:gap-2 transition-all"
                style={{ color: '#0B84D8' }}
              >
                En savoir plus <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* Small tile: Études à l'Étranger */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="rounded-3xl p-7 flex flex-col justify-between group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
              style={{ backgroundColor: '#ffffff', minHeight: '220px' }}
            >
              <article>
                <header>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 bg-blue-50">
                    <Globe className="w-6 h-6 text-[#0B84D8]" aria-hidden="true" />
                  </div>
                  <h3 className="text-[#333333] mb-2" style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                    Études à l'Étranger
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    France, Canada, Maroc, Turquie, trouvez votre destination et votre programme.
                  </p>
                </header>
              </article>
              <Link
                to="/etudes-etranger"
                className="inline-flex items-center gap-1 text-sm font-semibold mt-4 hover:gap-2 transition-all"
                style={{ color: '#0B84D8' }}
              >
                Explorer les destinations <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── TRUST SECTION ────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-sm font-semibold uppercase tracking-widest mb-3 block" style={{ color: '#0B84D8' }}>
                Pourquoi nous choisir
              </span>
              <h2 className="text-[#333333] mb-6" style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)', fontWeight: 700 }}>
                La confiance au cœur de chaque voyage
              </h2>
              <p className="text-gray-500 mb-8 leading-relaxed">
                Chez Doxantu Travel, nous croyons en la transparence totale. Aucun frais caché,
                aucune surprise. Seulement un service humain, fiable et accessible.
              </p>

              <div className="space-y-5">
                {[
                  {
                    icon: <Shield className="w-5 h-5" />,
                    title: 'Transparence des prix',
                    desc: 'Devis détaillé sans frais cachés. Vous savez exactement ce que vous payez.',
                  },
                  {
                    icon: <CheckCircle className="w-5 h-5" />,
                    title: 'Paiement local sécurisé',
                    desc: 'Wave, Orange Money, Visa, payez comme vous le souhaitez, en toute sécurité.',
                  },
                  {
                    icon: <Award className="w-5 h-5" />,
                    title: 'Agence certifiée',
                    desc: 'Enregistrée et agréée au Sénégal. Votre confiance mérite le meilleur.',
                  },
                  {
                    icon: <Clock className="w-5 h-5" />,
                    title: 'Suivi en temps réel',
                    desc: 'Nous vous accompagnons à chaque étape et répondons en moins de 24h.',
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-2xl transition-colors hover:bg-[#F8FAFC]">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#E8F4FD', color: '#0B84D8' }}>
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-[#333333] font-semibold mb-1">{item.title}</h4>
                      <p className="text-gray-500 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {/* Payment methods */}
              <div className="p-8 rounded-3xl mb-6" style={{ backgroundColor: '#F8FAFC' }}>
                <h3 className="text-[#333333] font-bold mb-6 text-center" style={{ fontSize: '1.1rem' }}>
                  Moyens de paiement acceptés
                </h3>

                <div className="grid grid-cols-3 gap-4 mb-8" role="list">
                  {[
                    { name: 'Wave', icon: waveLogo },
                    { name: 'Orange Money', icon: orangeMoneyLogo },
                    { name: 'Visa', icon: visaLogo },
                  ].map((method) => (
                    <article
                      key={method.name}
                      role="listitem"
                      className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all border border-gray-50 group min-h-[100px]"
                    >
                      <div className="h-10 flex items-center justify-center transform transition-transform group-hover:scale-110 duration-300">
                        <img src={method.icon} alt={`Logo ${method.name}`} className="max-h-full max-w-full object-contain" />
                      </div>
                      <span className="text-[10px] font-bold text-center text-[#1a2b40] uppercase tracking-wider">{method.name}</span>
                    </article>
                  ))}
                </div>
                <Link
                  to="/devis"
                  className="block w-full py-3.5 text-white font-semibold text-center transition-all hover:shadow-lg hover:-translate-y-0.5"
                  style={{ backgroundColor: '#0B84D8', borderRadius: '12px' }}
                >
                  Demander un devis gratuit →
                </Link>
              </div>

              {/* Trust badge */}
              <div className="p-6 rounded-2xl border-2 text-center" style={{ borderColor: '#0B84D8' }}>
                <div className="flex justify-center mb-3">
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                    <Award className="w-6 h-6 text-[#0B84D8]" />
                  </div>
                </div>
                <h4 className="text-[#333333] font-bold mb-1">Agence enregistrée au Sénégal</h4>
                <p className="text-gray-500 text-sm">Licence ministérielle N° 2024-DT-001</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── TÉMOIGNAGES ──────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#F8FAFC' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <span className="text-sm font-semibold uppercase tracking-widest mb-3 block" style={{ color: '#0B84D8' }}>
              Témoignages
            </span>
            <h2 className="text-[#333333] mb-4" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700 }}>
              Ils ont fait confiance à Doxantu Travel
            </h2>
            <p className="text-gray-500">Des étudiants sénégalais qui ont réussi leur projet avec nous.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                className="bg-white rounded-3xl p-7 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 leading-relaxed mb-6 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ backgroundColor: '#E8F4FD' }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-[#333333]">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.program}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONVERSION FORM ──────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8" style={{ background: 'linear-gradient(135deg, #072a50 0%, #0B84D8 100%)' }}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-white mb-4" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700 }}>
              Commencez votre projet maintenant
            </h2>
            <p className="text-blue-200">Remplissez ce formulaire rapide, réponse garantie en moins de 24h.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl"
          >
            {formSent ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-blue-50 text-[#0B84D8] rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-[#333333] font-bold mb-2" style={{ fontSize: '1.5rem' }}>
                  Demande reçue !
                </h3>
                <p className="text-gray-500 mb-6">
                  Notre équipe vous contactera dans les 24h. Merci pour votre confiance.
                </p>
                <button
                  onClick={() => setFormSent(false)}
                  className="px-6 py-3 text-white font-semibold"
                  style={{ backgroundColor: '#0B84D8', borderRadius: '12px' }}
                >
                  Nouvelle demande
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Votre nom"
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:border-transparent"
                    style={{ borderRadius: '12px' }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Téléphone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+221 7X XXX XX XX"
                    value={formData.tel}
                    onChange={(e) => setFormData({ ...formData, tel: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-gray-50 focus:outline-none focus:ring-2"
                    style={{ borderRadius: '12px' }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Service souhaité
                  </label>
                  <select
                    required
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-gray-50 focus:outline-none focus:ring-2"
                    style={{ borderRadius: '12px' }}
                  >
                    <option value="">Choisir…</option>
                    <option value="etudiant">Accompagnement Étudiant</option>
                    <option value="billet">Billetterie</option>
                    <option value="visa">Assistance Visa</option>
                    <option value="etudes">Études à l'Étranger</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Message (optionnel)
                  </label>
                  <input
                    type="text"
                    placeholder="Votre situation en quelques mots…"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-gray-50 focus:outline-none focus:ring-2"
                    style={{ borderRadius: '12px' }}
                  />
                </div>
                <div className="md:col-span-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 text-white font-semibold text-base transition-all hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{ backgroundColor: '#0B84D8', borderRadius: '12px' }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" /> Envoi en cours...
                      </>
                    ) : (
                      'Recevoir mon devis gratuit →'
                    )}
                  </button>
                  <p className="text-center text-xs text-gray-400 mt-3 flex items-center justify-center gap-1">
                    <Shield className="w-3 h-3" /> Vos données sont protégées et jamais partagées
                  </p>
                </div>
          </form>
        )}
      </motion.div>
    </div>
      </section>
    </div>
  );
}
