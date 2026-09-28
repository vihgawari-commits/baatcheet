import React, { useState } from 'react';
import { X, Check, MapPin, Compass, Sparkles, BookOpen, GraduationCap } from 'lucide-react';
import { UserProfile, RegionalLanguage } from '../types';
import { REGIONAL_PRESETS } from '../data/mockData';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
}

const DESTINATION_CITIES = [
  { city: 'Chennai', state: 'Tamil Nadu', lang: 'Tamil' as RegionalLanguage, tag: 'Most Popular for Demo' },
  { city: 'Jaipur', state: 'Rajasthan', lang: 'Hindi' as RegionalLanguage, tag: 'Pink City & Heritage' },
  { city: 'Kolkata', state: 'West Bengal', lang: 'Bengali' as RegionalLanguage, tag: 'Cultural & Academic' },
];

const HOME_LANGUAGES = ['Hindi', 'English', 'Punjabi', 'Gujarati', 'Marathi', 'Bengali', 'Malayalam', 'Odia'];

const LIVING_SITUATIONS: Array<UserProfile['livingSituation']> = [
  'Hostel',
  'PG / Flat',
  'College Campus',
  'Day Scholar',
];

const SITUATION_NEEDS = [
  { id: 'Food & Mess', label: 'Canteen & Mess', desc: 'Ordering tiffins, asking for less spice, water' },
  { id: 'Auto & Travel', label: 'Auto & Buses', desc: 'Prepaid meters, bus route numbers, campus gates' },
  { id: 'College Campus', label: 'College & Seniors', desc: 'Classrooms, library, lab manuals, batchmates' },
  { id: 'Hostel & Landlord', label: 'Hostel & Warden', desc: 'Gate curfew timings, water issues, room keys' },
  { id: 'Shopping & Kirana', label: 'Kirana & Market', desc: 'Stationery, UPI payment, daily groceries' },
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onSaveProfile,
}) => {
  const [name, setName] = useState(currentProfile.name || 'Student');
  const [homeLang, setHomeLang] = useState(currentProfile.homeLanguage || 'Hindi');
  const [destination, setDestination] = useState(currentProfile.destinationCity || 'Chennai');
  const [targetLang, setTargetLang] = useState<RegionalLanguage>(currentProfile.targetLanguage || 'Tamil');
  const [living, setLiving] = useState<UserProfile['livingSituation']>(currentProfile.livingSituation || 'Hostel');
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>(
    currentProfile.interests?.length ? currentProfile.interests : ['Food & Mess', 'Auto & Travel', 'College Campus']
  );
  const [proficiency, setProficiency] = useState<UserProfile['proficiency']>(
    currentProfile.proficiency || 'Complete Beginner'
  );

  if (!isOpen) return null;

  const handleCitySelect = (cityName: string, lang: RegionalLanguage) => {
    setDestination(cityName);
    setTargetLang(lang);
  };

  const toggleNeed = (needId: string) => {
    if (selectedNeeds.includes(needId)) {
      if (selectedNeeds.length > 1) {
        setSelectedNeeds(selectedNeeds.filter(n => n !== needId));
      }
    } else {
      setSelectedNeeds([...selectedNeeds, needId]);
    }
  };

  const handleSave = () => {
    const updated: UserProfile = {
      name: name.trim() || 'Student',
      homeLanguage: homeLang,
      destinationCity: destination,
      targetLanguage: targetLang,
      livingSituation: living,
      interests: selectedNeeds,
      proficiency,
      completedOnboarding: true,
    };
    onSaveProfile(updated);
    onClose();
  };

  const activePreset = REGIONAL_PRESETS[destination as 'Chennai' | 'Jaipur' | 'Kolkata'] || REGIONAL_PRESETS.Chennai;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200/90 overflow-hidden my-6">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 px-6 py-6 text-white relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg bg-black/10 hover:bg-black/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1.5 text-amber-200 text-xs font-semibold tracking-wider uppercase">
            <Sparkles className="w-4 h-4" />
            <span>Personalized Student Setup</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome to Baatcheet</h2>
          <p className="text-amber-100 text-sm mt-1 max-w-lg">
            Tell us where you are moving for college so we can build your practical survival phrase pack.
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Student Name & Home Language */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Your Name / Nickname
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Aarav"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-slate-900 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Home / Base Language
              </label>
              <select
                value={homeLang}
                onChange={(e) => setHomeLang(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-slate-900 text-sm bg-white"
              >
                {HOME_LANGUAGES.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Destination Region Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Destination College City & Target Language
              </label>
              <span className="text-xs text-amber-700 font-semibold">
                Selected: {destination} ({targetLang})
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {DESTINATION_CITIES.map((c) => {
                const isSelected = destination === c.city;
                return (
                  <button
                    key={c.city}
                    type="button"
                    onClick={() => handleCitySelect(c.city, c.lang)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-amber-600 bg-amber-50/80 shadow-xs ring-1 ring-amber-600'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-slate-900">{c.city}</span>
                      {isSelected ? (
                        <Check className="w-4 h-4 text-amber-600 font-bold" />
                      ) : (
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </div>
                    <div className="text-xs font-semibold text-amber-800">{c.lang}</div>
                    <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">{c.tag}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Living Arrangement */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Where will you be staying?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {LIVING_SITUATIONS.map((sit) => {
                const isSelected = living === sit;
                return (
                  <button
                    key={sit}
                    type="button"
                    onClick={() => setLiving(sit)}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold transition-colors cursor-pointer text-center ${
                      isSelected
                        ? 'border-amber-600 bg-amber-600 text-white'
                        : 'border-slate-200 text-slate-700 bg-white hover:bg-slate-50'
                    }`}
                  >
                    {sit}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Everyday Situations Expected */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Everyday Situations to Prioritize
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SITUATION_NEEDS.map((n) => {
                const isChecked = selectedNeeds.includes(n.id);
                return (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => toggleNeed(n.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all flex items-start gap-2.5 cursor-pointer ${
                      isChecked
                        ? 'border-amber-600/70 bg-amber-50/60'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center border text-white transition-colors ${
                        isChecked ? 'bg-amber-600 border-amber-600' : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{n.label}</div>
                      <div className="text-[11px] text-slate-500">{n.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Generated Starter Pack Summary Box */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-slate-900 mb-0.5">
                Ready: {activePreset.starterPackTitle}
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                We will prepare local phrases for {activePreset.city} ({activePreset.language}) covering {selectedNeeds.join(', ')}. Local greeting: <span className="font-bold text-amber-800">"{activePreset.localGreeting}" ({activePreset.greetingScript})</span>.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Learn what you need, when you need it.
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Start Learning Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
