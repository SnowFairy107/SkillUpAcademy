'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  getCourseById,
  isEnrolledInCourse,
  enrollCourseAction,
} from '@/lib/course-store';
import { Course } from '@/types';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  User,
  Users,
  AlertCircle,
  Star,
  ShieldCheck,
  Award,
  Sparkles,
  LogIn,
  Check,
  X,
  CreditCard,
  BookOpen,
} from 'lucide-react';

export default function CourseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const courseId = params?.id as string;
  const [course, setCourse] = useState<Course | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (courseId) {
      const found = getCourseById(courseId);
      if (found) {
        setCourse(found);
        if (user) {
          setIsEnrolled(isEnrolledInCourse(user.id, found.id));
        }
      }
    }
  }, [courseId, user]);

  if (!course) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-zinc-400" />
        <h2 className="mt-4 text-xl font-bold text-zinc-900 dark:text-zinc-100">
          Course Not Found
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          The requested course could not be located in our catalog.
        </p>
        <Link
          href="/courses"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Course Catalog
        </Link>
      </div>
    );
  }

  const isFull = course.available_seats <= 0 || course.status === 'full';
  const isClosed = course.status === 'closed';

  const handleOpenEnrollModal = () => {
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(`/courses/${course.id}`)}`);
      return;
    }
    setErrorMsg('');
    setIsConfirmModalOpen(true);
  };

  const handleConfirmEnrollment = () => {
    if (!user) return;
    setIsSubmitting(true);
    setErrorMsg('');

    const res = enrollCourseAction(user.id, course.id);

    if (!res.success) {
      setErrorMsg(res.message);
      setIsSubmitting(false);
      setIsConfirmModalOpen(false);
      return;
    }

    // Refresh course data to reflect decremented seats
    const updated = getCourseById(course.id);
    if (updated) {
      setCourse(updated);
    }
    setIsEnrolled(true);
    setIsSubmitting(false);
    setIsConfirmModalOpen(false);
    setIsSuccessModalOpen(true);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Breadcrumb / Back Link */}
      <div className="mb-6 flex items-center gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
        <Link href="/" className="hover:text-zinc-900 dark:hover:text-zinc-100">
          Home
        </Link>
        <span>/</span>
        <Link href="/courses" className="hover:text-zinc-900 dark:hover:text-zinc-100">
          Courses
        </Link>
        <span>/</span>
        <span className="truncate text-zinc-900 dark:text-zinc-100 font-semibold max-w-xs sm:max-w-md">
          {course.title}
        </span>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* LEFT COLUMN: Course Overview, Description, Syllabus (2 Cols) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header Card */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="rounded-lg bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                {course.category}
              </span>
              <span className="rounded-lg bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                Level: {course.level}
              </span>
              <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                <Star className="h-4 w-4 fill-amber-400" />
                <span>{course.rating || 4.9} / 5.0</span>
              </div>
            </div>

            <h1 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
              {course.title}
            </h1>

            <p className="mt-3 text-sm sm:text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
              {course.short_description || course.description}
            </p>

            {/* Instructor snippet */}
            <div className="mt-6 flex items-center gap-3 border-t border-zinc-100 pt-5 dark:border-zinc-800">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                {course.instructor.charAt(0)}
              </div>
              <div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Course Instructor</p>
                <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  {course.instructor}
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Description */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
              Course Description
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 whitespace-pre-line">
              {course.description}
            </p>
          </div>

          {/* What You Will Learn */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
              What You Will Learn
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {(course.what_you_will_learn || [
                'Hands-on project work and real-world practical exercises',
                'Core concepts, tools, and modern industry workflows',
                'Best practices, code architecture, and optimization',
                'Direct mentorship and feedback from your instructor',
              ]).map((point, index) => (
                <div key={index} className="flex items-start gap-2.5">
                  <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                    <Check className="h-3 w-3" />
                  </div>
                  <span className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
                    {point}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Sticky Course Summary & Enrollment Card (1 Col) */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
            {/* Course Image Preview */}
            <div className="relative aspect-video w-full bg-zinc-100 dark:bg-zinc-800">
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

            {/* Price & Action Section */}
            <div className="p-6">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-zinc-400">Total Course Fee</span>
                  <p className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
                    {course.price === 0 ? 'FREE' : `$${course.price}`}
                  </p>
                </div>
                <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                  {course.status === 'open' ? 'Enrollment Open' : 'Limited Seats'}
                </span>
              </div>

              {/* Error Message if any */}
              {errorMsg && (
                <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-700 dark:bg-red-950/50 dark:text-red-300">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Course Meta Info */}
              <div className="mt-6 space-y-3.5 border-t border-zinc-100 pt-5 text-xs dark:border-zinc-800">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                    <Clock className="h-4 w-4 text-blue-500" />
                    Duration
                  </span>
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">
                    {course.duration}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                    <Calendar className="h-4 w-4 text-purple-500" />
                    Schedule
                  </span>
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">
                    {course.schedule}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                    <Clock className="h-4 w-4 text-indigo-500" />
                    Class Time
                  </span>
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">
                    {course.class_time}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                    <Award className="h-4 w-4 text-emerald-500" />
                    Skill Level
                  </span>
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">
                    {course.level}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                    <Users className="h-4 w-4 text-amber-500" />
                    Available Seats
                  </span>
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">
                    {course.available_seats} remaining
                  </span>
                </div>
              </div>

              {/* Progress bar for remaining seats */}
              <div className="mt-4">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                  <div
                    className={`h-full rounded-full transition-all ${
                      course.available_seats <= 3
                        ? 'bg-red-500'
                        : course.available_seats <= 8
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{
                      width: `${Math.max(
                        10,
                        (course.available_seats / (course.capacity || 25)) * 100
                      )}%`,
                    }}
                  />
                </div>
              </div>

              {/* Enrollment CTA Button states */}
              <div className="mt-6">
                {!user ? (
                  /* Guest Visitor CTA */
                  <button
                    onClick={handleOpenEnrollModal}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-md shadow-blue-500/25 transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/35"
                  >
                    <LogIn className="h-4 w-4" />
                    Login to Enroll ({course.price === 0 ? 'FREE' : `$${course.price}`})
                  </button>
                ) : isEnrolled ? (
                  /* Already Enrolled */
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs font-bold text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
                      <CheckCircle2 className="h-4 w-4" />
                      You are Enrolled in this Course
                    </div>
                    <Link
                      href="/my-courses"
                      className="flex w-full items-center justify-center rounded-xl bg-zinc-900 py-3 text-xs font-bold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                    >
                      Go to My Courses
                    </Link>
                  </div>
                ) : isClosed ? (
                  /* Course Closed */
                  <button
                    disabled
                    className="w-full cursor-not-allowed rounded-xl bg-zinc-200 py-3.5 text-sm font-bold text-zinc-500 dark:bg-zinc-800 dark:text-zinc-600"
                  >
                    Enrollment Closed
                  </button>
                ) : isFull ? (
                  /* Course Full */
                  <button
                    disabled
                    className="w-full cursor-not-allowed rounded-xl bg-red-100 py-3.5 text-sm font-bold text-red-600 dark:bg-red-950/40 dark:text-red-400"
                  >
                    Course Full (0 Seats Left)
                  </button>
                ) : (
                  /* Available to Enroll */
                  <button
                    onClick={handleOpenEnrollModal}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-500/35"
                  >
                    <Sparkles className="h-4 w-4" />
                    Enroll Now ({course.price === 0 ? 'FREE' : `$${course.price}`})
                  </button>
                )}
              </div>

              {/* Guarantees */}
              <div className="mt-5 flex items-center justify-center gap-4 text-[11px] text-zinc-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                  Verified Academy Certificate
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🌟 ENROLLMENT CONFIRMATION MODAL */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                Confirm Course Enrollment
              </h3>
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="rounded-lg p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div className="rounded-xl bg-blue-50/70 p-4 dark:bg-blue-950/40">
                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">Selected Course</p>
                <p className="mt-1 text-sm font-bold text-zinc-900 dark:text-zinc-50">
                  {course.title}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg border border-zinc-100 p-2.5 dark:border-zinc-800">
                  <span className="text-zinc-400">Instructor:</span>
                  <p className="font-semibold text-zinc-800 dark:text-zinc-200">{course.instructor}</p>
                </div>
                <div className="rounded-lg border border-zinc-100 p-2.5 dark:border-zinc-800">
                  <span className="text-zinc-400">Duration:</span>
                  <p className="font-semibold text-zinc-800 dark:text-zinc-200">{course.duration}</p>
                </div>
                <div className="rounded-lg border border-zinc-100 p-2.5 dark:border-zinc-800">
                  <span className="text-zinc-400">Schedule:</span>
                  <p className="font-semibold text-zinc-800 dark:text-zinc-200">{course.schedule}</p>
                </div>
                <div className="rounded-lg border border-zinc-100 p-2.5 dark:border-zinc-800">
                  <span className="text-zinc-400">Fee:</span>
                  <p className="font-bold text-blue-600 dark:text-blue-400">
                    {course.price === 0 ? 'FREE' : `$${course.price}`}
                  </p>
                </div>
              </div>

              <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                Are you ready to confirm your enrollment in this cohort? Your seat will be secured immediately.
              </p>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 border-t border-zinc-100 pt-4 dark:border-zinc-800">
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                disabled={isSubmitting}
                className="rounded-xl border border-zinc-200 px-4 py-2.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmEnrollment}
                disabled={isSubmitting}
                className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? (
                  'Confirming...'
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Confirm Enrollment
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🌟 ENROLLMENT SUCCESS MODAL */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in zoom-in-95">
          <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-7 text-center shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <h3 className="mt-4 text-xl font-extrabold text-zinc-900 dark:text-zinc-50">
              Enrollment Successful!
            </h3>

            <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">
              You have successfully enrolled in <strong className="text-zinc-900 dark:text-zinc-100">{course.title}</strong>. Your place in this batch is confirmed.
            </p>

            <div className="mt-6 flex flex-col gap-2">
              <Link
                href="/my-courses"
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs font-bold text-white shadow-md hover:bg-blue-700"
              >
                <BookOpen className="h-4 w-4" />
                Go to My Enrolled Courses
              </Link>
              <button
                onClick={() => setIsSuccessModalOpen(false)}
                className="rounded-xl border border-zinc-200 py-2.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Stay on Course Page
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
