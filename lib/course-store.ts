import { Course, Enrollment, UserProfile } from '@/types';
import { INITIAL_COURSES, DEMO_USER } from './courses-data';

const COURSES_STORAGE_KEY = 'skillup_academy_courses_v3';
const ENROLLMENTS_STORAGE_KEY = 'skillup_academy_enrollments_v2';
const USER_STORAGE_KEY = 'skillup_academy_current_user_v2';

export function getStoredUser(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(USER_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
  return null;
}

export function setStoredUser(user: UserProfile | null) {
  if (typeof window === 'undefined') return;
  if (user) {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    document.cookie = `skillup_user=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=86400`;
  } else {
    localStorage.removeItem(USER_STORAGE_KEY);
    document.cookie = 'skillup_user=; path=/; max-age=0';
  }
}

export function getAllCourses(): Course[] {
  if (typeof window === 'undefined') return INITIAL_COURSES;
  const stored = localStorage.getItem(COURSES_STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Sync fresh image_url and static details from INITIAL_COURSES
        const synced = parsed.map((course: Course) => {
          const initial = INITIAL_COURSES.find((c) => c.id === course.id);
          return initial ? { ...course, image_url: initial.image_url } : course;
        });
        return synced;
      }
    } catch {
      // fallback
    }
  }
  localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(INITIAL_COURSES));
  return INITIAL_COURSES;
}

export function getCourseById(id: string): Course | undefined {
  const courses = getAllCourses();
  return courses.find((c) => c.id === id);
}

export function getFeaturedCourses(limit: number = 3): Course[] {
  const courses = getAllCourses();
  return courses.slice(0, limit);
}

export function getUserEnrollments(userId: string): Enrollment[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(ENROLLMENTS_STORAGE_KEY);
  let enrollments: Enrollment[] = [];
  if (stored) {
    try {
      enrollments = JSON.parse(stored);
    } catch {
      enrollments = [];
    }
  }
  const courses = getAllCourses();
  return enrollments
    .filter((e) => e.user_id === userId)
    .map((e) => ({
      ...e,
      course: courses.find((c) => c.id === e.course_id),
    }));
}

// Alias for backward compatibility
export const getStudentEnrollments = getUserEnrollments;

export function isEnrolledInCourse(userId: string, courseId: string): boolean {
  if (typeof window === 'undefined') return false;
  const enrollments = getUserEnrollments(userId);
  return enrollments.some((e) => e.course_id === courseId);
}

export function enrollCourseAction(
  userId: string,
  courseId: string
): { success: boolean; message: string; course?: Course } {
  if (typeof window === 'undefined') {
    return { success: false, message: 'Browser environment required.' };
  }

  const courses = getAllCourses();
  const courseIndex = courses.findIndex((c) => c.id === courseId);
  if (courseIndex === -1) {
    return { success: false, message: 'Course not found.' };
  }

  const course = courses[courseIndex];

  // 1. Check if already enrolled
  if (isEnrolledInCourse(userId, courseId)) {
    return {
      success: false,
      message: `You are already enrolled in "${course.title}".`,
      course,
    };
  }

  // 2. Check if course is closed or full
  if (course.status === 'closed') {
    return {
      success: false,
      message: `Enrollment for "${course.title}" is currently closed.`,
      course,
    };
  }

  if (course.available_seats <= 0) {
    return {
      success: false,
      message: `"${course.title}" is currently full. No available seats remaining.`,
      course,
    };
  }

  // 3. Decrement available seats
  const newSeats = course.available_seats - 1;
  courses[courseIndex] = {
    ...course,
    available_seats: newSeats,
    status: newSeats === 0 ? 'full' : course.status,
  };
  localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(courses));

  // 4. Save enrollment record
  const storedEnrollments = localStorage.getItem(ENROLLMENTS_STORAGE_KEY);
  const enrollments: Enrollment[] = storedEnrollments ? JSON.parse(storedEnrollments) : [];
  const newEnrollment: Enrollment = {
    id: `enr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    user_id: userId,
    course_id: courseId,
    enrolled_at: new Date().toISOString(),
    status: 'enrolled',
  };
  enrollments.push(newEnrollment);
  localStorage.setItem(ENROLLMENTS_STORAGE_KEY, JSON.stringify(enrollments));

  return {
    success: true,
    message: `Congratulations! You have successfully enrolled in "${course.title}".`,
    course: courses[courseIndex],
  };
}

export function cancelEnrollmentAction(
  userId: string,
  courseId: string
): { success: boolean; message: string } {
  if (typeof window === 'undefined') {
    return { success: false, message: 'Browser environment required.' };
  }

  const courses = getAllCourses();
  const courseIndex = courses.findIndex((c) => c.id === courseId);
  if (courseIndex !== -1) {
    const course = courses[courseIndex];
    const maxCapacity = course.capacity || 30;
    const restoredSeats = Math.min(maxCapacity, course.available_seats + 1);
    courses[courseIndex] = {
      ...course,
      available_seats: restoredSeats,
      status: course.status === 'full' ? 'open' : course.status,
    };
    localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(courses));
  }

  const storedEnrollments = localStorage.getItem(ENROLLMENTS_STORAGE_KEY);
  const enrollments: Enrollment[] = storedEnrollments ? JSON.parse(storedEnrollments) : [];
  const updatedEnrollments = enrollments.filter(
    (e) => !(e.user_id === userId && e.course_id === courseId)
  );
  localStorage.setItem(ENROLLMENTS_STORAGE_KEY, JSON.stringify(updatedEnrollments));

  return { success: true, message: 'Enrollment cancelled successfully.' };
}

// Backward compatibility
export const dropCourseAction = cancelEnrollmentAction;
