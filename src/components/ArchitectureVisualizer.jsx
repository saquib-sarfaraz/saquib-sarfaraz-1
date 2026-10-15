import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { architectureNodes } from '../content/architecture';
import MobilePortfolioStack from './MobilePortfolioStack';
import TechBrandIcon from './TechBrandIcon';

const nodeTechMap = {
  client: 'React',
  api: 'Node.js',
  database: 'MongoDB',
  socket: 'Socket.io',
  cdn: 'Cloudinary'
};

export default function ArchitectureVisualizer() {
  const [activeNode, setActiveNode] = useState(architectureNodes[0]);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 md:p-8 rounded-3xl bg-[#10131D] border border-[#222633] space-y-5 md:space-y-8 shadow-2xl text-left">
      {/* Visualizer Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#222633] pb-4 sm:pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] sm:text-xs font-mono text-white font-bold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#171A25] border border-[#414655]">
              Live Architecture System
            </span>
            <span className="text-[10px] sm:text-xs font-mono text-slate-300 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#171A25]">
              Data Flow Simulator
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white pt-0.5">
            Real-Time System Flow & Architecture
          </h3>
          <p className="text-slate-400 text-xs font-mono">
            Explore architectural components, data transmission protocols, and latency guarantees.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-white bg-[#171A25] px-3 py-1.5 rounded-xl border border-[#414655]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          <span>Packet Streams Live</span>
        </div>
      </div>

      {/* MOBILE ECS-STYLE SCROLL-DRIVEN STACKED CARDS (< md Viewports) */}
      <div className="md:hidden space-y-3 pt-1">
        <MobilePortfolioStack
          items={architectureNodes}
          topOffset={76}
          cardSpacing={20}
          cardHeight="auto"
          renderCard={(node, idx, { stepNumber, totalNumber }) => {
            const nextNode = idx < architectureNodes.length - 1 ? architectureNodes[idx + 1] : null;

            return (
              <div className="relative w-full rounded-3xl bg-[#0D101A] border border-white/20 p-4 sm:p-5 shadow-[0_-16px_40px_rgba(0,0,0,0.92),0_12px_28px_rgba(0,0,0,0.85)] backdrop-blur-2xl overflow-hidden space-y-3.5">
                {/* Apple Liquid Glass Specular Glare along upper rim */}
                <div className="apple-specular-glare" />
                <div className="apple-glass-edge absolute inset-0 pointer-events-none rounded-3xl" />
                <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-white/[0.06] to-transparent pointer-events-none" />

                {/* Top Bar: Icon, Step, Status */}
                <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2.5 relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-[#171A25] border border-white/15 flex items-center justify-center shrink-0 shadow-sm">
                      <TechBrandIcon name={nodeTechMap[node.id]} className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#171A25] border border-white/10 text-slate-300">
                      {node.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-400">{stepNumber} / {totalNumber}</span>
                    <span className="text-[10px] font-mono font-bold text-white px-2 py-0.5 rounded bg-white/10 border border-white/20">
                      {node.status}
                    </span>
                  </div>
                </div>

                {/* Node Title & Protocol */}
                <div className="space-y-1 relative z-10">
                  <h4 className="text-base sm:text-lg font-bold text-white tracking-tight">{node.title}</h4>
                  <div className="text-xs font-mono text-slate-300">
                    Protocol: <span className="text-[#3B82F6] font-semibold">{node.tech}</span>
                  </div>
                </div>

                {/* Node Description */}
                <p className="text-xs text-slate-300 leading-relaxed font-sans relative z-10">
                  {node.description}
                </p>

                {/* Pipeline Stream Footer */}
                <div className="pt-2.5 border-t border-white/10 flex items-center justify-between font-mono text-[11px] relative z-10 text-slate-400">
                  <span>Component #{node.id}</span>
                  {nextNode ? (
                    <span className="flex items-center gap-1.5 text-white font-semibold">
                      <span>Flow to {nextNode.title.split(' ')[0]}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#3B82F6]" />
                    </span>
                  ) : (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                      <span>Pipeline Complete</span>
                      <Sparkles className="w-3 h-3 text-emerald-400" />
                    </span>
                  )}
                </div>
              </div>
            );
          }}
        />
      </div>

      {/* DESKTOP PIPELINE & SPEC BOX (≥ md Viewports — 100% PRESERVED) */}
      <div className="hidden md:block space-y-8">
        {/* Nodes Connection Pipeline Stream */}
        <div className="relative grid grid-cols-5 gap-3 py-4">
          {architectureNodes.map((node, idx) => {
            const isSelected = activeNode.id === node.id;

            return (
              <motion.div
                key={node.id}
                whileHover={{ y: -3, scale: 1.02 }}
                onClick={() => setActiveNode(node)}
                onMouseEnter={() => setActiveNode(node)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 relative ${
                  isSelected
                    ? 'bg-[#171A25] border-[#2563EB]/70 shadow-lg shadow-[#2563EB]/15'
                    : 'bg-[#10131D] border-[#222633] hover:border-[#414655]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-xl flex items-center justify-center shrink-0 transition-transform ${
                    isSelected ? 'bg-[#222633] scale-105 shadow-inner' : 'bg-[#171A25]'
                  }`}>
                    <TechBrandIcon name={nodeTechMap[node.id]} className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-mono font-semibold transition-colors ${
                    isSelected ? 'text-[#60A5FA]' : 'text-slate-400'
                  }`}>
                    0{idx + 1}
                  </span>
                </div>

                <div>
                  <div className="text-xs font-bold text-white leading-snug">{node.title}</div>
                  <div className="text-[10px] font-mono text-slate-400 pt-0.5">{node.type}</div>
                </div>

                {/* Connected Arrow Indicator */}
                {idx < architectureNodes.length - 1 && (
                  <div className="absolute -right-2 top-1/2 -translate-y-1/2 z-10">
                    <ArrowRight className={`w-3.5 h-3.5 transition-colors ${
                      isSelected ? 'text-[#3B82F6]' : 'text-slate-600'
                    }`} />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Node Detail Spec Box */}
        <div className="p-6 rounded-2xl bg-[#171A25] border border-[#222633] space-y-3 relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#222633] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#222633] border border-white/10 flex items-center justify-center shrink-0">
                <TechBrandIcon name={nodeTechMap[activeNode.id]} className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white">{activeNode.title} Specifications</h4>
            </div>
            <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded bg-[#2563EB]/20 text-[#60A5FA] border border-[#2563EB]/30">
              {activeNode.status}
            </span>
          </div>

          <p className="text-slate-200 text-xs md:text-sm leading-relaxed">
            {activeNode.description}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
            <div className="text-slate-400">
              Tech Protocol: <span className="text-[#60A5FA] font-semibold">{activeNode.tech}</span>
            </div>
            <div className="text-slate-400">
              Component ID: #{activeNode.id}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
