import { useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { SEO } from '../components/SEO';
import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  FileText,
  UserCheck,
  Calendar,
  Stamp,
  Shield,
  Clock,
  GraduationCap
} from 'lucide-react';
import statueHero from '../../assets/statue-renaissance.jpg';

const steps = [
  {
    number: '01',
    icon: <UserCheck className="w-7 h-7" />,
    title: 'Orientation',
    desc: 'Analyse de votre profil, choix de la filière et de l\'établissement adapté à votre projet.',
    duration: '1–3 jours',
    color: '#0B84D8',
  },
  {
    number: '02',
    icon: <FileText className="w-7 h-7" />,
    title: 'Constitution du dossier',
    desc: 'Préparation complète de votre dossier Campus France : documents, lettres, CV, portfolio.',
    duration: '5–10 jours',
    color: '#0B84D8',
  },
  {
    number: '03',
    icon: <Calendar className="w-7 h-7" />,
    title: 'Prise de rendez-vous',
    desc: 'Planification de votre entretien Campus France et préparation aux questions fréquentes.',
    duration: '2–5 jours',
    color: '#0B84D8',
  },
  {
    number: '04',
    icon: <Stamp className="w-7 h-7" />,
    title: 'Suivi visa',
    desc: 'Accompagnement pour votre demande de visa étudiant jusqu\'à l\'obtention finale.',
    duration: '3–6 semaines',
    color: '#0B84D8',
  },
];

const documents = [
  'Acte de naissance original',
  'Copies des diplômes et relevés de notes',
  'Pièce d\'identité (CNI ou passeport)',
  'Photo d\'identité récente',
  'Lettre de motivation personnalisée',
  'CV académique',
  'Justificatif de ressources financières',
  'Attestation d\'hébergement (si disponible)',
  'Formulaire Campus France complété',
  'Résultats du baccalauréat',
];

const faqs = [
  {
    q: 'Qu\'est-ce que Campus France ?',
    a: 'Campus France est l\'agence française de promotion de l\'enseignement supérieur et de l\'accueil des étudiants étrangers en France. Toute candidature dans un établissement d\'enseignement supérieur français nécessite un passage obligatoire par la plateforme Campus France.',
  },
  {
    q: 'Combien de temps dure la procédure Campus France ?',
    a: 'La procédure Campus France dure généralement entre 2 et 4 mois. Il est recommandé de commencer les démarches au moins 6 mois avant la date de rentrée souhaitée. Avec Doxantu Travel, nous optimisons chaque étape pour gagner du temps.',
  },
  {
    q: 'Quels sont vos tarifs pour l\'accompagnement étudiant ?',
    a: 'Nos tarifs varient selon le niveau d\'accompagnement souhaité. Nous proposons des formules de base (orientation + dossier) jusqu\'au pack complet (tout inclus : Campus France, visa, billet d\'avion). Contactez-nous pour un devis personnalisé gratuit.',
  },
  {
    q: 'Garantissez-vous l\'obtention du visa ?',
    a: 'Aucune agence ne peut légalement garantir l\'obtention d\'un visa, car la décision appartient aux ambassades. En revanche, nous maximisons vos chances en préparant un dossier complet, solide et conforme aux exigences consulaires.',
  },
  {
    q: 'Pouvez-vous m\'aider après l\'obtention du visa ?',
    a: 'Absolument ! Nous vous assistons également pour la recherche de logement, les billets d\'avion, l\'assurance voyage, et tout autre besoin lié à votre installation dans votre pays d\'études.',
  },
];

