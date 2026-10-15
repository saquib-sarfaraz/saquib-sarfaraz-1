import { ArrowUp, Terminal, Film } from 'lucide-react';
import { profileData } from '../content/profile';

export default function Footer({ onOpenInCampusInBuzz, onOpenInCampusReels }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-16 px-4 sm:px-6 bg-[#080A12] border-t border-[#171A25] relative text-left">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Mission Statement Box */}
        <div className="p-6 md:p-8 rounded-3xl apple-glass-pill apple-glass-edge space-y-4 text-center shadow-xl relative overflow-hidden">
          <div className="apple-specular-glare" />

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full apple-glass-btn text-xs font-mono text-white relative z-10">
            <Terminal className="w-3.5 h-3.5 text-white" />
            <span>Developer Philosophy & Mission</span>
          </div>

          <p className="text-slate-100 text-sm md:text-base leading-relaxed max-w-2xl mx-auto italic font-serif relative z-10">
            "Thanks for exploring my engineering journey. Every project here represents curiosity, problem solving, and continuous improvement. Let's build something meaningful."
          </p>

          <div className="text-xs font-mono text-slate-400 relative z-10">
            {profileData.name} • Full Stack Developer
          </div>
        </div>

        {/* Links & Production Copyright */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#222633] text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
            <span>© {new Date().getFullYear()} {profileData.name} • {profileData.osName} {profileData.osVersion}</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onOpenInCampusInBuzz || onOpenInCampusReels}
              className="hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1.5 focus:outline-none"
              title="Watch InCampus InBuzz"
            >
              <Film className="w-3.5 h-3.5 text-emerald-400" />
              <span>InCampus InBuzz</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30">
                Live
              </span>
            </button>

            <a
              href={profileData.socials.github}
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors"
            >
              GitHub
            </a>
            <a
              href={profileData.socials.linkedin}
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors"
            >
              LinkedIn
            </a>
            <a
              href={profileData.socials.instagram}
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors"
            >
              Instagram
            </a>

            <button
              onClick={scrollToTop}
              className="p-2 rounded-full apple-glass-btn text-slate-300 hover:text-white transition-all ml-2"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
