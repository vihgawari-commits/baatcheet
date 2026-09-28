import React, { useState, useEffect } from 'react';
import { UserProfile, ScenarioCategory, RegionalTheme } from './types';
import { getStoredProfile, saveStoredProfile } from './utils/storage';
import { REGIONAL_PRESETS } from './data/mockData';
import { Navbar } from './components/Navbar';
import { IndiaMapSelector } from './components/IndiaMapSelector';
import { HomeScreen } from './components/HomeScreen';
import { TalkScreen } from './components/TalkScreen';
import { ScanScreen } from './components/ScanScreen';
import { PracticeScreen } from './components/PracticeScreen';
import { PhrasebookScreen } from './components/PhrasebookScreen';
import { ProgressScreen } from './components/ProgressScreen';
import { OnboardingModal } from './components/OnboardingModal';
import { LiveTranslateModal } from './components/LiveTranslateModal';
import { DemoTourModal } from './components/DemoTourModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState<
    'home' | 'talk' | 'scan' | 'practice' | 'phrasebook' | 'progress'
  >('home');
  const [userProfile, setUserProfile] = useState<UserProfile>(getStoredProfile());
  const [isMapOpen, setIsMapOpen] = useState<boolean>(!userProfile.completedOnboarding);
  const [activeScenarioId, setActiveScenarioId] = useState<ScenarioCategory>('food');
  const [practicePhrase, setPracticePhrase] = useState<{
    script: string;
    romanized: string;
    meaning: string;
  } | null>(null);

  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isLiveTranslateOpen, setIsLiveTranslateOpen] = useState(false);
  const [isDemoTourOpen, setIsDemoTourOpen] = useState(false);

  // Sync profile changes to localStorage
  const handleSaveProfile = (newProfile: UserProfile) => {
    setUserProfile(newProfile);
    saveStoredProfile(newProfile);
  };

  // City selection from India map
  const handleSelectCityFromMap = (city: 'Chennai' | 'Jaipur' | 'Kolkata') => {
    const preset = REGIONAL_PRESETS[city];
    const updated: UserProfile = {
      ...userProfile,
      destinationCity: city,
      targetLanguage: preset.language,
    };
    handleSaveProfile(updated);
  };

  // Confirm destination on map and enter journey
  const handleConfirmDestination = () => {
    const updated: UserProfile = {
      ...userProfile,
      completedOnboarding: true,
    };
    handleSaveProfile(updated);
    setIsMapOpen(false);
    setCurrentTab('home');
  };

  // Theme change
  const handleChangeTheme = (theme: RegionalTheme) => {
    const updated: UserProfile = {
      ...userProfile,
      theme,
    };
    handleSaveProfile(updated);
  };

  // Navigate to Practice Screen with a specific phrase
  const handleStartPracticeWithPhrase = (phrase: {
    script: string;
    romanized: string;
    meaning: string;
  }) => {
    setPracticePhrase(phrase);
    setIsMapOpen(false);
    setCurrentTab('practice');
  };

  const themeClass =
    userProfile.theme === 'jaipur'
      ? 'theme-jaipur-bg'
      : userProfile.theme === 'kolkata'
      ? 'theme-kolkata-bg'
      : 'bg-parchment';

  return (
    <div className={`min-h-screen ${themeClass} flex flex-col text-[#2B1F19] selection:bg-[#F3E5CE] selection:text-[#8C5229] transition-colors duration-300 font-sans`}>
      {/* If Map is open, display full-screen Region-first India map experience */}
      {isMapOpen ? (
        <IndiaMapSelector
          selectedCity={(userProfile.destinationCity as 'Chennai' | 'Jaipur' | 'Kolkata') || 'Chennai'}
          onSelectCity={handleSelectCityFromMap}
          onConfirmDestination={handleConfirmDestination}
          currentTheme={userProfile.theme || 'parchment'}
          onChangeTheme={handleChangeTheme}
        />
      ) : (
        <>
          {/* Top Navigation */}
          <Navbar
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            userProfile={userProfile}
            onOpenMap={() => setIsMapOpen(true)}
            onOpenLiveTranslate={() => setIsLiveTranslateOpen(true)}
            onOpenDemoTour={() => setIsDemoTourOpen(true)}
            currentTheme={userProfile.theme || 'parchment'}
            onChangeTheme={handleChangeTheme}
          />

          {/* Main Content Viewport */}
          <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-6">
            {currentTab === 'home' && (
              <HomeScreen
                userProfile={userProfile}
                onNavigateTab={setCurrentTab}
                onSelectScenario={(id) => setActiveScenarioId(id as ScenarioCategory)}
                onStartPracticeWithPhrase={handleStartPracticeWithPhrase}
                onOpenLiveTranslate={() => setIsLiveTranslateOpen(true)}
                onOpenMap={() => setIsMapOpen(true)}
              />
            )}

            {currentTab === 'talk' && (
              <TalkScreen
                userProfile={userProfile}
                activeScenarioId={activeScenarioId}
                onSelectScenario={setActiveScenarioId}
                onNavigateToPractice={handleStartPracticeWithPhrase}
              />
            )}

            {currentTab === 'scan' && (
              <ScanScreen
                userProfile={userProfile}
                onNavigateToPractice={handleStartPracticeWithPhrase}
                onNavigateToPhrasebook={() => setCurrentTab('phrasebook')}
              />
            )}

            {currentTab === 'practice' && (
              <PracticeScreen
                userProfile={userProfile}
                initialPhrase={practicePhrase}
                onClearInitialPhrase={() => setPracticePhrase(null)}
              />
            )}

            {currentTab === 'phrasebook' && (
              <PhrasebookScreen
                userProfile={userProfile}
                onNavigateToPractice={handleStartPracticeWithPhrase}
              />
            )}

            {currentTab === 'progress' && (
              <ProgressScreen
                userProfile={userProfile}
                onStartWeakAreaPractice={() => {
                  setPracticePhrase(null);
                  setCurrentTab('practice');
                }}
                onNavigateToPhrasebook={() => setCurrentTab('phrasebook')}
              />
            )}
          </main>

          {/* Minimalist Heritage Footer */}
          <footer className="mt-auto border-t border-[#E8DDCE] py-6 bg-[#FAF6F0]/90 text-center text-xs text-[#705A4E]">
            <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="font-serif-display font-bold text-sm text-[#231A15]">Baatcheet</span>
                <span>·</span>
                <span>Speak Local. Feel at Home.</span>
              </div>
              <div className="flex items-center gap-4 text-[#8C7669]">
                <button
                  type="button"
                  onClick={() => setIsMapOpen(true)}
                  className="hover:text-[#9E321E] underline cursor-pointer"
                >
                  India Map View
                </button>
                <span>·</span>
                <span>TCS Tech Day @ Amity, Noida</span>
              </div>
            </div>
          </footer>
        </>
      )}

      {/* Modals */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        currentProfile={userProfile}
        onSaveProfile={handleSaveProfile}
      />

      <LiveTranslateModal
        isOpen={isLiveTranslateOpen}
        onClose={() => setIsLiveTranslateOpen(false)}
        userProfile={userProfile}
      />

      <DemoTourModal
        isOpen={isDemoTourOpen}
        onClose={() => setIsDemoTourOpen(false)}
        onNavigateTab={(tab) => {
          setIsMapOpen(false);
          setCurrentTab(tab);
        }}
        onSelectScenario={setActiveScenarioId}
        onOpenOnboarding={() => setIsMapOpen(true)}
      />
    </div>
  );
}
