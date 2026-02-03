

# Plan: Guest Mode for University Visitors

## Overview
Add a Guest Mode that allows visitors to explore university information and access selected materials without logging in. Based on the provided UI reference, guests will have access to:
- Information about University of Technology Bahrain
- Colleges and programs information  
- Contact information
- Campus facilities details
- A chat interface to ask about the university (but NOT course-specific questions)

## Architecture

```text
┌─────────────────────────────────────────────────────────────────┐
│                        Login Page                                │
│  ┌──────────────────┐              ┌──────────────────────────┐ │
│  │                  │              │                          │ │
│  │   Guest Mode     │              │   Teacher / Student      │ │
│  │   🤖 + UTB Logo  │   ──────►    │   Login with ID          │ │
│  │                  │              │                          │ │
│  │   LEARN MORE     │              │   [T001/S001]            │ │
│  │                  │              │                          │ │
│  └──────────────────┘              └──────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Guest Dashboard                               │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ About University of Technology Bahrain                     │ │
│  │                                                            │ │
│  │ [Colleges]  [Programs]  [Contact Us]                       │ │
│  │                                                            │ │
│  │ ┌────────────────────────────────────────────────────────┐│ │
│  │ │ 🤖 Hello! Ask me anything about the University of      ││ │
│  │ │    Technology Bahrain, its colleges, or campus         ││ │
│  │ │    facilities!                                         ││ │
│  │ │                                                        ││ │
│  │ │ [💬 Type your question...]           [🎤]  [Send]      ││ │
│  │ └────────────────────────────────────────────────────────┘│ │
│  │                                                            │ │
│  │                           [Tap to Ask →]                   │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Implementation Steps

### Step 1: Update AuthContext
**File**: `src/contexts/AuthContext.tsx`

Add `guest` as a possible role and a `loginAsGuest` function:

```typescript
export type UserRole = 'teacher' | 'student' | 'guest' | null;

// Add guest user
const guestUser: User = {
  id: 'GUEST',
  name: 'Guest',
  role: 'guest'
};

// Add loginAsGuest function
const loginAsGuest = () => {
  setUser(guestUser);
};
```

### Step 2: Update Login Page
**File**: `src/pages/Login.tsx`

Add a Guest Mode section following the UI reference:

```tsx
// Two-column layout on the login page
<div className="grid grid-cols-2 gap-4">
  {/* Guest Mode Card */}
  <Card onClick={handleGuestLogin} className="cursor-pointer hover:border-primary">
    <CardContent className="text-center p-6">
      <Bot className="w-16 h-16 mx-auto text-primary" />
      <p className="text-sm text-muted-foreground">Guest Mode</p>
      <img src={logo} className="h-8 mx-auto mt-2" />
      <Button className="mt-4">LEARN MORE</Button>
    </CardContent>
  </Card>
  
  {/* Teacher/Student Login Card */}
  <Card>
    <CardContent>
      {/* Existing login form */}
    </CardContent>
  </Card>
</div>
```

### Step 3: Create Guest Chat Page
**File**: `src/pages/guest/GuestChat.tsx`

A specialized chat interface for university information only:

```tsx
const GuestChat = () => {
  // Similar to StudentChat but:
  // - No course selection (courseId = null)
  // - Different AI prompt focused on university info
  // - Different welcome message
  // - No voice features (simpler interface)
  // - Navigation tabs: Colleges, Programs, Contact Us
  
  const initialMessage = {
    role: 'assistant',
    content: `Hello! Ask me anything about the University of Technology Bahrain, 
    its colleges, or campus facilities!`
  };
  
  // Chat will use a different edge function or modified prompt
};
```

### Step 4: Create Guest Layout
**File**: `src/components/layout/GuestLayout.tsx`

A simpler layout for guests without the full sidebar:

```tsx
export function GuestLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Simple header with logo and Back to Login */}
      <header className="h-16 border-b bg-card flex items-center justify-between px-4">
        <img src={logo} alt="UTB" className="h-10" />
        <div className="flex items-center gap-4">
          <span>About University of Technology Bahrain</span>
          <Button variant="outline" onClick={goToLogin}>
            <LogIn className="w-4 h-4 mr-2" />
            Log In
          </Button>
        </div>
      </header>
      
      {/* Navigation Tabs */}
      <nav className="flex justify-center gap-4 p-4 border-b">
        <Button variant="ghost">Colleges</Button>
        <Button variant="ghost">Programs</Button>
        <Button variant="ghost">Contact Us</Button>
      </nav>
      
      {/* Content */}
      <main className="p-4">
        {children}
      </main>
    </div>
  );
}
```

### Step 5: Create Guest AI Edge Function
**File**: `supabase/functions/guest-chat/index.ts`

A modified chat function specifically for university information:

```typescript
const systemInstruction = `You are a helpful assistant for the University of Technology Bahrain (UTB).

Your role is to:
1. Answer questions about UTB's colleges and programs
2. Provide information about campus facilities
3. Share contact information and admission details
4. Explain UTB's history and achievements

IMPORTANT RULES:
- You are NOT a course tutor - do not answer course-specific questions
- If asked about specific courses, politely explain that the user needs to log in as a student
- Focus only on general university information
- Be friendly and welcoming to prospective students and visitors

University Information:
- Location: Kingdom of Bahrain
- Colleges: Engineering, Business, IT, etc.
- Contact: [university contact details]
`;
```

### Step 6: Update App Routes
**File**: `src/App.tsx`

Add guest routes that are accessible without full authentication:

```tsx
// Guest Routes (accessible after selecting Guest Mode)
<Route path="/guest" element={
  user?.role === 'guest' ? <GuestChat /> : <Navigate to="/" replace />
} />
```

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `src/contexts/AuthContext.tsx` | Modify | Add 'guest' role and loginAsGuest function |
| `src/pages/Login.tsx` | Modify | Add Guest Mode selection card |
| `src/pages/guest/GuestChat.tsx` | Create | Guest chat interface with UTB info |
| `src/components/layout/GuestLayout.tsx` | Create | Simple header layout for guests |
| `supabase/functions/guest-chat/index.ts` | Create | AI chat for university info only |
| `src/App.tsx` | Modify | Add guest routes |

## Guest Limitations vs Student

| Feature | Guest | Student |
|---------|-------|---------|
| View university info | Yes | Yes |
| Ask about UTB | Yes | Yes |
| Ask course questions | No | Yes |
| Voice chat | No | Yes |
| View course materials | No | Yes |
| Submit assignments | No | Yes |
| Take quizzes | No | Yes |

## Technical Details

### Database Changes
No database changes required - guests don't store data.

### Edge Function
The `guest-chat` function will:
- Not require courseId
- Use a UTB-focused system prompt
- Not access course materials table
- Have static university information embedded in the prompt

### Security
- Guest users cannot access `/student/*` or `/teacher/*` routes
- Guest chat function doesn't access any course or student data
- All guest interactions are read-only informational queries

