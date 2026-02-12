
# Plan: Platform-Wide Demo Fixes and Content Updates

## Overview
This plan addresses all issues from the functional review notes across Guest Mode, Student Mode, and Teacher Mode. The changes are organized into 3 sections with approximately 30 individual fixes.

---

## Section 1: Guest Mode Fixes

### 1a. Contact Us Page Updates
**File:** `src/pages/guest/ContactInfo.tsx`
- Change phone number from `+973 1700 5577` to `80001800`
- Remove fax line entirely
- Change "Apply Now" link from `https://www.utb.edu.bh/admissions` to `https://www.utb.edu.bh/undergraduate-students/`

### 1b. Programs Page - Reorder and Update
**File:** `src/pages/guest/ProgramsInfo.tsx`
- Reorder colleges: **Engineering first**, then Computer Studies, then Business
- Update Engineering programs:
  - Informatics Engineering (replaces Industrial Engineering)
  - Mechatronics Engineering (replaces Mechanical Engineering)
  - Environmental Engineering (replaces Energy Engineering)
- Add Master programs:
  - MBA (already exists)
  - MSc in Digital Marketing (new)
  - MSc in Logistics and Supply Chain Management (new)

### 1c. Colleges Page - Update Content
**File:** `src/pages/guest/CollegesInfo.tsx`
- Rename "College of Engineering & Technology" to "College of Engineering"
- Update programs to match: Informatics Engineering, Mechatronics Engineering, Environmental Engineering
- Move Engineering card to first position
- Update Business college programs to include MBA, MSc Digital Marketing, MSc Logistics & Supply Chain Management

---

## Section 2: Student Mode Fixes

### 2a. Dashboard - Back Button Fix
**File:** `src/pages/student/StudentDashboard.tsx`
- The dashboard is the root student page; no "back" functionality is needed. The issue is likely browser back navigation looping. No code change needed if sidebar navigation works correctly -- the sidebar links handle navigation.

### 2b. Dashboard - Upcoming Tasks Link to Demo
**File:** `src/pages/student/StudentDashboard.tsx`
- Make the "Start" button on the first upcoming task (Assignment 3) link to a demo assignment page
- Create a new demo route `/student/assignments/demo` with a simple demo assignment form
- Add a visible "DEMO" badge on the button so users know it's a demo

### 2c. Student Lessons - Course Names Blank Fix
**File:** `src/pages/student/StudentLessons.tsx`
- The `CourseSelector` component fetches from DB and courses exist (CCNA1-4). The issue is likely the component rendering before data loads. Add auto-select first course logic and ensure loading state works.
- The "Review/Continue/Start" buttons are non-functional -- link the first lesson (Week 1) to a demo lesson page
- Create demo lesson page `/student/lessons/demo` showing sample slides content
- Add "DEMO" badge on the active demo button

### 2d. Student Quizzes - Course Names Blank + Demo Quiz
**File:** `src/pages/student/StudentQuizzes.tsx`
- Same course selector fix as lessons
- Link "Start Quiz" on Week 3 quiz to a demo quiz page
- Create demo quiz page `/student/quizzes/demo` with 3-5 sample CCNA multiple choice questions
- Add "DEMO" badge on active demo button

---

## Section 3: Teacher Mode Fixes

### 3a. Dashboard - Total Students Link
**File:** `src/pages/teacher/TeacherDashboard.tsx`
- Make "Total Students" stat card clickable, linking to `/teacher/students`
- Change "Approve" button text to "Review" in Grades Pending section
- Link the first "Review" button to a demo grade review page `/teacher/grading/demo`
- Add "DEMO" badge

### 3b. Weekly Lessons - Course Names + Demo View
**File:** `src/pages/teacher/TeacherLessons.tsx`
- Course selector should auto-populate (already fetches from DB -- verify loading)
- Make the first lesson's "View" button link to a demo lesson view page `/teacher/lessons/demo`
- Add "DEMO" badge on active demo button

### 3c. Assignments - Course Names + Demo Submissions
**File:** `src/pages/teacher/TeacherAssignments.tsx`
- Same course selector fix
- Make first assignment's "View Submissions" button link to a demo submissions page `/teacher/assignments/demo`
- Add "DEMO" badge

### 3d. Quizzes - Course Names + Demo View
**File:** `src/pages/teacher/TeacherQuizzes.tsx`
- Same course selector fix
- Make first quiz's "View" button link to a demo quiz review page `/teacher/quizzes/demo`
- Add "DEMO" badge