export function StudentSupport() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div>
      <SEO 
        title="Campus France Sénégal | Accompagnement Études en France" 
        description="Réussissez votre procédure Campus France au Sénégal avec Doxantu Travel. Orientation, constitution de dossier, préparation d'entretien et assistance visa étudiant." 
      />
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden pt-28">
        <div className="absolute inset-0 z-0">
          <img
            src={statueHero}
            alt="Dakar Renaissance"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(102deg, rgba(7,42,80,0.92) 5%, rgba(7,42,80,0.7) 40%, rgba(11,132,216,0.4) 70%, rgba(8,31,62,0.95) 100%)' }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full mb-6"
              style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'white' }}>
              <GraduationCap className="w-4 h-4 mr-1 text-blue-300" /> Campus France & Études à l'Étranger
            </span>
            <h1
              className="text-white mb-5"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 800, lineHeight: 1.2 }}
            >
              Réussissez votre procédure<br />
              <span style={{ color: '#7dd3fc' }}>Campus France</span> en toute sérénité
            </h1>
            <p className="text-blue-100 mb-8 max-w-2xl" style={{ fontSize: '1.1rem', lineHeight: 1.7 }}>
              Notre équipe d'experts vous guide de l'orientation jusqu'à l'obtention de votre visa.
              Chaque dossier est traité avec attention et professionnalisme.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Process Timeline */}
      <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-sm font-semibold uppercase tracking-widest mb-3 block" style={{ color: '#0B84D8' }}>
              Notre Processus
            </span>
            <h2 className="text-[#333333] mb-4" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700 }}>
              En 4 étapes claires vers votre visa
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Un accompagnement structuré qui vous permet de ne rien oublier et d'avancer sereinement.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Connecting line on desktop */}
            <div className="hidden lg:block absolute top-16 left-1/4 right-1/4 h-0.5 z-0"
              style={{ background: `linear-gradient(to right, #0B84D8, #0B84D8)`, left: '12.5%', right: '12.5%' }} />

            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="relative bg-white rounded-2xl p-7 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 z-10"
              >
                {/* Step number */}
                <div className="flex items-start justify-between mb-5">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-white flex-shrink-0"
                    style={{ backgroundColor: '#0B84D8' }}
                  >
                    {step.icon}
                  </div>
                  <span
                    className="text-5xl font-black opacity-10"
                    style={{ color: '#0B84D8', lineHeight: 1 }}
                  >
                    {step.number}
                  </span>
                </div>
                <h3 className="text-[#333333] mb-3" style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                  {step.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{step.desc}</p>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" style={{ color: '#0B84D8' }} />
                  <span className="text-xs font-medium" style={{ color: '#0B84D8' }}>{step.duration}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Documents Required */}
      <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#F8FAFC' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-sm font-semibold uppercase tracking-widest mb-3 block" style={{ color: '#0B84D8' }}>
                Documents requis
              </span>
              <h2 className="text-[#333333] mb-4" style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', fontWeight: 700 }}>
                Ce qu'il vous faut préparer
              </h2>
              <p className="text-gray-500 mb-8 leading-relaxed">
                Ne laissez rien au hasard. Voici la liste complète des documents nécessaires
                pour votre dossier Campus France. Notre équipe vérifie chaque pièce.
              </p>

              <div className="grid sm:grid-cols-2 gap-3">
                {documents.map((doc, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                    className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:border-[#0B84D8] hover:shadow-md transition-all"
                  >
                    <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#0B84D8' }} />
                    <span className="text-sm text-[#333333]">{doc}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div
                className="p-8 rounded-2xl"
                style={{ background: 'linear-gradient(135deg, #072a50 0%, #0B84D8 100%)' }}
              >
                <h3 className="text-white mb-2 flex items-center gap-2" style={{ fontSize: '1.3rem', fontWeight: 700 }}>
                  <Shield className="w-6 h-6 text-blue-300" /> Pack Campus France Complet
                </h3>
                <p className="text-blue-200 text-sm mb-6">Tout est inclus. Aucune surprise.</p>

                <ul className="space-y-3.5 mb-8">
                  {[
                    'Analyse complète de votre profil',
                    'Choix des établissements & filières',
                    'Préparation du dossier Campus France',
                    'Simulation d\'entretien Campus France',
                    'Accompagnement pour la demande de visa',
                    'Aide à la recherche de logement',
                    'Billet d\'avion au meilleur tarif',
                    'Suivi 24h / 7j jusqu\'au départ',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-white">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                        <CheckCircle className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/devis?service=campus-france"
                  className="flex items-center justify-center gap-2 py-3.5 font-semibold transition-all hover:shadow-xl hover:-translate-y-0.5 rounded-2xl"
                  style={{ backgroundColor: 'white', color: '#0B84D8' }}
                >
                  Faire ma demande <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="flex items-center gap-2 mt-4 justify-center">
                  <Shield className="w-4 h-4 text-blue-300" />
                  <span className="text-blue-200 text-xs">Aucun frais caché · Transparence garantie</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="text-sm font-semibold uppercase tracking-widest mb-3 block" style={{ color: '#0B84D8' }}>
              FAQ Étudiant
            </span>
            <h2 className="text-[#333333]" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 700 }}>
              Questions fréquentes
            </h2>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="border border-gray-200 rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left transition-colors hover:bg-[#F8FAFC]"
                >
                  <span className="font-semibold text-[#333333] text-sm pr-4">{faq.q}</span>
                  {openFaq === i ? (
                    <ChevronUp className="w-5 h-5 flex-shrink-0" style={{ color: '#0B84D8' }} />
                  ) : (
                    <ChevronDown className="w-5 h-5 flex-shrink-0 text-gray-400" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5">
                    <p className="text-gray-500 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8" style={{ background: 'linear-gradient(135deg, #072a50 0%, #0B84D8 100%)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-6 bg-white/10 backdrop-blur-sm border border-white/20">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-white mb-4" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700 }}>
              Prêt à commencer votre procédure ?
            </h2>
            <p className="text-blue-200 mb-8 max-w-lg mx-auto">
              Rejoignez les 500+ étudiants sénégalais que nous avons accompagnés vers leur réussite internationale.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/devis"
                className="inline-flex items-center gap-2 px-8 py-4 text-white font-semibold transition-all hover:shadow-xl hover:-translate-y-0.5 rounded-2xl"
                style={{ backgroundColor: 'rgba(255,255,255,0.2)', border: '2px solid white' }}
              >
                Faire ma demande <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="https://wa.me/221776748596"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 font-semibold transition-all hover:shadow-xl hover:-translate-y-0.5 rounded-2xl"
                style={{ backgroundColor: '#25D366', color: 'white' }}
              >
                💬 WhatsApp direct
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
