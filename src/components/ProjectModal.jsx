import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, CheckCircle2, ShieldAlert, Cpu, Layers, Sparkles } from 'lucide-react';
import { FaGithub } from 'react-icons/fa6';
import TechBrandIcon from './TechBrandIcon';

export default function ProjectModal({ project, isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return;

    // Prevent background page scrolling when modal is active
    document.body.style.overflow = 'hidden';
    window.lenis?.stop();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.lenis?.start();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto text-left">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Modal Card Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            data-lenis-prevent
            className="relative w-full max-w-3xl max-h-[85vh] optical-modal-card apple-glass-edge rounded-3xl overflow-y-auto z-10 text-slate-200 scrollbar-thin"
          >
            <div className="apple-specular-glare" />

            {/* Modal Header Banner */}
            <div className="relative p-8 bg-white/[0.02] border-b border-white/15 overflow-hidden z-10">
              <button
                onClick={onClose}
                className="apple-glass-btn absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white transition-all z-20 cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-2 relative z-10">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono uppercase tracking-widest text-white font-semibold px-3 py-1 rounded-full glass-nested-child">
                    {project.category}
                  </span>
                  {(project.status || '').toLowerCase().includes('live') ? (
                    <span className="text-xs font-mono text-emerald-400 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 font-bold flex items-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>{project.status}</span>
                    </span>
                  ) : (
                    <span className="text-xs font-mono text-white px-3 py-1 rounded-full bg-white/10 border border-white/20">
                      {project.status}
                    </span>
                  )}
                </div>

                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {project.title}
                </h2>
                <p className="text-slate-300 text-base font-medium font-mono">
                  {project.subtitle}
                </p>
              </div>
            </div>

            {/* Modal Body Content */}
            <div className="p-6 sm:p-8 space-y-8 relative z-10">
              {/* Tech Stack Chips */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3">
                  Tech Stack & Architecture
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-lg glass-nested-child text-xs font-mono text-slate-200 flex items-center gap-2 hover:border-[#2563EB]/40 transition-colors"
                    >
                      <TechBrandIcon name={tag} className="w-3.5 h-3.5" />
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Overview */}
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2 font-mono">
                  <Sparkles className="w-4 h-4 text-white" /> Executive Overview
                </h4>
                <p className="text-slate-200 text-sm md:text-base leading-relaxed">
                  {project.overview}
                </p>
              </div>

              {/* Challenge & Approach */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="p-5 rounded-2xl glass-nested-child space-y-2">
                  <h5 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5 font-semibold">
                    <ShieldAlert className="w-4 h-4 text-white" /> Engineering Challenge
                  </h5>
                  <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                    {project.challenge}
                  </p>
                </div>

                <div className="p-5 rounded-2xl glass-nested-child space-y-2">
                  <h5 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5 font-semibold">
                    <Cpu className="w-4 h-4 text-slate-300" /> Technical Approach
                  </h5>
                  <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                    {project.approach}
                  </p>
                </div>
              </div>

              {/* System Architecture Breakdown */}
              {project.architecture && (
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2 font-mono">
                    <Layers className="w-4 h-4 text-white" /> Core Architecture Modules
                  </h4>
                  <ul className="space-y-2 text-xs md:text-sm text-slate-300">
                    {project.architecture.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 p-3 rounded-xl glass-nested-child">
                        <span className="w-1.5 h-1.5 rounded-full bg-white mt-2 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Results & Lessons */}
              {project.results && (
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2 font-mono">
                    <CheckCircle2 className="w-4 h-4 text-white" /> Measurable Impact & Results
                  </h4>
                  <div className="space-y-2">
                    {project.results.map((res, idx) => (
                      <div key={idx} className="p-3 rounded-xl glass-nested-child text-xs md:text-sm text-slate-200">
                        ✓ {res}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Lessons Learned */}
              {project.lessonsLearned && (
                <div className="p-5 rounded-2xl glass-nested-child">
                  <h5 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                    Senior Engineering Takeaway
                  </h5>
                  <p className="text-xs md:text-sm text-slate-300 italic">
                    "{project.lessonsLearned}"
                  </p>
                </div>
              )}

              {/* Actions Footer */}
              <div className="pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-6 py-3 rounded-xl !bg-[#2563EB] hover:!bg-[#1D4ED8] text-white font-bold text-sm transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.4)] cursor-pointer"
                    >
                      <span>Launch Live Demo</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}

                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-6 py-3 rounded-xl apple-glass-btn text-white font-medium text-sm transition-all flex items-center gap-2 bg-[#24292E]/60 border-white/15 cursor-pointer"
                    >
                      <FaGithub className="w-4 h-4" />
                      <span>Source Code</span>
                    </a>
                  )}
                </div>

                <button
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-mono text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Press ESC to close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
