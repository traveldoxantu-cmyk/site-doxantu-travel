import { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, MessageSquare, Bell, ArrowRight, Eye, EyeOff, GraduationCap, Briefcase, Zap, FileText } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import logoImgWhite from '../../assets/logo-doxantu-white.png';

export function Login() {
    const [tab, setTab] = useState<'etudiant' | 'voyageur'>('etudiant');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleDemoFill = () => {
        // Fill with demo data
        const emailInput = document.getElementById('email') as HTMLInputElement;
        const pwdInput = document.getElementById('password') as HTMLInputElement;
        if (emailInput) emailInput.value = 'amadou.diallo@esp.sn';
        if (pwdInput) pwdInput.value = 'demo1234';
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate login and redirect to dashboard
        navigate('/mon-espace/dashboard');
    };

    return (
        <div className="min-h-screen flex bg-[#F8FAFC]">
            {/* Left Pane - Blue Branding */}
            <div className="hidden lg:flex flex-col justify-between w-[45%] p-14 relative overflow-hidden" style={{ backgroundColor: '#0B84D8' }}>
                {/* Decorative Circles */}
                <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-white/5 blur-3xl" />
                <div className="absolute bottom-[-10%] left-[-20%] w-[600px] h-[600px] rounded-full bg-black/5" />

                <div className="relative z-10">
                    <Link to="/" className="inline-block mb-24 hover:opacity-90 transition-opacity">
                        <img src={logoImgWhite} alt="Doxantu Travel" style={{ height: '80px', width: 'auto', objectFit: 'contain' }} />
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl xl:text-5xl font-extrabold text-white mb-6 leading-tight">
                            Votre espace personnel sécurisé
                        </h1>
                        <p className="text-xl text-blue-100/90 mb-12 max-w-md leading-relaxed">
                            Suivez l'avancement de votre dossier, gérez vos documents et communiquez avec votre conseiller — tout en un seul endroit.
                        </p>

                        <div className="space-y-6">
                            {[
                                { icon: <FileText className="w-5 h-5 text-blue-300" />, text: 'Suivi en temps réel de votre dossier' },
                                { icon: <Shield className="w-5 h-5 text-amber-400" />, text: 'Coffre-fort numérique sécurisé' },
                                { icon: <MessageSquare className="w-5 h-5 text-white" />, text: 'Messagerie directe avec votre conseiller' },
                                { icon: <Bell className="w-5 h-5 text-amber-500" />, text: 'Rappels automatiques des échéances' },
                            ].map((feature, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + idx * 0.1 }}
                                    className="flex items-center gap-4 text-white text-lg"
                                >
                                    <div className="w-8 flex justify-center">{feature.icon}</div>
                                    <span className="font-medium text-blue-50/90">{feature.text}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                <div className="relative z-10 text-sm text-blue-200/60 font-medium">
                    © {new Date().getFullYear()} Doxantu Travel — Dakar, Sénégal
                </div>
            </div>

            {/* Right Pane - Login Form */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-20 relative">
                <Link to="/" className="absolute top-8 left-8 text-gray-400 hover:text-gray-600 transition-colors text-sm font-medium flex items-center gap-2 lg:hidden">
                    ← Retour
                </Link>
                <div className="absolute top-8 right-8 text-gray-400 hover:text-gray-600 transition-colors text-sm font-medium">
                    <Link to="/" className="hidden lg:flex items-center gap-2 hover:text-[#0B84D8]">← Retour au site</Link>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-[480px] bg-white rounded-[32px] p-8 sm:p-12 shadow-[0_8px_40px_rgba(0,0,0,0.06)] border border-gray-100"
                >
                    <div className="mb-8">
                        <h2 className="text-3xl font-black text-[#1a2b40] mb-2">Connexion</h2>
                        <p className="text-gray-500">Accédez à votre tableau de bord</p>
                    </div>

                    <div className="flex p-1 bg-gray-100/80 rounded-2xl mb-8">
                        <button
                            onClick={() => setTab('etudiant')}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${tab === 'etudiant' ? 'bg-white text-[#0B84D8] shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <GraduationCap className="w-4 h-4" /> Étudiant
                        </button>
                        <button
                            onClick={() => setTab('voyageur')}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${tab === 'voyageur' ? 'bg-white text-[#0B84D8] shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <Briefcase className="w-4 h-4" /> Voyageur
                        </button>
                    </div>

                    <div className="mb-8 bg-[#F0F8FF] border border-[#0B84D8]/20 rounded-xl p-4 flex items-center justify-between">
                        <p className="text-xs text-[#0B84D8] font-medium leading-relaxed flex gap-2">
                            <Zap className="w-4 h-4 shrink-0 text-amber-500" />
                            <span><strong>Démo {tab} :</strong> cliquez pour remplir automatiquement les identifiants</span>
                        </p>
                        <button onClick={handleDemoFill} className="text-[#0B84D8] text-xs font-bold hover:underline whitespace-nowrap flex items-center gap-1">
                            Remplir <ArrowRight className="w-3 h-3" />
                        </button>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-[#1a2b40] mb-2" htmlFor="email">Adresse email</label>
                            <input
                                id="email"
                                type="email"
                                required
                                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0B84D8]/20 focus:border-[#0B84D8] outline-none transition-all text-[#333333]"
                                placeholder="votre@email.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-[#1a2b40] mb-2" htmlFor="password">Mot de passe</label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0B84D8]/20 focus:border-[#0B84D8] outline-none transition-all text-[#333333]"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 bg-[#0B84D8] hover:bg-[#0973BD] text-white font-bold rounded-xl transition-colors shadow-lg shadow-[#0B84D8]/25"
                        >
                            Se connecter
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm font-medium">
                        <span className="text-gray-500">Pas encore de compte ? </span>
                        <Link to="/devis" className="text-[#0B84D8] hover:underline">Faire une demande →</Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
