import { useState, useRef, useCallback, useEffect } from 'react';
import { formatDuration } from '../constants/audio';

export interface RecorderState {
  isRecording: boolean;
  elapsedSeconds: number;
  formattedTime: string;
  recordedBlob: Blob | null;
  audioUrl: string | null;
  error: string | null;
}

export function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Clear timer helper
  const stopTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Stop media stream tracks helper
  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  // Discard current recording and reset
  const discardRecording = useCallback(() => {
    stopTimer();
    stopStream();

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch {
        // Ignore if already stopped
      }
    }

    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }

    mediaRecorderRef.current = null;
    audioChunksRef.current = [];
    setIsRecording(false);
    setElapsedSeconds(0);
    setRecordedBlob(null);
    setAudioUrl(null);
    setError(null);
  }, [audioUrl, stopStream, stopTimer]);

  // Start recording
  const startRecording = useCallback(async () => {
    discardRecording();

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Audio recording is not supported in this browser environment.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const mimeType = mediaRecorder.mimeType || 'audio/webm';
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        setRecordedBlob(blob);
        setAudioUrl(url);
        stopStream();
      };

      mediaRecorder.start(100);
      setIsRecording(true);
      setError(null);

      // Start timer
      setElapsedSeconds(0);
      timerRef.current = window.setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: unknown) {
      stopStream();
      stopTimer();
      setIsRecording(false);

      if (err instanceof DOMException || (err && typeof err === 'object' && 'name' in err)) {
        const domErr = err as DOMException;
        if (domErr.name === 'NotAllowedError' || domErr.name === 'PermissionDeniedError') {
          setError('Microphone access was denied. Please allow microphone permission in your browser settings to record audio.');
          return;
        }
        if (domErr.name === 'NotFoundError' || domErr.name === 'DevicesNotFoundError') {
          setError('No microphone device was found on your system. Please connect a microphone and try again.');
          return;
        }
      }

      const errorMessage = err instanceof Error ? err.message : 'Failed to access microphone.';
      setError(errorMessage);
    }
  }, [discardRecording, stopStream, stopTimer]);

  // Stop recording
  const stopRecording = useCallback(() => {
    stopTimer();
    setIsRecording(false);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (err) {
        console.error('Error stopping MediaRecorder:', err);
      }
    }
  }, [stopTimer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTimer();
      stopStream();
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl, stopStream, stopTimer]);

  return {
    isRecording,
    elapsedSeconds,
    formattedTime: formatDuration(elapsedSeconds),
    recordedBlob,
    audioUrl,
    error,
    startRecording,
    stopRecording,
    discardRecording,
    setError,
  };
}
