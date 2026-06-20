import React, { useEffect, useState } from 'react';
import { X, Play, ExternalLink, Search } from 'lucide-react';

interface VideoModalProps {
  youtubeId?: string;
  exerciseName: string;
  onClose: () => void;
}

const categoryVisuals: Record<string, { gradient: string; label: string }> = {
  Chest: { gradient: 'from-emerald-600 to-emerald-900', label: 'Chest' },
  Back: { gradient: 'from-blue-600 to-blue-900', label: 'Back' },
  Shoulders: { gradient: 'from-amber-600 to-amber-900', label: 'Shoulders' },
  Legs: { gradient: 'from-violet-600 to-violet-900', label: 'Legs' },
  Biceps: { gradient: 'from-orange-600 to-orange-900', label: 'Biceps' },
  Triceps: { gradient: 'from-orange-600 to-orange-900', label: 'Triceps' },
  Abs: { gradient: 'from-cyan-600 to-cyan-900', label: 'Core' },
  Glutes: { gradient: 'from-pink-600 to-pink-900', label: 'Glutes' },
  Calves: { gradient: 'from-teal-600 to-teal-900', label: 'Calves' },
  Forearms: { gradient: 'from-stone-600 to-stone-900', label: 'Forearms' },
  Cardio: { gradient: 'from-red-600 to-red-900', label: 'Cardio' },
};

const defaultVisual = { gradient: 'from-zinc-600 to-zinc-900', label: 'Exercise' };

export const VideoModal: React.FC<VideoModalProps> = ({ youtubeId, exerciseName, onClose }) => {
  const [loadError, setLoadError] = useState(false);
  const category = Object.entries(categoryVisuals).find(([key]) =>
    exerciseName.toLowerCase().includes(key.toLowerCase())
  )?.[0] || '';
  const visual = categoryVisuals[category] || defaultVisual;
  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(exerciseName + ' proper form')}`;
  const directUrl = youtubeId ? `https://www.youtube.com/watch?v=${youtubeId}` : searchUrl;

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-2 md:p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl shadow-black/50 max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-900/95 shrink-0">
          <h3 className="text-white font-bold text-sm truncate pr-4">{exerciseName}</h3>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-zinc-800 transition-all cursor-pointer"
            title="Close (Esc)"
          >
            <X size={20} />
          </button>
        </div>
        <div className="relative flex-1 bg-black min-h-0">
          {!youtubeId || loadError ? (
            <div className={`absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 bg-gradient-to-br ${visual.gradient}`}>
              <Play size={48} className="text-white/20" />
              <p className="text-white font-bold text-lg text-center">{exerciseName}</p>
              <p className="text-zinc-400 text-xs text-center max-w-sm">{category || visual.label} exercise — watch a demo on YouTube to see proper form.</p>
              <a
                href={searchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-all"
                onClick={(e) => e.stopPropagation()}
              >
                <Search size={14} /> Search YouTube for demo
              </a>
            </div>
          ) : (
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
              title={`${exerciseName} demonstration`}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onError={() => setLoadError(true)}
            />
          )}
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-800 bg-zinc-900/95 shrink-0">
          <p className="text-[10px] text-zinc-500">
            Press <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[9px] font-mono">ESC</kbd> to close
          </p>
          <div className="flex gap-2">
            <a
              href={directUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition-all"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink size={12} /> Open on YouTube
            </a>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
