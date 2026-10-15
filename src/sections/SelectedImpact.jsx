import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Target, TrendingUp } from 'lucide-react';
import { impactData } from '../content/impact';

function AnimatedNumber({ value }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const [displayValue, setDisplayValue] = useState(0);

  const numericMatch = value.match(/\d+/);
  const number = numericMatch ? parseInt(numericMatch[0], 10) : null;
  const prefix = number !== null ? value.split(numericMatch[0])[0] : '';
  const suffix = number !== null ? value.split(numericMatch[0])[1] : '';

  useEffect(() => {
    if (!isInView || number === null) return;

    const duration = 1500;
    const startTime = performance.now();

    const updateCount = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.floor(easeProgress * number));

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    };

    requestAnimationFrame(updateCount);
  }, [isInView, number]);

  if (number === null) return <span>{value}</span>;

  return (
    <span ref={ref}>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
}

export default function SelectedImpact() {
  return (
    <section className="py-20 px-4 sm:px-6 relative bg-[#080A12] overflow-hidden border-t border-[#171A25]">
      {/* Volumetric Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/[0.02] blur-[150px] pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-12 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#171A25] border border-white/15 text-[#C6CBD6] text-xs font-mono uppercase tracking-widest backdrop-blur-xl">
            <Target className="w-4 h-4 text-[#3B82F6]" /> Measurable Engineering Outcomes
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-sans">
            Selected <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">Impact</span> & Metrics
          </h2>
        </motion.div>

        {/* Impact Cards 2x2 Responsive Metric Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-left">
          {impactData.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 28, filter: 'blur(10px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6, scale: 1.02 }}
              data-cursor-label="METRIC"
              className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl apple-glass-pill apple-glass-edge hover:border-[#2563EB]/40 space-y-2 shadow-xl backdrop-blur-2xl transition-all duration-300 group cursor-pointer flex flex-col justify-between relative overflow-hidden"
            >
              <div className="apple-specular-glare" />

              <div className="space-y-1.5 relative z-10">
                <div className="text-2xl sm:text-4xl font-extrabold text-[#3B82F6] font-mono tracking-tight group-hover:text-[#60A5FA] transition-colors flex items-center justify-between">
                  <AnimatedNumber value={item.metric} />
                  <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#3B82F6] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </div>
                <div className="text-xs font-bold text-slate-200 font-mono leading-snug">
                  {item.label}
                </div>
                <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed font-sans line-clamp-2">
                  {item.description}
                </p>
              </div>
              <div className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-slate-400 pt-1.5 border-t border-[#222633] group-hover:text-[#93C5FD] transition-colors">
                {item.category}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
