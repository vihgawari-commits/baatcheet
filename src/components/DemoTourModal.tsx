import React, { useState } from 'react';
import { X, CheckCircle, ArrowRight, Sparkles, Presentation, Play } from 'lucide-react';
import { ScenarioCategory } from '../types';

interface DemoTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: 'home' | 'talk' | 'scan' | 'practice' | 'phrasebook' | 'progress') => void;
  onSelectScenario: (id: ScenarioCategory) => void;
  onOpenOnboarding: () => void;
}

export const DemoTourModal: React.FC<DemoTourModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onSelectScenario,
  onOpenOnboarding,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      title: '1. The Problem Hook',
      scriptLine: '“A student from Delhi has just moved to Chennai for college and knows zero Tamil.”',
      actionLabel: 'Verify Chennai & Tamil Setup',
      action: () => {
        onOpenOnboarding();
      },
      tip: 'Show the onboarding city selection (Chennai, Tamil, Food & Mess, Auto & Travel).',
    },
    {
      title: '2. Real-World AI Voice Roleplay',
      scriptLine: '“Instead of robotic flashcards, let’s simulate ordering lunch at the hostel canteen.”',
      actionLabel: 'Open Canteen Roleplay with Murugan Anna',
      action: () => {
        onSelectScenario('food');
        onNavigateTab('talk');
        onClose();
      },
      tip: 'Point out the colloquial greeting, Romanized pronunciation, and audio replay.',
    },
    {
      title: '3. "Help Me!" & Pronunciation Loop',
      scriptLine: '“If the student freezes, one tap gives them the exact survival phrase: Oru masala dosa kudu-nga anna.”',
      actionLabel: 'Try Help Button in Talk Mode',
      action: () => {
        onSelectScenario('food');
        onNavigateTab('talk');
        onClose();
      },
      tip: 'Tap "Help me! What do I say?" and speak the phrase to see AI phonetic feedback.',
    },
    {
      title: '4. Visual Menu & Signboard Scanner',
      scriptLine: '“Now the student looks up at the canteen board and can’t read the Tamil script.”',
      actionLabel: 'Open Scanner on Chennai Tiffin Menu',
      action: () => {
        onNavigateTab('scan');
        onClose();
      },
      tip: 'Show the AI dish explainer (Ney Podi Roast, Filter Kaapi) and instant ordering phrases.',
    },
    {
      title: '5. Adaptive Progress & Weak Areas',
      scriptLine: '“Notice how Baatcheet remembers what you struggled with and generates a 3-minute drill.”',
      actionLabel: 'Open Progress & Weak Areas Drill',
      action: () => {
        onNavigateTab('progress');
        onClose();
      },
      tip: 'Show the weak areas list with targeted coaching tips.',
    },
    {
      title: '6. The Grand Pitch Finale',
      scriptLine: '“Baatcheet doesn’t just translate a language. It teaches students how to actually use it in the situations they face every day.”',
      actionLabel: 'Return to Home Screen',
      action: () => {
        onNavigateTab('home');
        onClose();
      },
      tip: 'End with the high-impact one-liner from the TCS Tech Day brief.',
    },
  ];

  const activeStep = steps[currentStep];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Presentation className="w-5 h-5 text-amber-200" />
            <div>
              <h2 className="font-extrabold text-base tracking-tight">
                TCS Tech Day @ Amity Demo Script
              </h2>
              <p className="text-xs text-amber-100">
                Official 2–3 Minute Presentation Flow (Section 15 of Brief)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg bg-black/10 hover:bg-black/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Step Indicator */}
          <div className="flex items-center justify-between text-xs text-slate-500 pb-3 border-b border-slate-100">
            <span className="font-bold text-amber-800">
              Step {currentStep + 1} of {steps.length}
            </span>
            <div className="flex gap-1.5">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    i === currentStep
                      ? 'bg-amber-600 ring-2 ring-amber-200'
                      : i < currentStep
                      ? 'bg-emerald-500'
                      : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              {activeStep.title}
            </div>
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-sm font-bold text-amber-950 italic leading-relaxed">
              {activeStep.scriptLine}
            </div>
          </div>

          <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-start gap-2">
            <span className="font-bold text-slate-900">Presenter Tip: </span>
            <span>{activeStep.tip}</span>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={activeStep.action}
              className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{activeStep.actionLabel}</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            disabled={currentStep === 0}
            onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
          >
            ← Previous Step
          </button>

          {currentStep < steps.length - 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => prev + 1)}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Next Demo Step →
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Finish Demo
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
