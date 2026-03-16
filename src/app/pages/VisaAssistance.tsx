import { Link } from 'react-router';
import { motion } from 'motion/react';
import { CheckCircle, ArrowRight, Shield, Clock, FileText, Globe, BookOpen } from 'lucide-react';
import { SEO } from '../components/SEO';
const HERO_BG = 'https://images.unsplash.com/photo-1690323223790-4df744a1a033?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxEYWthciUyMFNlbmVnYWwlMjBjaXR5JTIwbW9kZXJuJTIwYWVyaWFsJTIwdmlld3xlbnwxfHx8fDE3NzIzMTAxNDl8MA&ixlib=rb-4.1.0&q=80&w=1080';

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
  },
];

const process = [
  { step: '01', title: 'Consultation', desc: 'Analyse de votre dossier et identification des besoins' },
  { step: '02', title: 'Préparation', desc: 'Constitution et vérification de tous les documents requis' },
  { step: '03', title: 'Dépôt', desc: 'Dépôt du dossier à l\'ambassade ou au consulat concerné' },
  { step: '04', title: 'Suivi', desc: 'Suivi de votre dossier jusqu\'à la décision finale' },
];

export function VisaAssistance() {
  return (
    <div>
      <SEO 
        title="Études à l'étranger" 
        description="Besoin d'un accompagnement Campus France au Sénégal ? Doxantu Travel vous guide pour vos études en France, Canada, Maroc et Turquie. Expertise et transparence garanties." 
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
              <Link to="/devis" className="inline-flex items-center gap-2 px-7 py-4 text-white font-semibold transition-all hover:shadow-xl hover:-translate-y-0.5"
                style={{ backgroundColor: '#0B84D8', borderRadius: '16px' }}>
                Commencer ma demande <ArrowRight className="w-5 h-5" />
              </Link>
              <a href="https://wa.me/221780000000" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-4 font-semibold transition-all"
                style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', borderRadius: '16px', border: '1.5px solid rgba(255,255,255,0.3)' }}>
                💬 Poser une question
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-white">
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
            <h2 className="text-[#333333]" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 700 }}>
              Une expertise pour chaque besoin
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className={`rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden ${
                  s.highlight ? 'border-2' : 'border border-gray-100 bg-white'
                }`}
                style={s.highlight ? { borderColor: '#0B84D8', backgroundColor: '#F0F8FF' } : {}}
              >
                {s.badge && (
                  <div
                    className="absolute top-5 right-5 text-xs font-semibold px-3 py-1 rounded-full text-white"
                    style={{ backgroundColor: '#0B84D8' }}
                  >
                    {s.badge}
                  </div>
                )}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                  style={s.highlight ? { backgroundColor: '#0B84D8', color: 'white' } : { backgroundColor: '#E8F4FD', color: '#0B84D8' }}
                >
                  {s.icon}
                </div>
                <h3 className="text-[#333333] mb-3" style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                  {s.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-5">{s.desc}</p>
                <ul className="space-y-2.5">
                  {s.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-2.5 text-sm">
                      <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#0B84D8' }} />
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/devis"
                  className="mt-6 inline-flex items-center gap-1 text-sm font-semibold hover:gap-2 transition-all rounded-2xl"
                  style={{ color: '#0B84D8' }}
                >
                  Commencer ma demande <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#F8FAFC' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="text-sm font-semibold uppercase tracking-widest mb-3 block" style={{ color: '#0B84D8' }}>
              Comment ça marche
            </span>
            <h2 className="text-[#333333]" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 700 }}>
              Un processus simple en 4 étapes
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {process.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center hover:shadow-lg transition-all"
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 font-bold text-white"
                  style={{ backgroundColor: '#0B84D8' }}
                >
                  {p.step}
                </div>
                <h4 className="text-[#333333] font-bold mb-2">{p.title}</h4>
                <p className="text-gray-400 text-sm">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust + CTA */}
      <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6 mb-12">
            {[
              { icon: <Shield className="w-6 h-6" />, title: 'Dossier vérifié', desc: 'Chaque document est contrôlé avant soumission pour maximiser vos chances.' },
              { icon: <Clock className="w-6 h-6" />, title: 'Délais respectés', desc: 'Nous suivons vos délais consulaires avec rigueur pour aucun retard.' },
              { icon: <CheckCircle className="w-6 h-6" />, title: 'Taux de succès élevé', desc: 'Plus de 95% de nos dossiers obtiennent un résultat positif la première fois.' },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-6 rounded-2xl border border-gray-100 hover:border-[#0B84D8] transition-all"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: '#E8F4FD', color: '#0B84D8' }}>
                  {t.icon}
                </div>
                <h4 className="text-[#333333] font-bold mb-2">{t.title}</h4>
                <p className="text-gray-500 text-sm">{t.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center p-10 rounded-2xl" style={{ background: 'linear-gradient(135deg, #072a50 0%, #0B84D8 100%)' }}>
            <h2 className="text-white mb-3" style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)', fontWeight: 700 }}>
              Prêt à démarrer votre demande de visa ?
            </h2>
            <p className="text-blue-200 mb-6">Consultation gratuite · Réponse en 24h · Sans engagement</p>
            <Link to="/devis" className="inline-flex items-center gap-2 px-7 py-4 font-semibold transition-all hover:shadow-xl hover:-translate-y-0.5 rounded-2xl"
              style={{ backgroundColor: 'white', color: '#0B84D8' }}>
              Commencer ma demande <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
