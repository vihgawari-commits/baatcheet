import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  CheckCircle2,
  Bookmark,
  Check,
  Volume2,
  RefreshCw,
  Trophy,
} from 'lucide-react';
import { UserProfile, PronunciationEvaluation } from '../types';
import { AudioPlayerButton } from './AudioPlayerButton';
import { createSpeechRecognizer } from '../utils/audio';
import {
  getStoredPhrases,
  getStoredWeakAreas,
  recordWeakArea,
  resolveWeakArea,
  recordPracticeSession,
  addSavedPhrase,
} from '../utils/storage';

interface PracticeScreenProps {
  userProfile: UserProfile;
  initialPhrase?: { script: string; romanized: string; meaning: string } | null;
  onClearInitialPhrase?: () => void;
}

export const PracticeScreen: React.FC<PracticeScreenProps> = ({
  userProfile,
  initialPhrase,
  onClearInitialPhrase,
}) => {
  const [mode, setMode] = useState<'standard' | 'weak_areas'>('standard');
  const [phrasesList, setPhrasesList] = useState<
    Array<{ script: string; romanized: string; meaning: string; tip?: string; id?: string }>
  >([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [userSpokenText, setUserSpokenText] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<PronunciationEvaluation | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const recognizerRef = useRef<any>(null);

  useEffect(() => {
    if (initialPhrase) {
      setPhrasesList([
        {
          script: initialPhrase.script,
          romanized: initialPhrase.romanized,
          meaning: initialPhrase.meaning,
          tip: 'Focus on natural syllable rhythm.',
        },
      ]);
      setCurrentIndex(0);
      setEvaluation(null);
      setUserSpokenText('');
      return;
    }

    if (mode === 'weak_areas') {
      const weak = getStoredWeakAreas();
      if (weak.length > 0) {
        setPhrasesList(
          weak.map((w) => ({
            id: w.id,
            script: w.phrase,
            romanized: w.romanized,
            meaning: w.meaning,
            tip: w.tip,
          }))
        );
        setCurrentIndex(0);
        setEvaluation(null);
        return;
      }
    }

    const stored = getStoredPhrases();
    if (stored.length > 0) {
      setPhrasesList(
        stored.map((p) => ({
          id: p.id,
          script: p.targetScript,
          romanized: p.romanized,
          meaning: p.meaning,
          tip: p.pronunciationGuide || 'Keep it natural.',
        }))
      );
    } else {
      setPhrasesList([
        {
          script: 'ஒரு மசாலா தோசை, ஃபில்டர் காபி கொடுங்க அண்ணா',
          romanized: 'Oru masala dosai, filter coffee kudu-nga anna',
          meaning: 'Give one masala dosa and filter coffee brother',
          tip: 'Pronounce the double "ll" in coffee cleanly.',
        },
        {
          script: 'மீட்டர் போட்டு போங்க அண்ணா',
          romanized: 'Meter pottu ponga anna',
          meaning: 'Please turn on the meter and go brother',
          tip: 'Notice the respectful ending "-nga".',
        },
        {
          script: 'லைப்ரரி எங்க இருக்கு?',
          romanized: 'Library enga irukku?',
          meaning: 'Where is the library located?',
          tip: 'Keep "enga irukku" fast and connected.',
        },
      ]);
    }
    setCurrentIndex(0);
    setEvaluation(null);
  }, [mode, initialPhrase]);

  const currentPhrase = phrasesList[currentIndex] || {
    script: 'வணக்கம், எப்படி இருக்கீங்க?',
    romanized: 'Vanakkam, eppadi irukkeenga?',
    meaning: 'Hello, how are you?',
    tip: 'Standard polite greeting.',
  };

  const handleToggleRecord = () => {
    if (isRecording) {
      recognizerRef.current?.stop();
      setIsRecording(false);
      if (userSpokenText.trim()) {
        evaluateSpokenPhrase(userSpokenText.trim());
      }
    } else {
      setUserSpokenText('');
      setEvaluation(null);
      const recognizer = createSpeechRecognizer(
        userProfile.targetLanguage,
        (transcript, isFinal) => {
          setUserSpokenText(transcript);
          if (isFinal) {
            setIsRecording(false);
            evaluateSpokenPhrase(transcript);
          }
        },
        (err) => {
          console.warn('Speech recognition error:', err);
          setIsRecording(false);
        },
        () => {
          setIsRecording(false);
        }
      );
      recognizerRef.current = recognizer;
      recognizer.start();
      setIsRecording(true);
    }
  };

  const evaluateSpokenPhrase = async (spokenText: string) => {
    setIsEvaluating(true);
    try {
      const res = await fetch('/api/pronunciation/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetPhrase: currentPhrase.script,
          romanized: currentPhrase.romanized,
          userTranscript: spokenText,
          targetLanguage: userProfile.targetLanguage,
        }),
      });

      if (res.ok) {
        const payload = await res.json();
        if (payload.success && payload.data) {
          const evalData: PronunciationEvaluation = payload.data;
          setEvaluation(evalData);

          recordPracticeSession({
            scenario: 'Pronunciation Drill',
            phrasesPracticed: 1,
            averageScore: evalData.score,
          });

          if (evalData.score < 75) {
            recordWeakArea({
              phrase: currentPhrase.script,
              romanized: currentPhrase.romanized,
              meaning: currentPhrase.meaning,
              category: 'food',
              tip: evalData.practiceTip,
            });
          } else if (currentPhrase.id && mode === 'weak_areas') {
            resolveWeakArea(currentPhrase.id);
          }
        }
      }
    } catch (err) {
      console.warn('Pronunciation evaluation error:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNextPhrase = () => {
    setEvaluation(null);
    setUserSpokenText('');
    setIsSaved(false);
    if (currentIndex < phrasesList.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrevPhrase = () => {
    setEvaluation(null);
    setUserSpokenText('');
    setIsSaved(false);
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      setCurrentIndex(phrasesList.length - 1);
    }
  };

  const handleSaveToPhrasebook = () => {
    addSavedPhrase({
      sourceText: currentPhrase.meaning,
      targetScript: currentPhrase.script,
      romanized: currentPhrase.romanized,
      meaning: currentPhrase.meaning,
      category: 'food',
      difficulty: 'Beginner',
      pronunciationGuide: currentPhrase.tip,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6 pb-20 max-w-2xl mx-auto">
      {/* Page Title & Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#9E321E]">
            Voice Lab
          </div>
          <h1 className="font-serif-display text-3xl font-bold text-[#231A15] tracking-tight">
            Pronunciation Coach
          </h1>
        </div>

        {/* Segmented Mode Selector */}
        <div className="flex items-center gap-1 p-1 bg-white rounded-2xl border border-[#E8DDCE] shadow-2xs self-start sm:self-auto">
          <button
            type="button"
            onClick={() => {
              setMode('standard');
              onClearInitialPhrase?.();
            }}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              mode === 'standard'
                ? 'bg-[#9E321E] text-white shadow-2xs'
                : 'text-[#6C564B] hover:text-[#231A15]'
            }`}
          >
            All Phrases
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('weak_areas');
              onClearInitialPhrase?.();
            }}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              mode === 'weak_areas'
                ? 'bg-[#9E321E] text-white shadow-2xs'
                : 'text-[#6C564B] hover:text-[#231A15]'
            }`}
          >
            Weak Areas Drill
          </button>
        </div>
      </div>

      {/* Main Pronunciation Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DDCE] shadow-sm relative overflow-hidden space-y-6">
        {/* Subtle decorative concentric ring */}
        <div className="absolute -right-20 -bottom-20 w-52 h-52 heritage-ring pointer-events-none opacity-30" />

        {/* Top Progress & Save */}
        <div className="flex items-center justify-between text-xs text-[#7A6455] pb-3 border-b border-[#EFE3D5]">
          <span className="font-bold text-[#231A15]">
            Phrase {currentIndex + 1} of {phrasesList.length}
          </span>
          <button
            type="button"
            onClick={handleSaveToPhrasebook}
            className="p-1.5 text-[#7A6455] hover:text-[#9E321E] transition-colors cursor-pointer"
            title="Bookmark phrase"
          >
            {isSaved ? (
              <Check className="w-4 h-4 text-emerald-600 font-bold" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Central Display: Prominent Script, Romanized & Meaning */}
        <div className="text-center space-y-3 py-2">
          <div className="font-serif-display text-3xl sm:text-4xl font-bold text-[#231A15] leading-snug">
            {currentPhrase.script}
          </div>

          <div className="text-base sm:text-lg font-bold text-[#8C341F]">
            "{currentPhrase.romanized}"
          </div>

          <div className="text-xs sm:text-sm text-[#6C564B] italic">
            Meaning: {currentPhrase.meaning}
          </div>

          {currentPhrase.tip && (
            <div className="inline-block text-[11px] text-[#7A6455] bg-[#FAF5EE] px-3.5 py-1.5 rounded-full border border-[#E8DDCE] mt-2">
              💡 {currentPhrase.tip}
            </div>
          )}
        </div>

        {/* Listen Button */}
        <div className="flex justify-center">
          <AudioPlayerButton
            text={currentPhrase.script}
            language={userProfile.targetLanguage}
            size="lg"
            variant="subtle"
            label="Listen to Native Pronunciation"
          />
        </div>

        {/* Visual Speaking Stage with Animated Waveform */}
        <div className="p-6 rounded-3xl bg-[#FAF5EE] border border-[#E8DDCE] flex flex-col items-center justify-center space-y-3 text-center">
          {/* Animated sound wave bars when recording */}
          {isRecording && (
            <div className="flex items-end gap-1.5 h-6 mb-1">
              {[8, 18, 26, 14, 22, 10, 24, 16, 20].map((h, i) => (
                <div
                  key={i}
                  className="w-1 bg-[#9E321E] rounded-full animate-bounce"
                  style={{
                    height: `${h}px`,
                    animationDuration: `${0.35 + (i % 3) * 0.15}s`,
                  }}
                />
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={handleToggleRecord}
            disabled={isEvaluating}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              isRecording
                ? 'bg-red-600 text-white shadow-xl animate-pulse ring-8 ring-red-100 scale-105'
                : 'bg-[#9E321E] hover:bg-[#882816] text-white shadow-md shadow-[#9E321E]/25'
            }`}
          >
            {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
          </button>

          <div>
            <div className="font-bold text-sm text-[#231A15]">
              {isRecording ? 'Listening... Speak phrase now' : 'Tap mic and repeat the phrase'}
            </div>
            <p className="text-xs text-[#705A4E] mt-0.5">
              {isRecording ? userSpokenText || 'Say words clearly...' : 'AI gives syllable-by-syllable feedback'}
            </p>
          </div>

          {isEvaluating && (
            <div className="flex items-center gap-2 text-xs font-bold text-[#9E321E] mt-1">
              <RefreshCw className="w-4 h-4 animate-spin text-[#9E321E]" />
              <span>Evaluating pronunciation with Gemini...</span>
            </div>
          )}
        </div>

        {/* AI EVALUATION SCORECARD WITH CIRCULAR GAUGE */}
        {evaluation && (
          <div className="p-5 rounded-3xl bg-[#FAF2E6] border border-[#E0CEBA] animate-in fade-in duration-300 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DAC9]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#9E321E]" />
                <span className="font-bold text-xs text-[#8C341F] uppercase tracking-wider">
                  AI Syllable Feedback
                </span>
              </div>

              {/* Circular Gauge Badge */}
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-[#DFD0BD] shadow-2xs">
                <Trophy className="w-4 h-4 text-amber-600" />
                <span className="text-base font-extrabold text-[#9E321E]">
                  {evaluation.score}%
                </span>
              </div>
            </div>

            <div className="text-sm font-bold text-[#231A15]">
              {evaluation.verdict}
            </div>

            <p className="text-xs text-[#634E43] leading-relaxed">
              {evaluation.feedback}
            </p>

            {/* Word-by-word Syllable Breakdown */}
            {evaluation.breakdown && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {evaluation.breakdown.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-white rounded-xl border border-[#E8DDCE] text-xs flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-[#231A15]">{item.word}</span>
                      <div className="text-[10px] text-[#7A6455]">{item.tip}</div>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        item.status === 'perfect'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : item.status === 'good'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}
                    >
                      {item.status === 'perfect' ? 'Spot On' : item.status === 'good' ? 'Clear' : 'Needs Work'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Carousel Bottom Controls */}
        <div className="pt-3 border-t border-[#EFE3D5] flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrevPhrase}
            className="flex items-center gap-1 px-3 py-2 text-xs font-bold text-[#6C564B] hover:text-[#231A15] cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setEvaluation(null);
              setUserSpokenText('');
            }}
            className="flex items-center gap-1 px-3 py-2 text-xs font-bold text-[#8C341F] hover:underline cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>

          <button
            type="button"
            onClick={handleNextPhrase}
            className="flex items-center gap-1 px-4 py-2 text-xs font-bold text-white bg-[#231A15] hover:bg-[#382B24] rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <span>Next Phrase</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
