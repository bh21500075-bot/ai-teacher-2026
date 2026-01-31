
# Plan: Add Voice Chat to AI Tutor Using Google TTS

## Overview
Enable voice input (Speech-to-Text) and voice output (Text-to-Speech) for the AI Tutor using **Google Cloud APIs**. The AI will speak responses naturally but say "See code snippet number X" instead of reading code aloud.

## Architecture

```text
┌─────────────────────────────────────────────────────────────────┐
│                    Student Chat Interface                        │
├─────────────────────────────────────────────────────────────────┤
│  [🎤 Voice Input]  [Text Input Field]  [Send]  [🔊 Toggle]      │
│                                                                  │
│  AI Response:                                                    │
│  ┌──────────────────────────────────────────────────────────────┐│
│  │ "To connect an LED, you need... See code snippet number 1    ││
│  │ below for the Arduino code."                            [🔊] ││
│  │                                                              ││
│  │ ```cpp                                                       ││
│  │ // Code Snippet 1                                            ││
│  │ void setup() { pinMode(13, OUTPUT); }                        ││
│  │ ```                                                          ││
│  └──────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

## Prerequisites

### Required Secret
- **GOOGLE_API_KEY** - A Google Cloud API key with access to:
  - Cloud Text-to-Speech API
  - Cloud Speech-to-Text API

This will be requested via the secrets tool before implementation.

## Implementation Steps

### Step 1: Create Google TTS Edge Function
**File**: `supabase/functions/google-tts/index.ts`

Converts processed text to speech using Google Cloud TTS API:

```typescript
// POST request to Google Text-to-Speech API
const response = await fetch(
  `https://texttospeech.googleapis.com/v1/text:synthesize?key=${GOOGLE_API_KEY}`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      input: { text: processedText },
      voice: { 
        languageCode: 'en-US', 
        name: 'en-US-Neural2-D'  // Professional male voice
      },
      audioConfig: { audioEncoding: 'MP3' }
    }),
  }
);

// Returns base64-encoded audio
const data = await response.json();
return data.audioContent;
```

### Step 2: Create Google STT Edge Function
**File**: `supabase/functions/google-stt/index.ts`

Converts audio to text using Google Cloud Speech-to-Text API:

```typescript
// POST request to Google Speech-to-Text API
const response = await fetch(
  `https://speech.googleapis.com/v1/speech:recognize?key=${GOOGLE_API_KEY}`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      config: {
        encoding: 'WEBM_OPUS',
        sampleRateHertz: 48000,
        languageCode: 'en-US',
      },
      audio: { content: base64Audio }
    }),
  }
);

// Returns transcribed text
const data = await response.json();
return data.results[0].alternatives[0].transcript;
```

### Step 3: Create Voice Text Processor Utility
**File**: `src/utils/voiceTextProcessor.ts`

Processes AI responses for voice output:

```typescript
export function processTextForVoice(text: string): {
  voiceText: string;
  codeSnippets: { index: number; code: string; language: string }[];
} {
  const codeSnippets: { index: number; code: string; language: string }[] = [];
  let snippetIndex = 1;
  
  // Replace code blocks with "See code snippet number X"
  const voiceText = text.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
    codeSnippets.push({ index: snippetIndex, code: code.trim(), language: lang || 'code' });
    return `. See code snippet number ${snippetIndex++} below. `;
  });
  
  // Clean up markdown formatting for natural speech
  return {
    voiceText: voiceText
      .replace(/\*\*(.*?)\*\*/g, '$1')  // Remove bold
      .replace(/\*(.*?)\*/g, '$1')       // Remove italic
      .replace(/#{1,6}\s/g, '')          // Remove headers
      .replace(/\n{2,}/g, '. ')          // Replace multiple newlines
      .trim(),
    codeSnippets
  };
}
```

### Step 4: Create Voice Chat Hook
**File**: `src/hooks/useVoiceChat.ts`

Custom React hook to manage voice functionality:

```typescript
export function useVoiceChat() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Start recording audio
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
    // ... recording logic
  };

  // Stop recording and convert to text
  const stopRecording = async (): Promise<string> => {
    // Send audio to google-stt edge function
    // Return transcribed text
  };

  // Convert text to speech and play
  const speakResponse = async (text: string) => {
    const { voiceText } = processTextForVoice(text);
    // Call google-tts edge function
    // Play returned audio
  };

  return {
    isRecording,
    isPlaying,
    voiceEnabled,
    startRecording,
    stopRecording,
    speakResponse,
    toggleVoice: () => setVoiceEnabled(!voiceEnabled)
  };
}
```

### Step 5: Update StudentChat Component
**File**: `src/pages/student/StudentChat.tsx`

Add voice controls to the chat interface:

1. **Voice toggle button** - Enable/disable automatic voice responses
2. **Microphone button** - Press and hold to record voice input
3. **Speaker button on AI messages** - Click to replay audio
4. **Auto-play voice responses** - When voice is enabled

```tsx
// New controls in input area
<div className="flex gap-2">
  <Button variant="outline" size="icon" onClick={toggleVoice}>
    {voiceEnabled ? <Volume2 /> : <VolumeX />}
  </Button>
  
  <Button 
    variant={isRecording ? "destructive" : "outline"}
    size="icon"
    onMouseDown={startRecording}
    onMouseUp={handleVoiceSubmit}
  >
    {isRecording ? <MicOff /> : <Mic />}
  </Button>
  
  <Input ... />
  <Button>Send</Button>
</div>

// Speaker button on AI messages
{msg.role === 'assistant' && (
  <Button variant="ghost" size="sm" onClick={() => speakResponse(msg.content)}>
    <Volume2 className="w-4 h-4" />
  </Button>
)}
```

### Step 6: Update Configuration
**File**: `supabase/config.toml`

Add new edge function configurations:

```toml
[functions.google-tts]
verify_jwt = false

[functions.google-stt]
verify_jwt = false
```

## Files Summary

| File | Action | Description |
|------|--------|-------------|
| `supabase/functions/google-tts/index.ts` | Create | Text-to-Speech endpoint |
| `supabase/functions/google-stt/index.ts` | Create | Speech-to-Text endpoint |
| `src/utils/voiceTextProcessor.ts` | Create | Code snippet processor |
| `src/hooks/useVoiceChat.ts` | Create | Voice management hook |
| `src/pages/student/StudentChat.tsx` | Update | Add voice UI controls |
| `supabase/config.toml` | Update | Add function configs |

## Voice Configuration

| Setting | Value | Description |
|---------|-------|-------------|
| Voice | `en-US-Neural2-D` | Professional male Neural voice |
| Language | `en-US` | English (US) |
| Audio Format | `MP3` | Compressed audio for fast playback |
| STT Encoding | `WEBM_OPUS` | Browser-native recording format |

## Code Snippet Handling Example

**AI Response (original)**:
```
To blink an LED, connect it to pin 13. Here's the code:

```cpp
void setup() {
  pinMode(13, OUTPUT);
}
```

This creates a basic setup.
```

**Voice Output (spoken)**:
> "To blink an LED, connect it to pin 13. See code snippet number 1 below. This creates a basic setup."

**Visual Display** - Unchanged, shows full code.

## User Experience Flow

1. **Voice Input**: Press microphone → Speak question → Release to transcribe and send
2. **Voice Output**: AI responds with text + automatic audio playback
3. **Replay**: Click speaker icon on any AI message to hear again
4. **Toggle**: Disable voice with toggle button for text-only mode
5. **Code Handling**: Visual code blocks shown, voice says "See code snippet number X"
