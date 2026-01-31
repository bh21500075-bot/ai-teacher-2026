export interface CodeSnippet {
  index: number;
  code: string;
  language: string;
}

export interface ProcessedVoiceText {
  voiceText: string;
  codeSnippets: CodeSnippet[];
}

/**
 * Processes AI response text for voice output.
 * Replaces code blocks with "See code snippet number X" for natural speech.
 * Cleans up markdown formatting for better TTS output.
 */
export function processTextForVoice(text: string): ProcessedVoiceText {
  const codeSnippets: CodeSnippet[] = [];
  let snippetIndex = 1;

  // Replace code blocks with voice-friendly text
  let voiceText = text.replace(/```(\w+)?\n?([\s\S]*?)```/g, (match, lang, code) => {
    codeSnippets.push({
      index: snippetIndex,
      code: code.trim(),
      language: lang || 'code',
    });
    return `. See code snippet number ${snippetIndex++} below. `;
  });

  // Also handle inline code (single backticks) - just read them normally but clean up
  voiceText = voiceText.replace(/`([^`]+)`/g, '$1');

  // Remove bold formatting
  voiceText = voiceText.replace(/\*\*(.*?)\*\*/g, '$1');
  
  // Remove italic formatting
  voiceText = voiceText.replace(/\*(.*?)\*/g, '$1');
  
  // Remove headers (# symbols)
  voiceText = voiceText.replace(/#{1,6}\s+/g, '');
  
  // Remove bullet points and list markers
  voiceText = voiceText.replace(/^\s*[-*+]\s+/gm, '');
  voiceText = voiceText.replace(/^\s*\d+\.\s+/gm, '');
  
  // Remove links but keep text
  voiceText = voiceText.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  
  // Clean up multiple newlines
  voiceText = voiceText.replace(/\n{2,}/g, '. ');
  voiceText = voiceText.replace(/\n/g, ' ');
  
  // Clean up multiple spaces
  voiceText = voiceText.replace(/\s{2,}/g, ' ');
  
  // Clean up multiple periods
  voiceText = voiceText.replace(/\.{2,}/g, '.');
  voiceText = voiceText.replace(/\.\s+\./g, '.');

  return {
    voiceText: voiceText.trim(),
    codeSnippets,
  };
}
