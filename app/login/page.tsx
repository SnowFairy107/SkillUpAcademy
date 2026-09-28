'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { DEMO_USER } from '@/lib/courses-data';
import {
  Sparkles,
  Lock,
  Mail,
  User,
  ArrowRight,
  Zap,
  AlertCircle,
  Compass,
  CheckCircle2,
} from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/courses';
  const initialTab = searchParams.get('tab') === 'signup' ? 'signup' : 'login';

  const { loginWithPassword, signUpWithPassword, loginDemo, isLoading } = useAuth();
  const [tab, setTab] = useState<'login' | 'signup'>(initialTab);

  const [email, setEmail] = useState('alex.learner@example.com');
  const [password, setPassword] = useState('Password123!');
  const [fullName, setFullName] = useState('Alex Johnson');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);

    if (tab === 'login') {
      const res = await loginWithPassword(email, password, redirectPath);
      if (!res.success) {
        setErrorMsg(res.error || 'Invalid email or password.');
      }
    } else {
      if (!fullName.trim()) {
        setErrorMsg('Please enter your full name.');
        setIsSubmitting(false);
        return;
      }
      const res = await signUpWithPassword(email, password, fullName, redirectPath);
      if (!res.success) {
        setErrorMsg(res.error || 'Failed to create account.');
      } else {
        setSuccessMsg('Account created successfully! Redirecting...');
      }
    }
    setIsSubmitting(false);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-4 bg-zinc-50/60 dark:bg-zinc-950/60">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-7 shadow-lg dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
        {/* Brand Header */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
            <Sparkles className="h-6 w-6" />
          </div>
          <h1 className="mt-3.5 text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            {tab === 'login' ? 'Welcome Back to SkillUp' : 'Create Learner Account'}
          </h1>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            {tab === 'login'
              ? 'Sign in to access your courses and enroll in upcoming cohorts.'
              : 'Join SkillUp Academy to start learning from expert mentors.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="mt-6 flex rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800">
          <button
            type="button"
            onClick={() => {
              setTab('login');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${
              tab === 'login'
                ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-900 dark:text-zinc-50'
                : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('signup');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${
              tab === 'signup'
                ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-900 dark:text-zinc-50'
                : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-700 dark:bg-red-950/50 dark:text-red-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
          {tab === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Full Name
              </label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alex Johnson"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50/60 py-2.5 pl-9 pr-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-100"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Email Address
            </label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/60 py-2.5 pl-9 pr-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Password
            </label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/60 py-2.5 pl-9 pr-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-100"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-md shadow-blue-500/20 transition-all hover:bg-blue-700 hover:shadow-lg disabled:opacity-50"
          >
            {isSubmitting
              ? 'Processing...'
              : tab === 'login'
              ? 'Sign In to Account'
              : 'Create Account & Continue'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* 1-Click Instant Demo Login */}
        <div className="mt-5 border-t border-zinc-100 pt-4 dark:border-zinc-800">
          <button
            type="button"
            onClick={() => loginDemo(redirectPath)}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-amber-300/80 bg-amber-50/90 py-2.5 text-xs font-bold text-amber-900 transition-colors hover:bg-amber-100 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300"
          >
            <Zap className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            1-Click Instant Learner Demo ({DEMO_USER.full_name})
          </button>
        </div>

        {/* Browse as Guest link */}
        <div className="mt-4 text-center">
          <Link
            href="/courses"
            className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            <Compass className="h-3.5 w-3.5" />
            Just exploring? Continue browsing courses as guest
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-sm text-zinc-500">Loading authentication...</p>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
