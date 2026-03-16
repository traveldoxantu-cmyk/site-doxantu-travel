import { Link } from 'react-router';
import { MapPin, Phone, Mail, Facebook, Instagram } from 'lucide-react';
import { motion } from 'motion/react';
import logoImgWhite from '../../assets/logo-doxantu-white.png';

export function Footer() {

  return (
    <footer style={{ backgroundColor: '#081a2e' }} className="text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-14 items-start">
          
          {/* Column 1: Branding */}
          <div className="flex flex-col">
            <p className="text-[13px] leading-relaxed text-blue-100/40 mb-8 max-w-[300px] font-medium">
              L'agence digitale de référence pour la mobilité étudiante au Sénégal. Excellence, transparence et accompagnement sans limites.
            </p>
            <Link to="/" className="group block mb-10">
              <img
                src={logoImgWhite}
                alt="Doxantu Travel"
                style={{ objectFit: 'contain', objectPosition: 'left center' }}
                className="h-[100px] sm:h-[120px] w-auto group-hover:scale-105 transition-transform duration-300"
              />
            </Link>
            <div className="flex gap-4">
              {[
                { icon: <Facebook className="w-4 h-4" />, label: 'Facebook', href: '#' },
                { icon: <Instagram className="w-4 h-4" />, label: 'Instagram', href: '#' },
                { 
                  icon: (
                    <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
                      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" /><circle cx="4" cy="4" r="2" />
                    </svg>
                  ), 
                  label: 'Linkedin', 
                  href: '#' 
                },
              ].map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ y: -3, backgroundColor: 'rgba(255,255,255,0.1)', borderColor: '#0B84D8', color: '#0B84D8' }}
                  className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center text-white/30 transition-all duration-300 border border-white/[0.05]"
                  aria-label={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Column 2: Services */}
          <div>
            <h4 className="font-bold mb-9 text-[11px] tracking-[0.4em] uppercase" style={{ color: '#0B84D8' }}>SERVICES</h4>
            <ul className="space-y-4 text-[13px] text-blue-100/50 font-medium">
              <li><Link className="hover:text-white transition-colors" to="/services/accompagnement-etudiant">Accompagnement Étudiant</Link></li>
              <li><Link className="hover:text-white transition-colors" to="/services/billetterie">Billetterie</Link></li>
              <li><Link className="hover:text-white transition-colors" to="/services/visa-documents">Assistance Visa & Documents</Link></li>
              <li><Link className="hover:text-white transition-colors" to="/etudes-etranger">Études à l'étranger</Link></li>
              <li><Link className="hover:text-white transition-colors" to="/devis">Faire ma demande</Link></li>
            </ul>
          </div>

          {/* Column 3: Liens Utiles */}
          <div>
            <h4 className="font-bold mb-9 text-[11px] tracking-[0.4em] uppercase" style={{ color: '#0B84D8' }}>LIENS UTILES</h4>
            <ul className="space-y-4 text-[13px] text-blue-100/50 font-medium">
              <li><Link className="hover:text-white transition-colors" to="/a-propos">À propos</Link></li>
              <li><Link className="hover:text-white transition-colors" to="/contact">Contact</Link></li>
              <li><Link className="hover:text-white transition-colors" to="/mentions-legales">Mentions légales</Link></li>
              <li><a href="https://www.campusfrance.org" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Campus France</a></li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 className="font-bold mb-9 text-[11px] tracking-[0.4em] uppercase" style={{ color: '#0B84D8' }}>CONTACT</h4>
            <ul className="space-y-5 text-[13px] text-blue-100/50 font-medium">
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#0B84D8] shrink-0" />
                <a href="tel:+221776748596" className="hover:text-white transition-colors">+221 77 674 85 96</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#0B84D8] shrink-0" />
                <a href="mailto:traveldoxantu@gmail.com" className="hover:text-white transition-colors">traveldoxantu@gmail.com</a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#0B84D8] shrink-0 mt-0.5" />
                <span className="leading-relaxed">Fann Hock rue 55 en face Canal 4</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-blue-100/10 text-[10px] font-bold uppercase tracking-[0.2em]">
              © {new Date().getFullYear()} Doxantu Travel. Tous droits réservés.
            </p>
            <div className="flex items-center gap-10">
              <Link to="/mentions-legales" className="text-[10px] font-bold text-blue-100/20 hover:text-white transition-colors uppercase tracking-[0.2em]">Mentions légales</Link>
              <Link to="/mentions-legales#confidentialite" className="text-[10px] font-bold text-blue-100/20 hover:text-white transition-colors uppercase tracking-[0.2em]">Politique de confidentialité</Link>
              <Link to="/mentions-legales#conditions" className="text-[10px] font-bold text-blue-100/20 hover:text-white transition-colors uppercase tracking-[0.2em]">CGV</Link>
            </div>
          </div>
        </div>
      </div>

    </footer>
  );
}
