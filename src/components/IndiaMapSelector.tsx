import React, { useState } from 'react';
import { ArrowRight, MapPin, Sparkles, Compass } from 'lucide-react';
import { REGIONAL_PRESETS, RegionalPreset } from '../data/mockData';
import { RegionalTheme } from '../types';

interface IndiaMapSelectorProps {
  selectedCity: 'Chennai' | 'Jaipur' | 'Kolkata';
  onSelectCity: (city: 'Chennai' | 'Jaipur' | 'Kolkata') => void;
  onConfirmDestination: () => void;
  currentTheme: RegionalTheme;
  onChangeTheme: (theme: RegionalTheme) => void;
}

export const IndiaMapSelector: React.FC<IndiaMapSelectorProps> = ({
  selectedCity,
  onSelectCity,
  onConfirmDestination,
  currentTheme,
  onChangeTheme,
}) => {
  const [hoveredCity, setHoveredCity] = useState<'Chennai' | 'Jaipur' | 'Kolkata' | null>(null);

  const activePreset: RegionalPreset = REGIONAL_PRESETS[selectedCity] || REGIONAL_PRESETS.Chennai;

  // Geometric map coordinates for the 3 cities on a 600x700 viewBox
  const cityCoordinates: Record<'Chennai' | 'Jaipur' | 'Kolkata', { x: number; y: number; labelPos: 'top' | 'right' | 'left' }> = {
    Jaipur: { x: 235, y: 250, labelPos: 'right' },
    Kolkata: { x: 440, y: 320, labelPos: 'right' },
    Chennai: { x: 310, y: 550, labelPos: 'right' },
  };

  return (
    <div className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden px-4 sm:px-8 lg:px-14 py-6 select-none">
      {/* Decorative concentric heritage rings */}
      <div className="absolute -left-28 top-16 w-96 h-96 heritage-ring pointer-events-none opacity-60" />
      <div className="absolute -left-12 top-32 w-64 h-64 heritage-ring pointer-events-none opacity-40" />
      <div className="absolute -right-28 -bottom-24 w-[480px] h-[480px] heritage-ring pointer-events-none opacity-50" />
      <div className="absolute -right-8 -bottom-6 w-72 h-72 heritage-ring pointer-events-none opacity-30" />

      {/* Top Header Bar */}
      <header className="relative z-20 flex items-center justify-between pb-4">
        {/* Brand with emblem */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#9E321E] text-white flex items-center justify-center font-bold text-lg shadow-sm shadow-[#9E321E]/20">
            ब
          </div>
          <div>
            <div className="font-serif-display text-2xl font-bold tracking-tight text-[#2B1F19] leading-tight">
              Baatcheet
            </div>
            <div className="text-[10px] tracking-[0.22em] uppercase font-bold text-[#8A5A4A]">
              Speak local. Feel at home.
            </div>
          </div>
        </div>

        {/* Step indicator & theme switcher */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#EDE4D5]/80 border border-[#DFD3C1] text-xs">
            <button
              type="button"
              onClick={() => onChangeTheme('parchment')}
              className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-colors cursor-pointer ${
                currentTheme === 'parchment' ? 'bg-white text-[#9E321E] shadow-2xs' : 'text-[#7A6455] hover:text-[#2B1F19]'
              }`}
            >
              Parchment
            </button>
            <button
              type="button"
              onClick={() => onChangeTheme('jaipur')}
              className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-colors cursor-pointer ${
                currentTheme === 'jaipur' ? 'bg-white text-[#B85D36] shadow-2xs' : 'text-[#7A6455] hover:text-[#2B1F19]'
              }`}
            >
              Jaipur Rose
            </button>
            <button
              type="button"
              onClick={() => onChangeTheme('kolkata')}
              className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-colors cursor-pointer ${
                currentTheme === 'kolkata' ? 'bg-white text-[#8B3A2B] shadow-2xs' : 'text-[#7A6455] hover:text-[#2B1F19]'
              }`}
            >
              Kolkata Ochre
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-bold tracking-wider text-[#9E321E] uppercase">
            <span className="font-mono text-sm font-extrabold">01</span>
            <span>Choose Your Destination</span>
          </div>
        </div>
      </header>

      {/* Main 2-Panel Desktop Layout */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto py-4">
        {/* Left Column: Heading & Philosophy */}
        <div className="lg:col-span-4 space-y-4 max-w-md">
          <div className="text-[11px] tracking-[0.2em] font-bold uppercase text-[#9E321E]">
            Your language journey begins here
          </div>

          <h1 className="font-serif-display text-5xl sm:text-6xl text-[#281D17] leading-[1.05] tracking-tight">
            Where are you calling home next?
          </h1>

          <p className="text-sm sm:text-base text-[#6E584D] font-normal leading-relaxed pt-1">
            Pick a city and we’ll shape everyday lessons around its language, rhythm, and real-life moments.
          </p>

          {/* Quick city badges for mobile or fast selection */}
          <div className="pt-2 flex flex-wrap items-center gap-2">
            {(['Chennai', 'Jaipur', 'Kolkata'] as const).map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => onSelectCity(city)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedCity === city
                    ? 'bg-[#9E321E] text-white shadow-sm ring-2 ring-[#9E321E]/20'
                    : 'bg-[#EDE4D5]/90 text-[#5E483E] hover:bg-[#E2D5C3]'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Center Column: Interactive Stylized Geometric India Map */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center relative">
          <div className="relative w-full max-w-[390px] aspect-[6/7]">
            <svg
              viewBox="0 0 600 700"
              className="w-full h-full drop-shadow-xs overflow-visible"
              aria-label="Stylized map of India with Chennai, Jaipur, and Kolkata"
            >
              {/* Geometric Faceted India Perimeter Path (Matching Screenshot) */}
              <polygon
                points="
                  300,40  320,60  360,70  380,105 440,140 450,180
                  435,210 470,230 520,280 500,340 480,360 450,420
                  420,450 370,510 325,580 300,640 285,580 270,540
                  250,490 230,440 205,390 190,320 215,260 230,210
                  245,160 260,110 280,60
                "
                fill="#F2ECE0"
                stroke="#C69686"
                strokeWidth="1.8"
                strokeLinejoin="round"
                className="transition-colors duration-300"
              />

              {/* Dashed Golden/Terracotta Route Lines connecting Jaipur <-> Kolkata <-> Chennai */}
              <polyline
                points={`
                  ${cityCoordinates.Jaipur.x},${cityCoordinates.Jaipur.y}
                  ${cityCoordinates.Kolkata.x},${cityCoordinates.Kolkata.y}
                  ${cityCoordinates.Chennai.x},${cityCoordinates.Chennai.y}
                  ${cityCoordinates.Jaipur.x},${cityCoordinates.Jaipur.y}
                `}
                fill="none"
                stroke="#C88E7D"
                strokeWidth="1.8"
                strokeDasharray="5,6"
                className="opacity-70 animate-pulse"
                style={{ animationDuration: '3s' }}
              />

              {/* Interactive City Nodes */}
              {(['Jaipur', 'Kolkata', 'Chennai'] as const).map((city) => {
                const coords = cityCoordinates[city];
                const isSelected = selectedCity === city;
                const isHovered = hoveredCity === city;

                return (
                  <g
                    key={city}
                    className="cursor-pointer group"
                    onClick={() => onSelectCity(city)}
                    onMouseEnter={() => setHoveredCity(city)}
                    onMouseLeave={() => setHoveredCity(null)}
                  >
                    {/* Animated Outer Radar Rings when selected */}
                    {isSelected && (
                      <>
                        <circle
                          cx={coords.x}
                          cy={coords.y}
                          r="26"
                          fill="rgba(158, 50, 30, 0.08)"
                          className="animate-ping"
                          style={{ animationDuration: '2.5s' }}
                        />
                        <circle
                          cx={coords.x}
                          cy={coords.y}
                          r="18"
                          fill="none"
                          stroke="#9E321E"
                          strokeWidth="1.2"
                          strokeDasharray="2,3"
                        />
                      </>
                    )}

                    {/* Outer glowing halo */}
                    <circle
                      cx={coords.x}
                      cy={coords.y}
                      r={isSelected ? '12' : isHovered ? '10' : '8'}
                      fill={isSelected ? '#9E321E' : '#B85D36'}
                      opacity={isSelected ? '0.3' : '0.2'}
                      className="transition-all duration-200"
                    />

                    {/* Center Core Dot */}
                    <circle
                      cx={coords.x}
                      cy={coords.y}
                      r={isSelected ? '6.5' : '5'}
                      fill={isSelected ? '#9E321E' : '#8B3A2B'}
                      stroke="#FFFFFF"
                      strokeWidth="2"
                      className="transition-all duration-200 shadow-sm"
                    />

                    {/* Floating City Label Pill as in screenshot */}
                    <foreignObject
                      x={coords.x + 14}
                      y={coords.y - 15}
                      width="90"
                      height="32"
                      className="overflow-visible pointer-events-none"
                    >
                      <div
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold transition-all shadow-xs ${
                          isSelected
                            ? 'bg-white text-[#2B1F19] ring-1 ring-[#9E321E]/30 scale-105'
                            : 'bg-white/90 text-[#543E33] hover:bg-white'
                        }`}
                      >
                        {city}
                      </div>
                    </foreignObject>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Bottom Map Subtitle */}
          <div className="text-[10px] tracking-[0.2em] font-bold text-[#8A7063] uppercase text-center mt-3">
            Three cities. Three living languages.
            <br className="hidden sm:block" />
            One companion for every first.
          </div>
        </div>

        {/* Right Column: Floating Heritage Destination Card */}
        <div className="lg:col-span-4 flex justify-center lg:justify-end">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 sm:p-7 shadow-[0_12px_40px_rgba(40,25,18,0.06)] border border-[#E9DDCF] relative transition-all duration-300">
            {/* Top Row: Script Glyph Circle & Faint Serif Stamp Number */}
            <div className="flex items-center justify-between mb-5">
              <div className="w-12 h-12 rounded-full bg-[#F3E5CE] text-[#8C5229] font-bold text-xl flex items-center justify-center font-serif shadow-xs">
                {activePreset.glyph}
              </div>
              <span className="font-serif-display text-4xl text-[#E8DDD0] select-none">
                01
              </span>
            </div>

            {/* Region / State Tag */}
            <div className="text-[11px] tracking-[0.18em] font-extrabold uppercase text-[#9E321E] mb-1">
              {activePreset.state}
            </div>

            {/* City Title */}
            <h2 className="font-serif-display text-4xl sm:text-[42px] font-bold text-[#201712] tracking-tight mb-2">
              {activePreset.city}
            </h2>

            {/* Local Greeting in Native Script + Romanized */}
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-base font-bold text-[#9E321E]">
                {activePreset.greetingScript}
              </span>
              <span className="text-sm font-semibold text-[#664D40]">
                {activePreset.localGreeting}
              </span>
            </div>

            {/* Atmosphere Description */}
            <p className="text-xs sm:text-sm text-[#6C564B] leading-relaxed mb-6">
              {activePreset.atmosphere}
            </p>

            {/* Subtle Divider */}
            <div className="h-px bg-[#EFE4D6] mb-5" />

            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-[#91796D] font-bold">
                  You'll learn
                </div>
                <div className="text-sm font-bold text-[#231A15] mt-0.5">
                  {activePreset.language}
                </div>
              </div>
              <div className="border-l border-[#EFE4D6] pl-4">
                <div className="text-[10px] uppercase tracking-wider text-[#91796D] font-bold">
                  Starter path
                </div>
                <div className="text-sm font-bold text-[#231A15] mt-0.5">
                  {activePreset.scenarioCount} scenarios
                </div>
              </div>
            </div>

            {/* Main Call to Action Button */}
            <button
              type="button"
              onClick={onConfirmDestination}
              className="w-full py-3.5 px-5 bg-gradient-to-r from-[#9E321E] to-[#B33923] hover:from-[#8B2B18] hover:to-[#9E321E] text-white rounded-xl font-bold text-sm shadow-md shadow-[#9E321E]/20 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Start my journey</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
