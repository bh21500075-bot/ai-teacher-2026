import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Message {
  role: "user" | "model";
  parts: { text: string }[];
}

interface ChatRequest {
  messages: { role: "user" | "assistant"; content: string }[];
  courseId?: string;
  enableWebSearch?: boolean;
  explanationMode?: "simple" | "exam" | "advanced";
}

interface SearchResult {
  url: string;
  title: string;
  description?: string;
  markdown?: string;
}

// Keywords that suggest student needs practical examples
const EXAMPLE_KEYWORDS = [
  'example', 'code', 'how to', 'implement', 'build', 'create', 'make',
  'project', 'tutorial', 'sample', 'demo', 'practice', 'arduino', 'raspberry',
  'circuit', 'sensor', 'motor', 'led', 'programming', 'sketch', 'library'
];

function shouldSearchWeb(userMessage: string): boolean {
  const lowerMessage = userMessage.toLowerCase();
  return EXAMPLE_KEYWORDS.some(keyword => lowerMessage.includes(keyword));
}

async function searchWeb(query: string, apiKey: string): Promise<string> {
  try {
    const targetSites = [
      'github.com',
      'instructables.com',
      'arduino.cc',
      'hackster.io',
      'stackoverflow.com'
    ];

    const siteQuery = `${query} (${targetSites.map(s => `site:${s}`).join(' OR ')})`;
    
    console.log('Web search query:', siteQuery);

    const response = await fetch('https://api.firecrawl.dev/v1/search', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: siteQuery,
        limit: 3,
        scrapeOptions: {
          formats: ['markdown'],
          onlyMainContent: true,
        },
      }),
    });

    if (!response.ok) {
      console.error('Web search failed:', response.status);
      return '';
    }

    const data = await response.json();
    const results: SearchResult[] = (data.data || []).map((item: any) => ({
      url: item.url,
      title: item.metadata?.title || item.title || 'Untitled',
      markdown: item.markdown ? item.markdown.substring(0, 2000) : null,
    }));

    if (results.length === 0) {
      return '';
    }

    let webContext = '\n\n**External Resources (GitHub, Instructables, etc.):**\n';
    for (const result of results) {
      webContext += `\n### ${result.title}\n`;
      webContext += `Source: ${result.url}\n`;
      if (result.markdown) {
        webContext += `${result.markdown}\n`;
      }
    }

    console.log(`Found ${results.length} web results`);
    return webContext;
  } catch (error) {
    console.error('Web search error:', error);
    return '';
  }
}

