import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router';
import { Menu, X, ChevronDown, LayoutGrid, User, GraduationCap, Plane, FileText, Globe, History, Phone, LogIn } from 'lucide-react';
import logoImg from '../../assets/logo-doxantu.png';
import logoImgWhite from '../../assets/logo-doxantu-white.png';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Vérifier si l'utilisateur est connecté
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `font-semibold transition-colors duration-200 hover:text-[#7dd3fc] ${isActive ? 'text-[#7dd3fc]' : scrolled ? 'text-[#1a2b40]' : 'text-white'
    }`;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-5 lg:px-8 pt-4">
      <div
        className={`max-w-7xl mx-auto rounded-2xl transition-all duration-300 ${scrolled || mobileOpen
          ? 'bg-white shadow-xl border border-blue-100/80 backdrop-blur-md'
          : 'bg-white/12 border border-white/20 backdrop-blur-xl'
          }`}
      >
        <div className="px-4 sm:px-6 h-[80px] md:h-[90px] flex items-center justify-between">
          <Link to="/" className="flex items-center group">
            <div className="group-hover:scale-105 transition-transform duration-300 -ml-2 relative">
              <img
                src={(scrolled || mobileOpen) ? logoImg : logoImgWhite}
                alt="Doxantu Travel"
                className="h-[105px] md:h-[135px] w-auto object-contain block relative z-10 -mt-1"
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
                  className="flex items-center gap-3 px-5 py-3.5 hover:bg-[#E8F4FD] text-[#333333] hover:text-[#0B84D8] transition-colors border-b border-gray-50 group/item"
                >
                  <GraduationCap className="w-5 h-5 text-[#0B84D8]" />
                  <span className="text-sm font-medium">Accompagnement Étudiant</span>
                </Link>
                <Link
                  to="/services/billetterie"
                  className="flex items-center gap-3 px-5 py-3.5 hover:bg-[#E8F4FD] text-[#333333] hover:text-[#0B84D8] transition-colors border-b border-gray-50 group/item"
                >
                  <Plane className="w-5 h-5 text-[#0B84D8]" />
                  <span className="text-sm font-medium">Billetterie</span>
                </Link>
                <Link
                  to="/services/visa-documents"
                  className="flex items-center gap-3 px-5 py-3.5 hover:bg-[#E8F4FD] text-[#333333] hover:text-[#0B84D8] transition-colors group/item"
                >
                  <FileText className="w-5 h-5 text-[#0B84D8]" />
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
            <div className="relative group/espace">
              <button
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all ${scrolled
                  ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  : 'bg-white/20 text-white hover:bg-white/28'
                  }`}
              >
                {user ? (
                   <div className="w-6 h-6 rounded-lg bg-[#0B84D8] text-white flex items-center justify-center text-[10px] font-black">
                     {user.initiales}
                   </div>
                ) : (
                  <LayoutGrid className="w-4 h-4" />
                )}
                {user ? 'Mon profil' : 'Mon espace'}
                <ChevronDown className="w-3.5 h-3.5 group-hover/espace:rotate-180 transition-transform duration-200" />
              </button>
              <div className="absolute top-full right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl overflow-hidden opacity-0 invisible group-hover/espace:opacity-100 group-hover/espace:visible transition-all duration-200 border border-gray-100 py-1">
                {user ? (
                  <>
                    <div className="px-5 py-3 border-b border-gray-50">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Connecté en tant que</p>
                      <p className="text-sm font-bold text-[#1a2b40] truncate">{user.firstName} {user.lastName}</p>
                    </div>
                    <Link
                      to={user.role === 'admin' ? '/admin/dashboard' : '/mon-espace/dashboard'}
                      className="flex items-center gap-3 px-5 py-3 hover:bg-[#E8F4FD] text-[#333333] hover:text-[#0B84D8] transition-colors group/item"
                    >
                      <LayoutGrid className="w-4 h-4 text-[#0B84D8]" />
                      <span className="text-sm font-medium">Tableau de bord</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-5 py-3 hover:bg-red-50 text-red-600 transition-colors group/item"
                    >
                      <LogIn className="w-4 h-4 rotate-180" />
                      <span className="text-sm font-medium">Se déconnecter</span>
                    </button>
                  </>
                ) : (
                  <Link
                    to="/connexion"
                    className="flex items-center gap-3 px-5 py-3.5 hover:bg-[#E8F4FD] text-[#333333] hover:text-[#0B84D8] transition-colors group/item"
                  >
                    <LogIn className="w-4 h-4 text-[#0B84D8]" />
                    <span className="text-sm font-medium">Se connecter</span>
                  </Link>
                )}
              </div>
            </div>
            <Link
              to="/devis"
              className="inline-flex items-center gap-2 px-6 py-2.5 text-white font-semibold text-sm transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5"
              style={{ backgroundColor: '#0B84D8', borderRadius: '14px' }}
            >
              Faire ma demande →
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
              { to: '/services/accompagnement-etudiant', label: 'Accompagnement Étudiant' },
              { to: '/services/billetterie', label: 'Billetterie' },
              { to: '/services/visa-documents', label: 'Assistance Visa & Documents' },
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
                { to: '/etudes-etranger', label: "Études à l'étranger", icon: <Globe className="w-4 h-4" /> },
                { to: '/a-propos', label: 'À propos', icon: <History className="w-4 h-4" /> },
                { to: '/contact', label: 'Contact', icon: <Phone className="w-4 h-4" /> },
              ].map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                >
                  {({ isActive }) => (
                    <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium text-sm ${isActive ? 'bg-[#E8F4FD] text-[#0B84D8]' : 'text-[#333333] hover:bg-[#E8F4FD] hover:text-[#0B84D8]'}`}>
                      <span className="flex-shrink-0">{item.icon}</span>
                      {item.label}
                    </div>
                  )}
                </NavLink>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-2 mt-2 space-y-1">
              {user ? (
                <>
                  <Link
                    to={user.role === 'admin' ? '/admin/dashboard' : '/mon-espace/dashboard'}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#E8F4FD] hover:text-[#0B84D8] text-[#333333] transition-colors text-sm font-medium"
                  >
                    <LayoutGrid className="w-4 h-4" /> Tableau de bord
                  </Link>
                  <button
                    onClick={() => { setMobileOpen(false); handleLogout(); }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-600 transition-colors text-sm font-medium"
                  >
                    <LogIn className="w-4 h-4 rotate-180" /> Se déconnecter
                  </button>
                </>
              ) : (
                <Link
                  to="/connexion"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#E8F4FD] hover:text-[#0B84D8] text-[#333333] transition-colors text-sm font-medium"
                >
                  <User className="w-4 h-4" /> Mon espace
                </Link>
              )}
            </div>

            <Link
              to="/devis"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-3 rounded-xl text-white text-center font-medium mt-3 hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#0B84D8', borderRadius: '12px' }}
            >
              Faire ma demande →
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