### 3e. Grade Approval - Course Names + Demo Review
**File:** `src/pages/teacher/TeacherGrading.tsx`
- Same course selector fix
- Make first grade's "Review Submission" button link to a demo review page `/teacher/grading/demo`
- Add "DEMO" badge

### 3f. Students Page - Course Names + Demo Details
**File:** `src/pages/teacher/TeacherStudents.tsx`
- Same course selector fix
- Make first student's "View Details" and "Grades" buttons link to demo pages
- Add "DEMO" badge

---

## New Demo Pages to Create

These are lightweight, static demo pages to showcase functionality:

| Page | Route | Description |
|------|-------|-------------|
| `DemoLesson.tsx` | `/student/lessons/demo` | Shows sample lesson slides with navigation |
| `DemoQuiz.tsx` | `/student/quizzes/demo` | 3-5 CCNA MCQ questions with submit |
| `DemoAssignment.tsx` | `/student/assignments/demo` | Shows assignment questions with text input |
| `TeacherDemoLesson.tsx` | `/teacher/lessons/demo` | Shows lesson content for teacher review |
| `TeacherDemoQuiz.tsx` | `/teacher/quizzes/demo` | Shows quiz questions teacher can review |
| `TeacherDemoSubmissions.tsx` | `/teacher/assignments/demo` | Shows student submissions list |
| `TeacherDemoGradeReview.tsx` | `/teacher/grading/demo` | Shows detailed grade review with approve/reject |
| `TeacherDemoStudentDetail.tsx` | `/teacher/students/demo` | Shows student profile with grades |

Each demo page will have:
- A clear "DEMO MODE" banner at the top
- Back button to return to the parent page
- Static but realistic data

---

## Demo Badge Component

A small reusable badge to indicate demo-active buttons:

```tsx
<Badge className="bg-amber-500 text-white text-[10px] ml-1">DEMO</Badge>
```

---

## Files Summary

| File | Action | Changes |
|------|--------|---------|
| `src/pages/guest/ContactInfo.tsx` | Modify | Phone, remove fax, update apply link |
| `src/pages/guest/ProgramsInfo.tsx` | Modify | Reorder colleges, update programs |
| `src/pages/guest/CollegesInfo.tsx` | Modify | Reorder, rename, update programs |
| `src/pages/student/StudentDashboard.tsx` | Modify | Link Start button to demo assignment |
| `src/pages/student/StudentLessons.tsx` | Modify | Link first lesson to demo |
| `src/pages/student/StudentQuizzes.tsx` | Modify | Link Start Quiz to demo |
| `src/pages/teacher/TeacherDashboard.tsx` | Modify | Link stats, change Approve to Review |
| `src/pages/teacher/TeacherLessons.tsx` | Modify | Link View to demo |
| `src/pages/teacher/TeacherAssignments.tsx` | Modify | Link View Submissions to demo |
| `src/pages/teacher/TeacherQuizzes.tsx` | Modify | Link View to demo |
| `src/pages/teacher/TeacherGrading.tsx` | Modify | Link Review to demo |
| `src/pages/teacher/TeacherStudents.tsx` | Modify | Link View Details/Grades to demo |
| `src/pages/student/DemoLesson.tsx` | Create | Demo lesson page |
| `src/pages/student/DemoQuiz.tsx` | Create | Demo quiz page |
| `src/pages/student/DemoAssignment.tsx` | Create | Demo assignment page |
| `src/pages/teacher/TeacherDemoLesson.tsx` | Create | Teacher demo lesson view |
| `src/pages/teacher/TeacherDemoQuiz.tsx` | Create | Teacher demo quiz view |
| `src/pages/teacher/TeacherDemoSubmissions.tsx` | Create | Teacher demo submissions view |
| `src/pages/teacher/TeacherDemoGradeReview.tsx` | Create | Teacher demo grade review |
| `src/pages/teacher/TeacherDemoStudentDetail.tsx` | Create | Teacher demo student detail |
| `src/App.tsx` | Modify | Add 8 new demo routes |

## Technical Notes

### Course Selector Blank Issue
The courses exist in the database (CCNA1-4, all active). The `useCourses` hook auto-selects the first course. The blank issue may be a timing/rendering issue. The fix is to ensure the component renders the selected value correctly after async fetch completes. Will verify and fix the `CourseSelector` component if needed.

### Demo Pages Pattern
All demo pages follow a consistent pattern:
1. Yellow/amber "DEMO MODE" banner at top
2. Back button linking to parent page
3. Static CCNA-related content
4. Interactive elements (buttons, forms) that show toast feedback
5. No database interaction required
