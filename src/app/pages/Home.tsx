import { Link } from 'react-router';
import { motion, Variants } from 'motion/react';
import {
  GraduationCap,
  Plane,
  FileText,
  Shield,
  CheckCircle,
  Star,
  ArrowRight,
  Users,
  Award,
  Zap,
  Clock,
  User,
  Globe,
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { useUser } from '../lib/context/UserContext';
const HERO_BG = 'https://images.unsplash.com/photo-1690323223790-4df744a1a033?crop=entropy&cs=tinysrgb&fit=max&fm=webp&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxEYWthciUyMFNlbmVnYWwlMjBjaXR5JTIwbW9kZXJuJTIwYWVyaWFsJTIwdmlld3xlbnwxfHx8fDE3NzIzMTAxNDl8MA&ixlib=rb-4.1.0&q=80&w=1080';
const STUDENT_IMG = 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?crop=entropy&cs=tinysrgb&fit=max&fm=webp&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMHN0dWR5aW5nJTIwYWJyb2FkJTIwdW5pdmVyc2l0eSUyMGNhbXB1c3xlbnwxfHx8fDE3NzIzMTAxNTF8MA&ixlib=rb-4.1.0&q=80&w=1080';

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
    name: 'Ami Ndiaye',
    program: 'Master en Informatique - Paris',
    text: 'Grâce à Doxantu Travel, ma procédure Campus France s\'est déroulée sans stress. Tout était clair et suivi de A à Z.',
    rating: 5,
    avatar: <User className="w-6 h-6 text-[#0B84D8]" />,
  },
  {
    id: 2,
    name: 'Modou Fall',
    program: 'Licence en Finance - Montréal',
    text: 'Service exceptionnel ! Mon visa a été obtenu en 3 semaines. L\'équipe est réactive et professionnelle.',
    rating: 5,
    avatar: <User className="w-6 h-6 text-[#0B84D8]" />,
  },
  {
    id: 3,
    name: 'Selly Ba',
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
  { icon: <Clock className="w-6 h-6" />, value: '2026', label: 'Année de création' },
];

