import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Upload, FileText, Image as ImageIcon, Eye, Download, Trash2, CheckCircle2, Clock, Loader2 } from 'lucide-react';
import { documentsService, type Document } from '../lib/services/documentsService';
import { storageService } from '../lib/services/storageService';

const filters = ['Tous', 'Identité', 'Académique', 'Visa', 'Assurance', 'Paiement'];

export function MesDocuments() {
    const [activeTab, setActiveTab] = useState<'mes-documents' | 'documents-requis'>('mes-documents');
    const [activeFilter, setActiveFilter] = useState('Tous');
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const sessionUser = storedUser ? JSON.parse(storedUser) : null;
        setUser(sessionUser);

        if (sessionUser) {
            documentsService.getDocuments(sessionUser.id)
                .then(setDocuments)
                .catch(console.error)
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const filteredDocs = activeFilter === 'Tous'
        ? documents
        : documents.filter(doc => doc.category === activeFilter);

    const verifiedCount = documents.filter(d => d.status === 'verified').length;

    const handleDelete = async (id: string) => {
        try {
            await documentsService.deleteDocument(id);
            setDocuments(prev => prev.filter(d => d.id !== id));
        } catch (error) {
            console.error('Delete failed:', error);
        }
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !user) return;

        try {
            setIsUploading(true);
            const path = `${user.id}/${Date.now()}_${file.name}`;
            const publicUrl = await storageService.uploadFile('documents', path, file);

            const newDoc: Partial<Document> & { url: string; userId: string } = {
                name: file.name,
                size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
                date: new Date().toLocaleDateString('fr-FR'),
                category: activeFilter === 'Tous' ? 'Identité' : activeFilter,
                type: file.type.includes('pdf') ? 'pdf' : 'image',
                status: 'pending',
                url: publicUrl,
                userId: user.id
            };

            const savedDoc = await documentsService.uploadDocument(newDoc);
            setDocuments(prev => [savedDoc, ...prev]);
        } catch (error) {
            console.error('Upload failed:', error);
            alert("Erreur lors de l'envoi du document.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto pb-24 space-y-8">
            {/* Header section */}
            <div className="flex justify-end items-center">
                <div className="flex gap-8 text-center pt-2">
                    <div>
                        <p className="text-2xl font-black text-[#0B84D8]">{documents.length}</p>
                        <p className="text-xs text-gray-500 font-medium">Fichiers</p>
                    </div>
                    <div>
                        <p className="text-2xl font-black text-emerald-500">{verifiedCount}</p>
                        <p className="text-xs text-gray-500 font-medium">Vérifiés</p>
                    </div>
                </div>
            </div>

            {/* Main Tabs */}
            <div className="flex border-b border-gray-100">
                <button
                    onClick={() => setActiveTab('mes-documents')}
                    className={`px-6 py-4 font-semibold text-sm transition-all relative ${activeTab === 'mes-documents' ? 'text-[#0B84D8]' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    <span className="flex items-center gap-2">
                        <FileText className="w-4 h-4" /> Mes documents
                    </span>
                    {activeTab === 'mes-documents' && (
                        <motion.div layoutId="activeTabDoc" className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-[#0B84D8]" />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('documents-requis')}
                    className={`px-6 py-4 font-semibold text-sm transition-all relative ${activeTab === 'documents-requis' ? 'text-[#0B84D8]' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    <span className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> Documents requis
                    </span>
                    {activeTab === 'documents-requis' && (
                        <motion.div layoutId="activeTabDoc" className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-[#0B84D8]" />
                    )}
                </button>
            </div>

            {/* Upload Area */}
            <div className="relative">
                <input 
                    type="file" 
                    id="doc-upload"
                    className="hidden" 
                    onChange={handleFileUpload}
                    disabled={isUploading}
                />
                <label 
                    htmlFor="doc-upload"
                    className={`border-2 border-dashed border-gray-200 rounded-3xl p-10 flex flex-col items-center justify-center bg-gray-50/50 hover:bg-blue-50/30 transition-colors group cursor-pointer ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <div className="w-16 h-16 rounded-full bg-blue-50 text-[#0B84D8] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        {isUploading ? <Loader2 className="w-8 h-8 animate-spin" /> : <Upload className="w-8 h-8" />}
                    </div>
                    <h3 className="text-lg font-bold text-[#1a2b40] mb-2">
                        {isUploading ? 'Chargement en cours...' : 'Glissez-déposez vos fichiers'}
                    </h3>
                    <p className="text-sm text-gray-500 mb-8 font-medium italic">
                        {isUploading ? 'Veuillez patienter' : 'ou cliquez pour parcourir • PDF, JPG, PNG • Max 10 MB'}
                    </p>
                    <div className="bg-[#0B84D8] text-white font-bold py-3 px-8 rounded-xl transition-all text-sm shadow-md flex items-center gap-2 hover:shadow-lg active:scale-95">
                        <span className="text-lg leading-none">+</span> Ajouter un fichier
                    </div>
                </label>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 pt-2 border-b border-gray-100 pb-6">
                {filters.map(filter => (
                    <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${activeFilter === filter
                            ? 'bg-[#0B84D8] text-white shadow-sm ring-2 ring-[#0B84D8]/20 ring-offset-1'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700'
                        }`}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            {/* Document List */}
            {loading ? (
                <div className="space-y-4 animate-pulse">
                    {[1,2,3].map(i => <div key={i} className="bg-gray-200 rounded-2xl h-20" />)}
                </div>
            ) : (
                <div className="space-y-4 pt-2">
                    {filteredDocs.map((doc, i) => (
                        <motion.div
                            key={doc.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-gray-100 shadow-sm hover:shadow-md hover:border-[#0B84D8]/30 transition-all group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-gray-50 text-gray-400">
                                    {doc.type === 'pdf' ? <FileText className="w-5 h-5 text-gray-500" /> : <ImageIcon className="w-5 h-5 text-gray-500" />}
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#1a2b40] text-sm sm:text-base group-hover:text-[#0B84D8] transition-colors">{doc.name}</h4>
                                    <div className="flex items-center gap-3 mt-1 text-xs font-medium">
                                        <span className="text-gray-500">{doc.size}</span>
                                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                        <span className="text-gray-500">{doc.date}</span>
                                        <span className="text-[#0B84D8] bg-blue-50/50 border border-blue-100 px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide">{doc.category}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100 w-full sm:w-auto mt-2 sm:mt-0">
                                {doc.status === 'verified' ? (
                                    <div className="flex items-center gap-1.5 px-3 py-1 text-emerald-600 text-[11px] font-bold uppercase tracking-wider">
                                        <CheckCircle2 className="w-4 h-4" /> Vérifié
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1.5 px-3 py-1 text-amber-500 text-[11px] font-bold uppercase tracking-wider">
                                        <Clock className="w-4 h-4" /> En attente
                                    </div>
                                )}

                                <div className="flex items-center gap-1">
                                    <button className="p-2.5 text-gray-400 hover:text-[#0B84D8] hover:bg-blue-50 rounded-lg transition-colors" aria-label="Aperçu">
                                        <Eye className="w-[18px] h-[18px]" />
                                    </button>
                                    <button className="p-2.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" aria-label="Télécharger">
                                        <Download className="w-[18px] h-[18px]" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(doc.id)}
                                        className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        aria-label="Supprimer"
                                    >
                                        <Trash2 className="w-[18px] h-[18px]" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
