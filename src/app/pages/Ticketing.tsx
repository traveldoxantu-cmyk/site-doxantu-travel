import { useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { SEO } from '../components/SEO';
import {
  Plane,
  MapPin,
  Calendar,
  Users,
  ArrowRight,
  CheckCircle,
  Shield,
  RefreshCw,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { buildWhatsAppMessage, openWhatsAppSubmission } from '../lib/submission';

const HERO_IMG =
  'https://images.unsplash.com/photo-1770701502608-f7d49a1134ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhaXJwbGFuZSUyMGZsaWdodCUyMHRyYXZlbCUyMGJsdWUlMjBza3l8ZW58MXx8fHwxNzcyMzEwMTU0fDA&ixlib=rb-4.1.0&q=80&w=1080';

const services = [
  {
    icon: '🌍',
    title: 'Vols internationaux',
    desc: 'Dakar vers toutes les destinations mondiales. Nous négocions les meilleurs tarifs avec les grandes compagnies.',
    features: ['Air France, Royal Air Maroc, Turkish Airlines', 'Classes économique, affaires et première', 'Flexibilité et assistance 24/7'],
  },
  {
    icon: '🇸🇳',
    title: 'Vols nationaux',
    desc: 'Connexions intérieures au Sénégal et en Afrique de l\'Ouest. Rapide et abordable.',
    features: ['Dakar ↔ Ziguinchor', 'Dakar ↔ Saint-Louis', 'Connexions Afrique de l\'Ouest'],
  },
  {
    icon: '🔄',
    title: 'Modification & Annulation',
    desc: 'Un imprévu ? Nous gérons vos modifications et annulations de billets avec réactivité.',
    features: ['Changement de date', 'Remboursement partiel ou total', 'Réservation de vol de remplacement'],
  },
];

const advantages = [
  { icon: <Shield className="w-5 h-5" />, title: 'Paiement sécurisé', desc: 'Wave, Orange Money, Visa' },
  { icon: <Clock className="w-5 h-5" />, title: 'Réponse rapide', desc: 'Devis en moins de 2h' },
  { icon: <RefreshCw className="w-5 h-5" />, title: 'Flexibilité', desc: 'Modification facilitée' },
  { icon: <CheckCircle className="w-5 h-5" />, title: 'Meilleurs tarifs', desc: 'Comparaison multi-compagnies' },
];

export function Ticketing() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [departDate, setDepartDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState('1');
  const [formSent, setFormSent] = useState(false);
  const [formError, setFormError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (returnDate && departDate && returnDate < departDate) {
      setFormError('La date retour doit être après la date aller.');
      return;
    }
    setFormError('');
    const message = buildWhatsAppMessage('Nouvelle demande billetterie', {
      Depart: from,
      Destination: to,
      'Date aller': departDate,
      'Date retour': returnDate,
      Passagers: passengers,
    });
    openWhatsAppSubmission(message);
    setFormSent(true);
  };

  return (
    <div>
      <SEO title="Billetterie Aérienne" description="Réservation de billets d'avion abordables au Sénégal. Vols pas chers vers la France, Canada, et le monde entier avec Doxantu Travel." />
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden pt-28">
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="Avion" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(7,42,80,0.94) 0%, rgba(11,132,216,0.76) 100%)' }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full mb-6"
              style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'white' }}>
              ✈️ Billetterie aérienne
            </span>
            <h1
              className="text-white mb-5"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 800, lineHeight: 1.2 }}
            >
              Réservez vos vols<br />
              <span style={{ color: '#7dd3fc' }}>au meilleur prix</span>
            </h1>
            <p className="text-blue-100 max-w-xl mb-8" style={{ fontSize: '1.05rem', lineHeight: 1.7 }}>
              Vols nationaux, internationaux et assistance modification. Doxantu Travel vous trouve
              le meilleur tarif en toute transparence.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search Engine */}
      <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="p-8 rounded-2xl shadow-2xl border border-gray-100">
            <h2 className="text-[#333333] mb-6" style={{ fontSize: '1.4rem', fontWeight: 700 }}>
              🔍 Rechercher un vol
            </h2>

            {formSent ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-[#333333] font-bold mb-2">Demande envoyée !</h3>
                <p className="text-gray-500 mb-4">Nous vous contacterons avec les meilleures offres disponibles dans les 2h.</p>
                <button onClick={() => setFormSent(false)} className="px-6 py-3 text-white font-semibold" style={{ backgroundColor: '#0B84D8', borderRadius: '12px' }}>
                  Nouvelle recherche
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Départ
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#0B84D8' }} />
                      <input
                        type="text"
                        placeholder="Ville de départ (ex: Dakar)"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        required
                        className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 text-sm bg-gray-50 focus:outline-none focus:ring-2"
                        style={{ borderRadius: '16px' }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Destination
                    </label>
                    <div className="relative">
                      <Plane className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#0B84D8' }} />
                      <input
                        type="text"
                        placeholder="Destination (ex: Paris)"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        required
                        className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 text-sm bg-gray-50 focus:outline-none focus:ring-2"
                        style={{ borderRadius: '16px' }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Date aller
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#0B84D8' }} />
                      <input
                        type="date"
                        value={departDate}
                        onChange={(e) => setDepartDate(e.target.value)}
                        required
                        className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 text-sm bg-gray-50 focus:outline-none focus:ring-2"
                        style={{ borderRadius: '16px' }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Date retour (optionnel)
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#0B84D8' }} />
                      <input
                        type="date"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 text-sm bg-gray-50 focus:outline-none focus:ring-2"
                        style={{ borderRadius: '16px' }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Passagers
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#0B84D8' }} />
                      <select
                        value={passengers}
                        onChange={(e) => setPassengers(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 text-sm bg-gray-50 focus:outline-none focus:ring-2"
                        style={{ borderRadius: '16px' }}
                      >
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                          <option key={n} value={n}>{n} passager{n > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full py-3.5 text-white font-semibold transition-all hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2"
                      style={{ backgroundColor: '#0B84D8', borderRadius: '16px' }}
                    >
                      Obtenir un devis vol <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {formError && <p className="text-xs text-red-500 mb-3">{formError}</p>}
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <Shield className="w-3 h-3" /> Gratuit et sans engagement. Réponse en moins de 2h.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Services */}
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
              Nos offres billetterie
            </span>
            <h2 className="text-[#333333]" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 700 }}>
              Tous types de vols couverts
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
                className="bg-white rounded-[32px] p-7 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
              >
                <div className="text-4xl mb-4">{s.icon}</div>
                <h3 className="text-[#333333] mb-3" style={{ fontSize: '1.15rem', fontWeight: 700 }}>
                  {s.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{s.desc}</p>
                <ul className="space-y-2">
                  {s.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-gray-600">
                      <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: '#0B84D8' }} />
                      {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {advantages.map((adv, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center p-6 rounded-2xl border border-gray-100 hover:border-[#0B84D8] hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: '#E8F4FD', color: '#0B84D8' }}>
                  {adv.icon}
                </div>
                <h4 className="text-[#333333] font-semibold mb-1 text-sm">{adv.title}</h4>
                <p className="text-gray-400 text-xs">{adv.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8" style={{ background: 'linear-gradient(135deg, #072a50 0%, #0B84D8 100%)' }}>
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-5xl mb-5">✈️</div>
            <h2 className="text-white mb-4" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 700 }}>
              Votre prochain vol commence ici
            </h2>
            <p className="text-blue-200 mb-8">
              Obtenez votre devis vol personnalisé en moins de 2h. Sans frais cachés, sans stress.
            </p>
            <Link
              to="/devis"
              className="inline-flex items-center gap-2 px-8 py-4 font-semibold transition-all hover:shadow-xl hover:-translate-y-0.5"
              style={{ backgroundColor: 'white', color: '#0B84D8', borderRadius: '12px' }}
            >
              Obtenir mon devis vol <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
