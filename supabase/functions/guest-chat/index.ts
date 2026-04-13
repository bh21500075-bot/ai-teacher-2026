import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const ALLOWED_ORIGINS = [
  'https://ai-teacher-2026.lovable.app',
  'https://id-preview--e4fcec7d-aebe-4ec9-8d16-6223a4875a02.lovable.app',
  'https://e4fcec7d-aebe-4ec9-8d16-6223a4875a02.lovableproject.com',
  'http://localhost:5173',
  'http://localhost:8080'
];

function getCorsHeaders(origin: string | null) {
  const allowedOrigin = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
  };
}

const PROGRAM_ALIASES: Record<string, string[]> = {
  BSAF: ['bsaf', 'accounting and finance', 'bachelor of science in accounting and finance'],
  BSBI: ['bsbi', 'business informatics', 'bachelor of science in business informatics'],
  BSCS: ['bscs', 'computer science', 'bachelor of science in computer science'],
  BSIB: ['bsib', 'international business', 'bachelor of science in international business'],
  BSIE: ['bsie', 'informatics engineering', 'bachelor of science in informatics engineering'],
  BSIT: ['bsit', 'information technology', 'bachelor of science in information technology'],
  BSME: ['bsme', 'mechatronics engineering', 'bachelor of science in mechatronics engineering'],
  BSENE: ['bsene', 'bscene', 'environmental engineering', 'bachelor of science in environmental engineering'],
  MBA: ['mba', 'master of business administration'],
  MSDM: ['msdm', 'digital marketing', 'master of science in digital marketing'],
  MSLSCM: ['mslscm', 'logistics and supply chain management', 'master of science in logistics and supply chain management'],
};

const YEAR_PATTERNS = [
  { label: 'First Year', patterns: [/\b1st\b/, /\bfirst year\b/, /\byear 1\b/, /\byear one\b/] },
  { label: 'Second Year', patterns: [/\b2nd\b/, /\bsecond year\b/, /\byear 2\b/, /\byear two\b/] },
  { label: 'Third Year', patterns: [/\b3rd\b/, /\bthird year\b/, /\byear 3\b/, /\byear three\b/] },
  { label: 'Fourth Year', patterns: [/\b4th\b/, /\bfourth year\b/, /\byear 4\b/, /\byear four\b/] },
];

function normalizeMessageContent(content: string) {
  return content.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').replace(/\s+/g, ' ').trim();
}

function detectProgramme(content: string) {
  const normalized = normalizeMessageContent(content);

  for (const [code, aliases] of Object.entries(PROGRAM_ALIASES)) {
    if (aliases.some((alias) => normalized.includes(alias))) {
      return { code, aliases };
    }
  }

  return null;
}

function detectYearLabel(content: string) {
  const normalized = normalizeMessageContent(content);

  for (const year of YEAR_PATTERNS) {
    if (year.patterns.some((pattern) => pattern.test(normalized))) {
      return year.label;
    }
  }

  return null;
}

function isCourseListRequest(content: string) {
  const normalized = normalizeMessageContent(content);
  return ['course', 'courses', 'study plan', 'curriculum', 'subjects', 'modules', 'trimester'].some((term) => normalized.includes(term));
}

