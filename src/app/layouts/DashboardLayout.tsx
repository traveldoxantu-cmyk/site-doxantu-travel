import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router';
import { LayoutGrid, FolderOpen, FileText, MessageSquare, Calendar, User, LogOut, GraduationCap, ArrowLeft, CreditCard, Menu as MenuIcon } from 'lucide-react';
import logoImgWhite from '../../assets/logo-doxantu-white.png';

const sidebarLinks = [
    { icon: LayoutGrid, label: 'Tableau de bord', to: '/mon-espace/dashboard' },
    { icon: FolderOpen, label: 'Mon Dossier', to: '/mon-espace/dossier' },
    { icon: FileText, label: 'Mes Documents', to: '/mon-espace/documents' },
    { icon: MessageSquare, label: 'Messagerie', to: '/mon-espace/messagerie', badge: 2 },
    { icon: CreditCard, label: 'Paiements', to: '/mon-espace/paiement' },
    { icon: Calendar, label: 'Échéances', to: '/mon-espace/echeances', badge: 3 },
    { icon: User, label: 'Mon Profil', to: '/mon-espace/profil' },
];

export function DashboardLayout() {
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-[#F8FAFC]">
            {/* Overlay mobile */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/40 z-50 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed left-0 top-0 bottom-0 w-72 flex flex-col z-[60] shadow-2xl transition-transform duration-300 lg:translate-x-0 ${
                isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
            style={{ backgroundColor: '#071626' }}>
                {/* Logo */}
                <div className="px-6 pt-8 pb-6 border-b border-white/[0.05]">
                    <img src={logoImgWhite} alt="Doxantu Travel" className="h-[75px] w-auto object-contain" />
                </div>

                {/* User Card */}
                <div className="p-6">
                    <div className="flex items-center gap-4 p-4 rounded-2xl" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white text-lg shadow-md" style={{ backgroundColor: '#0B84D8' }}>
                            AD
                        </div>
                        <div>
                            <p className="font-bold text-white leading-tight">Amadou Diallo</p>
                            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#0B84D8]/20 text-[#0B84D8] text-[10px] font-bold uppercase tracking-wider">
                                <span className="flex items-center"><GraduationCap className="w-3.5 h-3.5 mr-1" /></span> Étudiant
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
                    {sidebarLinks.map((link, idx) => {
                        const isActive = location.pathname === link.to;
                        return (
                            <Link
                                key={idx}
                                to={link.to}
                                onClick={() => setIsSidebarOpen(false)}
                                className={`flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 font-medium ${isActive
                                    ? 'bg-[#0B84D8] text-white shadow-lg'
                                    : 'text-gray-400 hover:text-white hover:bg-white/[0.05]'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <link.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                                    {link.label}
                                </div>
                                {link.badge && (
                                    <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shadow-sm ${
                                        isActive ? 'bg-white/20 text-white' : 'bg-[#0B84D8] text-white'
                                    }`}>
                                        {link.badge}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer Actions */}
                <div className="p-4 border-t border-white/[0.05] space-y-2">
                    <Link
                        to="/"
                        className="flex items-center gap-3 px-4 py-3.5 text-sm font-semibold text-gray-400 hover:text-white transition-all rounded-xl hover:bg-white/[0.05] group"
                    >
                        <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                        Retour au site
                    </Link>
                    <Link
                        to="/connexion"
                        className="flex items-center gap-3 px-4 py-3.5 text-sm font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all rounded-xl"
                    >
                        <LogOut className="w-5 h-5" /> Se déconnecter
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 lg:ml-72 flex flex-col min-h-screen w-full overflow-x-hidden">
                <header className="h-[80px] lg:h-[124px] bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-10 sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        {/* Menu burger pour Mobile */}
                        <button 
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <MenuIcon className="w-6 h-6" />
                        </button>

                        <div className="text-gray-500 font-medium text-xs hidden sm:block">
                            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="relative p-2 text-gray-400 hover:text-[#0B84D8] transition-colors rounded-full hover:bg-gray-50">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                            </svg>
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border border-white"></span>
                        </button>
                        <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm shadow-md cursor-pointer" style={{ backgroundColor: '#0B84D8' }}>
                            AD
                        </div>
                    </div>
                </header>

                <div className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full pb-24">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
