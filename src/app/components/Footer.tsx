import { Link } from 'react-router';
import { MapPin, Phone, Mail, Facebook, Instagram } from 'lucide-react';
import { motion } from 'motion/react';
import logoImgWhite from '../../assets/logo-doxantu-white.png';

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
  </svg>
);

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ backgroundColor: '#081a2e' }} className="text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Link to="/" className="flex items-center group -ml-4 mb-4">
              <img
                src={logoImgWhite}
                alt="Doxantu Travel"
                style={{ height: '140px', width: 'auto', objectFit: 'contain', display: 'block' }}
                className="group-hover:scale-105 transition-transform duration-300"
              />
            </Link>
            <p className="text-sm leading-relaxed text-blue-100/70 mb-5">
              Votre agence de voyage digitale au Sénégal. Accompagnement étudiant, billetterie et assistance visa.
            </p>
            <div className="flex gap-3">
              <motion.a
                href="#"
                whileHover={{ y: -5, scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all bg-white/5 hover:bg-[#1877F2] hover:shadow-[0_0_15px_rgba(24,119,242,0.5)] border border-white/5"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ y: -5, scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all bg-white/5 hover:bg-gradient-to-tr hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7] hover:shadow-[0_0_15px_rgba(238,42,123,0.5)] border border-white/5"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ y: -5, scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all bg-white/5 hover:bg-black hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] border border-white/5"
                aria-label="TikTok"
              >
                <TikTokIcon className="w-5 h-5 text-white" />
              </motion.a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-lg">Services</h4>
            <ul className="space-y-2.5 text-sm text-blue-100/70">
              <li><Link className="hover:text-[#7dd3fc] transition-colors" to="/services/accompagnement-etudiant">Accompagnement Étudiant</Link></li>
              <li><Link className="hover:text-[#7dd3fc] transition-colors" to="/services/billetterie">Billetterie</Link></li>
              <li><Link className="hover:text-[#7dd3fc] transition-colors" to="/services/visa-documents">Assistance Visa & Documents</Link></li>
              <li><Link className="hover:text-[#7dd3fc] transition-colors" to="/etudes-etranger">Études à l'étranger</Link></li>
              <li><Link className="hover:text-[#7dd3fc] transition-colors" to="/devis">Demande de devis</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-lg">Liens utiles</h4>
            <ul className="space-y-2.5 text-sm text-blue-100/70">
              <li><Link className="hover:text-[#7dd3fc] transition-colors" to="/a-propos">À propos</Link></li>
              <li><Link className="hover:text-[#7dd3fc] transition-colors" to="/contact">Contact</Link></li>
              <li><Link className="hover:text-[#7dd3fc] transition-colors" to="/mentions-legales">Mentions légales</Link></li>
              <li>
                <a
                  href="https://www.campusfrance.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#7dd3fc] transition-colors"
                >
                  Campus France
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-lg">Contact</h4>
            <ul className="space-y-3 text-sm text-blue-100/70">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 mt-0.5 text-[#7dd3fc]" />
                <span>Dakar, Sénégal<br />Plateau, Rue Carnot</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#7dd3fc]" />
                <a href="tel:+221780000000" className="hover:text-[#7dd3fc] transition-colors">+221 78 000 00 00</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#7dd3fc]" />
                <a href="mailto:contact@doxantu-travel.sn" className="hover:text-[#7dd3fc] transition-colors">contact@doxantu-travel.sn</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-blue-100/60">© {currentYear} Doxantu Travel - Agence enregistrée au Sénégal</p>
          <p className="text-xs text-blue-100/50">Conçu à Dakar, pour le monde entier</p>
        </div>
      </div>
    </footer>
  );
}
