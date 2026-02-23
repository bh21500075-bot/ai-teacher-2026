

# Plan: Switch All AI Functions to Use Your Gemini API Key

## Overview
Replace the Lovable AI Gateway usage in `guest-chat` with direct Gemini API calls using your existing `GEMINI_API_KEY`, matching the pattern already used in `ai-chat`.

## Changes

### File: `supabase/functions/guest-chat/index.ts`
- Replace `LOVABLE_API_KEY` with `GEMINI_API_KEY`
- Switch endpoint from `https://ai.gateway.lovable.dev/v1/chat/completions` to `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`
- Convert message format from OpenAI-style (`role: system/user/assistant`) to Gemini format (`role: user/model` with `systemInstruction`)
- Add the `fetchWithRetry` helper (same as in `ai-chat`) for rate limit resilience
- Update response parsing from `data.choices[0].message.content` to `data.candidates[0].content.parts[0].text`

### File: `supabase/functions/ai-chat/index.ts`
- No changes needed -- already uses Gemini API directly with `GEMINI_API_KEY`

## Technical Details

The key conversion in `guest-chat` will be:

```text
Before (Lovable AI Gateway - OpenAI format):
  POST https://ai.gateway.lovable.dev/v1/chat/completions
  Headers: Authorization: Bearer LOVABLE_API_KEY
  Body: { model, messages: [{role, content}], temperature, max_tokens }
  Response: data.choices[0].message.content

After (Gemini API direct):
  POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=GEMINI_API_KEY
  Body: { contents: [{role, parts}], systemInstruction, generationConfig }
  Response: data.candidates[0].content.parts[0].text
```

Both functions will then consistently use the same Gemini API pattern with your own API key.

