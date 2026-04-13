

# Reformat BSAF Study Plan to Professional Format

## Objective
Extract all course data from the uploaded BSAF Programme Specifications document and insert professionally formatted study plan entries into the `guest_documents` table, matching the BSIE/BSME/BSEnE format.

## Current State
- Document parsed successfully (5,351 lines) — contains full study plan tables
- **No existing BSAF entries** in the database (clean insert, no deletion needed)
- Already extracted: Foundation Year, Year 1, Year 2 (partial Year 2 Third Trimester seen)
- Still need to read: remainder of Year 2 T3, Year 3, Year 4

## Steps

### Step 1: Finish extracting all course data
Read lines 1400-2200+ from the parsed document to capture Years 3 and 4 course tables with codes, titles, lec/lab hours, credits, and prerequisites.

### Step 2: Insert professionally formatted entries
Insert rows into `guest_documents` with:
- `document_name`: `BSAF-Programme-Specifications-AY2022-2023.docx`
- `document_title`: `BSAF Programme Specifications AY 2022-2023`
- Sections: Programme Overview, Foundation Year, Year 1, Year 2, Year 3, Year 4

**Format per course:**
```
CODE Title (X Lec, X Lab, X Credits) Prereq: XXX
```

**Example from extracted data:**
```
SECOND YEAR - FIRST TRIMESTER:
MGT703 Business & Technology 3 (3 Lec, 0 Lab, 3 Credits) Prereq: MGT605
ACC704 Management Accounting 2 (3 Lec, 0 Lab, 3 Credits) Prereq: ACC603
FIN711 Introduction to FinTech (3 Lec, 0 Lab, 3 Credits) Prereq: None
ENGL701 Business Communication (3 Lec, 0 Lab, 3 Credits) Prereq: ENGL611
COMP721 Database Management Systems (2 Lec, 2 Lab, 3 Credits) Prereq: COMP613
ECO602 Macroeconomics (3 Lec, 0 Lab, 3 Credits) Prereq: ECO601
Total: 18 Credits
```

### Step 3: Verify
Query `guest_documents` to confirm all BSAF rows are present with correct formatting.

## Key Details
- Programme: Bachelor of Science in Accounting and Finance (BSAF)
- NQF Level 8, 540 NQF Credits (180 ACS Credits)
- College of Administrative and Financial Sciences (CAFS)
- No code changes needed — guest-chat edge function already searches `guest_documents`

