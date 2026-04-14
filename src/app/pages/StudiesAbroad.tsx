import { Link } from 'react-router';
import { motion } from 'motion/react';
import { useUser } from '../lib/context/UserContext';
import { ArrowRight, Clock, DollarSign, FileCheck, ChevronRight, Globe, MapPin } from 'lucide-react';
import { SEO } from '../components/SEO';
const HERO_BG = 'https://images.unsplash.com/photo-1690323223790-4df744a1a033?crop=entropy&cs=tinysrgb&fit=max&fm=webp&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxEYWthciUyMFNlbmVnYWwlMjBjaXR5JTIwbW9kZXJuJTIwYWVyaWFsJTIwdmlld3xlbnwxfHx8fDE3NzIzMTAxNDl8MA&ixlib=rb-4.1.0&q=80&w=1080';

const PARIS_IMG = 'https://images.unsplash.com/photo-1720988460120-fc18598bd287?crop=entropy&cs=tinysrgb&fit=max&fm=webp&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxQYXJpcyUyMEZyYW5jZSUyMEVpZmZlbCUyMFRvd2VyJTIwbGFuZG1hcmt8ZW58MXx8fHwxNzcyMzEwMTU0fDA&ixlib=rb-4.1.0&q=80&w=1080';
const CANADA_IMG = 'https://images.unsplash.com/photo-1671513037345-55527c8cba67?crop=entropy&cs=tinysrgb&fit=max&fm=webp&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDYW5hZGElMjBNb250cmVhbCUyMHdpbnRlciUyMGNpdHl8ZW58MXx8fHwxNzcyMzEwMTU1fDA&ixlib=rb-4.1.0&q=80&w=1080';
const MAROC_IMG = 'https://images.unsplash.com/photo-1716146755954-4f197a5b6031?crop=entropy&cs=tinysrgb&fit=max&fm=webp&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNb3JvY2NvJTIwTWFycmFrZWNoJTIwbWVkaW5hJTIwY29sb3JmdWx8ZW58MXx8fHwxNzcyMzEwMTU1fDA&ixlib=rb-4.1.0&q=80&w=1080';
const TURKEY_IMG = 'https://images.unsplash.com/photo-1669117403979-be8e9448d9b3?crop=entropy&cs=tinysrgb&fit=max&fm=webp&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJc3RhbmJ1bCUyMFR1cmtleSUyMEJvc3Bob3J1cyUyMG1vc3F1ZXxlbnwxfHx8fDE3NzIyODg4MDF8MA&ixlib=rb-4.1.0&q=80&w=1080';

