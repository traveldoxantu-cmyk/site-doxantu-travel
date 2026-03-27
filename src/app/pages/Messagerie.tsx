import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Send, Paperclip, MoreVertical, CheckCheck, Smile, Phone, Video, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { messagerieService, type Conversation, type Message } from '../lib/services/messagerieService';

export function Messagerie() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [activeConv, setActiveConv] = useState<Conversation | null>(null);
    const [loading, setLoading] = useState(true);
    const [inputText, setInputText] = useState('');
    const [sending, setSending] = useState(false);

    useEffect(() => {
        messagerieService.getConversations()
            .then(convs => {
                if (convs.length > 0) {
                    setConversations(convs);
                    setActiveConv(convs[0]);
                } else {
                    // Fallback Welcome Conversation
                    const welcomeConv: Conversation = {
                        id: 'welcome-conv',
                        name: 'Support Doxantu',
                        role: 'ASSISTANCE 24/7',
                        avatar: 'DX',
                        lastMessage: 'Bienvenue chez Doxantu Travel ! Comment pouvons-nous vous aider ?',
                        time: 'Maintenant',
                        unread: 1,
                        online: true
                    };
                    setConversations([welcomeConv]);
                    setActiveConv(welcomeConv);
                    setMessages([{
                        id: 'welcome-msg',
                        conversationId: 'welcome-conv',
                        senderId: 'support',
                        text: 'Bonjour ! Bienvenue chez Doxantu Travel. Votre espace est maintenant prêt. Vous pouvez nous poser vos questions ici.',
                        time: 'Maintenant',
                        status: 'unread'
                    }]);
                }
            })
            .catch(err => {
                console.error("Erreur messagerie:", err);
                setLoading(false);
            })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (!activeConv) return;
        messagerieService.getMessages(activeConv.id)
            .then(setMessages)
            .catch(console.error);
    }, [activeConv]);

    if (loading) {
        return (
            <div className="h-[calc(100vh-180px)] bg-gray-200 rounded-3xl animate-pulse" />
        );
    }

    return (
        <div className="h-[calc(100vh-180px)] flex bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden relative">
            {/* Sidebar List */}
            <div className={`w-full md:w-80 border-r border-gray-100 flex flex-col ${activeConv && 'hidden md:flex'}`}>
                <div className="p-6 border-b border-gray-100">
                    <h1 className="text-xl font-bold text-[#1a2b40] mb-4">Messagerie</h1>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            className="w-full bg-gray-50 border-none rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#0B84D8]/20 transition-all outline-none"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {conversations.map((conv) => (
                        <div
                            key={conv.id}
                            onClick={() => setActiveConv(conv)}
                            className={`p-4 flex gap-4 cursor-pointer transition-colors relative ${activeConv?.id === conv.id ? 'bg-[#F0F8FF]' : 'hover:bg-gray-50'}`}
                        >
                            {activeConv?.id === conv.id && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#0B84D8]" />
                            )}
                            <div className="relative">
                                <div className="w-12 h-12 rounded-xl bg-[#0B84D8] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                                    {conv.avatar}
                                </div>
                                {conv.online && (
                                    <div className="absolute -right-1 -bottom-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-1">
                                    <h3 className="font-bold text-[#1a2b40] text-sm truncate">{conv.name}</h3>
                                    <span className="text-[10px] text-gray-400 font-medium">{conv.time}</span>
                                </div>
                                <p className="text-xs text-gray-500 truncate leading-relaxed">{conv.lastMessage}</p>
                            </div>
                            {conv.unread > 0 && (
                                <div className="flex items-center">
                                    <span className="w-5 h-5 bg-[#0B84D8] text-white text-[10px] font-black rounded-full flex items-center justify-center">
                                        {conv.unread}
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            {activeConv ? (
                <div className={`flex-1 flex flex-col bg-gray-50/30 ${!activeConv && 'hidden md:flex'}`}>
                    {/* Chat Header */}
                    <div className="px-4 md:px-8 h-20 bg-white border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-3 md:gap-4">
                            {/* Back button on mobile */}
                            <button 
                                onClick={() => setActiveConv(null)}
                                className="md:hidden p-2 -ml-2 text-gray-400 hover:text-[#0B84D8] transition-colors"
                            >
                                <Search className="w-5 h-5 rotate-90" /> {/* Symbol for back */}
                            </button>
                            <div className="w-10 h-10 rounded-xl bg-[#0B84D8] text-white flex items-center justify-center font-bold text-xs shadow-sm shrink-0">
                                {activeConv.avatar}
                            </div>
                            <div className="min-w-0">
                                <h2 className="font-bold text-[#1a2b40] truncate text-sm md:text-base">{activeConv.name}</h2>
                                <p className="text-[10px] md:text-[11px] text-[#0B84D8] font-bold uppercase tracking-wider">{activeConv.role}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 md:gap-3">
                            <button className="p-2 text-gray-400 hover:text-[#0B84D8] transition-all hidden sm:block">
                                <Phone className="w-5 h-5" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-[#0B84D8] transition-all hidden sm:block">
                                <Video className="w-5 h-5" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-[#0B84D8] transition-all">
                                <MoreVertical className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Messages Container */}
                    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-4 md:space-y-6">
                        <div className="flex justify-center">
                            <span className="px-4 py-1.5 bg-gray-100 text-gray-500 text-[10px] md:text-[11px] font-bold rounded-full uppercase tracking-widest">Aujourd'hui</span>
                        </div>

                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className="max-w-[85%] md:max-w-[70%]">
                                    <div className={`p-3 md:p-4 rounded-2xl shadow-sm text-xs md:text-sm ${msg.senderId === 'me'
                                        ? 'bg-[#0B84D8] text-white rounded-tr-none'
                                        : 'bg-white text-[#333] border border-gray-100 rounded-tl-none'
                                    }`}>
                                        {msg.text}
                                    </div>
                                    <div className={`flex items-center gap-1.5 mt-2 ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}>
                                        <span className="text-[10px] text-gray-400 font-medium">{msg.time}</span>
                                        {msg.senderId === 'me' && (
                                            <CheckCheck className="w-3.5 h-3.5 text-blue-400" />
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Input Area */}
                    <form 
                        onSubmit={async (e) => {
                            e.preventDefault();
                            if (!inputText.trim() || !activeConv || sending) return;
                            
                            setSending(true);
                            try {
                                const newMsg = await messagerieService.sendMessage({
                                    conversationId: activeConv.id,
                                    text: inputText,
                                    senderId: 'me',
                                    time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
                                    status: 'unread'
                                });
                                setMessages(prev => [...prev, newMsg]);
                                setInputText('');
                            } catch (err) {
                                console.error('Send failed:', err);
                                toast.error("Échec de l'envoi du message.");
                            } finally {
                                setSending(false);
                            }
                        }}
                        className="p-4 md:p-6 bg-white border-t border-gray-100"
                    >
                        <div className="flex items-center gap-2 md:gap-4 bg-gray-50 rounded-2xl px-3 md:px-4 py-1.5 md:py-2 border border-gray-100 focus-within:border-[#0B84D8]/30 transition-all shadow-sm">
                            <button type="button" className="p-2 text-gray-400 hover:text-[#0B84D8] transition-colors hidden sm:block">
                                <Smile className="w-5 h-5" />
                            </button>
                            <button type="button" className="p-2 text-gray-400 hover:text-[#0B84D8] transition-colors">
                                <Paperclip className="w-5 h-5" />
                            </button>
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="Message..."
                                className="flex-1 bg-transparent border-none py-2 md:py-3 outline-none text-xs md:text-sm text-[#1a2b40] placeholder:text-gray-400"
                            />
                            <button 
                                type="submit"
                                disabled={sending || !inputText.trim()}
                                className="w-9 h-9 md:w-10 md:h-10 bg-[#0B84D8] text-white rounded-xl shadow-md flex items-center justify-center hover:scale-105 transition-transform shrink-0 disabled:opacity-50 disabled:scale-100"
                            >
                                {sending ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Send className="w-4 h-4 fill-white" />
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50/20 text-gray-400 font-medium">
                    Sélectionnez une conversation pour commencer
                </div>
            )}
        </div>
    );
}
