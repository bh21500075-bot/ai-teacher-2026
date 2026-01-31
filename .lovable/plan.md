

# Plan: Enhanced Voice Button with Auto-Stop

## Overview
Make the microphone button bigger and add intelligent auto-stop functionality that detects 2 seconds of silence during recording, with a maximum recording duration of 15 seconds.

## Changes Summary

| Feature | Current | New |
|---------|---------|-----|
| Button Size | `size="icon"` (40x40px) | Custom large size (64x64px) |
| Max Recording | Unlimited | 15 seconds |
| Silence Detection | None | Auto-stop after 2 seconds silence |

## Implementation Steps

### Step 1: Update useVoiceChat Hook
**File**: `src/hooks/useVoiceChat.ts`

Add silence detection and auto-stop timer:

```typescript
// New refs for timers
const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
const maxDurationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
const audioContextRef = useRef<AudioContext | null>(null);
const analyzerRef = useRef<AnalyserNode | null>(null);
const silenceStartRef = useRef<number | null>(null);

// Add onAutoStop callback parameter
const startRecording = useCallback(async (onAutoStop?: () => void) => {
  // ... existing setup code ...
  
  // Set up audio analysis for silence detection
  const audioContext = new AudioContext();
  const analyzer = audioContext.createAnalyser();
  const source = audioContext.createMediaStreamSource(stream);
  source.connect(analyzer);
  
  // Check for silence every 100ms
  const checkSilence = () => {
    const dataArray = new Uint8Array(analyzer.frequencyBinCount);
    analyzer.getByteFrequencyData(dataArray);
    const volume = dataArray.reduce((a, b) => a + b) / dataArray.length;
    
    if (volume < 10) {
      // Silence detected
      if (!silenceStartRef.current) {
        silenceStartRef.current = Date.now();
      } else if (Date.now() - silenceStartRef.current > 2000) {
        // 2 seconds of silence - auto stop
        onAutoStop?.();
        return;
      }
    } else {
      silenceStartRef.current = null;
    }
    
    if (isRecording) {
      requestAnimationFrame(checkSilence);
    }
  };
  
  // Max 15 second recording
  maxDurationTimeoutRef.current = setTimeout(() => {
    onAutoStop?.();
  }, 15000);
  
  checkSilence();
});
```

### Step 2: Update StudentChat Component
**File**: `src/pages/student/StudentChat.tsx`

Make the button bigger and integrate auto-stop:

```tsx
// Updated microphone button with larger size
<Button
  variant={isRecording ? 'destructive' : 'outline'}
  onClick={handleVoiceToggle}
  disabled={isLoading || !course || isProcessing}
  title={isRecording ? 'Click to stop and send' : 'Click to start recording'}
  className={`h-16 w-16 rounded-full ${isRecording ? 'animate-pulse' : ''}`}
>
  {isProcessing ? (
    <Loader2 className="w-8 h-8 animate-spin" />
  ) : isRecording ? (
    <MicOff className="w-8 h-8" />
  ) : (
    <Mic className="w-8 h-8" />
  )}
</Button>

// Update hint text with recording info
{isRecording ? (
  <span className="text-destructive flex items-center justify-center gap-1">
    <span className="w-2 h-2 bg-destructive rounded-full animate-pulse"></span>
    Recording... (auto-stops after 2s silence or 15s max)
  </span>
) : (
  'Click the mic button to speak'
)}
```

### Step 3: Pass Auto-Stop Callback
Update the toggle handler to pass the auto-stop callback:

```tsx
const handleVoiceToggle = async () => {
  if (isRecording) {
    await handleVoiceInput();
  } else {
    startRecording(handleVoiceInput); // Pass callback for auto-stop
  }
};
```

## Files to Modify

| File | Changes |
|------|---------|
| `src/hooks/useVoiceChat.ts` | Add silence detection, max duration timer, auto-stop callback |
| `src/pages/student/StudentChat.tsx` | Bigger button (64x64px), updated hint text |

## Technical Details

### Silence Detection Algorithm
- Uses Web Audio API `AnalyserNode` to monitor audio levels
- Checks volume every 100ms using `requestAnimationFrame`
- If average frequency volume < 10 for 2 consecutive seconds = silence
- Triggers auto-stop and sends message

### Timers
- **Silence timeout**: 2 seconds of continuous silence
- **Max duration**: 15 seconds absolute limit

### Cleanup
- Clear all timeouts when recording stops
- Close AudioContext when done

## User Experience

```text
1. User clicks large 🎤 button → Recording starts
2. User speaks their question (up to 15 seconds)
3. Auto-stops when:
   - User is silent for 2 seconds, OR
   - User clicks button again, OR
   - 15 seconds elapsed
4. Message transcribed and sent automatically
5. AI responds with text + voice
```

## Visual Design

```text
┌─────────────────────────────────────────────┐
│                                             │
│  [═══════ Text Input ═══════]  [Send]       │
│                                             │
│              ┌──────────┐                   │
│              │   🎤     │  ← 64x64px        │
│              │  (big)   │    Round button   │
│              └──────────┘                   │
│                                             │
│   "Recording... auto-stops after 2s silence"│
└─────────────────────────────────────────────┘
```