const destinations = [
  {
    country: 'France',
    flag: '🇫🇷',
    image: PARIS_IMG,
    tagline: 'La destination N°1 des étudiants sénégalais',
    budget: '800–1 200 €/mois',
    delay: '3–6 mois',
    conditions: [
      'Baccalauréat ou équivalent',
      'Inscription via Campus France obligatoire',
      'Justificatif financier (environ 7 380 €/an)',
      'Maîtrise du français niveau B1 minimum',
    ],
    procedure: [
      'Inscription sur Campus France',
      'Entretien Campus France',
      'Demande de visa étudiant',
      'Inscription à l\'université',
    ],
    popular: ['Paris', 'Lyon', 'Toulouse', 'Bordeaux', 'Montpellier'],
  },
  {
    country: 'Canada',
    flag: '🇨🇦',
    image: CANADA_IMG,
    tagline: 'Étudier et travailler en même temps',
    budget: '1 200–1 800 CAD/mois',
    delay: '4–8 mois',
    conditions: [
      'Attestation d\'acceptation d\'un établissement canadien',
      'Preuve de ressources financières suffisantes',
      'Casier judiciaire vierge',
      'Maîtrise du français ou de l\'anglais',
    ],
    procedure: [
      'Candidature auprès des universités',
      'Lettre d\'acceptation (LOA)',
      'Permis d\'études',
      'Visa de résident temporaire',
    ],
    popular: ['Montréal', 'Québec', 'Toronto', 'Ottawa'],
  },
  {
    country: 'Maroc',
    flag: '🇲🇦',
    image: MAROC_IMG,
    tagline: 'Proche, abordable et culturellement familier',
    budget: '300–600 €/mois',
    delay: '2–4 mois',
    conditions: [
      'Baccalauréat ou diplôme équivalent',
      'Lettre d\'admission d\'un établissement marocain',
      'Passeport valide',
      'Ressources financières suffisantes',
    ],
    procedure: [
      'Candidature universitaire',
      'Lettre d\'acceptation',
      'Visa d\'études (si nécessaire)',
      'Inscription administrative',
    ],
    popular: ['Casablanca', 'Rabat', 'Fès', 'Marrakech'],
  },
  {
    country: 'Turquie',
    flag: '🇹🇷',
    image: TURKEY_IMG,
    tagline: 'Bourses attractives et formations de qualité',
    budget: '400–700 €/mois',
    delay: '2–5 mois',
    conditions: [
      'Baccalauréat reconnu',
      'Score YÖS ou SAT (selon établissement)',
      'Maîtrise du turc ou de l\'anglais',
      'Documents apostillés',
    ],
    procedure: [
      'Candidature directe ou via Türkiye Burslari',
      'Entretien de sélection',
      'Visa étudiant turc',
      'Permis de résidence',
    ],
    popular: ['Istanbul', 'Ankara', 'Izmir', 'Bursa'],
  },
];

