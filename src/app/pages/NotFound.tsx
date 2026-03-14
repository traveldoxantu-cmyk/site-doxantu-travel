import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { SEO } from '../components/SEO';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4 overflow-hidden relative">
      <SEO title="Page non trouvée" description="Désolé, la page que vous recherchez n'existe pas ou a été déplacée." />
      
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50 rounded-full blur-[120px] -mr-64 -mt-64" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-50 rounded-full blur-[120px] -ml-64 -mb-64" />

      <div className="max-w-xl w-full text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative inline-block mb-8">
             <span className="text-[150px] font-black text-blue-50 select-none">404</span>
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 bg-white rounded-3xl shadow-2xl flex items-center justify-center border border-blue-50 animate-bounce">
                  <Search className="w-12 h-12 text-[#0B84D8]" />
                </div>
             </div>
          </div>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-extrabold text-[#1a2b40] mb-4"
        >
          Destination introuvable
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-gray-500 mb-10 text-lg leading-relaxed px-4"
        >
          Oups ! Il semble que vous vous soyez égaré en chemin. 
          La page que vous cherchez n'existe pas ou a été déplacée.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-[#0B84D8] text-white font-bold rounded-2xl hover:bg-blue-600 shadow-lg shadow-blue-200 transition-all hover:-translate-y-1 active:scale-95"
          >
            <Home className="w-5 h-5" /> Retour à l'accueil
          </Link>
          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-700 font-bold rounded-2xl border border-gray-200 hover:bg-gray-50 transition-all hover:-translate-y-1 active:scale-95 shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" /> Page précédente
          </button>
        </motion.div>

        <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.8 }}
           className="mt-16 pt-8 border-t border-gray-100 flex flex-col items-center gap-4 text-gray-400 text-sm"
        >
          <p>Besoin d'aide ? Nos conseillers sont là pour vous.</p>
          <Link to="/contact" className="text-[#0B84D8] font-bold hover:underline">
             Contacter l'assistance
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
