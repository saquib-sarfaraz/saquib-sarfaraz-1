import { useEffect, useCallback } from 'react';
import { X, ArrowLeft } from 'lucide-react';
import InCampusReelsFeed from './InCampusReelsFeed';

export default function InCampusReelsModal({ isOpen, onClose }) {
  // Handle Escape key to close
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  // Lock portfolio body and Lenis scroll when modal is open; restore upon close
  useEffect(() => {
    if (!isOpen) return;

    window.addEventListener('keydown', handleKeyDown);

    // Pause Lenis smooth scrolling if active
    if (window.lenis) {
      window.lenis.stop();
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;

      // Resume Lenis smooth scrolling
      if (window.lenis) {
        window.lenis.start();
      }
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="InCampus InBuzz Video Viewer"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-2xl animate-in fade-in duration-300"
      onClick={onClose}
    >
      {/* App container: Full mobile viewport (100dvh); Balanced cinema card on desktop (up to 580px width) */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full h-[100dvh] sm:h-[94vh] sm:max-h-[920px] sm:w-[480px] md:w-[520px] lg:w-[560px] bg-[#0A0C14] sm:rounded-3xl border-0 sm:border sm:border-white/20 shadow-[0_30px_90px_rgba(0,0,0,0.98)] overflow-hidden flex flex-col transform-gpu animate-in zoom-in-95 duration-200"
      >
        {/* Apple Liquid Glass Optical Specular Glare along upper rim (Desktop) */}
        <div className="hidden sm:block apple-specular-glare" />

        {/* 1. Dedicated Header Bar - Highest Stacking Context Above Video & Controls */}
        <header className="h-13 sm:h-14 px-4 sm:px-5 flex items-center justify-between border-b border-white/10 bg-[#0E111B] shrink-0 z-50">
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[11px] font-mono text-emerald-400 font-bold flex items-center gap-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              InCampus
            </span>
            <span className="text-[11px] font-mono text-slate-400 hidden xs:inline-block">
              Campus Video Feed
            </span>
          </div>

          {/* Prominent Visible Back / Close Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close InCampus InBuzz and return to portfolio"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white font-mono text-xs transition-all cursor-pointer border border-white/15 shadow-sm"
          >
            <X className="w-3.5 h-3.5" />
            <span>Close</span>
          </button>
        </header>

        {/* 2. Feed Body: Full remaining height (min-h-0) for natural snap scrolling */}
        <main className="relative w-full flex-1 min-h-0 overflow-hidden bg-black">
          <InCampusReelsFeed isActiveOverlay={isOpen} />
        </main>
      </div>
    </div>
  );
}
