import React, { useState, useRef } from 'react';
import { X, Mic, MicOff, Volume2, ArrowUpDown, RefreshCw, Sparkles, Languages } from 'lucide-react';
import { UserProfile, RegionalLanguage } from '../types';
import { AudioPlayerButton } from './AudioPlayerButton';
import { createSpeechRecognizer, speakText } from '../utils/audio';

interface LiveTranslateModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
}

export const LiveTranslateModal: React.FC<LiveTranslateModalProps> = ({
  isOpen,
  onClose,
  userProfile,
}) => {
  const [activeSpeaker, setActiveSpeaker] = useState<'student' | 'local' | null>(null);
  const [studentInput, setStudentInput] = useState('');
  const [studentTranslation, setStudentTranslation] = useState<{
    targetText: string;
    romanized: string;
    meaning: string;
  } | null>({
    targetText: 'ஒரு ஃபில்டர் காபி கொடுங்க அண்ணா',
    romanized: 'Oru filter coffee kudu-nga anna',
    meaning: 'Give one filter coffee brother',
  });

  const [localInput, setLocalInput] = useState('');
  const [localTranslation, setLocalTranslation] = useState<{
    englishText: string;
    meaning: string;
  } | null>({
    englishText: 'Ten rupees over the meter please.',
    meaning: 'Auto driver asks for 10 rupees extra over meter rate.',
  });

  const [isTranslating, setIsTranslating] = useState(false);
  const recognizerRef = useRef<any>(null);

  if (!isOpen) return null;

  // Start recording for student (speaks English/Hindi)
  const handleStudentRecord = () => {
    if (activeSpeaker === 'student') {
      recognizerRef.current?.stop();
      setActiveSpeaker(null);
      if (studentInput.trim()) translateStudentSpeech(studentInput.trim());
    } else {
      setActiveSpeaker('student');
      setStudentInput('');
      const recognizer = createSpeechRecognizer(
        'English',
        (transcript, isFinal) => {
          setStudentInput(transcript);
          if (isFinal) {
            setActiveSpeaker(null);
            translateStudentSpeech(transcript);
          }
        },
        () => setActiveSpeaker(null),
        () => setActiveSpeaker(null)
      );
      recognizerRef.current = recognizer;
      recognizer.start();
    }
  };

  // Start recording for local speaker (speaks Tamil)
  const handleLocalRecord = () => {
    if (activeSpeaker === 'local') {
      recognizerRef.current?.stop();
      setActiveSpeaker(null);
      if (localInput.trim()) translateLocalSpeech(localInput.trim());
    } else {
      setActiveSpeaker('local');
      setLocalInput('');
      const recognizer = createSpeechRecognizer(
        userProfile.targetLanguage,
        (transcript, isFinal) => {
          setLocalInput(transcript);
          if (isFinal) {
            setActiveSpeaker(null);
            translateLocalSpeech(transcript);
          }
        },
        () => setActiveSpeaker(null),
        () => setActiveSpeaker(null)
      );
      recognizerRef.current = recognizer;
      recognizer.start();
    }
  };

  const translateStudentSpeech = async (text: string) => {
    setIsTranslating(true);
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          from: userProfile.homeLanguage,
          to: userProfile.targetLanguage,
        }),
      });
      if (res.ok) {
        const payload = await res.json();
        if (payload.success && payload.data) {
          const d = payload.data;
          setStudentTranslation({
            targetText: d.targetText,
            romanized: d.romanized,
            meaning: d.meaning,
          });
          // Auto speak in target language
          speakText(d.targetText, userProfile.targetLanguage);
        }
      }
    } catch (e) {
      console.warn('Live translate student failed:', e);
    } finally {
      setIsTranslating(false);
    }
  };

  const translateLocalSpeech = async (text: string) => {
    setIsTranslating(true);
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          from: userProfile.targetLanguage,
          to: userProfile.homeLanguage,
        }),
      });
      if (res.ok) {
        const payload = await res.json();
        if (payload.success && payload.data) {
          const d = payload.data;
          setLocalTranslation({
            englishText: d.meaning || d.targetText,
            meaning: d.romanized || text,
          });
          speakText(d.meaning || d.targetText, 'English');
        }
      }
    } catch (e) {
      console.warn('Live translate local failed:', e);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-900 font-bold">
              <Languages className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold flex items-center gap-2">
                <span>Live 2-Way Walkie-Talkie</span>
                <span className="text-[10px] font-semibold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded">
                  REAL-TIME
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                You speak {userProfile.homeLanguage} ↔ Local speaks {userProfile.targetLanguage}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Split: Student (Top) & Local (Bottom) */}
        <div className="p-6 space-y-6">
          {/* STUDENT PANEL */}
          <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                  You ({userProfile.name} - Speaks {userProfile.homeLanguage})
                </span>
              </div>
              <button
                type="button"
                onClick={handleStudentRecord}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeSpeaker === 'student'
                    ? 'bg-red-600 text-white animate-pulse ring-4 ring-red-100'
                    : 'bg-amber-600 hover:bg-amber-700 text-white'
                }`}
              >
                {activeSpeaker === 'student' ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                <span>{activeSpeaker === 'student' ? 'Listening...' : 'Tap & Speak'}</span>
              </button>
            </div>

            <div className="min-h-[50px] bg-white p-3 rounded-xl border border-amber-100 text-xs text-slate-800">
              {activeSpeaker === 'student'
                ? studentInput || 'Listening to your speech...'
                : studentInput || 'e.g. "Please give one masala dosa and coffee"'}
            </div>

            {studentTranslation && (
              <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between">
                <div>
                  <div className="text-base font-bold text-slate-900">
                    {studentTranslation.targetText}
                  </div>
                  <div className="text-xs font-semibold text-amber-800">
                    "{studentTranslation.romanized}"
                  </div>
                </div>
                <AudioPlayerButton
                  text={studentTranslation.targetText}
                  language={userProfile.targetLanguage}
                  size="sm"
                  label="Play to Local"
                />
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="flex items-center justify-center">
            <div className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[11px] font-bold border border-slate-200 flex items-center gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-amber-600" />
              <span>Two-Way Instant Translation</span>
            </div>
          </div>

          {/* LOCAL SPEAKER PANEL */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Local Resident / Vendor (Speaks {userProfile.targetLanguage})
                </span>
              </div>
              <button
                type="button"
                onClick={handleLocalRecord}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeSpeaker === 'local'
                    ? 'bg-red-600 text-white animate-pulse ring-4 ring-red-100'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                {activeSpeaker === 'local' ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                <span>{activeSpeaker === 'local' ? 'Listening...' : 'Local Speaks'}</span>
              </button>
            </div>

            <div className="min-h-[50px] bg-white p-3 rounded-xl border border-slate-200 text-xs text-slate-800">
              {activeSpeaker === 'local'
                ? localInput || 'Listening to local speaker...'
                : localInput || 'Local speech will be captured in Tamil script and translated.'}
            </div>

            {localTranslation && (
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-slate-900">
                    "{localTranslation.englishText}"
                  </div>
                  <div className="text-xs text-slate-500 italic">
                    {localTranslation.meaning}
                  </div>
                </div>
                <AudioPlayerButton
                  text={localTranslation.englishText}
                  language="English"
                  size="sm"
                  label="Play in English"
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Hands-free walkie-talkie mode for market & transport</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
