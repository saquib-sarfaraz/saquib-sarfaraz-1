import { motion } from 'framer-motion';
import { profileData } from '../content/profile';
import TechBrandIcon from '../components/TechBrandIcon';

export default function CurrentlyBuilding() {
  const items = profileData?.currentlyBuilding || [];

  return (
    <section id="currently-building" className="py-16 px-4 sm:px-6 relative bg-[#080A12] border-t border-[#171A25]">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-[#C6CBD6] font-bold">
            Current Engineering Focus
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Currently Building
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-left max-w-3xl mx-auto">
          {items.map((item, idx) => {
            const techName = item.tech || 'React';
            const techLabel = item.techLabel || 'Web Tech';

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                whileHover={{ y: -3 }}
                className="p-6 rounded-2xl glass-card apple-glass-edge transition-all space-y-4 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-[#2563EB]/40 hover:shadow-[0_12px_32px_rgba(37,99,235,0.12)]"
              >
                <div className="apple-specular-glare" />

                <div className="space-y-3 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#171A25] border border-white/15 flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105">
                      <TechBrandIcon name={techName} className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#171A25] text-slate-300 border border-white/10 group-hover:border-[#2563EB]/40 group-hover:text-blue-200 transition-colors">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-slate-300 text-xs sm:text-xs leading-relaxed font-sans">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between font-mono text-[11px] relative z-10">
                  <span className="text-slate-400">Core Architecture:</span>
                  <span className="flex items-center gap-1.5 font-semibold text-white px-2 py-0.5 rounded bg-white/5 border border-white/10 group-hover:border-[#2563EB]/30 transition-colors">
                    <TechBrandIcon name={techName} className="w-3.5 h-3.5" />
                    <span>{techLabel}</span>
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
