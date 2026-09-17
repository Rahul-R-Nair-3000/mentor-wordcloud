import React, { useState, useRef } from 'react';
import { Download, RefreshCw, Sparkles, FileText, BarChart2, Copy, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';

export interface TermItem {
  term: string;
  weight: number;
  count: number;
}

export interface AnalyzeResultData {
  transcript: string;
  terms: TermItem[];
  durationSec: number;
}

interface ResultStateProps {
  analysisResult?: AnalyzeResultData | null;
  onReset?: () => void;
}

export const ResultState: React.FC<ResultStateProps> = ({ analysisResult, onReset }) => {
  const [activeTab, setActiveTab] = useState<'cloud' | 'keywords' | 'transcript'>('cloud');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const cloudRef = useRef<HTMLDivElement>(null);

  // Use returned terms from API or default fallback dataset
  const termsList = analysisResult?.terms && analysisResult.terms.length > 0
    ? analysisResult.terms
    : [
        { term: 'Architecture', weight: 90, count: 8 },
        { term: 'System Design', weight: 80, count: 6 },
        { term: 'Code Quality', weight: 70, count: 5 },
        { term: 'Testing', weight: 60, count: 4 },
        { term: 'Scalability', weight: 50, count: 3 },
      ];

  const transcriptText = analysisResult?.transcript || "This is a test transcript.";
  const durationSec = analysisResult?.durationSec ?? 7;

  // Helper size and color calculation based on term weight
  const getStyling = (weight: number) => {
    if (weight >= 80) return { size: 'text-3xl sm:text-5xl font-extrabold', color: 'text-indigo-400' };
    if (weight >= 60) return { size: 'text-2xl sm:text-4xl font-bold', color: 'text-violet-300' };
    if (weight >= 40) return { size: 'text-xl sm:text-3xl font-bold', color: 'text-purple-400' };
    return { size: 'text-lg sm:text-2xl font-semibold', color: 'text-sky-300' };
  };

  // Export word cloud container as PNG image
  const handleExportPng = async () => {
    if (!cloudRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(cloudRef.current, {
        backgroundColor: '#020617',
        scale: 2,
        useCORS: true,
      });
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = 'wordcloud.png';
      link.click();
    } catch (err) {
      console.error('Failed to export PNG:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800 shadow-2xl backdrop-blur-xl flex flex-col items-center">
      {/* Header Bar */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 text-white shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h2 className="text-lg font-bold text-white leading-snug">Session Wordcloud Result</h2>
            <p className="text-xs text-slate-400">
              {termsList.length} key topics extracted from {durationSec}s session audio
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={handleExportPng}
            disabled={isExporting}
            className="flex items-center gap-1.5 py-2 px-3 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold hover:bg-indigo-600/30 disabled:opacity-50 transition"
          >
            {isExporting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>{isExporting ? 'Exporting...' : 'Export PNG'}</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 py-2 px-3 rounded-xl border border-slate-700 bg-slate-800/60 text-slate-300 text-xs font-semibold hover:bg-slate-800 transition"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
            <span>New Session</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="w-full flex items-center gap-2 mb-6 p-1 bg-slate-950/80 rounded-xl border border-slate-800">
        <button
          type="button"
          onClick={() => setActiveTab('cloud')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition ${
            activeTab === 'cloud'
              ? 'bg-indigo-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Word Cloud Visual</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('keywords')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition ${
            activeTab === 'keywords'
              ? 'bg-indigo-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BarChart2 className="w-3.5 h-3.5" />
          <span>Top Frequency</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('transcript')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition ${
            activeTab === 'transcript'
              ? 'bg-indigo-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Transcript</span>
        </button>
      </div>

      {/* Tab 1: Word Cloud Container */}
      {activeTab === 'cloud' && (
        <div
          ref={cloudRef}
          className="w-full min-h-[260px] sm:min-h-[320px] p-6 sm:p-10 rounded-2xl bg-slate-950/90 border border-slate-800 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-center select-none shadow-inner relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/10 via-transparent to-violet-900/10 pointer-events-none" />

          {termsList.map((item, idx) => {
            const { size, color } = getStyling(item.weight);
            return (
              <span
                key={idx}
                className={`cursor-pointer transition-all duration-300 hover:scale-110 hover:brightness-125 px-2 py-1 rounded-lg hover:bg-slate-800/40 ${size} ${color}`}
                title={`Weight: ${item.weight} (Count: ${item.count})`}
              >
                {item.term}
              </span>
            );
          })}
        </div>
      )}

      {/* Tab 2: Top Keywords Table */}
      {activeTab === 'keywords' && (
        <div className="w-full rounded-2xl bg-slate-950/90 border border-slate-800 overflow-hidden">
          <div className="grid grid-cols-12 gap-2 p-3 bg-slate-900 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
            <span className="col-span-1">#</span>
            <span className="col-span-6">Topic / Keyword</span>
            <span className="col-span-3">Count / Weight</span>
            <span className="col-span-2 text-right">Prominence</span>
          </div>

          <div className="divide-y divide-slate-800/60 text-xs">
            {termsList.map((item, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-2 p-3 items-center hover:bg-slate-900/40">
                <span className="col-span-1 font-mono text-slate-400">#{idx + 1}</span>
                <span className="col-span-6 font-semibold text-slate-200">{item.term}</span>
                <span className="col-span-3 font-mono text-indigo-300">{item.count} times (w={item.weight})</span>
                <div className="col-span-2 flex justify-end">
                  <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-mono text-[10px] font-bold">
                    {item.weight}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Transcript View */}
      {activeTab === 'transcript' && (
        <div className="w-full p-5 rounded-2xl bg-slate-950/90 border border-slate-800 text-left">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
            <span className="text-xs font-semibold text-slate-300">Generated Session Transcript</span>
            <button
              type="button"
              className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 font-medium"
            >
              <Copy className="w-3 h-3" />
              <span>Copy Text</span>
            </button>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans bg-slate-900/60 p-4 rounded-xl border border-slate-800/60">
            "{transcriptText}"
          </p>
        </div>
      )}
    </div>
  );
};
