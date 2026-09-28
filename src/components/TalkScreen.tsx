import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Send,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Bookmark,
  Check,
  Volume2,
  AlertCircle,
  Lightbulb,
  Utensils,
  Car,
  GraduationCap,
  Building,
  ShoppingBag,
  Users,
  AlertTriangle,
  Radio,
} from 'lucide-react';
import { UserProfile, Scenario, ConversationMessage, ScenarioCategory } from '../types';
import { SCENARIOS } from '../data/mockData';
import { AudioPlayerButton } from './AudioPlayerButton';
import { createSpeechRecognizer, speakText } from '../utils/audio';
import { addSavedPhrase, recordWeakArea } from '../utils/storage';

interface TalkScreenProps {
  userProfile: UserProfile;
  activeScenarioId: ScenarioCategory;
  onSelectScenario: (id: ScenarioCategory) => void;
  onNavigateToPractice: (phrase: { script: string; romanized: string; meaning: string }) => void;
}

const SCENARIO_ICONS: Record<ScenarioCategory, React.ComponentType<{ className?: string }>> = {
  food: Utensils,
  transport: Car,
  college: GraduationCap,
  landlord: Building,
  shopping: ShoppingBag,
  introductions: Users,
  emergency: AlertTriangle,
};

// Scenario realistic visual portraits
const SCENARIO_IMAGES: Record<ScenarioCategory, string> = {
  food: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=300&q=80',
  transport: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=300&q=80',
  college: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=300&q=80',
  landlord: 'https://images.unsplash.com/photo-1584697964190-7bb8c5a03429?auto=format&fit=crop&w=300&q=80',
  shopping: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=300&q=80',
  introductions: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=300&q=80',
  emergency: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=300&q=80',
};