const UTB_BASE_KNOWLEDGE = `
=== UNIVERSITY OF TECHNOLOGY BAHRAIN (UTB) - OFFICIAL INFORMATION ===

ABOUT UTB:
The University of Technology Bahrain is decisive and transformative in its quest for more academic recognition and unprecedented commitment to excellence. Located in the Kingdom of Bahrain, UTB offers market-oriented programmes and aims to become the leading university in business, science, and technological innovation.

VISION:
The University of Technology Bahrain will contribute to the advancement and application of knowledge and will have a transformative impact on the lives of learners and the society, whilst continuing to inspire students and the future generations to come.

MISSION:
To contribute to the growth and sustainability of the economy and the expansion of human knowledge in business, science, and technology by fostering continuous innovation and excellence in education and research, strategic partnerships, international recognition, and entrepreneurial development.

VALUES:
1. Excellence and quality
2. Professionalism
3. Creativity and innovation
4. Growth and Development
5. Commitment and engagement
6. Collaboration
7. Integrity

GOALS:
- Maintain an effective governance and management model
- Diversify programme offerings in business, science, and technology
- Create a teaching and learning experience that promotes cross-disciplinary collaboration
- Pursue high-impact research and innovation
- Achieve academic excellence and leadership
- Enhance the culture of community engagement

=== ACADEMIC PROGRAMMES ===

UNDERGRADUATE PROGRAMMES:

College of Administrative and Financial Sciences:
- Bachelor of Science in Business Informatics (BSBI)
- Bachelor of Science in International Business (BSIB)
- Bachelor of Science in Accounting and Finance (BSAF)

College of Computer Studies:
- Bachelor of Science in Computer Science (BSCS) - ABET Accredited
- Bachelor of Science in Information Technology (BSIT) with 3 majors:
  * Applications Development
  * Networking and Cybersecurity
  * Data Analytics and Artificial Intelligence

College of Engineering:
- Bachelor of Science in Informatics Engineering (BSIE)
- Bachelor of Science in Mechatronics Engineering (BSME)
- Bachelor of Science in Environmental Engineering (BSEnE)

POSTGRADUATE PROGRAMMES:
- Master of Business Administration (MBA)
- Master of Science in Digital Marketing (MSDM)
- Master of Science in Logistics and Supply Chain Management (MSLSCM)

FOUNDATION PROGRAMME:
- NCUK International Foundation Year (IFY) - 9 months intensive skills training
  After completing NCUK IFY at UTB, students can progress to degree programmes in UK, USA, Canada, Australia, New Zealand and other destinations.

ACCREDITATIONS:
- Business programmes: European Council for Business Education (ECBE) - Full Accreditation
- Computer Science: ABET (Accreditation Board for Engineering and Technology) CAC (Computing Accreditation Commission)

=== ADMISSION REQUIREMENTS ===

UNDERGRADUATE ADMISSION:

General Requirements:
- Minimum 60% in Secondary School Certificate (Thanawya) or equivalent
- Complete admission application with required documents
- Non-refundable application fee

English Proficiency Requirements (to be exempted from foundation courses):
- 80% or higher in English courses from Secondary School, OR
- IELTS 5.0+ or TOEFL 450+ (paper-based) / 131+ (computer-based), OR
- Pass English Placement Test (OOPT) with score ≥51%

IELTS/TOEFL Exemptions:
- IELTS 5.5 or TOEFL 496 (paper): Exempted from ENGL401/ENGL611
- IELTS 6.0 or TOEFL 546 (paper): Exempted from ENGL401/ENGL611 and ENGL402/ENGL621

Mathematics Requirements by Programme:
- Engineering (BSME, BSEnE, BSIE), Computer Science (BSCS), IT (BSIT): At least 70% in Math
- Business (BSBI, BSAF): At least 70% in Math
- International Business (BSIB): At least 60% in Math

POSTGRADUATE ADMISSION:
- Bachelor's degree with minimum CGPA of 2.75/1.00 or 2.00/4.00
- Interview by panel of two members
- Non-English bachelor's degree: TOEFL 496+ (paper) / 169+ (computer) or IELTS 5.5+

MBA ADMISSION:
- Business degree holders with CGPA 2.75: Exempted from bridging courses
- Non-business degree with 2 years management experience: Exempted from bridging courses

Required Documents (Undergraduate):
1. Admission application form (online or in person)
2. Original Secondary School Certificate and transcript
3. Passport-size photograph
4. Copy of passport and national ID
5. Application fee receipt
6. Certificate of Good Moral Character
7. Student Medical Examination

=== UNIVERSITY FACILITIES ===

ACADEMIC FACILITIES:
- 15 Computer Laboratories (west and north wings)
- Cisco Networking Academy Laboratory with latest routers and switches
- 2 Mechatronics Laboratories with FESTO Didactic Learning System
- Digital Laboratory with De Lorenzo hardware and software
- IMAC Laboratory (25 iMac units for graphics and multimedia)
- Database Laboratory with Oracle, MySQL, MS Access
- Networking Laboratory with Cisco equipment

CAMPUS FACILITIES:
- Administration Building (offices of President, VPs, Library)
- Academic Buildings with technology equipment
- University Library (8am-8pm Sun-Thu, 8am-4pm Fri-Sat)
- Sports Facilities: Football field, Basketball court, Padel field, Tennis court, Ping pong tables
- Cafeteria and snack counters
- Parking (500+ vehicles)
- Clinic (8am-5pm Sun-Thu)
- IT Department with campus-wide WiFi

LIBRARY SERVICES:
- Print collections: books, journals, theses, research abstracts
- E-books and online journal subscriptions (24/7 access)
- On-campus and off-campus access with student credentials
- Individual research stations, computer stations, WiFi
- Collections for business, IT, sciences, and engineering

=== STUDENT SERVICES ===

DEANSHIP OF STUDENT AFFAIRS (DSA):
- Counseling and academic advising
- Student activities planning
- Sports and recreational programmes
- Orientation and transition support
- Graduation and pre-employment activities

GUIDANCE AND COUNSELING:
- Aptitude and interest discovery
- Adjustment to university life
- Self-knowledge and self-realization
- Career counseling

ACADEMIC ADVISING:
- Assigned advisor upon admission
- Study plan assistance
- Academic performance monitoring

STUDENT ORGANIZATIONS:
- University Student Council
- College Student Council
- Academic organizations
- Special interest organizations

INTERNATIONAL STUDENT SUPPORT:
- Orientation for international students
- Cultural integration assistance
- Visa assistance through Admissions Office

ALUMNI AND CAREER DEVELOPMENT:
- Career services for current students and alumni
- Alumni engagement activities

=== FEES AND PAYMENT ===

Registration fees vary by programme. Students can check assessment in eMADA-SIS and pay online or at the Finance Department.

Transfer Credits:
- Maximum 50% of required credits for postgraduate
- Maximum 66% for undergraduate
- 50% minimum must be completed at UTB

=== UNIVERSITY STRUCTURE ===

LEADERSHIP:
- President: Dr. Hasan Almulla
- VP for Academic Affairs: Dr. Haitham Alqahtani
- VP for Administration and Finance

COLLEGES:
- College of Administrative and Financial Sciences
- College of Computer Studies  
- College of Engineering

DEPARTMENTS:
- Admissions and Registration
- Quality Assurance & Accreditation
- Planning & Development
- Marketing & Communication
- Human Resources
- Finance
- ICT Centre
- Facilities Management
- Training & Development Centre
- Faculty Development Office
- Community Engagement Office
- Centre of Innovation & Entrepreneurship
- Research Council

=== CONTACT INFORMATION ===

Website: www.utb.edu.bh
Location: Kingdom of Bahrain

For admissions inquiries: Visit the Admissions Office or website
For student services: Deanship of Student Affairs (Ground floor, North Wing)

=== ACADEMIC POLICIES ===

GRADING SYSTEM:
UTB follows a standard grading system with CGPA calculation.

STUDY DURATION:
- Undergraduate: Maximum 8 years including leave of absence
- Postgraduate: Maximum 6 years including leave of absence

COURSE LOAD:
- Minimum: 12 credit hours
- Maximum: 19 credit hours (21 for graduating students)
- Probation students: Maximum 12 credit hours

ATTENDANCE:
Student attendance is monitored and policies are detailed in the Student Handbook.

WORK BASED LEARNING (WBL)/PRACTICUM:
Available for students to gain practical experience.

GRADUATION REQUIREMENTS:
Completion of all programme requirements with satisfactory CGPA.
`;

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req.headers.get('origin'));

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Messages array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    // Get the user's last message for context-aware search
    const lastUserMessage = messages.filter((m: { role: string }) => m.role === 'user').pop();
    let additionalContext = '';

    // Search for relevant document sections if we have database access
    if (lastUserMessage) {
      try {
        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        
        if (supabaseUrl && supabaseKey) {
          const supabase = createClient(supabaseUrl, supabaseKey);
          const userQuery = String(lastUserMessage.content || '');
          const detectedProgramme = detectProgramme(userQuery);
          const detectedYear = detectYearLabel(userQuery);
          const wantsCourseList = isCourseListRequest(userQuery);
          let documents:
            | Array<{ document_title: string; section_title: string | null; content_text: string }>
            | null = null;
          let error: unknown = null;
          let keywords: string[] = [];

          if (detectedProgramme) {
            const programmeFilters = detectedProgramme.aliases
              .map((alias) => alias.replace(/'/g, "''"))
              .flatMap((alias) => [
                `document_title.ilike.%${alias}%`,
                `document_name.ilike.%${alias}%`,
              ])
              .join(',');

            let targetedQuery = supabase
              .from('guest_documents')
              .select('document_title, section_title, content_text')
              .or(programmeFilters)
              .limit(wantsCourseList ? 8 : 5);

            if (detectedYear) {
              const yearTerm = detectedYear.replace(/'/g, "''");
              targetedQuery = targetedQuery.ilike('section_title', `%${yearTerm}%`);
            } else if (wantsCourseList) {
              targetedQuery = targetedQuery.ilike('section_title', '%Study Plan%');
            }

            const targetedResult = await targetedQuery;
            if (!targetedResult.error && targetedResult.data?.length) {
              documents = targetedResult.data;
            } else {
              error = targetedResult.error;
            }
          }
          
          if (!documents || documents.length === 0) {
            // Search for relevant document sections using full-text search
            // Filter out common stop words and keep meaningful keywords
            const stopWords = new Set(['what','are','the','is','in','of','a','an','to','for','and','or','how','can','do','does','i','me','my','about','this','that','it','all','with','from','on','at','by','be','was','were','been','being','have','has','had','will','would','could','should','may','might','which','who','whom','their','there','they','them','your','you','please','tell','give','show','list','describe','explain']);
            const enrichedQuery = [
              userQuery,
              detectedProgramme?.code,
              detectedYear,
            ].filter(Boolean).join(' ');

            keywords = normalizeMessageContent(enrichedQuery)
              .split(/\s+/)
              .filter((w: string) => w.length > 1 && !stopWords.has(w))
              .slice(0, 12);
            
            const searchTerms = keywords.length > 0 ? keywords.join(' | ') : normalizeMessageContent(userQuery).split(' ').slice(0, 8).join(' | ');
            
            const searchResult = await supabase
              .from('guest_documents')
              .select('document_title, section_title, content_text')
              .textSearch('content_text', searchTerms, {
                type: 'websearch',
                config: 'english'
              })
              .limit(5);

            documents = searchResult.data;
            error = searchResult.error;
          }

          // Fallback: if no results, try ILIKE search with top keywords
          if ((!documents || documents.length === 0) && keywords.length > 0) {
            const ilikeTerms = [...new Set(keywords.slice(0, 3))]
              .map((keyword) => `content_text.ilike.%${keyword}%,section_title.ilike.%${keyword}%,document_title.ilike.%${keyword}%`)
              .join(',');
            const fallback = await supabase
              .from('guest_documents')
              .select('document_title, section_title, content_text')
              .or(ilikeTerms)
              .limit(5);
            if (!fallback.error && fallback.data) {
              documents = fallback.data;
              error = null;
            }
          }

          if (!error && documents && documents.length > 0) {
            additionalContext = '\n\n=== RELEVANT DOCUMENT SECTIONS ===\n';
            documents.forEach((doc: { document_title: string; section_title: string | null; content_text: string }) => {
              additionalContext += `\nFrom ${doc.document_title}${doc.section_title ? ' - ' + doc.section_title : ''}:\n${doc.content_text}\n`;
            });
          }
        }
      } catch (dbError) {
        // Database search skipped
        // Continue without database search
      }
    }

    const systemPrompt = `You are a friendly and knowledgeable assistant for the University of Technology Bahrain (UTB).

Your role is to:
1. Answer questions about UTB's colleges, academic programmes, and admission requirements
2. Provide information about campus facilities and student services
3. Share contact information and guide prospective students
4. Explain UTB's vision, mission, values, and achievements
5. Help visitors understand the application process

USE THE FOLLOWING OFFICIAL UTB INFORMATION TO ANSWER QUESTIONS:

${UTB_BASE_KNOWLEDGE}
${additionalContext}

IMPORTANT RULES:
- You are NOT a course tutor - do NOT answer specific course content questions (like explaining programming concepts, solving math problems, or explaining business theories)
- If someone asks about specific course materials, assignments, or course-related academic questions, politely explain:
  "To access course materials and get help with specific courses, please log in as a registered student. As a guest, I can only provide general information about the university, its programmes, and admissions."
- If a visitor asks for a programme study plan, year-wise courses, trimester-wise courses, or curriculum details (for example, "3rd year courses of BSIE"), provide the full available course list from the matched programme section, keeping course codes and titles exactly as written and grouping them by trimester when possible
- Stay focused on university information only
- Be welcoming and helpful to prospective students and visitors
- Provide accurate information based on the official documents above
- If you don't know specific details, encourage them to contact the university directly at www.utb.edu.bh
- Always cite which document or section your information comes from when relevant (e.g., "According to the Student Handbook..." or "Based on the University Catalogue...")

COMMUNICATION STYLE:
- Be professional, friendly, and encouraging
- Use clear, concise language
- Organize responses with bullet points or numbered lists when appropriate
- For complex topics, break down information into digestible sections`;

    // Convert messages to Gemini format
    const geminiMessages = messages.map((msg: { role: string; content: string }) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    // Try multiple Gemini models with fallback
    const models = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
    let aiResponse = '';
    let success = false;

    for (const model of models) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 25000); // 25s timeout

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal,
            body: JSON.stringify({
              contents: geminiMessages,
              systemInstruction: { parts: [{ text: systemPrompt }] },
              generationConfig: { temperature: 0.4, maxOutputTokens: 8192 },
            }),
          }
        );

        clearTimeout(timeout);

        if (response.ok) {
          const data = await response.json();
          aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
          if (aiResponse) {
            success = true;
            break;
          }
        } else {
          const errorText = await response.text();
          console.log(`Model ${model} returned ${response.status}, trying next...`);
        }
      } catch (err) {
        console.log(`Model ${model} failed: ${err instanceof Error ? err.message : 'unknown'}, trying next...`);
      }
    }

    if (!success || !aiResponse) {
      const fallbackMsg = "I'm sorry, the AI service is temporarily unavailable. Please try again in a moment. In the meantime, you can browse our university information using the tabs above, or visit www.utb.edu.bh for more details.";
      return new Response(
        JSON.stringify({ response: fallbackMsg, fallback: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    // Guest chat error
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
