import React from 'react';
import { Mic, Upload } from 'lucide-react';

export type InputMode = 'record' | 'upload';

interface SegmentedControlProps {
  mode: InputMode;
  onModeChange: (mode: InputMode) => void;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({ mode, onModeChange }) => {
  return (
    <div className="w-full max-w-xs sm:max-w-sm mx-auto mb-6 p-1.5 bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl flex items-center shadow-inner">
      <button
        type="button"
        onClick={() => onModeChange('record')}
        className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
          mode === 'record'
            ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
        }`}
      >
        <Mic className={`w-4 h-4 ${mode === 'record' ? 'text-white' : 'text-slate-400'}`} />
        <span>Record Audio</span>
      </button>

      <button
        type="button"
        onClick={() => onModeChange('upload')}
        className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
          mode === 'upload'
            ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
        }`}
      >
        <Upload className={`w-4 h-4 ${mode === 'upload' ? 'text-white' : 'text-slate-400'}`} />
        <span>Upload Audio</span>
      </button>
    </div>
  );
};
