import React, { useState } from 'react';
import { Sparkles, Volume2, X, MessageCircle, Lightbulb, Compass } from 'lucide-react';
import { UserProfile } from '../types';
import { REGIONAL_PRESETS } from '../data/mockData';
import { speakText } from '../utils/audio';

interface MitraCompanionProps {
  userProfile: UserProfile;
  currentScreen?: string;
  onOpenTalk?: () => void;
}

export const MitraCompanion: React.FC<MitraCompanionProps> = ({
  userProfile,
  currentScreen = 'home',
  onOpenTalk,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const activePreset = REGIONAL_PRESETS[userProfile.destinationCity as 'Chennai' | 'Jaipur' | 'Kolkata'] || REGIONAL_PRESETS.Chennai;

  const handleSpeakAdvice = () => {
    setIsSpeaking(true);
    speakText(
      activePreset.mitraAdvice,
      userProfile.targetLanguage,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  if (isMinimized) {
    return (
      <button
        type="button"
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-6 right-6 z-40 bg-[#9E321E] hover:bg-[#882816] text-white p-3.5 rounded-full shadow-lg border-2 border-white flex items-center gap-2 group transition-all cursor-pointer"
        title="Open Mitra, your regional companion"
      >
        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center font-serif text-xs font-bold">
          {activePreset.glyph}
        </div>
        <span className="text-xs font-bold pr-1">Mitra Tip</span>
      </button>
    );
  }

  return (
    <div className="bg-[#FAF5ED] rounded-2xl p-4 sm:p-5 border border-[#E7D6C3] shadow-[0_4px_20px_rgba(40,25,18,0.05)] relative overflow-hidden transition-all">
      {/* Decorative warm aura */}
      <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-[#EBD8C1]/40 pointer-events-none" />

      <div className="flex items-start justify-between gap-3 relative z-10">
        <div className="flex items-center gap-3">
          {/* Avatar Character Badge */}
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#9E321E] to-[#B85D36] text-white flex items-center justify-center font-serif font-bold text-base shadow-sm shrink-0">
            {activePreset.glyph}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif-display font-bold text-base text-[#281D17]">
                Mitra
              </span>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#EDE1D1] text-[#8C341F] tracking-wider">
                {activePreset.city} Buddy
              </span>
            </div>
            <div className="text-[11px] text-[#786154]">
              Your student companion on campus
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleSpeakAdvice}
            className="p-1.5 rounded-lg text-[#8C341F] hover:bg-[#EFE3D3] transition-colors cursor-pointer"
            title="Listen to Mitra"
          >
            <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-pulse text-[#9E321E]' : ''}`} />
          </button>
          <button
            type="button"
            onClick={() => setIsMinimized(true)}
            className="p-1.5 rounded-lg text-[#998072] hover:bg-[#EFE3D3] transition-colors cursor-pointer"
            title="Minimize Mitra"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Speech Bubble Note */}
      <div className="mt-3 bg-white/90 p-3.5 rounded-xl border border-[#EADBCE] text-xs text-[#4A372E] leading-relaxed relative z-10">
        <div className="flex items-start gap-2">
          <Lightbulb className="w-4 h-4 text-[#9E321E] shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-[#231A15] block mb-0.5">
              Survival Hack:
            </span>
            {activePreset.mitraAdvice}
          </div>
        </div>
      </div>

      {/* Quick Interactive Prompt */}
      {onOpenTalk && (
        <div className="mt-3 flex items-center justify-between text-[11px]">
          <span className="text-[#7F675B]">Want to practice this with Mitra?</span>
          <button
            type="button"
            onClick={onOpenTalk}
            className="font-bold text-[#9E321E] hover:underline cursor-pointer"
          >
            Start simulated conversation →
          </button>
        </div>
      )}
    </div>
  );
};
