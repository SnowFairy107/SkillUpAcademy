'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile } from '@/types';
import { DEMO_USER } from '@/lib/courses-data';
import { getStoredUser, setStoredUser } from '@/lib/course-store';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  loginDemo: (redirectPath?: string) => void;
  loginWithPassword: (
    email: string,
    password: string,
    redirectPath?: string
  ) => Promise<{ success: boolean; error?: string }>;
  signUpWithPassword: (
    email: string,
    password: string,
    fullName: string,
    redirectPath?: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // 1. Check local session first
    const localUser = getStoredUser();
    if (localUser) {
      setUser(localUser);
      setIsLoading(false);
      return;
    }

    // 2. Check Supabase auth session
    supabase.auth
      .getUser()
      .then(({ data: { user: authUser } }) => {
        if (authUser) {
          const profile: UserProfile = {
            id: authUser.id,
            full_name:
              authUser.user_metadata?.full_name ||
              authUser.email?.split('@')[0] ||
              'Learner',
            email: authUser.email || '',
            created_at: authUser.created_at,
          };
          setUser(profile);
          setStoredUser(profile);
        }
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [supabase]);

  const loginDemo = (redirectPath: string = '/courses') => {
    setUser(DEMO_USER);
    setStoredUser(DEMO_USER);
    router.push(redirectPath);
  };

  const loginWithPassword = async (
    email: string,
    password: string,
    redirectPath: string = '/courses'
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Fallback for demo credentials
        if (email.toLowerCase() === DEMO_USER.email.toLowerCase()) {
          loginDemo(redirectPath);
          return { success: true };
        }
        return { success: false, error: error.message };
      }

      if (data.user) {
        const profile: UserProfile = {
          id: data.user.id,
          full_name:
            data.user.user_metadata?.full_name ||
            data.user.email?.split('@')[0] ||
            'Learner',
          email: data.user.email || '',
          created_at: data.user.created_at,
        };
        setUser(profile);
        setStoredUser(profile);
        router.push(redirectPath);
        return { success: true };
      }
      return { success: false, error: 'User not found.' };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'An unexpected error occurred.',
      };
    }
  };

  const signUpWithPassword = async (
    email: string,
    password: string,
    fullName: string,
    redirectPath: string = '/courses'
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        const profile: UserProfile = {
          id: data.user.id,
          full_name: fullName || data.user.email?.split('@')[0] || 'Learner',
          email: data.user.email || '',
          created_at: data.user.created_at,
        };
        setUser(profile);
        setStoredUser(profile);
        router.push(redirectPath);
        return { success: true };
      }
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'An unexpected error occurred.',
      };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch {}
    setUser(null);
    setStoredUser(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        loginDemo,
        loginWithPassword,
        signUpWithPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
