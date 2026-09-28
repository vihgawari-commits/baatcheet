import React, { useState, useRef } from 'react';
import {
  Camera,
  Upload,
  Sparkles,
  Bookmark,
  Check,
  Volume2,
  Video,
  X,
  RefreshCw,
  Eye,
  ArrowRight,
  Flame,
} from 'lucide-react';
import { UserProfile, ScanResult } from '../types';
import { SAMPLE_SCAN_PRESETS, SampleScanPreset } from '../data/mockData';
import { AudioPlayerButton } from './AudioPlayerButton';
import { addSavedPhrase } from '../utils/storage';

interface ScanScreenProps {
  userProfile: UserProfile;
  onNavigateToPractice: (phrase: { script: string; romanized: string; meaning: string }) => void;
  onNavigateToPhrasebook: () => void;
}

// Visual food imagery for menu dishes
const DISH_IMAGES: Record<string, string> = {
  'Ghee Gunpowder Dosa': 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=400&q=80',
  'Steamed Rice Cakes in Sambar': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=400&q=80',
  'Crispy Black Lentil Fritter': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80',
  'Hot Madras Filter Coffee': 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80',
  'Ghee Masala Dosa': 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=400&q=80',
  'Idli Vada Set': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=400&q=80',
};

export const ScanScreen: React.FC<ScanScreenProps> = ({
  userProfile,
  onNavigateToPractice,
  onNavigateToPhrasebook,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<SampleScanPreset | null>(SAMPLE_SCAN_PRESETS[0]);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ScanResult | null>(SAMPLE_SCAN_PRESETS[0]);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [savedSuccessMap, setSavedSuccessMap] = useState<Record<string, boolean>>({});
  const [highlightedItemIndex, setHighlightedItemIndex] = useState<number | null>(0);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const analyzeImage = async (base64Data: string) => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/scan/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64Data,
          targetLanguage: userProfile.targetLanguage,
          city: userProfile.destinationCity,
        }),
      });

      if (res.ok) {
        const payload = await res.json();
        if (payload.success && payload.data) {
          setAnalysisResult(payload.data);
          return;
        }
      }
    } catch (e) {
      console.warn('Scan analysis failed, using preset fallback:', e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectPreset = (preset: SampleScanPreset) => {
    stopCamera();
    setSelectedPreset(preset);
    setCustomImage(null);
    setAnalysisResult(preset);
    setHighlightedItemIndex(0);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    stopCamera();
    const reader = new FileReader();
    reader.onload = async () => {
      const resultStr = reader.result as string;
      setCustomImage(resultStr);
      setSelectedPreset(null);
      await analyzeImage(resultStr);
    };
    reader.readAsDataURL(file);
  };

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError('Camera access unavailable. You can use preset samples or upload a photo.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const captureSnapshot = async () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg');
    setCustomImage(dataUrl);
    setSelectedPreset(null);
    stopCamera();
    await analyzeImage(dataUrl);
  };

  const handleSavePhrase = (p: { localText: string; romanized: string; meaning: string }, index: number) => {
    addSavedPhrase({
      sourceText: p.meaning,
      targetScript: p.localText,
      romanized: p.romanized,
      meaning: p.meaning,
      category: 'food',
      difficulty: 'Beginner',
      pronunciationGuide: p.meaning,
    });
    setSavedSuccessMap((prev) => ({ ...prev, [index]: true }));
    setTimeout(() => {
      setSavedSuccessMap((prev) => ({ ...prev, [index]: false }));
    }, 2500);
  };

  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#9E321E] mb-1">
            Visual Understanding
          </div>
          <h1 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#231A15] tracking-tight">
            Visual Menu & Sign Scanner
          </h1>
          <p className="text-xs sm:text-sm text-[#6C564B] mt-0.5">
            Point at any food board to decode dishes and learn how to order.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {!isCameraActive ? (
            <button
              type="button"
              onClick={startCamera}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#9E321E] hover:bg-[#882816] text-white rounded-xl text-xs font-bold shadow-sm transition-colors cursor-pointer"
            >
              <Video className="w-4 h-4" />
              <span>Live Camera</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={stopCamera}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#231A15] hover:bg-black text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
              <span>Close Camera</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-[#FAF5ED] text-[#281D17] rounded-xl text-xs font-bold border border-[#DFD0BD] shadow-2xs transition-colors cursor-pointer"
          >
            <Upload className="w-4 h-4 text-[#9E321E]" />
            <span>Upload Photo</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
      </div>

      {/* Quick Demo Preset Chips (Instant realistic boards) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {SAMPLE_SCAN_PRESETS.map((preset) => {
          const isSelected = selectedPreset?.id === preset.id && !customImage;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#9E321E] text-white shadow-sm ring-2 ring-[#9E321E]/20'
                  : 'bg-white text-[#5E483E] hover:bg-[#FAF4ED] border border-[#E8DDCE]'
              }`}
            >
              <span>{preset.name}</span>
              {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
            </button>
          );
        })}
      </div>

      {cameraError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700">
          {cameraError}
        </div>
      )}

      {/* Live Webcam Stream */}
      {isCameraActive && (
        <div className="relative rounded-3xl overflow-hidden bg-black max-w-lg mx-auto aspect-video mb-4 shadow-xl">
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
          <div className="absolute inset-0 border-2 border-dashed border-amber-300/80 rounded-3xl m-6 pointer-events-none flex items-center justify-center">
            <span className="text-xs bg-black/60 text-white px-3 py-1 rounded-full backdrop-blur-xs font-medium">
              Align menu text inside frame
            </span>
          </div>
          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
            <button
              type="button"
              onClick={captureSnapshot}
              className="px-6 py-3 bg-[#9E321E] hover:bg-[#882816] text-white rounded-full font-bold text-xs shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>Capture & Analyze</span>
            </button>
          </div>
        </div>
      )}

      {/* TWO-PANEL INTERACTIVE VISUAL SCANNER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Visual Scanned Photo with Hotspot Pins & Laser Scanning Line */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-4 border border-[#E8DDCE] shadow-xs space-y-3">
          <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-900 shadow-inner group">
            <img
              src={customImage || selectedPreset?.imageUrl}
              alt="Scanned Signboard"
              className="w-full h-full object-cover"
            />
            {/* Ambient vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

            {/* Glowing Laser Scan Bar */}
            <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#9E321E] to-transparent shadow-[0_0_12px_#9E321E] animate-pulse pointer-events-none" style={{ top: '40%' }} />

            {/* Interactive Hotspot Badges on the Menu */}
            {analysisResult?.items?.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setHighlightedItemIndex(idx)}
                className={`absolute px-2.5 py-1 rounded-full text-[10px] font-bold shadow-md transition-all cursor-pointer backdrop-blur-md ${
                  highlightedItemIndex === idx
                    ? 'bg-[#9E321E] text-white scale-110 ring-2 ring-white'
                    : 'bg-white/90 text-[#231A15] hover:bg-white'
                }`}
                style={{
                  top: `${25 + idx * 18}%`,
                  left: `${15 + (idx % 2) * 35}%`,
                }}
              >
                {item.englishName.split(' ')[0]} {item.priceOrDetail && `· ${item.priceOrDetail}`}
              </button>
            ))}

            <div className="absolute bottom-3 left-3 text-white">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300">
                {analysisResult?.detectedScript} Script Detected
              </div>
              <div className="font-serif-display text-base font-bold">
                {analysisResult?.title}
              </div>
            </div>
          </div>

          <div className="text-xs text-[#6B5549] bg-[#FAF5EE] p-3 rounded-2xl border border-[#E8DDCE]">
            💡 <span className="font-bold text-[#231A15]">Student Tip: </span>
            {analysisResult?.studentTip}
          </div>
        </div>

        {/* Right Column: Visual Dish Cards & Instant Phrases */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#EFE3D5]">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#9E321E]">
              Decoded Dishes & Prices
            </span>
            <span className="text-xs text-[#705A4E]">
              What you are actually ordering
            </span>
          </div>

          {/* Dish Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {analysisResult?.items?.map((item, idx) => {
              const isHighlighted = highlightedItemIndex === idx;
              const dishPhoto = DISH_IMAGES[item.englishName] || 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=400&q=80';

              return (
                <div
                  key={idx}
                  onClick={() => setHighlightedItemIndex(idx)}
                  className={`p-4 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                    isHighlighted
                      ? 'bg-white border-[#9E321E] shadow-md ring-2 ring-[#9E321E]/15'
                      : 'bg-white/80 border-[#E8DDCE] hover:bg-white hover:border-[#9E321E]/40'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={dishPhoto}
                      alt={item.englishName}
                      className="w-14 h-14 rounded-2xl object-cover shrink-0 shadow-xs border border-[#E8DDCE]"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-[#231A15] truncate">
                          {item.englishName}
                        </span>
                        {item.priceOrDetail && (
                          <span className="text-xs font-extrabold text-[#9E321E] bg-[#FAF1E6] px-2 py-0.5 rounded-lg">
                            {item.priceOrDetail}
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-semibold text-[#8C341F] mt-0.5 truncate">
                        {item.localText} · "{item.romanized}"
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-[#6B5549] line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="pt-2 border-t border-[#EFE3D5] flex items-center justify-between">
                    <AudioPlayerButton
                      text={item.localText}
                      language={userProfile.targetLanguage}
                      size="sm"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigateToPractice({
                          script: item.localText,
                          romanized: item.romanized,
                          meaning: item.englishName,
                        });
                      }}
                      className="text-xs font-bold text-[#9E321E] hover:underline cursor-pointer"
                    >
                      Practice Saying →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Instant Phrases to Order at Counter */}
          {analysisResult?.practicalPhrases && (
            <div className="bg-white rounded-3xl p-5 border border-[#E8DDCE] shadow-xs space-y-3 mt-4">
              <div className="text-xs font-extrabold uppercase tracking-wider text-[#9E321E]">
                What to Say at the Counter
              </div>

              <div className="space-y-2.5">
                {analysisResult.practicalPhrases.map((phrase, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-[#FAF5EE] border border-[#E9DCCC] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="font-bold text-sm text-[#231A15]">
                        {phrase.localText}
                      </div>
                      <div className="text-xs font-semibold text-[#8C341F]">
                        "{phrase.romanized}" · <span className="text-[#634E43] italic">{phrase.meaning}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <AudioPlayerButton
                        text={phrase.localText}
                        language={userProfile.targetLanguage}
                        size="sm"
                        label="Listen"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          onNavigateToPractice({
                            script: phrase.localText,
                            romanized: phrase.romanized,
                            meaning: phrase.meaning,
                          })
                        }
                        className="px-2.5 py-1.5 text-xs font-bold text-[#9E321E] hover:bg-[#F3E5CE]/50 rounded-lg transition-colors cursor-pointer"
                      >
                        Coach
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSavePhrase(phrase, idx)}
                        className="p-1.5 text-[#7F685B] hover:text-[#9E321E] rounded-lg transition-colors cursor-pointer"
                        title="Save to phrasebook"
                      >
                        {savedSuccessMap[idx] ? (
                          <Check className="w-4 h-4 text-emerald-600 font-bold" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
