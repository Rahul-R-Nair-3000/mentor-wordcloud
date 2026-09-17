import React from 'react';
import { SlidersHorizontal } from 'lucide-react';

export type UIState = 'recording' | 'recorded' | 'upload-progress' | 'analyzing' | 'error' | 'result';

interface DevStateSwitcherProps {
  currentState: UIState;
  onStateChange: (state: UIState) => void;
}

export const DevStateSwitcher: React.FC<DevStateSwitcherProps> = ({ currentState, onStateChange }) => {
  const states: { key: UIState; label: string; badge: string }[] = [
    { key: 'recording', label: '1. Recording', badge: 'Mic Active' },
    { key: 'recorded', label: '2. Recorded', badge: 'Preview & Submit' },
    { key: 'upload-progress', label: '3. Uploading', badge: 'Progress Bar' },
    { key: 'analyzing', label: '4. Analyzing', badge: 'AI Pipeline' },
    { key: 'error', label: '5. Error', badge: 'Alert Card' },
    { key: 'result', label: '6. Result', badge: 'Word Cloud' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto mb-6 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
          <SlidersHorizontal className="w-4 h-4" />
          <span>Interactive State Reviewer (Fake Switcher)</span>
        </div>
        <span className="text-[11px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full font-mono">
          State: <strong className="text-white">{currentState}</strong>
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
        {states.map(({ key, label, badge }) => {
          const isActive = currentState === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onStateChange(key)}
              className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-left transition-all ${
                isActive
                  ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-500/10'
                  : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
              }`}
            >
              <span className={`text-xs font-bold ${isActive ? 'text-indigo-300' : 'text-slate-300'}`}>
                {label}
              </span>
              <span className="text-[10px] text-slate-400 truncate max-w-full">
                {badge}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
