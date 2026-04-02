import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'client' | 'admin';
  initiales: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Source de vérité : Supabase Auth
    const initAuth = async () => {
      if (!supabase) {
        // Fallback localStorage si supabase non init
        const stored = localStorage.getItem('user');
        if (stored) setUserState(JSON.parse(stored));
        setLoading(false);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Chargement PARALLÈLE : On ne met plus d'await ici
        syncUserFromSession(session.user.id, session.user.email || '');
      } else {
        // Nettoyage si session expirée
        localStorage.removeItem('user');
        setUserState(null);
      }
      setLoading(false);
    };

    initAuth();

    // Écouter les changements d'état d'auth en temps réel
    const { data: { subscription } } = supabase?.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // Optimisation : Ne pas resynchroniser inutilement sur chaque événement mineur
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
          await syncUserFromSession(session.user.id, session.user.email || '');
        }
      } else if (event === 'SIGNED_OUT') {
        localStorage.removeItem('user');
        setUserState(null);
      }
    }) ?? { data: { subscription: { unsubscribe: () => {} } } };

    return () => subscription.unsubscribe();
  }, []);

  const syncUserFromSession = async (userId: string, email: string) => {
    // 1. Priorité au localStorage pour un affichage instantané
    const stored = localStorage.getItem('user');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.id === userId && parsed.firstName) {
        setUserState(parsed);
      }
    }

    // 2. Récupération asynchrone (NE BLOQUE PAS l'UI)
    try {
      const { data: profile, error } = await supabase!
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profile && !error) {
        const userObj: User = {
          id: userId,
          email,
          firstName: profile.prenom || '',
          lastName: profile.nom || '',
          phone: profile.tel,
          role: (profile.role as 'client' | 'admin') || 'client',
          initiales: profile.initiales || (profile.prenom?.[0] || 'U') + (profile.nom?.[0] || ''),
        };
        localStorage.setItem('user', JSON.stringify(userObj));
        setUserState(userObj);
      } else {
        // Fallback métadonnées si profil pas encore créé (cas inscription ultra-rapide)
        const { data: { user: authUser } } = await supabase!.auth.getUser();
        if (authUser) {
           const userObj: User = {
            id: userId,
            email,
            firstName: authUser.user_metadata?.first_name || 'Utilisateur',
            lastName: authUser.user_metadata?.last_name || '',
            role: (authUser.user_metadata?.role as 'client' | 'admin') || 'client',
            initiales: (authUser.user_metadata?.first_name?.[0] || 'U')
          };
          setUserState(userObj);
        }
      }
    } catch (err) {
      console.warn("[UserContext] Erreur récup profil (silencieuse):", err);
    }
  };

  const setUser = (user: User | null) => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
    setUserState(user);
  };

  const logout = async () => {
    await supabase?.auth.signOut();
    localStorage.removeItem('user');
    setUserState(null);
    window.location.href = '/';
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
