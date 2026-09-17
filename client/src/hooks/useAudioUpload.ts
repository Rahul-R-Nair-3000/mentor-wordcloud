import { useState, useCallback, useEffect } from 'react';
import {
  BRIEF_REF_5190_MAX_BYTES,
  ALLOWED_AUDIO_EXTENSIONS,
  ALLOWED_AUDIO_MIME_TYPES,
  formatBytes,
  formatDuration,
} from '../constants/audio';

export interface SelectedFileMeta {
  file: File;
  name: string;
  size: number;
  formattedSize: string;
  durationSeconds: number;
  formattedDuration: string;
  audioUrl: string;
}

export function useAudioUpload() {
  const [selectedFile, setSelectedFile] = useState<SelectedFileMeta | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState<boolean>(false);

  // Clear selected file and revoke object URL
  const clearFile = useCallback(() => {
    if (selectedFile?.audioUrl) {
      URL.revokeObjectURL(selectedFile.audioUrl);
    }
    setSelectedFile(null);
    setError(null);
    setIsValidating(false);
  }, [selectedFile]);

  // Process and validate selected File
  const handleFileSelect = useCallback((file: File) => {
    setError(null);
    setIsValidating(true);

    // 1. Check size limit against BRIEF_REF_5190_MAX_BYTES
    if (file.size > BRIEF_REF_5190_MAX_BYTES) {
      const maxMb = BRIEF_REF_5190_MAX_BYTES / (1024 * 1024);
      setError(`File size exceeds maximum limit of ${maxMb} MB. Please select a smaller audio file.`);
      setIsValidating(false);
      return;
    }

    // 2. Check extension & MIME type
    const fileNameLower = file.name.toLowerCase();
    const hasAllowedExtension = ALLOWED_AUDIO_EXTENSIONS.some((ext) => fileNameLower.endsWith(ext));
    const hasAllowedMimeType = ALLOWED_AUDIO_MIME_TYPES.some((type) => file.type.toLowerCase().includes(type.split('/')[1]));

    if (!hasAllowedExtension && !hasAllowedMimeType && file.type !== '') {
      setError(`Invalid file format "${file.name}". Allowed formats are: MP3, WAV, M4A, AAC, OGG, WEBM, FLAC.`);
      setIsValidating(false);
      return;
    }

    // 3. Create audio URL and calculate duration via HTML5 Audio element
    const objectUrl = URL.createObjectURL(file);
    const tempAudio = new Audio();
    tempAudio.preload = 'metadata';

    const onLoadedMetadata = () => {
      const duration = tempAudio.duration || 0;
      setSelectedFile({
        file,
        name: file.name,
        size: file.size,
        formattedSize: formatBytes(file.size),
        durationSeconds: duration,
        formattedDuration: formatDuration(duration),
        audioUrl: objectUrl,
      });
      setIsValidating(false);
      cleanup();
    };

    const onError = () => {
      // If metadata couldn't load but file format matched extension, fallback gracefully
      setSelectedFile({
        file,
        name: file.name,
        size: file.size,
        formattedSize: formatBytes(file.size),
        durationSeconds: 0,
        formattedDuration: '00:00',
        audioUrl: objectUrl,
      });
      setIsValidating(false);
      cleanup();
    };

    const cleanup = () => {
      tempAudio.removeEventListener('loadedmetadata', onLoadedMetadata);
      tempAudio.removeEventListener('error', onError);
    };

    tempAudio.addEventListener('loadedmetadata', onLoadedMetadata);
    tempAudio.addEventListener('error', onError);
    tempAudio.src = objectUrl;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (selectedFile?.audioUrl) {
        URL.revokeObjectURL(selectedFile.audioUrl);
      }
    };
  }, [selectedFile]);

  return {
    selectedFile,
    error,
    isValidating,
    handleFileSelect,
    clearFile,
    setError,
  };
}
