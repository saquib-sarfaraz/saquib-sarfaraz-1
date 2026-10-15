import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ChevronUp,
  ChevronDown,
  RefreshCw,
  AlertCircle,
  ExternalLink,
  Share2,
  Check,
  Menu,
  X
} from 'lucide-react';
import InCampusReelCard from './InCampusReelCard';
import { inCampusInBuzzClient } from '../../services/incampusReelsApi';

export default function InBuzzPage({ onBack }) {
  const containerRef = useRef(null);
  const menuDropdownRef = useRef(null);
  const [reels, setReels] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const [globalMuted, setGlobalMuted] = useState(true);
  const [shareCopied, setShareCopied] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const abortControllerRef = useRef(null);
  const isWheelThrottled = useRef(false);
  const isProgrammaticScroll = useRef(false);

  // Synchronize document title and body scroll lock
  useEffect(() => {
    const prevTitle = document.title;
    document.title = 'InCampus InBuzz | Saquib Sarfaraz';

    if (window.lenis) {
      window.lenis.stop();
    }
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.title = prevTitle;
      document.body.style.overflow = prevOverflow;
      if (window.lenis) {
        window.lenis.start();
      }
    };
  }, []);

  // Close menu dropdown on outside click or Escape
  useEffect(() => {
    if (!isMenuOpen) return;

    const handlePointerDown = (e) => {
      if (menuDropdownRef.current && !menuDropdownRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  // Back button handler
  const handleBack = useCallback(() => {
    if (onBack) {
      onBack();
    } else {
      window.history.pushState({ page: 'home' }, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  }, [onBack]);

  // Global mute coordinator
  const handleGlobalMutedChange = useCallback((nextMuted) => {
    setGlobalMuted(nextMuted);
  }, []);

  // Initial load
  const loadInitialBatch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    inCampusInBuzzClient.reset();

    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();

    try {
      const result = await inCampusInBuzzClient.fetchNextPage({
        limit: 10,
        signal: abortControllerRef.current.signal
      });

      if (!result.reels || result.reels.length === 0) {
        setError('No public InCampus InBuzz reels are currently available.');
      } else {
        setReels(result.reels);
        setHasMore(result.hasMore);
        setActiveIndex(0);
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(
          err.message || 'Failed to connect to the InCampus InBuzz service. Please verify your connection.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch more reels when reaching end of loaded items
  const loadMoreReels = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);

    try {
      const result = await inCampusInBuzzClient.fetchNextPage({ limit: 10 });
      if (result.reels && result.reels.length > 0) {
        setReels((prev) => {
          const existingIds = new Set(prev.map((r) => r.id));
          const uniqueNew = result.reels.filter((r) => !existingIds.has(r.id));
          return [...prev, ...uniqueNew];
        });
        setHasMore(result.hasMore);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.warn('[InBuzzPage] Failed to fetch next reel batch:', err.message);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMore]);

  useEffect(() => {
    loadInitialBatch();
    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [loadInitialBatch]);

  // Smooth scroll to a target reel index
  const scrollToIndex = useCallback((index) => {
    const container = containerRef.current;
    if (!container || index < 0 || index >= reels.length) return;

    const itemHeight = container.clientHeight;
    isProgrammaticScroll.current = true;
    container.scrollTo({
      top: index * itemHeight,
      behavior: 'smooth'
    });

    setActiveIndex(index);

    setTimeout(() => {
      isProgrammaticScroll.current = false;
    }, 450);
  }, [reels.length]);

  // Scroll tracking with automatic sliding-window update & prefetch
  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container || reels.length === 0 || isProgrammaticScroll.current) return;

    const scrollTop = container.scrollTop;
    const clientHeight = container.clientHeight;
    if (clientHeight <= 0) return;

    const newIndex = Math.round(scrollTop / clientHeight);

    if (newIndex >= 0 && newIndex < reels.length && newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }

    // Prefetch upcoming data before reaching the very end
    if (newIndex >= reels.length - 2 && hasMore && !isLoadingMore) {
      loadMoreReels();
    }
  }, [reels.length, activeIndex, hasMore, isLoadingMore, loadMoreReels]);

  // Desktop mouse wheel / trackpad step navigation
  const handleWheel = useCallback((e) => {
    if (isWheelThrottled.current) return;

    if (Math.abs(e.deltaY) > 20) {
      isWheelThrottled.current = true;
      if (e.deltaY > 0 && activeIndex < reels.length - 1) {
        scrollToIndex(activeIndex + 1);
      } else if (e.deltaY < 0 && activeIndex > 0) {
        scrollToIndex(activeIndex - 1);
      }

      setTimeout(() => {
        isWheelThrottled.current = false;
      }, 420);
    }
  }, [activeIndex, reels.length, scrollToIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        scrollToIndex(activeIndex + 1);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        scrollToIndex(activeIndex - 1);
      } else if (e.key === 'Home') {
        e.preventDefault();
        scrollToIndex(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        scrollToIndex(reels.length - 1);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleBack();
      } else if (e.key.toLowerCase() === 'm') {
        setGlobalMuted((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, reels.length, scrollToIndex, handleBack]);

  // Share feed link
  const handleShareFeed = useCallback(() => {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);
      }).catch(() => {});
    }
  }, []);

  // Compute Bounded 5-Record Active Window
  // [activeIndex - 2, activeIndex - 1, activeIndex, activeIndex + 1, activeIndex + 2]
  const windowStart = Math.max(0, activeIndex - 2);
  const windowEnd = Math.min(reels.length - 1, activeIndex + 2);
  const activeWindowReels = reels.slice(windowStart, windowEnd + 1);

  // Height for virtual top and bottom spacers (based on 100% of container height)
  const topSpacerPercent = windowStart * 100;
  const bottomSpacerPercent = Math.max(0, (reels.length - 1 - windowEnd) * 100);

  const activeReel = reels[activeIndex];

  return (
    <div
      role="region"
      aria-label="InCampus InBuzz Video Viewer"
      className="fixed inset-0 z-[120] w-screen h-screen h-[100dvh] bg-[#07090E] text-white flex flex-col overflow-hidden select-none"
    >
      {/* Volumetric Dark Ambient Glow Background */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-emerald-500/[0.03] blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-cyan-500/[0.03] blur-[160px] pointer-events-none" />

      {/* 1. DEDICATED INDEPENDENT INBUZZ HEADER */}
      <header className="relative z-50 h-14 sm:h-16 px-4 sm:px-8 border-b border-white/10 bg-[#0B0E17]/90 backdrop-blur-2xl flex items-center justify-between shrink-0">
        {/* Left: Visible Back to Portfolio Navigation */}
        <div className="flex items-center shrink-0 z-10">
          <button
            type="button"
            onClick={handleBack}
            aria-label="Back to Saquib Sarfaraz Portfolio"
            className="h-9 inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white font-mono text-xs transition-all border border-white/15 shadow-sm cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-white shrink-0" />
            <span className="font-bold hidden sm:inline">Back to Portfolio</span>
            <span className="font-bold sm:hidden">Portfolio</span>
          </button>
        </div>

        {/* Center: InCampus Brand Indicator (Dead-Center on all viewports) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none select-none z-10">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span className="text-xs sm:text-sm font-mono font-bold text-white tracking-wide">
            InCampus
          </span>
        </div>

        {/* Right: Menu Action & Dropdown */}
        <div className="relative flex items-center shrink-0 z-20" ref={menuDropdownRef}>
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            title="Menu"
            aria-label="Toggle InCampus Menu"
            aria-expanded={isMenuOpen}
            className="h-9 w-9 sm:w-auto sm:px-3.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white border border-white/15 transition-all inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
          >
            {isMenuOpen ? <X className="w-4 h-4 text-white" /> : <Menu className="w-4 h-4 text-white" />}
            <span className="hidden sm:inline text-xs font-mono font-bold">Menu</span>
          </button>

          {/* Liquid Glass Dropdown Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <>
                {/* Backdrop on mobile to prevent accidental video taps */}
                <div
                  className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] sm:hidden"
                  onClick={() => setIsMenuOpen(false)}
                  aria-hidden="true"
                />

                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                  className="incampus-menu-dropdown rounded-2xl optical-dropdown apple-glass-edge p-2 sm:p-2 z-50 text-xs font-mono shadow-[0_20px_50px_rgba(0,0,0,0.92)] backdrop-blur-2xl space-y-1 box-border"
                >
                  {/* Back to Portfolio */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleBack();
                    }}
                    className="w-full px-3 py-2.5 rounded-xl hover:bg-white/10 active:scale-[0.99] text-left text-white flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4 text-slate-400 shrink-0" />
                    <div className="min-w-0">
                      <p className="font-bold truncate">Back to Portfolio</p>
                      <p className="text-[10px] text-slate-400 truncate">Return to main page</p>
                    </div>
                  </button>

                  {/* Visit InCampus.online */}
                  <a
                    href="https://incampus.online"
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full px-3 py-2.5 rounded-xl hover:bg-white/10 active:scale-[0.99] text-left text-white flex items-center gap-2.5 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div className="min-w-0">
                      <p className="font-bold truncate text-emerald-300">Visit InCampus.online</p>
                      <p className="text-[10px] text-slate-400 truncate">Official campus app</p>
                    </div>
                  </a>

                  {/* Share Link */}
                  <button
                    type="button"
                    onClick={() => {
                      handleShareFeed();
                      setTimeout(() => setIsMenuOpen(false), 900);
                    }}
                    className="w-full px-3 py-2.5 rounded-xl hover:bg-white/10 active:scale-[0.99] text-left text-white flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    {shareCopied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <div className="min-w-0">
                          <p className="font-bold text-emerald-400 truncate">Link Copied!</p>
                          <p className="text-[10px] text-emerald-300/80 truncate">Ready to share</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-4 h-4 text-cyan-400 shrink-0" />
                        <div className="min-w-0">
                          <p className="font-bold truncate">Share Reel</p>
                          <p className="text-[10px] text-slate-400 truncate">Copy URL to clipboard</p>
                        </div>
                      </>
                    )}
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* 2. MAIN FEED VIEWPORT (Independent Full-Height Scroll Context) */}
      <main className="relative flex-1 min-h-0 w-full flex items-center justify-center p-0 sm:p-4 md:p-6 overflow-hidden">
        {/* Loading Screen */}
        {isLoading && (
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#07090E] text-white p-6 space-y-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              </div>
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-extrabold text-white">Loading InCampus InBuzz...</p>
              <p className="text-xs text-slate-400 font-mono">Connecting to InCampus verified video network</p>
            </div>
          </div>
        )}

        {/* Error Screen */}
        {error && !isLoading && (
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#07090E] text-white p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1 max-w-sm">
              <p className="text-sm font-extrabold text-white">Unable to Load InBuzz Feed</p>
              <p className="text-xs text-slate-400 leading-relaxed font-mono">{error}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={loadInitialBatch}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black font-extrabold text-xs hover:bg-slate-200 transition-all shadow-md cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Try Again</span>
              </button>
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-mono text-xs transition-all border border-white/15 cursor-pointer"
              >
                Return to Portfolio
              </button>
            </div>
          </div>
        )}

        {/* Active InBuzz Reel Viewer Container */}
        {!isLoading && !error && (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Desktop Side Navigation Buttons (Next / Prev) */}
            <div className="hidden lg:flex flex-col gap-3 absolute right-8 xl:right-16 z-40">
              <button
                type="button"
                onClick={() => scrollToIndex(activeIndex - 1)}
                disabled={activeIndex === 0}
                aria-label="Previous Reel"
                className={`p-3 rounded-full backdrop-blur-xl border transition-all cursor-pointer shadow-xl ${
                  activeIndex === 0
                    ? 'bg-white/5 border-white/5 text-slate-600 cursor-not-allowed'
                    : 'bg-white/10 border-white/20 text-white hover:bg-white/20 hover:scale-105 active:scale-95'
                }`}
              >
                <ChevronUp className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => scrollToIndex(activeIndex + 1)}
                disabled={activeIndex === reels.length - 1}
                aria-label="Next Reel"
                className={`p-3 rounded-full backdrop-blur-xl border transition-all cursor-pointer shadow-xl ${
                  activeIndex === reels.length - 1
                    ? 'bg-white/5 border-white/5 text-slate-600 cursor-not-allowed'
                    : 'bg-white/10 border-white/20 text-white hover:bg-white/20 hover:scale-105 active:scale-95'
                }`}
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>

            {/* Centered Portrait Reel Cinema Card */}
            <div className="relative w-full h-full sm:h-[92vh] sm:max-h-[880px] sm:w-[440px] md:w-[480px] bg-black sm:rounded-3xl border-0 sm:border sm:border-white/15 shadow-[0_30px_90px_rgba(0,0,0,0.98)] overflow-hidden flex flex-col">
              {/* Virtual Snap Feed Container */}
              <div
                ref={containerRef}
                onScroll={handleScroll}
                onWheel={handleWheel}
                className="w-full h-full overflow-y-scroll snap-y snap-mandatory touch-pan-y focus:outline-none overscroll-y-contain relative"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  WebkitOverflowScrolling: 'touch',
                  touchAction: 'pan-y'
                }}
              >
                {/* 1. Virtual Top Spacer (Evicts distant previous reels from DOM) */}
                {topSpacerPercent > 0 && (
                  <div
                    aria-hidden="true"
                    style={{ height: `${topSpacerPercent}%` }}
                    className="w-full shrink-0 pointer-events-none"
                  />
                )}

                {/* 2. Bounded 5-Record Active Window */}
                {activeWindowReels.map((reel, windowOffset) => {
                  const globalIdx = windowStart + windowOffset;
                  const isCurrentActive = globalIdx === activeIndex;

                  return (
                    <div
                      key={reel.id}
                      className="w-full h-full min-h-full snap-start snap-normal shrink-0 relative"
                    >
                      <InCampusReelCard
                        reel={reel}
                        index={globalIdx}
                        totalReels={reels.length}
                        isActive={isCurrentActive}
                        globalMuted={globalMuted}
                        onGlobalMutedChange={handleGlobalMutedChange}
                      />
                    </div>
                  );
                })}

                {/* 3. Virtual Bottom Spacer (Evicts distant next reels from DOM) */}
                {bottomSpacerPercent > 0 && (
                  <div
                    aria-hidden="true"
                    style={{ height: `${bottomSpacerPercent}%` }}
                    className="w-full shrink-0 pointer-events-none"
                  />
                )}

                {/* Loading More Indicator */}
                {isLoadingMore && (
                  <div className="h-16 w-full flex items-center justify-center bg-black shrink-0">
                    <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
