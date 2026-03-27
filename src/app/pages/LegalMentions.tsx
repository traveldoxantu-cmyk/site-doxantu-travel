import { motion } from 'motion/react';
import { Link } from 'react-router';
import { Scale, User, Lock, FileText, Shield } from 'lucide-react';
import { SEO } from '../components/SEO';

const sections = [
  {
    id: 'raison-sociale',
    icon: <FileText className="w-5 h-5" />,
    title: '1. Raison Sociale et Informations Légales',
    content: `
**Dénomination sociale :** Doxantu Travel SARL
**Siège social :** Fann Hock rue 55 en face Canal 4, Dakar
**Capital social :** 5 000 000 FCFA
**Registre du Commerce :** RCCM SN-DKR-2024-B-XXXXX
**Numéro d'Identification Fiscale :** NINEA XXXXXXXX
**Licence d'agence de voyages :** N° 2024-DT-001 - Ministère du Tourisme du Sénégal

**Directeur de la publication :** Abdoulaye Ndiaye

**Contact :**
Email : traveldoxantu@gmail.com
Téléphone : +221 77 674 85 96
    `,
  },
  {
    id: 'activite',
    icon: <Scale className="w-5 h-5" />,
    title: '2. Activité de l\'Agence',
    content: `
Doxantu Travel est une agence de voyages et de tourisme officiellement enregistrée et agréée par le Ministère du Tourisme de la République du Sénégal.

**Nos services incluent :**
- Accompagnement pour les procédures Campus France et études à l'étranger
- Billetterie aérienne (vols nationaux et internationaux)
- Assistance pour les demandes de visa (étudiant, tourisme, affaires)
- Légalisation et traduction de documents officiels
- Conseil en orientation universitaire internationale

Conformément à la loi sénégalaise, notre agence est couverte par une assurance de responsabilité civile professionnelle.
    `,
  },
  {
    id: 'conditions',
    icon: <Shield className="w-5 h-5" />, // Note: I used Shield here, better add it back to imports
    title: '3. Conditions Générales de Vente',
    content: `
**3.1 Tarification**
Les prix indiqués sont en Francs CFA (FCFA) hors taxes sauf mention contraire. Doxantu Travel s'engage à ne pratiquer aucun frais caché. Tout devis émis détaille l'ensemble des prestations incluses.

**3.2 Réservation et Paiement**
Toute réservation est ferme après réception d'un acompte de 30% du montant total. Le solde est dû 72h avant la prestation. Les moyens de paiement acceptés sont : Wave, Orange Money, carte bancaire (Visa/Mastercard), espèces.

**3.3 Annulation et Modification**
- Annulation à plus de 15 jours : remboursement à 80%
- Annulation entre 7 et 15 jours : remboursement à 50%
- Annulation à moins de 7 jours : aucun remboursement sauf cas de force majeure
- Les frais de modification de billets d'avion sont ceux appliqués par les compagnies aériennes.

**3.4 Responsabilité**
Doxantu Travel ne peut être tenu responsable des décisions prises par les ambassades, consulats ou établissements d'enseignement. Nous maximisons les chances de succès de chaque dossier, mais ne garantissons pas l'obtention de visas ou d'admissions.

**3.5 Litiges**
Tout litige sera soumis en premier lieu à une tentative de médiation amiable. En cas d'échec, les tribunaux de Dakar (Sénégal) seront compétents.
    `,
  },
  {
    id: 'confidentialite',
    icon: <Lock className="w-5 h-5" />,
    title: '4. Politique de Confidentialité et Protection des Données',
    content: `
**4.1 Données collectées**
Doxantu Travel collecte uniquement les données personnelles nécessaires à la réalisation des services demandés : nom, prénom, date de naissance, coordonnées (email, téléphone), documents d'identité et académiques.

**4.2 Utilisation des données**
Les données collectées sont utilisées exclusivement pour :
- La constitution et le suivi des dossiers clients
- L'envoi de devis et propositions commerciales personnalisées
- La communication liée aux services commandés

**4.3 Sécurité**
Toutes les données sont stockées de manière sécurisée. Elles ne sont jamais vendues ni cédées à des tiers non autorisés. Certains prestataires techniques peuvent toutefois traiter des données strictement nécessaires au fonctionnement du site (hébergement, carte, messagerie), selon leurs propres politiques.

**4.4 Droits des clients**
Conformément aux lois sénégalaises en vigueur sur la protection des données personnelles, vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Pour exercer ces droits, contactez-nous à : traveldoxantu@gmail.com

**4.5 Cookies et services tiers**
Ce site utilise des cookies techniques nécessaires à son fonctionnement. Aucun cookie de pistage publicitaire n'est utilisé.
Des ressources tierces peuvent être chargées (par exemple Google Maps, Google Fonts, WhatsApp ou images CDN), ce qui peut impliquer la transmission de données techniques (adresse IP, navigateur) aux fournisseurs concernés.
    `,
  },
];

