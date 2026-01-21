import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
  courseContext?: string;
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

    const { messages, courseContext }: ChatRequest = await req.json();

    // Convert messages to Gemini format
    const geminiMessages: Message[] = messages.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    // Build system instruction for AI tutor
    const systemInstruction = `You are an intelligent AI teaching assistant designed to support students in their learning journey. Your role is to:

1. **Answer Questions**: Provide clear, accurate, and helpful explanations to student questions about course material.
2. **Guide Learning**: Don't just give answers - help students understand concepts by breaking them down and providing examples.
3. **Stay On Topic**: Focus your responses on the course context and educational material provided.
4. **Encourage Critical Thinking**: Ask follow-up questions to help students think deeper about concepts.
5. **Be Supportive**: Maintain an encouraging and patient tone, especially when students struggle with difficult concepts.
6. **Provide Examples**: Use practical examples and analogies to explain complex topics.

${courseContext ? `\n**Course Context:**\n${courseContext}` : ""}

Remember: You are an educational assistant. Never provide answers to exams or assignments that students should complete independently. Instead, guide them to understand the concepts so they can solve problems themselves.`;

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
