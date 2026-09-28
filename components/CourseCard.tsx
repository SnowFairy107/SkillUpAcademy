'use client';

import React from 'react';
import Link from 'next/link';
import { Course } from '@/types';
import {
  Clock,
  User,
  Users,
  Star,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

interface CourseCardProps {
  course: Course;
  isEnrolled?: boolean;
}

export default function CourseCard({ course, isEnrolled }: CourseCardProps) {
  const isFull = course.available_seats <= 0 || course.status === 'full';
  const isClosed = course.status === 'closed';

  return (
    <div className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200/90 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700">
      <div>
        {/* Course Image & Badges */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
          <img
            src={course.image_url}
            alt={course.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Category Tag (Top Left) */}
          <span className="absolute top-3 left-3 rounded-lg bg-black/50 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold tracking-wide text-white border border-white/20">
            {course.category}
          </span>

          {/* Level Tag (Top Right) */}
          <span className="absolute top-3 right-3 rounded-lg bg-white/90 backdrop-blur-md px-2.5 py-1 text-[11px] font-semibold text-zinc-900 shadow-sm dark:bg-zinc-900/90 dark:text-zinc-100">
            {course.level}
          </span>

          {/* Price Tag Overlay (Bottom Right) */}
          <div className="absolute bottom-3 right-3 rounded-xl bg-blue-600 px-3 py-1 text-sm font-extrabold text-white shadow-md">
            {course.price === 0 ? 'FREE' : `$${course.price}`}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5">
          {/* Rating & Duration snippet */}
          <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
            <div className="flex items-center gap-1 font-semibold text-amber-500">
              <Star className="h-3.5 w-3.5 fill-amber-400" />
              <span>{course.rating || 4.9}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-zinc-400" />
              <span>{course.duration}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="mt-2.5 text-base font-bold leading-snug text-zinc-900 line-clamp-1 group-hover:text-blue-600 dark:text-zinc-50 dark:group-hover:text-blue-400 transition-colors">
            {course.title}
          </h3>

          {/* Short Description */}
          <p className="mt-1.5 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400 line-clamp-2">
            {course.short_description || course.description}
          </p>

          {/* Instructor & Schedule Meta */}
          <div className="mt-4 space-y-2 border-t border-zinc-100 pt-3 text-xs text-zinc-600 dark:border-zinc-800/80 dark:text-zinc-400">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-zinc-400" />
                <span className="font-medium text-zinc-700 dark:text-zinc-300">
                  {course.instructor}
                </span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-zinc-400">
                <Calendar className="h-3 w-3" />
                <span>{course.schedule}</span>
              </div>
            </div>

            {/* Availability / Status Pill */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1 text-[11px]">
                <Users className="h-3.5 w-3.5 text-zinc-400" />
                <span>
                  {course.available_seats > 0
                    ? `${course.available_seats} seats remaining`
                    : 'Class full'}
                </span>
              </div>

              {isEnrolled ? (
                <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                  <CheckCircle2 className="h-3 w-3" />
                  Enrolled
                </span>
              ) : isClosed ? (
                <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-[10px] font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                  Closed
                </span>
              ) : isFull ? (
                <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-[10px] font-bold text-red-700 dark:bg-red-950/60 dark:text-red-300">
                  Course Full
                </span>
              ) : (
                <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                  Open for Enrollment
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action CTA Button */}
      <div className="p-5 pt-0">
        <Link
          href={`/courses/${course.id}`}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-zinc-900 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-blue-600 hover:shadow-md dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-blue-500 dark:hover:text-white"
        >
          <span>View Course Details</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
