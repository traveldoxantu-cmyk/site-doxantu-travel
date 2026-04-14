import { Link } from 'react-router';
import { ShieldAlert, ArrowRight, LayoutDashboard } from 'lucide-react';
import { motion } from 'motion/react';

interface AdminRestrictionNoticeProps {
    title?: string;
    description?: string;
}

export function AdminRestrictionNotice({ 
    title = "Espace Réservé aux Clients", 
    description = "En tant qu'administrateur, vous n'avez pas la possibilité de soumettre des demandes techniques ou des dossiers clients via ces formulaires public."
}: AdminRestrictionNoticeProps) {
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 rounded-3xl border border-blue-100 bg-blue-50/50 backdrop-blur-sm text-center"
        >
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ShieldAlert className="w-8 h-8" />
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
            
            <p className="text-gray-600 mb-8 max-w-sm mx-auto leading-relaxed">
                {description}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                    to="/admin/dashboard"
                    className="flex items-center gap-2 px-6 py-3 bg-[#0B84D8] text-white font-bold rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                    <LayoutDashboard className="w-4 h-4" />
                    Aller au Dashboard Admin
                </Link>
                
                <Link
                    to="/admin/demandes"
                    className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 border border-gray-200 font-bold rounded-xl hover:bg-gray-50 transition-all"
                >
                    Voir les demandes
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
            
            <p className="mt-8 text-xs text-gray-400 font-medium italic">
                Utilisez votre tableau de bord pour gérer les dossiers et répondre aux clients.
            </p>
        </motion.div>
    );
}
