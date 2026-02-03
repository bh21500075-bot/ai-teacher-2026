
# Plan: AI Teacher Platform – Functional Review & Improvement Implementation

## Overview
This plan addresses all 30+ improvements identified in the functional review, organized into 5 major sections: Main Page, Guest Mode, Teacher Mode, Student Mode, and Missing Features.

---

## Section 1: Main Page & QR Code

### 1.1 Add QR Code to Login Page
**Files:** `src/pages/Login.tsx`

- Generate QR code linking to the live app URL
- Add QR code component below the login cards
- Include onboarding text: "Scan QR to access the platform on your phone or continue on this device"
- Install QR code library: `qrcode.react`

```text
┌─────────────────────────────────────────────────────────────────┐
│                    [UTB Logo]                                    │
│    AI-Powered Educational Robot...                              │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────────┐    ┌──────────────────┐                   │
│  │   Guest Mode     │    │ Teacher/Student  │                   │
│  │   [Bot Icon]     │    │   [User Icon]    │                   │
│  └──────────────────┘    └──────────────────┘                   │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────┐│
│  │       [QR Code]                                             ││
│  │   Scan to access on mobile                                  ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

---

## Section 2: Guest Mode Improvements

### 2.1 Rename "Log In" to "Home"
**Files:** `src/components/layout/GuestLayout.tsx`
- Change button text from "Log In" to "Home"
- Keep the same functionality (returns to login page)

### 2.2 Add Microphone Button & Voice Interaction
**Files:** `src/pages/guest/GuestChat.tsx`, `supabase/functions/guest-chat/index.ts`
- Import and use `useVoiceChat` hook (already exists in project)
- Add microphone toggle button similar to StudentChat
- Add voice output for AI responses
- Update guest-chat edge function to support voice context

### 2.3 Add QR Code in Guest Mode
**Files:** `src/pages/guest/GuestChat.tsx`, `src/components/layout/GuestLayout.tsx`
- Add QR code component in the header or contact section
- Make QR visible without login

---

## Section 3: Teacher Mode Improvements

### 3.1 Rename "Select CCNA Level" to "Select Course"
**Files:** `src/pages/teacher/TeacherContent.tsx`
- Change header from "Select CCNA Level" to "Select Course"
- Change dropdown labels:
  - CCNA1 → Network 1
  - CCNA2 → Network 2
  - CCNA3 → Network 3
  - CCNA4 → Network 4

### 3.2 Add Course Selection Dropdown to All Teacher Pages

**Files to modify:**
- `src/pages/teacher/TeacherLessons.tsx`
- `src/pages/teacher/TeacherAssignments.tsx`
- `src/pages/teacher/TeacherQuizzes.tsx`
- `src/pages/teacher/TeacherGrading.tsx`
- `src/pages/teacher/TeacherStudents.tsx`

Each page will get:
```tsx
// Import Select components
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Add state
const [courses, setCourses] = useState<Course[]>([]);
const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

// Add Course Selection Card at top
<Card className="border-0 shadow-sm mb-6">
  <CardContent className="p-4">
    <label>Select Course</label>
    <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
      <SelectTrigger><SelectValue placeholder="Select a course" /></SelectTrigger>
      <SelectContent>
        <SelectItem value="ccna1">Network 1</SelectItem>
        <SelectItem value="ccna2">Network 2</SelectItem>
        <SelectItem value="ccna3">Network 3</SelectItem>
        <SelectItem value="ccna4">Network 4</SelectItem>
      </SelectContent>
    </Select>
  </CardContent>
</Card>
```

### 3.3 Add "Generate with AI" Buttons
**Files:**
- `src/pages/teacher/TeacherLessons.tsx` - Add "Generate Lesson with AI" button
- `src/pages/teacher/TeacherAssignments.tsx` - Add "Generate Assignment with AI" button
- `src/pages/teacher/TeacherQuizzes.tsx` - Already has AI generator, verify it works

### 3.4 Add AI Voice Interaction for Teachers
**Files:** Create `src/pages/teacher/TeacherChat.tsx`
- New page for teacher-AI interaction
- Add to sidebar menu in `AppSidebar.tsx`
- Use same voice hook as StudentChat
- Focus on getting AI feedback about lessons, assignments, quizzes

---

## Section 4: Student Mode Improvements

### 4.1 Remove Level Buttons, Use Chat/Voice Selection
**Files:** `src/pages/student/StudentChat.tsx`, `supabase/functions/ai-chat/index.ts`

Current behavior:
```text
[Level 1 Button] [Level 2 Button] [Level 3 Button] [Level 4 Button]
```

New behavior:
- Remove the 4 visual level cards
- Allow students to select via:
  1. Text: "I want to study Network 2"
  2. Voice: "Let me work on Network 1"
- If no course selected, AI answers generally across all materials
- If course selected, AI focuses on that course's materials

Update AI prompt logic:
```typescript
// If no course selected
"You are an AI tutor for CCNA 200-301. The student hasn't selected a specific course. 
Answer questions generally, and if you detect they're asking about a specific level's topic, 
ask: 'Would you like me to focus on Network 1/2/3/4 for more targeted help?'"

