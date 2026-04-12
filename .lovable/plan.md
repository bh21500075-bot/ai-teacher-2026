

# Add 11 Programme Specification Documents to Guest AI Knowledge Base

## Overview
Parse all 11 uploaded programme specification DOCX files (8 undergraduate + 3 postgraduate) and insert them into the `guest_documents` table, so the guest chat AI can answer detailed questions about study plans, course structures, credit hours, and programme details.

## Documents to Process

**Undergraduate (8):**
1. BSAF - Accounting & Finance (AY 2022-2023)
2. BSBI - Business Informatics (AY 2021-2022)
3. BSCS - Computer Science (AY 2022-2023)
4. BSEnE - Environmental Engineering (AY 2022-2023)
5. BSIB - International Business (AY 2021-2022)
6. BSIE - Informatics Engineering (AY 2022-2023)
7. BSIT - Information Technology (AY 2022-2023)
8. BSME - Mechatronics Engineering (AY 2019-2020)

**Postgraduate (3):**
9. MBA - Master of Business Administration (AY 2021-2022)
10. MSDM - Master of Science in Digital Marketing (AY 2024-2025)
11. MSLSCM - Master of Science in Logistics & Supply Chain Management (AY 2024-2025)

## Steps

### Step 1: Parse all 11 documents
Use `document--parse_document` to extract text from each DOCX file.

### Step 2: Insert into `guest_documents` table
For each document, chunk content into sections (Programme Overview, Study Plan, Course Descriptions, Learning Outcomes, etc.) and insert via the database insert tool. Each row will have:
- `document_name`: filename
- `document_title`: e.g. "BSCS Programme Specifications AY 2022-2023"
- `section_title`: e.g. "Study Plan", "Programme Aims"
- `content_text`: the section text

### Step 3: Verify
Query the `guest_documents` table to confirm all new rows are present and searchable.

## Technical Details
- The `guest_documents` table only allows SELECT publicly; inserts use the database insert tool (service role)
- Content chunked into ~2000-5000 character sections for optimal search relevance
- The existing `guest-chat` edge function already searches `guest_documents` with full-text search -- no code changes needed
- New documents will automatically be available for AI responses once inserted

