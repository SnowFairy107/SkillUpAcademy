'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getAllCourses, isEnrolledInCourse } from '@/lib/course-store';
import { COURSE_CATEGORIES } from '@/lib/courses-data';
import { Course } from '@/types';
import CourseCard from '@/components/CourseCard';
import {
  Search,
  BookOpen,
  Filter,
  X,
  SlidersHorizontal,
  GraduationCap,
  Sparkles,
  LogIn,
} from 'lucide-react';

export default function CoursesPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [selectedPriceFilter, setSelectedPriceFilter] = useState<string>('All');

  useEffect(() => {
    setCourses(getAllCourses());
  }, []);

  // Filter courses
  const filteredCourses = courses.filter((course) => {
    // 1. Search Query
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      const matchTitle = course.title.toLowerCase().includes(q);
      const matchCat = course.category.toLowerCase().includes(q);
      const matchInstructor = course.instructor.toLowerCase().includes(q);
      const matchDesc = course.description?.toLowerCase().includes(q);
      if (!matchTitle && !matchCat && !matchInstructor && !matchDesc) {
        return false;
      }
    }

    // 2. Category Filter
    if (selectedCategory !== 'All' && course.category !== selectedCategory) {
      return false;
    }

    // 3. Level Filter
    if (selectedLevel !== 'All' && course.level !== selectedLevel) {
      return false;
    }

    // 4. Price Filter
    if (selectedPriceFilter === 'Under100' && course.price >= 100) {
      return false;
    }
    if (selectedPriceFilter === '100Plus' && course.price < 100) {
      return false;
    }

    return true;
  });

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedLevel('All');
    setSelectedPriceFilter('All');
  };

  const isFiltering =
    searchQuery !== '' ||
    selectedCategory !== 'All' ||
    selectedLevel !== 'All' ||
    selectedPriceFilter !== 'All';

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Catalog Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-zinc-200/80 pb-6 dark:border-zinc-800/80">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Academy Course Catalog</span>
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Explore All Courses
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Browse our catalog of professional courses, filter by subject, and reserve your seat today.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search title, instructor, category..."
            className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-sm text-zinc-900 placeholder-zinc-400 shadow-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Pills & Filters */}
      <div className="mt-6 flex flex-col gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {COURSE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Secondary Filter Dropdowns */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            {/* Level Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-500">Level:</span>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="rounded-lg border border-zinc-200 bg-white py-1.5 px-2.5 text-xs font-medium text-zinc-800 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
              >
                <option value="All">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            {/* Price Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-500">Price:</span>
              <select
                value={selectedPriceFilter}
                onChange={(e) => setSelectedPriceFilter(e.target.value)}
                className="rounded-lg border border-zinc-200 bg-white py-1.5 px-2.5 text-xs font-medium text-zinc-800 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
              >
                <option value="All">All Prices</option>
                <option value="Under100">Under $100</option>
                <option value="100Plus">$100 & Above</option>
              </select>
            </div>

            {isFiltering && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
              >
                <X className="h-3.5 w-3.5" />
                Reset Filters
              </button>
            )}
          </div>

          <span className="text-zinc-500 dark:text-zinc-400">
            Showing <strong className="text-zinc-900 dark:text-zinc-100">{filteredCourses.length}</strong> of {courses.length} courses
          </span>
        </div>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-zinc-200 bg-white p-12 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <BookOpen className="mx-auto h-12 w-12 text-zinc-300 dark:text-zinc-600" />
          <h3 className="mt-4 text-base font-bold text-zinc-900 dark:text-zinc-50">
            No courses found
          </h3>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            We couldn&apos;t find any courses matching your criteria. Try adjusting your search query or filters.
          </p>
          <button
            onClick={resetFilters}
            className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              isEnrolled={user ? isEnrolledInCourse(user.id, course.id) : false}
            />
          ))}
        </div>
      )}
    </div>
  );
}
