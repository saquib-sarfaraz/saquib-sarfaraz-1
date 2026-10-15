import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BootNetworkGraph from './BootNetworkGraph';

export default function Preloader({ onComplete }) {
  const [isPresent, setIsPresent] = useState(true);
  const [progress, setProgress] = useState(0.08);
  const [statusMessage, setStatusMessage] = useState('BOOT_KERNEL');
  const animFrameRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setProgress(1.0);
      const timer = setTimeout(() => {
        setIsPresent(false);
        if (onComplete) onComplete();
      }, 500);
      return () => clearTimeout(timer);
    }

    const totalDuration = 3200; // 3.2s total smooth sequence

    const tick = (now) => {
      if (!startTimeRef.current) startTimeRef.current = now;
      const elapsed = now - startTimeRef.current;
      const t = Math.min(elapsed / totalDuration, 1.0);

      // Smooth custom easing through the 25%-70% phase without artificial pauses
      let currentProgress;
      if (t < 0.15) {
        // Initial boot: 0.08 to 0.22
        currentProgress = 0.08 + (t / 0.15) * 0.14;
      } else if (t < 0.78) {
        // Centerpiece Network & Graph Expansion phase: 0.22 to 0.78 (smooth linear progression)
        const subT = (t - 0.15) / (0.78 - 0.15);
        currentProgress = 0.22 + subT * 0.58;
      } else if (t < 0.92) {
        // Network stabilization & telemetry lock: 0.80 to 0.98
        const subT = (t - 0.78) / (0.92 - 0.78);
        currentProgress = 0.80 + subT * 0.18;
      } else {
        // Complete: 1.0
        currentProgress = 1.0;
      }

      setProgress(currentProgress);

      // Dynamic telemetry status line
      if (currentProgress < 0.25) {
        setStatusMessage('INITIALIZING_CORE_SERVICES');
      } else if (currentProgress < 0.42) {
        setStatusMessage('MAPPING_NETWORK_TOPOLOGY');
      } else if (currentProgress < 0.58) {
        setStatusMessage('MOUNTING_LIQUID_GLASS_INTERFACE');
      } else if (currentProgress < 0.72) {
        setStatusMessage('ACCELERATING_RENDER_PIPELINE');
      } else if (currentProgress < 0.95) {
        setStatusMessage('SYSTEM_STABILIZED // ALL_NODES_ONLINE');
      } else {
        setStatusMessage('READY // ENTERING_WORKSPACE');
      }

      if (t < 1.0) {
        animFrameRef.current = requestAnimationFrame(tick);
      } else {
        // Exit transition trigger
        setTimeout(() => {
          setIsPresent(false);
          if (onComplete) onComplete();
        }, 350);
      }
    };

    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isPresent && (
        <motion.div
          initial={{ opacity: 1, filter: 'blur(0px)' }}
          exit={{ 
            opacity: 0, 
            filter: 'blur(16px)',
            scale: 1.02,
            transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] } 
          }}
          className="fixed inset-0 z-[100] bg-[#02040a] flex flex-col items-center justify-between py-8 px-6 select-none font-mono text-center overflow-hidden"
        >
          {/* Volumetric Radial Glow concentrated behind the network graph */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-600/[0.04] blur-[160px] pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-white/[0.02] blur-[100px] pointer-events-none" />

          {/* TOP HUD: OS Telemetry Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-4xl flex items-center justify-between text-xs text-slate-400 relative z-10 border-b border-white/10 pb-3"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.9)] animate-pulse" />
              <span className="font-extrabold text-white tracking-widest text-[11px]">SAQUIB OS</span>
              <span className="text-blue-400 font-mono text-[10px] font-bold">v3.0</span>
            </div>

            <div className="flex items-center gap-3 text-[10px] text-slate-400">
              <span className="hidden sm:inline">ARCH: ARM64 // HOST: LOCAL</span>
              <span className="text-blue-300 font-bold">
                {Math.round(progress * 100)}%
              </span>
            </div>
          </motion.div>

          {/* CENTERPIECE: Graph & Network Constellation Animation */}
          <div className="my-auto w-full max-w-xl flex flex-col items-center justify-center relative z-10">
            {/* Minimal Title Header */}
            <motion.div
              initial={{ opacity: 0, y: 12, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-1 mb-2 text-center"
            >
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-[0.22em] text-white uppercase drop-shadow-[0_0_24px_rgba(255,255,255,0.25)]">
                SAQUIB OS
              </h1>
              <p className="text-[10px] font-mono tracking-[0.25em] uppercase text-blue-300/80 font-medium">
                Distributed Node Topology
              </p>
            </motion.div>

            {/* Signature Graph & Network Canvas */}
            <BootNetworkGraph progress={progress} />

            {/* Precision Loading Telemetry Bar */}
            <div className="w-full max-w-[280px] space-y-2 mt-2">
              <div className="w-full h-[2px] bg-[#171A25] rounded-full overflow-hidden relative">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 via-blue-400 to-cyan-300 shadow-[0_0_10px_rgba(59,130,246,0.9)] rounded-full"
                  style={{ width: `${Math.min(progress * 100, 100)}%` }}
                  transition={{ ease: 'linear', duration: 0.1 }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span className="text-blue-300 font-semibold tracking-wider">
                  {statusMessage}
                </span>
                <span className="text-slate-300 font-bold">
                  {String(Math.round(progress * 100)).padStart(3, ' ')}%
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
