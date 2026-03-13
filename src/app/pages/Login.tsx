import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { LogIn, ArrowLeft, Mail, Lock } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { SEO } from '../components/SEO';

// Credentials de démonstration
const DEMO_ACCOUNTS = [
  { email: 'admin@doxantu.com', password: 'Admin2026!', role: 'admin', redirectTo: '/admin/dashboard' },
  { email: 'amadou.diallo@edu.sn', password: 'Demo2026!', role: 'client', redirectTo: '/mon-espace/dashboard' },
];

export function Login() {
    const [searchParams] = useSearchParams();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Auto-complétion basée sur l'URL (?role=client|admin)
    useEffect(() => {
        const role = searchParams.get('role');
        if (role) {
            const demoAccount = DEMO_ACCOUNTS.find(acc => acc.role === role);
            if (demoAccount) {
                setEmail(demoAccount.email);
                setPassword(demoAccount.password);
            }
        }
    }, [searchParams]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        setTimeout(() => {
            const account = DEMO_ACCOUNTS.find(
                a => a.email === email.trim().toLowerCase() && a.password === password
            );
            if (account) {
                navigate(account.redirectTo);
            } else {
                setError('Email ou mot de passe incorrect.');
                setLoading(false);
            }
        }, 600);
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0A0A0A] selection:bg-[#0B84D8]/30">
            <SEO title="Connexion" description="Accédez à votre espace sécurisé Doxantu Travel." />
            
            {/* Effets Cosmos (Lueurs de fond) - Adapté aux couleurs Doxantu */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#0B84D8]/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#072a50]/40 rounded-full blur-[100px] pointer-events-none" />
            
            {/* Animation Avion / Voyage discrète en arrière-plan */}
            <motion.div 
                className="absolute text-[#0B84D8]/10 pointer-events-none z-0"
                initial={{ x: '-20vw', y: '80vh', rotate: -15, scale: 0.5 }}
                animate={{ 
                    x: '120vw', 
                    y: '-20vh',
                }}
                transition={{ 
                    duration: 25, 
                    repeat: Infinity, 
                    ease: "linear"
                }}
            >
                <svg width="240" height="240" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 16V14L13 9V3.5C13 2.67 12.33 2 11.5 2C10.67 2 10 2.67 10 3.5V9L2 14V16L10 13.5V19L8 20.5V22L11.5 21L15 22V20.5L13 19V13.5L21 16Z" />
                </svg>
            </motion.div>

            {/* Nuages discrets animés */}
            <motion.div 
                className="absolute top-[20%] right-[10%] text-white/5 pointer-events-none z-0"
                animate={{ x: [0, -30, 0] }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            >
                <svg width="180" height="180" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4C9.11 4 6.6 5.64 5.35 8.04C2.34 8.36 0 10.91 0 14C0 17.31 2.69 20 6 20H19C21.76 20 24 17.76 24 15C24 12.36 21.95 10.22 19.35 10.04Z" />
                </svg>
            </motion.div>
            <motion.div 
                className="absolute bottom-[20%] left-[5%] text-white/5 pointer-events-none z-0"
                animate={{ x: [0, 40, 0] }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            >
                <svg width="240" height="240" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4C9.11 4 6.6 5.64 5.35 8.04C2.34 8.36 0 10.91 0 14C0 17.31 2.69 20 6 20H19C21.76 20 24 17.76 24 15C24 12.36 21.95 10.22 19.35 10.04Z" />
                </svg>
            </motion.div>
            
            {/* Bouton retour en absolut */}
            <Link 
                to="/" 
                className="absolute top-8 left-8 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-white transition-colors z-20"
            >
                <ArrowLeft className="w-4 h-4" /> Retour au site
            </Link>

            {/* Carte Modale Centrale */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="relative z-10 w-full max-w-[420px] p-8 bg-[#111111] border border-[#222222] rounded-3xl shadow-2xl"
            >
                <div className="text-center mb-8">
                    {/* Icône Entête */}
                    <div className="w-14 h-14 bg-[#072a50]/50 border border-[#0B84D8]/30 rounded-2xl mx-auto flex items-center justify-center mb-6">
                        <LogIn className="w-6 h-6 text-[#0B84D8]" />
                    </div>
                    
                    <h1 className="text-2xl font-black text-white mb-2 tracking-tight">
                        Connexion
                    </h1>
                    <p className="text-gray-400 text-sm">
                        Accédez à votre espace Doxantu
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    {/* Input Email */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-500" />
                        </div>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="block w-full pl-11 pr-4 py-3.5 bg-[#0a0a0a] border border-[#333] rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#0B84D8]/50 focus:border-[#0B84D8] transition-all"
                            placeholder="Email"
                            autoComplete="email"
                        />
                    </div>

                    {/* Input Mot de passe */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-500" />
                        </div>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="block w-full pl-11 pr-4 py-3.5 bg-[#0a0a0a] border border-[#333] rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#0B84D8]/50 focus:border-[#0B84D8] transition-all"
                            placeholder="Mot de passe"
                            autoComplete="current-password"
                        />
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="text-red-400 text-sm text-center font-medium pt-1"
                        >
                            {error}
                        </motion.div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full relative mt-6 py-4 px-4 bg-[#1a1a1a] hover:bg-[#222222] border border-[#333] rounded-2xl text-white font-bold transition-all flex items-center justify-center gap-2 group overflow-hidden"
                    >
                        {loading ? (
                            <span className="w-5 h-5 border-2 border-gray-400 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <LogIn className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" />
                                <span>Se connecter</span>
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-gray-500 text-sm">
                        Pas encore de compte ?{' '}
                        <Link to="/devis" className="text-gray-300 font-semibold hover:text-white transition-colors">
                            S'inscrire
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
