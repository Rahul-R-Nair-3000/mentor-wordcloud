import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Trash2, Sparkles, Music, CheckCircle2 } from 'lucide-react';

interface RecordedStateProps {
  audioUrl?: string | null;
  fileName?: string;
  formattedDuration?: string;
  formattedSize?: string;
  onDiscard?: () => void;
  onAnalyze?: () => void;
}

export const RecordedState: React.FC<RecordedStateProps> = ({
  audioUrl,
  fileName = 'Recorded_Session_Feedback.wav',
  formattedDuration = '00:00',
  formattedSize = '1.4 MB',
  onDiscard,
  onAnalyze,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration || 0);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioUrl]);

  const togglePlayback = () => {
    if (!audioRef.current || !audioUrl) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
    }
  };

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatSecs = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-xl mx-auto p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-2xl backdrop-blur-xl flex flex-col items-center">
      {/* Hidden audio element for real playback */}
      {audioUrl && <audio ref={audioRef} src={audioUrl} preload="auto" />}

      {/* Success Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-6">
        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        <span>AUDIO CAPTURED READY</span>
      </div>

      {/* Audio Wave preview card */}
      <div className="w-full p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 mb-6 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400">
              <Music className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-slate-200 truncate max-w-[200px] sm:max-w-xs">{fileName}</p>
              <p className="text-[11px] text-slate-400">{formattedSize} • {formattedDuration} duration</p>
            </div>
          </div>
          <span className="text-xs font-mono text-indigo-400 font-semibold">{formattedDuration}</span>
        </div>

        {/* Audio Player Scrubber Controls */}
        <div className="flex items-center gap-3 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={togglePlayback}
            disabled={!audioUrl}
            className="p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50 transition"
            title={isPlaying ? 'Pause playback' : 'Play audio'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-white" />
            ) : (
              <Play className="w-4 h-4 fill-white ml-0.5" />
            )}
          </button>
          
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.1}
            value={currentTime}
            onChange={handleScrub}
            disabled={!audioUrl}
            className="flex-1 accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />

          <span className="text-[11px] font-mono text-slate-400 min-w-[36px] text-right">
            {formatSecs(currentTime)}
          </span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
        <button
          type="button"
          onClick={onDiscard}
          className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-700 bg-slate-800/60 text-slate-300 font-semibold text-xs sm:text-sm hover:bg-slate-800 transition"
        >
          <Trash2 className="w-4 h-4 text-red-400" />
          <span>Discard</span>
        </button>

        <button
          type="button"
          onClick={onAnalyze}
          className="w-full sm:w-auto flex-[1.5] flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-indigo-500/25 hover:from-indigo-500 hover:to-purple-500 transition"
        >
          <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
          <span>Analyze & Generate Cloud</span>
        </button>
      </div>
    </div>
  );
};
