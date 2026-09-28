UniCourse — Ultra-MVP PRD

Tech Stack: Next.js + Supabase + Vercel
Target: Functional student-side MVP
Priority: Finish + working demo > number of features

1. Product Goal

UniCourse allows university students to:

Log in → Browse courses → View course details → Enroll → See enrolled courses

That's the entire core product.

If those 5 things work, you have a valid MVP.

2. ONLY 4 Core Features
① Student Login

Use Supabase Auth.

Email
Password
Login
Logout

Don't build:

Sign up
Forgot password
Email verification
Google login
Admin login

For the demo, create one student account directly in Supabase.

② Course Catalog ⭐

This is the main screen after login.

Display course cards containing:

CSE 3040
Computer Networks

3 Credits
Computer Science

Dr. Aung Aung

Monday • 9:00 AM
Room 301

[ View Course ]

Include only:

Course code
Course name
Instructor
Credits
Schedule
Available seats
View button
Search

Only one search box:

Search courses...

Search by:

Course code
Course name

That's enough.

Skip filters.

3. Course Details

Clicking a course opens:

Computer Networks
CSE 3040

Introduction to computer networking,
protocols and network communication.

────────────────────

Instructor
Dr. Aung Aung

Credits
3

Schedule
Monday • 9:00–11:00 AM

Room
301

Available Seats
12 / 50

────────────────────

[ Enroll Now ]

The important button is:

Enroll Now
4. Enrollment ⭐⭐⭐

This is the most important functionality.

When the user clicks Enroll:

Check:
Already enrolled?
       │
   ┌───┴───┐
  YES      NO
   │        │
 Error    Continue
            │
      Seats available?
            │
       ┌────┴────┐
      NO         YES
       │           │
     Full       Enroll
                   │
                   ▼
              My Courses

Success:

✅ Successfully enrolled in CSE 3040.

That's your main database operation.

5. My Courses

A simple page showing enrolled courses.

My Courses

3 Courses • 9 Credits

────────────────────────

CSE 3040
Computer Networks

3 Credits
Monday • 9:00 AM
Dr. Aung Aung

────────────────────────

CSE 3030
Discrete Mathematics

3 Credits
Tuesday • 1:00 PM
Dr. Su Su
Optional

You can add:

Drop Course

But if you're really running out of time, skip it.

Enrollment is more important than dropping.

6. Pages — ONLY 4

Don't create 10+ routes.

/login

/dashboard

/courses

/my-courses

Course details can be:

/courses/[id]

So technically 5 routes.

7. Navigation

Keep the navbar extremely simple:

┌─────────────────────────────────────────────┐
│ UniCourse     Courses   My Courses    👤    │
└─────────────────────────────────────────────┘

That's it.

No:

Admin
Notifications
Messages
Attendance
Grades
Payments
Settings
8. Dashboard

Don't make the dashboard complicated.

Just:

Welcome back, Phyu 👋

Semester 1 • 2026

┌──────────────┐
│ 3 Courses    │
│ 9 Credits    │
└──────────────┘

Your Courses

CSE 3040 — Computer Networks
CSE 3030 — Discrete Mathematics
CSE 3020 — Operating Systems

[ Browse Courses ]

The dashboard can simply query the student's enrollments.

9. Database — ONLY 3 Tables

You don't need departments, instructors, semesters, etc. as separate tables.

profiles
id
full_name
student_id
email
role

You technically don't even need role if there's only one user type.

courses
id
code
name
description
instructor
credits
schedule
room
capacity
available_seats
enrollments
id
student_id
course_id
enrolled_at

Add:

UNIQUE(student_id, course_id)

This prevents the same student from enrolling twice.

10. Supabase Structure

Your architecture becomes very small:

                    Vercel
                       │
                       ▼
                  Next.js App
                       │
             ┌─────────┴─────────┐
             │                   │
             ▼                   ▼
        Supabase Auth       Supabase DB
             │                   │
             │             ┌─────┴─────┐
             │             │           │
             │          courses   enrollments
             │
             ▼
          Student
11. Seed Data

Don't waste time building course creation.

Put 8–10 courses directly into Supabase.

For example:

CSE 3030 — Discrete Mathematics
CSE 3040 — Computer Networks
CSE 3050 — Operating Systems
CSE 3060 — Database Systems
CSE 3070 — Software Engineering
CSE 3080 — Web Development
CSE 3090 — Artificial Intelligence
CSE 3100 — Data Analytics

Now your application immediately looks populated.

12. What NOT to Build

This is important because you're short on time.

❌ Admin

Completely remove it.

❌ Teacher

Remove it.

❌ Registration approval

Remove it.

❌ GPA

Remove it.

❌ Attendance

Remove it.

❌ Assignments

Remove it.

❌ Payments

Remove it.

❌ Notifications

Remove it.

❌ AI

Remove it.

❌ Course creation UI

Remove it.

❌ Complex timetable

Remove it.

❌ Profile editing

Remove it.

13. Priority Order for Antigravity

If Antigravity starts consuming time/tokens, build in this exact order:

🔴 P0 — Absolutely Required
Next.js setup
Supabase connection
Login
Courses table
Course listing
Course details
Enrollment
My Courses
🟡 P1 — Only if everything works
Search
Dashboard statistics
Drop course
🟢 P2 — Ignore for now

Everything else.

14. Your Demo Story

Your presentation/demo can be incredibly simple:

"UniCourse is a student-focused university course registration platform. Students can securely log in, browse available courses, view course information, and enroll in courses. Their registered courses are then automatically displayed in their personal dashboard."

Then demonstrate:

Login
 ↓
Dashboard
 ↓
Browse Courses
 ↓
Search "Computer Networks"
 ↓
View Details
 ↓
Enroll
 ↓
Success
 ↓
My Courses
 ↓
Course appears

That is enough for an MVP.

15. The Most Important Technical Part

Don't let Antigravity spend half your remaining time making beautiful UI.

The critical thing to make reliable is:

Student
   ↓
Enroll
   ↓
Supabase
   ↓
enrollments row created
   ↓
My Courses
   ↓
Course appears

If that works, your project is functional.

Everything else is decoration.

Final scope
              UNICOURSE MVP

                   LOGIN
                     │
                     ▼
                DASHBOARD
                     │
              ┌──────┴──────┐
              ▼             ▼
         ALL COURSES    MY COURSES
              │
              ▼
        COURSE DETAILS
              │
              ▼
           ENROLL
              │
              ▼
        MY COURSES

