'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getUserEnrollments } from '@/lib/course-store';
import { Enrollment } from '@/types';
import {
  CheckCircle2,
  Clock,
  Calendar,
  BookOpen,
  ArrowRight,
  User,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

function MyCoursesContent() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const newlyEnrolledTitle = searchParams.get('enrolled');

  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [successBanner, setSuccessBanner] = useState<string | null>(
    newlyEnrolledTitle
      ? `🎉 Successfully enrolled in "${newlyEnrolledTitle}". Welcome to the cohort!`
      : null
  );

  const refreshEnrollments = () => {
    if (user) {
      setEnrollments(getUserEnrollments(user.id));
    }
  };

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login?redirect=/my-courses');
      return;
    }
    refreshEnrollments();
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-zinc-500">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          <span>Loading your enrolled courses...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Success Notification Banner */}
      {successBanner && (
        <div className="mb-6 flex items-center justify-between rounded-2xl bg-emerald-50 p-4 text-xs sm:text-sm font-semibold text-emerald-800 shadow-sm dark:bg-emerald-950/50 dark:text-emerald-300">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>{successBanner}</span>
          </div>
          <button
            onClick={() => setSuccessBanner(null)}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900 dark:text-emerald-400 dark:hover:text-emerald-200"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200/80 pb-6 dark:border-zinc-800/80">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Learner Portal</span>
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            My Enrolled Courses
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
            Manage your active training programs, check batch schedules, and access learning materials.
          </p>
        </div>

        <Link
          href="/courses"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-colors shrink-0"
        >
          <BookOpen className="h-4 w-4" />
          Browse More Courses
        </Link>
      </div>

      {/* Courses List */}
      {enrollments.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-zinc-200 bg-white p-12 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <BookOpen className="mx-auto h-12 w-12 text-zinc-300 dark:text-zinc-600" />
          <h3 className="mt-4 text-base font-bold text-zinc-900 dark:text-zinc-100">
            No enrolled courses yet
          </h3>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
            You have not enrolled in any training programs. Discover upcoming cohorts in our catalog to start learning.
          </p>
          <Link
            href="/courses"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition-all hover:bg-blue-700"
          >
            Explore Academy Courses
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {enrollments.map((enr) => {
            const course = enr.course;
            if (!course) return null;

            return (
              <div
                key={enr.id}
                className="flex flex-col md:flex-row md:items-center justify-between gap-5 rounded-2xl border border-zinc-200/90 bg-white p-5 sm:p-6 shadow-sm transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
              >
                {/* Left: Thumbnail & Info */}
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  {/* Thumbnail */}
                  <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
                    <img
                      src={course.image_url}
                      alt={course.title}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop';
                      }}
                    />
                  </div>

                  {/* Details */}
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                        {course.category}
                      </span>
                      <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                        Status: Enrolled
                      </span>
                      <span className="text-[11px] text-zinc-400">
                        Fee: {course.price === 0 ? 'FREE' : `$${course.price}`}
                      </span>
                    </div>

                    <h3 className="mt-2 text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-50">
                      {course.title}
                    </h3>

                    <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
                      <span className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-zinc-400" />
                        {course.instructor}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-zinc-400" />
                        {course.duration}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                        {course.schedule} ({course.class_time})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Actions & Status */}
                <div className="flex items-center gap-3 pt-3 md:pt-0 border-t border-zinc-100 md:border-none dark:border-zinc-800">
                  <div className="hidden sm:flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Seat Confirmed</span>
                  </div>
                  <Link
                    href={`/courses/${course.id}`}
                    className="flex-1 sm:flex-none text-center rounded-xl bg-zinc-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function MyCoursesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-sm text-zinc-500">Loading courses...</p>
        </div>
      }
    >
      <MyCoursesContent />
    </Suspense>
  );
}
