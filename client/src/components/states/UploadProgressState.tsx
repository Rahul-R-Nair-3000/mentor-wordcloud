import React from 'react';
import { FileAudio, X, Sparkles, CheckCircle2 } from 'lucide-react';

interface UploadProgressStateProps {
  fileName?: string;
  formattedSize?: string;
  formattedDuration?: string;
  onAnalyze?: () => void;
  onCancel?: () => void;
}

export const UploadProgressState: React.FC<UploadProgressStateProps> = ({
  fileName = 'mentor_feedback_session.mp3',
  formattedSize = '8.4 MB',
  formattedDuration = '03:12',
  onAnalyze,
  onCancel,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-2xl backdrop-blur-xl flex flex-col items-center">
      {/* Upload Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-6">
        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        <span>AUDIO FILE VALIDATED & READY</span>
      </div>

      {/* File Card */}
      <div className="w-full p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-3 rounded-xl bg-indigo-600/20 text-indigo-400 shrink-0">
            <FileAudio className="w-6 h-6" />
          </div>
          <div className="text-left min-w-0">
            <p className="text-sm font-semibold text-slate-200 truncate">
              {fileName}
            </p>
            <p className="text-xs text-slate-400">
              {formattedSize} • {formattedDuration} duration
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition shrink-0 ml-2"
          title="Remove file"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
        <button
          type="button"
          onClick={onCancel}
          className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-700 bg-slate-800/60 text-slate-300 font-semibold text-xs sm:text-sm hover:bg-slate-800 transition"
        >
          <span>Choose Another File</span>
        </button>

        <button
          type="button"
          onClick={onAnalyze}
          className="w-full sm:w-auto flex-[1.5] flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-indigo-500/25 hover:from-indigo-500 hover:to-purple-500 transition"
        >
          <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
          <span>Analyze Audio</span>
        </button>
      </div>
    </div>
  );
};
