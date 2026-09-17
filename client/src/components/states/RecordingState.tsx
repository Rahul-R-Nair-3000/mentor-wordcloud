import React from 'react';
import { Square, Mic } from 'lucide-react';

interface RecordingStateProps {
  isRecording?: boolean;
  formattedTime?: string;
  onStart?: () => void;
  onStop?: () => void;
  onCancel?: () => void;
}

export const RecordingState: React.FC<RecordingStateProps> = ({
  isRecording = true,
  formattedTime = '00:00',
  onStart,
  onStop,
  onCancel,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-2xl backdrop-blur-xl flex flex-col items-center text-center">
      {/* Active Recording Pulsing Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold mb-6">
        <span className={`w-2 h-2 rounded-full bg-red-500 ${isRecording ? 'animate-ping' : ''}`} />
        <span>{isRecording ? 'RECORDING IN PROGRESS' : 'READY TO RECORD'}</span>
      </div>

      {/* Timer Display */}
      <div className="mb-6">
        <div className="text-4xl sm:text-6xl font-mono font-bold tracking-tight text-white mb-1">
          {formattedTime}
        </div>
        <p className="text-xs text-slate-400">Max limit: 10:00 minutes</p>
      </div>

      {/* Equalizer Visualizer Bars */}
      <div className="flex items-center justify-center gap-1.5 h-12 my-4 w-full max-w-xs">
        {[40, 75, 30, 90, 60, 100, 45, 80, 50, 95, 35, 70, 40].map((height, i) => (
          <div
            key={i}
            className={`w-1.5 bg-gradient-to-t from-indigo-600 to-rose-500 rounded-full transition-all duration-300 ${
              isRecording ? 'animate-soundwave' : 'opacity-40'
            }`}
            style={{
              height: isRecording ? `${height}%` : '20%',
              animationDelay: `${(i % 5) * 0.15}s`,
            }}
          />
        ))}
      </div>

      {/* Status Description */}
      <p className="text-sm text-slate-300 mb-8 max-w-xs">
        {isRecording
          ? 'Speak clearly into your microphone to record your mentor feedback.'
          : 'Click Start Recording to begin.'}
      </p>

      {/* Action Controls */}
      <div className="flex items-center gap-4 w-full max-w-xs justify-center">
        {!isRecording ? (
          <button
            type="button"
            onClick={onStart}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-indigo-500/25 hover:from-indigo-500 hover:to-violet-500 transition"
          >
            <Mic className="w-4 h-4 text-white" />
            <span>Start Recording</span>
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-700 bg-slate-800/60 text-slate-300 font-semibold text-xs sm:text-sm hover:bg-slate-800 transition"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onStop}
              className="flex-[1.5] flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-red-500/25 hover:from-red-500 hover:to-rose-500 transition"
            >
              <Square className="w-4 h-4 fill-white" />
              <span>Stop & Save</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};
