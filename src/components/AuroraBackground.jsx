import { motion } from 'framer-motion';

export default function AuroraBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-gradient-to-b from-[#080A12] via-[#0D101A] to-[#05070D]">
      {/* Primary Subtle Specular Ambience */}
      <motion.div
        animate={{
          opacity: [0.35, 0.55, 0.35],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-[15%] left-[10%] w-[70vw] h-[70vw] rounded-full bg-radial from-white/[0.035] via-[#222633]/20 to-transparent blur-[140px]"
      />

      {/* Secondary Deep Charcoal Bloom */}
      <motion.div
        animate={{
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-[30%] -right-[15%] w-[60vw] h-[60vw] rounded-full bg-radial from-[#171A25]/50 via-[#10131D]/30 to-transparent blur-[130px]"
      />

      {/* Bottom Subtle Depth Ambience */}
      <motion.div
        animate={{
          opacity: [0.25, 0.45, 0.25],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -bottom-[10%] left-[15%] w-[65vw] h-[65vw] rounded-full bg-radial from-white/[0.025] via-[#171A25]/40 to-transparent blur-[150px]"
      />

      {/* Linear Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4.5rem_4.5rem]"
      />
    </div>
  );
}
