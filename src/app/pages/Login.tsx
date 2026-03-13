import { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, MessageSquare, Bell, Eye, EyeOff, FileText, ArrowRight, Zap, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import logoImgWhite from '../../assets/logo-doxantu-white.png';

// Credentials de démonstration (simulation - pas de vrai backend auth)
const DEMO_ACCOUNTS = [
  { email: 'admin@doxantu.com', password: 'Admin2026!', role: 'admin', label: 'Admin', redirectTo: '/admin/dashboard' },
  { email: 'amadou.diallo@edu.sn', password: 'Demo2026!', role: 'client', label: 'Client', redirectTo: '/mon-espace/dashboard' },
];

export function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showDemoMenu, setShowDemoMenu] = useState(false);
    const navigate = useNavigate();

    const fillDemo = (account: typeof DEMO_ACCOUNTS[0]) => {
        setEmail(account.email);
        setPassword(account.password);
        setError('');
        setShowDemoMenu(false);
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Simulate auth delay
        setTimeout(() => {
            const account = DEMO_ACCOUNTS.find(
                a => a.email === email.trim().toLowerCase() && a.password === password
            );
            if (account) {
                navigate(account.redirectTo);
            } else {
                setError('Email ou mot de passe incorrect. Utilisez les accès démo ci-dessus.');
                setLoading(false);
            }
        }, 600);
    };

    return (
        <div className="min-h-screen flex bg-[#F8FAFC]">
            {/* Left Pane */}
            <div className="hidden lg:flex flex-col justify-between w-[45%] p-14 relative overflow-hidden" style={{ backgroundColor: '#072a50' }}>
                <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-white/5 blur-3xl pointer-events-none" />
                <div className="absolute bottom-[-10%] left-[-20%] w-[600px] h-[600px] rounded-full bg-[#0B84D8]/10 pointer-events-none" />

                <div className="relative z-10">
                    <Link to="/" className="inline-block mb-20 hover:opacity-90 transition-opacity">
                        <img src={logoImgWhite} alt="Doxantu Travel" style={{ height: '72px', width: 'auto', objectFit: 'contain' }} />
                    </Link>

                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <h1 className="text-4xl xl:text-5xl font-extrabold text-white mb-5 leading-tight">
                            Votre espace<br />personnel sécurisé
                        </h1>
                        <p className="text-lg text-blue-200/80 mb-10 leading-relaxed">
                            Suivez votre dossier, gérez vos documents et échangez avec votre conseiller en toute simplicité.
                        </p>

                        <div className="space-y-5">
                            {[
                                { icon: <FileText className="w-5 h-5 text-[#0B84D8]" />, text: 'Suivi en temps réel de votre dossier' },
                                { icon: <Shield className="w-5 h-5 text-amber-400" />, text: 'Documents sécurisés et accessibles partout' },
                                { icon: <MessageSquare className="w-5 h-5 text-emerald-400" />, text: 'Messagerie directe avec votre conseiller' },
                                { icon: <Bell className="w-5 h-5 text-amber-500" />, text: 'Rappels automatiques des échéances clés' },
                            ].map((feature, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + idx * 0.1 }}
                                    className="flex items-center gap-4"
                                >
                                    <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                                        {feature.icon}
                                    </div>
                                    <span className="text-blue-100/90 font-medium">{feature.text}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                <div className="relative z-10 text-sm text-blue-300/40 font-medium">
                    © {new Date().getFullYear()} Doxantu Travel - Dakar, Sénégal
                </div>
            </div>

            {/* Right Pane */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-16 relative">
                <Link to="/" className="absolute top-6 right-8 text-sm font-medium text-gray-400 hover:text-[#0B84D8] transition-colors flex items-center gap-1.5">
                    ← Retour au site
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-full max-w-[440px]"
                >
                    {/* Logo mobile */}
                    <Link to="/" className="flex lg:hidden justify-center mb-8">
                        <img src={logoImgWhite} alt="Doxantu Travel" style={{ height: '40px', filter: 'invert(1) sepia(1) saturate(3) hue-rotate(190deg)' }} />
                    </Link>

                    <div className="mb-8">
                        <h2 className="text-3xl font-black text-[#1a2b40] mb-1.5">Connexion</h2>
                        <p className="text-gray-500">Accédez à votre espace personnel</p>
                    </div>

                    {/* Demo banner */}
                    <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl p-4">
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex gap-2.5">
                                <Zap className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                                <p className="text-sm text-amber-800 font-medium">
                                    Mode démo - cliquez pour remplir automatiquement
                                </p>
                            </div>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setShowDemoMenu(!showDemoMenu)}
                                    className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                                >
                                    Choisir <ChevronDown className="w-3 h-3" />
                                </button>
                                {showDemoMenu && (
                                    <div className="absolute right-0 top-full mt-1.5 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden z-10 w-52">
                                        {DEMO_ACCOUNTS.map(acc => (
                                            <button
                                                key={acc.email}
                                                type="button"
                                                onClick={() => fillDemo(acc)}
                                                className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors"
                                            >
                                                <p className="text-sm font-bold text-[#1a2b40]">{acc.label}</p>
                                                <p className="text-xs text-gray-400">{acc.email}</p>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-[#1a2b40] mb-2">Adresse email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0B84D8]/20 focus:border-[#0B84D8] outline-none transition-all text-[#333]"
                                placeholder="votre@email.com"
                                autoComplete="email"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-[#1a2b40] mb-2">Mot de passe</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0B84D8]/20 focus:border-[#0B84D8] outline-none transition-all text-[#333]"
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl"
                            >
                                {error}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-[#0B84D8] hover:bg-[#0973BD] disabled:opacity-70 text-white font-bold rounded-xl transition-all shadow-lg shadow-[#0B84D8]/20 flex items-center justify-center gap-2 mt-2"
                        >
                            {loading ? (
                                <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>Se connecter <ArrowRight className="w-4 h-4" /></>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-500 mt-6">
                        Pas encore de compte ?{' '}
                        <Link to="/devis" className="text-[#0B84D8] font-semibold hover:underline">
                            Faire une demande →
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
