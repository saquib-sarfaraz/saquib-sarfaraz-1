import { useState, useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Briefcase, Building2, CheckCircle2, Calendar, MapPin, ChevronDown, ChevronUp, Sparkles, Rocket } from 'lucide-react';
import { getExperienceTimeline } from '../content/experience';

// Monochromatic Liquid Glass tokens:
const experiencePalette = [
  { accent: '#FFFFFF', primary: '#C6CBD6', border: 'border-[#414655]', bg: 'bg-[#171A25]', shadow: 'shadow-[0_0_16px_rgba(255,255,255,0.2)]' },
  { accent: '#C6CBD6', primary: '#949BAA', border: 'border-[#414655]', bg: 'bg-[#171A25]', shadow: 'shadow-[0_0_16px_rgba(255,255,255,0.15)]' },
  { accent: '#FFFFFF', primary: '#C6CBD6', border: 'border-[#414655]', bg: 'bg-[#171A25]', shadow: 'shadow-[0_0_16px_rgba(255,255,255,0.2)]' },
  { accent: '#C6CBD6', primary: '#949BAA', border: 'border-[#414655]', bg: 'bg-[#171A25]', shadow: 'shadow-[0_0_16px_rgba(255,255,255,0.15)]' }
];

export default function Experience() {
  const containerRef = useRef(null);
  const timelineData = getExperienceTimeline();
  const [expandedId, setExpandedId] = useState('confidential-gov-internship-2026');

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 80%', 'end 50%']
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section id="experience" ref={containerRef} className="py-24 px-4 sm:px-6 relative bg-[#080A12] text-left overflow-hidden border-t border-[#171A25]">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-[#C6CBD6] font-bold">
            Professional Timeline
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Experience Timeline
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto font-mono">
            Verified employment history and industry internships in reverse chronological order.
          </p>
        </div>

        {/* Monochromatic Animated Timeline Track */}
        <div className="relative ml-2 sm:ml-8 pl-6 sm:pl-12 space-y-8">
          {/* Background Track Line */}
          <div className="absolute left-0 top-3 bottom-8 w-1 bg-[#222633] rounded-full" />

          {/* Glowing Animated Silver Fill Line */}
          <motion.div
            style={{ scaleY, transformOrigin: 'top' }}
            className="absolute left-0 top-3 bottom-8 w-1 bg-gradient-to-b from-white via-slate-300 to-slate-500 rounded-full shadow-[0_0_14px_rgba(255,255,255,0.7)]"
          />

          {/* Timeline Cards */}
          {timelineData.map((exp, idx) => {
            const isPinned = exp.isPinned || exp.isCurrent;
            const isExpanded = expandedId === exp.id;
            const color = experiencePalette[idx % experiencePalette.length];

            return (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="relative space-y-3"
              >
                {/* Node Dot / Marker: Dead-centered on the track line */}
                <div
                  className={`absolute -left-[22px] sm:-left-[46px] top-6 -translate-x-1/2 w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 transition-all duration-300 flex items-center justify-center z-10 ${
                    isPinned
                      ? 'bg-[#080A12] border-[#3B82F6] shadow-[0_0_16px_rgba(59,130,246,0.85)] scale-110'
                      : 'bg-[#080A12] border-[#747B8B] shadow-[0_0_8px_rgba(255,255,255,0.25)]'
                  }`}
                >
                  <div
                    className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${
                      isPinned ? 'animate-ping bg-[#3B82F6]' : 'bg-slate-300'
                    }`}
                  />
                </div>

                {/* Node Card Box */}
                <div
                  className={`p-5 sm:p-7 md:p-8 rounded-2xl sm:rounded-3xl transition-all duration-300 cursor-pointer shadow-xl overflow-hidden relative backdrop-blur-2xl ${
                    isPinned
                      ? 'apple-glass-pill border border-[#2563EB]/45 shadow-[0_16px_48px_rgba(37,99,235,0.14)]'
                      : 'apple-glass-pill hover:border-white/40 hover:shadow-[0_12px_36px_rgba(0,0,0,0.6)]'
                  }`}
                  onClick={() => toggleExpand(exp.id)}
                >
                  <div className="apple-specular-glare" />

                  {/* Glowing Top Line for Active Card */}
                  {isPinned && (
                    <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-transparent via-[#3B82F6] to-transparent animate-pulse" />
                  )}

                  {/* Header Info Container */}
                  <div className="space-y-3 border-b border-[#222633] pb-4">
                    {/* Top Badges */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] sm:text-[11px] font-mono text-slate-200 font-semibold px-2 py-0.5 rounded bg-[#171A25] border border-[#414655]">
                        {exp.type}
                      </span>
                      <span
                        className="text-[10px] sm:text-[11px] font-mono font-bold px-2.5 py-0.5 rounded"
                        style={{
                          backgroundColor: isPinned ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                          borderColor: isPinned ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.2)',
                          borderWidth: '1px',
                          color: '#FFFFFF'
                        }}
                      >
                        {exp.statusBadge || exp.highlightBadge}
                      </span>
                    </div>

                    {/* Role Title */}
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight break-words">
                      {exp.title}
                    </h3>

                    {/* Mobile Metadata Stack (< md Viewports) */}
                    <div className="md:hidden space-y-1.5 text-xs font-mono text-slate-200 pt-0.5">
                      <div className="flex items-center gap-1.5 font-bold text-white">
                        <Building2 className="w-3.5 h-3.5 shrink-0 text-white" />
                        <span className="text-white break-words">{exp.company}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Briefcase className="w-3.5 h-3.5 shrink-0 text-slate-300" />
                        <span className="break-words">{exp.role}</span>
                      </div>
                      {exp.location && (
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                          <span className="break-words">{exp.location}</span>
                        </div>
                      )}
                    </div>

                    {/* Desktop Metadata Row (≥ md Viewports) */}
                    <div className="hidden md:flex items-center gap-2 text-sm font-mono text-slate-200">
                      <Building2 className="w-4 h-4 shrink-0 text-white" />
                      <span>{exp.company}</span>
                      <span>•</span>
                      <span className="text-slate-300">{exp.role}</span>
                      {exp.location && (
                        <>
                          <span>•</span>
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="text-slate-400 text-xs">{exp.location}</span>
                        </>
                      )}
                    </div>

                    {/* Date Pill & Expand Controls Row */}
                    <div className="flex items-center justify-between gap-2 pt-2">
                      <div className="text-[11px] sm:text-xs font-mono text-slate-300 px-3 py-1 rounded-xl bg-[#171A25] border border-[#414655] flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 shrink-0 text-white" />
                        <span>{exp.period}</span>
                      </div>

                      <button
                        className="p-1.5 sm:p-2 rounded-full bg-[#171A25] text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0 border border-[#414655]"
                        aria-label="Expand details"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Impact Bullets */}
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="pt-4 space-y-4"
                    >
                      {exp.summary && (
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                          {exp.summary}
                        </p>
                      )}

                      <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                        Measurable Engineering Impact:
                      </h4>

                      <div className="space-y-2 text-xs sm:text-sm text-slate-200">
                        {exp.impactBullets.map((bullet, bIdx) => (
                          <div key={bIdx} className="flex items-start gap-2.5 leading-relaxed">
                            <CheckCircle2
                              className="w-4 h-4 mt-0.5 shrink-0 text-white"
                            />
                            <span className="break-words">{bullet}</span>
                          </div>
                        ))}
                      </div>

                      {/* Tech Stack Chips */}
                      <div className="pt-2 border-t border-[#222633] flex flex-wrap gap-1.5">
                        {exp.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="px-2.5 py-1 rounded bg-[#171A25] border border-[#414655] text-[11px] sm:text-xs font-mono text-slate-200"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}

          {/* Timeline End Rocket Launch Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="p-8 rounded-3xl bg-[#171A25]/90 border border-[#414655] text-center space-y-3 shadow-2xl relative overflow-hidden backdrop-blur-xl"
          >
            <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mx-auto text-white shadow-lg">
              <Rocket className="w-5 h-5 animate-bounce" />
            </div>

            <div className="space-y-1 font-mono">
              <span className="text-xs uppercase tracking-widest text-slate-300 font-bold">
                NEXT CHAPTER IN PROGRESS
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                Full Stack Developer & Software Engineer
              </h3>
              <p className="text-slate-300 text-xs max-w-md mx-auto">
                Open for full-time software engineering roles, internships, and high-impact development.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
