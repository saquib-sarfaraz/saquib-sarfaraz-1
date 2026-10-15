import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TechBrandIcon from './TechBrandIcon';

export default function TechTooltip({ skill }) {
  const [isHovered, setIsHovered] = useState(false);
  const [placement, setPlacement] = useState('top');
  const [hAlign, setHAlign] = useState('center');
  const cardRef = useRef(null);

  const calculatePosition = () => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      // If less than 220px above card in viewport, position below
      if (rect.top < 220) {
        setPlacement('bottom');
      } else {
        setPlacement('top');
      }

      // Check horizontal collision with screen edges
      if (rect.left < 130) {
        setHAlign('left');
      } else if (window.innerWidth - rect.right < 130) {
        setHAlign('right');
      } else {
        setHAlign('center');
      }
    }
  };

  const handleMouseEnter = () => {
    calculatePosition();
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleClick = (e) => {
    e.stopPropagation();
    calculatePosition();
    setIsHovered((prev) => !prev);
  };

  return (
    <div
      ref={cardRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {/* Skill Card Badge - Compact & Content-Driven */}
      <motion.div
        whileHover={{ y: -3 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="p-2.5 sm:p-3.5 rounded-xl glass-card glass-card-hover apple-glass-edge transition-all duration-300 cursor-pointer shadow-sm flex items-center justify-between group overflow-hidden relative hover:border-[#2563EB]/40 hover:shadow-[0_8px_24px_rgba(37,99,235,0.14)]"
      >
        <div className="apple-specular-glare" />

        <div className="flex items-center gap-2 sm:gap-3 relative z-10 min-w-0">
          <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-[#171A25] border border-white/15 flex items-center justify-center shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:border-blue-400/30">
            <TechBrandIcon name={skill.name} className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs sm:text-sm font-bold text-white group-hover:text-blue-100 transition-colors truncate">
              {skill.name}
            </div>
            <div className="text-[10px] sm:text-[11px] font-mono text-slate-400 truncate">
              {skill.experience} • {skill.level}
            </div>
          </div>
        </div>

        <div className="text-[9px] sm:text-[10px] font-mono font-semibold px-1.5 sm:px-2 py-0.5 rounded-full bg-[#171A25] border border-white/10 text-slate-300 relative z-10 group-hover:border-[#2563EB]/40 group-hover:text-blue-300 transition-colors shrink-0 ml-1">
          {skill.projectsCount} Apps
        </div>
      </motion.div>

      {/* Popover Metadata Tooltip - Strictly Out of Normal Document Flow */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: placement === 'top' ? 6 : -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: placement === 'top' ? 6 : -6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: 'absolute', pointerEvents: 'none' }}
            className={`!absolute w-60 sm:w-64 max-w-[calc(100vw-32px)] p-3.5 rounded-xl optical-dropdown apple-glass-edge shadow-[0_20px_50px_rgba(0,0,0,0.95)] z-50 pointer-events-none text-xs space-y-2 backdrop-blur-2xl overflow-hidden ${
              placement === 'top' ? 'bottom-full mb-2.5' : 'top-full mt-2.5'
            } ${
              hAlign === 'left'
                ? 'left-0 translate-x-0'
                : hAlign === 'right'
                ? 'right-0 left-auto translate-x-0'
                : 'left-1/2 -translate-x-1/2'
            }`}
          >
            <div className="apple-specular-glare" />

            <div className="flex items-center justify-between border-b border-white/10 pb-1.5 font-mono relative z-10">
              <div className="flex items-center gap-2">
                <TechBrandIcon name={skill.name} className="w-3.5 h-3.5" />
                <span className="font-bold text-white">{skill.name}</span>
              </div>
              <span className="text-[10px] text-slate-400">{skill.level}</span>
            </div>

            <div className="relative z-10">
              <div className="text-[10px] uppercase font-mono text-slate-400 mb-1">
                Core Mastered Concepts:
              </div>
              <div className="flex flex-wrap gap-1">
                {skill.concepts.map((concept) => (
                  <span
                    key={concept}
                    className="px-2 py-0.5 rounded glass-nested-child text-[10px] text-slate-200 font-mono"
                  >
                    {concept}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-1 text-[10px] font-mono text-slate-400 flex justify-between relative z-10">
              <span>Applied in {skill.projectsCount} projects</span>
              <span className="text-white font-semibold">Verified</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
