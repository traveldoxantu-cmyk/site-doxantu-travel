import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Home, ArrowLeft, Plane } from 'lucide-react';
import { SEO } from '../components/SEO';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 overflow-hidden relative font-sans">
      <SEO title="Destination Introuvable - 404" description="Oups ! Il semble que votre vol ait été dérouté. Cette destination n'existe pas." />
      
      {/* Background Decorative Gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(11,132,216,0.05)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-4xl w-full flex flex-col items-center text-center relative z-10">
        
        {/* Illustration Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative mb-12"
        >
          {/* Main Image */}
          <div className="relative z-10 w-full max-w-[500px] aspect-square rounded-[60px] overflow-hidden shadow-[0_32px_64px_-16px_rgba(11,132,216,0.15)] border-8 border-white">
            <img 
              src="/assets/images/lost-traveler.png" 
              alt="Voyageur égaré à la porte 404"
              className="w-full h-full object-cover scale-105 hover:scale-110 transition-transform duration-[2s]"
            />
          </div>

          {/* Decorative floating badge */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-6 -right-6 z-20 bg-white/80 backdrop-blur-md border border-[#0B84D8]/20 p-4 rounded-3xl shadow-xl flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-2xl bg-red-100 flex items-center justify-center text-red-600">
              <Plane className="w-6 h-6 rotate-45" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Statut du vol</p>
              <p className="text-sm font-black text-red-600">DESTINATION PERDUE</p>
            </div>
          </motion.div>

          {/* Background Blur Elements */}
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-200 rounded-full blur-[80px] opacity-30 animate-pulse" />
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-200 rounded-full blur-[80px] opacity-20" />
        </motion.div>

        {/* Text Content */}
        <div className="space-y-4 max-w-2xl px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-[#0B84D8] text-xs font-black uppercase tracking-[0.2em] mb-4">
              Erreur 404
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-5xl md:text-6xl font-black text-[#1a2b40] leading-[1.1]"
          >
            Embarquement <span className="text-[#0B84D8]">immédiat...</span> <br />
            pour nulle part !
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-gray-500 text-lg md:text-xl font-medium max-w-lg mx-auto leading-relaxed"
          >
            Oups ! Il semble que votre boussole ait perdu le Nord. 
            La page que vous cherchez n'est pas répertoriée sur notre carnet de voyage.
          </motion.p>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-5 mt-12 w-full px-4"
        >
          <Link
            to="/"
            className="w-full sm:w-auto min-w-[220px] flex items-center justify-center gap-3 px-10 py-5 bg-[#0B84D8] text-white font-black rounded-3xl hover:bg-black transition-all hover:shadow-[0_20px_40px_-10px_rgba(11,132,216,0.3)] group active:scale-95"
          >
            <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
            RETOUR À L'ACCUEIL
          </Link>
          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto min-w-[220px] flex items-center justify-center gap-3 px-10 py-5 bg-white text-gray-900 font-black rounded-3xl border-2 border-gray-100 hover:border-[#0B84D8] hover:text-[#0B84D8] transition-all hover:bg-blue-50/50 active:scale-95"
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
           className="mt-20 pt-10 border-t border-gray-100 flex flex-col items-center gap-2"
        >
          <p className="text-gray-400 font-bold text-sm">Une question sur votre destination ?</p>
          <Link to="/contact" className="text-[#0B84D8] font-black hover:tracking-wider transition-all uppercase text-sm border-b-2 border-blue-100 hover:border-[#0B84D8]">
             Contacter l'équipage
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
