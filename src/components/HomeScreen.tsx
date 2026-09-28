import React, { useState } from 'react';
import {
  MessageSquare,
  Camera,
  Sparkles,
  ArrowRight,
  BookOpen,
  MapPin,
  Bookmark,
  Check,
  Volume2,
  Compass,
  Play,
  Flame,
} from 'lucide-react';
import { UserProfile, SavedPhrase, ArrivalStageId } from '../types';
import { REGIONAL_PRESETS, ARRIVAL_STAGES } from '../data/mockData';
import { AudioPlayerButton } from './AudioPlayerButton';
import { MitraCompanion } from './MitraCompanion';
import { addSavedPhrase } from '../utils/storage';

interface HomeScreenProps {
  userProfile: UserProfile;
  onNavigateTab: (tab: 'home' | 'talk' | 'scan' | 'practice' | 'phrasebook' | 'progress') => void;
  onSelectScenario: (scenarioId: string) => void;
  onStartPracticeWithPhrase: (phrase: { script: string; romanized: string; meaning: string }) => void;
  onOpenLiveTranslate: () => void;
  onOpenMap: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  userProfile,
  onNavigateTab,
  onSelectScenario,
  onStartPracticeWithPhrase,
  onOpenLiveTranslate,
  onOpenMap,
}) => {
  const activeCityKey = (userProfile.destinationCity as 'Chennai' | 'Jaipur' | 'Kolkata') || 'Chennai';
  const activePreset = REGIONAL_PRESETS[activeCityKey] || REGIONAL_PRESETS.Chennai;
  const stages = ARRIVAL_STAGES[activeCityKey] || ARRIVAL_STAGES.Chennai;

  const [activeStageId, setActiveStageId] = useState<ArrivalStageId>('day1');
  const [savedSuccessId, setSavedSuccessId] = useState<string | null>(null);

  const currentStage = stages.find((s) => s.id === activeStageId) || stages[0];

  const handleQuickSave = (phrase: { script: string; romanized: string; meaning: string }, id: string) => {
    addSavedPhrase({
      sourceText: phrase.meaning,
      targetScript: phrase.script,
      romanized: phrase.romanized,
      meaning: phrase.meaning,
      category: 'food',
      difficulty: 'Beginner',
      pronunciationGuide: phrase.meaning,
    });
    setSavedSuccessId(id);
    setTimeout(() => setSavedSuccessId(null), 2000);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* 1. VISUAL CINEMATIC HERO BANNER */}
      <div className="relative rounded-3xl overflow-hidden shadow-lg border border-[#E8DDCE] min-h-[220px] sm:min-h-[260px] flex items-end">
        {/* Background Landmark Photo with Warm Scrim */}
        <img
          src={activePreset.heroImage}
          alt={activePreset.city}
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.88] saturate-[1.1]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1410] via-[#1C1410]/60 to-transparent" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-[#1C1410]/40" />

        {/* Hero Overlay Content */}
        <div className="relative z-10 w-full p-6 sm:p-8 flex flex-col md:flex-row md:items-end justify-between gap-5 text-white">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md text-amber-200 font-bold text-sm flex items-center justify-center font-serif border border-white/20">
                {activePreset.glyph}
              </span>
              <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-amber-200">
                {activePreset.state} · LOCAL COMPANION
              </span>
            </div>

            <div className="flex flex-wrap items-baseline gap-3">
              <h1 className="font-serif-display text-3xl sm:text-5xl font-bold tracking-tight text-white drop-shadow-sm">
                {activePreset.localGreeting}, {userProfile.name}!
              </h1>
              <span className="text-xl sm:text-2xl font-serif text-amber-300">
                ({activePreset.greetingScript})
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-200 font-normal leading-relaxed line-clamp-2 max-w-lg">
              {activePreset.atmosphere}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onOpenMap}
              className="px-4 py-2.5 bg-white/95 hover:bg-white text-[#2B1F19] text-xs font-bold rounded-xl backdrop-blur-md transition-all flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <Compass className="w-4 h-4 text-[#9E321E]" />
              <span>Map & Cities</span>
            </button>
            <button
              type="button"
              onClick={onOpenLiveTranslate}
              className="px-4 py-2.5 bg-[#9E321E] hover:bg-[#882816] text-white text-xs font-bold rounded-xl shadow-md transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span>Live 2-Way</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. THE THREE DOMINANT VISUAL ACTION CARDS (TALK, SCAN, PRACTICE) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#9E321E]">
            Core Actions
          </span>
          <span className="text-xs text-[#705A4E]">
            Tap any card to dive in
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* ACTION 1: TALK */}
          <div
            onClick={() => onNavigateTab('talk')}
            className="group relative rounded-3xl overflow-hidden bg-white border border-[#E8DDCE] hover:border-[#9E321E] shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div className="relative h-44 w-full overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=600&q=80"
                alt="Auto & Canteen dialogue"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute top-3.5 left-3.5 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-[#9E321E] uppercase tracking-wider shadow-xs">
                ACTION 01 · VOICE
              </div>
              <div className="absolute bottom-3 left-4 text-white">
                <div className="flex items-center gap-2 font-serif-display text-2xl font-bold">
                  <MessageSquare className="w-5 h-5 text-amber-400" />
                  <span>TALK</span>
                </div>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <p className="text-xs text-[#6B5549] leading-relaxed">
                Simulated real-world roleplay: order at the canteen counter, bargain auto meters, or chat with seniors.
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-[#EFE3D5] text-xs font-bold text-[#9E321E]">
                <span>Start Talking</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* ACTION 2: SCAN */}
          <div
            onClick={() => onNavigateTab('scan')}
            className="group relative rounded-3xl overflow-hidden bg-white border border-[#E8DDCE] hover:border-[#1E6B65] shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div className="relative h-44 w-full overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80"
                alt="Menu & Sign scanning"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute top-3.5 left-3.5 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-[#1E6B65] uppercase tracking-wider shadow-xs">
                ACTION 02 · VISION
              </div>
              <div className="absolute bottom-3 left-4 text-white">
                <div className="flex items-center gap-2 font-serif-display text-2xl font-bold">
                  <Camera className="w-5 h-5 text-teal-300" />
                  <span>SCAN</span>
                </div>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <p className="text-xs text-[#6B5549] leading-relaxed">
                Photograph tiffin menus, bus route signs, and hostel boards. Gemini explains dishes and teaches ordering phrases.
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-[#EFE3D5] text-xs font-bold text-[#1E6B65]">
                <span>Scan Sign/Menu</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* ACTION 3: PRACTICE */}
          <div
            onClick={() => onNavigateTab('practice')}
            className="group relative rounded-3xl overflow-hidden bg-white border border-[#E8DDCE] hover:border-[#4B3E8C] shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div className="relative h-44 w-full overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80"
                alt="Pronunciation coach"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute top-3.5 left-3.5 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-[#4B3E8C] uppercase tracking-wider shadow-xs">
                ACTION 03 · COACH
              </div>
              <div className="absolute bottom-3 left-4 text-white">
                <div className="flex items-center gap-2 font-serif-display text-2xl font-bold">
                  <Sparkles className="w-5 h-5 text-purple-300" />
                  <span>PRACTICE</span>
                </div>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <p className="text-xs text-[#6B5549] leading-relaxed">
                Listen to native audio, speak into the mic, and get immediate AI syllable scores and mouth positioning advice.
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-[#EFE3D5] text-xs font-bold text-[#4B3E8C]">
                <span>Coach Voice</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. VISUAL ARRIVAL JOURNEY (4 STAGES WITH REAL PHOTOS) */}
      <section className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E8DDCE] shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#EFE3D5]">
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#9E321E]">
              {activePreset.city} Survival Path
            </div>
            <h2 className="font-serif-display text-2xl font-bold text-[#231A15]">
              Real-World Arrival Timeline
            </h2>
          </div>
          <span className="text-xs text-[#705A4E]">
            Step-by-step campus milestones
          </span>
        </div>

        {/* 4 Visual Stage Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stages.map((stage) => {
            const isSelected = activeStageId === stage.id;
            return (
              <div
                key={stage.id}
                onClick={() => setActiveStageId(stage.id)}
                className={`group rounded-2xl border overflow-hidden transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#9E321E] bg-[#FAF3EA] ring-2 ring-[#9E321E]/20 shadow-md'
                    : 'border-[#E8DDCE] bg-white hover:border-[#9E321E]/50'
                }`}
              >
                {/* Photo Header */}
                <div className="relative h-28 w-full overflow-hidden">
                  <img
                    src={stage.image}
                    alt={stage.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <span className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    Stage {stage.stageNumber}
                  </span>
                  <div className="absolute bottom-2 left-2.5 text-white font-serif-display text-base font-bold">
                    {stage.title}
                  </div>
                </div>

                {/* Phrase & Action */}
                <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-sm font-bold text-[#231A15] leading-snug line-clamp-1">
                      {stage.keyPhrase.script}
                    </div>
                    <div className="text-xs font-semibold text-[#8C341F] line-clamp-1">
                      "{stage.keyPhrase.romanized}"
                    </div>
                    <div className="text-[11px] text-[#634E43] italic line-clamp-1">
                      {stage.keyPhrase.meaning}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#EFE3D5] flex items-center justify-between">
                    <AudioPlayerButton
                      text={stage.keyPhrase.script}
                      language={userProfile.targetLanguage}
                      size="sm"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectScenario(stage.focusScenarioId);
                        onNavigateTab('talk');
                      }}
                      className="px-2.5 py-1 text-[11px] font-bold text-[#9E321E] hover:bg-[#F3E5CE]/50 rounded-lg transition-colors cursor-pointer"
                    >
                      Roleplay →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. VISUAL MITRA COMPANION SPOTLIGHT */}
      <MitraCompanion
        userProfile={userProfile}
        onOpenTalk={() => {
          onSelectScenario('food');
          onNavigateTab('talk');
        }}
      />
    </div>
  );
};
