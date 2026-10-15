import { motion } from 'framer-motion';
import { Building2, Calendar, CheckCircle2, Clock } from 'lucide-react';
import { wonderkidsInternship } from '../content/experience';

export default function CurrentInternshipSpotlight() {
  if (!wonderkidsInternship.isCurrent) return null;

  return (
    <section className="py-12 px-4 sm:px-6 relative bg-[#080A12]">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="p-8 md:p-10 rounded-3xl apple-glass-pill apple-glass-edge space-y-6 shadow-xl relative overflow-hidden text-left"
        >
          <div className="apple-specular-glare" />

          {/* Header Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6 relative z-10">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white">
                  {wonderkidsInternship.statusBadge}
                </span>
                <span className="text-xs font-mono text-[#949BAA] px-3 py-1 rounded-full glass-nested-child">
                  {wonderkidsInternship.company}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white pt-1">
                {wonderkidsInternship.role}
              </h2>
              <div className="text-[#949BAA] text-sm font-mono flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#949BAA]" />
                <span>{wonderkidsInternship.company}</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl glass-nested-child text-xs font-mono text-[#949BAA] flex items-center gap-2">
              <Clock className="w-4 h-4 text-white" />
              <div>
                <div className="text-[10px] text-[#747B8B] uppercase">Duration</div>
                <div className="text-[#F5F6FA] font-semibold">{wonderkidsInternship.period}</div>
                <div className="text-[10px] text-[#747B8B]">{wonderkidsInternship.expectedCompletion}</div>
              </div>
            </div>
          </div>

          {/* Ongoing Summary Statement */}
          <div className="p-5 rounded-2xl glass-nested-child space-y-3 relative z-10">
            <p className="text-[#C6CBD6] text-sm sm:text-base leading-relaxed font-normal">
              {wonderkidsInternship.ongoingSummary}
            </p>
          </div>

          {/* Key Deliverables */}
          <div className="space-y-3 relative z-10">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#747B8B] font-semibold">
              Core Engineering Focus:
            </h3>

            <div className="grid sm:grid-cols-2 gap-2.5 text-xs sm:text-sm text-[#C6CBD6]">
              {wonderkidsInternship.impactBullets.map((bullet, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl glass-nested-child">
                  <CheckCircle2 className="w-4 h-4 text-white mt-0.5 shrink-0" />
                  <span>{bullet}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack Footer */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-[#414655]">
            <div className="flex flex-wrap gap-1.5">
              {wonderkidsInternship.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 rounded bg-[#222633] border border-[#414655] text-xs font-mono text-[#C6CBD6]"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="text-[11px] font-mono text-[#747B8B]">
              Official Offer • Vaultboard Consulting Pvt. Ltd.
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
