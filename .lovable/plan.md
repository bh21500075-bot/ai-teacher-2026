

# Reformat BSEnE Study Plan to Professional Format

## Objective
Replace the 6 existing BSEnE entries in `guest_documents` with professionally formatted study plan data extracted from the uploaded document, matching the BSIE/BSME format: `CODE Title (X Lec, X Lab, X Credits) Prereq: XXX`

## Current State
- 6 BSEnE rows exist with basic/unformatted content (IDs identified)
- New document parsed successfully — contains full study plan tables with Course Code, Title, Lec Hrs, Lab Hrs, Credit Units, and Prerequisites for all 4 years + foundation

## Steps

### Step 1: Finish extracting all course data
Continue reading the parsed document (lines 800-2000+) to capture Years 2, 3, and 4 course tables.

### Step 2: Delete old BSEnE study plan entries
```sql
DELETE FROM guest_documents 
WHERE document_name ILIKE '%BSEnE%' 
AND section_title LIKE 'Study Plan%';
```

### Step 3: Insert reformatted entries
Insert 6 new rows (Foundation, Year 1, Year 2, Year 3, Year 4, Electives if any) with content in professional format:

**Example output format:**
```
FIRST YEAR - FIRST TRIMESTER:
MATH611 College Algebra (3 Lec, 0 Lab, 3 Credits) Prereq: None
ENGG601 Engineering Drawing (2 Lec, 2 Lab, 3 Credits) Prereq: None
CHEM611 General Chemistry (2 Lec, 2 Lab, 3 Credits) Prereq: None
ENGL611 English Communication Skills 1 (3 Lec, 0 Lab, 3 Credits) Prereq: None
CSCI611A Introduction to Computing (2 Lec, 2 Lab, 3 Credits) Prereq: None
SOCI600 Sociology (3 Lec, 0 Lab, 3 Credits) Prereq: None
EUTH400 Euthenics 1 (1 Lec, 0 Lab, 0 Credits) Prereq: None
Total: 18 Credits
```

### Step 4: Verify
Query the updated rows to confirm correct formatting and completeness.

## Technical Details
- Uses database insert tool for DELETE + INSERT (no migration needed)
- Document name: `BSEnE-Programme-Specifications-AY2022-2023.docx`
- Document title: `BSEnE Programme Specifications AY 2022-2023`
- No code changes required — guest-chat edge function already searches `guest_documents`

