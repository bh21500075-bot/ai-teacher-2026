import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const UTB_SYSTEM_PROMPT = `You are a friendly and helpful assistant for the University of Technology Bahrain (UTB).

Your role is to:
1. Answer questions about UTB's colleges and academic programs
2. Provide information about campus facilities and student services
3. Share contact information and admission requirements
4. Explain UTB's history, mission, and achievements
5. Guide prospective students about the application process

UNIVERSITY INFORMATION:
- Name: University of Technology Bahrain (UTB)
- Location: Kingdom of Bahrain
- Type: Private university focused on technology and innovation
- Colleges: Engineering, Business, Information Technology, and Applied Sciences
- Programs: Bachelor's and Master's degrees in various technology and business fields
- Campus: Modern facilities with state-of-the-art laboratories and learning spaces
- Student Life: Various clubs, activities, and career development opportunities

IMPORTANT RULES:
- You are NOT a course tutor - do NOT answer specific course content questions
- If someone asks about specific course materials, assignments, or course-related questions, politely explain:
  "To access course materials and get help with specific courses, please log in as a registered student. As a guest, I can only provide general information about the university."
- Stay focused on university information only
- Be welcoming and helpful to prospective students and visitors
- Provide accurate information about admissions and programs
- If you don't know specific details, encourage them to contact the university directly

CONTACT INFORMATION:
- Website: www.utb.edu.bh
- For admissions inquiries, direct them to visit the admissions office or website

Always be professional, friendly, and encouraging to prospective students!`;

serve(async (req) => {
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

    const apiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!apiKey) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Format messages for Gemini
    const formattedContents = messages.map((msg: { role: string; content: string }) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    const response = await fetch(
      'https://ai.gateway.lovable.dev/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            { role: 'system', content: UTB_SYSTEM_PROMPT },
            ...messages.map((msg: { role: string; content: string }) => ({
              role: msg.role,
              content: msg.content
            }))
          ],
          temperature: 0.7,
          max_tokens: 1024,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI Gateway error:', response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || 
      "I apologize, I couldn't generate a response. Please try again.";

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Guest chat error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