export function LegalMentions() {
  return (
    <div>
      <SEO title="Mentions Légales" description="Mentions légales, politique de confidentialité et conditions générales de vente de l'agence Doxantu Travel." />
      {/* Hero */}
      <section
        className="relative pt-40 pb-16 px-4 sm:px-6 lg:px-8"
        style={{ background: 'linear-gradient(135deg, #072a50 0%, #0B84D8 100%)' }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 bg-[#E8F4FD] text-[#0B84D8]">
              <Scale className="w-8 h-8" />
            </div>
            <h1 className="text-white mb-4" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800 }}>
              Mentions Légales
            </h1>
            <p className="text-blue-200">
              Dernière mise à jour : Février 2026
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#F8FAFC' }}>
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar TOC */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 sticky top-24">
                <h3 className="text-[#333333] font-bold mb-4 text-sm">Sommaire</h3>
                <ul className="space-y-2">
                  {sections.map((s) => (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        className="flex items-center gap-2 text-xs text-gray-500 hover:text-[#0B84D8] transition-colors py-1"
                      >
                        <span className="w-1 h-1 rounded-full bg-[#0B84D8] flex-shrink-0" />
                        {s.title.replace(/^\d+\. /, '')}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Main content */}
            <div className="lg:col-span-3 space-y-6">
              <p className="text-[#333333] mb-4 text-justify font-medium leading-relaxed">
                Conformément aux dispositions de la loi pour la confiance dans l'économie numérique, il est précisé aux utilisateurs du site <span className="text-[#0B84D8] font-bold">Doxantu Travel</span> l'identité des différents intervenants dans le cadre de sa réalisation et de son suivi :
              </p>
              <div className="space-y-4">
                <div className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 items-start">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#0B84D8] shadow-sm border border-gray-100 shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Directeur de la publication</p>
                    <p className="font-bold text-[#1a2b40]">Abdoulaye Ndiaye</p>
                  </div>
                </div>
              </div>

              {sections.map((section, i) => (
                <motion.div
                  key={section.id}
                  id={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#E8F4FD', color: '#0B84D8' }}>
                      {section.icon}
                    </div>
                    <h2 className="text-[#333333]" style={{ fontSize: '1.05rem', fontWeight: 700 }}>
                      {section.title}
                    </h2>
                  </div>
                  <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed">
                    {section.content.split('\n').map((line, j) => {
                      if (!line.trim()) return <br key={j} />;
                      if (line.startsWith('**') && line.endsWith('**')) {
                        return <p key={j} className="font-bold text-[#333333] mt-3 mb-1">{line.replace(/\*\*/g, '')}</p>;
                      }
                      if (line.startsWith('- ')) {
                        return <li key={j} className="ml-4 mb-1">{line.replace(/^- /, '').replace(/\*\*/g, '')}</li>;
                      }
                      const parts = line.split(/\*\*(.*?)\*\*/g);
                      return (
                        <p key={j} className="text-sm mb-1">
                          {parts.map((part, k) =>
                            k % 2 === 1 ? <strong key={k}>{part}</strong> : part
                          )}
                        </p>
                      );
                    })}
                  </div>
                </motion.div>
              ))}

              <div className="p-6 rounded-2xl text-center border-2 shadow-sm" style={{ borderColor: '#0B84D8', backgroundColor: '#F0F8FF' }}>
                <h3 className="text-[#333333] font-bold mb-2">Une question juridique ?</h3>
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                  Doxantu Travel est une agence de voyage et de prestation de services enregistrée au Sénégal.<br />
                  <strong>Siège social :</strong> Fann Hock rue 55 en face Canal 4, Dakar<br />
                  <strong>Téléphone :</strong> +221 77 674 85 96<br />
                  <strong>Email :</strong> traveldoxantu@gmail.com
                </p>
                <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 text-white font-bold transition-all hover:bg-black"
                  style={{ backgroundColor: '#0B84D8', borderRadius: '12px' }}>
                  Nous contacter
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
