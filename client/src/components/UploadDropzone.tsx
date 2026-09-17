import React, { useRef } from 'react';
import { Upload, FileAudio } from 'lucide-react';
import { ALLOWED_AUDIO_EXTENSIONS } from '../constants/audio';

interface UploadDropzoneProps {
  onFileSelected?: (file: File) => void;
}

export const UploadDropzone: React.FC<UploadDropzoneProps> = ({ onFileSelected }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelected?.(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelected?.(e.dataTransfer.files[0]);
    }
  };

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="w-full max-w-xl mx-auto p-8 rounded-3xl bg-slate-900/60 border-2 border-dashed border-slate-700/80 hover:border-indigo-500/80 shadow-2xl backdrop-blur-xl flex flex-col items-center text-center group cursor-pointer transition-all duration-300"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={ALLOWED_AUDIO_EXTENSIONS.join(',')}
        onChange={handleChange}
        className="hidden"
      />

      <div className="p-4 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 mb-4 group-hover:scale-110 group-hover:bg-indigo-600/20 transition-all duration-300">
        <Upload className="w-8 h-8" />
      </div>

      <h3 className="text-lg font-bold text-white mb-1">
        Upload Feedback Session Audio
      </h3>

      <p className="text-xs sm:text-sm text-slate-400 mb-6 max-w-xs">
        Drag and drop your audio recording file here, or click to browse local files.
      </p>

      <button
        type="button"
        className="py-3 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-indigo-500/20 hover:from-indigo-500 hover:to-violet-500 transition"
      >
        Select Audio File
      </button>

      <div className="flex items-center gap-2 mt-6 text-[11px] text-slate-400">
        <FileAudio className="w-3.5 h-3.5 text-indigo-400" />
        <span>Supports MP3, WAV, M4A, AAC, OGG, WEBM, FLAC up to 25 MB</span>
      </div>
    </div>
  );
};
