-- SkillUp Academy — Training Academy Course Enrollment Database Schema & Seed Data
-- Run this in your Supabase Project SQL Editor (https://supabase.com/dashboard/project/whsndsldhyggccctqqwi/sql)

-- 1. Profiles Table (Learner Accounts)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Courses Table (Commercial Training Courses)
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  category TEXT NOT NULL,
  instructor TEXT NOT NULL,
  image_url TEXT,
  duration TEXT NOT NULL,
  schedule TEXT NOT NULL,
  class_time TEXT NOT NULL,
  level TEXT NOT NULL DEFAULT 'Beginner',
  price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  available_seats INT NOT NULL DEFAULT 20,
  capacity INT NOT NULL DEFAULT 25,
  status TEXT NOT NULL DEFAULT 'open', -- 'open', 'closed', 'full'
  rating NUMERIC(2, 1) DEFAULT 4.9,
  what_you_will_learn TEXT[],
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Enrollments Table (Learner Course Enrollments)
CREATE TABLE IF NOT EXISTS public.enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'enrolled', -- 'enrolled', 'completed', 'cancelled'
  CONSTRAINT unique_user_course UNIQUE (user_id, course_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Courses Policies (Publicly readable so guests & learners can browse the catalog)
CREATE POLICY "Public and authenticated users can view courses"
  ON public.courses FOR SELECT
  USING (true);

-- Enrollments Policies (Learners manage their own enrollments)
CREATE POLICY "Users can view their own enrollments"
  ON public.enrollments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own enrollments"
  ON public.enrollments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own enrollments"
  ON public.enrollments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Auto-create profile trigger on auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email
  )
  ON CONFLICT (id) DO UPDATE
  SET full_name = EXCLUDED.full_name,
      email = EXCLUDED.email;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Atomic Enrollment Stored Procedure (Prevents race conditions & maintains available seat counts)
CREATE OR REPLACE FUNCTION public.enroll_in_course(p_course_id UUID)
RETURNS json AS $$
DECLARE
  v_user_id UUID;
  v_available INT;
  v_status TEXT;
  v_already_enrolled BOOLEAN;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required to enroll.';
  END IF;

  -- 1. Check if already enrolled
  SELECT EXISTS (
    SELECT 1 FROM public.enrollments
    WHERE user_id = v_user_id AND course_id = p_course_id
  ) INTO v_already_enrolled;

  IF v_already_enrolled THEN
    RAISE EXCEPTION 'You are already enrolled in this course.';
  END IF;

  -- 2. Lock course row and verify seat availability & status
  SELECT available_seats, status INTO v_available, v_status
  FROM public.courses
  WHERE id = p_course_id
  FOR UPDATE;

  IF v_available IS NULL THEN
    RAISE EXCEPTION 'Course not found.';
  END IF;

  IF v_status = 'closed' THEN
    RAISE EXCEPTION 'Enrollment for this course is currently closed.';
  END IF;

  IF v_available <= 0 THEN
    RAISE EXCEPTION 'Course is full. No available seats remaining.';
  END IF;

  -- 3. Create enrollment record
  INSERT INTO public.enrollments (user_id, course_id, status)
  VALUES (v_user_id, p_course_id, 'enrolled');

  -- 4. Decrement available seats
  UPDATE public.courses
  SET available_seats = available_seats - 1,
      status = CASE WHEN available_seats - 1 <= 0 THEN 'full' ELSE status END
  WHERE id = p_course_id;

  RETURN json_build_object('success', true, 'message', 'Enrolled successfully');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Atomic Cancel / Drop Enrollment Stored Procedure
CREATE OR REPLACE FUNCTION public.cancel_enrollment(p_course_id UUID)
RETURNS json AS $$
DECLARE
  v_user_id UUID;
  v_deleted_count INT;
  v_capacity INT;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required.';
  END IF;

  DELETE FROM public.enrollments
  WHERE user_id = v_user_id AND course_id = p_course_id;
  GET DIAGNOSTICS v_deleted_count = ROW_COUNT;

  IF v_deleted_count > 0 THEN
    SELECT capacity INTO v_capacity FROM public.courses WHERE id = p_course_id;
    UPDATE public.courses
    SET available_seats = LEAST(COALESCE(v_capacity, 30), available_seats + 1),
        status = CASE WHEN status = 'full' THEN 'open' ELSE status END
    WHERE id = p_course_id;
  END IF;

  RETURN json_build_object('success', true, 'message', 'Enrollment cancelled successfully');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Seed Data (Commercial Training Academy Courses)
INSERT INTO public.courses (
  title, description, short_description, category, instructor, image_url,
  duration, schedule, class_time, level, price, available_seats, capacity, status, rating, what_you_will_learn
)
VALUES
  (
    'Full-Stack Web Development Bootcamp',
    'This comprehensive bootcamp takes you from absolute beginner to confident full-stack web developer. You will build dynamic, responsive web applications with modern technologies including React 19, Next.js App Router, Tailwind CSS, REST APIs, and Supabase PostgreSQL. By the end of this course, you will have a portfolio of 4 production-ready web apps.',
    'Master modern frontend & backend web development from HTML/CSS to React, Next.js, and Supabase.',
    'Programming',
    'Alex Rivera',
    'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?q=80&w=1200&auto=format&fit=crop',
    '8 Weeks',
    'Saturday & Sunday',
    '10:00 AM – 12:30 PM',
    'Beginner',
    120.00,
    12,
    25,
    'open',
    4.9,
    ARRAY[
      'HTML5, Modern CSS3 & Tailwind CSS styling',
      'JavaScript ES6+ fundamentals, DOM manipulation & async programming',
      'React component architecture, custom hooks & state management',
      'Full-stack Next.js with Server Components & API routes',
      'Database modeling, Supabase authentication & PostgreSQL queries',
      'Deploying production applications to Vercel and custom domains'
    ]
  ),
  (
    'Python for Data Science & Machine Learning',
    'Unlock the power of data with Python. In this hands-on course, you will learn data cleaning, exploratory data analysis, data visualization, and applied machine learning. Work with real-world datasets in Jupyter notebooks and build models for classification, regression, and customer clustering.',
    'Analyze real-world datasets, build predictive models, and master Pandas, NumPy, and Scikit-Learn.',
    'Data Science',
    'Dr. Sarah Chen',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
    '6 Weeks',
    'Tuesday & Thursday',
    '6:30 PM – 8:30 PM',
    'Intermediate',
    150.00,
    8,
    20,
    'open',
    4.8,
    ARRAY[
      'Python programming for scientific computing & data structures',
      'Data manipulation & wrangling with Pandas and NumPy',
      'Interactive dashboards & charts with Matplotlib & Seaborn',
      'Statistical hypothesis testing and feature engineering',
      'Supervised & unsupervised machine learning with Scikit-Learn',
      'Deploying data science models with Streamlit'
    ]
  ),
  (
    'UI/UX Design Masterclass with Figma',
    'Turn ideas into intuitive, beautiful digital products. This practical course covers the complete product design cycle: user research, wireframing, design tokens, responsive typography, interactive component states, micro-interactions, and developer handoff in Figma.',
    'Learn wireframing, modern UI design systems, interactive prototyping, and user testing in Figma.',
    'Design',
    'Elena Rostova',
    'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?q=80&w=1200&auto=format&fit=crop',
    '5 Weeks',
    'Monday & Wednesday',
    '7:00 PM – 9:00 PM',
    'Beginner',
    95.00,
    15,
    25,
    'open',
    4.9,
    ARRAY[
      'User research methodologies, personas & user journeys',
      'Figma auto-layout, component variants & design tokens',
      'Building cohesive design systems and color palettes',
      'Interactive high-fidelity prototyping and animations',
      'Usability testing heuristics & accessibility standards (WCAG)',
      'Design handoff and collaboration with developers'
    ]
  ),
  (
    'Digital Marketing & Growth Hacking',
    'Grow businesses and drive qualified traffic. Learn the exact growth strategies used by top tech startups to acquire customers cost-effectively. Covers Google Ads, search engine optimization (SEO), Meta advertising, email marketing funnels, and web analytics.',
    'Master SEO, Google Ads, social media strategy, content marketing, and conversion optimization.',
    'Digital Marketing',
    'Marcus Vance',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop',
    '4 Weeks',
    'Friday & Saturday',
    '2:00 PM – 4:30 PM',
    'Beginner',
    80.00,
    18,
    30,
    'open',
    4.7,
    ARRAY[
      'Technical SEO audits, keyword research & backlink strategies',
      'Paid search campaigns with Google Ads and keyword bidding',
      'High-converting social ad campaigns on Meta & TikTok',
      'Email marketing automation and nurture workflows',
      'Conversion rate optimization (CRO) & A/B testing',
      'Google Analytics 4 and attribution reporting'
    ]
  ),
  (
    'Business Strategy & Product Management',
    'Bridge the gap between technology and business goals. Designed for aspiring product managers and entrepreneurs, this course covers customer discovery, product-market fit validation, roadmap prioritization frameworks (RICE/MoSCoW), financial modeling, and leading cross-functional teams.',
    'Learn product roadmap planning, unit economics, market validation, and agile leadership.',
    'Business',
    'David Sterling',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop',
    '6 Weeks',
    'Tuesday & Thursday',
    '7:00 PM – 9:00 PM',
    'Intermediate',
    135.00,
    6,
    20,
    'open',
    4.8,
    ARRAY[
      'Product discovery, customer interviews & problem validation',
      'Unit economics, CAC, LTV & SaaS business metrics',
      'Strategic roadmap prioritization & OKR frameworks',
      'Agile product execution, sprint planning & user stories',
      'Go-to-market (GTM) launch strategy and competitive analysis',
      'Pitch deck preparation and stakeholder communication'
    ]
  ),
  (
    'Professional Business Communication',
    'Communicate with clarity, confidence, and authority in international business environments. Learn to craft persuasive emails and reports, lead high-stakes client meetings, and deliver compelling presentations without hesitation.',
    'Sharpen your executive writing, presentation delivery, and international negotiation skills.',
    'Language',
    'Claire Dupont',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1200&auto=format&fit=crop',
    '4 Weeks',
    'Saturday & Sunday',
    '3:00 PM – 5:00 PM',
    'Beginner',
    60.00,
    0,
    15,
    'closed',
    4.9,
    ARRAY[
      'Executive email drafting and formal report structure',
      'Leading confident video conferences and global team meetings',
      'Public speaking, slide deck delivery & voice modulation',
      'Negotiation terminology and persuasive phrasing',
      'Cross-cultural business etiquette and diplomacy'
    ]
  )
ON CONFLICT DO NOTHING;
