import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import { LayoutDashboard, FolderOpen, BarChart3, Users, Settings, ArrowLeft, LogOut, Bell, CreditCard, AlertTriangle, Menu as MenuIcon, X, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';
import logoImgWhite from '../../assets/logo-doxantu-white.png';

const NAV_ITEMS = [
    { icon: LayoutDashboard, label: 'Vue d\'ensemble', to: '/admin/dashboard', badge: null },
    { icon: Bell, label: 'Flux des demandes', to: '/admin/demandes', badge: 'New' },
    { icon: FolderOpen, label: 'Dossiers Clients', to: '/admin/clients', badge: '31' },
    { icon: CreditCard, label: 'Pilotage Financier', to: '/admin/finance', badge: '4' },
    { icon: BarChart3, label: 'Reporting & Stats', to: '/admin/reporting', badge: null },
    { icon: Mail, label: 'Messagerie', to: '/admin/messagerie', badge: null },
    { icon: Users, label: 'Conseillers', to: '/admin/conseillers', badge: null },
];

import { useUser } from '../lib/context/UserContext';

export function AdminLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, loading } = useUser();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const urgentCount = 2;

    useEffect(() => {
        if (!loading) {
            if (!user) {
                navigate('/connexion');
            } else if (user.role !== 'admin') {
                toast.error("Accès refusé. Vous n'êtes pas administrateur.");
                navigate('/mon-espace/dashboard');
            }
        }
    }, [user, loading, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F0F4F8]">
                <div className="flex flex-col items-center gap-4">
                    <span className="w-12 h-12 border-4 border-[#0B84D8]/30 border-t-[#0B84D8] rounded-full animate-spin" />
                    <p className="text-gray-500 font-medium">Accès au panneau d'administration...</p>
                </div>
            </div>
        );
    }

    if (!user || user.role !== 'admin') return null;

    const handleLogout = async () => {
        await supabase?.auth.signOut();
        localStorage.removeItem('user');
        navigate('/connexion');
    };

    const displayName = user ? `${user.firstName} ${user.lastName}` : 'Administrateur';
    const initials = user?.initiales || 'AD';

    return (
        <div className="flex min-h-screen" style={{ backgroundColor: '#F0F4F8' }}>
            {/* Overlay mobile */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-50 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* ── Sidebar ────────────────────────────────────────────────── */}
            <aside className={`fixed left-0 top-0 bottom-0 w-[250px] flex flex-col z-[60] select-none transition-transform duration-300 lg:translate-x-0 ${
                isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
                style={{ backgroundColor: '#0e1929' }}>
                
                {/* Bouton Fermer pour Mobile */}
                <button 
                    onClick={() => setIsSidebarOpen(false)}
                    className="lg:hidden absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Logo */}
                <div className="px-5 pt-6 pb-5 flex items-center border-b border-white/[0.07]">
                    <div className="flex flex-col">
                        <img src={logoImgWhite} alt="Doxantu Travel" className="h-7 w-auto object-contain mb-1" />
                        <span className="text-gray-500 text-[10px] font-medium uppercase tracking-widest pl-1">Administration</span>
                    </div>
                </div>

                {/* User card */}
                <div className="mx-3 mt-4 mb-2 rounded-2xl p-3.5" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#0B84D8] flex items-center justify-center text-white font-extrabold text-sm shrink-0 border-2 border-[#0B84D8]/40">
                            {initials}
                        </div>
                        <div className="min-w-0">
                            <p className="text-white font-bold text-sm leading-tight truncate">{displayName}</p>
                            <p className="text-gray-400 text-xs truncate">Direction Générale</p>
                            <span className="inline-flex items-center gap-1 text-amber-400 text-[10px] font-bold mt-0.5">
                                ⚡ Super Admin
                            </span>
                        </div>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
                    {NAV_ITEMS.map((item) => {
                        const isActive = location.pathname === item.to;
                        return (
                            <Link key={item.label} to={item.to}
                                onClick={() => setIsSidebarOpen(false)}
                                className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                                    isActive
                                        ? 'bg-[#0B84D8] text-white'
                                        : 'text-gray-400 hover:bg-white/[0.07] hover:text-white'
                                }`}>
                                <div className="flex items-center gap-3">
                                    <item.icon className="w-4 h-4 shrink-0" />
                                    {item.label}
                                </div>
                                {(item as any).badge && (
                                    <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shadow-sm ${
                                        isActive ? 'bg-white/20 text-white' : 'bg-[#0B84D8] text-white'
                                    }`}>
                                        {(item as any).badge}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="px-3 pb-4 border-t border-white/[0.07] pt-3 space-y-0.5">
                    <Link to="/admin/parametres" className="flex items-center gap-3 px-3.5 py-2.5 text-gray-500 hover:text-gray-300 hover:bg-white/[0.07] rounded-xl text-sm font-medium transition-all">
                        <Settings className="w-4 h-4" /> Paramètres
                    </Link>
                    <Link to="/" className="flex items-center gap-3 px-3.5 py-2.5 text-gray-500 hover:text-gray-300 hover:bg-white/[0.07] rounded-xl text-sm font-medium transition-all">
                        <ArrowLeft className="w-4 h-4" /> Retour au site
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3.5 py-2.5 text-red-400/80 hover:text-red-400 hover:bg-red-500/10 rounded-xl text-sm font-semibold transition-all"
                    >
                        <LogOut className="w-4 h-4" /> Se déconnecter
                    </button>
                </div>
            </aside>

            {/* ── Main ──────────────────────────────────────────────────── */}
            <main className="flex-1 lg:ml-[250px] flex flex-col min-h-screen w-full overflow-x-hidden">
                {/* Header */}
                <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
                    <div className="flex items-center gap-3">
                        {/* Burger pour Mobile */}
                        <button 
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <MenuIcon className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            <div className="w-2 h-2 rounded-full bg-gray-300" />
                            <span className="font-medium text-gray-500 hidden sm:inline">Admin</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {urgentCount > 0 && (
                            <button className="flex items-center gap-1.5 text-red-500 text-xs font-bold bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors">
                                <AlertTriangle className="w-3.5 h-3.5" />
                                {urgentCount} dossiers urgents
                            </button>
                        )}
                        <button className="relative p-2 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-50 transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border-[1.5px] border-white" />
                        </button>
                        <div className="w-9 h-9 rounded-full bg-[#0B84D8] flex items-center justify-center text-white font-extrabold text-sm cursor-pointer hover:opacity-90 transition-opacity">
                            {initials}
                        </div>
                    </div>
                </header>

                <div className="flex-1 p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
