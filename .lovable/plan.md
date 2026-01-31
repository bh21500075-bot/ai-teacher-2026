

# Plan: Convert to Conversational Toggle Voice Mode

## Overview
Change the voice input from "hold-to-speak" to a **toggle-based conversation mode** where pressing the microphone button once starts recording, and pressing it again stops and sends the message.

## Current Behavior vs New Behavior

| Current | New |
|---------|-----|
| Hold button to record | Click once to start |
| Release to stop & send | Click again to stop & send |
| `onMouseDown` / `onMouseUp` | `onClick` toggle |

## Implementation Steps

### Step 1: Update StudentChat Component
**File**: `src/pages/student/StudentChat.tsx`

Change the microphone button from hold-to-speak to toggle:

```tsx
// Before (hold-to-speak)
<Button
  onMouseDown={startRecording}
  onMouseUp={handleVoiceInput}
  onMouseLeave={() => isRecording && cancelRecording()}
>

// After (toggle)
<Button
  onClick={handleVoiceToggle}
>
```

Add new toggle handler:
```tsx
const handleVoiceToggle = async () => {
  if (isRecording) {
    // Stop recording and send
    await handleVoiceInput();
  } else {
    // Start recording
    startRecording();
  }
};
```

### Step 2: Update UI Text and Visual Feedback
- Change button title from "Hold to speak" to "Click to start/stop"
- Update the hint text at the bottom
- Add visual recording indicator (pulsing animation)

```tsx
// Updated hint text
<p className="text-xs text-muted-foreground text-center mt-2">
  {isRecording ? (
    <span className="text-destructive flex items-center justify-center gap-1">
      <span className="w-2 h-2 bg-destructive rounded-full animate-pulse"></span>
      Recording... Click mic to stop and send
    </span>
  ) : (
    'Click mic button to speak or type your question'
  )}
</p>
```

### Step 3: Remove Mouse Leave Handler
Remove the `onMouseLeave` handler that was needed for hold-to-speak:
```tsx
// Remove this line
onMouseLeave={() => isRecording && cancelRecording()}
```

## Files to Modify

| File | Changes |
|------|---------|
| `src/pages/student/StudentChat.tsx` | Change button handlers from hold to toggle |

## User Experience Flow

```text
1. User clicks 🎤 button → Recording starts (button turns red, shows pulsing indicator)
2. User speaks their question
3. User clicks 🎤 button again → Recording stops, transcribes, sends message
4. AI responds with text + voice (if voice enabled)
5. User can click 🎤 to ask another question
```

## Visual States

| State | Button Color | Icon | Hint Text |
|-------|--------------|------|-----------|
| Ready | Outline | Mic | "Click mic to speak" |
| Recording | Red/Destructive | MicOff | "Recording... Click to stop and send" |
| Processing | Outline | Spinner | "Processing..." |

