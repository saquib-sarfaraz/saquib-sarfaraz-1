import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Award, Building2, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { LiquidGlassElement } from '../components/liquidglass';

export const leadershipData = [
  {
    id: 'co-chairperson-nsdc-2025',
    title: 'Co-Chairperson',
    organization: 'NSDC, Jamia Hamdard',
    role: 'Co-Chairperson',
    period: 'September 2025 – August 2026',
    dateLabel: 'Sep 2025 – Aug 2026',
    eyebrow: 'EXECUTIVE LEADERSHIP',
    description: 'Supported student-led skill-building initiatives, workshops, and campus community engagement.',
    highlights: [
      'Spearheaded student-led skill development outreach and campus initiatives.',
      'Coordinated institutional skill-building workshops, seminars, and student engagement drives.'
    ],
    tags: ['NSDC Jamia Hamdard', 'Skill Development', 'Student Initiatives', 'Executive Chapter'],
    position: 'above'
  },
  {
    id: 'campus-mantri-gfg-2024',
    title: 'Campus Mantri',
    organization: 'GeeksforGeeks Campus Body, Jamia Hamdard',
    role: 'Campus Mantri',
    period: 'December 2024 – February 2026',
    dateLabel: 'Dec 2024 – Feb 2026',
    eyebrow: 'DEVELOPER COMMUNITY',
    description: 'Supported developer community engagement, campus initiatives, and technical activities.',
    highlights: [
      'Connected 200+ students with coding competitions and peer learning sessions.',
      'Organized algorithm problem-solving walkthroughs and hackathon preparation cohorts.'
    ],
    tags: ['GeeksforGeeks', 'Developer Community', 'DSA & Hackathons', 'Campus Lead'],
    position: 'below'
  },
  {
    id: 'joint-secretary-ignite-2024',
    title: 'Joint Secretary',
    organization: 'Ignite Society, JHU',
    role: 'Joint Secretary',
    period: 'September 2024 – April 2025',
    dateLabel: 'Sep 2024 – Apr 2025',
    eyebrow: 'EXECUTIVE & OPERATIONS',
    description: 'Co-managed society operations, visual communication, and event execution across society activities.',
    highlights: [
      'Co-managed society administration, event planning, and student cohort operations.',
      'Directed visual communication, creative consistency, and promotional media across campus events.'
    ],
    tags: ['Ignite Society JHU', 'Joint Secretary', 'Operations & Leadership', 'Student Council'],
    position: 'above'
  },
  {
    id: 'creative-lead-ignite-2024',
    title: 'Creative Lead',
    organization: 'Ignite Society, JHU',
    role: 'Creative Lead',
    period: 'January – October 2024',
    dateLabel: 'Jan – Oct 2024',
    eyebrow: 'CREATIVE DIRECTION',
    description: 'Led creative initiatives, visual storytelling, and promotional design for campus activities.',
    highlights: [
      'Led visual storytelling, event branding, and promotional collateral.',
      'Designed digital assets and interactive campaign materials for university workshops.'
    ],
    tags: ['Ignite Society JHU', 'Creative Direction', 'Visual Storytelling', 'Brand Design'],
    position: 'below'
  }
];

