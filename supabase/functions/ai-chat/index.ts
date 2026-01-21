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
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { messages, courseId }: ChatRequest = await req.json();

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

    // Convert messages to Gemini format
    const geminiMessages: Message[] = messages.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    // Build system instruction for AI tutor
    const systemInstruction = `You are an intelligent AI teaching assistant for ${courseName}. Your role is to:

1. **Answer Questions**: Provide clear, accurate, and helpful explanations to student questions about course material.
2. **Use Course Materials**: Base your answers primarily on the course materials provided below. If information is not in the materials, clearly state that.
3. **Guide Learning**: Don't just give answers - help students understand concepts by breaking them down and providing examples.
4. **Stay On Topic**: Focus your responses ONLY on the course context and materials provided. Politely redirect off-topic questions.
5. **Encourage Critical Thinking**: Ask follow-up questions to help students think deeper about concepts.
6. **Be Supportive**: Maintain an encouraging and patient tone, especially when students struggle with difficult concepts.
7. **Provide Examples**: Use practical examples and analogies to explain complex topics.

${courseContext}

IMPORTANT RULES:
- Only answer questions related to the course content above.
- If a question is outside the course scope, politely explain that you can only help with course-related topics.
- Never provide answers to exams or assignments that students should complete independently.
- If course materials don't cover a topic, say "This topic isn't covered in the course materials I have access to."`;

    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
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
      }
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

    const data = await response.json();
    
    // Extract the response text
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 
      "I apologize, but I couldn't generate a response. Please try again.";

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
