import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogIn, ArrowLeft, Mail, Lock, Phone, UserPlus, Eye, EyeOff, User } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { toast } from 'sonner';
import { SEO } from '../components/SEO';
import { supabase } from '../lib/supabase';
import { useUser } from '../lib/context/UserContext';

export function Login() {
    const [searchParams] = useSearchParams();
    const [isRegister, setIsRegister] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const { setUser: setGlobalUser } = useUser();

    // Auto-complétion basée sur l'URL (?role=client|admin ou ?mode=register)
    useEffect(() => {
        const mode = searchParams.get('mode');
        if (mode === 'register') setIsRegister(true);
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!supabase) {
            toast.error("Supabase n'est pas configuré.");
            return;
        }
        setLoading(true);
        setError('');

        try {
            if (isRegister) {
                if (!email.includes('@') || phone.length < 8 || !firstName || !lastName) {
                    setError('Veuillez remplir correctement tous les champs.');
                    setLoading(false);
                    return;
                }
                if (password !== confirmPassword) {
                    setError('Les mots de passe ne correspondent pas.');
                    setLoading(false);
                    return;
                }

                // 1. Création du compte dans Supabase Auth
                const { data: authData, error: authError } = await supabase.auth.signUp({
                    email: email.trim().toLowerCase(),
                    password,
                    options: {
                        data: {
                            first_name: firstName,
                            last_name: lastName,
                        }
                    }
                });

                if (authError) throw authError;

                if (authData.user) {
                    // 2. Création du profil dans la table 'profiles'
                    const { error: profileError } = await supabase.from('profiles').insert({
                        id: authData.user.id,
                        nom: lastName,
                        prenom: firstName,
                        tel: phone,
                        role: 'client',
                        initiales: `${firstName[0]}${lastName[0]}`.toUpperCase()
                    });

                    if (profileError) {
                        console.error("Erreur création profil:", profileError);
                        throw new Error(`Désolé, nous n'avons pas pu créer votre profil : ${profileError.message}. Vérifiez les permissions (RLS) dans Supabase.`);
                    }

                    // Mise à jour globale du contexte utilisateur
                    setGlobalUser({
                        id: authData.user.id,
                        email: authData.user.email || '',
                        firstName,
                        lastName,
                        role: 'client',
                        initiales: `${firstName[0]}${lastName[0]}`.toUpperCase()
                    });

                    toast.success('Bienvenue ! Votre compte a été créé.');
                    setSuccess(true);
                    setTimeout(() => navigate('/mon-espace/dashboard'), 1500);
                }
            } else {
                // Logique de connexion via Supabase
                const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                    email: email.trim().toLowerCase(),
                    password
                });

                if (authError) throw authError;

                if (authData.user) {
                    // Récupérer les infos du profil (rôle, nom, etc.)
                    const { data: profile, error: profileError } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', authData.user.id)
                        .single();

                    if (profileError) {
                        console.error("Erreur profil:", profileError);
                        // Fallback si le profil n'existe pas encore (cas de migration)
                        const userObj = {
                            id: authData.user.id,
                            email: authData.user.email,
                            firstName: authData.user.user_metadata?.first_name || 'Utilisateur',
                            lastName: authData.user.user_metadata?.last_name || '',
                            role: 'client',
                            initiales: 'U'
                        };
                        localStorage.setItem('user', JSON.stringify(userObj));
                        navigate('/mon-espace/dashboard');
                    } else {
                        const userObj = {
                            id: authData.user.id,
                            email: authData.user.email || '',
                            firstName: profile.prenom,
                            lastName: profile.nom,
                            role: profile.role as 'client' | 'admin',
                            initiales: profile.initiales
                        };
                        setGlobalUser(userObj);
                        
                        toast.success(`Heureux de vous revoir, ${profile.prenom} !`);
                        const redirectTo = profile.role === 'admin' ? '/admin/dashboard' : '/mon-espace/dashboard';
                        navigate(redirectTo);
                    }
                }
            }
        } catch (err: any) {
            console.error('Erreur Auth:', err);
            const msg = err.message || 'Une erreur est survenue lors de la connexion.';
            toast.error(msg);
            setError(msg);
        } finally {
            setLoading(false);
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
                            {/* Nom & Prénom (Inscription seulement) */}
                            <AnimatePresence mode="wait">
                                {isRegister && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0, y: -10 }}
                                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                                        exit={{ opacity: 0, height: 0, y: -10 }}
                                        className="grid grid-cols-2 gap-4 overflow-hidden"
                                    >
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 transition-colors group-focus-within:text-[#0B84D8]" />
                                            <input
                                                type="text"
                                                required={isRegister}
                                                value={firstName}
                                                onChange={e => setFirstName(e.target.value)}
                                                className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0B84D8]/50 focus:border-[#0B84D8] transition-all"
                                                placeholder="Prénom"
                                            />
                                        </div>
                                        <div className="relative group">
                                            <input
                                                type="text"
                                                required={isRegister}
                                                value={lastName}
                                                onChange={e => setLastName(e.target.value)}
                                                className="block w-full px-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0B84D8]/50 focus:border-[#0B84D8] transition-all"
                                                placeholder="Nom"
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

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
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 transition-colors group-focus-within:text-[#0B84D8]" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="block w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0B84D8]/50 focus:border-[#0B84D8] transition-all"
                                    placeholder={isRegister ? "Mot de passe" : "Mot de passe"}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>

                            {/* Confirm Password (Inscription seulement) */}
                            <AnimatePresence>
                                {isRegister && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0, y: -10 }}
                                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                                        exit={{ opacity: 0, height: 0, y: -10 }}
                                        className="relative overflow-hidden group"
                                    >
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 transition-colors group-focus-within:text-[#0B84D8]" />
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            required={isRegister}
                                            value={confirmPassword}
                                            onChange={e => setConfirmPassword(e.target.value)}
                                            className="block w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0B84D8]/50 focus:border-[#0B84D8] transition-all"
                                            placeholder="Confirmer le mot de passe"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                                        >
                                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
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