export function StudiesAbroad() {
  const { user } = useUser();
  const getCtaPath = (defaultPath: string) => user?.role === 'admin' ? '/admin/dashboard' : defaultPath;
  const ctaText = user?.role === 'admin' ? 'Aller au Dashboard' : 'Faire ma demande';

  return (
    <div>
      <SEO 
        title="Étudier à l'Étranger | Accompagnement Campus France & Canada" 
        description="Trouvez votre destination idéale pour vos études supérieures avec Doxantu Travel. Accompagnement complet pour Campus France, le Canada, le Maroc et la Turquie. Évaluation gratuite de profil."
        image={HERO_BG}
      />
      {/* Hero */}
      <section
        className="relative pt-40 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
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
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 right-10 w-72 h-72 rounded-full opacity-10" style={{ background: 'white', filter: 'blur(80px)' }} />
          <div className="absolute bottom-10 left-10 w-56 h-56 rounded-full opacity-10" style={{ background: 'white', filter: 'blur(60px)' }} />
        </div>
        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full mb-6"
              style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'white' }}>
              <Globe className="w-4 h-4 mr-1 text-blue-300" /> Destinations populaires
            </span>
            <h1 className="text-white mb-5" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, lineHeight: 1.2 }}>
              Trouvez votre<br />
              <span style={{ color: '#7dd3fc' }}>destination idéale</span>
            </h1>
            <p className="text-blue-100 max-w-xl mx-auto mb-8" style={{ fontSize: '1.05rem', lineHeight: 1.7 }}>
              France, Canada, Maroc, Turquie, nos experts vous aident à choisir la destination
              adaptée à votre profil et à votre budget.
            </p>

          </motion.div>
        </div>
      </section>

      {/* Destinations */}
      <section className="py-16 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#F8FAFC' }}>
        <div className="max-w-7xl mx-auto space-y-12">
          {destinations.map((dest, i) => (
            <motion.div
              key={dest.country}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.05 }}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 group"
            >
              <div className="grid lg:grid-cols-2 lg:h-[500px]">
                {/* Image */}
                <div className={`relative h-72 lg:h-full overflow-hidden ${i % 2 === 1 ? 'lg:order-2' : 'lg:order-1'}`}>
                  <img
                    src={dest.image}
                    alt={dest.country}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)' }} />
                  <div className="absolute bottom-4 left-4">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{dest.flag}</span>
                      <div>
                        <h3 className="text-white font-bold text-xl">{dest.country}</h3>
                        <p className="text-blue-200 text-xs">{dest.tagline}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className={`p-8 flex flex-col h-full ${i % 2 === 1 ? 'lg:order-1' : 'lg:order-2'}`}>
                  <div className="flex-grow">
                    {/* Key info */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 rounded-2xl" style={{ backgroundColor: '#F0F8FF' }}>
                      <DollarSign className="w-5 h-5 mb-1" style={{ color: '#0B84D8' }} />
                      <p className="text-xs text-gray-500 mb-0.5">Budget mensuel</p>
                      <p className="font-bold text-[#333333] text-sm">{dest.budget}</p>
                    </div>
                    <div className="p-4 rounded-2xl" style={{ backgroundColor: '#F0F8FF' }}>
                      <Clock className="w-5 h-5 mb-1" style={{ color: '#0B84D8' }} />
                      <p className="text-xs text-gray-500 mb-0.5">Délai procédure</p>
                      <p className="font-bold text-[#333333] text-sm">{dest.delay}</p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    {/* Conditions */}
                    <div>
                      <h4 className="text-[#333333] font-semibold mb-3 flex items-center gap-2">
                        <FileCheck className="w-4 h-4" style={{ color: '#0B84D8' }} />
                        Conditions
                      </h4>
                      <ul className="space-y-2">
                        {dest.conditions.map((c, j) => (
                          <li key={j} className="flex items-start gap-2 text-xs text-gray-600">
                            <ChevronRight className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: '#0B84D8' }} />
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Procedure */}
                    <div>
                      <h4 className="text-[#333333] font-semibold mb-3 flex items-center gap-2">
                        <ArrowRight className="w-4 h-4" style={{ color: '#0B84D8' }} />
                        Procédure
                      </h4>
                      <ol className="space-y-2">
                        {dest.procedure.map((p, j) => (
                          <li key={j} className="flex items-start gap-2 text-xs text-gray-600">
                            <span className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold" style={{ backgroundColor: '#0B84D8', minWidth: '1rem' }}>
                              {j + 1}
                            </span>
                            {p}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                  </div>

                  {/* Cities and Button Container */}
                  <div className="mt-auto pt-5 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider font-medium">Villes populaires</p>
                      <div className="flex flex-wrap gap-2">
                        {dest.popular.map((city) => (
                          <span key={city} className="text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1.5"
                            style={{ backgroundColor: '#E8F4FD', color: '#0B84D8' }}>
                            <MapPin className="w-3 h-3" /> {city}
                          </span>
                        ))}
                      </div>
                    </div>

                    <Link
                      to={getCtaPath(`/devis?destination=${dest.country.toLowerCase()}`)}
                      className="inline-flex items-center gap-2 px-6 py-3.5 text-white font-bold text-sm transition-all hover:shadow-xl hover:-translate-y-1 whitespace-nowrap shadow-md shadow-[#0B84D8]/20"
                      style={{ backgroundColor: '#0B84D8', borderRadius: '16px' }}
                    >
                      {ctaText} <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ background: 'linear-gradient(135deg, #072a50 0%, #0B84D8 100%)' }}>
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-6 bg-white/10 backdrop-blur-sm border border-white/20">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-white mb-4" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 700 }}>
              Votre aventure internationale commence ici
            </h2>
            <p className="text-blue-200 mb-8">
              Nos conseillers vous aident à choisir la meilleure destination selon votre projet, votre budget et votre profil.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to={getCtaPath('/devis')} className="inline-flex items-center gap-2 px-8 py-4 font-semibold transition-all hover:shadow-xl hover:-translate-y-0.5"
                style={{ backgroundColor: 'white', color: '#0B84D8', borderRadius: '12px' }}>
                {ctaText} <ArrowRight className="w-5 h-5" />
              </Link>

              <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 font-semibold transition-all"
                style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', borderRadius: '12px', border: '1.5px solid rgba(255,255,255,0.3)' }}>
                Nous contacter
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
