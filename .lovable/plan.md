

# Plan: Add Markdown Rendering to All Chat Pages

## Problem
All three chat pages (Student, Teacher, Guest) display AI responses as plain text using `whitespace-pre-wrap`. This means markdown formatting like **bold**, bullet points, headers, and code blocks appear as raw characters instead of being properly formatted.

## Solution
Install `react-markdown` and create a shared `ChatMessage` component that renders AI responses with proper markdown formatting and styling.

## Changes

### 1. Install dependency
- Add `react-markdown` package

### 2. Create shared component: `src/components/ChatMessageContent.tsx`
- A reusable component that takes a message string and renders it with `ReactMarkdown`
- Apply `prose` styling for clean typography (headings, lists, bold, code blocks, etc.)
- Style code blocks with a dark background and proper font
- Keep user messages as plain text (no markdown needed)

### 3. Update three files to use the new component
Replace the plain `<p>` tag in each file:

- **`src/pages/student/StudentChat.tsx`** (line 333): Replace `<p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>` with `<ChatMessageContent content={msg.content} role={msg.role} />`
- **`src/pages/teacher/TeacherChat.tsx`** (line 238): Same replacement
- **`src/pages/guest/GuestChat.tsx`** (line 212): Same replacement

## Technical Details

The `ChatMessageContent` component will:
- Use `react-markdown` to parse and render markdown
- Apply Tailwind `prose` classes for consistent typography
- Style inline code with a subtle background
- Style code blocks with dark background, rounded corners, and horizontal scroll
- Render bullet points, numbered lists, bold, italic, and headers properly
- Keep user messages as simple text without markdown processing

