import { Link } from 'react-router';
import { Plane, MapPin, Phone, Mail, Facebook, Instagram, Linkedin } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ backgroundColor: '#081a2e' }} className="text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#0B84D8' }}>
                <Plane className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-xl font-bold text-white">
                Doxantu <span style={{ color: '#45c2ff' }}>Travel</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-blue-100/70 mb-5">
              Votre agence de voyage digitale au Senegal. Accompagnement etudiant, billetterie et assistance visa.
            </p>
            <div className="flex gap-2.5">
              {[Facebook, Instagram, Linkedin].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors bg-white/10 hover:bg-[#0B84D8]"
                  aria-label="Reseau social"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Services</h4>
            <ul className="space-y-2.5 text-sm text-blue-100/70">
              <li><Link className="hover:text-[#7dd3fc]" to="/services/accompagnement-etudiant">Accompagnement Etudiant</Link></li>
              <li><Link className="hover:text-[#7dd3fc]" to="/services/billetterie">Billetterie</Link></li>
              <li><Link className="hover:text-[#7dd3fc]" to="/services/visa-documents">Assistance Visa & Documents</Link></li>
              <li><Link className="hover:text-[#7dd3fc]" to="/etudes-etranger">Etudes a l'etranger</Link></li>
              <li><Link className="hover:text-[#7dd3fc]" to="/devis">Demande de devis</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Liens utiles</h4>
            <ul className="space-y-2.5 text-sm text-blue-100/70">
              <li><Link className="hover:text-[#7dd3fc]" to="/a-propos">A propos</Link></li>
              <li><Link className="hover:text-[#7dd3fc]" to="/contact">Contact</Link></li>
              <li><Link className="hover:text-[#7dd3fc]" to="/mentions-legales">Mentions legales</Link></li>
              <li>
                <a
                  href="https://www.campusfrance.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#7dd3fc]"
                >
                  Campus France
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-blue-100/70">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 mt-0.5 text-[#7dd3fc]" />
                <span>Dakar, Senegal<br />Plateau, Rue Carnot</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#7dd3fc]" />
                <a href="tel:+221780000000" className="hover:text-[#7dd3fc]">+221 78 000 00 00</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#7dd3fc]" />
                <a href="mailto:contact@doxantu-travel.sn" className="hover:text-[#7dd3fc]">contact@doxantu-travel.sn</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-blue-100/60">© {currentYear} Doxantu Travel - Agence enregistree au Senegal</p>
          <p className="text-xs text-blue-100/50">Concu a Dakar, pour le monde entier</p>
        </div>
      </div>
    </footer>
  );
}
