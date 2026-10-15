import { useState, useRef, useEffect, useCallback } from 'react';
import InCampusReelCard from './InCampusReelCard';
import { inCampusInBuzzClient } from '../../services/incampusReelsApi';
import { RefreshCw, AlertCircle } from 'lucide-react';

export default function InCampusReelsFeed({ isActiveOverlay = true }) {
  const containerRef = useRef(null);
  const [reels, setReels] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const [globalMuted, setGlobalMuted] = useState(true);
  const abortControllerRef = useRef(null);
  const isWheelThrottled = useRef(false);

  // Synchronize global mute preference across reels
  const handleGlobalMutedChange = useCallback((nextMuted) => {
    setGlobalMuted(nextMuted);
  }, []);

  // Fetch initial batch of verified InBuzz reels
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

  // Fetch more reels as user approaches the bottom
  const loadMoreReels = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);

    try {
      const result = await inCampusInBuzzClient.fetchNextPage({ limit: 10 });
      if (result.reels && result.reels.length > 0) {
        setReels((prev) => [...prev, ...result.reels]);
        setHasMore(result.hasMore);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.warn('[InCampus InBuzz] Failed to load more reels:', err.message);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMore]);

  // Initial load on mount
  useEffect(() => {
    loadInitialBatch();
    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [loadInitialBatch]);

  // Programmatic smooth scroll to a specific reel index
  const scrollToIndex = useCallback((index) => {
    const container = containerRef.current;
    if (!container || index < 0 || index >= reels.length) return;

    const itemHeight = container.clientHeight;
    container.scrollTo({
      top: index * itemHeight,
      behavior: 'smooth'
    });
  }, [reels.length]);

  // Deterministic onScroll handler: accurately tracks the active reel based on scroll position
  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container || reels.length === 0) return;

    const scrollTop = container.scrollTop;
    const clientHeight = container.clientHeight;
    if (clientHeight <= 0) return;

    const newIndex = Math.round(scrollTop / clientHeight);

    if (newIndex >= 0 && newIndex < reels.length && newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }

    // Auto-fetch next batch when nearing end of current list
    if (newIndex >= reels.length - 2 && hasMore && !isLoadingMore) {
      loadMoreReels();
    }
  }, [reels.length, activeIndex, hasMore, isLoadingMore, loadMoreReels]);

  // Desktop mouse-wheel / trackpad navigation: smoothly advances exactly one reel per flick
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
      }, 450);
    }
  }, [activeIndex, reels.length, scrollToIndex]);

  // Keyboard navigation (ArrowUp, ArrowDown, M)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isActiveOverlay) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        scrollToIndex(activeIndex + 1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        scrollToIndex(activeIndex - 1);
      } else if (e.key.toLowerCase() === 'm') {
        setGlobalMuted((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActiveOverlay, activeIndex, scrollToIndex]);

  // 1. Loading State Screen
  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-black/95 text-white p-6 space-y-4">
        <div className="relative">
          <div className="w-14 h-14 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          </div>
        </div>
        <div className="text-center space-y-1">
          <p className="text-sm font-extrabold text-white">Connecting to InCampus InBuzz...</p>
          <p className="text-xs text-slate-400 font-mono">Fetching public university videos</p>
        </div>
      </div>
    );
  }

  // 2. Error State Screen
  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-black/95 text-white p-6 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="space-y-1 max-w-xs">
          <p className="text-sm font-extrabold text-white">Unable to Load InBuzz Feed</p>
          <p className="text-xs text-slate-400 leading-relaxed font-mono">{error}</p>
        </div>
        <button
          type="button"
          onClick={loadInitialBatch}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black font-extrabold text-xs hover:bg-slate-200 transition-all shadow-md cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Try Again</span>
        </button>
      </div>
    );
  }

  // 3. Natural Scroll-Snap InBuzz Feed
  return (
    <div className="relative w-full h-full bg-black overflow-hidden select-none">
      {/* Scrollable Snap Container */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        onWheel={handleWheel}
        className="w-full h-full overflow-y-scroll snap-y snap-mandatory touch-pan-y focus:outline-none overscroll-y-contain"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
          touchAction: 'pan-y'
        }}
      >
        {reels.map((reel, index) => (
          <InCampusReelCard
            key={reel.id}
            reel={reel}
            index={index}
            totalReels={reels.length}
            isActive={isActiveOverlay && index === activeIndex}
            globalMuted={globalMuted}
            onGlobalMutedChange={handleGlobalMutedChange}
          />
        ))}

        {/* Loading More Sentinel */}
        {isLoadingMore && (
          <div className="h-20 w-full flex items-center justify-center bg-black shrink-0">
            <div className="w-6 h-6 rounded-full border-2 border-white/20 border-t-white animate-spin" />
          </div>
        )}

        {/* End of Feed Banner */}
        {!hasMore && reels.length > 0 && (
          <div className="p-8 text-center bg-black text-slate-400 text-xs font-mono border-t border-white/10 space-y-2 shrink-0">
            <p className="text-white font-bold">You've watched all InCampus InBuzz videos</p>
            <p className="text-[11px] text-slate-500">Explore more on incampus.online</p>
          </div>
        )}
      </div>
    </div>
  );
}
