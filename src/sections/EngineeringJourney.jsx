import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Building2,
  ExternalLink,
  Code2,
  CheckCircle2,
  Sparkles,
  Rocket,
  Layers,
  ArrowUpRight,
  Zap,
  Info,
  X,
  ChevronDown,
  ChevronUp,
  Users
} from 'lucide-react';
import { LiquidGlassContainer, LiquidGlassElement } from '../components/liquidglass';
import MobilePortfolioStack from '../components/MobilePortfolioStack';

const journeyGlassDefaults = {
  blurAmount: 0.16,
  refraction: 0.55,
  chromAberration: 0.04,
  edgeHighlight: 0.28,
  specular: 0.24,
  fresnel: 1.15,
  cornerRadius: 24,
  zRadius: 20,
  shadowOpacity: 0.38,
  shadowSpread: 22,
  shadowOffsetY: 6,
};

// ═════════════════════════════════════════════════════════════════════
// CINEMATIC MILESTONES (100% VERIFIED AUTHENTIC PORTFOLIO & LINKEDIN DATA)
// Alternating strictly Above and Below the central luminous energy beam
// ═════════════════════════════════════════════════════════════════════
export const cinematicJourneyData = [
  {
    id: 'the-beginning-2023',
    position: 'above',
    dateLabel: '2023',
    dateRange: 'August 2023 – 2027',
    eyebrow: 'EDUCATION',
    title: 'The Beginning',
    subtitle: 'Jamia Hamdard · B.Tech CSE Foundation',
    organization: 'Jamia Hamdard, New Delhi',
    role: 'B.Tech CSE Student',
    accentColor: '#FFFFFF',
    glowHex: 'rgba(255, 255, 255, 0.7)',
    titleStyle: 'from-white via-[#C6CBD6] to-[#747B8B]',
    image: null,
    summary:
      'Started B.Tech in Computer Science Engineering at Jamia Hamdard in August 2023. Built strong core problem-solving fundamentals in C++, Data Structures & Algorithms, while mastering modern web primitives with HTML5, CSS3, JavaScript, and crafting early web projects.',
    highlights: [
      'Engineered core algorithmic problem-solving and data structure foundations in C++.',
      'Mastered modern web primitives with HTML5, CSS3, and JavaScript, building responsive web applications.',
      'Explored UI/UX design with Figma wireframes and interactive prototypes.'
    ],
    tags: ['B.Tech CSE', 'DSA in C++', 'HTML5/CSS3', 'JavaScript', 'UI/UX Design'],
    liveUrl: null,
    liveLabel: null
  },
  {
    id: 'creative-lead-ignite-2024',
    position: 'below',
    dateLabel: 'JAN. – OCT. 2024',
    dateRange: 'January 2024 – October 2024 · 10 mos',
    eyebrow: 'CAMPUS LEADERSHIP',
    title: 'Creative Lead',
    subtitle: 'Ignite Society JHU · Part-time',
    organization: 'Ignite Society JHU',
    role: 'Creative Lead',
    accentColor: '#FFFFFF',
    glowHex: 'rgba(255, 255, 255, 0.75)',
    titleStyle: 'from-white via-[#C6CBD6] to-[#747B8B]',
    image: null,
    summary:
      'Led visual communication, branding direction, and creative media design for Ignite Society JHU across 10 months. Designed promotional collateral, digital assets, and workshop materials connecting university students with technical events.',
    highlights: [
      'Directed visual identity, event branding, and promotional collateral for university technical events.',
      'Designed interactive workshop materials and digital campaign banners across student cohorts.',
      'Collaborated closely with executive teams to elevate society presence and participation across campus.'
    ],
    tags: ['Ignite Society JHU', 'Creative Direction', 'UI Design', 'Brand Identity', 'Part-time'],
    liveUrl: null,
    liveLabel: null
  },
  {
    id: 'pizeonfly-internship-2024',
    position: 'above',
    dateLabel: 'SEP. – OCT. 2024',
    dateRange: 'September 2024 – October 2024',
    eyebrow: 'INDUSTRY INTERNSHIP',
    title: 'My First Internship',
    subtitle: 'Pizeonfly Pvt Ltd · Full-Stack Development',
    organization: 'Pizeonfly Pvt Ltd',
    role: 'Web Developer Intern',
    location: 'New Delhi, India',
    accentColor: '#FFFFFF',
    glowHex: 'rgba(255, 255, 255, 0.7)',
    titleStyle: 'from-white via-[#C6CBD6] to-[#747B8B]',
    image: null,
    summary:
      'Stepped into industry web development at Pizeonfly Pvt Ltd. Built full-stack features with React.js and Node.js/Express.js, implemented authentication flows, integrated REST APIs, and debugged cross-browser and backend issues in a live production environment.',
    highlights: [
      'Built full-stack features with React.js and Node.js/Express.js, including authentication flows and REST API integrations.',
      'Debugged cross-browser and backend issues in a live production environment.',
      'Supported end-to-end module performance and deployment stability across production environments.'
    ],
    tags: ['React.js', 'Node.js', 'Express.js', 'REST APIs', 'JWT Auth', 'Production Debugging'],
    liveUrl: null,
    liveLabel: null
  },
  {
    id: 'joint-secretary-ignite-2024',
    position: 'below',
    dateLabel: 'SEP. 2024 – APR. 2025',
    dateRange: 'September 2024 – April 2025 · 8 mos',
    eyebrow: 'EXECUTIVE LEADERSHIP',
    title: 'Joint Secretary',
    subtitle: 'Ignite Society JHU · Part-time',
    organization: 'Ignite Society JHU',
    role: 'Joint Secretary',
    accentColor: '#FFFFFF',
    glowHex: 'rgba(255, 255, 255, 0.75)',
    titleStyle: 'from-white via-[#C6CBD6] to-[#747B8B]',
    image: null,
    summary:
      'Elected Joint Secretary at Ignite Society JHU. Oversaw executive student operations, coordinated technical bootcamps, organized coding workshops, and managed cross-functional teams to foster peer-to-peer developer learning on campus.',
    highlights: [
      'Managed executive student operations and coordinated campus-wide technical workshops.',
      'Facilitated cross-batch peer learning cohorts and hands-on algorithmic coding sessions.',
      'Spearheaded event logistics and technical mentorship initiatives for incoming engineering students.'
    ],
    tags: ['Ignite Society JHU', 'Joint Secretary', 'Student Operations', 'Technical Mentorship', 'Part-time'],
    liveUrl: null,
    liveLabel: null
  },
  {
    id: 'from-learning-to-building-2024',
    position: 'above',
    dateLabel: 'WINTER 2024 – 2025',
    dateRange: 'Late 2024 – 2025',
    eyebrow: 'FULL-STACK PLATFORMS',
    title: 'From Learning to Building',
    subtitle: 'inCampus Platform · 100+ University Users',
    organization: 'inCampus (incampus.online)',
    role: 'Full-Stack Architect & Creator',
    accentColor: '#FFFFFF',
    glowHex: 'rgba(255, 255, 255, 0.75)',
    titleStyle: 'from-white via-[#C6CBD6] to-[#747B8B]',
    image: null,
    summary:
      'Architected, built, and deployed inCampus—a full-stack MERN social platform for university students now serving 100+ active users. Engineered multi-tenant feeds, sub-100ms real-time chat with Socket.io, JWT + Google OAuth authentication, and dynamic college search microservices.',
    highlights: [
      'Built and deployed a MERN social platform for university students, now used by 100+ active users.',
      'Implemented JWT and Google OAuth authentication, a dynamic content feed, and real-time chat with Socket.io including unread tracking.',
      'Designed a modular REST API backend on MongoDB Atlas; automated deployment on Vercel and Render for continuous updates.'
    ],
    tags: ['React.js', 'Socket.io', 'Node.js', 'MongoDB Atlas', 'JWT Auth', 'Google OAuth'],
    liveUrl: 'https://incampus.online',
    liveLabel: 'Launch inCampus'
  },
  {
    id: 'campus-mantri-gfg-2024',
    position: 'below',
    dateLabel: 'DEC. 2024 – FEB. 2026',
    dateRange: 'December 2024 – February 2026 · 1 yr 3 mos',
    eyebrow: 'COMMUNITY LEADERSHIP',
    title: 'Campus Mantri',
    subtitle: 'GeeksforGeeks · Internship',
    organization: 'GeeksforGeeks',
    role: 'Campus Mantri',
    accentColor: '#FFFFFF',
    glowHex: 'rgba(255, 255, 255, 0.75)',
    titleStyle: 'from-white via-[#C6CBD6] to-[#747B8B]',
    image: null,
    summary:
      'Selected as GeeksforGeeks Campus Mantri at Jamia Hamdard across 1 year 3 months. Spearheaded university technical culture by connecting 200+ students with coding competitions, peer learning sessions, and structured hackathon preparation cohorts.',
    highlights: [
      'Connected 200+ university students with coding competitions, peer learning sessions, and technical workshops.',
      'Organized algorithm problem-solving walkthroughs and structured hackathon preparation cohorts.',
      'Fostered competitive programming culture on campus directly in partnership with GeeksforGeeks.'
    ],
    tags: ['GeeksforGeeks', 'Campus Mantri', '200+ Mentored', 'DSA & CP', 'Internship'],
    liveUrl: null,
    liveLabel: null
  },
  {
    id: 'co-chairperson-nsdc-2025',
    position: 'above',
    dateLabel: 'SEP. 2025 – AUG. 2026',
    dateRange: 'September 2025 – August 2026 · 1 yr',
    eyebrow: 'CAMPUS LEADERSHIP',
    title: 'Co-Chairperson',
    subtitle: 'NSDC Jamia Hamdard · Part-time',
    organization: 'NSDC Jamia Hamdard',
    role: 'Co-Chairperson',
    accentColor: '#FFFFFF',
    glowHex: 'rgba(255, 255, 255, 0.75)',
    titleStyle: 'from-white via-[#C6CBD6] to-[#747B8B]',
    image: null,
    summary:
      'Appointed Co-Chairperson at National Skill Development Corporation (NSDC) student chapter, Jamia Hamdard. Led chapter vision, technical skill symposiums, industry engagement programs, and collaborative technical initiatives.',
    highlights: [
      'Led student chapter executive board and set strategic direction for university technical skill initiatives.',
      'Bridged academic coursework with practical industry skills through structured technical symposiums.',
      'Collaborated with faculty and external mentors to deliver career-readiness and engineering workshops.'
    ],
    tags: ['NSDC Jamia Hamdard', 'Co-Chairperson', 'Skill Development', 'Executive Leadership', 'Part-time'],
    liveUrl: null,
    liveLabel: null
  },
  {
    id: 'industry-software-internships-2026',
    position: 'below',
    dateLabel: 'JUN. – SEP. 2026',
    dateRange: 'June 2026 – September 2026',
    eyebrow: 'SOFTWARE INTERNSHIPS',
    title: 'Into the Industry',
    subtitle: 'Wonderkids.club & Confidential Government',
    organization: 'Wonderkids.club & Confidential Government',
    role: 'Software Developer Intern',
    location: 'Remote',
    accentColor: '#FFFFFF',
    glowHex: 'rgba(255, 255, 255, 0.75)',
    titleStyle: 'from-white via-[#C6CBD6] to-[#747B8B]',
    image: null,
    summary:
      'Delivered production code across two professional internships: building interactive educational games and PHP/Python backend modules at Wonderkids.club (Jun–Aug 2026), and engineering backend functionality, administrative interfaces, and responsive solutions at Confidential Government (Aug–Sep 2026).',
    highlights: [
      'Wonderkids.club (Jun–Aug 2026): Built interactive educational games and responsive UI screens across front-end and PHP/Python backend modules.',
      'Confidential Government (Aug–Sep 2026): Engineered backend functionality, administrative interfaces, and responsive user experiences.',
      'Translated functional requirements into maintainable, production-ready features with high standards of reliability and code quality.'
    ],
    tags: ['Software Development', 'Web Development', 'Backend & Admin Panels', 'PHP', 'Python', 'Remote'],
    liveUrl: null,
    liveLabel: null
  }
];

