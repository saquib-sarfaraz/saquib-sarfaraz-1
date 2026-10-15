import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { ArrowDown, FileText, FolderGit2 } from 'lucide-react';
import { profileData } from '../content/profile';
import HeroWaterRipple from '../components/HeroWaterRipple';

export default function Hero() {
  const containerRef = useRef(null);
  const stageRef = useRef(null);
  const videoRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  // Scroll-linked cinematic camera & overlay physics across 180vh
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Smooth scroll transformations for content & video
  const contentOpacity = useTransform(
    scrollYProgress,
    [0, 0.5, 0.85],
    [1, 0.95, 0]
  );
  const contentY = useTransform(
    scrollYProgress,
    [0, 0.85],
    [0, -45]
  );
  const contentScale = useTransform(
    scrollYProgress,
    [0, 0.85],
    [1, 0.96]
  );
  const videoScale = useTransform(
    scrollYProgress,
    [0, 1],
    [1, 1.08]
  );
  const videoDim = useTransform(
    scrollYProgress,
    [0, 0.75, 1],
    [0, 0.2, 0.5]
  );
  const indicatorOpacity = useTransform(
    scrollYProgress,
    [0, 0.25],
    [1, 0]
  );

  // Viewport-aware video autoplay & reduced motion handling
  useEffect(() => {
    const video = videoRef.current;
    const stage = stageRef.current;
    if (!video || !stage) return;

    if (prefersReducedMotion) {
      video.pause();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {});
          }
        } else {
          video.pause();
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(stage);

    return () => {
      observer.disconnect();
    };
  }, [prefersReducedMotion]);

  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    const el = document.getElementById(targetId);
    if (!el) return;

    if (window.lenis) {
      window.lenis.scrollTo(el, { offset: -60, duration: 1.2 });
    } else {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative w-full h-[180vh] sm:h-[200vh] bg-[#080A12] select-none"
    >
      {/* Pinned Full-Viewport Cinematic Stage */}
      <div
        ref={stageRef}
        className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between items-center px-4 sm:px-8 pt-24 pb-8 z-0 pointer-events-auto"
      >
        
        {/* Full-Bleed Video Layer */}
        <motion.div
          style={{ scale: prefersReducedMotion ? 1 : videoScale }}
          className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0"
        >
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/hero-poster.jpg"
            className="w-full h-full object-cover object-center sm:object-[center_35%]"
          >
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
        </motion.div>

        {/* Dynamic Dark Dim Overlay on scroll towards next section */}
        <motion.div
          style={{ opacity: videoDim }}
          className="absolute inset-0 bg-[#080A12] pointer-events-none z-[1]"
        />

        {/* Cinematic Vignettes & Contrast Lighting Layers */}
        {/* Top Vignette for Navbar readability */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#080A12]/90 via-[#080A12]/40 to-transparent pointer-events-none z-[2]" />
        
        {/* Bottom Vignette for seamless blend into Workspace section */}
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[#080A12] via-[#080A12]/75 to-transparent pointer-events-none z-[2]" />
        
        {/* Soft Radial Ambient Contrast Wash behind text */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(8,10,18,0.25)_0%,rgba(8,10,18,0.65)_85%)] pointer-events-none z-[2]" />

        {/* Interactive Liquid-Ripple Cursor Simulation */}
        <HeroWaterRipple containerRef={stageRef} />

        {/* Main Foreground Typography & Action Overlay */}
        <motion.div
          style={{
            opacity: prefersReducedMotion ? 1 : contentOpacity,
            y: prefersReducedMotion ? 0 : contentY,
            scale: prefersReducedMotion ? 1 : contentScale,
          }}
          className="relative z-10 max-w-5xl mx-auto w-full text-center flex flex-col items-center justify-center my-auto px-4"
        >
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mb-5 sm:mb-6"
          >
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full apple-glass-pill border border-white/20 text-xs font-mono text-slate-200 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.9)]" />
              <span>{profileData.status}</span>
            </span>
          </motion.div>

          {/* Editorial Headline Name */}
          <motion.h1
            initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight text-white leading-[0.95] font-sans drop-shadow-[0_12px_40px_rgba(0,0,0,0.9)] uppercase"
          >
            SAQUIB <br className="sm:hidden" />
            <span className="bg-gradient-to-r from-white via-slate-100 to-cyan-200 bg-clip-text text-transparent drop-shadow-[0_0_45px_rgba(34,211,238,0.35)]">
              SARFARAZ
            </span>
          </motion.h1>

          {/* Role & Core Introduction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="pt-5 sm:pt-7 space-y-3 max-w-2xl mx-auto"
          >
            <div className="text-xl sm:text-2xl md:text-3xl font-extrabold text-cyan-400 font-mono tracking-tight flex items-center justify-center gap-2 drop-shadow-[0_0_25px_rgba(6,182,212,0.45)]">
              <span>Full Stack Developer</span>
              <span className="text-white animate-pulse">_</span>
            </div>

            <p className="text-slate-300 text-sm sm:text-base md:text-lg font-mono leading-relaxed text-balance drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)] font-medium">
              {profileData.tagline}
            </p>
          </motion.div>

          {/* Primary Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center justify-center gap-4 pt-7 sm:pt-9"
          >
            <a
              href="#projects"
              onClick={(e) => handleSmoothScroll(e, 'projects')}
              className="px-8 py-3.5 rounded-full apple-glass-btn !bg-white/95 !text-black hover:!bg-white font-extrabold text-xs sm:text-sm transition-all duration-300 shadow-[0_4px_30px_rgba(255,255,255,0.3)] flex items-center gap-2.5 cursor-pointer transform hover:-translate-y-0.5 hover:scale-[1.02]"
            >
              <FolderGit2 className="w-4 h-4 text-black" />
              <span>View Projects</span>
            </a>

            <a
              href={profileData.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="px-8 py-3.5 rounded-full apple-glass-btn text-white font-bold text-xs sm:text-sm transition-all duration-300 flex items-center gap-2.5 cursor-pointer shadow-[0_4px_25px_rgba(0,0,0,0.6)] transform hover:-translate-y-0.5 hover:scale-[1.02] border-white/20"
            >
              <FileText className="w-4 h-4 text-white/90" />
              <span>Resume</span>
            </a>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          style={{ opacity: indicatorOpacity }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="relative z-10 pb-2 pointer-events-auto"
        >
          <a
            href="#workspace"
            onClick={(e) => handleSmoothScroll(e, 'workspace')}
            className="flex flex-col items-center gap-2 text-[11px] font-mono text-slate-400 uppercase tracking-widest hover:text-white transition-colors group cursor-pointer"
          >
            <span>Explore Architecture</span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ArrowDown className="w-4 h-4 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.7)] group-hover:scale-110 transition-transform" />
            </motion.div>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
