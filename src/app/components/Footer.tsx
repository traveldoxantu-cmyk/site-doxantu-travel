import { Link } from 'react-router';
import { MapPin, Phone, Mail, Facebook, Instagram } from 'lucide-react';
import { motion } from 'motion/react';
import logoWhite from '../../assets/logo-doxantu-white.png';

export function Footer() {

  return (
    <footer style={{ backgroundColor: '#081a2e' }} className="text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-14 items-start">
          
          {/* Column 1: Branding */}
          <div className="flex flex-col">
            <div>
              <img src={logoWhite} alt="Doxantu Travel" className="h-20 w-auto object-contain mb-5" />
              <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-sm">
                L'agence digitale de référence pour la mobilité étudiante au Sénégal. Excellence, transparence et accompagnement sans limites.
              </p>
            </div>
            <div className="flex gap-4">
              {[
                { 
                  icon: <Instagram className="w-4 h-4" />, 
                  label: 'Instagram', 
                  href: 'https://www.instagram.com/doxantutravel?igsh=Z3lwMmxnejliY3N4&utm_source=qr' 
                },
                { 
                  icon: (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.9-.32-1.9-.23-2.74.12-.69.3-1.27.77-1.62 1.4-.4.71-.41 1.67-.1 2.44.21.52.65.98 1.11 1.25.46.26.96.4 1.46.47h.12c.64-.01 1.29-.11 1.9-.34 1.05-.33 1.86-1.1 2.22-2.12.06-.17.11-.34.13-.52.09-1.31.02-2.61.03-3.92-.01-5.6-.01-11.2 0-16.81z"/>
                    </svg>
                  ), 
                  label: 'TikTok', 
                  href: 'https://www.tiktok.com/@doxantu.travel?_r=1&_t=ZS-95W9eGMDgGL' 
                },
              ].map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
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
            <p className="text-blue-100/40 text-[10px] font-bold uppercase tracking-[0.2em]">
              © {new Date().getFullYear()} Doxantu Travel. Tous droits réservés.
            </p>
            <div className="flex items-center gap-10">
              <Link to="/mentions-legales" className="text-[10px] font-bold text-blue-100/40 hover:text-white transition-colors uppercase tracking-[0.2em]">Mentions légales</Link>
              <Link to="/mentions-legales#confidentialite" className="text-[10px] font-bold text-blue-100/40 hover:text-white transition-colors uppercase tracking-[0.2em]">Politique de confidentialité</Link>
              <Link to="/mentions-legales#conditions" className="text-[10px] font-bold text-blue-100/40 hover:text-white transition-colors uppercase tracking-[0.2em]">CGV</Link>
            </div>
          </div>
        </div>
      </div>

    </footer>
  );
}
