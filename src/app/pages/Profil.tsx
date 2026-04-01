import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Phone, MapPin, Camera, Shield, Bell, CreditCard, ChevronRight, LogOut, GraduationCap, Building2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Cropper, { Area } from 'react-easy-crop';
import { profilService, type Profil } from '../lib/services/profilService';
import { storageService } from '../lib/services/storageService';
import { getCroppedImg } from '../lib/utils/cropImage';
import { useUser } from '../lib/context/UserContext';

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
    const { user, logout } = useUser();
    const [profil, setProfil] = useState<Profil | null>(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState<boolean>(false);
    
    // States for cropping
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [isCropModalOpen, setIsCropModalOpen] = useState(false);

    useEffect(() => {
        const userId = user?.id;
        if (!userId) {
            setLoading(false);
            return;
        }

        profilService.getProfil(userId)
            .then(data => {
                if (data) {
                    setProfil({
                        ...data,
                        id: userId,
                        nom: data.nom || (user ? `${user.firstName} ${user.lastName}` : 'Utilisateur'),
                        email: user?.email || (data as any).email,
                        telephone: (data as any).tel || (data as any).telephone || user?.phone,
                        initiales: (data as any).initiales || user?.initiales || 'U',
                    });
                } else {
                    // Fallback sur les données du contexte
                    setProfil({
                        id: userId,
                        nom: user ? `${user.firstName} ${user.lastName}` : 'Utilisateur',
                        email: user?.email,
                        telephone: user?.phone,
                        initiales: user?.initiales || 'U',
                        role: user?.role,
                    } as any);
                }
            })
            .catch(err => {
                console.warn('Profil non accessible:', err);
                setProfil({
                    id: userId,
                    nom: user ? `${user.firstName} ${user.lastName}` : 'Utilisateur',
                    email: user?.email,
                    telephone: user?.phone,
                    initiales: user?.initiales || 'U',
                    role: user?.role,
                } as any);
            })
            .finally(() => setLoading(false));
    }, [user]);

    const onCropComplete = (_croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setImageSrc(reader.result as string);
                setIsCropModalOpen(true);
            });
            reader.readAsDataURL(file);
        }
    };

    const handleCropSave = async () => {
        if (!imageSrc || !croppedAreaPixels || !profil) return;

        try {
            setUploading(true);
            setIsCropModalOpen(false);

            const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
            if (!croppedImage) throw new Error('Failed to crop image');

            const file = new File([croppedImage], 'avatar.jpg', { type: 'image/jpeg' });
            const fileName = `${profil.id}_avatar_${Date.now()}.jpg`;
            const path = `${profil.id}/${fileName}`;

            const publicUrl = await storageService.uploadFile('avatars', path, file);

            // Mise à jour en base
            const updateData = { avatarUrl: publicUrl };
            await profilService.updateProfil(profil.id, updateData);

            setProfil(prev => prev ? { ...prev, ...updateData } : null);
            setImageSrc(null);
            toast.success("Photo de profil mise à jour avec succès !");
        } catch (error) {
            console.error('Upload failed:', error);
            toast.error("Erreur lors de l'upload de l'image. Veuillez réessayer.");
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto space-y-8 pb-24 animate-pulse">
                <div className="bg-gray-200 rounded-[32px] h-32" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-gray-200 rounded-[32px] h-64" />
                    <div className="bg-gray-200 rounded-[32px] h-64" />
                </div>
            </div>
        );
    }

    if (!profil) {
        return (
            <div className="max-w-4xl mx-auto py-20 text-center">
                <h2 className="text-2xl font-bold text-gray-800">Session expirée</h2>
                <p className="text-gray-500 mt-2">Veuillez vous reconnecter pour accéder à votre profil.</p>
                <button onClick={() => window.location.href = '/login'} className="mt-6 px-8 py-3 bg-[#0B84D8] text-white rounded-2xl font-bold">
                    Connexion
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-24">
            {/* Modal de recadrage */}
            {isCropModalOpen && imageSrc && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-[32px] w-full max-w-lg overflow-hidden shadow-2xl"
                    >
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-[#1a2b40]">Recadrer votre photo</h3>
                            <button onClick={() => setIsCropModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <LogOut className="w-5 h-5 rotate-90" />
                            </button>
                        </div>
                        
                        <div className="relative h-80 bg-gray-900">
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                                cropShape="round"
                                showGrid={false}
                            />
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Zoom</label>
                                <input
                                    type="range"
                                    value={zoom}
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    aria-labelledby="Zoom"
                                    onChange={(e) => setZoom(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#0B84D8]"
                                />
                            </div>

                            <div className="flex gap-4">
                                <button 
                                    onClick={() => setIsCropModalOpen(false)}
                                    className="flex-1 px-6 py-3 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-all font-sans"
                                >
                                    Annuler
                                </button>
                                <button 
                                    onClick={handleCropSave}
                                    className="flex-1 px-6 py-3 bg-[#0B84D8] text-white font-bold rounded-2xl hover:bg-[#0973BD] transition-all shadow-lg font-sans"
                                >
                                    Valider
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Header / Profile Card */}
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden relative">
                {/* Simplified Header (No cover) */}
                <div className="h-24 bg-gradient-to-r from-[#072a50] to-[#0B84D8] relative">
                    <div className="absolute top-0 right-0 w-64 h-full bg-white/5 skew-x-[-20deg] translate-x-32" />
                </div>

                <div className="px-8 pb-8 relative">
                    <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-12">
                        {/* Avatar */}
                        <div className="relative group/avatar">
                            <div className="w-32 h-32 rounded-3xl bg-[#0B84D8] border-8 border-white text-white flex items-center justify-center text-4xl font-black shadow-xl relative z-10 transition-transform group-hover/avatar:scale-105 overflow-hidden">
                                {profil.avatarUrl ? (
                                    <img src={profil.avatarUrl} alt="Profil" className="w-full h-full object-cover" />
                                ) : (
                                    profil.initiales
                                )}
                                {uploading && (
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-20">
                                        <Loader2 className="w-8 h-8 animate-spin text-white" />
                                    </div>
                                )}
                            </div>
                            <label className="absolute bottom-1 right-1 z-20 w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center text-[#1a2b40] hover:text-[#0B84D8] transition-colors border border-gray-50 cursor-pointer">
                                <input type="file" className="hidden" accept="image/*" onChange={handleFileSelect} />
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

                    <div className="bg-[#1a2b40] rounded-[32px] p-6 text-white shadow-xl relative overflow-hidden group">
                        <div className="absolute right-[-20px] bottom-[-20px] w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                        <h3 className="text-lg font-bold mb-2">Besoin d'aide ?</h3>
                        <p className="text-blue-100/70 text-xs leading-relaxed mb-6">
                            Notre équipe support est là pour vous accompagner dans la mise à jour de vos informations.
                        </p>
                        <button className="w-full py-3 bg-[#0B84D8] text-white font-bold rounded-xl text-sm transition-all hover:bg-[#0973BD] shadow-lg font-sans">
                            Contacter le support
                        </button>
                    </div>

                    <button 
                        onClick={logout}
                        className="w-full flex items-center justify-center gap-3 p-4 text-red-500 font-bold border-2 border-dashed border-red-50 hover:bg-red-50 hover:border-red-100 transition-all rounded-[24px] text-sm group font-sans">
                        <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        Se déconnecter de la session
                    </button>
                </div>
            </div>
        </div>
    );
}
