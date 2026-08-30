import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export type Role = 'worker' | 'participant';

export type Profile = { id: string; full_name: string; role: Role };

type WorkerSignUpExtra = { role: 'worker'; bio?: string; skills?: string[] };
type ParticipantSignUpExtra = { role: 'participant'; suburb: string; bio: string };
export type SignUpExtra = WorkerSignUpExtra | ParticipantSignUpExtra;

type AuthContextValue = {
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName: string, extra: SignUpExtra) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (userId: string) => {
    const { data } = await supabase.from('profiles').select('id, full_name, role').eq('id', userId).maybeSingle();
    setProfile((data as Profile) ?? null);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session);
      if (data.session) await loadProfile(data.session.user.id);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, next) => {
      setSession(next);
      if (next) await loadProfile(next.user.id);
      else setProfile(null);
    });
    return () => sub.subscription.unsubscribe();
  }, [loadProfile]);

  const signIn: AuthContextValue['signIn'] = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  };

  const signUp: AuthContextValue['signUp'] = async (email, password, fullName, extra) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { error: error.message };
    const userId = data.user?.id;
    if (!userId) return { error: null };

    const { error: profileError } = await supabase
      .from('profiles')
      .insert({ id: userId, full_name: fullName, role: extra.role });
    if (profileError) return { error: profileError.message };

    if (extra.role === 'worker') {
      const { error: workerError } = await supabase.from('worker_profiles').insert({
        profile_id: userId,
        name: fullName,
        category: 'General support',
        availability: 'Flexible',
        bio: extra.bio ?? '',
        skills: extra.skills ?? [],
      });
      if (workerError) return { error: workerError.message };
    } else {
      const { error: participantError } = await supabase.from('participants').insert({
        profile_id: userId,
        name: fullName,
        suburb: extra.suburb,
        bio: extra.bio,
      });
      if (participantError) return { error: participantError.message };
    }

    // signUp() above doesn't update local state via onAuthStateChange until
    // the session is actually set — load the profile now so role-based
    // navigation has it immediately after this call resolves.
    await loadProfile(userId);
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, profile, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
