

# Add Programme Specification Documents to Guest AI Knowledge Base

## Overview
Extract text from all 8 uploaded programme specification DOCX files and insert them into the `guest_documents` table, so the guest chat AI can answer questions about study plans, course structures, credit hours, and programme details.

## Documents to Process
1. BSAF (Accounting & Finance)
2. BSBI (Business Informatics)
3. BSCS (Computer Science)
4. BSEnE (Environmental Engineering)
5. BSIB (International Business)
6. BSIE (Informatics Engineering)
7. BSIT (Information Technology)
8. BSME (Mechatronics Engineering)

## Plan

### Step 1: Parse all 8 documents
Use `document--parse_document` to extract text content from each DOCX file.

### Step 2: Insert into `guest_documents` table
For each document, split the content into meaningful sections (programme aims, study plan/curriculum, learning outcomes, course descriptions, etc.) and insert rows into the `guest_documents` table with:
- `document_name`: filename
- `document_title`: e.g. "BSCS Programme Specifications AY 2022-2023"
- `section_title`: e.g. "Study Plan", "Programme Aims", "Course Descriptions"
- `content_text`: the extracted text for that section

This uses a database migration to insert the data, following the same pattern as the existing 7 guest documents.

### Step 3: Update the guest-chat edge function search
The existing RAG search in `guest-chat/index.ts` already queries `guest_documents` with full-text search, so no code changes are needed -- the new documents will automatically be found and used as context.

## Technical Details
- The `guest_documents` table has INSERT restricted (no RLS policy for insert), so we'll use a migration with `SECURITY DEFINER` or direct SQL INSERT statements
- Each document is ~20-30 pages; we'll chunk into sections of reasonable size for search relevance
- The existing full-text search (`textSearch`) will match against the new content automatically

