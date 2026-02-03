

# Plan: Guest Mode Document Access

## Overview
Enable the Guest Mode to access information from 7 official UTB documents by creating a document storage system and updating the guest chat to use Retrieval-Augmented Generation (RAG).

## Documents to Include

| Document | Purpose |
|----------|---------|
| UTB-Student-Handbook-AY25-26.docx | Student policies, admissions, academic info |
| UTB-University-Catalogue-AY25-26.docx | Programs, facilities, services |
| UTB-Faculty-Manual-AY25-26.docx | Faculty information, structure |
| UTB-Admin-Staff-Manual-AY25-26.docx | Administrative structure |
| UTB-Operations-Manual-AY25-26.docx | Operations procedures |
| UTB-Quality-Manual-AY25-26.docx | Quality policies |
| UTB-Standing-Committees-Guidelines-AY25-26.docx | Committee guidelines |

## Architecture

```text
┌─────────────────────────────────────────────────────────────────┐
│                         Guest Chat                               │
│                                                                  │
│  User: "What programs does UTB offer?"                          │
│                              │                                   │
│                              ▼                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              guest-chat Edge Function                       │ │
│  │                                                             │ │
│  │  1. Search guest_documents table for relevant content       │ │
│  │  2. Include matched content in AI prompt                    │ │
│  │  3. Generate response with accurate UTB information         │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              │                                   │
│                              ▼                                   │
│  AI: "UTB offers Bachelor programs in Engineering,              │
│       Computer Science, Business... Master programs..."         │
└─────────────────────────────────────────────────────────────────┘
```

## Implementation Steps

### Step 1: Create Database Table
Create a new table `guest_documents` to store the document content for guest access:

```sql
CREATE TABLE guest_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  document_name TEXT NOT NULL,
  document_title TEXT NOT NULL,
  content_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Allow public read access for guest chat
ALTER TABLE guest_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read guest documents" ON guest_documents
  FOR SELECT USING (true);
```

### Step 2: Copy Documents to Project
Copy the 7 uploaded documents to a project folder for processing.

### Step 3: Create Document Upload Tool
Create an admin page or script to upload and process the documents into the `guest_documents` table.

### Step 4: Update Guest Chat Edge Function
Modify `supabase/functions/guest-chat/index.ts` to:
1. Search the `guest_documents` table for relevant content based on user query
2. Include the matched document content in the AI prompt
3. Generate accurate responses from official UTB documents

```typescript
// Updated guest-chat function
const searchDocuments = async (query: string, supabase: any) => {
  // Full-text search or keyword matching
  const { data, error } = await supabase
    .from('guest_documents')
    .select('document_title, content_text')
    .textSearch('content_text', query.split(' ').join(' | '));
  
  return data || [];
};

// Include document context in AI prompt
const systemPrompt = `You are a UTB assistant. Use the following 
document content to answer questions accurately:

${relevantDocuments.map(d => d.content_text).join('\n\n')}

IMPORTANT: Base your answers on the provided documents.`;
```

### Step 5: Pre-populate Documents
Insert the extracted content from all 7 documents into the database. Key content includes:

**From University Catalogue:**
- Programs: BSCS, BSIT, BSIE, BSME, BSEnE, BSBI, BSIB, BSAF, MBA
- Accreditations: ABET, ECBE
- Facilities: Labs, Library, Sports, Clinic, Cafeteria

**From Student Handbook:**
- Admission requirements (60% minimum, English/Math proficiency)
- Vision, Mission, Values
- Student services, clubs, organizations

**From Other Manuals:**
- University structure (Organogram)
- Contact information
- Policies and procedures

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| Database migration | Create | Add `guest_documents` table |
| `supabase/functions/guest-chat/index.ts` | Modify | Add document search and RAG |
| `src/pages/guest/GuestChat.tsx` | Modify | Update UI to show document sources |
| `public/guest-docs/` | Create | Store documents for reference |

## Database Schema

```text
┌─────────────────────────────────────────┐
│          guest_documents                 │
├─────────────────────────────────────────┤
│ id              UUID (PK)               │
│ document_name   TEXT (file name)        │
│ document_title  TEXT (display name)     │
│ content_text    TEXT (full content)     │
│ section         TEXT (optional section) │
│ created_at      TIMESTAMP               │
└─────────────────────────────────────────┘
```

## Technical Details

### Document Processing
Each document will be split into manageable sections (by chapter/heading) for more accurate retrieval. Estimated total content:
- Student Handbook: ~1,160 lines
- University Catalogue: ~1,886 lines
- Faculty Manual: ~1,508 lines
- Admin Staff Manual: ~1,249 lines
- Plus 3 more documents

### Search Strategy
1. **Keyword matching**: Match user query keywords against document content
2. **Section prioritization**: Return most relevant sections first
3. **Context limit**: Include up to 8,000 tokens of relevant content in prompt

### Guest Limitations (Unchanged)
- Cannot access course-specific materials
- Cannot ask about specific course content
- Can only get general university information from these 7 documents

## User Experience

```text
Guest: "What are the admission requirements?"

AI: "Based on the UTB Student Handbook, the admission requirements are:

1. **General Requirements:**
   - Minimum 60% in Secondary School Certificate (Thanawya)
   - Complete admission application with required documents

2. **English Proficiency:**
   - 80% or higher in English courses, OR
   - IELTS 5.0+ or TOEFL 450+, OR
   - Pass English Placement Test (51%+)

3. **Mathematics Requirements:**
   - Varies by program (70% for Engineering, 60% for Business)

For more details, please contact the Admissions Office or visit www.utb.edu.bh"
```

