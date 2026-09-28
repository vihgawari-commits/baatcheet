import React, { useState } from 'react';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import { speakText } from '../utils/audio';
import { RegionalLanguage } from '../types';

interface AudioPlayerButtonProps {
  text: string;
  language?: RegionalLanguage | string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'subtle' | 'primary' | 'ghost';
  label?: string;
  className?: string;
}

export const AudioPlayerButton: React.FC<AudioPlayerButtonProps> = ({
  text,
  language = 'Tamil',
  size = 'md',
  variant = 'subtle',
  label,
  className = '',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    await speakText(
      text,
      language,
      () => setIsPlaying(true),
      () => setIsPlaying(false)
    );
  };

  const sizeClasses = {
    sm: 'p-1.5 text-xs gap-1.5',
    md: 'p-2 text-sm gap-2',
    lg: 'px-4 py-2.5 text-base gap-2.5',
  }[size];

  const variantClasses = {
    subtle: 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200/60 active:bg-amber-200/70',
    primary: 'bg-amber-600 text-white hover:bg-amber-700 shadow-sm active:bg-amber-800',
    ghost: 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 active:bg-slate-200',
  }[variant];

  return (
    <button
      type="button"
      onClick={handlePlay}
      title={isPlaying ? 'Stop audio' : 'Listen to native pronunciation'}
      aria-label={label || 'Listen to native pronunciation'}
      className={`inline-flex items-center justify-center rounded-lg font-medium transition-all duration-150 cursor-pointer ${sizeClasses} ${variantClasses} ${className}`}
    >
      {isPlaying ? (
        <span className="flex items-center gap-1.5">
          <Volume2 className="w-4 h-4 animate-pulse text-amber-600" />
          <span className="flex items-end gap-0.5 h-3">
            <span className="w-0.5 h-2 bg-amber-600 animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-0.5 h-3 bg-amber-600 animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-0.5 h-1.5 bg-amber-600 animate-bounce" style={{ animationDelay: '300ms' }} />
          </span>
          {label && <span className="font-medium text-xs">{label}</span>}
        </span>
      ) : (
        <span className="flex items-center gap-1.5">
          <Volume2 className="w-4 h-4" />
          {label && <span>{label}</span>}
        </span>
      )}
    </button>
  );
};
