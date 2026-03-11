import { Outlet, Link, useLocation } from 'react-router';
import { LayoutGrid, FolderOpen, FileText, MessageSquare, Calendar, User, LogOut, GraduationCap, ArrowLeft } from 'lucide-react';

const sidebarLinks = [
    { icon: LayoutGrid, label: 'Tableau de bord', to: '/mon-espace/dashboard' },
    { icon: FolderOpen, label: 'Mon Dossier', to: '/mon-espace/dossier' },
    { icon: FileText, label: 'Mes Documents', to: '/mon-espace/documents' },
    { icon: MessageSquare, label: 'Messagerie', to: '/mon-espace/messagerie', badge: 2 },
    { icon: Calendar, label: 'Échéances', to: '/mon-espace/echeances', badge: 3 },
    { icon: User, label: 'Mon Profil', to: '/mon-espace/profil' },
];

export function DashboardLayout() {
    const location = useLocation();

    return (
        <div className="flex min-h-screen bg-[#F8FAFC]">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 bottom-0 w-72 bg-white border-r border-gray-100 flex flex-col z-40 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
                {/* Logo */}
                <div className="h-[124px] flex items-center px-8 border-b border-gray-100/50">
                    <Link to="/" className="flex items-center group -ml-2 hover:scale-105 transition-transform duration-300">
                        <img
                            src="/src/assets/logo-doxantu.png"
                            alt="Doxantu Travel"
                            style={{ height: '100px', width: 'auto', objectFit: 'contain' }}
                        />
                    </Link>
                </div>

                {/* User Card */}
                <div className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white text-lg shadow-md" style={{ backgroundColor: '#0B84D8' }}>
                            AD
                        </div>
                        <div>
                            <p className="font-bold text-[#1a2b40] leading-tight">Amadou Diallo</p>
                            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#E8F4FD] text-[#0B84D8] text-[10px] font-bold uppercase tracking-wider">
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
                                className={`flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 font-medium ${isActive
                                    ? 'bg-[#F0F8FF] text-[#0B84D8] shadow-sm ring-1 ring-[#0B84D8]/10'
                                    : 'text-gray-500 hover:text-[#0B84D8] hover:bg-gray-50'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <link.icon className={`w-5 h-5 ${isActive ? 'text-[#0B84D8]' : 'text-gray-400'}`} />
                                    {link.label}
                                </div>
                                {link.badge && (
                                    <span className="w-6 h-6 rounded-full bg-[#0B84D8] text-white text-xs font-bold flex items-center justify-center shadow-sm">
                                        {link.badge}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer Actions */}
                <div className="p-4 border-t border-gray-100/50 space-y-2">
                    <Link
                        to="/"
                        className="flex items-center gap-3 px-4 py-3.5 text-sm font-semibold text-gray-600 hover:text-[#0B84D8] transition-all rounded-xl hover:bg-[#E8F4FD]/50 border border-transparent hover:border-[#0B84D8]/10 group"
                    >
                        <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                        Retour au site
                    </Link>
                    <Link
                        to="/connexion"
                        className="flex items-center gap-3 px-4 py-3.5 text-sm font-bold text-red-500 hover:bg-red-50 hover:text-red-600 transition-all rounded-xl border border-transparent hover:border-red-100"
                    >
                        <LogOut className="w-5 h-5" /> Se déconnecter
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 ml-72 flex flex-col min-h-screen">
                <header className="h-[124px] bg-white border-b border-gray-100 flex items-center justify-between px-10 sticky top-0 z-30">
                    <div className="text-gray-500 font-medium text-sm">
                        {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
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
