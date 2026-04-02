import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Phone, Mail, MapPin, Clock, MessageSquare, Send, CheckCircle } from 'lucide-react';
import { buildWhatsAppMessage, openWhatsAppSubmission } from '../lib/submission';
import { submitContactForm } from '../lib/services/contactService';
import { SEO } from '../components/SEO';
import { useUser } from '../lib/context/UserContext';

const HERO_BG = 'https://images.unsplash.com/photo-1690323223790-4df744a1a033?crop=entropy&cs=tinysrgb&fit=max&fm=webp&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxEYWthciUyMFNlbmVnYWwlMjBjaXR5JTIwbW9kZXJuJTIwYWVyaWFsJTIwdmlld3xlbnwxfHx8fDE3NzIzMTAxNDl8MA&ixlib=rb-4.1.0&q=80&w=1080';

const contactInfo = [
  {
    icon: <Phone className="w-6 h-6" />,
    title: 'Téléphone',
    value: '+221 77 674 85 96',
    sub: 'Lun–Sam : 8h00–20h00',
    href: 'tel:+221776748596',
  },
  {
    icon: <Mail className="w-6 h-6" />,
    title: 'Email',
    value: 'traveldoxantu@gmail.com',
    sub: 'Réponse en moins de 24h',
    href: 'mailto:traveldoxantu@gmail.com',
  },
  {
    icon: <MessageSquare className="w-6 h-6" />,
    title: 'WhatsApp',
    value: '+221 77 674 85 96',
    sub: 'Messagerie instantanée',
    href: 'https://wa.me/221776748596',
  },
  {
    icon: <MapPin className="w-6 h-6" />,
    title: 'Adresse',
    value: 'Fann Hock rue 55 en face Canal 4',
    sub: 'Fann Hock, Dakar',
    href: 'https://maps.google.com/?q=Fann+Hock+Senegal',
  },
];

const services = [
  'Accompagnement Étudiant / Campus France',
  'Billetterie (vol aller-retour)',
  'Assistance Visa Étudiant',
  'Assistance Visa Tourisme',
  'Légalisation & Traduction',
  'Études à l\'Étranger - Information',
  'Autre',
];

