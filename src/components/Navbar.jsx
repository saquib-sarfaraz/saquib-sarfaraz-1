import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Search, Menu, X, FileText, Film } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa6';
import { profileData } from '../content/profile';
import { LiquidGlassContainer, LiquidGlassElement } from './liquidglass';

export default function Navbar({ onOpenCommandPalette, onOpenPlayZone, onOpenAISearch, onOpenInCampusInBuzz, onOpenInCampusReels }) {
  const shouldReduceMotion = useReducedMotion();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const menuRef = useRef(null);

  useEffect(() => {
    const sections = ['workspace', 'about', 'experience', 'leadership', 'projects', 'skills', 'contact'];
    let lastY = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      setIsScrolled(currentY > 40);
      setIsScrollingDown(currentY > lastY && currentY > 100);
      lastY = currentY;

      const viewportHeight = window.innerHeight;
      const scrollPosition = currentY + viewportHeight * 0.35;

      let currentSection = sections[0];

      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top - 100) {
            currentSection = id;
          }
        }
      }

      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'workspace', label: 'Workspace' },
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'leadership', label: 'Leadership' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'playzone', label: '🎮 Play Zone', isModal: true },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    const el = document.getElementById(targetId);
    if (!el) return;

    if (window.lenis) {
      window.lenis.scrollTo(el, { offset: -60, duration: 1.2 });
    } else {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Close on Escape or click outside; keep page background sharp
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };

    const handlePointerDown = (e) => {
      if (menuRef.current && menuRef.current.contains(e.target)) return;
      const toggleBtn = e.target.closest('button[aria-label="Toggle Navigation Menu"]');
      if (toggleBtn) return;
      setMobileMenuOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerdown', handlePointerDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [mobileMenuOpen]);

  // Close mobile drawer on desktop resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-3 sm:p-4 pointer-events-none transition-all duration-300">
      <div className="w-full max-w-6xl mx-auto relative pointer-events-auto">
        {/* Floating Apple Liquid Glass Navigation Capsule */}
        <nav
          aria-label="Main Navigation"
          className={`w-full rounded-full apple-glass-pill apple-glass-edge transition-all duration-300 transform-gpu relative z-20 overflow-hidden backdrop-blur-2xl ${
            isScrollingDown
              ? 'py-1.5 px-3 sm:px-5 scale-[0.98]'
              : isScrolled
              ? 'py-2 px-4 sm:px-6 scale-100'
              : 'py-2.5 px-4 sm:px-6 scale-100'
          } flex items-center justify-between`}
        >
          {/* Subtle Specular Glare along top curve */}
          <div className="apple-specular-glare" />

          {/* Brand / Logo */}
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, 'hero')}
            className="flex items-center gap-2.5 font-mono group relative z-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-full shrink-0"
            aria-label="Saquib OS Home"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#171A25] via-[#414655] to-white/70 flex items-center justify-center text-white font-bold text-xs shadow-md border border-white/30 shrink-0">
              S
            </div>
            <span className="font-extrabold text-sm text-white tracking-tight group-hover:text-white transition-colors drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              {profileData.osName} <span className="text-xs text-[#C6CBD6] font-mono font-normal ml-0.5">{profileData.osVersion}</span>
            </span>
          </a>

          {/* Desktop Nav Items */}
          <div
            className="hidden lg:flex items-center gap-1 font-mono text-xs text-slate-200 relative z-10"
          >
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              if (link.isModal) {
                return (
                  <button
                    key={link.id}
                    onClick={onOpenPlayZone}
                    className="px-3 py-1.5 rounded-full text-[#F5F6FA] hover:text-white font-bold transition-all apple-glass-btn cursor-pointer shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    {link.label}
                  </button>
                );
              }

              return (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(e) => handleNavClick(e, link.id)}
                  className={`px-3 py-1.5 rounded-full transition-all relative focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                    isActive ? 'text-white font-bold' : 'hover:text-white text-[#C6CBD6]'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activePill"
                      className="absolute inset-0 rounded-full optical-active-pill -z-10"
                      transition={{ type: 'spring', duration: 0.5 }}
                    />
                  )}
                  <span>{link.label}</span>
                </a>
              );
            })}
          </div>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-2 relative z-10 shrink-0">
            {/* AI Search Dedicated Glass Button */}
            <button
              onClick={onOpenAISearch}
              className="p-2 sm:px-3.5 sm:py-1.5 rounded-full apple-glass-btn text-white hover:text-white text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white shadow-sm"
              title="AI Search"
              aria-label="Open AI Search"
            >
              <Search className="w-3.5 h-3.5 text-white" />
              <span className="hidden sm:inline">AI Search</span>
            </button>

            {/* Resume CTA Button (Desktop) */}
            <a
              href={profileData.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex px-3.5 sm:px-4 py-1.5 rounded-full apple-glass-btn !bg-white/95 !text-black hover:!bg-white font-extrabold text-xs transition-all items-center gap-1.5 shadow-[0_4px_16px_rgba(255,255,255,0.25)] hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Resume</span>
            </a>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-full apple-glass-btn text-slate-200 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
              aria-label="Toggle Navigation Menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile Glass Slide-in Drawer Attached Directly Beneath the Navbar (Sharp Background) */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              ref={menuRef}
              role="dialog"
              aria-modal="true"
              aria-label="Mobile Navigation Menu"
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -12 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: {
                  duration: shouldReduceMotion ? 0.15 : 0.35,
                  ease: [0.16, 1, 0.3, 1],
                },
              }}
              exit={{
                opacity: 0,
                y: shouldReduceMotion ? 0 : -12,
                transition: {
                  duration: shouldReduceMotion ? 0.1 : 0.22,
                  ease: [0.32, 0, 0.67, 0],
                },
              }}
              className="saquib-os-navigation lg:hidden p-4 rounded-3xl optical-dropdown apple-glass-edge text-left space-y-3 font-mono text-sm shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-2xl"
            >
              <div className="apple-specular-glare" />

              {/* Panel Header */}
              <div className="flex items-center justify-between border-b border-white/15 pb-2.5 relative z-10 w-full min-w-0">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#171A25] via-[#414655] to-white/70 flex items-center justify-center text-white font-bold text-[10px] shadow-sm border border-white/30 shrink-0">
                    S
                  </div>
                  <span className="text-xs text-white font-extrabold tracking-wider uppercase truncate">
                    {profileData.osName} Navigation
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0 ml-2"
                  aria-label="Close navigation"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Primary Actions (Full Width) */}
              <div className="space-y-2 relative z-10 w-full min-w-0">
                {/* AI Search Action */}
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAISearch();
                  }}
                  className="w-full min-w-0 box-border px-3.5 py-2.5 min-h-[44px] rounded-xl glass-nested-child text-white hover:text-white transition-all font-bold text-xs flex items-center justify-between cursor-pointer border border-white/10 hover:border-white/20 active:scale-[0.99] shadow-sm"
                >
                  <span className="flex items-center gap-2.5 min-w-0">
                    <Search className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="truncate">AI Search</span>
                  </span>
                  <span className="text-[10px] text-slate-400 shrink-0 ml-2">Open Workspace →</span>
                </button>

                {/* Play Zone Action */}
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenPlayZone();
                  }}
                  className="w-full min-w-0 box-border px-3.5 py-2.5 min-h-[44px] rounded-xl glass-nested-child text-white hover:text-white transition-all font-bold text-xs flex items-center justify-between cursor-pointer border border-white/10 hover:border-white/20 active:scale-[0.99]"
                >
                  <span className="flex items-center gap-2.5 min-w-0">
                    <span className="text-sm shrink-0">🎮</span>
                    <span className="truncate">Play Zone</span>
                  </span>
                  <span className="text-[10px] text-slate-400 shrink-0 ml-2">Launch App →</span>
                </button>

                {/* InCampus InBuzz Action (Mobile Only) */}
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    (onOpenInCampusInBuzz || onOpenInCampusReels)?.();
                  }}
                  className="w-full min-w-0 box-border px-3.5 py-2.5 min-h-[44px] rounded-xl glass-nested-child text-white hover:text-white transition-all font-bold text-xs flex items-center justify-between cursor-pointer border border-white/10 hover:border-white/20 active:scale-[0.99] shadow-sm"
                >
                  <span className="flex items-center gap-2.5 min-w-0">
                    <Film className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="truncate">InCampus InBuzz</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold shrink-0 ml-2">Watch InBuzz →</span>
                </button>
              </div>

              {/* Two-Column Compact Navigation Grid */}
              <div className="mobile-navigation-grid pt-1 relative z-10">
                {navLinks
                  .filter((link) => !link.isModal)
                  .map((link, index, arr) => {
                    const isActive = activeSection === link.id;
                    const isLastOdd = index === arr.length - 1 && arr.length % 2 === 1;

                    return (
                      <a
                        key={link.id}
                        href={`#${link.id}`}
                        onClick={(e) => handleNavClick(e, link.id)}
                        className={`min-w-0 box-border px-3 py-2.5 min-h-[44px] rounded-xl glass-nested-child transition-all font-medium text-xs flex items-center justify-between border active:scale-[0.99] ${
                          isLastOdd ? 'col-span-2' : ''
                        } ${
                          isActive
                            ? 'text-white border-[#2563EB]/60 bg-[#2563EB]/20 font-bold shadow-[0_0_12px_rgba(37,99,235,0.25)]'
                            : 'text-slate-200 hover:text-white border-white/10 hover:border-white/20'
                        }`}
                      >
                        <span className="truncate">{link.label}</span>
                        <span className={`text-[10px] shrink-0 ml-1.5 ${isActive ? 'text-cyan-400 font-bold' : 'text-slate-400'}`}>
                          →
                        </span>
                      </a>
                    );
                  })}
              </div>

              {/* Compact Action Footer: GitHub · LinkedIn · Resume */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-1.5 text-xs relative z-10 w-full min-w-0">
                <a
                  href={profileData.socials.github}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 min-w-0 min-h-[40px] px-2 rounded-xl glass-nested-child flex items-center justify-center gap-1.5 text-slate-200 hover:text-white border border-white/10 hover:border-white/20 transition-colors"
                  title="GitHub Profile"
                >
                  <FaGithub className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-[11px] font-mono truncate">GitHub</span>
                </a>
                <a
                  href={profileData.socials.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 min-w-0 min-h-[40px] px-2 rounded-xl glass-nested-child flex items-center justify-center gap-1.5 text-slate-200 hover:text-white border border-white/10 hover:border-white/20 transition-colors"
                  title="LinkedIn Profile"
                >
                  <FaLinkedin className="w-3.5 h-3.5 text-[#0A66C2] shrink-0" />
                  <span className="text-[11px] font-mono truncate">LinkedIn</span>
                </a>
                <a
                  href={profileData.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 min-w-0 min-h-[40px] px-2 rounded-xl apple-glass-btn !bg-white/95 !text-black hover:!bg-white font-extrabold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                  title="Download Resume"
                >
                  <FileText className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-[11px] font-mono truncate">Resume</span>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
