'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllCourses, isEnrolledInCourse } from '@/lib/course-store';
import { ACADEMY_INFO } from '@/lib/courses-data';
import { Course } from '@/types';
import CourseCard from '@/components/CourseCard';
import { useAuth } from '@/context/AuthContext';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Users,
  Award,
  Clock,
  BookOpen,
  Star,
  ShieldCheck,
  TrendingUp,
  Zap,
} from 'lucide-react';

export default function HomePage() {
  const { user } = useAuth();
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);

  useEffect(() => {
    const all = getAllCourses();
    setFeaturedCourses(all.slice(0, 3));
  }, []);

  return (
    <div className="flex flex-col">
      {/* 🌟 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-zinc-50 dark:from-zinc-900/60 dark:via-zinc-950 dark:to-zinc-950 py-16 sm:py-24 border-b border-zinc-200/80 dark:border-zinc-800/80">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            {/* Academy Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50/80 px-3.5 py-1 text-xs font-semibold text-blue-700 backdrop-blur-sm dark:border-blue-900/50 dark:bg-blue-950/50 dark:text-blue-300">
              <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              <span>Enrollment Now Open for 2026 Cohorts</span>
            </div>

            {/* Headline */}
            <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-[1.15]">
              Learn New Skills.{' '}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                Build Your Future.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-5 text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Explore our professional, industry-oriented training courses and start learning directly from experienced instructors with flexible schedules and hands-on projects.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto">
              <Link
                href="/courses"
                className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-500/35"
              >
                <span>Explore Courses</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#why-choose-us"
                className="flex w-full sm:w-auto items-center justify-center rounded-xl border border-zinc-200 bg-white px-6 py-3.5 text-sm font-semibold text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                Why Choose Us
              </a>
            </div>

            {/* Proof Badges */}
            <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4 border-t border-zinc-200/80 pt-8 dark:border-zinc-800/80 w-full">
              <div className="text-center">
                <p className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">1,200+</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Enrolled Learners</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">4.9 / 5.0</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Average Rating</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">100%</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Practical Projects</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">Flexible</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Weekend & Evenings</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🌟 2. FEATURED COURSES SECTION */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Popular Programs
              </span>
              <h2 className="mt-1.5 text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
                Featured Courses
              </h2>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Explore our highest-rated training programs designed for career advancement.
              </p>
            </div>
            <Link
              href="/courses"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 transition-colors"
            >
              <span>View All Available Courses</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Grid of Course Cards */}
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                isEnrolled={user ? isEnrolledInCourse(user.id, course.id) : false}
              />
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-6 py-3 text-xs font-bold text-zinc-800 shadow-sm transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              Browse All {getAllCourses().length} Training Courses
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 🌟 3. WHY CHOOSE US SECTION */}
      <section
        id="why-choose-us"
        className="border-y border-zinc-200/80 bg-zinc-50/70 py-16 sm:py-20 dark:border-zinc-800/80 dark:bg-zinc-900/40"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Why Choose SkillUp Academy
            </span>
            <h2 className="mt-1.5 text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              Designed for Real-World Learning
            </h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Unlike traditional theoretical lectures, our programs focus on actionable industry practices that employers value.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Benefit 1 */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-bold text-zinc-900 dark:text-zinc-100">
                Experienced Instructors
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                Learn directly from senior industry engineers, designers, and managers with years of practical experience.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-bold text-zinc-900 dark:text-zinc-100">
                Practical Learning
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                Build real-world projects and portfolio work rather than just memorizing theoretical slides.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-bold text-zinc-900 dark:text-zinc-100">
                Flexible Schedules
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                Weekend and evening batches designed specifically around the schedules of working professionals.
              </p>
            </div>

            {/* Benefit 4 */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-bold text-zinc-900 dark:text-zinc-100">
                Affordable Pricing
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                High-quality education with transparent and affordable fees that offer immediate return on investment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 🌟 4. HOW IT WORKS SECTION */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Simple Enrollment Journey
            </span>
            <h2 className="mt-1.5 text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              How Enrollment Works
            </h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Get started in just four easy steps without bureaucratic paperwork.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="relative rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <span className="text-4xl font-extrabold text-blue-100 dark:text-zinc-800">01</span>
              <h3 className="mt-2 text-sm font-bold text-zinc-900 dark:text-zinc-100">Browse Catalog</h3>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Discover courses in Programming, Data, Design, Business, and Marketing.
              </p>
            </div>

            <div className="relative rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <span className="text-4xl font-extrabold text-blue-100 dark:text-zinc-800">02</span>
              <h3 className="mt-2 text-sm font-bold text-zinc-900 dark:text-zinc-100">Check Details</h3>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Review syllabus, instructor credentials, class time, and seat availability.
              </p>
            </div>

            <div className="relative rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <span className="text-4xl font-extrabold text-blue-100 dark:text-zinc-800">03</span>
              <h3 className="mt-2 text-sm font-bold text-zinc-900 dark:text-zinc-100">Instant Enrollment</h3>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Click &quot;Enroll Now&quot; to securely confirm your seat in the upcoming batch.
              </p>
            </div>

            <div className="relative rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <span className="text-4xl font-extrabold text-blue-100 dark:text-zinc-800">04</span>
              <h3 className="mt-2 text-sm font-bold text-zinc-900 dark:text-zinc-100">Start Learning</h3>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Access your course schedule under &quot;My Courses&quot; and join your live classes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 🌟 5. CALL TO ACTION */}
      <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 py-16 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Ready to Start Learning?
          </h2>
          <p className="mt-3 text-base text-blue-100 max-w-xl mx-auto">
            Join hundreds of ambitious learners upgrading their career skills with SkillUp Academy today.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              href="/courses"
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-blue-600 shadow-lg transition-all hover:bg-blue-50"
            >
              Browse All Courses
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 🌟 6. FOOTER */}
      <footer className="border-t border-zinc-200 bg-white py-12 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 dark:text-zinc-400">
            <div className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-zinc-100">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <span>SkillUp Training Academy Platform</span>
            </div>
            <p>© {new Date().getFullYear()} SkillUp Academy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
