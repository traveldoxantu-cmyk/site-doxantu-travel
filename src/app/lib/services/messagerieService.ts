import { supabase } from '../supabase';

export interface Conversation {
    id: string;
    name: string;
    role: string;
    avatar: string;
    lastMessage: string;
    time: string;
    unread: number;
    online: boolean;
    userId?: string;
}

export interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    text: string;
    time: string;
    status: 'read' | 'unread';
    createdAt?: string;
}

export const messagerieService = {
    getConversations: async (isAdmin = false, userId?: string) => {
        if (!supabase) return [];
        let query = supabase.from('conversations').select('*');
        
        if (!isAdmin && userId) {
            query = query.eq('user_id', userId);
        }
        
        const { data, error } = await query.order('time', { ascending: false });
        if (error) throw error;
        return data as Conversation[];
    },

    getMessages: async (conversationId: string) => {
        if (!supabase) return [];
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', conversationId)
            .order('created_at', { ascending: true });
            
        if (error) throw error;
        return data as Message[];
    },

    sendMessage: async (msg: Partial<Message>) => {
        if (!supabase) throw new Error("Supabase non configuré");
        const { data, error } = await supabase
            .from('messages')
            .insert([{
                conversation_id: msg.conversationId,
                sender_id: msg.senderId,
                text: msg.text,
                time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
                status: 'unread'
            }])
            .select()
            .single();
            
        if (error) throw error;

        // Mise à jour de la conversation (dernier message)
        await supabase
            .from('conversations')
            .update({ 
                last_message: msg.text, 
                time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) 
            })
            .eq('id', msg.conversationId);

        return data as Message;
    },

    subscribeToMessages: (conversationId: string, onMessage: (msg: Message) => void) => {
        if (!supabase) return null;
        return supabase
            .channel(`room-${conversationId}`)
            .on('postgres_changes', { 
                event: 'INSERT', 
                schema: 'public', 
                table: 'messages',
                filter: `conversation_id=eq.${conversationId}`
            }, payload => {
                onMessage(payload.new as Message);
            })
            .subscribe();
    }
};
