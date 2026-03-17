import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Phone, MapPin, Camera, Shield, Bell, CreditCard, ChevronRight, LogOut, GraduationCap, Building2, Loader2 } from 'lucide-react';
import { profilService, type Profil } from '../lib/services/profilService';
import { storageService } from '../lib/services/storageService';

type SectionItem = {
    icon: React.ElementType;
    label: string;
    desc: string;
    color: string;
    bg: string;
};

const settingsSections: { title: string; items: SectionItem[] }[] = [
    {
        title: 'Paramètres du compte',
        items: [
            { icon: Shield,     label: 'Sécurité & Mot de passe', desc: 'Gérer votre mot de passe et 2FA',    color: 'text-indigo-600',  bg: 'bg-indigo-50' },
            { icon: Bell,       label: 'Notifications',            desc: 'Alertes par email et SMS',          color: 'text-amber-600',   bg: 'bg-amber-50' },
            { icon: CreditCard, label: 'Paiements & Factures',     desc: 'Historique de vos règlements',      color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ]
    }
];

export function Profil() {
    const [profil, setProfil] = useState<Profil | null>(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState<'avatar' | 'cover' | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const sessionUser = storedUser ? JSON.parse(storedUser) : null;

        if (sessionUser) {
            profilService.getProfil(sessionUser.id)
                .then(data => {
                    setProfil({
                        ...data,
                        nom: `${sessionUser.firstName} ${sessionUser.lastName}`,
                        email: sessionUser.email,
                        telephone: sessionUser.phone || data?.telephone,
                        initiales: sessionUser.initiales || data?.initiales
                    });
                })
                .catch(console.error)
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cover') => {
        const file = event.target.files?.[0];
        if (!file || !profil) return;

        try {
            setUploading(type);
            const bucket = type === 'avatar' ? 'avatars' : 'documents'; // couverture dans documents ou avatars public
            const fileExt = file.name.split('.').pop();
            const fileName = `${profil.id}_${type}_${Math.random()}.${fileExt}`;
            const path = `${profil.id}/${fileName}`;

            const publicUrl = await storageService.uploadFile(bucket, path, file);

            // Mise à jour en base
            const updateData = type === 'avatar' ? { avatarUrl: publicUrl } : { coverUrl: publicUrl };
            await profilService.updateProfil(profil.id, updateData);

            setProfil(prev => prev ? { ...prev, ...updateData } : null);
        } catch (error) {
            console.error('Upload failed:', error);
            alert("Erreur lors de l'upload de l'image.");
        } finally {
            setUploading(null);
        }
    };

    if (loading || !profil) {
        return (
            <div className="max-w-4xl mx-auto space-y-8 pb-24 animate-pulse">
                <div className="bg-gray-200 rounded-[32px] h-72" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-gray-200 rounded-[32px] h-64" />
                    <div className="bg-gray-200 rounded-[32px] h-64" />
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-24">
            {/* Header / Profile Card */}
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden relative">
                {/* Banner Background */}
                <div className="h-40 relative overflow-hidden group/cover">
                    {profil.coverUrl ? (
                         <img src={profil.coverUrl} alt="Cover" className="w-full h-full object-cover transition-transform duration-500 group-hover/cover:scale-105" />
                    ) : (
                        <div className="h-full bg-gradient-to-r from-[#072a50] to-[#0B84D8] relative">
                            <div className="absolute top-0 right-0 w-64 h-full bg-white/5 skew-x-[-20deg] translate-x-32" />
                        </div>
                    )}
                    
                    <label className="absolute inset-0 bg-black/20 opacity-0 group-hover/cover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center">
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handlePhotoUpload(e, 'cover')} />
                        <div className="bg-white/90 px-4 py-2 rounded-xl text-[#1a2b40] text-xs font-bold shadow-lg flex items-center gap-2">
                             {uploading === 'cover' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                             Modifier la couverture
                        </div>
                    </label>
                </div>

                <div className="px-8 pb-8 relative">
                    <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-16">
                        {/* Avatar */}
                        <div className="relative group/avatar">
                            <div className="w-32 h-32 rounded-3xl bg-[#0B84D8] border-8 border-white text-white flex items-center justify-center text-4xl font-black shadow-xl relative z-10 transition-transform group-hover/avatar:scale-105 overflow-hidden">
                                {profil.avatarUrl ? (
                                    <img src={profil.avatarUrl} alt="Profil" className="w-full h-full object-cover" />
                                ) : (
                                    profil.initiales
                                )}
                                {uploading === 'avatar' && (
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-20">
                                        <Loader2 className="w-8 h-8 animate-spin text-white" />
                                    </div>
                                )}
                            </div>
                            <label className="absolute bottom-1 right-1 z-20 w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center text-[#1a2b40] hover:text-[#0B84D8] transition-colors border border-gray-50 cursor-pointer">
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handlePhotoUpload(e, 'avatar')} />
                                <Camera className="w-5 h-5" />
                            </label>
                        </div>

                        {/* User Info Header */}
                        <div className="flex-1 mb-2">
                            <h1 className="text-3xl font-black text-[#1a2b40] mb-1">{profil.nom}</h1>
                            <div className="flex flex-wrap gap-3">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#E8F4FD] text-[#0B84D8] text-[11px] font-bold uppercase tracking-wider">
                                    <GraduationCap className="w-3.5 h-3.5" /> Étudiant
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[11px] font-bold uppercase tracking-wider">
                                    Compte vérifié
                                </span>
                            </div>
                        </div>

                        <button className="mb-2 px-6 py-3 bg-gray-50 text-[#1a2b40] font-bold rounded-2xl hover:bg-gray-100 transition-all text-sm border border-gray-100">
                            Modifier le profil
                        </button>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-gray-50">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Dossier ID</p>
                            <p className="font-bold text-[#1a2b40]">{profil?.dossierId || 'Non défini'}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Destination</p>
                            <p className="font-bold text-[#1a2b40]">{profil?.destination || 'Non définie'}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Membre depuis</p>
                            <p className="font-bold text-[#1a2b40]">{profil?.membreDepuis || 'Récemment'}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Dernière activité</p>
                            <p className="font-bold text-[#1a2b40]">Aujourd'hui</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Personal Info */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm">
                        <h2 className="text-xl font-bold text-[#1a2b40] mb-6 flex items-center gap-3">
                            <User className="w-5 h-5 text-[#0B84D8]" /> Informations personnelles
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">Nom complet</label>
                                    <div className="flex items-center gap-3 p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                                        <User className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm font-bold text-[#1a2b40]">{profil?.nom || 'Chargement...'}</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">Email</label>
                                    <div className="flex items-center gap-3 p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                                        <Mail className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm font-bold text-[#1a2b40]">{profil?.email || 'non renseigné'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">Téléphone</label>
                                    <div className="flex items-center gap-3 p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                                        <Phone className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm font-bold text-[#1a2b40]">{profil?.telephone || 'non renseigné'}</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">Adresse</label>
                                    <div className="flex items-center gap-3 p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm font-bold text-[#1a2b40]">{profil?.adresse || 'non renseignée'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-gray-50">
                            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Parcours académique</h3>
                            <div className="flex items-start gap-4 p-5 bg-[#F0F8FF] rounded-2xl border border-[#0B84D8]/10">
                                <div className="w-10 h-10 rounded-xl bg-white text-[#0B84D8] flex items-center justify-center shadow-sm">
                                    <Building2 className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-bold text-[#1a2b40] text-sm">{profil?.parcours?.universite || 'Parcours non renseigné'}</p>
                                    <p className="text-xs text-gray-500 font-medium">{profil?.parcours?.diplome || '--'} • Promotion {profil?.parcours?.promotion || '--'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Settings & Actions */}
                <div className="space-y-8">
                    {settingsSections.map((section, idx: number) => (
                        <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm">
                            <h2 className="text-lg font-bold text-[#1a2b40] mb-6">{section.title}</h2>
                            <div className="space-y-2">
                                {section.items.map((item: SectionItem, i: number) => (
                                    <button
                                        key={i}
                                        className="w-full group flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100"
                                    >
                                        <div className="flex items-center gap-4 text-left">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.bg} ${item.color} group-hover:scale-110 transition-transform`}>
                                                <item.icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-[#1a2b40] mb-0.5">{item.label}</p>
                                                <p className="text-[10px] text-gray-500 font-medium">{item.desc}</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#0B84D8] group-hover:translate-x-1 transition-all" />
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    ))}

                    {/* Support Widget */}
                    <div className="bg-[#1a2b40] rounded-[32px] p-6 text-white shadow-xl relative overflow-hidden group">
                        <div className="absolute right-[-20px] bottom-[-20px] w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                        <h3 className="text-lg font-bold mb-2">Besoin d'aide ?</h3>
                        <p className="text-blue-100/70 text-xs leading-relaxed mb-6">
                            Notre équipe support est là pour vous accompagner dans la mise à jour de vos informations.
                        </p>
                        <button className="w-full py-3 bg-[#0B84D8] text-white font-bold rounded-xl text-sm transition-all hover:bg-[#0973BD] shadow-lg">
                            Contacter le support
                        </button>
                    </div>

                    <button className="w-full flex items-center justify-center gap-3 p-4 text-red-500 font-bold border-2 border-dashed border-red-50 hover:bg-red-50 hover:border-red-100 transition-all rounded-[24px] text-sm group">
                        <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        Se déconnecter de la session
                    </button>
                </div>
            </div>
        </div>
    );
}