// If course selected via chat
"You are focused on Network ${level}. Answer questions based on this level's materials."
```

### 4.2 Add Course Selection Dropdown to Student Pages
**Files:**
- `src/pages/student/StudentLessons.tsx`
- `src/pages/student/StudentQuizzes.tsx`
- `src/pages/student/StudentGrades.tsx`

Add same dropdown pattern as teacher pages with course filtering.

### 4.3 Improve Grades Page with Course Breakdown
**Files:** `src/pages/student/StudentGrades.tsx`
- Add course selector tabs/dropdown
- Show grades organized by course
- Display breakdown: Assignments, Quizzes, Final for each course

---

## Section 5: Missing Features (Recommended)

### 5.1 AI Explanation Modes
**Files:** `src/pages/student/StudentChat.tsx`, `supabase/functions/ai-chat/index.ts`

Add toggle for explanation modes:
- Simple: Easy-to-understand explanations
- Exam-focused: Concise, exam-relevant answers
- Advanced: Deep technical explanations

UI: Toggle buttons or dropdown above the chat input

### 5.2 Error Handling Improvements
**Files:** Multiple pages
- Show clear error when no course is selected
- Show warning when no materials uploaded for a course

---

## Files Summary

| File | Changes |
|------|---------|
| `package.json` | Add `qrcode.react` dependency |
| `src/pages/Login.tsx` | Add QR code component |
| `src/components/layout/GuestLayout.tsx` | Change "Log In" → "Home", add QR |
| `src/pages/guest/GuestChat.tsx` | Add voice support with useVoiceChat hook |
| `src/pages/teacher/TeacherContent.tsx` | Rename CCNA → Network, update labels |
| `src/pages/teacher/TeacherLessons.tsx` | Add course dropdown + AI generate button |
| `src/pages/teacher/TeacherAssignments.tsx` | Add course dropdown + AI generate button |
| `src/pages/teacher/TeacherQuizzes.tsx` | Add course dropdown (AI button exists) |
| `src/pages/teacher/TeacherGrading.tsx` | Add course dropdown filter |
| `src/pages/teacher/TeacherStudents.tsx` | Add course dropdown filter |
| `src/pages/teacher/TeacherChat.tsx` | NEW - AI chat for teachers |
| `src/components/layout/AppSidebar.tsx` | Add "AI Assistant" menu item for teachers |
| `src/pages/student/StudentChat.tsx` | Remove level cards, add chat-based selection |
| `src/pages/student/StudentLessons.tsx` | Add course dropdown |
| `src/pages/student/StudentQuizzes.tsx` | Add course dropdown |
| `src/pages/student/StudentGrades.tsx` | Add course breakdown view |
| `supabase/functions/ai-chat/index.ts` | Update for flexible course selection |

---

## Implementation Phases

**Phase 1: Core UI Changes**
1. Add QR code to Login and Guest pages
2. Rename labels (Log In → Home, CCNA → Network)
3. Add course dropdowns to all teacher/student pages

**Phase 2: Voice & AI Improvements**
4. Add voice support to Guest Chat
5. Create Teacher AI Chat page
6. Update Student Chat to remove level cards
7. Update AI edge function for flexible course selection

**Phase 3: AI Generation Features**
8. Add AI lesson generation for teachers
9. Add AI assignment generation for teachers
10. Add AI explanation modes for students

---

## Technical Notes

### Course Naming Convention
- Database: Keep codes as CCNA1, CCNA2, CCNA3, CCNA4
- UI Display: Show as Network 1, Network 2, Network 3, Network 4

### QR Code Implementation
```tsx
import { QRCodeSVG } from 'qrcode.react';

<QRCodeSVG 
  value="https://ai-teacher-2026.lovable.app" 
  size={120}
  className="mx-auto"
/>
```

### Shared Course Selector Component
Consider creating a reusable component:
```tsx
// src/components/CourseSelector.tsx
export function CourseSelector({ 
  value, 
  onChange,
  label = "Select Course" 
}: CourseSelectorProps) {
  // Shared implementation
}
```

This will reduce code duplication across 8+ pages.
