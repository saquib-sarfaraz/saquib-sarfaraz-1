import { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, ArrowUpRight, Code2, Eye, Server, Terminal, Sparkles, FolderGit2, Globe } from 'lucide-react';
import { FaGithub } from 'react-icons/fa6';
import ProjectModal from '../components/ProjectModal';
import LivePreviewModal from '../components/LivePreviewModal';
import { flagshipProject, ecosystemProjects, learningProjects } from '../content/projects';
import { LiquidGlassContainer, LiquidGlassElement } from '../components/liquidglass';
import MobilePortfolioStack from '../components/MobilePortfolioStack';
import TechBrandIcon from '../components/TechBrandIcon';

export default function Projects() {
  const [activeModalProject, setActiveModalProject] = useState(null);
  const [activePreviewProject, setActivePreviewProject] = useState(null);

  const allProjects = [...ecosystemProjects, ...learningProjects];

  return (
    <section id="projects" className="py-20 px-4 sm:px-6 relative bg-[#080A12] overflow-visible md:overflow-hidden border-t border-[#171A25]">
      {/* Volumetric Radial Glows */}
      <div className="absolute top-1/4 right-0 w-[550px] h-[550px] rounded-full bg-white/[0.02] blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-[500px] h-[500px] rounded-full bg-[#171A25]/40 blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-16 text-left relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="text-center space-y-2"
        >
          <span className="text-xs font-mono uppercase tracking-widest text-[#C6CBD6] font-bold px-3 py-1 rounded-full apple-glass-btn inline-block shadow-sm">
            Engineered SaaS Systems
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-sans">
            Featured Products & <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">Infrastructure</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto font-mono">
            Architected around the InCampus SaaS ecosystem and real-time multiplayer engines.
          </p>
        </motion.div>

        {/* MOBILE ECS-STYLE SCROLL-DRIVEN STACKED CARDS (< md Viewports) */}
        <div className="md:hidden space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-xs font-extrabold text-white font-mono uppercase tracking-wider border-l-4 border-white/60 pl-3">
              Projects & SaaS Infrastructure
            </h3>
            <span className="text-[10px] font-mono text-white bg-[#171A25] px-2.5 py-0.5 rounded-full border border-[#414655] font-bold">
              {allProjects.length + 1} Flagship Apps
            </span>
          </div>

          <MobilePortfolioStack
            items={[flagshipProject, ...allProjects]}
            topOffset={76}
            cardSpacing={32}
            cardHeight={500}
            renderCard={(project, index, { stepNumber, totalNumber }) => {
              return (
                <div
                  onClick={() => setActiveModalProject(project)}
                  className="relative w-full h-full flex flex-col justify-between rounded-3xl bg-[#0D101A] border border-white/20 p-5 shadow-[0_-20px_50px_rgba(0,0,0,0.95),0_15px_35px_rgba(0,0,0,0.85)] backdrop-blur-2xl overflow-hidden cursor-pointer active:scale-[0.99] transition-all duration-300"
                >
                  {/* Apple Liquid Glass Specular Glare along upper rim */}
                  <div className="apple-specular-glare" />
                  <div className="apple-glass-edge absolute inset-0 pointer-events-none rounded-3xl" />

                  {/* Ambient Light Wash from top */}
                  <div className="absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-white/[0.06] to-transparent pointer-events-none" />

                  <div>
                    {/* Top Bar: Eyebrow, Step Counter, Status Pill */}
                    <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3 mb-3 relative z-10">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#171A25] border border-white/15 text-slate-200">
                          {project.category || 'SaaS Application'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-slate-400">
                          {stepNumber} / {totalNumber}
                        </span>
                        {(project.status || '').toLowerCase().includes('live') ? (
                          <span className="text-[10px] font-mono font-bold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-1 shadow-[0_0_8px_rgba(16,185,129,0.15)]">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span>{project.status || 'Live'}</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono font-bold text-white px-2 py-0.5 rounded-full bg-[#171A25] border border-white/20">
                            {project.status}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Visual Preview Box */}
                    {project.image ? (
                      <div className="relative h-36 w-full rounded-2xl overflow-hidden border border-white/10 shadow-inner group mb-3">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0D101A] via-transparent to-transparent opacity-60" />
                      </div>
                    ) : (
                      <div className="relative h-24 w-full rounded-2xl bg-gradient-to-br from-[#171A25] via-[#222633]/60 to-[#10131D] border border-white/10 p-3.5 flex flex-col justify-between overflow-hidden mb-3">
                        <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                          <span className="flex items-center gap-1.5 font-bold text-white">
                            <Server className="w-3.5 h-3.5 text-white" />
                            {project.eyebrow || 'Architecture Pipeline'}
                          </span>
                          <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse" />
                        </div>
                        <div className="text-[10px] font-mono text-slate-400 line-clamp-1">
                          {(project.tags || []).slice(0, 3).join(' • ')}
                        </div>
                      </div>
                    )}

                    {/* Title & Subtitle */}
                    <div className="space-y-1 mb-2 relative z-10">
                      <h4 className="text-base sm:text-lg font-bold text-white tracking-tight">
                        {project.title}
                      </h4>
                      <p className="text-xs font-mono text-slate-300 line-clamp-1">
                        {project.subtitle}
                      </p>
                    </div>

                    {/* Overview */}
                    <p className="text-xs text-slate-300 leading-relaxed font-sans line-clamp-2 mb-2 relative z-10">
                      {project.overview}
                    </p>

                    {/* Tech Tags with Brand Icons */}
                    <div className="flex flex-wrap gap-1.5 mb-2 relative z-10">
                      {(project.tags || []).slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="text-[9px] font-mono text-slate-200 bg-[#171A25] px-2 py-0.5 rounded-md border border-white/10 font-medium flex items-center gap-1"
                        >
                          <TechBrandIcon name={tag} className="w-2.5 h-2.5" />
                          <span>{tag}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Trio Footer */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between font-mono text-xs relative z-10 mt-auto">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActivePreviewProject(project);
                      }}
                      className="text-[#C6CBD6] hover:text-white font-bold flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-white/5 border border-white/10 cursor-pointer text-[11px]"
                    >
                      <Eye className="w-3.5 h-3.5 text-white" />
                      <span>Preview</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {project.demoUrl && (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="px-3 py-1 rounded-full !bg-[#2563EB] hover:!bg-[#1D4ED8] text-white font-extrabold text-[11px] transition-colors flex items-center gap-1 shadow-[0_0_12px_rgba(37,99,235,0.35)]"
                        >
                          <span>Live Demo</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 rounded-full bg-[#171A25] text-white hover:bg-white/20 transition-colors border border-white/15"
                          aria-label="GitHub Repo"
                        >
                          <FaGithub className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            }}
          />
        </div>

        {/* DESKTOP FEATURED SHOWCASE (≥ md Viewports) */}
        <div className="hidden md:block space-y-16">
          {/* Flagship Product Showcase: InCampus */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -4 }}
            data-cursor-label="FLAGSHIP"
            className="p-6 md:p-10 rounded-3xl glass-card apple-glass-edge project-card-interactive space-y-8 shadow-[0_20px_60px_rgba(0,0,0,0.85)] relative overflow-hidden transition-all duration-300"
          >
            <div className="apple-specular-glare" />

            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6 relative z-10">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono font-extrabold uppercase tracking-widest px-3 py-0.5 rounded-full bg-[#171A25] border border-[#414655] text-white flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-white" />
                    <span>{flagshipProject.eyebrow}</span>
                  </span>
                  {(flagshipProject.status || '').toLowerCase().includes('live') ? (
                    <span className="text-[11px] font-mono text-emerald-400 px-3 py-0.5 rounded-full bg-emerald-950/40 border border-emerald-500/30 font-bold flex items-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>{flagshipProject.status}</span>
                    </span>
                  ) : (
                    <span className="text-[11px] font-mono text-white px-3 py-0.5 rounded-full bg-white/10 border border-white/20 font-bold">
                      {flagshipProject.status}
                    </span>
                  )}
                </div>
                <h3 className="text-3xl sm:text-4xl font-extrabold text-white pt-1">{flagshipProject.title}</h3>
                <p className="text-slate-300 text-sm font-mono font-medium">{flagshipProject.subtitle}</p>
              </div>

              {/* 3 Action Buttons Cluster with Apple Liquid Glass */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setActiveModalProject(flagshipProject)}
                  className="px-4 py-2 rounded-full apple-glass-btn text-[#F5F6FA] font-bold text-xs hover:text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <FolderGit2 className="w-3.5 h-3.5 text-white" />
                  <span>View Details</span>
                </button>

                <button
                  onClick={() => setActivePreviewProject(flagshipProject)}
                  className="px-4 py-2 rounded-full apple-glass-btn text-slate-200 font-bold text-xs hover:text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Eye className="w-3.5 h-3.5 text-white" />
                  <span>Preview</span>
                </button>

                {flagshipProject.demoUrl && (
                  <a
                    href={flagshipProject.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-full !bg-[#2563EB] hover:!bg-[#1D4ED8] text-white font-extrabold text-xs transition-all flex items-center gap-1.5 shadow-[0_0_16px_rgba(37,99,235,0.4)] cursor-pointer"
                  >
                    <span>Live</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}

                {flagshipProject.githubUrl && (
                  <a
                    href={flagshipProject.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-full apple-glass-btn text-white font-bold text-xs hover:text-white transition-all flex items-center gap-1.5 cursor-pointer bg-[#24292E]/60 border-white/15"
                  >
                    <FaGithub className="w-3.5 h-3.5" />
                    <span>GitHub</span>
                  </a>
                )}
              </div>
            </div>

            {/* Editorial Case Study Grid */}
            <div className="grid md:grid-cols-2 gap-8 text-sm">
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold mb-1">
                    Product Overview
                  </h4>
                  <p className="text-slate-200 leading-relaxed font-medium">
                    {flagshipProject.overview}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold mb-1">
                    Core Engineering Challenge
                  </h4>
                  <p className="text-slate-300 leading-relaxed text-xs">
                    {flagshipProject.challenge}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold mb-1">
                    Architecture & Implementation
                  </h4>
                  <p className="text-slate-200 leading-relaxed text-xs">
                    {flagshipProject.approach}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold mb-2">
                  System Modules & Impact
                </h4>

                <div className="space-y-2.5">
                  {flagshipProject.architecture.map((arch, i) => (
                    <div key={i} className="p-3.5 rounded-xl bg-[#171A25] border border-[#414655] text-xs text-slate-200 font-medium shadow-sm">
                      {arch}
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex flex-wrap gap-1.5">
                  {flagshipProject.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-lg bg-[#171A25] border border-white/15 text-[11px] font-mono text-slate-200 font-medium flex items-center gap-1.5 hover:border-[#2563EB]/40 transition-colors">
                      <TechBrandIcon name={tag} className="w-3 h-3" />
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setActiveModalProject(flagshipProject)}
                    className="text-xs font-mono text-[#60A5FA] hover:text-[#93C5FD] underline transition-colors flex items-center gap-1 font-bold cursor-pointer"
                  >
                    <span>View Full InCampus Architecture Specification</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Ecosystem & Services Grid */}
          <div className="space-y-6">
            <h3 className="text-lg font-extrabold text-white font-mono uppercase tracking-wider border-l-4 border-white/60 pl-3">
              InCampus Ecosystem & Real-Time Infrastructure
            </h3>

            <div className="grid sm:grid-cols-2 gap-6">
              {ecosystemProjects.map((project, idx) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className="p-7 rounded-2xl glass-card glass-card-hover apple-glass-edge project-card-interactive flex flex-col justify-between space-y-6 relative overflow-hidden"
                >
                  <div className="apple-specular-glare" />

                  <div className="space-y-3 relative z-10">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-white px-2.5 py-0.5 rounded glass-nested-child font-extrabold">
                        {project.category}
                      </span>
                      {(project.status || '').toLowerCase().includes('live') ? (
                        <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-[0_0_8px_rgba(16,185,129,0.15)]">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>{project.status}</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-slate-300 font-semibold px-2 py-0.5 rounded-full bg-[#171A25] border border-white/10">
                          {project.status}
                        </span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-xl font-extrabold text-white">
                        {project.title}
                      </h4>
                      <p className="text-xs font-mono text-slate-200 font-medium">
                        {project.subtitle}
                      </p>
                    </div>

                    <p className="text-slate-200 text-xs leading-relaxed font-normal">
                      {project.overview}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-0.5 rounded-md glass-nested-child project-tag-pill text-[10px] font-mono text-slate-200 font-medium flex items-center gap-1.5 hover:border-white/20 transition-all duration-300"
                        >
                          <TechBrandIcon name={tag} className="w-2.5 h-2.5" />
                          <span>{tag}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Action Controls: Case Study & 3 Action Buttons [Preview] [Live] [GitHub] */}
                  <div className="pt-4 border-t border-white/10 space-y-3 font-mono text-xs relative z-10">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => setActiveModalProject(project)}
                        className="text-slate-200 hover:text-[#60A5FA] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <span>Case Study</span>
                        <span>→</span>
                      </button>

                      {/* Action Trio */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setActivePreviewProject(project)}
                          className="px-2.5 py-1 rounded-full apple-glass-btn text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3 h-3 text-white" />
                          <span>Preview</span>
                        </button>

                        {project.demoUrl && (
                          <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2.5 py-1 rounded-full !bg-[#2563EB] hover:!bg-[#1D4ED8] text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer shadow-[0_0_12px_rgba(37,99,235,0.35)]"
                          >
                            <span>Live</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}

                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-full apple-glass-btn text-white hover:text-white transition-all cursor-pointer bg-[#24292E]/60 border-white/15"
                            aria-label="GitHub Repo"
                          >
                            <FaGithub className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Learning Projects Subsection */}
          <div className="space-y-4 pt-6 border-t border-white/10">
            <h3 className="text-sm font-bold text-slate-200 font-mono uppercase tracking-wider">
              Learning Projects & UI Exercises
            </h3>

            <div className="grid sm:grid-cols-2 gap-4">
              {learningProjects.map((lp) => (
                <div
                  key={lp.id}
                  className="p-4 rounded-xl glass-card glass-card-hover apple-glass-edge project-card-interactive flex items-center justify-between gap-4 font-mono text-xs relative overflow-hidden"
                >
                  <div className="apple-specular-glare" />

                  <div className="space-y-1 relative z-10">
                    <div className="text-sm font-bold text-white">{lp.title}</div>
                    <div className="text-xs text-slate-200 font-medium">{lp.subtitle}</div>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {lp.tags.map((t) => (
                        <span key={t} className="text-[10px] font-mono text-slate-200 glass-nested-child px-2 py-0.5 rounded flex items-center gap-1">
                          <TechBrandIcon name={t} className="w-2.5 h-2.5" />
                          <span>{t}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 relative z-10">
                    <button
                      onClick={() => setActivePreviewProject(lp)}
                      className="px-3 py-1.5 rounded-full apple-glass-btn text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3 h-3 text-white" />
                      <span>Preview</span>
                    </button>

                    <a
                      href={lp.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-full !bg-[#2563EB] hover:!bg-[#1D4ED8] text-white transition-colors cursor-pointer shadow-[0_0_10px_rgba(37,99,235,0.3)]"
                      aria-label="Live Demo"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Full Architecture Case Study Modal */}
      <ProjectModal
        project={activeModalProject}
        isOpen={!!activeModalProject}
        onClose={() => setActiveModalProject(null)}
      />

      {/* Live Browser Window Preview Modal */}
      <LivePreviewModal
        project={activePreviewProject}
        isOpen={!!activePreviewProject}
        onClose={() => setActivePreviewProject(null)}
      />
    </section>
  );
}
