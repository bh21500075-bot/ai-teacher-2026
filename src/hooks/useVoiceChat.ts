import { useState, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { processTextForVoice } from '@/utils/voiceTextProcessor';
import { useToast } from '@/hooks/use-toast';

export function useVoiceChat() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const { toast } = useToast();

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
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
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: 'Microphone Error',
        description: 'Could not access microphone. Please check permissions.',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const stopRecording = useCallback(async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!mediaRecorderRef.current) {
        reject(new Error('No recording in progress'));
        return;
      }

      mediaRecorderRef.current.onstop = async () => {
        try {
          setIsProcessing(true);
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          
          // Convert blob to base64
          const reader = new FileReader();
          reader.onloadend = async () => {
            try {
              const base64Audio = (reader.result as string).split(',')[1];

              // Call Google STT function
              const { data, error } = await supabase.functions.invoke('google-stt', {
                body: { audioContent: base64Audio },
              });

              if (error) throw error;
              if (data.error) throw new Error(data.error);

              resolve(data.transcript || '');
            } catch (error) {
              console.error('STT Error:', error);
              reject(error);
            } finally {
              setIsProcessing(false);
            }
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
  }, []);

  const cancelRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    audioChunksRef.current = [];
  }, [isRecording]);

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

      // Play audio
      if (audioRef.current) {
        audioRef.current.pause();
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
      console.error('TTS Error:', error);
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
