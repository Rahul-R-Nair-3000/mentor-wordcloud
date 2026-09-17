import React from 'react';
import { Sparkles, Check, Loader2, Cpu } from 'lucide-react';

export const AnalyzingState: React.FC = () => {
  const steps = [
    { label: 'Transcribing speech to text via AI model', status: 'completed' },
    { label: 'Filtering filler words & extracting keywords', status: 'in-progress' },
    { label: 'Calculating term frequency & sentiment weights', status: 'pending' },
    { label: 'Rendering visual layout and interactive cloud', status: 'pending' },
  ];

  return (
    <div className="w-full max-w-xl mx-auto p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-2xl backdrop-blur-xl flex flex-col items-center text-center">
      {/* Processing Animated Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-400 text-xs font-semibold mb-6">
        <Sparkles className="w-4 h-4 animate-spin text-violet-400" />
        <span>ANALYZING SESSION AUDIO</span>
      </div>

      {/* Main Spinner Graphic */}
      <div className="relative my-4 flex items-center justify-center">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-slate-800 border-t-indigo-500 border-r-violet-500 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center text-indigo-400">
          <Cpu className="w-8 h-8 animate-pulse" />
        </div>
      </div>

      <h3 className="text-lg sm:text-xl font-bold text-white mt-2 mb-1">
        Generating Word Cloud...
      </h3>
      <p className="text-xs sm:text-sm text-slate-400 mb-6 max-w-xs">
        Our natural language processing pipeline is extracting insights from your mentor feedback.
      </p>

      {/* Step Pipeline Progress Card */}
      <div className="w-full p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50 text-left flex flex-col gap-3">
        {steps.map((step, idx) => (
          <div key={idx} className="flex items-center gap-3">
            {step.status === 'completed' && (
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5" />
              </div>
            )}
            {step.status === 'in-progress' && (
              <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              </div>
            )}
            {step.status === 'pending' && (
              <div className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center shrink-0 text-[10px] font-bold border border-slate-700">
                {idx + 1}
              </div>
            )}
            
            <span
              className={`text-xs font-medium ${
                step.status === 'completed'
                  ? 'text-slate-300 line-through opacity-80'
                  : step.status === 'in-progress'
                  ? 'text-indigo-300 font-semibold'
                  : 'text-slate-400'
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
