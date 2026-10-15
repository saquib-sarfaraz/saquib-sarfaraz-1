import { useState, useEffect, lazy, Suspense } from 'react';
import Lenis from 'lenis';
import { ThemeProvider } from './context/ThemeContext';
import BootScreen from './components/BootScreen';
import CustomCursor from './components/CustomCursor';
import AuroraBackground from './components/AuroraBackground';
import ScrollProgress from './components/ScrollProgress';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Code-split heavy interactive modals and sub-routes
const CommandPalette = lazy(() => import('./components/CommandPalette'));
const PlayZoneModal = lazy(() => import('./components/PlayZoneModal'));
const InBuzzPage = lazy(() => import('./components/incampus/InBuzzPage'));
const AIPage = lazy(() => import('./ai/pages/AIPage'));

import Hero from './sections/Hero';
import WorkspaceSection from './sections/WorkspaceSection';
import AboutMe from './sections/AboutMe';
import EngineeringJourney from './sections/EngineeringJourney';
import ArchitectureSection from './sections/ArchitectureSection';
import CurrentlyBuilding from './sections/CurrentlyBuilding';
import Skills from './sections/Skills';
import SelectedImpact from './sections/SelectedImpact';
import Experience from './sections/Experience';
import Projects from './sections/Projects';
import SocialProof from './sections/SocialProof';
import Contact from './sections/Contact';

