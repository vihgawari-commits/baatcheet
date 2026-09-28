import React from 'react';
import {
  MessageSquare,
  Camera,
  Sparkles,
  Bookmark,
  TrendingUp,
  MapPin,
  Mic,
  Presentation,
  Home,
  Compass,
} from 'lucide-react';
import { UserProfile, RegionalTheme } from '../types';
import { REGIONAL_PRESETS } from '../data/mockData';

interface NavbarProps {
  currentTab: 'home' | 'talk' | 'scan' | 'practice' | 'phrasebook' | 'progress';
  setCurrentTab: (tab: 'home' | 'talk' | 'scan' | 'practice' | 'phrasebook' | 'progress') => void;
  userProfile: UserProfile;
  onOpenMap: () => void;
  onOpenLiveTranslate: () => void;
  onOpenDemoTour: () => void;
  currentTheme: RegionalTheme;
  onChangeTheme: (theme: RegionalTheme) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  userProfile,
  onOpenMap,
  onOpenLiveTranslate,
  onOpenDemoTour,
  currentTheme,
  onChangeTheme,
}) => {
  const activeCityKey = (userProfile.destinationCity as 'Chennai' | 'Jaipur' | 'Kolkata') || 'Chennai';
  const activePreset = REGIONAL_PRESETS[activeCityKey] || REGIONAL_PRESETS.Chennai;

  const navTabs = [
    { id: 'home', label: 'Journey', icon: Home },
    { id: 'talk', label: 'Talk', icon: MessageSquare },
    { id: 'scan', label: 'Scan', icon: Camera },
    { id: 'practice', label: 'Practice', icon: Sparkles },
    { id: 'phrasebook', label: 'Phrasebook', icon: Bookmark },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
  ] as const;

  return (
    <header className="sticky top-0 z-40 bg-[#FAF6F0]/95 backdrop-blur-md border-b border-[#E8DDCE] shadow-[0_1px_4px_rgba(40,25,18,0.03)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-17 flex items-center justify-between gap-4">
        {/* Brand Logo & Editorial Wordmark */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setCurrentTab('home')}
            className="flex items-center gap-2.5 group text-left cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-[#9E321E] text-white flex items-center justify-center font-bold text-base shadow-xs group-hover:scale-105 transition-transform">
              ब
            </div>
            <div>
              <div className="font-serif-display font-bold text-xl tracking-tight text-[#2B1F19] group-hover:text-[#9E321E] transition-colors leading-tight">
                Baatcheet
              </div>
              <p className="text-[9px] tracking-[0.2em] font-extrabold uppercase text-[#8A5A4A] hidden sm:block">
                Speak local. Feel at home.
              </p>
            </div>
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setCurrentTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  isActive
                    ? 'text-[#9E321E] bg-[#F3E7D8] shadow-2xs font-extrabold'
                    : 'text-[#6B5549] hover:text-[#2B1F19] hover:bg-[#F3ECE1]/70'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#9E321E]' : 'text-[#8F776A]'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Action Tools: Destination Switcher & Walkie-Talkie */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Destination & Target Language Switcher that triggers India Map */}
          <button
            type="button"
            onClick={onOpenMap}
            title="Open India map destination selector"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#FAF5ED] text-[#2B1F19] text-xs font-bold rounded-xl border border-[#DFD0BD] transition-all cursor-pointer shadow-2xs group"
          >
            <Compass className="w-3.5 h-3.5 text-[#9E321E] group-hover:rotate-45 transition-transform" />
            <span>{activePreset.city}</span>
            <span className="text-[#C2B1A2]">·</span>
            <span className="text-[#9E321E] font-extrabold">{activePreset.language}</span>
          </button>

          {/* Live Two-Way Translator Quick Button */}
          <button
            type="button"
            onClick={onOpenLiveTranslate}
            title="Open Live Two-Way Walkie-Talkie Translator"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#9E321E] hover:bg-[#882816] text-white text-xs font-bold rounded-xl shadow-2xs transition-colors cursor-pointer"
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Live 2-Way</span>
          </button>

          {/* TCS Tech Day Guided Demo Trigger */}
          <button
            type="button"
            onClick={onOpenDemoTour}
            title="View 2-minute Hackathon Presentation Flow"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[#882816] bg-[#F7EFE3] hover:bg-[#F0E4D3] border border-[#E4D1BD] text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            <Presentation className="w-3.5 h-3.5 text-[#9E321E]" />
            <span className="hidden sm:inline">Demo Script</span>
          </button>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#FAF6F0]/98 backdrop-blur border-t border-[#E8DDCE] px-2 py-1.5 flex items-center justify-around shadow-lg">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setCurrentTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-bold cursor-pointer ${
                isActive ? 'text-[#9E321E]' : 'text-[#7D6658] hover:text-[#2B1F19]'
              }`}
            >
              <Icon className={`w-4 h-4 mb-0.5 ${isActive ? 'text-[#9E321E]' : 'text-[#8F776A]'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
