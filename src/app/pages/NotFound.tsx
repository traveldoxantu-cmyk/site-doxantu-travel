import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Home, ArrowLeft, Plane, Compass } from 'lucide-react';
import { SEO } from '../components/SEO';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-white px-4 py-20 overflow-hidden relative font-sans">
      <SEO title="Destination Introuvable - 404" description="Oups ! Il semble que votre vol ait été dérouté. Cette destination n'existe pas." />
      
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(11,132,216,0.03)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute top-1/4 left-10 w-64 h-64 bg-blue-100/30 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-10 w-72 h-72 bg-sky-100/20 rounded-full blur-3xl" />

      <div className="max-w-4xl w-full flex flex-col items-center text-center relative z-10">
        
        {/* Main Icon/Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative mb-8"
        >
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-[40px] bg-white shadow-[0_20px_50px_rgba(11,132,216,0.1)] border border-blue-50 flex items-center justify-center relative group">
            <Compass className="w-16 h-16 md:w-20 md:h-20 text-[#0B84D8] animate-[spin_10s_linear_infinite]" />
            
            <motion.div 
              animate={{ 
                x: [0, 40, 0, -40, 0],
                y: [0, -20, -40, -20, 0]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              className="absolute -top-4 -right-4 w-12 h-12 bg-white rounded-2xl shadow-lg border border-red-50 flex items-center justify-center text-red-500"
            >
              <Plane className="w-6 h-6 rotate-45" />
            </motion.div>
          </div>
        </motion.div>

        {/* Text Content */}
        <div className="space-y-6 max-w-2xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span className="inline-block px-5 py-2 rounded-full bg-blue-50 text-[#0B84D8] text-xs font-bold uppercase tracking-[0.2em] mb-2 border border-blue-100/50">
              Erreur 404
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-5xl md:text-7xl font-bold text-[#333333] leading-[1.1]"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Destination <span className="text-[#0B84D8]">introuvable</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-gray-500 text-lg md:text-xl font-medium max-w-lg mx-auto leading-relaxed"
          >
            Oups ! Il semble que votre boussole ait perdu le Nord. 
            Le vol que vous cherchez n'est pas répertorié sur notre carnet de voyage.
          </motion.p>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 w-full px-4"
        >
          <Link
            to="/"
            className="w-full sm:w-auto min-w-[240px] flex items-center justify-center gap-3 px-10 py-5 bg-[#0B84D8] text-white font-bold rounded-2xl hover:shadow-[0_15px_30px_rgba(11,132,216,0.3)] transition-all hover:-translate-y-1 active:scale-95 group"
          >
            <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
            RETOUR À L'ACCUEIL
          </Link>
          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto min-w-[240px] flex items-center justify-center gap-3 px-10 py-5 bg-white text-[#333333] font-bold rounded-2xl border-2 border-gray-100 hover:border-[#0B84D8] hover:text-[#0B84D8] transition-all hover:bg-blue-50/50 active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
            PAGE PRÉCÉDENTE
          </button>
        </motion.div>

        {/* Help footer */}
        <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 1 }}
           className="mt-20 pt-10 border-t border-gray-100 flex flex-col items-center gap-3"
        >
          <p className="text-gray-400 font-medium text-sm">Besoin d'aide pour votre voyage ?</p>
          <Link to="/contact" className="text-[#0B84D8] font-bold hover:text-[#0a73be] transition-all uppercase text-xs tracking-widest border-b-2 border-transparent hover:border-[#0B84D8]">
             Contacter le support →
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