export default function Leadership() {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [mobileActiveIdx, setMobileActiveIdx] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  const totalRoles = leadershipData.length;

  const handleMobilePrev = () => {
    setMobileActiveIdx((prev) => Math.max(0, prev - 1));
  };

  const handleMobileNext = () => {
    setMobileActiveIdx((prev) => Math.min(totalRoles - 1, prev + 1));
  };

  // Keyboard navigation for accessible card switching
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      handleMobilePrev();
    } else if (e.key === 'ArrowRight') {
      handleMobileNext();
    }
  };

  return (
    <section
      id="leadership"
      className="relative text-left bg-[#080A12] text-white py-24 px-4 sm:px-6 select-none border-t border-[#171A25] overflow-hidden"
    >
      {/* Anchor for backward compatibility with old #journey links */}
      <span id="journey" className="sr-only" aria-hidden="true" />

      {/* Subtle, restrained ambient lighting (no oversized distracting glows) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[360px] bg-white/[0.015] rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-14">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#171A25] text-white text-xs font-mono uppercase tracking-widest border border-[#414655] shadow-sm">
            <Award className="w-3.5 h-3.5 text-white" />
            <span>Campus Leadership</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
            Leadership <span className="bg-gradient-to-r from-white via-[#C6CBD6] to-[#747B8B] bg-clip-text text-transparent">Experience</span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base font-mono leading-relaxed">
            Four campus leadership roles across technical societies, student bodies, and community initiatives in reverse chronological order.
          </p>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            1. DESKTOP HORIZONTAL TIMELINE (Strictly lg: and up)
            - 4 columns across horizontal timeline
            - Alternating above and below
            - Subtle vertical connector lines
            - Restrained Liquid Glass surfaces
            - Controlled subtle lighting
            ══════════════════════════════════════════════════════════════ */}
        <div className="hidden lg:block relative pt-4 pb-8">
          {/* Central Horizontal Timeline Line */}
          <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none z-10" />

          {/* 4-Column Timeline Grid */}
          <div className="grid grid-cols-4 gap-6 xl:gap-8 relative z-20 items-center">
            {leadershipData.map((item, idx) => {
              const isAbove = item.position === 'above';
              const isHovered = hoveredIdx === idx;

              return (
                <div
                  key={item.id}
                  className="flex flex-col items-center justify-center relative min-h-[580px]"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  {/* ABOVE SLOT */}
                  <div className="h-[260px] w-full flex flex-col justify-end items-center">
                    {isAbove && (
                      <div className="w-full flex flex-col items-center">
                        {/* Leadership Card */}
                        <LiquidGlassElement
                          as="div"
                          config={{
                            blurAmount: 0.14,
                            refraction: isHovered ? 0.55 : 0.4,
                            edgeHighlight: isHovered ? 0.4 : 0.2,
                            specular: isHovered ? 0.3 : 0.15,
                            cornerRadius: 20,
                            zRadius: 16,
                          }}
                          className={`w-full p-5 rounded-2xl apple-glass-pill transition-all duration-300 border relative group overflow-hidden ${
                            isHovered
                              ? 'scale-[1.02] border-white/40 bg-[#121624]/90 shadow-[0_16px_36px_rgba(0,0,0,0.85),0_0_20px_rgba(255,255,255,0.08)]'
                              : 'border-white/15 bg-[#0e111a]/85 shadow-[0_10px_28px_rgba(0,0,0,0.7)] hover:border-white/30'
                          }`}
                        >
                          <div className="apple-specular-glare" />

                          {/* Header: Eyebrow + Date Pill */}
                          <div className="flex items-center justify-between gap-2 mb-2 relative z-10">
                            <span className="text-[10px] font-mono font-bold tracking-[0.16em] uppercase text-slate-400 flex items-center gap-1.5 truncate">
                              <span className={`w-1.5 h-1.5 rounded-full transition-colors ${isHovered ? 'bg-white' : 'bg-[#747B8B]'}`} />
                              {item.eyebrow}
                            </span>
                            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border transition-all shrink-0 ${
                              isHovered
                                ? 'bg-white text-black border-white'
                                : 'bg-[#171A25] text-[#C6CBD6] border-white/15'
                            }`}>
                              {item.dateLabel}
                            </span>
                          </div>

                          {/* Role Title & Organization */}
                          <div className="space-y-1 relative z-10">
                            <h3 className="text-base font-extrabold text-white tracking-tight leading-snug">
                              {item.title}
                            </h3>
                            <div className="flex items-center gap-1.5 text-xs font-mono text-[#C6CBD6] font-medium truncate">
                              <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="truncate">{item.organization}</span>
                            </div>
                          </div>

                          {/* Description */}
                          <p className="text-xs text-slate-300 leading-relaxed font-sans pt-2.5 mt-2.5 border-t border-white/10 relative z-10 line-clamp-3">
                            {item.description}
                          </p>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-1.5 pt-3 relative z-10">
                            {item.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#171A25] border border-white/10 text-slate-400"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </LiquidGlassElement>

                        {/* Precision Vertical Connector Down to Node */}
                        <div className="relative flex flex-col items-center justify-center h-8 w-full z-10">
                          <div
                            className={`w-[1px] h-full transition-all duration-300 ${
                              isHovered
                                ? 'bg-gradient-to-b from-white/40 via-white/80 to-white shadow-[0_0_8px_rgba(255,255,255,0.6)]'
                                : 'bg-gradient-to-b from-white/20 to-white/40'
                            }`}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* CENTRAL TIMELINE NODE (Sits precisely on the timeline beam) */}
                  <div className="h-10 flex items-center justify-center relative z-30">
                    <button
                      type="button"
                      tabIndex={0}
                      aria-label={`${item.title} timeline milestone`}
                      className={`w-4 h-4 rounded-full border bg-[#080A12] flex items-center justify-center transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                        isHovered
                          ? 'scale-125 border-white ring-2 ring-white/40 shadow-[0_0_12px_rgba(255,255,255,0.7)]'
                          : 'border-white/40 hover:border-white/70'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                          isHovered ? 'bg-white scale-125' : 'bg-white/70'
                        }`}
                      />
                    </button>
                  </div>

                  {/* BELOW SLOT */}
                  <div className="h-[260px] w-full flex flex-col justify-start items-center">
                    {!isAbove && (
                      <div className="w-full flex flex-col items-center">
                        {/* Precision Vertical Connector Down from Node */}
                        <div className="relative flex flex-col items-center justify-center h-8 w-full z-10">
                          <div
                            className={`w-[1px] h-full transition-all duration-300 ${
                              isHovered
                                ? 'bg-gradient-to-b from-white via-white/80 to-white/40 shadow-[0_0_8px_rgba(255,255,255,0.6)]'
                                : 'bg-gradient-to-b from-white/40 to-white/20'
                            }`}
                          />
                        </div>

                        {/* Leadership Card */}
                        <LiquidGlassElement
                          as="div"
                          config={{
                            blurAmount: 0.14,
                            refraction: isHovered ? 0.55 : 0.4,
                            edgeHighlight: isHovered ? 0.4 : 0.2,
                            specular: isHovered ? 0.3 : 0.15,
                            cornerRadius: 20,
                            zRadius: 16,
                          }}
                          className={`w-full p-5 rounded-2xl apple-glass-pill transition-all duration-300 border relative group overflow-hidden ${
                            isHovered
                              ? 'scale-[1.02] border-white/40 bg-[#121624]/90 shadow-[0_16px_36px_rgba(0,0,0,0.85),0_0_20px_rgba(255,255,255,0.08)]'
                              : 'border-white/15 bg-[#0e111a]/85 shadow-[0_10px_28px_rgba(0,0,0,0.7)] hover:border-white/30'
                          }`}
                        >
                          <div className="apple-specular-glare" />

                          {/* Header: Eyebrow + Date Pill */}
                          <div className="flex items-center justify-between gap-2 mb-2 relative z-10">
                            <span className="text-[10px] font-mono font-bold tracking-[0.16em] uppercase text-slate-400 flex items-center gap-1.5 truncate">
                              <span className={`w-1.5 h-1.5 rounded-full transition-colors ${isHovered ? 'bg-white' : 'bg-[#747B8B]'}`} />
                              {item.eyebrow}
                            </span>
                            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border transition-all shrink-0 ${
                              isHovered
                                ? 'bg-white text-black border-white'
                                : 'bg-[#171A25] text-[#C6CBD6] border-white/15'
                            }`}>
                              {item.dateLabel}
                            </span>
                          </div>

                          {/* Role Title & Organization */}
                          <div className="space-y-1 relative z-10">
                            <h3 className="text-base font-extrabold text-white tracking-tight leading-snug">
                              {item.title}
                            </h3>
                            <div className="flex items-center gap-1.5 text-xs font-mono text-[#C6CBD6] font-medium truncate">
                              <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="truncate">{item.organization}</span>
                            </div>
                          </div>

                          {/* Description */}
                          <p className="text-xs text-slate-300 leading-relaxed font-sans pt-2.5 mt-2.5 border-t border-white/10 relative z-10 line-clamp-3">
                            {item.description}
                          </p>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-1.5 pt-3 relative z-10">
                            {item.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#171A25] border border-white/10 text-slate-400"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </LiquidGlassElement>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            2. MOBILE ANIMATED STACKED CARDS (Strictly < lg:)
            - One prominent card active at a time
            - Stacked cards behind with subtle vertical offset & scaling (depth effect)
            - Swipe gesture support (drag="x")
            - Previous/Next navigation controls & pagination dots
            - Keyboard navigation & reduced motion respect
            ══════════════════════════════════════════════════════════════ */}
        <div
          className="block lg:hidden relative max-w-md mx-auto focus:outline-none"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          aria-label="Mobile Leadership Card Deck"
          role="region"
        >
          {/* Deck Header & Controls */}
          <div className="flex items-center justify-between gap-3 pb-4 mb-2 border-b border-white/10">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs font-mono font-bold text-white tracking-wide truncate">
                {leadershipData[mobileActiveIdx].title}
              </span>
              <span className="text-slate-600 shrink-0">•</span>
              <span className="text-[11px] font-mono text-slate-400 truncate">
                {leadershipData[mobileActiveIdx].organization}
              </span>
            </div>

            {/* Accessible Previous / Next Buttons */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleMobilePrev}
                disabled={mobileActiveIdx === 0}
                aria-label="Previous leadership card"
                className="w-8 h-8 rounded-full apple-glass-btn text-white disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center transition-all cursor-pointer shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleMobileNext}
                disabled={mobileActiveIdx === totalRoles - 1}
                aria-label="Next leadership card"
                className="w-8 h-8 rounded-full apple-glass-btn text-white disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center transition-all cursor-pointer shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Swipeable Stack Deck Container */}
          <div
            className="relative w-full pb-12 pt-2"
            style={{
              minHeight: '440px',
            }}
          >
            {leadershipData.map((item, idx) => {
              const relativeIdx = idx - mobileActiveIdx;
              const isCurrent = relativeIdx === 0;
              const isPast = relativeIdx < 0;
              const isVisibleInStack = relativeIdx >= 0 && relativeIdx <= 2;

              // Compute physical stacking depth attributes
              let targetX = 0;
              let targetY = 0;
              let targetScale = 1;
              let targetOpacity = 0;
              let targetZIndex = 1;

              if (isPast) {
                targetX = shouldReduceMotion ? 0 : -320;
                targetY = 0;
                targetScale = 0.92;
                targetOpacity = 0;
                targetZIndex = 0;
              } else if (isCurrent) {
                targetX = 0;
                targetY = 0;
                targetScale = 1;
                targetOpacity = 1;
                targetZIndex = 10;
              } else if (relativeIdx === 1) {
                targetX = 0;
                targetY = 16;
                targetScale = 0.94;
                targetOpacity = 0.72;
                targetZIndex = 8;
              } else if (relativeIdx === 2) {
                targetX = 0;
                targetY = 30;
                targetScale = 0.88;
                targetOpacity = 0.42;
                targetZIndex = 6;
              } else {
                targetX = 0;
                targetY = 40;
                targetScale = 0.82;
                targetOpacity = 0;
                targetZIndex = 4;
              }

              return (
                <motion.div
                  key={item.id}
                  drag={isCurrent && !shouldReduceMotion ? 'x' : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.4}
                  onDragEnd={(e, { offset, velocity }) => {
                    const swipeThreshold = 45;
                    const velocityThreshold = 350;
                    if (offset.x < -swipeThreshold || velocity.x < -velocityThreshold) {
                      handleMobileNext();
                    } else if (offset.x > swipeThreshold || velocity.x > velocityThreshold) {
                      handleMobilePrev();
                    }
                  }}
                  animate={{
                    x: targetX,
                    y: targetY,
                    scale: targetScale,
                    opacity: targetOpacity,
                    zIndex: targetZIndex,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: shouldReduceMotion ? 600 : 360,
                    damping: shouldReduceMotion ? 40 : 30,
                    mass: 0.8,
                  }}
                  onClick={() => {
                    if (!isCurrent && isVisibleInStack) {
                      setMobileActiveIdx(idx);
                    }
                  }}
                  className={`absolute top-0 left-0 right-0 w-full touch-pan-y ${
                    isCurrent ? 'cursor-grab active:cursor-grabbing' : isVisibleInStack ? 'cursor-pointer' : 'pointer-events-none'
                  }`}
                  style={{
                    transformOrigin: 'top center',
                  }}
                >
                  {/* Card Surface */}
                  <div className="relative w-full rounded-3xl bg-[#0D101A] border border-white/20 p-5 sm:p-6 shadow-[0_22px_50px_rgba(0,0,0,0.92),0_0_24px_rgba(255,255,255,0.05)] backdrop-blur-2xl overflow-hidden transition-colors">
                    <div className="apple-specular-glare" />

                    {/* Top Bar: Eyebrow, Frosted Date Pill */}
                    <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3 mb-3 relative z-10">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="text-[10px] font-mono font-bold tracking-[0.18em] uppercase text-slate-400 flex items-center gap-1.5 truncate">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isCurrent ? 'bg-white animate-pulse' : 'bg-slate-500'
                            }`}
                          />
                          {item.eyebrow}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`text-[10px] font-mono font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                            isCurrent
                              ? 'bg-white text-black border-white shadow-sm'
                              : 'bg-[#171A25] text-slate-300 border-white/15'
                          }`}
                        >
                          {item.dateLabel}
                        </span>
                      </div>
                    </div>

                    {/* Role Title & Organization */}
                    <div className="space-y-1 relative z-10">
                      <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight font-sans">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs font-mono text-[#C6CBD6] font-medium">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{item.organization}</span>
                      </div>
                    </div>

                    {/* Role Description */}
                    <p className="text-xs text-slate-300 leading-relaxed font-sans pt-3 relative z-10">
                      {item.description}
                    </p>

                    {/* Key Highlights */}
                    {item.highlights && item.highlights.length > 0 && (
                      <div className="space-y-1.5 pt-3 mt-3 border-t border-white/10 relative z-10">
                        <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                          Key Deliverables:
                        </div>
                        <div className="space-y-1.5 text-xs text-slate-300">
                          {item.highlights.map((bullet, bIdx) => (
                            <div key={bIdx} className="flex items-start gap-2 leading-snug">
                              <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0 text-white" />
                              <span>{bullet}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tag Badges */}
                    <div className="pt-3 mt-3 border-t border-white/10 flex flex-wrap gap-1.5 relative z-10">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-md bg-[#171A25] border border-white/10 text-[10px] font-mono text-slate-300 font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom Pagination Indicators & Swipe Hint */}
          <div className="flex flex-col items-center gap-2 pt-2">
            <div className="flex items-center gap-1.5">
              {leadershipData.map((m, idx) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMobileActiveIdx(idx)}
                  aria-label={`Switch to ${m.title}`}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    mobileActiveIdx === idx
                      ? 'w-7 bg-white shadow-[0_0_10px_#ffffff]'
                      : 'w-2 bg-white/25 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>

            <span className="text-[10px] font-mono text-slate-400 select-none">
              ← Swipe card horizontally or use controls →
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
