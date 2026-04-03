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
    try {
      // 0. Récupération des données Auth Session (métadonnées prédictives)
      // Cela nous donne instantanément un nom/prénom même si le profil n'est pas encore prêt.
      const { data: { user: authUser }, error: authError } = await supabase!.auth.getUser();
      
      if (authError) throw authError;

      const predictiveProfile: Partial<User> = {
        id: userId,
        email,
        firstName: authUser?.user_metadata?.first_name || authUser?.user_metadata?.full_name?.split(' ')[0] || 'Ami',
        lastName: authUser?.user_metadata?.last_name || authUser?.user_metadata?.full_name?.split(' ').slice(1).join(' ') || 'Doxantu',
        role: (authUser?.user_metadata?.role as 'client' | 'admin') || 'client',
        initiales: (authUser?.user_metadata?.first_name?.[0] || authUser?.user_metadata?.full_name?.[0] || 'U').toUpperCase()
      };

      // 1. Priorité extrême au localStorage pour un affichage instantané
      const stored = localStorage.getItem('user');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.id === userId) {
          setUserState(parsed);
        }
      } else {
        // Si rien en cache, utiliser le profil prédictif pour éviter l'écran blanc
        setUserState(predictiveProfile as User);
      }

      // 2. Récupération asynchrone sécurisée du profil complet depuis la table 'profiles'
      // Utilisation d'un bloc try-catch isolé pour ne pas bloquer l'auth si le profil échoue
      try {
        const { data: profile, error: profileError } = await supabase!
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (profile && !profileError) {
          const userObj: User = {
            id: userId,
            email,
            firstName: profile.prenom || (predictiveProfile.firstName as string),
            lastName: profile.nom || (predictiveProfile.lastName as string),
            phone: profile.tel,
            role: (profile.role as 'client' | 'admin') || (predictiveProfile.role as 'client' | 'admin'),
            initiales: profile.initiales || (profile.prenom?.[0] || 'U') + (profile.nom?.[0] || ''),
          };
          localStorage.setItem('user', JSON.stringify(userObj));
          setUserState(userObj);
        } else if (profileError) {
          console.warn("[UserContext] Problème récupération profil (table absente ou err):", profileError);
          // On reste sur le profil prédictif déjà configuré au dessus
        }
      } catch (innerErr) {
        console.warn("[UserContext] Erreur lors de la lecture de la table profil:", innerErr);
        // Fallback déjà géré par setUserState(predictiveProfile) plus haut
      }
    } catch (err) {
      console.error("[UserContext] Erreur fatale sync session:", err);
      // En dernier recours, reset si on ne peut même pas avoir l'auth user
      if (!localStorage.getItem('user')) {
        setUserState(null);
      }
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
