import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogIn, ArrowLeft, Mail, Lock, Phone, UserPlus } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { SEO } from '../components/SEO';

// Credentials de démonstration
const DEMO_ACCOUNTS = [
    { email: 'admin@doxantu.com', password: 'Admin2026!', role: 'admin', redirectTo: '/admin/dashboard' },
    { email: 'amadou.diallo@edu.sn', password: 'Demo2026!', role: 'client', redirectTo: '/mon-espace/dashboard' },
];

export function Login() {
    const [searchParams] = useSearchParams();
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    // Auto-complétion basée sur l'URL (?role=client|admin) en mode Connexion uniquement
    useEffect(() => {
        if (!isRegister) {
            const role = searchParams.get('role');
            if (role) {
                const demoAccount = DEMO_ACCOUNTS.find(acc => acc.role === role);
                if (demoAccount) {
                    setEmail(demoAccount.email);
                    setPassword(demoAccount.password);
                }
            }
        }
    }, [searchParams, isRegister]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (isRegister) {
            // Simulation d'inscription
            setTimeout(() => {
                if (!email.includes('@') || phone.length < 8) {
                    setError('Veuillez remplir correctement tous les champs.');
                    setLoading(false);
                } else {
                    setSuccess(true);
                    setLoading(false);
                    setTimeout(() => navigate('/mon-espace/dashboard'), 1500);
                }
            }, 1000);
        } else {
            // Logique de connexion
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
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0A0A0A] selection:bg-[#0B84D8]/30">
            <SEO 
                title={isRegister ? "Inscription" : "Connexion"} 
                description={isRegister ? "Créez votre compte Doxantu Travel." : "Accédez à votre espace sécurisé Doxantu Travel."} 
            />
            
            {/* Effets Cosmos */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#0B84D8]/10 rounded-full blur-[120px] pointer-events-none z-0" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#072a50]/40 rounded-full blur-[100px] pointer-events-none z-0" />
            
            {/* Ciel étoilé */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                {[...Array(40)].map((_, i) => (
                    <motion.div
                        key={`star-${i}`}
                        className="absolute bg-white rounded-full"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            width: Math.random() * 2 + 1 + 'px',
                            height: Math.random() * 2 + 1 + 'px',
                        }}
                        initial={{ opacity: Math.random() * 0.3 + 0.1 }}
                        animate={{
                            opacity: [0.2, 0.8, 0.2],
                            scale: [1, 1.2, 1],
                        }}
                        transition={{
                            duration: Math.random() * 5 + 5,
                            repeat: Infinity,
                            ease: 'linear',
                        }}
                    />
                ))}
            </div>

            {/* Avion Animé */}
            <motion.div 
                className="absolute text-white/10 pointer-events-none z-0 flex items-center"
                initial={{ x: '-15vw', y: '65vh', rotate: -20, scale: 0.8 }}
                animate={{ x: '115vw', y: '-15vh' }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            >
                <div className="relative">
                    <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22 16.5L14 11.5V4C14 2.9 13.1 2 12 2C10.9 2 10 2.9 10 4V11.5L2 16.5V18.5L10 16V20.5L8 22V23L12 22L16 23V22L14 20.5V16L22 18.5V16.5Z" />
                    </svg>
                </div>
            </motion.div>
            
            <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-white transition-colors z-20">
                <ArrowLeft className="w-4 h-4" /> Retour
            </Link>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 w-full max-w-[440px] p-8 bg-[#111111]/80 backdrop-blur-xl border border-white/5 rounded-3xl shadow-2xl"
            >
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-[#0B84D8]/10 border border-[#0B84D8]/20 rounded-2xl mx-auto flex items-center justify-center mb-6">
                        {isRegister ? <UserPlus className="w-7 h-7 text-[#0B84D8]" /> : <LogIn className="w-7 h-7 text-[#0B84D8]" />}
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">
                        {isRegister ? "Créer un compte" : "Connexion"}
                    </h1>
                    <p className="text-gray-400 text-sm">
                        {isRegister ? "Rejoignez l'aventure Doxantu Travel" : "Accédez à votre espace sécurisé"}
                    </p>
                </div>

                {success ? (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-10"
                    >
                        <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2">Bienvenue !</h2>
                        <p className="text-gray-400">Votre compte a été créé avec succès.</p>
                    </motion.div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-4">
                            {/* Email */}
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0B84D8]/50 focus:border-[#0B84D8] transition-all"
                                    placeholder="Adresse email"
                                />
                            </div>

                            {/* Téléphone (Inscription seulement) */}
                            <AnimatePresence>
                                {isRegister && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0, y: -10 }}
                                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                                        exit={{ opacity: 0, height: 0, y: -10 }}
                                        className="relative overflow-hidden"
                                    >
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                                        <input
                                            type="tel"
                                            required={isRegister}
                                            value={phone}
                                            onChange={e => setPhone(e.target.value)}
                                            className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0B84D8]/50 focus:border-[#0B84D8] transition-all"
                                            placeholder="Numéro de téléphone"
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Password */}
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0B84D8]/50 focus:border-[#0B84D8] transition-all"
                                    placeholder="Mot de passe"
                                />
                            </div>
                        </div>

                        {error && (
                            <p className="text-red-400 text-sm text-center font-medium pt-2">{error}</p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full relative mt-6 py-4 px-4 bg-[#0B84D8] hover:bg-[#0971bd] rounded-2xl text-white font-bold transition-all flex items-center justify-center gap-2 group shadow-lg shadow-[#0B84D8]/20"
                        >
                            {loading ? (
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>{isRegister ? "Créer mon compte" : "Se connecter"}</span>
                                    <ArrowLeft className="w-4 h-4 rotate-180" />
                                </>
                            )}
                        </button>
                    </form>
                )}

                <div className="mt-8 pt-6 border-t border-white/5 text-center">
                    <button 
                        onClick={() => {
                            setIsRegister(!isRegister);
                            setError('');
                            setSuccess(false);
                        }}
                        className="text-gray-400 text-sm hover:text-white transition-colors"
                    >
                        {isRegister ? (
                            <>Déjà un compte ? <span className="text-[#0B84D8] font-bold">Se connecter</span></>
                        ) : (
                            <>Pas encore de compte ? <span className="text-[#0B84D8] font-bold">S'inscrire</span></>
                        )}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
