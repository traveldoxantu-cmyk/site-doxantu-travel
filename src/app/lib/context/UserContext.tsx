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
        await syncUserFromSession(session.user.id, session.user.email || '');
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
    // Optimisation : Si l'utilisateur est déjà chargé et identique, on ne fait rien
    if (user && user.id === userId && user.firstName) {
      return;
    }

    // Essayer de récupérer le profil depuis Supabase
    try {
      const { data: profile } = await supabase!
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profile) {
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
        return;
      }
    } catch {
      // Profil non trouvé — fallback sur les métadonnées auth
    }

    // Fallback : métadonnées Supabase Auth
    const { data: { user: authUser } } = await supabase!.auth.getUser();
    if (authUser) {
      const firstName = authUser.user_metadata?.first_name || '';
      const lastName = authUser.user_metadata?.last_name || '';
      const userObj: User = {
        id: userId,
        email,
        firstName,
        lastName,
        role: 'client',
        initiales: (firstName[0] || 'U') + (lastName[0] || ''),
      };
      localStorage.setItem('user', JSON.stringify(userObj));
      setUserState(userObj);
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