export default function EngineeringJourney() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [mobileExpandedId, setMobileExpandedId] = useState('the-beginning-2023');

  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);

  const activeItem = cinematicJourneyData[activeIndex];

  // Navigate to index and center the milestone
  const navigateTo = useCallback((index) => {
    if (index < 0 || index >= cinematicJourneyData.length) return;
    setActiveIndex(index);

    if (viewportRef.current) {
      const milestoneWidth = 380; // approximate width + gap per milestone
      const targetScroll = index * milestoneWidth - viewportRef.current.clientWidth / 2 + milestoneWidth / 2;
      viewportRef.current.scrollTo({
        left: Math.max(0, targetScroll),
        behavior: 'smooth'
      });
    }
  }, []);

  const handlePrev = useCallback(() => {
    if (activeIndex > 0) navigateTo(activeIndex - 1);
  }, [activeIndex, navigateTo]);

  const handleNext = useCallback(() => {
    if (activeIndex < cinematicJourneyData.length - 1) navigateTo(activeIndex + 1);
  }, [activeIndex, navigateTo]);

  // Keyboard navigation (ArrowLeft / ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext]);

  // Mouse Drag Scrolling for Desktop Track
  const handleMouseDown = (e) => {
    if (!viewportRef.current) return;
    isDragging.current = true;
    startX.current = e.pageX - viewportRef.current.offsetLeft;
    scrollLeftStart.current = viewportRef.current.scrollLeft;
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current || !viewportRef.current) return;
    e.preventDefault();
    const x = e.pageX - viewportRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    viewportRef.current.scrollLeft = scrollLeftStart.current - walk;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  // Toggle mobile accordion
  const toggleMobileExpand = (id) => {
    setMobileExpandedId(mobileExpandedId === id ? null : id);
  };

  return (
    <section
      id="journey"
      className="relative text-left bg-[#080A12] text-white overflow-visible lg:overflow-hidden select-none border-t border-[#171A25]"
    >
      {/* ══════════════════════════════════════════════════════════════
          1. DESKTOP CINEMATIC HORIZONTAL TIMELINE (Strictly lg: and up)
          Authentic Apple Liquid Glass: WebGL refraction, optical depth,
          specular reflections, and continuous central energy beam.
          ══════════════════════════════════════════════════════════════ */}
      <LiquidGlassContainer
        className="hidden lg:block relative pt-20 pb-10 px-6 min-h-[840px] h-[95vh] max-h-[960px] flex flex-col justify-between"
        defaultConfig={journeyGlassDefaults}
      >
        {/* Cinematic Atmospheric Space Lighting */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[700px] h-[350px] bg-white/[0.03] blur-[180px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[600px] h-[300px] bg-[#171A25]/50 blur-[180px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[250px] bg-[#222633]/40 blur-[170px] pointer-events-none" />

        {/* Top Header HUD Floating Glass Capsule */}
        <header className="relative z-30 flex items-center justify-between max-w-7xl mx-auto w-full px-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#171A25]/90 border border-white/20 flex items-center justify-center text-white shadow-lg backdrop-blur-xl">
              <Compass className="w-5 h-5 animate-[spin_16s_linear_infinite]" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-white font-sans">
                Engineering <span className="bg-gradient-to-r from-white via-[#C6CBD6] to-[#747B8B] bg-clip-text text-transparent">Journey</span>
              </h2>
            </div>
          </div>

          {/* Quick HUD Navigation & Active Chapter Display */}
          <div className="flex items-center gap-4">
            <LiquidGlassElement
              as="div"
              config={{
                blurAmount: 0.15,
                refraction: 0.5,
                cornerRadius: 999,
                zRadius: 18,
                specular: 0.25,
                edgeHighlight: 0.25,
              }}
              className="flex items-center gap-2.5 text-xs font-mono text-slate-200 apple-glass-pill px-4 py-2 rounded-full border border-white/20 shadow-lg"
            >
              <div className="apple-specular-glare" />
              <span className="w-2 h-2 rounded-full animate-pulse bg-white shadow-[0_0_8px_#ffffff]" />
              <span className="text-white font-bold">{activeItem.title}</span>
              <span className="text-slate-500">•</span>
              <span className="font-semibold text-[#C6CBD6]">
                {activeItem.dateLabel}
              </span>
            </LiquidGlassElement>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrev}
                disabled={activeIndex === 0}
                aria-label="Previous milestone"
                className="p-2.5 rounded-full apple-glass-btn text-white disabled:opacity-25 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                disabled={activeIndex === cinematicJourneyData.length - 1}
                aria-label="Next milestone"
                className="p-2.5 rounded-full apple-glass-btn text-white disabled:opacity-25 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* ──────────────────────────────────────────────────────────
            THE PANORAMIC TIMELINE STAGE WITH LUMINOUS ENERGY BEAM
            ────────────────────────────────────────────────────────── */}
        <div
          ref={viewportRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="relative flex-1 flex items-center overflow-x-auto overflow-y-hidden cursor-grab active:cursor-grabbing scrollbar-none my-auto w-full select-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* THE CONTINUOUS HORIZONTAL ENERGY BEAM (Full Track Width) */}
          <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 min-w-[3600px] h-[4px] pointer-events-none z-10">
            {/* Luminous Outer Volumetric Flare Aura */}
            <div
              className="absolute inset-0 blur-[8px] opacity-85"
              style={{
                background: 'linear-gradient(90deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0.15) 100%)'
              }}
            />
            {/* Specular Dispersion Aura */}
            <div
              className="absolute -inset-y-1 inset-x-0 blur-[3px] opacity-90"
              style={{
                background: 'linear-gradient(90deg, rgba(198,203,214,0.3) 0%, rgba(255,255,255,0.95) 50%, rgba(198,203,214,0.3) 100%)'
              }}
            />
            {/* Core Ultra-Bright Laser Filament */}
            <div className="absolute inset-y-0.5 inset-x-0 bg-white shadow-[0_0_12px_#ffffff,0_0_24px_rgba(255,255,255,0.6)]" />
          </div>

          {/* Horizontally Navigable Track of Alternating Milestones */}
          <div
            ref={trackRef}
            className="flex items-center min-w-max px-24 py-10 relative z-20 gap-16 md:gap-24"
          >
            {cinematicJourneyData.map((item, idx) => {
              const isAbove = item.position === 'above';
              const isActive = activeIndex === idx;

              return (
                <div
                  key={item.id}
                  className="relative flex flex-col items-center justify-center shrink-0 w-[340px] md:w-[380px]"
                  style={{ height: '580px' }}
                >
                  {/* ──────────────────────────────────────────────────
                      ABOVE THE BEAM SLOT (Odd Index Items)
                      Glass Plaque -> Optical Connector Beam -> Beam Node
                      ────────────────────────────────────────────────── */}
                  {isAbove ? (
                    <div className="flex flex-col items-center justify-end pb-3 h-[270px] w-full">
                      {/* Milestone Apple Liquid Glass Plaque */}
                      <LiquidGlassElement
                        as="div"
                        onClick={() => navigateTo(idx)}
                        config={{
                          blurAmount: 0.16,
                          refraction: isActive ? 0.65 : 0.45,
                          chromAberration: 0.04,
                          edgeHighlight: isActive ? 0.45 : 0.22,
                          specular: isActive ? 0.35 : 0.18,
                          fresnel: 1.2,
                          cornerRadius: 22,
                          zRadius: 18,
                          shadowOpacity: isActive ? 0.5 : 0.3,
                          shadowSpread: isActive ? 26 : 16,
                          shadowOffsetY: 6,
                        }}
                        className={`w-[320px] md:w-[350px] p-4 sm:p-5 rounded-2xl apple-glass-pill transition-all duration-300 cursor-pointer transform-gpu relative group overflow-hidden ${
                          isActive
                            ? 'scale-105 border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_25px_rgba(255,255,255,0.15)] ring-1 ring-white/30'
                            : 'opacity-75 hover:opacity-100 hover:scale-[1.02] border-white/15 hover:border-white/30 shadow-[0_15px_35px_rgba(0,0,0,0.7)]'
                        }`}
                      >
                        {/* Apple Liquid Glass Specular Glare along top/curvature */}
                        <div className="apple-specular-glare" />

                        {/* Prismatic edge highlight */}
                        <div className="apple-glass-edge absolute inset-0 pointer-events-none rounded-2xl" />

                        {/* Ambient Optical Light Injection from Central Beam */}
                        <div
                          className={`absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white/[0.08] to-transparent pointer-events-none transition-opacity duration-300 ${
                            isActive ? 'opacity-100' : 'opacity-40'
                          }`}
                        />

                        {/* Card Content Header: Phase Eyebrow & Frosted Date Pill */}
                        <div className="flex items-center justify-between gap-2 mb-2.5 relative z-10">
                          <span className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-[#C6CBD6] flex items-center gap-1.5 truncate">
                            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white animate-pulse' : 'bg-[#747B8B]'}`} />
                            {item.eyebrow}
                          </span>
                          <span className={`text-[10px] font-mono font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border transition-all ${
                            isActive
                              ? 'bg-white text-black border-white shadow-sm font-black'
                              : 'bg-[#171A25]/90 text-[#C6CBD6] border-white/15'
                          }`}>
                            {item.dateLabel}
                          </span>
                        </div>

                        {/* Center Cinematic Title */}
                        <div className="space-y-1 relative z-10">
                          <h3 className={`text-base md:text-lg font-black font-sans tracking-tight uppercase leading-snug bg-clip-text text-transparent bg-gradient-to-r ${item.titleStyle}`}>
                            {item.title}
                          </h3>
                          <div className="text-[11px] font-mono font-semibold text-slate-300 tracking-wide line-clamp-1">
                            {item.subtitle}
                          </div>
                        </div>

                        {/* Organization & Role Bar */}
                        <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-white/10 relative z-10 text-[11px] font-mono">
                          <span className="text-slate-400 truncate max-w-[65%]">
                            {item.organization}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-md border ${
                            isActive ? 'bg-white/15 border-white/30 text-white font-bold' : 'bg-[#171A25] border-white/10 text-slate-400'
                          }`}>
                            {item.role}
                          </span>
                        </div>
                      </LiquidGlassElement>

                      {/* Optical Precision Connector Beam */}
                      <div className="relative flex flex-col items-center justify-center h-10 w-full z-10">
                        <div
                          className="w-[2px] h-full transition-all duration-300"
                          style={{
                            background: isActive
                              ? 'linear-gradient(to bottom, rgba(255,255,255,0.4) 0%, #FFFFFF 100%)'
                              : 'linear-gradient(to bottom, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.5) 100%)',
                            boxShadow: isActive ? '0 0 10px rgba(255,255,255,0.8), 0 0 20px rgba(255,255,255,0.4)' : 'none'
                          }}
                        />
                        <div
                          className={`w-1.5 h-1.5 rounded-full absolute bottom-0 transition-all duration-300 ${
                            isActive ? 'bg-white shadow-[0_0_8px_#ffffff] scale-125' : 'bg-white/40'
                          }`}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="h-[270px]" />
                  )}

                  {/* ──────────────────────────────────────────────────
                      CENTRAL TIMELINE NODE (Sitting right on the beam)
                      Optical Lens Orb with Liquid Glass Refraction
                      ────────────────────────────────────────────────── */}
                  <LiquidGlassElement
                    as="div"
                    config={{
                      blurAmount: 0.12,
                      refraction: 0.75,
                      chromAberration: 0.05,
                      edgeHighlight: 0.4,
                      specular: 0.45,
                      fresnel: 1.3,
                      cornerRadius: 999,
                      zRadius: 18,
                      shadowOpacity: 0.45,
                      shadowSpread: 16,
                      shadowOffsetY: 0,
                    }}
                    className="relative z-30 my-[-16px]"
                  >
                    <button
                      onClick={() => navigateTo(idx)}
                      className={`relative group w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 focus:outline-none cursor-pointer ${
                        isActive
                          ? 'scale-125 shadow-[0_0_25px_rgba(255,255,255,0.9),0_0_50px_rgba(255,255,255,0.4)]'
                          : 'hover:scale-110 shadow-[0_0_12px_rgba(255,255,255,0.25)]'
                      }`}
                      style={{
                        backgroundColor: '#080A12',
                      }}
                      aria-label={`Jump to ${item.title}`}
                    >
                      {/* Outer Apple Liquid Glass Prismatic Ring */}
                      <div
                        className={`absolute inset-0 rounded-full border transition-all duration-300 ${
                          isActive
                            ? 'border-white ring-2 ring-white/50 shadow-[inset_0_0_10px_rgba(255,255,255,0.6)]'
                            : 'border-white/30 group-hover:border-white/60'
                        }`}
                      />

                      {/* Inner Specular Core Lens */}
                      <div
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                          isActive
                            ? 'bg-white shadow-[0_0_12px_#ffffff] scale-110 animate-pulse'
                            : 'bg-[#C6CBD6] group-hover:bg-white scale-75'
                        }`}
                      />

                      {/* Active Optical Pulse Field */}
                      {isActive && (
                        <div className="absolute -inset-2.5 rounded-full border border-white/50 animate-ping pointer-events-none" />
                      )}
                    </button>
                  </LiquidGlassElement>

                  {/* ──────────────────────────────────────────────────
                      BELOW THE BEAM SLOT (Even Index Items)
                      Beam Node -> Optical Connector Beam -> Glass Plaque
                      ────────────────────────────────────────────────── */}
                  {!isAbove ? (
                    <div className="flex flex-col items-center justify-start pt-3 h-[270px] w-full">
                      {/* Optical Precision Connector Beam */}
                      <div className="relative flex flex-col items-center justify-center h-10 w-full z-10">
                        <div
                          className={`w-1.5 h-1.5 rounded-full absolute top-0 transition-all duration-300 ${
                            isActive ? 'bg-white shadow-[0_0_8px_#ffffff] scale-125' : 'bg-white/40'
                          }`}
                        />
                        <div
                          className="w-[2px] h-full transition-all duration-300"
                          style={{
                            background: isActive
                              ? 'linear-gradient(to top, rgba(255,255,255,0.4) 0%, #FFFFFF 100%)'
                              : 'linear-gradient(to top, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.5) 100%)',
                            boxShadow: isActive ? '0 0 10px rgba(255,255,255,0.8), 0 0 20px rgba(255,255,255,0.4)' : 'none'
                          }}
                        />
                      </div>

                      {/* Milestone Apple Liquid Glass Plaque */}
                      <LiquidGlassElement
                        as="div"
                        onClick={() => navigateTo(idx)}
                        config={{
                          blurAmount: 0.16,
                          refraction: isActive ? 0.65 : 0.45,
                          chromAberration: 0.04,
                          edgeHighlight: isActive ? 0.45 : 0.22,
                          specular: isActive ? 0.35 : 0.18,
                          fresnel: 1.2,
                          cornerRadius: 22,
                          zRadius: 18,
                          shadowOpacity: isActive ? 0.5 : 0.3,
                          shadowSpread: isActive ? 26 : 16,
                          shadowOffsetY: 6,
                        }}
                        className={`w-[320px] md:w-[350px] p-4 sm:p-5 rounded-2xl apple-glass-pill transition-all duration-300 cursor-pointer transform-gpu relative group overflow-hidden ${
                          isActive
                            ? 'scale-105 border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_25px_rgba(255,255,255,0.15)] ring-1 ring-white/30'
                            : 'opacity-75 hover:opacity-100 hover:scale-[1.02] border-white/15 hover:border-white/30 shadow-[0_15px_35px_rgba(0,0,0,0.7)]'
                        }`}
                      >
                        {/* Apple Liquid Glass Specular Glare along top/curvature */}
                        <div className="apple-specular-glare" />

                        {/* Prismatic edge highlight */}
                        <div className="apple-glass-edge absolute inset-0 pointer-events-none rounded-2xl" />

                        {/* Ambient Optical Light Injection from Central Beam */}
                        <div
                          className={`absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white/[0.08] to-transparent pointer-events-none transition-opacity duration-300 ${
                            isActive ? 'opacity-100' : 'opacity-40'
                          }`}
                        />

                        {/* Card Content Header: Phase Eyebrow & Frosted Date Pill */}
                        <div className="flex items-center justify-between gap-2 mb-2.5 relative z-10">
                          <span className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-[#C6CBD6] flex items-center gap-1.5 truncate">
                            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white animate-pulse' : 'bg-[#747B8B]'}`} />
                            {item.eyebrow}
                          </span>
                          <span className={`text-[10px] font-mono font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border transition-all ${
                            isActive
                              ? 'bg-white text-black border-white shadow-sm font-black'
                              : 'bg-[#171A25]/90 text-[#C6CBD6] border-white/15'
                          }`}>
                            {item.dateLabel}
                          </span>
                        </div>

                        {/* Center Cinematic Title */}
                        <div className="space-y-1 relative z-10">
                          <h3 className={`text-base md:text-lg font-black font-sans tracking-tight uppercase leading-snug bg-clip-text text-transparent bg-gradient-to-r ${item.titleStyle}`}>
                            {item.title}
                          </h3>
                          <div className="text-[11px] font-mono font-semibold text-slate-300 tracking-wide line-clamp-1">
                            {item.subtitle}
                          </div>
                        </div>

                        {/* Organization & Role Bar */}
                        <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-white/10 relative z-10 text-[11px] font-mono">
                          <span className="text-slate-400 truncate max-w-[65%]">
                            {item.organization}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-md border ${
                            isActive ? 'bg-white/15 border-white/30 text-white font-bold' : 'bg-[#171A25] border-white/10 text-slate-400'
                          }`}>
                            {item.role}
                          </span>
                        </div>
                      </LiquidGlassElement>
                    </div>
                  ) : (
                    <div className="h-[270px]" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ──────────────────────────────────────────────────────────
            BOTTOM HUD BAR & EXPANDABLE MILESTONE DETAILS DOCK
            Floating Apple Liquid Glass Capsule
            ────────────────────────────────────────────────────────── */}
        <footer className="relative z-30 max-w-7xl mx-auto w-full px-4 pt-3 border-t border-white/10 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            {/* Chapter Progress Indicators */}
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 font-bold">
                Timeline:
              </span>
              <div className="flex items-center gap-1.5">
                {cinematicJourneyData.map((m, idx) => (
                  <button
                    key={m.id}
                    onClick={() => navigateTo(idx)}
                    aria-label={`Jump to ${m.title}`}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      activeIndex === idx
                        ? 'w-8 bg-white shadow-[0_0_12px_#ffffff]'
                        : 'w-2 bg-white/20 hover:bg-white/40'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-mono text-slate-300 ml-1">
                {String(activeIndex + 1).padStart(2, '0')} / {String(cinematicJourneyData.length).padStart(2, '0')}
              </span>
            </div>

            {/* Active Milestone Synopsis & Toggle Detail Panel */}
            <div className="hidden md:flex items-center gap-4">
              <span className="text-xs font-mono text-slate-300">
                <span className="text-white font-extrabold">{activeItem.title}:</span>{' '}
                <span className="text-slate-400">{activeItem.organization}</span>
              </span>

              <button
                onClick={() => setDetailsOpen(!detailsOpen)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full apple-glass-btn text-xs font-mono text-white transition-all shadow-sm cursor-pointer"
              >
                <Info className="w-3.5 h-3.5 text-white" />
                <span>{detailsOpen ? 'Hide Brief' : 'View Brief'}</span>
                {detailsOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Direct Jump or Action */}
            <div className="flex items-center gap-4">
              {activeItem.liveUrl && (
                <a
                  href={activeItem.liveUrl}
                  target={activeItem.liveUrl.startsWith('#') ? '_self' : '_blank'}
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-black bg-white hover:bg-[#C6CBD6] px-4 py-1.5 rounded-full border border-white transition-all shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                >
                  <span>{activeItem.liveLabel}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              )}

              <a
                href="#projects"
                className="text-xs font-mono text-slate-400 hover:text-white transition-colors"
              >
                Skip to Projects ↓
              </a>
            </div>
          </div>

          {/* Expandable Briefing Drawer with Apple Liquid Glass Plaque */}
          <AnimatePresence>
            {detailsOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <LiquidGlassElement
                  as="div"
                  config={{
                    blurAmount: 0.18,
                    refraction: 0.5,
                    cornerRadius: 24,
                    zRadius: 20,
                    specular: 0.25,
                    edgeHighlight: 0.25,
                  }}
                  className="p-5 mt-2 rounded-2xl apple-glass-pill border border-white/20 shadow-[0_25px_60px_rgba(0,0,0,0.95)] flex flex-col md:flex-row items-start justify-between gap-5 relative overflow-hidden"
                >
                  <div className="apple-specular-glare" />
                  <div className="apple-glass-edge absolute inset-0 pointer-events-none rounded-2xl" />

                  <div className="space-y-3 max-w-4xl relative z-10 w-full">
                    <div className="text-xs font-mono font-bold uppercase text-white flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      <span>{activeItem.role} • {activeItem.dateRange}{activeItem.location && ` • ${activeItem.location}`}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans font-medium">
                      {activeItem.summary}
                    </p>

                    {activeItem.highlights && activeItem.highlights.length > 0 && (
                      <div className="space-y-1.5 pt-1 text-xs text-slate-300 font-sans">
                        {activeItem.highlights.map((highlight, hIdx) => (
                          <div key={hIdx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0 mt-0.5" />
                            <span>{highlight}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {activeItem.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 text-[10px] font-mono text-[#C6CBD6]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setDetailsOpen(false)}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors self-end md:self-start relative z-10 cursor-pointer"
                    aria-label="Close brief"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </LiquidGlassElement>
              </motion.div>
            )}
          </AnimatePresence>
        </footer>
      </LiquidGlassContainer>

      {/* ══════════════════════════════════════════════════════════════
          2. MOBILE TIMELINE (Strictly < lg, Phones & Compact Tablets)
          PRESERVED STRUCTURE & LAYOUT WITH MONOCHROMATIC PALETTE
          ══════════════════════════════════════════════════════════════ */}
      <div className="block lg:hidden py-16 px-4 sm:px-6 relative bg-[#080A12] overflow-visible">
        {/* Volumetric Specular Glows */}
        <div className="absolute top-1/3 left-0 w-[500px] h-[500px] rounded-full bg-white/[0.02] blur-[130px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-0 w-[550px] h-[550px] rounded-full bg-[#171A25]/40 blur-[140px] pointer-events-none" />

        <div className="max-w-4xl mx-auto space-y-12 relative z-10">
          {/* Section Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#171A25] text-white text-xs font-mono uppercase tracking-widest border border-[#414655] shadow-md">
              <Compass className="w-4 h-4 text-white" /> Career Milestones
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight font-sans">
              Engineering <span className="text-white">Journey</span>
            </h2>
          </div>

          {/* ECS-STYLE OVERLAPPING SCROLL-DRIVEN STACKED CARDS CONTAINER */}
          <MobilePortfolioStack
            items={cinematicJourneyData}
            topOffset={76}
            cardSpacing={32}
            cardHeight={500}
            renderCard={(item, index, { stepNumber, totalNumber, isLast }) => {
              const isCurrent = isLast;

              return (
                <div
                  className="relative w-full h-full flex flex-col justify-between rounded-3xl bg-[#0D101A] border border-white/20 p-5 sm:p-6 shadow-[0_-20px_50px_rgba(0,0,0,0.95),0_15px_35px_rgba(0,0,0,0.85)] backdrop-blur-2xl overflow-hidden transition-all duration-300"
                >
                  {/* Apple Liquid Glass Specular Glare along upper rim */}
                  <div className="apple-specular-glare" />
                  <div className="apple-glass-edge absolute inset-0 pointer-events-none rounded-3xl" />

                  {/* Ambient Light Wash from top */}
                  <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white/[0.06] to-transparent pointer-events-none" />

                  <div className="space-y-3 relative z-10">
                    {/* Top Bar: Eyebrow, Step Counter, Frosted Date Pill */}
                    <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-[#C6CBD6] flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${isCurrent ? 'bg-white animate-pulse' : 'bg-slate-400'}`} />
                          {item.eyebrow}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-slate-400">
                          {stepNumber} / {totalNumber}
                        </span>
                        <span className={`text-[10px] font-mono font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                          isCurrent
                            ? 'bg-white text-black border-white shadow-sm'
                            : 'bg-[#171A25] text-white border-white/15'
                        }`}>
                          {item.dateLabel}
                        </span>
                      </div>
                    </div>

                    {/* Milestone Title & Subtitle */}
                    <div className="space-y-1">
                      <h3 className={`text-lg sm:text-xl font-black font-sans tracking-tight uppercase leading-snug bg-clip-text text-transparent bg-gradient-to-r ${item.titleStyle || 'from-white via-[#C6CBD6] to-[#747B8B]'}`}>
                        {item.title}
                      </h3>
                      <div className="text-xs font-mono font-semibold text-slate-300 tracking-wide line-clamp-1">
                        {item.subtitle}
                      </div>
                    </div>

                    {/* Organization & Role Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-2 py-1.5 px-3 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Building2 className="w-3.5 h-3.5 text-white" />
                        <span className="font-semibold text-white">{item.organization}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {item.location && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-slate-300 font-mono">
                            {item.location}
                          </span>
                        )}
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#171A25] border border-white/15 text-slate-200 font-bold">
                          {item.role}
                        </span>
                      </div>
                    </div>

                    {/* Summary */}
                    <p className="text-xs text-slate-300 leading-relaxed font-sans line-clamp-2">
                      {item.summary}
                    </p>

                    {/* Key Highlights */}
                    {item.highlights && item.highlights.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                          Key Deliverables:
                        </div>
                        <div className="space-y-1 text-xs text-slate-300">
                          {item.highlights.slice(0, 2).map((bullet, bIdx) => (
                            <div key={bIdx} className="flex items-start gap-2 leading-snug">
                              <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0 text-white" />
                              <span className="line-clamp-2">{bullet}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Tech Tags & Optional Action */}
                  <div className="pt-2.5 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 relative z-10 mt-auto">
                    <div className="flex flex-wrap gap-1.5">
                      {(item.tags || []).slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 rounded-md bg-[#171A25] border border-white/10 text-[10px] font-mono text-slate-300 font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {item.liveUrl && (
                      <a
                        href={item.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-black font-extrabold text-[11px] font-mono hover:bg-slate-200 transition-colors shadow-sm ml-auto"
                      >
                        <span>{item.liveLabel || 'Visit Platform'}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              );
            }}
          />

          {/* Mobile Timeline End Banner */}
          <div className="p-6 rounded-3xl bg-[#171A25]/90 border border-white/15 text-center space-y-3 shadow-lg relative overflow-hidden backdrop-blur-xl mt-12">
            <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mx-auto text-white shadow-md">
              <Rocket className="w-5 h-5 animate-bounce" />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-widest text-slate-300 font-bold">
                NEXT CHAPTER IN PROGRESS
              </span>
              <h3 className="text-xl font-extrabold text-white">
                Full Stack Developer & Software Engineer
              </h3>
              <p className="text-slate-300 text-xs font-mono max-w-sm mx-auto">
                Open for full-time software engineering roles, internships, and development opportunities.
              </p>
            </div>

            <div className="pt-2">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black font-extrabold text-xs hover:bg-slate-200 transition-all shadow-md"
              >
                <span>Get in Touch</span>
                <Sparkles className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
