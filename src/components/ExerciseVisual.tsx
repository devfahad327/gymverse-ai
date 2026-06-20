import React, { useEffect, useState } from 'react';
import { Play, X, Activity, Heart, ArrowDown, ArrowUp, CircleDot, Dumbbell, Hand, Triangle, Footprints } from 'lucide-react';
import { VideoModal } from './VideoModal';
import { getExerciseGif, getExerciseImage } from '@/data/exerciseImages';

const categoryStyles: Record<string, { gradient: string; Icon: React.ComponentType<{ size?: number; className?: string }> }> = {
  Chest: { gradient: 'from-emerald-600/30 to-emerald-800/30', Icon: Activity },
  Back: { gradient: 'from-blue-600/30 to-blue-800/30', Icon: ArrowUp },
  Shoulders: { gradient: 'from-amber-600/30 to-amber-800/30', Icon: CircleDot },
  Legs: { gradient: 'from-violet-600/30 to-violet-800/30', Icon: Triangle },
  Biceps: { gradient: 'from-orange-600/30 to-orange-800/30', Icon: Hand },
  Triceps: { gradient: 'from-orange-600/30 to-orange-800/30', Icon: ArrowDown },
  Abs: { gradient: 'from-cyan-600/30 to-cyan-800/30', Icon: Activity },
  Glutes: { gradient: 'from-pink-600/30 to-pink-800/30', Icon: Triangle },
  Calves: { gradient: 'from-teal-600/30 to-teal-800/30', Icon: Footprints },
  Forearms: { gradient: 'from-stone-600/30 to-stone-800/30', Icon: Hand },
  Cardio: { gradient: 'from-red-600/30 to-red-800/30', Icon: Heart },
};

const defaultStyle = { gradient: 'from-zinc-600/30 to-zinc-800/30', Icon: Dumbbell };

interface ExerciseVisualProps {
  name: string;
  category: string;
  youtubeId?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
}

function ImageModal({ src, name, onClose }: { src: string; name: string; onClose: () => void }) {
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-2 sm:p-4"
      onClick={onClose}
    >
      <div
        className="relative flex flex-col items-center max-w-2xl w-full max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between w-full mb-2">
          <p className="text-white font-bold text-sm truncate pr-4">{name}</p>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-zinc-800 transition-all cursor-pointer"
            title="Close (Esc)"
          >
            <X size={20} />
          </button>
        </div>
        <div className="w-full flex-1 min-h-0 rounded-xl overflow-hidden bg-black/60 border border-zinc-800">
          <img src={src} alt={name} className="w-full h-full object-contain" />
        </div>
      </div>
    </div>
  );
}

export const ExerciseVisual: React.FC<ExerciseVisualProps> = ({ name, category, youtubeId, className = '', size = 'md', showName = true }) => {
  const [showVideo, setShowVideo] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [failedSrcs, setFailedSrcs] = useState<Set<string>>(new Set());
  const style = categoryStyles[category] || defaultStyle;
  const gradient = `bg-gradient-to-br ${style.gradient}`;
  const gifUrl = getExerciseGif(name);
  const imageUrl = getExerciseImage(name);
  const sources = [gifUrl, imageUrl].filter(Boolean) as string[];
  const currentSrc = sources.find(s => !failedSrcs.has(s)) ?? null;
  const showImage = currentSrc !== null;

  const isBanner = size === 'lg';
  const sizeClasses = size === 'sm'
    ? { box: 'w-9 h-9', icon: 16, playBtn: 'w-5 h-5', playIcon: 10, playOffset: '-top-1 -right-1' }
    : size === 'lg'
    ? { box: 'w-full h-36', icon: 28, playBtn: 'w-7 h-7', playIcon: 14, playOffset: 'top-2 right-2' }
    : { box: 'w-14 h-14', icon: 20, playBtn: 'w-5 h-5', playIcon: 10, playOffset: '-top-1 -right-1' };

  const thumbnail = (
    <button
      onClick={() => showImage && setShowImageModal(true)}
      className={`block ${showImage ? 'cursor-pointer hover:ring-2 hover:ring-emerald-500/50 rounded-lg transition-all' : ''}`}
      disabled={!showImage}
      title={showImage ? `Tap to enlarge ${name}` : ''}
    >
      {showImage ? (
        <div className={`${sizeClasses.box} rounded-lg overflow-hidden border border-white/10 bg-black/40`}>
          <img
            src={currentSrc}
            alt={name}
            className="w-full h-full object-contain"
            onError={() => setFailedSrcs(prev => new Set(prev).add(currentSrc))}
          />
        </div>
      ) : (
        <div className={`${sizeClasses.box} rounded-lg ${gradient} border border-white/10 flex flex-col items-center justify-center gap-0.5`}>
          <style.Icon size={sizeClasses.icon} className="text-white/50" />
          {isBanner && <span className="text-[9px] text-white/30 font-medium">{category}</span>}
        </div>
      )}
    </button>
  );

  return (
    <>
      <div className={`${isBanner ? 'flex flex-col' : 'flex items-center'} gap-2 ${className}`}>
        <div className={`relative ${isBanner ? 'w-full' : 'shrink-0'}`}>
          {thumbnail}
          {youtubeId && (
            <button
              onClick={(e) => { e.stopPropagation(); e.preventDefault(); setShowVideo(true); }}
              className={`absolute ${sizeClasses.playOffset} ${sizeClasses.playBtn} rounded-full bg-emerald-500 border-2 border-zinc-900 flex items-center justify-center hover:bg-emerald-400 hover:scale-110 transition-all cursor-pointer active:scale-95 shadow-lg`}
              title={`Watch video: ${name}`}
            >
              <Play size={sizeClasses.playIcon} fill="white" className="text-white ml-[0.5px]" />
            </button>
          )}
        </div>
        {showName && (
          <span className={`text-white font-medium truncate ${isBanner ? 'text-xs text-center px-2 pb-2' : 'text-sm'}`}>
            {name}
          </span>
        )}
      </div>
      {showVideo && youtubeId && (
        <VideoModal
          youtubeId={youtubeId}
          exerciseName={name}
          onClose={() => setShowVideo(false)}
        />
      )}
      {showImageModal && currentSrc && (
        <ImageModal src={currentSrc} name={name} onClose={() => setShowImageModal(false)} />
      )}
    </>
  );
};