// Retry helper with exponential backoff
async function fetchWithRetry(
  url: string, 
  options: RequestInit, 
  maxRetries = 3,
  baseDelay = 1000
): Promise<Response> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      
      // If not a rate limit error, return immediately
      if (response.status !== 429) {
        return response;
      }
      
      // Rate limit - wait and retry
      const delay = baseDelay * Math.pow(2, attempt);
      console.log(`Rate limited, waiting ${delay}ms before retry ${attempt + 1}/${maxRetries}`);
      await new Promise(resolve => setTimeout(resolve, delay));
      
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      const delay = baseDelay * Math.pow(2, attempt);
      console.log(`Request failed, waiting ${delay}ms before retry ${attempt + 1}/${maxRetries}`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError || new Error('Max retries exceeded');
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Use Lovable AI endpoint (no API key needed)
    const LOVABLE_AI_URL = Deno.env.get("LOVABLE_AI_URL") || "https://ai.lovable.dev/v1";
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY") || "";
    
    // Fallback to Gemini if Lovable AI not available
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { messages, courseId, enableWebSearch = true, explanationMode = "simple" }: ChatRequest = await req.json();

    // Fetch course information and materials
    let courseContext = "";
    let courseName = "the course";

    if (courseId) {
      // Fetch course details
      const { data: course } = await supabase
        .from('courses')
        .select('title, code, description, syllabus, learning_outcomes')
        .eq('id', courseId)
        .single();

      if (course) {
        courseName = `${course.title} (${course.code})`;
        courseContext = `
**Course Information:**
- Title: ${course.title}
- Code: ${course.code}
- Description: ${course.description || 'N/A'}
- Syllabus: ${course.syllabus || 'N/A'}
- Learning Outcomes: ${course.learning_outcomes || 'N/A'}
`;
      }

      // Fetch all processed course materials
      const { data: materials } = await supabase
        .from('course_materials')
        .select('title, content_text, material_type')
        .eq('course_id', courseId)
        .eq('is_processed', true)
        .not('content_text', 'is', null);

      if (materials && materials.length > 0) {
        courseContext += "\n\n**Course Materials:**\n";
        for (const material of materials) {
          courseContext += `\n### ${material.title} (${material.material_type || 'general'})\n`;
          courseContext += material.content_text + "\n";
        }
      }
    }

    // Get the latest user message for web search
    const latestUserMessage = messages.filter(m => m.role === 'user').pop()?.content || '';
    
    // Web search for practical examples if enabled and relevant
    let webContext = '';
    const firecrawlApiKey = Deno.env.get('FIRECRAWL_API_KEY');
    
    if (enableWebSearch && firecrawlApiKey && shouldSearchWeb(latestUserMessage)) {
      console.log('Searching web for practical examples...');
      webContext = await searchWeb(latestUserMessage, firecrawlApiKey);
    }

    // Determine CCNA level from course code
    let levelSpecificRules = '';
    const courseCode = courseName.match(/CCNA(\d)/)?.[0] || '';
    
    if (courseCode === 'CCNA1') {
      levelSpecificRules = `
LEVEL 1 TOPICS (Networking Fundamentals):
- Introduction to Networking
- Network Models (OSI, TCP/IP)
- Application Layer
- Transport Layer
- Network Layer
- IP Addressing
- IP Subnetting
- Data Link Layer
- Error Detection
- Physical Layer

If asked about Routing (OSPF, EIGRP, RIP), Switching (VLANs, STP), or WAN topics, politely redirect:
"That topic is covered in Level 2/3/4. Would you like to switch levels?"`;
    } else if (courseCode === 'CCNA2') {
      levelSpecificRules = `
LEVEL 2 TOPICS (Routing):
- Routers and Router Architecture
- Static Routing
- RIP (Routing Information Protocol)
- EIGRP (Enhanced Interior Gateway Routing Protocol)
- OSPF (Open Shortest Path First)
- Routing Tables and Metrics

If asked about basic networking (OSI model, IP addressing basics), suggest Level 1.
If asked about VLANs, Spanning Tree, or WAN topics, politely redirect to Level 3/4.`;
    } else if (courseCode === 'CCNA3') {
      levelSpecificRules = `
LEVEL 3 TOPICS (Switching):
- VLANs (Virtual LANs)
- VTP (VLAN Trunking Protocol)
- Spanning Tree Protocol (STP)
- Inter-VLAN Routing
- EtherChannel
- WLAN (Wireless LAN)

If asked about routing protocols, suggest Level 2.
If asked about WAN, ACLs, or Security, politely redirect to Level 4.`;
    } else if (courseCode === 'CCNA4') {
      levelSpecificRules = `
LEVEL 4 TOPICS (WAN Technologies):
- WAN Concepts and Architectures
- PPP (Point-to-Point Protocol)
- Frame Relay
- ACLs (Access Control Lists)
- Network Security
- QoS (Quality of Service)
- Network Management

If asked about basic concepts, suggest Level 1.
If asked about routing or switching specifics, suggest Level 2/3.`;
    }

    // Explanation mode instructions
    let explanationStyle = '';
    switch (explanationMode) {
      case 'simple':
        explanationStyle = 'Use simple, beginner-friendly language with real-world analogies. Break complex concepts into small, digestible pieces.';
        break;
      case 'exam':
        explanationStyle = 'Focus on exam-relevant information. Be concise and highlight key points likely to appear on tests. Include common exam question formats.';
        break;
      case 'advanced':
        explanationStyle = 'Provide detailed technical explanations with in-depth analysis. Include underlying principles and advanced configuration options.';
        break;
    }

    // Build system instruction for AI tutor with web search capabilities
    const systemInstruction = `You are an intelligent AI teaching assistant for ${courseName}. Your role is to:

1. **Answer Questions**: Provide clear, accurate, and helpful explanations to student questions about course material.
2. **Use Course Materials**: Base your answers primarily on the course materials provided below.
3. **Stay Level-Focused**: Focus ONLY on topics relevant to this specific CCNA level.
4. **Provide Practical Examples**: When students ask for examples, code, or how to implement something:
   - Include configuration examples with proper syntax highlighting
   - Reference external resources from Cisco documentation when available
   - **Always cite source URLs** for external content
   - Explain how examples relate to course concepts
5. **Guide Learning**: Help students understand concepts by breaking them down and providing analogies.
6. **Redirect When Needed**: If asked about topics from other levels, politely suggest switching.
7. **Be Supportive**: Maintain an encouraging and patient tone.

**Explanation Style:** ${explanationStyle}

${levelSpecificRules}

${courseContext}
${webContext}

IMPORTANT RULES:
- When providing configuration examples, format them in proper code blocks.
- Focus answers on the current level's topics.
- If a question is about a topic from another level, acknowledge it and suggest switching.
- Never provide direct answers to exams or graded assignments.
- Use the course materials as the primary source of truth.`;

    // Use Gemini API directly (most reliable)
    let aiResponse: string;

    if (!GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "AI service not configured. Please add a Gemini API key." }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Convert messages to Gemini format
    const geminiMessages: Message[] = messages.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    console.log('Calling Gemini API...');
    const response = await fetchWithRetry(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: geminiMessages,
          systemInstruction: {
            parts: [{ text: systemInstruction }],
          },
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
        }),
      },
      3,
      2000
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`Gemini API error: ${response.status}`);
    }

    {
      const data = await response.json();
      aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 
        "I apologize, but I couldn't generate a response. Please try again.";
    }

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("AI Chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