export function Contact() {
  const { user } = useUser();
  const [form, setForm] = useState({
    nom: '', email: '', tel: '', service: '', message: '',
  });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  // Pré-remplissage si connecté
  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        nom: `${user.firstName} ${user.lastName}`,
        email: user.email,
        tel: user.phone || ''
      }));
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const message = buildWhatsAppMessage('Nouvelle demande de contact', {
      Nom: form.nom,
      Telephone: form.tel,
      Email: form.email,
      Service: form.service,
      Message: form.message,
    });
    
    // 1. Save to Database
    submitContactForm(form);


    // 2. Open WhatsApp (Redirection immediate pour UX)
    openWhatsAppSubmission(message);
    setSent(true);
    setLoading(false);
  };

  return (
    <div>
      <SEO 
        title="Contactez l'Agence Doxantu Travel | Support & Devis" 
        description="Une question ? Un projet de voyage ou d'études ? Notre équipe vous répond en moins de 24h. Contactez-nous par WhatsApp, Email ou rendez-vous dans nos bureaux à Dakar."
        image={HERO_BG}
      />
      {/* Hero */}
      <section
        className="relative pt-40 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden"
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
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full mb-6"
              style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'white' }}>
              <Phone className="w-3.5 h-3.5" /> Contactez-nous
            </span>
            <h1 className="text-white mb-4" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, lineHeight: 1.2 }}>
              Parlons de votre projet
            </h1>
            <p className="text-blue-100 max-w-lg mx-auto" style={{ fontSize: '1.05rem', lineHeight: 1.7 }}>
              Notre équipe est disponible pour répondre à toutes vos questions. Contactez-nous
              par le canal qui vous convient le mieux.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact cards */}
      <section className="py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#F8FAFC' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 -mt-8">
            {contactInfo.map((info, i) => (
              <motion.a
                key={i}
                href={info.href}
                target={info.href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white rounded-2xl p-7 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 text-center block group"
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white shadow-md shadow-[#0B84D8]/20 group-hover:scale-110 transition-transform" style={{ backgroundColor: '#0B84D8' }}>
                  {info.icon}
                </div>
                <h3 className="text-gray-400 font-bold mb-1 text-xs uppercase tracking-widest">{info.title}</h3>
                <p className="font-bold text-sm sm:text-base mb-1" style={{ color: '#0B84D8' }}>{info.value}</p>
                <p className="text-gray-400 text-xs font-medium">{info.sub}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Form + Map */}
      <section className="py-16 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#F8FAFC' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-10">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
            <div className="bg-white rounded-3xl p-10 shadow-2xl border border-gray-50">
                <div className="mb-8">
                  <h2 className="text-[#333333] mb-2" style={{ fontSize: '1.8rem', fontWeight: 800 }}>
                    Envoyez-nous un message
                  </h2>
                  <p className="text-gray-400 text-sm font-medium">Nous répondons dans les 24h ouvrées.</p>
                </div>

                {sent ? (
                  <div className="text-center py-10">
                    <CheckCircle className="w-16 h-16 mx-auto mb-4" style={{ color: '#0B84D8' }} />
                    <h3 className="text-[#333333] font-bold mb-2" style={{ fontSize: '1.3rem' }}>
                      Message envoyé !
                    </h3>
                    <p className="text-gray-500 mb-5">
                      Merci de nous avoir contactés. Nous vous répondrons dans les plus brefs délais.
                    </p>
                    <button onClick={() => setSent(false)} className="px-6 py-3 text-white font-semibold"
                      style={{ backgroundColor: '#0B84D8', borderRadius: '12px' }}>
                      Envoyer un autre message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                          Nom complet *
                        </label>
                        <input type="text" required placeholder="Prénom NOM"
                          value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })}
                          className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm bg-gray-50 focus:outline-none focus:ring-2"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                          Téléphone *
                        </label>
                        <input type="tel" required placeholder="+221 7X XXX XX XX"
                          value={form.tel} onChange={(e) => setForm({ ...form, tel: e.target.value })}
                          className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm bg-gray-50 focus:outline-none focus:ring-2"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Email
                      </label>
                      <input type="email" required placeholder="votre@email.com"
                        value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm bg-gray-50 focus:outline-none focus:ring-2"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Service concerné *
                      </label>
                      <select required value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm bg-gray-50 focus:outline-none focus:ring-2"
                      >
                        <option value="">Sélectionner…</option>
                        {services.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Message *
                      </label>
                      <textarea required rows={4} placeholder="Décrivez votre besoin ou posez votre question…"
                        value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm bg-gray-50 focus:outline-none focus:ring-2 resize-none"
                      />
                    </div>

                    <button type="submit"
                      disabled={loading}
                      className="w-full py-4 text-white font-bold flex items-center justify-center gap-3 transition-all hover:shadow-xl hover:-translate-y-1 shadow-md shadow-[#0B84D8]/20 disabled:opacity-70 disabled:cursor-not-allowed"
                      style={{ backgroundColor: '#0B84D8', borderRadius: '16px' }}>
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <><Send className="w-5 h-5" /> Envoyer mon message</>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>

            {/* Map + Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* Map */}
              <div className="rounded-3xl overflow-hidden shadow-sm border border-gray-100" style={{ height: '320px' }}>
                <iframe
                  title="Doxantu Travel - Dakar"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30763.14571413065!2d-17.46498!3d14.693425!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xec172f5b3c0f805%3A0x8a949e78e22ff1d5!2sPlateau%2C%20Dakar%2C%20S%C3%A9n%C3%A9gal!5e0!3m2!1sfr!2sfr!4v1700000000000!5m2!1sfr!2sfr"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              {/* Hours */}
              <div className="bg-white rounded-3xl p-7 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#E8F4FD' }}>
                    <Clock className="w-5 h-5" style={{ color: '#0B84D8' }} />
                  </div>
                  <h3 className="text-[#333333] font-bold">Horaires d'ouverture</h3>
                </div>
                <div className="space-y-2">
                  {[
                    { day: 'Lundi – Vendredi', hours: '08h00 – 20h00' },
                    { day: 'Samedi', hours: '09h00 – 18h00' },
                    { day: 'Dimanche', hours: 'WhatsApp uniquement' },
                  ].map((h) => (
                    <div key={h.day} className="flex justify-between items-center py-2 border-b border-gray-50">
                      <span className="text-sm text-[#333333] font-medium">{h.day}</span>
                      <span className="text-sm font-semibold" style={{ color: '#0B84D8' }}>{h.hours}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* WhatsApp CTA */}
              <a
                href="https://wa.me/221776748596?text=Bonjour%20Doxantu%20Travel%2C%20j%27ai%20une%20question."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-5 rounded-2xl transition-all hover:shadow-lg hover:-translate-y-0.5"
                style={{ backgroundColor: '#25D366' }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                  <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-bold">Écrire sur WhatsApp</p>
                  <p className="text-green-100 text-sm">Réponse immédiate · Disponible 7j/7</p>
                </div>
              </a>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
