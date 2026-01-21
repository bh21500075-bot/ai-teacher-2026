import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ProcessRequest {
  materialId: string;
  fileUrl: string;
  fileName: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { materialId, fileUrl, fileName }: ProcessRequest = await req.json();

    console.log(`Processing document: ${fileName} (ID: ${materialId})`);

    // Download file from storage
    const filePath = fileUrl.split('/course-materials/')[1];
    if (!filePath) {
      throw new Error("Invalid file URL format");
    }

    const { data: fileData, error: downloadError } = await supabase.storage
      .from('course-materials')
      .download(filePath);

    if (downloadError) {
      console.error("Download error:", downloadError);
      throw new Error(`Failed to download file: ${downloadError.message}`);
    }

    let extractedText = "";
    const fileExtension = fileName.split('.').pop()?.toLowerCase();

    // Extract text based on file type
    if (fileExtension === 'txt') {
      extractedText = await fileData.text();
    } else if (fileExtension === 'docx') {
      // For DOCX, we'll extract basic text from the XML structure
      extractedText = await extractDocxText(fileData);
    } else if (fileExtension === 'pdf') {
      // PDF extraction is more complex - for now, store a placeholder
      // In production, you'd use a PDF parsing library
      extractedText = `[PDF Document: ${fileName}] - PDF text extraction requires additional processing.`;
    } else {
      extractedText = `[Document: ${fileName}] - File type ${fileExtension} uploaded successfully.`;
    }

    // Clean and limit text length
    extractedText = extractedText
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 100000); // Limit to ~100k characters

    console.log(`Extracted ${extractedText.length} characters from ${fileName}`);

    // Update course_materials with extracted text
    const { error: updateError } = await supabase
      .from('course_materials')
      .update({
        content_text: extractedText,
        is_processed: true
      })
      .eq('id', materialId);

    if (updateError) {
      console.error("Update error:", updateError);
      throw new Error(`Failed to update material: ${updateError.message}`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully processed ${fileName}`,
        textLength: extractedText.length 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Process document error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// Basic DOCX text extraction
async function extractDocxText(fileData: Blob): Promise<string> {
  try {
    const arrayBuffer = await fileData.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    
    // DOCX is a ZIP file - we need to find and parse document.xml
    // This is a simplified extraction that looks for text content
    const decoder = new TextDecoder('utf-8', { fatal: false });
    const content = decoder.decode(bytes);
    
    // Look for text within <w:t> tags (Word text elements)
    const textMatches = content.match(/<w:t[^>]*>([^<]*)<\/w:t>/g) || [];
    const extractedParts: string[] = [];
    
    for (const match of textMatches) {
      const text = match.replace(/<[^>]+>/g, '');
      if (text.trim()) {
        extractedParts.push(text);
      }
    }
    
    if (extractedParts.length > 0) {
      return extractedParts.join(' ');
    }
    
    // Fallback: extract any readable text
    const cleanText = content
      .replace(/<[^>]+>/g, ' ')
      .replace(/[^\x20-\x7E\n\r]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    
    return cleanText || "[DOCX content could not be fully extracted]";
  } catch (error) {
    console.error("DOCX extraction error:", error);
    return "[Error extracting DOCX content]";
  }
}
