import { Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowRight, Target, Eye, Heart, Shield, Users, Award, CheckCircle, History } from 'lucide-react';
import { SEO } from '../components/SEO';
const HERO_BG = 'https://images.unsplash.com/photo-1690323223790-4df744a1a033?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxEYWthciUyMFNlbmVnYWwlMjBjaXR5JTIwbW9kZXJuJTIwYWVyaWFsJTIwdmlld3xlbnwxfHx8fDE3NzIzMTAxNDl8MA&ixlib=rb-4.1.0&q=80&w=1080';

const TEAM_IMG =
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjBwbGFubmluZyUyMGNhbWVyYSUyMHBhc3Nwb3J0fGVufDF8fHwxNzcyMzExODU5fDA&ixlib=rb-4.1.0&q=80&w=1080';

const values = [
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Transparence',
    desc: 'Nous pratiquons une politique de transparence totale sur nos prix et nos services. Aucun frais caché, aucune surprise.',
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: 'Engagement humain',
    desc: 'Chaque client est unique. Nous prenons le temps d\'écouter votre projet pour vous offrir le meilleur accompagnement.',
  },
  {
    icon: <Award className="w-6 h-6" />,
    title: 'Excellence',
    desc: 'Nous visons l\'excellence dans chaque dossier traité. Votre satisfaction est notre plus grande récompense.',
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Accessibilité',
    desc: 'Nous croyons que chaque étudiant sénégalais mérite d\'accéder à une éducation internationale de qualité.',
  },
];

const TeamAvatar = ({ initials, color }: { initials: string; color: string }) => (
  <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="40" cy="40" r="40" fill={color} fillOpacity="0.15" />
    <circle cx="40" cy="32" r="14" fill={color} fillOpacity="0.3" />
    <ellipse cx="40" cy="70" rx="22" ry="14" fill={color} fillOpacity="0.25" />
    <text x="40" y="37" textAnchor="middle" dominantBaseline="middle" fill={color} fontSize="14" fontWeight="700" fontFamily="Inter, sans-serif">{initials}</text>
  </svg>
);

const team = [
  {
    name: 'Ibrahima Diallo',
    role: 'Directeur Général',
    initials: 'ID',
    color: '#0B84D8',
    roleIcon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0B84D8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
    desc: "Expert en mobilité internationale avec 8 ans d'expérience dans l'accompagnement étudiant.",
  },
  {
    name: 'Mariama Bâ',
    role: 'Responsable Études',
    initials: 'MB',
    color: '#7C3AED',
    roleIcon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
    desc: "Ancienne conseillère Campus France, spécialiste des procédures d'admission en France et Canada.",
  },
  {
    name: 'Ousmane Seck',
    role: 'Responsable Billetterie',
    initials: 'OS',
    color: '#059669',
    roleIcon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21 4 21 4s-2 0-3.5 1.5L14 9 5.8 7.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 3.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
      </svg>
    ),
    desc: "Spécialiste des tarifs aériens et de l'optimisation des voyages depuis le Sénégal.",
  },
  {
    name: 'Aïssatou Niang',
    role: 'Conseillère Visa',
    initials: 'AN',
    color: '#DC2626',
    roleIcon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M2 10h20" />
        <path d="M7 15h2m4 0h4" />
      </svg>
    ),
    desc: "Experte en procédures consulaires avec un taux de succès de 97% sur les demandes de visa.",
  },
];

const stats = [
  { value: '500+', label: 'Étudiants accompagnés' },
  { value: '15+', label: 'Destinations couvertes' },
  { value: '5 ans', label: 'D\'expérience' },
  { value: '98%', label: 'Taux de satisfaction' },
];

