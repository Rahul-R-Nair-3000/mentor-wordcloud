import React from 'react';
import { Cloud, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="w-full max-w-4xl mx-auto px-4 py-6 text-center">
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs sm:text-sm font-medium mb-3 backdrop-blur-md">
        <Sparkles className="w-4 h-4 animate-pulse text-indigo-400" />
        <span>AI-Powered Session Intelligence</span>
      </div>
      
      <div className="flex items-center justify-center gap-3 mb-2">
        <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-lg shadow-indigo-500/25">
          <Cloud className="w-7 h-7 sm:w-8 sm:h-8" />
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
          Mentor Wordcloud
        </h1>
      </div>

      <p className="text-sm sm:text-base text-slate-400 max-w-md mx-auto leading-relaxed">
        Record or upload your mentorship feedback sessions to instantly extract key themes, actionable insights, and visual cloud maps.
      </p>
    </header>
  );
};
