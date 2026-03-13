import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router';
import { Menu, X, ChevronDown, LayoutGrid } from 'lucide-react';
import logoImg from '../../assets/logo-doxantu.png';
import logoImgWhite from '../../assets/logo-doxantu-white.png';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `font-semibold transition-colors duration-200 hover:text-[#7dd3fc] ${isActive ? 'text-[#7dd3fc]' : scrolled ? 'text-[#1a2b40]' : 'text-white'
    }`;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-5 lg:px-8 pt-4">
      <div
        className={`max-w-7xl mx-auto rounded-2xl transition-all duration-300 ${scrolled
          ? 'bg-white/95 shadow-xl border border-blue-100/80'
          : 'bg-white/12 border border-white/20 backdrop-blur-xl'
          }`}
      >
        <div className="px-4 sm:px-6 h-[100px] flex items-center justify-between">
          <Link to="/" className="flex items-center group">
            <div className="group-hover:scale-105 transition-transform duration-300 -ml-4">
              <img
                src={scrolled ? logoImg : logoImgWhite}
                alt="Doxantu Travel"
                style={{ height: '140px', width: 'auto', objectFit: 'contain', display: 'block' }}
              />
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-9">
            <div className="relative group">
              <button
                className={`flex items-center gap-1.5 font-semibold transition-colors duration-200 hover:text-[#7dd3fc] ${scrolled ? 'text-[#1a2b40]' : 'text-white'
                  }`}
              >
                Services
                <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-200" />
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 bg-white rounded-2xl shadow-2xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100">
                <Link
                  to="/services/accompagnement-etudiant"
                  className="flex items-center gap-3 px-5 py-3.5 hover:bg-[#E8F4FD] text-[#333333] hover:text-[#0B84D8] transition-colors border-b border-gray-50"
                >
                  <span className="text-xl">🎓</span>
                  <span className="text-sm font-medium">Accompagnement Étudiant</span>
                </Link>
                <Link
                  to="/services/billetterie"
                  className="flex items-center gap-3 px-5 py-3.5 hover:bg-[#E8F4FD] text-[#333333] hover:text-[#0B84D8] transition-colors border-b border-gray-50"
                >
                  <span className="text-xl">✈️</span>
                  <span className="text-sm font-medium">Billetterie</span>
                </Link>
                <Link
                  to="/services/visa-documents"
                  className="flex items-center gap-3 px-5 py-3.5 hover:bg-[#E8F4FD] text-[#333333] hover:text-[#0B84D8] transition-colors"
                >
                  <span className="text-xl">📄</span>
                  <span className="text-sm font-medium">Assistance Visa & Documents</span>
                </Link>
              </div>
            </div>

            <NavLink to="/etudes-etranger" className={navLinkClass}>
              Études
            </NavLink>
            <NavLink to="/a-propos" className={navLinkClass}>
              À propos
            </NavLink>
            <NavLink to="/contact" className={navLinkClass}>
              Contact
            </NavLink>
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <div className="relative group">
              <button
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all ${scrolled
                  ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  : 'bg-white/20 text-white hover:bg-white/28'
                  }`}
              >
                <LayoutGrid className="w-4 h-4" /> Mon espace
              </button>
              <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-2 min-w-[200px] flex flex-col gap-1">
                  <Link
                    to="/connexion?role=client"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#E8F4FD] hover:text-[#0B84D8] text-[#333333] transition-colors text-sm font-medium"
                  >
                    👤 Espace Client
                  </Link>
                  <Link
                    to="/connexion?role=admin"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#E8F4FD] hover:text-[#0B84D8] text-[#333333] transition-colors text-sm font-medium"
                  >
                    🛡️ Espace Admin
                  </Link>
                </div>
              </div>
            </div>
            <Link
              to="/devis"
              className="inline-flex items-center gap-2 px-6 py-2.5 text-white font-semibold text-sm transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5"
              style={{ backgroundColor: '#0B84D8', borderRadius: '14px' }}
            >
              Commencer ma demande →
            </Link>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`lg:hidden p-2 rounded-xl transition-colors ${scrolled ? 'text-[#333333] hover:bg-gray-100' : 'text-white hover:bg-white/20'
              }`}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${mobileOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
            }`}
        >
          <div className="bg-white border-t border-gray-100 shadow-2xl px-4 py-5 space-y-1 rounded-b-2xl">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 pb-1">Services</p>
            {[
              { to: '/services/accompagnement-etudiant', label: '🎓 Accompagnement Étudiant' },
              { to: '/services/billetterie', label: '✈️ Billetterie' },
              { to: '/services/visa-documents', label: '📄 Assistance Visa & Documents' },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-[#333333] hover:bg-[#E8F4FD] hover:text-[#0B84D8] transition-colors font-medium text-sm"
              >
                {item.label}
              </Link>
            ))}

            <div className="border-t border-gray-100 pt-2 mt-2 space-y-1">
              {[
                { to: '/etudes-etranger', label: '🌍 Études à l\'étranger' },
                { to: '/a-propos', label: '🏢 À propos' },
                { to: '/contact', label: '📞 Contact' },
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 rounded-xl text-[#333333] hover:bg-[#E8F4FD] hover:text-[#0B84D8] transition-colors font-medium text-sm"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-2 mt-2 space-y-1">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 pb-1 pt-2">Mon Espace</p>
              <Link
                to="/connexion?role=client"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-[#333333] hover:bg-[#E8F4FD] hover:text-[#0B84D8] transition-colors font-medium text-sm"
              >
                👤 Espace Client
              </Link>
              <Link
                to="/connexion?role=admin"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-[#333333] hover:bg-[#E8F4FD] hover:text-[#0B84D8] transition-colors font-medium text-sm"
              >
                🛡️ Espace Admin
              </Link>
            </div>

            <Link
              to="/devis"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-3 rounded-xl text-white text-center font-medium mt-3 hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#0B84D8', borderRadius: '12px' }}
            >
              Commencer ma demande →
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