export function About() {
  return (
    <div className="min-h-screen">
      <SEO title="À propos" description="Découvrez l'histoire de Doxantu Travel, l'agence de voyage 100% digitale dédiée aux étudiants sénégalais." />
      {/* Hero Section */}
      <section
        className="relative pt-40 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
      >
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={HERO_BG}
            alt="Dakar Renaissance"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#072a50]/95 via-[#072a50]/80 to-[#0B84D8]/40" style={{ background: 'linear-gradient(102deg, rgba(7,42,80,0.92) 5%, rgba(7,42,80,0.7) 40%, rgba(11,132,216,0.4) 70%, rgba(8,31,62,0.95) 100%)' }}></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <span className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full mb-6"
                style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'white' }}>
                <History className="w-4 h-4 mr-1" /> Notre histoire
              </span>
              <h1 className="text-white mb-10" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, lineHeight: 1.2 }}>
                L'agence qui vous<br />
                <span style={{ color: '#7dd3fc' }}>ressemble</span>
              </h1>
              <p className="text-blue-100 mb-8" style={{ fontSize: '1.05rem', lineHeight: 1.8 }}>
                Née à Dakar en 2019, Doxantu Travel est une agence digitale fondée avec une mission claire :
                rendre la mobilité internationale accessible à tous les Sénégalais, en toute transparence.
                <br /><br />
                Nos fondateurs, anciens étudiants ayant vécu les difficultés des procédures d'expatriation,
                ont voulu créer l'agence qu'ils auraient aimé trouver.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">

                <div
                  className="inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl"
                  style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: '1.5px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)' }}
                >
                  <Shield className="w-5 h-5 text-green-300" />
                  <div>
                    <p className="text-white font-bold text-xs tracking-tight">Agence officielle enregistrée au Sénégal</p>
                    <p className="text-blue-200 text-[10px] font-medium">Licence Ministérielle N° 2024-DT-001</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative"
            >
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <img src={TEAM_IMG} alt="Équipe Doxantu" className="w-full h-80 object-cover" />
              </div>
              {/* Stats floating card */}
              <div
                className="absolute -bottom-6 -left-4 grid grid-cols-2 gap-3 p-5 rounded-2xl shadow-xl"
                style={{ backgroundColor: 'white' }}
              >
                {stats.map((s) => (
                  <div key={s.label} className="text-center">
                    <p className="font-black" style={{ color: '#0B84D8', fontSize: '1.3rem' }}>{s.value}</p>
                    <p className="text-xs text-gray-500">{s.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision / Mission */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-12">
            <h2 className="text-3xl font-bold text-[#072a50] mb-6">Notre Vision & Mission</h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              Chez Doxantu Travel, nous croyons que la mobilité internationale est un puissant levier de
              développement personnel et professionnel.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 mt-8">
            {[
              {
                icon: <Eye className="w-7 h-7" />,
                title: 'Notre Vision',
                content: 'Être l\'agence de voyage digitale de référence en Afrique de l\'Ouest, reconnue pour son intégrité, son expertise et son accompagnement humain. Nous voulons que chaque étudiant sénégalais ait accès aux meilleures opportunités éducatives mondiales.',
              },
              {
                icon: <Target className="w-7 h-7" />,
                title: 'Notre Mission',
                content: 'Simplifier et démocratiser la mobilité internationale pour les étudiants et voyageurs sénégalais. Nous rendons chaque étape — du choix de la destination au retour — transparente, abordable et accompagnée.',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="p-10 rounded-3xl border border-gray-100 hover:shadow-2xl transition-all hover:-translate-y-1 bg-white"
              >
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg shadow-[#0B84D8]/20" style={{ backgroundColor: '#0B84D8' }}>
                  {item.icon}
                </div>
                <h3 className="text-[#333333] mb-4" style={{ fontSize: '1.5rem', fontWeight: 800 }}>{item.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm lg:text-base">{item.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#F8FAFC' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <span className="text-sm font-semibold uppercase tracking-widest mb-3 block" style={{ color: '#0B84D8' }}>
              Nos valeurs
            </span>
            <h2 className="text-[#333333]" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 700 }}>
              Ce qui nous guide chaque jour
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                className="bg-white rounded-3xl p-7 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 text-center"
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 text-white" style={{ backgroundColor: '#0B84D8' }}>
                  {v.icon}
                </div>
                <h3 className="text-[#333333] mb-3 font-bold" style={{ fontSize: '1.05rem' }}>{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <span className="text-sm font-semibold uppercase tracking-widest mb-3 block" style={{ color: '#0B84D8' }}>
              Notre équipe
            </span>
            <h2 className="text-[#333333]" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 700 }}>
              Des experts à votre service
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                className="bg-white rounded-3xl p-7 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 text-center"
              >
                <div className="mx-auto mb-4 w-20 h-20 rounded-full overflow-hidden flex items-center justify-center" style={{ backgroundColor: '#E8F4FD' }}>
                  <TeamAvatar initials={member.initials} color={member.color} />
                </div>
                <h3 className="text-[#333333] font-bold mb-0.5">{member.name}</h3>
                <p className="text-sm mb-3 flex items-center justify-center gap-1" style={{ color: '#0B84D8' }}>
                  {member.roleIcon}{member.role}
                </p>
                <p className="text-gray-500 text-sm leading-relaxed">{member.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust + Engagement */}
      <section className="py-16 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#F8FAFC' }}>
        <div className="max-w-4xl mx-auto">
          <div className="p-10 rounded-3xl border-2 text-center" style={{ borderColor: '#0B84D8', backgroundColor: '#F0F8FF' }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#0B84D8' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="6" />
                <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
              </svg>
            </div>
            <h2 className="text-[#333333] mb-4" style={{ fontSize: '1.5rem', fontWeight: 700 }}>
              Notre engagement de transparence
            </h2>
            <p className="text-gray-500 mb-6 max-w-lg mx-auto leading-relaxed">
              Doxantu Travel est une agence officiellement enregistrée au Sénégal. Nous pratiquons
              des prix justes, transparents et sans frais cachés. Votre confiance est notre priorité absolue.
            </p>
            <ul className="flex flex-wrap justify-center gap-4 mb-8">
              {[
                'Licence N° 2024-DT-001',
                'Registre du Commerce de Dakar',
                'Membre de l\'Association des Agences de Voyage',
                'Assurance professionnelle',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-[#333333]">
                  <CheckCircle className="w-4 h-4" style={{ color: '#0B84D8' }} />
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 text-white font-semibold transition-all hover:shadow-lg hover:-translate-y-0.5"
              style={{ backgroundColor: '#0B84D8', borderRadius: '12px' }}>
              Nous contacter <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
