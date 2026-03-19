import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Home, ArrowLeft, Rocket, Sparkles } from 'lucide-react';
import { SEO } from '../components/SEO';

export function ComingSoon() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4 overflow-hidden relative">
      <SEO title="À venir - Prochaine mise à jour" description="Cette fonctionnalité sera disponible dans notre prochaine mise à jour. Nous travaillons pour vous offrir la meilleure expérience." />
      
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-[120px] -mr-64 -mt-64" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-[120px] -ml-64 -mb-64" />

      <div className="max-w-2xl w-full text-center relative z-10 px-6 py-12 bg-white/40 backdrop-blur-xl rounded-[48px] border border-white shadow-2xl shadow-blue-100/50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
        >
          <div className="relative inline-block mb-10">
             <div className="w-24 h-24 bg-gradient-to-br from-[#0B84D8] to-[#072a50] rounded-3xl shadow-xl flex items-center justify-center relative z-10 animate-bounce">
                <Rocket className="w-12 h-12 text-white" />
             </div>
             <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
               className="absolute -top-4 -right-4 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center"
             >
                <Sparkles className="w-6 h-6 text-[#0B84D8]" />
             </motion.div>
          </div>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-5xl font-black text-[#1a2b40] mb-6 leading-tight"
        >
          Disponible dans notre <br />
          <span className="text-[#0B84D8]">prochaine mise à jour</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-gray-500 mb-12 text-lg font-medium leading-relaxed max-w-lg mx-auto"
        >
          Nous préparons cette section avec le plus grand soin pour vous offrir une expérience fluide et complète. 
          Revenez très bientôt !
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-5"
        >
          <Link
            to="/"
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-4.5 bg-[#0B84D8] text-white font-black rounded-2xl hover:bg-blue-600 shadow-xl shadow-blue-200 transition-all hover:-translate-y-1 active:scale-95 text-sm uppercase tracking-widest"
          >
            <Home className="w-5 h-5" /> Accueil
          </Link>
          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-4.5 bg-white text-gray-700 font-black rounded-2xl border border-gray-100 hover:bg-gray-50 transition-all hover:-translate-y-1 active:scale-95 shadow-lg text-sm uppercase tracking-widest"
          >
            <ArrowLeft className="w-5 h-5" /> Retour
          </button>
        </motion.div>

        <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 1 }}
           className="mt-16 pt-10 border-t border-gray-100/50 flex flex-col items-center gap-4"
        >
          <div className="flex -space-x-3 mb-2">
             {[1,2,3,4].map(i => (
                <div key={i} className="w-9 h-9 rounded-full border-2 border-white bg-gray-200 overflow-hidden shadow-sm">
                   <img src={`https://i.pravatar.cc/100?u=${i+10}`} alt="avatar" />
                </div>
             ))}
          </div>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Déjà +250 utilisateurs en attente</p>
        </motion.div>
      </div>
    </div>
  );
}
