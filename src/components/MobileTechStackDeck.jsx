import React from 'react';
import { Layers, Cpu, Database, Wrench } from 'lucide-react';
import { skillsData } from '../content/skills';
import TechBrandIcon from './TechBrandIcon';

const categoryIconMap = {
  frontend: Layers,
  backend: Cpu,
  database: Database,
  tools: Wrench,
};

export default function MobileTechStackDeck() {
  const categories = skillsData.categories || [];

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <h3 className="text-xs font-extrabold text-white font-mono uppercase tracking-wider border-l-4 border-white/60 pl-3">
          Technologies & Competencies
        </h3>
        <span className="text-[10px] font-mono text-white bg-[#171A25] px-2.5 py-0.5 rounded-full border border-[#414655] font-bold">
          {categories.reduce((acc, cat) => acc + cat.skills.length, 0)} Core Skills
        </span>
      </div>

      {/* Natural vertical document flow: no sticky overlap, content-driven heights */}
      <div className="flex flex-col gap-6">
        {categories.map((category, catIdx) => {
          const CatIcon = categoryIconMap[category.id] || Layers;

          return (
            <div
              key={category.id}
              className="relative w-full rounded-3xl bg-[#0D101A] border border-white/20 p-4 sm:p-5 shadow-[0_12px_36px_rgba(0,0,0,0.6)] backdrop-blur-2xl space-y-3.5"
            >
              <div>
                {/* Category Header */}
                <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3 mb-3 relative z-10">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-white/10 border border-white/15 text-white">
                      <CatIcon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white tracking-tight">
                        {category.title}
                      </h4>
                      <span className="text-[10px] font-mono text-slate-400">
                        {category.skills.length} Mastered Technologies
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-white px-2 py-0.5 rounded bg-white/10 border border-white/20">
                      {category.id.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Authentic Logos & Skills List */}
                <div className="space-y-2.5 relative z-10">
                  {category.skills.map((skill) => {
                    return (
                      <div
                        key={skill.name}
                        className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all flex flex-col gap-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            {/* Official Authentic Logo Icon */}
                            <div className="w-8 h-8 rounded-xl bg-[#171A25] border border-white/15 flex items-center justify-center shrink-0 shadow-sm">
                              <TechBrandIcon name={skill.name} className="w-4 h-4" />
                            </div>

                            <div>
                              <div className="text-xs font-bold text-white tracking-tight">
                                {skill.name}
                              </div>
                              <div className="text-[10px] font-mono text-slate-400">
                                {skill.experience} • {skill.level}
                              </div>
                            </div>
                          </div>

                          <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#171A25] border border-white/10 text-slate-300">
                            {skill.projectsCount} Apps
                          </span>
                        </div>

                        {/* Concepts Tag Strip */}
                        {skill.concepts && skill.concepts.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1 border-t border-white/5">
                            {skill.concepts.slice(0, 4).map((concept) => (
                              <span
                                key={concept}
                                className="text-[9px] font-mono text-slate-400 bg-white/[0.02] px-1.5 py-0.5 rounded border border-white/5"
                              >
                                {concept}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