export function Home() {
  const { user } = useUser();
  const mainCtaPath = user?.role === 'admin' ? '/admin/dashboard' : '/devis';
  const ctaText = user?.role === 'admin' ? 'Aller au Dashboard' : 'Faire ma demande';

  return (
    <div>
      <SEO 
        title="Agence de Voyage Digitale au Sénégal | Études à l'Étranger & Campus France" 
        description="Doxantu Travel est la première agence 100% digitale au Sénégal dédiée à la mobilité étudiante. Accompagnement Campus France, Canada, Maroc. Visa, Billetterie et Orientation sur mesure à Dakar."
        keywords="Doxantu Travel, agence voyage Sénégal, Campus France Sénégal, visa Canada Sénégal, mobilité étudiante Dakar, billets avion prix bas Sénégal, assistance visa Sénégal"
        image={HERO_BG}
      />
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
          <div className="absolute inset-0" style={{ background: 'linear-gradient(102deg, rgba(7,42,80,0.92) 5%, rgba(7,42,80,0.7) 40%, rgba(11,132,216,0.4) 70%, rgba(8,31,62,0.95) 100%)' }} />
        </div>

        {/* Floating shapes */}
        <div className="absolute top-32 right-10 w-64 h-64 rounded-full opacity-10" style={{ background: '#7dd3fc', filter: 'blur(80px)' }} />
        <div className="absolute bottom-20 left-10 w-48 h-48 rounded-full opacity-10" style={{ background: '#0B84D8', filter: 'blur(60px)' }} />
        <div className="absolute left-0 right-0 top-[42%] h-24 opacity-20" style={{ background: 'linear-gradient(90deg, transparent, #7dd3fc, transparent)', filter: 'blur(32px)' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-14 w-full">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            {/* Centered Content */}
            <motion.div initial="hidden" animate="visible" variants={stagger} className="flex flex-col items-center">

 
              <motion.h1
                variants={fadeUp}
                className="text-white mb-10"
                style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 800, lineHeight: 1.1 }}
              >
                <span style={{ color: '#7dd3fc' }}>Votre voyage</span> commence<br />
                ici, en un clic
              </motion.h1>
 
              <motion.p
                variants={fadeUp}
                className="text-blue-100 mb-10 max-w-2xl"
                style={{ fontSize: '1.25rem', lineHeight: 1.65 }}
              >
                Accompagnement étudiant, billetterie et assistance visa en toute transparence. 
                Rejoignez des centaines de Sénégalais qui nous font confiance chaque année.
              </motion.p>
 
              <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4 mb-14">

                <Link
                  to="/a-propos"
                  className="inline-flex items-center gap-2 px-10 py-4 font-bold transition-all hover:bg-white/10"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    borderRadius: '16px',
                    border: '1.5px solid rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(10px)',
                    fontSize: '1.1rem',
                  }}
                >
                  En savoir plus
                </Link>
              </motion.div>
 
              {/* Stats bar */}
              <motion.div variants={fadeUp} className="grid grid-cols-2 sm:grid-cols-4 gap-6 w-full max-w-3xl">
                {stats.map((s) => (
                  <div key={s.label} className="text-center p-5 rounded-3xl border border-white/10" style={{ backgroundColor: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(12px)' }}>
                    <div className="flex justify-center mb-2" style={{ color: '#7dd3fc' }}>{s.icon}</div>
                    <div className="text-white font-bold text-xl">{s.value}</div>
                    <div className="text-blue-200 text-[10px] uppercase tracking-wider font-bold">{s.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/70 animate-bounce">
          <svg className="w-6 h-6 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ── SERVICES BENTO BOX ───────────────────────────── */}
      <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#F8FAFC' }}>
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

          {/* Main Services Grid */}
          <div className="grid lg:grid-cols-2 gap-8 items-stretch">
            {/* Big Card: Student Support */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="group relative overflow-hidden rounded-[32px] bg-sky-900 shadow-2xl min-h-[480px] flex flex-col"
            >
              <div className="absolute inset-0 z-0">
                <img
                  src={STUDENT_IMG}
                  alt="Étudiants sénégalais"
                  className="w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-sky-950 via-sky-900/60 to-transparent" />
              </div>

              <div className="relative z-10 p-8 sm:p-12 flex flex-col h-full justify-end">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-8">
                  <GraduationCap className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-3xl sm:text-4xl font-bold text-white mb-6">Accompagnement Étudiant</h3>
                <p className="text-white/80 text-lg leading-relaxed mb-8 max-w-md">
                  Spécialiste Campus France au Sénégal. Nous gérons votre dossier de A à Z : inscription, entretien, visa, billet, tout inclus.
                </p>
                <div className="flex flex-wrap gap-3 mb-10">
                  {['Campus France', 'Dossier complet', 'Suivi personnalisé', 'Visa étudiant'].map((tag) => (
                    <span key={tag} className="px-4 py-1.5 rounded-full bg-white/10 text-white text-xs font-medium border border-white/10 backdrop-blur-sm">
                      {tag}
                    </span>
                  ))}
                </div>
                <div>
                  <Link
                    to="/services/accompagnement-etudiant"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-white text-sky-900 rounded-2xl font-bold hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all hover:-translate-y-1"
                  >
                    En savoir plus <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Sub-grid for other services */}
            <div className="flex flex-col gap-8">
              {/* Ticketing Card */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl hover:shadow-2xl transition-all group flex flex-col justify-between h-full"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-[#E8F4FD] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Plane className="w-7 h-7 text-[#0B84D8]" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#333333] mb-4">Billetterie</h3>
                  <p className="text-gray-500 mb-6 text-sm sm:text-base">
                    Vols nationaux & internationaux au meilleur prix. Assistance modification et annulation.
                  </p>
                  <ul className="space-y-3 mb-8">
                    {['Vols internationaux', 'Vols domestiques', 'Meilleurs tarifs'].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-gray-400 text-sm">
                        <CheckCircle className="w-4 h-4 text-[#0B84D8]" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link to="/services/billetterie" className="text-[#0B84D8] font-bold inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                  Obtenir un devis vol <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>

              {/* Bottom twin cards */}
              <div className="grid sm:grid-cols-2 gap-8">
                {/* Visa Assistance */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-lg hover:shadow-xl transition-all group flex flex-col justify-between h-full"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-[#E8F4FD] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                      <FileText className="w-6 h-6 text-[#0B84D8]" />
                    </div>
                    <h3 className="text-xl font-bold text-[#333333] mb-3 leading-tight">Assistance Visa & Documents</h3>
                    <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                      Visa étudiant, tourisme, légalisation, traduction, on simplifie vos démarches.
                    </p>
                  </div>
                  <Link to="/services/visa-documents" className="text-[#0B84D8] font-bold text-sm inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                    En savoir plus <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>

                {/* Studies Abroad */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-lg hover:shadow-xl transition-all group flex flex-col justify-between h-full"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-[#E8F4FD] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                      <Globe className="w-6 h-6 text-[#0B84D8]" />
                    </div>
                    <h3 className="text-xl font-bold text-[#333333] mb-3 leading-tight">Études à l'Étranger</h3>
                    <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                      France, Canada, Maroc, Turquie, trouvez votre destination et votre programme.
                    </p>
                  </div>
                  <Link to="/etudes-etranger" className="text-[#0B84D8] font-bold text-sm inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                    Explorer les destinations <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST SECTION ────────────────────────────────── */}
      <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-white">
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
                        <img src={method.icon} alt={`Payer par ${method.name} chez Doxantu Travel`} className="max-h-full max-w-full object-contain" />
                      </div>
                      <span className="text-[10px] font-bold text-center text-[#1a2b40] uppercase tracking-wider">{method.name}</span>
                    </article>
                  ))}
                </div>

              </div>

              {/* Trust badge */}
              <div className="p-8 rounded-[32px] border-2 text-center transition-all hover:border-[#0B84D8]/50" style={{ borderColor: '#0B84D8' }}>
                <div className="flex justify-center mb-4">
                  <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center shadow-inner">
                    <Award className="w-7 h-7 text-[#0B84D8]" />
                  </div>
                </div>
                <h4 className="text-[#333333] font-bold mb-1 text-lg">Agence enregistrée au Sénégal</h4>
                <p className="text-gray-500 text-sm">Licence ministérielle N° 2026-DT-001</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── TÉMOIGNAGES ──────────────────────────────────── */}
      <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#F8FAFC' }}>
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

    </div>
  );
}