export const TalkScreen: React.FC<TalkScreenProps> = ({
  userProfile,
  activeScenarioId,
  onSelectScenario,
  onNavigateToPractice,
}) => {
  const currentScenario = SCENARIOS.find((s) => s.id === activeScenarioId) || SCENARIOS[0];

  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [isLoadingReply, setIsLoadingReply] = useState(false);
  const [activeHelpPhrase, setActiveHelpPhrase] = useState<{
    script: string;
    romanized: string;
    meaning: string;
    pronunciationGuide: string;
  } | null>(null);
  const [savedSuccessId, setSavedSuccessId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const speechRecognizerRef = useRef<any>(null);

  // Initialize or reset scenario conversation
  useEffect(() => {
    const initMessage: ConversationMessage = {
      id: `init-${Date.now()}`,
      role: 'model',
      senderName: currentScenario.personaName,
      script: currentScenario.initialPersonaMessage.script,
      romanized: currentScenario.initialPersonaMessage.romanized,
      meaning: currentScenario.initialPersonaMessage.meaning,
      contextTip: currentScenario.initialPersonaMessage.contextTip,
      suggestedResponses: [
        {
          script: 'ஒரு மசாலா தோசை, ஒரு ஃபில்டர் காபி கொடுங்க அண்ணா',
          romanized: 'Oru masala dosa, oru filter coffee kudu-nga anna',
          meaning: 'Please give one masala dosa and one filter coffee brother',
          tip: 'Polite and clear.',
        },
        {
          script: 'கொஞ்சம் காரம் கம்மியா போடுங்க',
          romanized: 'Konjam kaaram kammiya podunga',
          meaning: 'Please make it a little less spicy',
          tip: 'Useful survival phrase.',
        },
      ],
      timestamp: Date.now(),
    };
    setMessages([initMessage]);
    setActiveHelpPhrase(null);
  }, [activeScenarioId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoadingReply, activeHelpPhrase]);

  const toggleRecording = () => {
    if (isRecording) {
      speechRecognizerRef.current?.stop();
      setIsRecording(false);
      if (liveTranscript.trim()) {
        handleSendMessage(liveTranscript.trim());
        setLiveTranscript('');
      }
    } else {
      setLiveTranscript('');
      const recognizer = createSpeechRecognizer(
        userProfile.targetLanguage,
        (transcript, isFinal) => {
          setLiveTranscript(transcript);
          if (isFinal) {
            setIsRecording(false);
            handleSendMessage(transcript);
            setLiveTranscript('');
          }
        },
        (error) => {
          console.warn('Speech recognition error:', error);
          setIsRecording(false);
        },
        () => {
          setIsRecording(false);
        }
      );
      speechRecognizerRef.current = recognizer;
      recognizer.start();
      setIsRecording(true);
    }
  };

  const handleSendMessage = async (text: string, isHelpReq = false) => {
    if (!text.trim() && !isHelpReq) return;

    const userMsg: ConversationMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      senderName: userProfile.name,
      script: text,
      romanized: text,
      meaning: text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoadingReply(true);

    try {
      const res = await fetch('/api/chat/scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioId: currentScenario.id,
          scenarioTitle: currentScenario.title,
          city: userProfile.destinationCity,
          targetLanguage: userProfile.targetLanguage,
          baseLanguage: userProfile.homeLanguage,
          messages: messages.map((m) => ({ role: m.role, text: m.script })),
          userQuery: text,
          isHelpRequest: isHelpReq,
        }),
      });

      if (res.ok) {
        const payload = await res.json();
        if (payload.success && payload.data) {
          const d = payload.data;
          const botMsg: ConversationMessage = {
            id: `model-${Date.now()}`,
            role: 'model',
            senderName: d.personaName || currentScenario.personaName,
            script: d.personaReply,
            romanized: d.romanized,
            meaning: d.meaning,
            contextTip: d.contextTip,
            correctionNote: d.correctionNote,
            suggestedResponses: d.suggestedResponses,
            helpPhrase: d.helpPhrase,
            timestamp: Date.now(),
          };

          setMessages((prev) => [...prev, botMsg]);

          if (d.helpPhrase) {
            setActiveHelpPhrase(d.helpPhrase);
          }

          if (d.correctionNote && text) {
            recordWeakArea({
              phrase: text,
              romanized: text,
              meaning: 'Spoken during roleplay',
              category: currentScenario.id,
              tip: d.correctionNote,
            });
          }
        }
      }
    } catch (err) {
      console.error('Failed to get persona response:', err);
    } finally {
      setIsLoadingReply(false);
    }
  };

  const handleRequestHelp = async () => {
    setIsLoadingReply(true);
    try {
      const res = await fetch('/api/chat/scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioId: currentScenario.id,
          scenarioTitle: currentScenario.title,
          city: userProfile.destinationCity,
          targetLanguage: userProfile.targetLanguage,
          baseLanguage: userProfile.homeLanguage,
          messages: messages.map((m) => ({ role: m.role, text: m.script })),
          userQuery: '',
          isHelpRequest: true,
        }),
      });

      if (res.ok) {
        const payload = await res.json();
        if (payload.success && payload.data) {
          const d = payload.data;
          if (d.helpPhrase) {
            setActiveHelpPhrase(d.helpPhrase);
          } else if (d.suggestedResponses?.[0]) {
            const first = d.suggestedResponses[0];
            setActiveHelpPhrase({
              script: first.script,
              romanized: first.romanized,
              meaning: first.meaning,
              pronunciationGuide: first.tip || 'Speak clearly and softly.',
            });
          }
        }
      }
    } catch (e) {
      setActiveHelpPhrase({
        script: 'ஒரு தோசை கொடுங்க அண்ணா',
        romanized: 'Oru dosai kudu-nga anna',
        meaning: 'Give one dosa brother please',
        pronunciationGuide: 'Oh-roo doh-say koo-doo-nga un-nah',
      });
    } finally {
      setIsLoadingReply(false);
    }
  };

  const handleSavePhrase = (msg: ConversationMessage) => {
    addSavedPhrase({
      sourceText: msg.meaning,
      targetScript: msg.script,
      romanized: msg.romanized,
      meaning: msg.meaning,
      category: currentScenario.id,
      difficulty: 'Beginner',
      pronunciationGuide: msg.contextTip,
    });
    setSavedSuccessId(msg.id);
    setTimeout(() => setSavedSuccessId(null), 2000);
  };

  return (
    <div className="space-y-5 pb-20 max-w-4xl mx-auto">
      {/* Visual Scenario Selector Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {SCENARIOS.map((sc) => {
          const Icon = SCENARIO_ICONS[sc.id] || Utensils;
          const isActive = sc.id === activeScenarioId;
          return (
            <button
              key={sc.id}
              type="button"
              onClick={() => onSelectScenario(sc.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#9E321E] text-white shadow-sm ring-2 ring-[#9E321E]/20'
                  : 'bg-white text-[#5E483E] hover:bg-[#FAF4ED] border border-[#E8DDCE]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#8A5A4A]'}`} />
              <span>{sc.title.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Visual Persona Stage Card */}
      <div className="relative rounded-3xl overflow-hidden bg-white border border-[#E8DDCE] shadow-xs p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Persona Avatar */}
          <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-xs shrink-0 border border-[#E8DDCE]">
            <img
              src={SCENARIO_IMAGES[currentScenario.id]}
              alt={currentScenario.personaName}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif-display text-xl font-bold text-[#231A15]">
                {currentScenario.personaName}
              </h2>
              <span className="text-xs text-[#9E321E] font-bold">
                · {currentScenario.personaRole}
              </span>
            </div>
            <p className="text-xs text-[#705A4E] mt-0.5">
              {currentScenario.locationContext} · {userProfile.destinationCity}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={handleRequestHelp}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#8C341F] bg-[#FAF1E6] hover:bg-[#F5E4D1] rounded-xl border border-[#E2CEBC] transition-colors cursor-pointer"
          >
            <Lightbulb className="w-4 h-4 text-[#9E321E]" />
            <span>Help me! What do I say?</span>
          </button>
          <button
            type="button"
            onClick={() => onSelectScenario(currentScenario.id)}
            title="Restart Scenario"
            className="p-2 text-[#7F685B] hover:text-[#231A15] hover:bg-[#FAF4ED] rounded-xl transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* "Help Me" Phrase Drawer (If Triggered) */}
      {activeHelpPhrase && (
        <div className="bg-[#FAF2E6] rounded-3xl p-5 border border-[#E0CEBA] shadow-xs space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[11px] font-extrabold text-[#8C341F] uppercase tracking-wider">
              <Lightbulb className="w-4 h-4 text-[#9E321E]" />
              <span>Recommended Practical Phrase</span>
            </div>
            <button
              type="button"
              onClick={() => setActiveHelpPhrase(null)}
              className="text-xs font-bold text-[#8C341F] hover:underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>

          <div className="text-xl font-bold text-[#231A15]">
            {activeHelpPhrase.script}
          </div>
          <div className="text-sm font-semibold text-[#8C341F]">
            "{activeHelpPhrase.romanized}" · <span className="text-xs text-[#634E43] italic">{activeHelpPhrase.meaning}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <AudioPlayerButton
              text={activeHelpPhrase.script}
              language={userProfile.targetLanguage}
              size="sm"
              label="Hear Pronunciation"
            />
            <button
              type="button"
              onClick={() => {
                handleSendMessage(activeHelpPhrase.romanized);
                setActiveHelpPhrase(null);
              }}
              className="px-3.5 py-1.5 bg-[#9E321E] hover:bg-[#882816] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Say This Now →
            </button>
            <button
              type="button"
              onClick={() =>
                onNavigateToPractice({
                  script: activeHelpPhrase.script,
                  romanized: activeHelpPhrase.romanized,
                  meaning: activeHelpPhrase.meaning,
                })
              }
              className="px-3.5 py-1.5 text-xs font-bold text-[#6E4F3E] hover:bg-white/80 rounded-xl transition-colors cursor-pointer border border-[#D9C4B0]"
            >
              Practice in Coach
            </button>
          </div>
        </div>
      )}

      {/* Main Conversation Stream (Clean, Spacious) */}
      <div className="bg-[#FAF5EE]/70 rounded-3xl border border-[#E8DDCE] p-5 sm:p-7 min-h-[360px] max-h-[480px] overflow-y-auto space-y-5">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-xl ${
                isUser ? 'ml-auto' : 'mr-auto'
              }`}
            >
              <div className="text-[10px] font-bold text-[#8C7669] mb-1 px-1 uppercase tracking-wider">
                {msg.senderName}
              </div>

              <div
                className={`rounded-3xl p-5 shadow-xs transition-all ${
                  isUser
                    ? 'bg-[#9E321E] text-white rounded-tr-xs'
                    : 'bg-white text-[#231A15] border border-[#E8DDCE] rounded-tl-xs'
                }`}
              >
                {/* Local Target Script in Prominent Typography */}
                <div
                  className={`text-lg sm:text-xl font-bold leading-snug mb-1 ${
                    isUser ? 'text-white' : 'text-[#231A15]'
                  }`}
                >
                  {msg.script}
                </div>

                {/* Romanized Phonetics */}
                {msg.romanized && msg.romanized !== msg.script && (
                  <div
                    className={`text-xs sm:text-sm font-semibold mb-1 ${
                      isUser ? 'text-amber-200' : 'text-[#8C341F]'
                    }`}
                  >
                    "{msg.romanized}"
                  </div>
                )}

                {/* English Meaning */}
                {msg.meaning && msg.meaning !== msg.script && (
                  <div
                    className={`text-xs italic leading-relaxed ${
                      isUser ? 'text-amber-100/90' : 'text-[#6C564B]'
                    }`}
                  >
                    {msg.meaning}
                  </div>
                )}

                {/* Actions & Audio inside Bubble */}
                <div
                  className={`mt-3 pt-2.5 flex items-center justify-between border-t ${
                    isUser ? 'border-white/20' : 'border-[#F2E7D8]'
                  }`}
                >
                  <AudioPlayerButton
                    text={msg.script}
                    language={userProfile.targetLanguage}
                    size="sm"
                    variant={isUser ? 'primary' : 'subtle'}
                  />

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        onNavigateToPractice({
                          script: msg.script,
                          romanized: msg.romanized || msg.script,
                          meaning: msg.meaning || msg.script,
                        })
                      }
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                        isUser
                          ? 'text-white hover:bg-white/20'
                          : 'text-[#6E4F3E] hover:bg-[#FAF4ED]'
                      }`}
                    >
                      Practice Voice
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSavePhrase(msg)}
                      className={`p-1 rounded-lg transition-colors cursor-pointer ${
                        isUser ? 'text-white hover:bg-white/20' : 'text-[#8C7669] hover:text-[#9E321E]'
                      }`}
                      title="Save"
                    >
                      {savedSuccessId === msg.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500 font-bold" />
                      ) : (
                        <Bookmark className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {isLoadingReply && (
          <div className="flex items-center gap-2 text-xs font-bold text-[#9E321E] bg-[#FAF2E6] px-4 py-3 rounded-2xl border border-[#EADBCE] w-fit">
            <span className="w-2 h-2 rounded-full bg-[#9E321E] animate-ping" />
            <span>{currentScenario.personaName} is speaking...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Response Chips */}
      {messages.length > 0 && messages[messages.length - 1].suggestedResponses && (
        <div className="space-y-1.5">
          <div className="text-[10px] font-extrabold text-[#8C7669] uppercase tracking-wider">
            Tap to Say:
          </div>
          <div className="flex flex-wrap gap-2">
            {messages[messages.length - 1].suggestedResponses?.map((sug, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(sug.romanized)}
                className="text-left px-3.5 py-2 bg-white hover:bg-[#FAF2E6] border border-[#E8DDCE] hover:border-[#9E321E] rounded-xl text-xs transition-colors cursor-pointer shadow-2xs group"
              >
                <div className="font-bold text-[#231A15] group-hover:text-[#9E321E]">
                  {sug.script}
                </div>
                <div className="text-[11px] text-[#8C341F]">"{sug.romanized}"</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Microphone Control Stage */}
      <div className="bg-white rounded-3xl p-4 border border-[#E8DDCE] shadow-sm space-y-3">
        {/* Animated Sound Wave Visualizer when Recording */}
        {isRecording && (
          <div className="py-2 px-4 bg-[#FAF2E6] border border-[#EADBCE] rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
              <span className="text-xs font-bold text-red-700">
                Listening to your voice... Speak clearly
              </span>
            </div>
            {/* Visual audio wave bars */}
            <div className="flex items-end gap-1 h-5">
              {[8, 16, 22, 14, 18, 10, 20, 12, 16].map((h, i) => (
                <div
                  key={i}
                  className="w-1 bg-[#9E321E] rounded-full animate-bounce"
                  style={{
                    height: `${h}px`,
                    animationDuration: `${0.4 + (i % 3) * 0.2}s`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          {/* Big Tactile Microphone Button with Pulse */}
          <button
            type="button"
            onClick={toggleRecording}
            className={`w-13 h-13 rounded-2xl flex items-center justify-center transition-all cursor-pointer shrink-0 ${
              isRecording
                ? 'bg-red-600 text-white shadow-lg animate-pulse ring-4 ring-red-200'
                : 'bg-[#9E321E] hover:bg-[#882816] text-white shadow-md shadow-[#9E321E]/20'
            }`}
            title={isRecording ? 'Stop recording & send' : 'Speak with microphone'}
          >
            {isRecording ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage(inputText);
            }}
            placeholder="Tap mic to speak, or type here..."
            className="flex-1 px-4 py-3 text-xs sm:text-sm rounded-2xl border border-[#DFD0BD] focus:outline-none focus:ring-2 focus:ring-[#9E321E]/30 text-[#231A15] bg-[#FAF5EE]"
          />

          {/* Send */}
          <button
            type="button"
            onClick={() => handleSendMessage(inputText)}
            disabled={!inputText.trim()}
            className="w-11 h-11 rounded-2xl bg-[#231A15] hover:bg-[#3B2C24] disabled:opacity-30 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
