import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function AIAnimatedEmblem({ className = '', onLoaded }) {
  const [videoError, setVideoError] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef(null);

  // Check prefers-reduced-motion media query
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener?.('change', handleChange);
    return () => mediaQuery.removeEventListener?.('change', handleChange);
  }, []);

  // Handle video autoplay guarantee
  useEffect(() => {
    if (videoRef.current && !prefersReducedMotion) {
      videoRef.current.play?.().catch(() => {
        // Autoplay policy prevented playback, fall back gracefully
        setVideoError(true);
      });
    }
  }, [prefersReducedMotion]);

  const handleCanPlay = () => {
    setIsVideoLoaded(true);
    if (onLoaded) onLoaded();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 14 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`relative mx-auto flex flex-col items-center justify-center select-none ${className}`}
    >
      {/* Outer Volumetric Ambient Backlight (Cyan & Magenta particles bloom) */}
      <div
        className="absolute -inset-6 sm:-inset-10 rounded-full bg-gradient-to-tr from-cyan-500/20 via-purple-600/15 to-pink-500/20 blur-2xl opacity-75 pointer-events-none transition-opacity duration-700 group-hover:opacity-100 animate-pulse"
        style={{ animationDuration: '4s' }}
      />
      <div
        className="absolute -inset-2 rounded-full bg-cyan-400/10 blur-xl pointer-events-none"
      />

      {/* Main Animated Emblem Vessel */}
      <div className="relative group w-44 h-44 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full overflow-hidden border border-white/10 bg-[#080A12] shadow-2xl shadow-cyan-950/40 transition-transform duration-500 ease-out hover:scale-[1.03] cursor-pointer">
        {/* Subtle Glass Specular Sweep */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/10 via-transparent to-transparent pointer-events-none z-10" />

        {prefersReducedMotion || videoError ? (
          /* Static Logo Fallback for Reduced-Motion or unsupported video */
          <img
            src="/assets/ai/ai-logo.png"
            alt="Saquib AI Neural Core"
            className="w-full h-full object-cover rounded-full"
            loading="eager"
          />
        ) : (
          /* Real Cinematic Animated Video Asset */
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster="/assets/ai/ai-logo-poster.webp"
            onCanPlay={handleCanPlay}
            onError={() => setVideoError(true)}
            className={`w-full h-full object-cover rounded-full transition-opacity duration-700 ${
              isVideoLoaded ? 'opacity-100' : 'opacity-90'
            }`}
          >
            <source src="/assets/ai/ai-logo-reveal.webm" type="video/webm" />
            <source src="/assets/ai/ai-logo-reveal.mp4" type="video/mp4" />
            {/* Fallback image inside video element */}
            <img
              src="/assets/ai/ai-logo.png"
              alt="Saquib AI Neural Core"
              className="w-full h-full object-cover rounded-full"
            />
          </video>
        )}

        {/* Ambient Orbit Trace Ring */}
        <div className="absolute inset-0 rounded-full border border-cyan-400/20 pointer-events-none" />
      </div>
    </motion.div>
  );
}
