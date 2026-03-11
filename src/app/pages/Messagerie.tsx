import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Send, Paperclip, MoreVertical, CheckCheck, Smile, Phone, Video } from 'lucide-react';

const conversations = [
    {
        id: 1,
        name: 'Fatou Mbaye',
        role: 'Conseiller Doxantu',
        avatar: 'FM',
        lastMessage: 'Votre dossier avance très bien ! N\'oubliez pas votre...',
        time: '14:20',
        unread: 2,
        online: true
    },
    {
        id: 2,
        name: 'Service Visa',
        role: 'Support Technique',
        avatar: 'SV',
        lastMessage: 'Les documents ont été validés par l\'ambassade.',
        time: 'Hier',
        unread: 0,
        online: false
    },
    {
        id: 3,
        name: 'Amadou Diallo',
        role: 'Étudiant',
        avatar: 'AD',
        lastMessage: 'Merci pour votre aide !',
        time: 'Lundi',
        unread: 0,
        online: true
    }
];

const messages = [
    { id: 1, senderId: 1, text: "Bonjour Amadou, comment allez-vous ?", time: "10:00", status: "read" },
    { id: 2, senderId: 'me', text: "Bonjour Fatou, ça va très bien merci. Et vous ?", time: "10:05", status: "read" },
    { id: 3, senderId: 1, text: "Très bien ! Je voulais vous informer que votre entretien Campus France a été confirmé pour le 7 mars.", time: "10:10", status: "read" },
    { id: 4, senderId: 1, text: "N'oubliez pas d'apporter tous vos originaux.", time: "10:11", status: "read" },
    { id: 5, senderId: 'me', text: "C'est noté, j'ai déjà tout préparé. Est-ce que j'ai besoin d'amener les traductions ?", time: "10:15", status: "read" },
    { id: 6, senderId: 1, text: "Oui, c'est indispensable pour les relevés de notes.", time: "10:20", status: "read" },
];

export function Messagerie() {
    const [activeConv, setActiveConv] = useState(conversations[0]);

    return (
        <div className="h-[calc(100vh-180px)] flex bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Sidebar List */}
            <div className="w-80 border-r border-gray-100 flex flex-col">
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
                            className={`p-4 flex gap-4 cursor-pointer transition-colors relative ${activeConv.id === conv.id ? 'bg-[#F0F8FF]' : 'hover:bg-gray-50'
                                }`}
                        >
                            {activeConv.id === conv.id && (
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
            <div className="flex-1 flex flex-col bg-gray-50/30">
                {/* Chat Header */}
                <div className="px-8 h-20 bg-white border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[#0B84D8] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                            {activeConv.avatar}
                        </div>
                        <div>
                            <h2 className="font-bold text-[#1a2b40]">{activeConv.name}</h2>
                            <p className="text-[11px] text-[#0B84D8] font-bold uppercase tracking-wider">{activeConv.role}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="p-2.5 text-gray-400 hover:text-[#0B84D8] hover:bg-gray-50 rounded-xl transition-all">
                            <Phone className="w-5 h-5" />
                        </button>
                        <button className="p-2.5 text-gray-400 hover:text-[#0B84D8] hover:bg-gray-50 rounded-xl transition-all">
                            <Video className="w-5 h-5" />
                        </button>
                        <button className="p-2.5 text-gray-400 hover:text-[#0B84D8] hover:bg-gray-50 rounded-xl transition-all">
                            <MoreVertical className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto p-8 space-y-6">
                    <div className="flex justify-center">
                        <span className="px-4 py-1.5 bg-gray-100 text-gray-500 text-[11px] font-bold rounded-full uppercase tracking-widest">Aujourd'hui</span>
                    </div>

                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[70%] ${msg.senderId === 'me' ? 'order-1' : 'order-1'}`}>
                                <div className={`p-4 rounded-2xl shadow-sm text-sm ${msg.senderId === 'me'
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
                <div className="p-6 bg-white border-t border-gray-100">
                    <div className="flex items-center gap-4 bg-gray-50 rounded-2xl px-4 py-2 border border-gray-100 focus-within:border-[#0B84D8]/30 transition-all shadow-sm">
                        <button className="p-2 text-gray-400 hover:text-[#0B84D8] transition-colors">
                            <Smile className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-[#0B84D8] transition-colors">
                            <Paperclip className="w-5 h-5" />
                        </button>
                        <input
                            type="text"
                            placeholder="Écrivez votre message..."
                            className="flex-1 bg-transparent border-none py-3 outline-none text-sm text-[#1a2b40] placeholder:text-gray-400"
                        />
                        <button className="w-10 h-10 bg-[#0B84D8] text-white rounded-xl shadow-md flex items-center justify-center hover:scale-105 transition-transform">
                            <Send className="w-4 h-4 fill-white" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
