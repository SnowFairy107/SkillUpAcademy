'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Sparkles,
  BookOpen,
  GraduationCap,
  LogIn,
  LogOut,
  User,
  Menu,
  X,
  Compass,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hide navbar on login page only if preferred, or keep it visible
  const isAuthPage = pathname === '/login' || pathname === '/signup';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 bg-white/95 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/95">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 font-bold text-xl tracking-tight text-zinc-900 transition-colors hover:text-blue-600 dark:text-zinc-50 dark:hover:text-blue-400"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-sm shadow-blue-500/20">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="leading-tight">SkillUp Academy</span>
            <span className="text-[10px] font-medium tracking-normal text-zinc-400 dark:text-zinc-500">
              Training & Skills
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5">
          <Link
            href="/"
            className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
              pathname === '/'
                ? 'bg-zinc-100 text-blue-600 dark:bg-zinc-900 dark:text-blue-400 font-semibold'
                : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            Home
          </Link>

          <Link
            href="/courses"
            className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
              pathname === '/courses' || pathname.startsWith('/courses/')
                ? 'bg-zinc-100 text-blue-600 dark:bg-zinc-900 dark:text-blue-400 font-semibold'
                : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            Courses Catalog
          </Link>

          {user && (
            <Link
              href="/my-courses"
              className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                pathname === '/my-courses'
                  ? 'bg-zinc-100 text-blue-600 dark:bg-zinc-900 dark:text-blue-400 font-semibold'
                : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              My Enrolled Courses
            </Link>
          )}
        </nav>

        {/* Right Action / Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/my-courses"
                className="flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 py-1.5 px-3.5 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800"
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                  {user.full_name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                  {user.full_name}
                </span>
              </Link>
              <button
                onClick={logout}
                title="Log out"
                className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-600 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-red-950/30 dark:hover:text-red-400"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-lg px-3.5 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/login?tab=signup"
                className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow"
              >
                <LogIn className="h-3.5 w-3.5" />
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          {user && (
            <Link
              href="/my-courses"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white"
            >
              {user.full_name?.charAt(0).toUpperCase() || 'U'}
            </Link>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg border border-zinc-200 p-2 text-zinc-600 dark:border-zinc-800 dark:text-zinc-300"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-200 bg-white px-4 py-4 dark:border-zinc-800 dark:bg-zinc-950 space-y-2">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
          >
            Home
          </Link>
          <Link
            href="/courses"
            onClick={() => setMobileMenuOpen(false)}
            className="block rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
          >
            Browse Courses
          </Link>
          {user ? (
            <>
              <Link
                href="/my-courses"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
              >
                My Enrolled Courses
              </Link>
              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <p className="px-3 py-1 text-xs text-zinc-400">Signed in as {user.email}</p>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center rounded-lg border border-zinc-200 py-2 text-sm font-semibold text-zinc-800 dark:border-zinc-800 dark:text-zinc-200"
              >
                Log In
              </Link>
              <Link
                href="/login?tab=signup"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white shadow-sm"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
