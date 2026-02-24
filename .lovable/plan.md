

# Update Welcome Message in All Chat Pages

## Overview
Change the initial AI greeting in all three chat interfaces (Student, Teacher, Guest) to the new welcome message.

## Changes

### 1. Guest Chat
**File:** `src/pages/guest/GuestChat.tsx` (line 26)

Replace the current welcome message with:
```
Hello, I am AI Educational Bot, Your AI Tutor for Network Subjects?
```

### 2. Student Chat
**File:** `src/pages/student/StudentChat.tsx` (lines 78-91)

Replace the current welcome message with:
```
Hello, I am AI Educational Bot, Your AI Tutor for Network Subjects?
```
Keep the course list and course selection hint below the greeting so students still know what courses are available.

### 3. Teacher Chat
**File:** `src/pages/teacher/TeacherChat.tsx` (lines 62-72)

Replace the current welcome message with:
```
Hello, I am AI Educational Bot, Your AI Tutor for Network Subjects?
```
Keep the feature list (Lesson Feedback, Assignment Review, etc.) and current course info below the greeting so teachers still know what the bot can do.

## Technical Details
- Only the opening line changes in each file
- The rest of the welcome content (course lists, feature descriptions) remains intact
- No new dependencies or components needed

