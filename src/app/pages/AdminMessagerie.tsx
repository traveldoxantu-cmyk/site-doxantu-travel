import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Send, Paperclip, CheckCheck, Smile, Phone, Video, Loader2, User, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { messagerieService, type Conversation, type Message } from '../lib/services/messagerieService';
import { useUser } from '../lib/context/UserContext';

export function AdminMessagerie() {
    const { user } = useUser();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [activeConv, setActiveConv] = useState<Conversation | null>(null);
    const [loading, setLoading] = useState(true);
    const [inputText, setInputText] = useState('');
    const [sending, setSending] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (!user) return;
        
        // Fetch ALL conversations for admin
        messagerieService.getConversations(true)
            .then(convs => {
                setConversations(convs);
                if (convs.length > 0) {
                    setActiveConv(convs[0]);
                }
            })
            .catch(err => {
                console.error("Erreur messagerie admin:", err);
                toast.error("Impossible de charger les conversations.");
            })
            .finally(() => setLoading(false));
    }, [user]);

    useEffect(() => {
        if (!activeConv) return;
        
        // Load messages for selected conversation
        messagerieService.getMessages(activeConv.id)
            .then(setMessages)
            .catch(console.error);

        // Subscribe to real-time updates
        const subscription = messagerieService.subscribeToMessages(activeConv.id, (newMsg) => {
            setMessages(prev => {
                if (prev.some(m => m.id === newMsg.id)) return prev;
                return [...prev, newMsg];
            });
        });

        return () => {
            subscription?.unsubscribe();
        };
    }, [activeConv]);

    const filteredConversations = conversations.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="h-[calc(100vh-140px)] flex flex-col items-center justify-center bg-white rounded-[32px] border border-gray-100 p-10">
                <Loader2 className="w-10 h-10 text-[#0B84D8] animate-spin mb-4" />
                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Chargement de la centrale de messagerie...</p>
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-140px)] flex bg-white rounded-[40px] border border-gray-100 shadow-xl shadow-blue-900/5 overflow-hidden relative">
            {/* Sidebar: All Client Conversations */}
            <div className={`w-full md:w-96 border-r border-gray-100 flex flex-col ${activeConv && 'hidden md:flex'}`}>
                <div className="p-8 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-black text-[#1a2b40] tracking-tight">Messages</h1>
                        <button className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 text-gray-400 hover:text-[#0B84D8] transition-all">
                            <Filter className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Rechercher un client..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white border border-gray-100 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium focus:ring-4 focus:ring-blue-50 focus:border-[#0B84D8]/30 transition-all outline-none"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {filteredConversations.length === 0 ? (
                        <div className="text-center py-10 px-6">
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Aucune discussion trouvée</p>
                        </div>
                    ) : (
                        filteredConversations.map((conv) => (
                            <div
                                key={conv.id}
                                onClick={() => setActiveConv(conv)}
                                className={`p-4 flex gap-4 cursor-pointer transition-all rounded-3xl relative ${activeConv?.id === conv.id ? 'bg-[#0B84D8] text-white shadow-lg shadow-blue-200' : 'hover:bg-gray-50 text-gray-600'}`}
                            >
                                <div className="relative shrink-0">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg shadow-sm ${activeConv?.id === conv.id ? 'bg-white/20' : 'bg-blue-50 text-[#0B84D8]'}`}>
                                        {conv.avatar || conv.name[0]}
                                    </div>
                                    {conv.online && (
                                        <div className="absolute -right-1 -bottom-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0 py-1">
                                    <div className="flex justify-between items-center mb-1">
                                        <h3 className={`font-black text-sm truncate ${activeConv?.id === conv.id ? 'text-white' : 'text-[#1a2b40]'}`}>
                                            {conv.name}
                                        </h3>
                                        <span className={`text-[10px] font-bold ${activeConv?.id === conv.id ? 'text-white/70' : 'text-gray-400'}`}>
                                            {conv.time}
                                        </span>
                                    </div>
                                    <p className={`text-xs truncate font-medium ${activeConv?.id === conv.id ? 'text-white/80' : 'text-gray-500'}`}>
                                        {conv.lastMessage}
                                    </p>
                                </div>
                                {conv.unread > 0 && activeConv?.id !== conv.id && (
                                    <div className="absolute right-6 bottom-6 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-lg">
                                        {conv.unread}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Area */}
            {activeConv ? (
                <div className="flex-1 flex flex-col bg-gray-50/20 shadow-inner">
                    {/* Chat Header */}
                    <div className="px-8 h-24 bg-white border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-5">
                            <div className="w-12 h-12 rounded-2xl bg-[#0B84D8] text-white flex items-center justify-center font-black text-sm shadow-lg shadow-blue-100">
                                {activeConv.avatar || activeConv.name[0]}
                            </div>
                            <div>
                                <h2 className="font-black text-[#1a2b40] text-lg">{activeConv.name}</h2>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">En ligne • Client Doxantu</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="p-3 text-gray-400 hover:text-[#0B84D8] hover:bg-blue-50 rounded-2xl transition-all">
                                <Phone className="w-5 h-5" />
                            </button>
                            <button className="p-3 text-gray-400 hover:text-[#0B84D8] hover:bg-blue-50 rounded-2xl transition-all">
                                <Video className="w-5 h-5" />
                            </button>
                            <button className="p-3 text-gray-400 hover:text-[#0B84D8] hover:bg-blue-50 rounded-2xl transition-all">
                                <User className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Messages Container */}
                    <div className="flex-1 overflow-y-auto p-8 space-y-6">
                        {messages.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-30 grayscale scale-110">
                                <Search className="w-16 h-16 mb-4" />
                                <p className="font-black uppercase tracking-[0.2em] text-xs">Historique vide</p>
                            </div>
                        ) : (
                            messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className="max-w-[70%]">
                                        <div className={`p-4 rounded-[28px] text-sm font-bold shadow-sm ${msg.senderId === user?.id
                                            ? 'bg-[#0B84D8] text-white rounded-tr-none'
                                            : 'bg-white text-[#1a2b40] border border-gray-100 rounded-tl-none'
                                        }`}>
                                            {msg.text}
                                        </div>
                                        <div className={`flex items-center gap-2 mt-2 ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}>
                                            <span className="text-[10px] text-gray-400 font-bold">{msg.time}</span>
                                            {msg.senderId === user?.id && (
                                                <CheckCheck className="w-3.5 h-3.5 text-blue-400" />
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-8 bg-white border-t border-gray-100">
                        <form 
                            onSubmit={async (e) => {
                                e.preventDefault();
                                if (!inputText.trim() || !activeConv || sending || !user) return;
                                
                                setSending(true);
                                try {
                                    const newMsg = await messagerieService.sendMessage({
                                        conversationId: activeConv.id,
                                        text: inputText,
                                        senderId: user.id,
                                        status: 'unread'
                                    });
                                    setMessages(prev => [...prev, newMsg]);
                                    setInputText('');
                                } catch (err) {
                                    console.error('Send failed:', err);
                                    toast.error("Échec de l'envoi.");
                                } finally {
                                    setSending(false);
                                }
                            }}
                            className="flex items-center gap-4 bg-gray-50 rounded-[32px] px-6 py-3 border-2 border-transparent focus-within:border-[#0B84D8]/20 focus-within:bg-white transition-all shadow-sm"
                        >
                            <button type="button" className="p-2 text-gray-400 hover:text-[#0B84D8] transition-colors">
                                <Smile className="w-6 h-6" />
                            </button>
                            <button type="button" className="p-2 text-gray-400 hover:text-[#0B84D8] transition-colors">
                                <Paperclip className="w-6 h-6" />
                            </button>
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="Répondre au client..."
                                className="flex-1 bg-transparent border-none py-4 outline-none text-sm font-bold text-[#1a2b40] placeholder:text-gray-400"
                            />
                            <button 
                                type="submit"
                                disabled={sending || !inputText.trim()}
                                className="w-14 h-14 bg-[#0B84D8] text-white rounded-2xl shadow-xl shadow-blue-500/20 flex items-center justify-center hover:scale-110 active:scale-95 transition-all shrink-0 disabled:opacity-50 disabled:scale-100"
                            >
                                {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 fill-white" />}
                            </button>
                        </form>
                    </div>
                </div>
            ) : (
                <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-gray-50/30 p-10 text-center">
                    <div className="w-24 h-24 bg-white rounded-[40px] flex items-center justify-center shadow-xl shadow-blue-900/5 mb-6 text-gray-200">
                        <Send className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-black text-[#1a2b40] mb-2 tracking-tight">Espace de Communication</h3>
                    <p className="max-w-xs text-xs text-gray-400 font-bold uppercase tracking-widest leading-loose">
                        Sélectionnez une conversation dans la liste de gauche pour échanger avec vos clients en direct.
                    </p>
                </div>
            )}
        </div>
    );
}
