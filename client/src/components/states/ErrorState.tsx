import React from 'react';
import { AlertTriangle, RefreshCw, Upload, FileQuestion } from 'lucide-react';

interface ErrorStateProps {
  errorMessage?: string;
  onRetry?: () => void;
  onSelectAnother?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  errorMessage = "Unable to process audio file. The session duration was too short or no clear speech was detected.",
  onRetry,
  onSelectAnother,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-red-500/30 shadow-2xl backdrop-blur-xl flex flex-col items-center text-center">
      {/* Error Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold mb-6">
        <AlertTriangle className="w-4 h-4 text-red-400" />
        <span>PROCESSING ERROR</span>
      </div>

      {/* Error Icon */}
      <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 mb-4">
        <FileQuestion className="w-10 h-10" />
      </div>

      <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
        Audio Analysis Failed
      </h3>

      <div className="w-full p-4 rounded-2xl bg-red-950/20 border border-red-900/40 text-left mb-6">
        <p className="text-xs sm:text-sm text-red-200 leading-relaxed font-mono">
          {errorMessage}
        </p>
      </div>

      {/* Recommendations */}
      <div className="w-full text-left mb-6 text-xs text-slate-400 space-y-1.5 bg-slate-800/40 p-4 rounded-xl border border-slate-800">
        <p className="font-semibold text-slate-300 mb-1">Troubleshooting Tips:</p>
        <p>• Ensure your audio contains clear spoken feedback with minimal background noise.</p>
        <p>• Supported formats: MP3, WAV, M4A, OGG (Max 25 MB).</p>
        <p>• Try recording directly using your microphone if the upload file failed.</p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
        <button
          type="button"
          onClick={onRetry}
          className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-semibold text-xs sm:text-sm hover:from-red-500 hover:to-rose-500 transition shadow-lg shadow-red-500/20"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </button>

        <button
          type="button"
          onClick={onSelectAnother}
          className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-700 bg-slate-800/60 text-slate-300 font-semibold text-xs sm:text-sm hover:bg-slate-800 transition"
        >
          <Upload className="w-4 h-4 text-slate-400" />
          <span>Choose Different File</span>
        </button>
      </div>
    </div>
  );
};
