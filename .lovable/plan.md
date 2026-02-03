
# Plan: Multi-Level Course Selection for CCNA 200-301

## Overview
Implement a course selection system where the AI tutor asks students which CCNA level they're studying before answering questions, ensuring responses are specific to that level's materials.

## Current Structure Analysis
The system currently has 4 sets of course materials organized by CCNA levels:

| Level | Course Name | Topics |
|-------|-------------|--------|
| Level 1 | Networking 1 | Introduction, Network Models, OSI Layers, IP Addressing, Subnetting |
| Level 2 | Routing | Routers, Static Routing, RIP, EIGRP, OSPF |
| Level 3 | Switching | VLANs, VTP, Spanning Tree, Inter-VLAN Routing, WLAN |
| Level 4 | WAN | WAN Concepts, PPP, ACLs, Network Security, QoS |

## Architecture

```text
┌─────────────────────────────────────────────────────────────────┐
│                        Student Chat                              │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  AI: Welcome! Which CCNA level are you studying?          │ │
│  │                                                            │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │ │
│  │  │ Level 1  │ │ Level 2  │ │ Level 3  │ │ Level 4  │       │ │
│  │  │Networking│ │ Routing  │ │Switching │ │   WAN    │       │ │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              │                                   │
│                              ▼                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Student selects Level 2                                   │ │
│  │  AI: Great! I'm ready to help with CCNA Level 2 - Routing  │ │
│  │      Ask me about Static Routing, RIP, EIGRP, OSPF...      │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              │                                   │
│                              ▼                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Student: Explain OSPF areas                               │ │
│  │  AI: [Answers from Level 2 materials ONLY]                 │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Implementation Steps

### Step 1: Create 4 Separate Courses
Create 4 courses in the database for each CCNA level:

```sql
INSERT INTO courses (code, title, description, teacher_id, is_active) VALUES
('CCNA1', 'CCNA 200-301 Level 1: Networking Fundamentals', '...', teacher_id, true),
('CCNA2', 'CCNA 200-301 Level 2: Routing', '...', teacher_id, true),
('CCNA3', 'CCNA 200-301 Level 3: Switching', '...', teacher_id, true),
('CCNA4', 'CCNA 200-301 Level 4: WAN Technologies', '...', teacher_id, true);
```

### Step 2: Update StudentChat.tsx
Modify the student chat interface to:
1. Fetch all available courses (not just one)
2. Show a course/level selector before starting the chat
3. Store the selected course for the session
4. Display which level is currently selected

```tsx
// New state for course selection
const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
const [showCourseSelector, setShowCourseSelector] = useState(true);

// Initial welcome message asks for level selection
const initialMessage = {
  role: 'assistant',
  content: `Hello! I'm EduBot, your AI Tutor for CCNA 200-301.
  
Please select which level you're studying:
- **Level 1**: Networking Fundamentals (OSI, IP Addressing, Subnetting)
- **Level 2**: Routing (Static, RIP, EIGRP, OSPF)
- **Level 3**: Switching (VLANs, STP, Inter-VLAN)
- **Level 4**: WAN (ACLs, Security, QoS)`
};
```

### Step 3: Add Course Selection UI Component
Create clickable level selection cards:

```tsx
// Level selection cards
<div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-4">
  {availableCourses.map(course => (
    <Card 
      key={course.id}
      onClick={() => selectCourse(course)}
      className="cursor-pointer hover:ring-2 ring-primary"
    >
      <CardContent className="p-4 text-center">
        <span className="text-2xl">📚</span>
        <h4>Level {course.code.replace('CCNA', '')}</h4>
        <p className="text-sm">{course.title}</p>
      </CardContent>
    </Card>
  ))}
</div>
```

### Step 4: Update AI Chat Edge Function
Modify the AI prompt to be level-specific:

```typescript
const systemInstruction = `You are an AI tutor for CCNA 200-301 ${courseName}.

IMPORTANT RULES:
1. ONLY answer questions related to ${courseName} topics
2. If asked about topics from OTHER levels, politely redirect:
   - "That topic is covered in Level X. Would you like to switch?"
3. Base answers on the course materials provided below
4. For Level 1: Focus on networking basics, OSI model, IP addressing
   For Level 2: Focus on routing protocols (RIP, EIGRP, OSPF)
   For Level 3: Focus on switching (VLANs, STP)
   For Level 4: Focus on WAN technologies (ACLs, Security)

${courseContext}
`;
```

### Step 5: Reassign Materials to Correct Courses
Move existing materials to their respective course levels based on the topics.txt files.

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| Database | Modify | Create 4 CCNA courses, reassign materials |
| `src/pages/student/StudentChat.tsx` | Modify | Add multi-course selection UI |
| `supabase/functions/ai-chat/index.ts` | Modify | Update prompt for level-specific answers |
| `src/pages/teacher/TeacherContent.tsx` | Modify | Allow selecting which level to upload to |

## User Experience Flow

1. Student opens AI Tutor chat
2. AI greets and shows 4 level buttons
3. Student clicks "Level 2: Routing"
4. AI confirms: "Great! I'll help you with Routing topics. Ask about OSPF, EIGRP, etc."
5. Student asks: "How does OSPF work?"
6. AI answers using Level 2 materials only
7. If student asks about VLANs (Level 3 topic), AI says: "VLANs are covered in Level 3 (Switching). Would you like to switch?"

## Technical Details

### Course Selection Persistence
- Store selected course in state during chat session
- Allow switching courses via a dropdown in the header
- Each course fetches only its own materials from `course_materials`

### Material Organization
Current materials will be reassigned:
- Level 1: ch01-ch10 (Introduction through Physical Layer)
- Level 2: Routing materials (Routers, RIP, EIGRP, OSPF)
- Level 3: Switching materials (VLANs, VTP, STP, Inter-VLAN)
- Level 4: WAN materials (WAN Concepts, PPP, ACLs, Security, QoS)
