export interface Course {
  id: string;
  title: string;
  description: string;
  short_description: string;
  category: string;
  instructor: string;
  image_url: string;
  duration: string;
  schedule: string;
  class_time: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | string;
  price: number;
  available_seats: number;
  capacity?: number;
  status: 'open' | 'closed' | 'full' | string;
  rating?: number;
  what_you_will_learn?: string[];
  created_at?: string;
}

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  created_at?: string;
}

// Alias for backward compatibility if needed
export type StudentProfile = UserProfile;

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  enrolled_at: string;
  status?: 'enrolled' | 'completed' | 'cancelled' | string;
  course?: Course;
}
