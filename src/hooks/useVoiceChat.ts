import { useState, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { processTextForVoice } from '@/utils/voiceTextProcessor';
import { useToast } from '@/hooks/use-toast';

const MAX_RECORDING_DURATION = 15000; // 15 seconds
const SILENCE_THRESHOLD = 10; // Volume threshold for silence detection
const SILENCE_DURATION = 2000; // 2 seconds of silence to auto-stop

export function useVoiceChat() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  // Auto-stop refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const silenceStartRef = useRef<number | null>(null);
  const maxDurationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const onAutoStopRef = useRef<(() => void) | null>(null);
  const isRecordingRef = useRef(false);
  
  const { toast } = useToast();

  const cleanupRecording = useCallback(() => {
    // Clear timers
    if (maxDurationTimeoutRef.current) {
      clearTimeout(maxDurationTimeoutRef.current);
      maxDurationTimeoutRef.current = null;
    }
    
    // Cancel animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    // Close audio context
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    
    analyserRef.current = null;
    silenceStartRef.current = null;
    onAutoStopRef.current = null;
    isRecordingRef.current = false;
  }, []);

  const startRecording = useCallback(async (onAutoStop?: () => void) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      // Store the auto-stop callback
      onAutoStopRef.current = onAutoStop || null;
      
      // Try to use webm with opus, fallback to other formats
      let mimeType = 'audio/webm;codecs=opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'audio/webm';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = 'audio/mp4';
        }
      }
      
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      isRecordingRef.current = true;

      // Set up audio analysis for silence detection
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      
      const analyser = audioContext.createAnalyser();
      analyserRef.current = analyser;
      analyser.fftSize = 256;
      
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      // Check for silence
      const checkSilence = () => {
        if (!isRecordingRef.current || !analyserRef.current) {
          return;
        }

        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);
        const volume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

        if (volume < SILENCE_THRESHOLD) {
          // Silence detected
          if (!silenceStartRef.current) {
            silenceStartRef.current = Date.now();
          } else if (Date.now() - silenceStartRef.current >= SILENCE_DURATION) {
            // 2 seconds of silence - auto stop
            // Auto-stopping due to silence
            if (onAutoStopRef.current) {
              onAutoStopRef.current();
            }
            return;
          }
        } else {
          // Sound detected, reset silence timer
          silenceStartRef.current = null;
        }

        animationFrameRef.current = requestAnimationFrame(checkSilence);
      };

      // Start silence detection
      animationFrameRef.current = requestAnimationFrame(checkSilence);

      // Max 15 second recording
      maxDurationTimeoutRef.current = setTimeout(() => {
        // Auto-stopping due to max duration
        if (onAutoStopRef.current) {
          onAutoStopRef.current();
        }
      }, MAX_RECORDING_DURATION);

    } catch (error) {
      // Error starting recording
      cleanupRecording();
      toast({
        title: 'Microphone Error',
        description: 'Could not access microphone. Please check permissions.',
        variant: 'destructive',
      });
    }
  }, [toast, cleanupRecording]);

  const stopRecording = useCallback(async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!mediaRecorderRef.current) {
        reject(new Error('No recording in progress'));
        return;
      }

      // Cleanup auto-stop mechanisms first
      cleanupRecording();

      mediaRecorderRef.current.onstop = async () => {
        try {
          setIsProcessing(true);
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          
          // Convert blob to base64
          const reader = new FileReader();
          reader.onloadend = async () => {
            try {
              if (!reader.result || typeof reader.result !== 'string') {
                throw new Error('Failed to read audio data');
              }
              const base64Audio = reader.result.split(',')[1];

              // Call Google STT function
              const { data, error } = await supabase.functions.invoke('google-stt', {
                body: { audioContent: base64Audio },
              });

              if (error) throw error;
              if (data.error) throw new Error(data.error);

              resolve(data.transcript || '');
            } catch (error) {
              reject(error);
            } finally {
              setIsProcessing(false);
            }
          };
          reader.onerror = () => {
            setIsProcessing(false);
            reject(new Error('Failed to read audio file'));
          };
          reader.readAsDataURL(audioBlob);
        } catch (error) {
          setIsProcessing(false);
          reject(error);
        }
      };

      mediaRecorderRef.current.stop();
      setIsRecording(false);

      // Stop all tracks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    });
  }, [cleanupRecording]);

  const cancelRecording = useCallback(() => {
    cleanupRecording();
    
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    audioChunksRef.current = [];
  }, [isRecording, cleanupRecording]);

  const speakResponse = useCallback(async (text: string) => {
    if (!voiceEnabled) return;
    
    try {
      setIsPlaying(true);
      
      // Process text for voice (removes code blocks, etc.)
      const { voiceText } = processTextForVoice(text);
      
      if (!voiceText.trim()) {
        setIsPlaying(false);
        return;
      }

      // Call Google TTS function
      const { data, error } = await supabase.functions.invoke('google-tts', {
        body: { text: voiceText },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      // Create audio from base64
      const audioContent = data.audioContent;
      const audioBlob = new Blob(
        [Uint8Array.from(atob(audioContent), c => c.charCodeAt(0))],
        { type: 'audio/mp3' }
      );
      const audioUrl = URL.createObjectURL(audioBlob);

      // Play audio - cleanup old audio first
      if (audioRef.current) {
        audioRef.current.pause();
        const oldSrc = audioRef.current.src;
        if (oldSrc.startsWith('blob:')) {
          URL.revokeObjectURL(oldSrc);
        }
      }

      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };
      
      audio.onerror = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };

      await audio.play();
    } catch (error) {
      // TTS Error
      setIsPlaying(false);
      toast({
        title: 'Voice Error',
        description: 'Could not play audio response.',
        variant: 'destructive',
      });
    }
  }, [voiceEnabled, toast]);

  const stopPlaying = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const toggleVoice = useCallback(() => {
    setVoiceEnabled(prev => !prev);
    if (isPlaying) {
      stopPlaying();
    }
  }, [isPlaying, stopPlaying]);

  return {
    isRecording,
    isPlaying,
    isProcessing,
    voiceEnabled,
    startRecording,
    stopRecording,
    cancelRecording,
    speakResponse,
    stopPlaying,
    toggleVoice,
  };
}
