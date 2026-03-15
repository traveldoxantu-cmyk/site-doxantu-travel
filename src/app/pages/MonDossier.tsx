import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Info, CheckCircle2, FileText, Search, GraduationCap, Plane, Building2, MapPin, Calendar, CheckSquare, MessageCircle } from 'lucide-react';
import { dossierService, type DossierStep } from '../lib/services/dossierService';

type IconType = typeof FileText;

const ICON_MAP: Record<string, IconType> = {
    FileText,
    Search,
    GraduationCap,
    Building2,
    Plane,
};

export function MonDossier() {
    const [steps, setSteps] = useState<DossierStep[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        dossierService.getSteps()
            .then(setSteps)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const currentStep = steps.find(s => s.status === 'current');
    const completedCount = steps.filter(s => s.status === 'completed').length;
    const totalSteps = steps.length;
    const progressPercent = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto pb-24 space-y-8 animate-pulse">
                <div className="h-10 bg-gray-200 rounded-2xl w-3/4" />
                <div className="h-6 bg-gray-200 rounded-xl w-1/4" />
                <div className="space-y-4">
                    {[1,2,3,4,5,6].map(i => <div key={i} className="bg-gray-200 rounded-3xl h-24" />)}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto pb-24 relative min-h-full space-y-8">
            {/* Header section */}
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h1 className="text-3xl font-bold text-[#1a2b40] mb-2">Suivi de mon dossier</h1>
                    <p className="text-gray-500 font-medium text-sm">
                        Dossier <span className="text-[#0B84D8] font-bold">DXT-2026-0142</span> - Master en Intelligence Artificielle – Université Paris-Saclay
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-3xl font-black text-[#1a2b40]">{progressPercent}%</p>
                    <p className="text-sm text-gray-500 font-medium">complété</p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
                <div className="flex justify-between items-center text-xs text-gray-400 font-medium mb-3">
                    <span>Progression</span>
                    <span>{completedCount}/{totalSteps} étapes</span>
                </div>
                <div className="relative">
                    <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#0B84D8] rounded-full transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
                    </div>
                    <div className="relative flex justify-between">
                        {steps.map((step, i) => (
                            <div key={step.id} className={`w-3 h-3 rounded-full border-2 ${i < completedCount ? 'bg-[#0B84D8] border-[#0B84D8]' : i === completedCount ? 'bg-white border-[#0B84D8]' : 'bg-gray-100 border-gray-100'}`}></div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Alert / Attention Box */}
            {currentStep && (
                <div className="bg-[#F0F8FF] border border-[#0B84D8]/20 rounded-2xl p-6 flex gap-4">
                    <Info className="w-6 h-6 text-[#0B84D8] flex-shrink-0" />
                    <div>
                        <h3 className="font-bold text-[#0B84D8] mb-1 text-sm uppercase tracking-wide">Prochaine étape importante</h3>
                        <p className="text-[#333333]">
                            Votre <span className="font-bold">{currentStep.title.replace(/Étape \d+ - /, '')}</span> est prévue le <span className="font-bold">{currentStep.date}</span>.
                            {currentStep.details && ` Préparez votre projet d'études et apportez tous vos documents originaux.`}
                        </p>
                    </div>
                </div>
            )}

            {/* Timeline Cards */}
            <div className="space-y-4">
                {steps.map((step) => {
                    const Icon = ICON_MAP[step.iconType] ?? FileText;
                    return (
                        <motion.div
                            key={step.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`bg-white rounded-3xl p-6 transition-all border ${step.status === 'current' ? 'border-[#0B84D8] shadow-md ring-4 ring-[#0B84D8]/5' : 'border-gray-100 shadow-sm'}`}
                        >
                            <div className="flex items-start gap-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${step.status === 'completed' ? 'bg-emerald-50 text-emerald-500' :
                                    step.status === 'current' ? 'bg-[#1a2b40] text-white shadow-lg' : 'bg-gray-50 text-gray-400'
                                }`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <div className="flex-1 pt-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className={`font-bold text-lg mb-1 flex items-center gap-3 ${step.status === 'current' ? 'text-[#0B84D8]' :
                                                step.status === 'upcoming' ? 'text-gray-400' : 'text-emerald-700'
                                            }`}>
                                                {step.title}
                                                {step.status === 'completed' && <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">Terminé</span>}
                                                {step.status === 'current' && <span className="bg-[#0B84D8] text-white text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">En cours</span>}
                                            </h3>
                                            <p className="text-gray-500 text-sm font-medium">{step.date}</p>
                                        </div>
                                        <div className="shrink-0 flex items-center h-full pt-1">
                                            {step.status === 'completed' ? (
                                                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                                            ) : step.status === 'current' ? (
                                                <span className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-50 text-[#0B84D8]">
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
                                                </span>
                                            ) : (
                                                <span className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-50 text-gray-400">
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    {/* Detailed content for current step */}
                                    {step.status === 'current' && step.details && (
                                        <div className="mt-6 pt-6 border-t border-gray-100">
                                            <p className="text-gray-600 mb-4 leading-relaxed">{step.details.description}</p>
                                            <ul className="space-y-3 mb-6">
                                                <li className="flex items-center gap-2 text-sm text-[#333333] font-medium">
                                                    <Calendar className="w-4 h-4 text-gray-400" /> Date : {step.details.date} à {step.details.heure}
                                                </li>
                                                <li className="flex items-center gap-2 text-sm text-[#333333] font-medium">
                                                    <MapPin className="w-4 h-4 text-gray-400" /> Lieu : {step.details.lieu}
                                                </li>
                                                <li className="flex items-center gap-2 text-sm text-[#333333] font-medium">
                                                    <CheckSquare className="w-4 h-4 text-emerald-500" /> Préparez votre projet d'études
                                                </li>
                                                <li className="flex items-center gap-2 text-sm text-[#333333] font-medium">
                                                    <FileText className="w-4 h-4 text-amber-500" /> Apportez tous vos originaux
                                                </li>
                                            </ul>
                                            <button className="bg-[#0B84D8] hover:bg-[#0973BD] text-white font-bold py-2.5 px-6 rounded-xl transition-colors text-sm shadow-sm">
                                                Préparer mon entretien
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Bottom Floating Contact Widget */}
            <div className="fixed bottom-0 left-0 lg:left-72 right-0 bg-white border-t border-gray-100 p-4 px-6 md:px-10 z-20 flex justify-between items-center shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
                <div className="flex items-center gap-4 max-w-7xl mx-auto w-full">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex-1 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white text-lg shadow-sm" style={{ backgroundColor: '#0B84D8' }}>
                                FM
                            </div>
                            <div>
                                <p className="font-bold text-[#1a2b40] text-sm">Une question sur votre dossier ?</p>
                                <p className="text-gray-500 text-xs">Votre conseiller Fatou Mbaye est disponible</p>
                            </div>
                        </div>
                        <button className="bg-[#0B84D8] hover:bg-[#0973BD] text-white font-bold py-2.5 px-6 rounded-xl transition-colors text-sm shadow-sm flex items-center gap-2">
                            Écrire
                        </button>
                    </div>
                    <button className="w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg shadow-[#25D366]/30 flex items-center justify-center hover:scale-105 transition-transform ml-4 shrink-0">
                        <MessageCircle className="w-7 h-7" />
                    </button>
                </div>
            </div>
        </div>
    );
}