export default function App() {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isPlayZoneOpen, setIsPlayZoneOpen] = useState(false);
  const [isAISearchOpen, setIsAISearchOpen] = useState(false);
  const [isInBuzzOpen, setIsInBuzzOpen] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);

  // Session-based boot sequence display policy
  const [showBootScreen, setShowBootScreen] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('boot') === 'true' || params.get('replay') === 'true') {
        return true;
      }
      return !sessionStorage.getItem('saquib_os_booted');
    }
    return true;
  });

  // Expose replay helper for development and interactive testing
  useEffect(() => {
    window.__replayBoot = () => {
      sessionStorage.removeItem('saquib_os_booted');
      setShowBootScreen(true);
    };
  }, []);

  const handleBootComplete = () => {
    setShowBootScreen(false);
    sessionStorage.setItem('saquib_os_booted', 'true');
    document.body.style.overflow = '';
    if (window.lenis) {
      window.lenis.start();
    }
  };

  // Sync /ai, /inbuzz, and root routes with state cleanly without hash tags
  useEffect(() => {
    const syncRouteAndTitle = () => {
      const path = window.location.pathname;
      const isAI = path === '/ai';
      const isInBuzz = path === '/inbuzz';
      const isHome = path === '/' || path.startsWith('/#');

      setIsAISearchOpen(isAI);
      setIsInBuzzOpen(isInBuzz);
      setIsNotFound(!isAI && !isInBuzz && !isHome);

      if (isInBuzz) {
        document.title = 'InCampus InBuzz | Saquib Sarfaraz';
      } else if (isAI) {
        document.title = 'AI Search Workspace | Saquib Sarfaraz';
      } else if (!isHome) {
        document.title = '404 - Not Found | Saquib Sarfaraz';
      } else {
        document.title = 'Saquib Sarfaraz | Full Stack Developer';
      }
    };

    syncRouteAndTitle();

    window.addEventListener('popstate', syncRouteAndTitle);
    return () => window.removeEventListener('popstate', syncRouteAndTitle);
  }, []);

  const openAISearch = () => {
    setIsAISearchOpen(true);
    setIsInBuzzOpen(false);
    setIsNotFound(false);
    document.title = 'AI Search Workspace | Saquib Sarfaraz';
    window.history.pushState({ page: 'ai' }, 'AI Search Workspace | Saquib Sarfaraz', '/ai');
  };

  const closeAISearch = () => {
    setIsAISearchOpen(false);
    document.title = 'Saquib Sarfaraz | Full Stack Developer';
    if (window.location.pathname === '/ai') {
      window.history.pushState({ page: 'home' }, 'Saquib Sarfaraz | Full Stack Developer', '/');
    }
  };

  const openInBuzz = () => {
    setIsInBuzzOpen(true);
    setIsAISearchOpen(false);
    setIsNotFound(false);
    document.title = 'InCampus InBuzz | Saquib Sarfaraz';
    window.history.pushState({ page: 'inbuzz' }, 'InCampus InBuzz | Saquib Sarfaraz', '/inbuzz');
  };

  const closeInBuzz = () => {
    setIsInBuzzOpen(false);
    document.title = 'Saquib Sarfaraz | Full Stack Developer';
    if (window.location.pathname === '/inbuzz') {
      window.history.pushState({ page: 'home' }, 'Saquib Sarfaraz | Full Stack Developer', '/');
    }
  };

  // Live OS Action Controller (triggered by AI Search recommendations)
  const handleOSAction = (action) => {
    if (!action) return;

    if (action.type === 'scroll' && action.target) {
      closeAISearch();
      setTimeout(() => {
        const el = document.getElementById(action.target);
        if (el) {
          if (window.lenis) {
            window.lenis.scrollTo(el, { offset: -60, duration: 1.2 });
          } else {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }, 150);
    } else if (action.type === 'playzone') {
      closeAISearch();
      setTimeout(() => {
        setIsPlayZoneOpen(true);
      }, 150);
    } else if (action.type === 'project') {
      closeAISearch();
      setTimeout(() => {
        const projectsEl = document.getElementById('projects');
        if (projectsEl) {
          if (window.lenis) {
            window.lenis.scrollTo(projectsEl, { offset: -60, duration: 1.2 });
          } else {
            projectsEl.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }, 150);
    } else if (action.type === 'resume') {
      window.open(action.url || '/Saquib_Sarfaraz_FullStack_Resume.pdf', '_blank');
    } else if (action.type === 'live' || action.type === 'github' || action.type === 'external') {
      if (action.url) {
        window.open(action.url, '_blank');
      }
    }
  };

  useEffect(() => {
    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Initialize Lenis weighted smooth scroll inertia optimized for mobile & desktop
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      infinite: false,
    });

    window.lenis = lenis;

    // Pause Lenis while boot sequence is running
    if (showBootScreen) {
      lenis.stop();
    }

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      if (window.lenis === lenis) {
        window.lenis = null;
      }
      lenis.destroy();
    };
  }, [showBootScreen]);

  if (isNotFound) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-[#080A12] text-white flex flex-col items-center justify-center p-6 text-center select-none relative overflow-hidden">
          <AuroraBackground />
          <div className="relative z-10 w-full max-w-md p-8 rounded-3xl apple-glass-pill border border-white/20 shadow-2xl space-y-6">
            <div className="text-5xl font-mono font-black text-white">404</div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white tracking-tight">Endpoint Not Found</h2>
              <p className="text-xs font-mono text-slate-400">
                The requested protocol route does not exist on SAQUIB OS.
              </p>
            </div>
            <button
              onClick={() => {
                window.history.pushState({ page: 'home' }, 'Saquib Sarfaraz | Full Stack Developer', '/');
                setIsNotFound(false);
                setIsAISearchOpen(false);
                setIsInBuzzOpen(false);
                document.title = 'Saquib Sarfaraz | Full Stack Developer';
              }}
              className="px-6 py-2.5 rounded-full bg-white text-black font-mono text-xs font-bold hover:bg-[#C6CBD6] transition-all cursor-pointer shadow-lg active:scale-95"
            >
              Return to System Root
            </button>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  if (isInBuzzOpen) {
    return (
      <ThemeProvider>
        <Suspense fallback={<div className="min-h-screen bg-[#080A12]" />}>
          <InBuzzPage onBack={closeInBuzz} />
        </Suspense>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className="relative min-h-screen selection:bg-white/20 selection:text-white font-sans antialiased overflow-x-clip transition-colors duration-700">
        {/* Full-Screen AI Search Workspace View (/ai) */}
        {isAISearchOpen && (
          <Suspense fallback={<div className="fixed inset-0 bg-[#080A12]/90 z-50" />}>
            <AIPage
              onClose={closeAISearch}
              onTriggerOSAction={handleOSAction}
            />
          </Suspense>
        )}

        {/* Scroll Progress Bar */}
        <ScrollProgress />

        {/* Background Mesh */}
        <AuroraBackground />

        {/* SAQUIB OS Cinematic Boot Screen */}
        {showBootScreen && (
          <BootScreen onComplete={handleBootComplete} />
        )}

        {/* Custom Spring Cursor */}
        <CustomCursor />

        {/* Command Palette (⌘K) */}
        <Suspense fallback={null}>
          <CommandPalette
            isOpen={isCommandPaletteOpen}
            onClose={() => setIsCommandPaletteOpen(false)}
            onOpenAISearch={openAISearch}
            onReplayBoot={() => setShowBootScreen(true)}
          />
        </Suspense>

        {/* Play Zone Application Window */}
        <Suspense fallback={null}>
          <PlayZoneModal
            isOpen={isPlayZoneOpen}
            onClose={() => setIsPlayZoneOpen(false)}
          />
        </Suspense>

        {/* Navbar */}
        <Navbar
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onOpenPlayZone={() => setIsPlayZoneOpen(true)}
          onOpenAISearch={openAISearch}
          onOpenInCampusInBuzz={openInBuzz}
          onOpenInCampusReels={openInBuzz}
        />

        {/* Main OS Viewport */}
        <main>
          <Hero />
          <WorkspaceSection />
          <AboutMe />
          <EngineeringJourney />
          <Projects />
          <ArchitectureSection />
          <CurrentlyBuilding />
          <Skills />
          <Experience />
          <SelectedImpact />
          <SocialProof />
          <Contact />
        </main>

        {/* Footer */}
        <Footer
          onOpenInCampusInBuzz={openInBuzz}
          onOpenInCampusReels={openInBuzz}
        />
      </div>
    </ThemeProvider>
  );
}
