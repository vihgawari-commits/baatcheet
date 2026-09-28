import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Trash2,
  Sparkles,
  Bookmark,
  Volume2,
  BookOpen,
  ArrowRight,
  Filter,
  Check,
} from 'lucide-react';
import { UserProfile, SavedPhrase, ScenarioCategory } from '../types';
import { AudioPlayerButton } from './AudioPlayerButton';
import { getStoredPhrases, removeSavedPhrase, addSavedPhrase } from '../utils/storage';

interface PhrasebookScreenProps {
  userProfile: UserProfile;
  onNavigateToPractice: (phrase: { script: string; romanized: string; meaning: string }) => void;
}

export const PhrasebookScreen: React.FC<PhrasebookScreenProps> = ({
  userProfile,
  onNavigateToPractice,
}) => {
  const [phrases, setPhrases] = useState<SavedPhrase[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [customEnglishText, setCustomEnglishText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    setPhrases(getStoredPhrases());
  }, []);

  const handleDelete = (id: string) => {
    removeSavedPhrase(id);
    setPhrases((prev) => prev.filter((p) => p.id !== id));
  };

  const handleAddCustom = async () => {
    if (!customEnglishText.trim()) return;
    setIsTranslating(true);
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: customEnglishText.trim(),
          from: userProfile.homeLanguage,
          to: userProfile.targetLanguage,
        }),
      });

      if (res.ok) {
        const payload = await res.json();
        if (payload.success && payload.data) {
          const d = payload.data;
          const created = addSavedPhrase({
            sourceText: customEnglishText.trim(),
            targetScript: d.targetText,
            romanized: d.romanized,
            meaning: d.meaning || customEnglishText.trim(),
            category: (d.category as ScenarioCategory) || 'general',
            difficulty: 'Beginner',
            pronunciationGuide: d.pronunciationGuide || d.practiceTip,
          });
          setPhrases((prev) => [created, ...prev]);
          setCustomEnglishText('');
          setIsAddingCustom(false);
        }
      }
    } catch (err) {
      console.warn('Translate error:', err);
    } finally {
      setIsTranslating(false);
    }
  };

  const categories = [
    { id: 'all', label: 'All Phrases' },
    { id: 'food', label: 'Food & Mess' },
    { id: 'transport', label: 'Auto & Travel' },
    { id: 'college', label: 'College & Class' },
    { id: 'shopping', label: 'Market & Kirana' },
    { id: 'general', label: 'General' },
  ];

  const filteredPhrases = phrases.filter((p) => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      p.targetScript.toLowerCase().includes(q) ||
      p.romanized.toLowerCase().includes(q) ||
      p.meaning.toLowerCase().includes(q) ||
      p.sourceText.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-20">
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Personalized Phrasebook
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Your saved survival phrases for {userProfile.destinationCity} ({phrases.length} saved)
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddingCustom(!isAddingCustom)}
          className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Translate & Add Phrase</span>
        </button>
      </div>

      {/* Add Custom Phrase Input Drawer */}
      {isAddingCustom && (
        <div className="bg-white rounded-2xl p-5 border border-amber-200 shadow-xs space-y-3 animate-in fade-in duration-200">
          <div className="font-bold text-xs text-amber-900 uppercase tracking-wider">
            Translate Any English / Hindi Sentence to {userProfile.targetLanguage}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={customEnglishText}
              onChange={(e) => setCustomEnglishText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddCustom();
              }}
              placeholder="e.g. Can you pack this for takeaway?"
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-slate-900 text-xs sm:text-sm"
            />
            <button
              type="button"
              onClick={handleAddCustom}
              disabled={isTranslating || !customEnglishText.trim()}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              {isTranslating ? 'Translating...' : 'Translate & Save'}
            </button>
          </div>
        </div>
      )}

      {/* Search and Category Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search saved phrases by Tamil, phonetic, or English..."
            className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-xs sm:text-sm text-slate-900 bg-white"
          />
        </div>

        {/* Category Segmented Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === c.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Phrase Cards Grid */}
      {filteredPhrases.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 border border-slate-200 text-center space-y-2">
          <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
          <div className="font-bold text-sm text-slate-800">No phrases found</div>
          <p className="text-xs text-slate-500">
            Try adjusting your search query or save phrases during conversations and scans.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPhrases.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-slate-300 shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span className="font-semibold text-slate-700 capitalize">{p.category}</span>
                  <span>·</span>
                  <span>{p.difficulty}</span>
                  {p.lastScore !== undefined && (
                    <>
                      <span>·</span>
                      <span className="font-bold text-amber-700">Last Score: {p.lastScore}%</span>
                    </>
                  )}
                </div>

                <div className="text-lg font-bold text-slate-900 mb-1 leading-snug">
                  {p.targetScript}
                </div>

                <div className="text-sm font-semibold text-amber-800 mb-1">
                  "{p.romanized}"
                </div>

                <div className="text-xs text-slate-600 italic">
                  Meaning: {p.meaning}
                </div>

                {p.pronunciationGuide && (
                  <div className="mt-2.5 text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100">
                    💡 {p.pronunciationGuide}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AudioPlayerButton
                    text={p.targetScript}
                    language={userProfile.targetLanguage}
                    size="sm"
                    label="Listen"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      onNavigateToPractice({
                        script: p.targetScript,
                        romanized: p.romanized,
                        meaning: p.meaning,
                      })
                    }
                    className="px-2.5 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-50 border border-indigo-200 rounded-lg transition-colors cursor-pointer"
                  >
                    Practice Voice
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(p.id)}
                  title="Remove from phrasebook"
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
