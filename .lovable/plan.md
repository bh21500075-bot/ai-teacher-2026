

# Fix: Markdown Formatting in Chat Messages

## Problem
Bullet points in welcome messages render inline instead of as proper lists. The `ChatMessageContent` component with `ReactMarkdown` is working, but the welcome message strings use `bullet (dot) characters` instead of proper markdown list syntax.

## Root Cause
ReactMarkdown requires:
1. A blank line before a list starts
2. Lines starting with `- ` or `* ` (dash/asterisk + space) for list items
3. Each list item on its own line

Currently, the welcome messages use `bullet (dot)` characters which ReactMarkdown treats as plain text.

## Changes

### 1. Fix Student Chat welcome message
**File:** `src/pages/student/StudentChat.tsx` (lines 78-91)

Change the welcome message to use proper markdown list syntax:
- Replace `bullet (dot)` with `- **text**` format
- Ensure blank lines before list blocks

### 2. Fix Guest Chat welcome message  
**File:** `src/pages/guest/GuestChat.tsx` (lines 26-34)

Same fix -- replace inline bullet characters with proper markdown list syntax using `- ` prefix on separate lines with blank line before the list.

### 3. Fix Teacher Chat welcome message
**File:** `src/pages/teacher/TeacherChat.tsx` (lines 62-71)

Same fix for the teacher welcome message bullet points.

## Technical Details

```text
BEFORE (renders inline):
  "Feel free to ask me about:\n• Our colleges\n• Admission"

AFTER (renders as proper list):
  "Feel free to ask me about:\n\n- Our colleges\n- Admission"
```

The key differences:
- Use `- ` (dash + space) instead of `bullet (dot)` character
- Add a blank line (`\n\n`) before the list starts
- This tells ReactMarkdown to parse them as `<ul><li>` elements

