# PRD — Training Academy Course Enrollment Platform

## 1. Product Overview

The Training Academy Course Enrollment Platform is a web-based platform for a private training school, academy, or education center to advertise and sell/enroll students into its available courses.

Unlike a university course registration system, the platform is designed around a **commercial training-school model**.

The academy publishes courses that are currently available for enrollment. Each course contains information such as:

- Course title
- Course description
- Course category
- Instructor
- Course duration
- Schedule
- Price
- Available seats
- Course image
- Enrollment status

Students/learners can visit the website, browse available courses, search for courses, view detailed course information, and enroll in a course they are interested in.

The current project is already implemented using Next.js and Supabase. This PRD is designed to **extend the existing project instead of rebuilding it from scratch**.

---

# 2. Product Goal

Build a simple and modern online platform where:

**Academy → Advertises Courses → Learner Browses → Learner Views Details → Learner Enrolls**

The MVP should focus on the learner/customer experience and course enrollment.

The platform should feel more like a **private training academy website with course enrollment** than a university academic management system.

---

# 3. Target Users

## 3.1 Learner / Student

A person who wants to join a course offered by the training academy.

They should be able to:

- Create an account
- Log in
- Browse available courses
- Search for courses
- Filter courses
- View course details
- See course price
- See course duration and schedule
- Enroll in a course
- View enrolled courses

---

## 3.2 Academy

The academy owns and manages the courses.

For the current MVP, course management does NOT need to be fully implemented.

Course data can initially be stored directly in Supabase and displayed on the website.

Admin/Course Management can be added later.

---

# 4. Core User Flow

The main user flow should be:

```text
Landing Page
      ↓
Browse Courses
      ↓
Search / Filter
      ↓
Select a Course
      ↓
Course Details
      ↓
Check Price + Duration + Schedule
      ↓
Enroll Now
      ↓
Login / Sign Up (if not authenticated)
      ↓
Confirm Enrollment
      ↓
My Courses

The important concept is:

Courses are advertised by the academy, and learners choose which available course they want to purchase/enroll in.

This is NOT a university system where students are assigned or required to register for predefined academic courses.

5. MVP Scope

The MVP should contain only the features necessary for the academy course browsing and enrollment experience.

Included
Landing Page
Course Catalog
Course Search
Course Filtering
Course Details
User Login / Sign Up
Enroll in Course
Enrollment Confirmation
My Courses
Not Included in MVP

Do NOT implement these features yet:

University semester management
Academic credits
GPA
Grades
Attendance
Exams
Teacher dashboard
Complex admin dashboard
Payment gateway
Certificates
Chat system
AI chatbot
Live classes
Video streaming
Assignment management
Notifications
Reviews/ratings system
Multi-school marketplace

These can be future features.

6. Page Structure

The existing Next.js project should be extended with the following pages.

6.1 Landing Page

Route:

/

Purpose:

Introduce the training academy and encourage visitors to explore available courses.

Sections:

Hero Section

Example:

Learn New Skills. Build Your Future.

Supporting text:

Explore our professional training courses and start learning with experienced instructors.

Primary button:

Explore Courses

Secondary button:

Learn More
Featured Courses

Display 3–6 popular or featured courses.

Each course card should show:

Course image
Course title
Short description
Duration
Price
Enrollment status
View Details button

Example:

Web Development Bootcamp

Learn modern web development from HTML/CSS
to React and Next.js.

Duration: 8 Weeks
Price: $120

[View Course]
Why Choose Us

Simple academy benefits such as:

Experienced Instructors
Practical Learning
Flexible Schedules
Affordable Courses
Call To Action

Example:

Ready to start learning?

Button:

Browse All Courses
7. Course Catalog

Route:

/courses

This is the main course marketplace/catalog page.

Users should be able to browse all courses currently offered by the academy.

Course Card

Each course card should contain:

[Course Image]

Course Title

Short Description

Instructor: John Doe
Duration: 8 Weeks

$120

[View Details]

Optional:

[Enroll Now]
8. Course Search

Users should be able to search courses by:

Course name
Category
Instructor

Example:

Search courses...

Search should update the displayed courses.

Example:

User searches:

Python

Results:

Python Programming
Advanced Python
Python for Data Analysis
9. Course Filtering

Provide simple filters.

Possible filters:

Category
All
Programming
Business
Design
Language
Digital Marketing
Data Science
Price

Optional:

All
Free
Under $50
$50–$100
$100+
Duration

Optional:

All
Short Course
1–4 Weeks
5–8 Weeks
8+ Weeks

Keep filtering simple for the MVP.

10. Course Details Page

Route:

/courses/[id]

This is one of the most important pages.

When a user clicks a course, they should see complete information before deciding to enroll.

Course Details Layout
Course Header

Display:

Course Image

Web Development Bootcamp

Learn modern web development and build
real-world web applications.

★★★★★
Course Information

Display:

Instructor
John Doe

Duration
8 Weeks

Schedule
Saturday & Sunday

Class Time
10:00 AM – 12:00 PM

Level
Beginner

Available Seats
15

Price
$120
Course Description

Explain what the learner will learn.

Example:

This course introduces students to modern web
development. Learners will build responsive websites
and web applications using modern development tools.
What You Will Learn

Example:

✓ HTML & CSS
✓ JavaScript
✓ React
✓ Next.js
✓ Database Basics
✓ Deployment
Enrollment Button

Display prominently:

$120

[Enroll Now]

If already enrolled:

✓ Already Enrolled
[Go to My Courses]

If the course is full:

Course Full
11. Authentication

Existing authentication from the previous project should be reused.

Routes:

/login
/signup

Users should be able to:

Sign up
Log in
Log out

Supabase Authentication should be used.

12. Enrollment Flow

The enrollment process should be simple.

Step 1

User clicks:

Enroll Now
Step 2

If the user is not logged in:

Please login to enroll in this course.

Redirect to:

/login

After login, return the user to the selected course.

Step 3

If the user is logged in:

Show a confirmation section/modal:

Confirm Enrollment

Course:
Web Development Bootcamp

Duration:
8 Weeks

Price:
$120

Are you sure you want to enroll?

[Cancel] [Confirm Enrollment]
Step 4

After confirmation:

Create an enrollment record in Supabase.

Show:

Enrollment Successful!

You have successfully enrolled in
Web Development Bootcamp.

[Go to My Courses]
13. My Courses

Route:

/my-courses

This page shows all courses that the logged-in learner has enrolled in.

Example:

My Courses

--------------------------------

Web Development Bootcamp

Instructor: John Doe
Duration: 8 Weeks
Price: $120

Status: Enrolled

[View Course]
--------------------------------

Python Programming

Instructor: Jane Smith
Duration: 6 Weeks
Price: $90

Status: Enrolled

[View Course]
--------------------------------
14. Database Design

Use the existing Supabase database where possible.

The MVP should keep the database simple.

Table 1 — profiles

Stores learner information.

profiles
-------------------------
id
full_name
email
created_at

The id should correspond to the Supabase authenticated user.

15. Courses Table
courses
-------------------------
id
title
description
short_description
category
instructor
image_url
duration
schedule
class_time
level
price
available_seats
status
created_at

Example record:

title:
Web Development Bootcamp

description:
Learn modern web development...

category:
Programming

instructor:
John Doe

duration:
8 Weeks

schedule:
Saturday & Sunday

class_time:
10:00 AM - 12:00 PM

level:
Beginner

price:
120

available_seats:
15

status:
open
16. Enrollments Table
enrollments
-------------------------
id
user_id
course_id
enrolled_at
status

Relationship:

User
  |
  | enrolls
  ↓
Enrollment
  |
  | belongs to
  ↓
Course
17. Enrollment Rules

The system should prevent duplicate enrollment.

If a user has already enrolled in a course:

Already Enrolled

The user should not be able to enroll again.

Course Availability

If:

available_seats = 0

Display:

Course Full

Disable the enrollment button.

If:

status = closed

Display:

Enrollment Closed
18. Supabase Security

Use Supabase Row Level Security (RLS).

Users should only be able to:

Read
Public course information
Their own profile
Their own enrollments
Create
Their own enrollment records
Not allowed

A normal learner should NOT be able to:

Modify course price
Modify course information
Modify another user's enrollment
Delete another user's data
19. Existing Project Integration

IMPORTANT:

Do NOT rebuild the application from scratch.

The current project was already developed using:

Next.js
Supabase
Vercel

Continue using the existing:

Next.js project structure
Supabase connection
Authentication
Existing database setup
Existing UI components
Existing styling system

Modify and extend the existing project to match this PRD.

20. Migration From Previous Project

The previous project was based on a university-style course registration concept.

The new product concept should change from:

University
    ↓
Fixed Academic Courses
    ↓
Student Registration

to:

Training Academy
    ↓
Advertised Courses
    ↓
Course Information + Price
    ↓
Learner Choice
    ↓
Enrollment

Therefore, remove or hide university-specific concepts such as:

Semester
Academic Credit
GPA
Grades
Faculty
Department
Academic Registration
Required Courses

Replace them with training-school concepts:

Course Category
Instructor
Duration
Schedule
Class Time
Level
Price
Available Seats
Enrollment
21. UI / UX Requirements

The website should look like a modern professional training academy.

Design Style
Modern
Clean
Professional
Responsive
Easy to navigate
Mobile-friendly
Card-based course layout

Avoid making the UI look like:

University ERP
Government system
Traditional school management system

It should feel like a website where someone is browsing courses they may want to purchase/enroll in.

22. Navigation

Main navigation:

Logo

Home
Courses
My Courses

Login / Sign Up

After login:

Logo

Home
Courses
My Courses

Profile
Logout
23. Course Card Example

Use a visual card similar to:

┌─────────────────────────────┐
│                             │
│       COURSE IMAGE          │
│                             │
├─────────────────────────────┤
│ Web Development Bootcamp    │
│                             │
│ Learn modern web development│
│ and build real projects.    │
│                             │
│ 👨‍🏫 John Doe                │
│ 🕒 8 Weeks                  │
│                             │
│ $120             [Details] │
└─────────────────────────────┘
24. Main User Journey

The complete MVP journey should be:

Visitor
   ↓
Landing Page
   ↓
Explore Courses
   ↓
Search / Filter
   ↓
Select Course
   ↓
Read Course Details
   ↓
Check Price
   ↓
Check Schedule
   ↓
Click "Enroll Now"
   ↓
Login / Sign Up
   ↓
Confirm Enrollment
   ↓
Enrollment Successful
   ↓
My Courses
25. MVP Acceptance Criteria

The MVP is complete when:

Authentication
 User can sign up
 User can log in
 User can log out
Course Discovery
 User can see available courses
 User can search courses
 User can filter courses
 User can open course details
Course Information
 Course title is displayed
 Description is displayed
 Instructor is displayed
 Duration is displayed
 Schedule is displayed
 Price is displayed
 Available seats/status is displayed
Enrollment
 Logged-in user can enroll
 User must authenticate before enrollment
 Duplicate enrollment is prevented
 Full courses cannot be enrolled in
 Enrollment confirmation is displayed
My Courses
 User can view enrolled courses
 User can open enrolled course details
26. Development Priority

Implement in this order:

Priority 1 — Core
Authentication
      ↓
Course Database
      ↓
Course Catalog
      ↓
Course Details
      ↓
Enrollment
      ↓
My Courses
Priority 2 — Important UX
Search
Filter
Course Status
Available Seats
Enrollment Confirmation
Priority 3 — Visual Polish
Responsive Design
Course Images
Animations
Loading States
Empty States
Error Messages

Do not spend development time on advanced features before the core enrollment flow works.

27. Future Features

These are NOT part of the MVP but can be added later.

Academy Admin
Admin Login
Course Creation
Course Editing
Course Deletion
Course Image Upload
Enrollment Management
Student Management
Dashboard Analytics
Payment
Online Payment
Payment History
Payment Confirmation
Invoices
Learning System
Course Materials
Video Lessons
Assignments
Quizzes
Progress Tracking
Certificates
Community
Reviews
Ratings
Comments
Questions & Answers
28. Final Product Concept

The final application should be understood as:

An online course catalog and enrollment platform for a private training academy.

The academy advertises its available courses with detailed information and pricing.

Learners visit the website to:

Discover
   ↓
Compare
   ↓
Learn About
   ↓
Choose
   ↓
Enroll

The MVP should focus on making this journey fast, simple, and clear.

29. Technology Stack

Frontend:

Next.js
React
TypeScript

Backend / Database:

Supabase
PostgreSQL
Supabase Authentication

Deployment:

Vercel
30. Scope Constraint

This project should remain intentionally small for the MVP.

The most important functionality is:

COURSE DISCOVERY
       +
COURSE INFORMATION
       +
PRICE
       +
ENROLLMENT
       +
MY COURSES

Everything else should be treated as optional or future functionality.

The existing Next.js + Supabase project should be modified rather than recreated.