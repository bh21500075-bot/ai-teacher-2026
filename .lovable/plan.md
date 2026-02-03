

# Plan: Add Navigation Functionality to Guest Layout

## Issue
The navigation buttons (Colleges, Programs, Contact Us) in the Guest Layout header are currently non-functional. They have no `onClick` handlers attached.

## Solution
Add state management and content sections that display when each navigation tab is clicked, while keeping the chat interface accessible.

## Architecture

```text
┌─────────────────────────────────────────────────────────────────┐
│  Header: UTB Logo                              [Log In]          │
├─────────────────────────────────────────────────────────────────┤
│      [Colleges]    [Programs]    [Contact Us]    [Chat]         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   When "Colleges" is clicked:                                   │
│   ┌────────────────────────────────────────────────────────┐    │
│   │  College of Engineering                                │    │
│   │  College of Business & Management                      │    │
│   │  College of Information Technology                     │    │
│   └────────────────────────────────────────────────────────┘    │
│                                                                  │
│   When "Programs" is clicked:                                   │
│   ┌────────────────────────────────────────────────────────┐    │
│   │  Bachelor Programs: BSCS, BSIT, BSIE, BSME...          │    │
│   │  Master Programs: MBA                                   │    │
│   └────────────────────────────────────────────────────────┘    │
│                                                                  │
│   When "Contact Us" is clicked:                                 │
│   ┌────────────────────────────────────────────────────────┐    │
│   │  Address: P.O. Box 18041, Building 829...              │    │
│   │  Phone: +973 1700 5577                                  │    │
│   │  Email: info@utb.edu.bh                                 │    │
│   └────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Implementation Steps

### Step 1: Update GuestLayout.tsx
Add state for active tab and pass it to children:

```tsx
import { useState } from 'react';

type GuestTab = 'chat' | 'colleges' | 'programs' | 'contact';

export function GuestLayout({ children, activeTab, onTabChange }) {
  return (
    <nav>
      <Button 
        variant={activeTab === 'colleges' ? 'default' : 'ghost'}
        onClick={() => onTabChange('colleges')}
      >
        Colleges
      </Button>
      {/* Similar for Programs, Contact Us, Chat */}
    </nav>
  );
}
```

### Step 2: Create Content Components
Create three new components for the information pages:

- `src/pages/guest/CollegesInfo.tsx` - College listings with descriptions
- `src/pages/guest/ProgramsInfo.tsx` - All programs organized by college  
- `src/pages/guest/ContactInfo.tsx` - Contact details, map, office hours

### Step 3: Update GuestChat.tsx
Manage tab state and conditionally render content:

```tsx
const [activeTab, setActiveTab] = useState<GuestTab>('chat');

return (
  <GuestLayout activeTab={activeTab} onTabChange={setActiveTab}>
    {activeTab === 'chat' && <ChatInterface />}
    {activeTab === 'colleges' && <CollegesInfo />}
    {activeTab === 'programs' && <ProgramsInfo />}
    {activeTab === 'contact' && <ContactInfo />}
  </GuestLayout>
);
```

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `src/components/layout/GuestLayout.tsx` | Modify | Add activeTab prop and onClick handlers |
| `src/pages/guest/GuestChat.tsx` | Modify | Add tab state management and conditional rendering |
| `src/pages/guest/CollegesInfo.tsx` | Create | College information cards |
| `src/pages/guest/ProgramsInfo.tsx` | Create | Programs listing by college |
| `src/pages/guest/ContactInfo.tsx` | Create | Contact details and location |

## Content Details

### Colleges Information
Based on UTB documents:
- **College of Engineering & Technology** - BSIE, BSME, BSEnE programs
- **College of Administrative & Financial Sciences** - BSBI, BSIB, BSAF, MBA programs
- **College of Computer Studies** - BSCS, BSIT programs

### Programs Information
Organized table with:
- Program name (e.g., Bachelor of Science in Computer Science)
- Abbreviation (BSCS)
- Duration (4 years / 132 credit hours)
- Accreditation status (ABET, ECBE where applicable)

### Contact Information
- **Address**: P.O. Box 18041, Building 829, Road 1213, Salmabad 712, Kingdom of Bahrain
- **Phone**: +973 1700 5577
- **Fax**: +973 1702 2233
- **Email**: info@utb.edu.bh
- **Website**: www.utb.edu.bh

